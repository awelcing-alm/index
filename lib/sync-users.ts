// lib/sync-users.ts
import "server-only"
import { sql } from "@/lib/db"
import { adminApiCall } from "@/lib/api-client"

/**
 * Result shape returned to /api/sync/users
 */
export type SyncResult = {
  total: number
  created: number
  updated: number
  skipped: number
  upserted: number
  linkedToGroups: number
}

type ZephrAccountUser = {
  user_id?: string
  user_email?: string
  attributes?: Record<string, any>
  // sometimes the API returns these at different shapes; keep it loose
  identifiers?: { email_address?: string }
}

const slugify = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

/**
 * Safely pull a stored "group" value from a Zephr user payload.
 */
function getRawGroupValue(u: ZephrAccountUser): string | null {
  const a = (u?.attributes ?? {}) as any
  const cands: unknown[] = [
    a.group,
    a.Group,
    a["group-name"],
    a["group_name"],
    a["group-id"],
    a["group_id"],
    a["group-slug"],
    a["group_slug"],
  ]
  for (const c of cands) {
    if (!c) continue
    if (typeof c === "string") return c.trim()
    if (typeof c === "object" && c && "value" in c && typeof (c as any).value === "string") {
      return (c as any).value.trim()
    }
  }
  return null
}

/**
 * Attempt to compute last_login using /v3/users/{id}/sessions
 * Returns ISO string or null.
 */
async function fetchLastLogin(userId: string): Promise<string | null> {
  try {
    const res = await adminApiCall(`/v3/users/${encodeURIComponent(userId)}/sessions`)
    const sessions: any[] = Array.isArray(res?.sessions) ? res.sessions : []
    if (!sessions.length) return null
    // prefer startDate; fall back to expiryDate
    let latest: number | null = null
    for (const s of sessions) {
      const d = s?.startDate || s?.expiryDate
      const t = d ? Date.parse(d) : NaN
      if (!Number.isFinite(t)) continue
      latest = latest == null ? t : Math.max(latest, t)
    }
    return latest ? new Date(latest).toISOString() : null
  } catch {
    return null
  }
}

/**
 * Sync all account users from Zephr into local Postgres users.
 * - Resolves group by name/slug → writes users.group_id (uuid)
 * - Populates last_login (best-effort) and last_synced_at
 * - Avoids uuid/text comparison errors by casting DB columns to text in WHERE clauses
 */
export async function syncUsersForAccount(accountId: string, p0: { includeSessions: boolean; concurrency: number }): Promise<SyncResult> {
  // 1) Resolve internal account id (integer) for users.account_id
  const acctQ = await sql/* sql */`
    SELECT id
    FROM accounts
    WHERE id::text = ${accountId} OR (CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name='accounts' AND column_name='external_id'
    ) THEN external_id::text = ${accountId} ELSE FALSE END)
    LIMIT 1;
  `
  const internalAccountId: number | null = acctQ.rows?.[0]?.id ?? null

  // 2) Load groups for this account and build lookups
  const groupsQ = await sql/* sql */`
    SELECT id::text AS id, slug, name
    FROM groups
    WHERE account_id::text = ${accountId}
  `
  const groups = groupsQ.rows as Array<{ id: string; slug: string; name: string }>
  const bySlug = new Map(groups.map((g) => [String(g.slug || "").toLowerCase(), g]))
  const byName = new Map(groups.map((g) => [String(g.name || "").toLowerCase(), g]))
  const bySlugifiedName = new Map(groups.map((g) => [slugify(String(g.name || "")), g]))

  const resolveGroupId = (raw: string | null): string | null => {
    if (!raw) return null
    const v = raw.toLowerCase()
    if (bySlug.has(v)) return bySlug.get(v)!.id
    if (byName.has(v)) return byName.get(v)!.id
    const s = slugify(raw)
    if (bySlug.has(s)) return bySlug.get(s)!.id
    if (bySlugifiedName.has(s)) return bySlugifiedName.get(s)!.id
    return null
  }

  // 3) Fetch Zephr account users
  const apiRes = await adminApiCall(`/v3/accounts/${encodeURIComponent(accountId)}/users`)
  const zephrUsers: ZephrAccountUser[] = Array.isArray(apiRes?.results)
    ? apiRes.results
    : Array.isArray(apiRes)
    ? apiRes
    : Array.isArray(apiRes?.data)
    ? apiRes.data
    : []

  let created = 0
  let updated = 0
  let skipped = 0
  let linkedToGroups = 0

  // 4) Upsert each user locally
  for (const u of zephrUsers) {
    const externalId = String(u.user_id || "").trim()
    const email =
      u.user_email ||
      u.identifiers?.email_address ||
      (externalId ? `${externalId}@unknown.com` : null)

    if (!externalId || !email) {
      skipped++
      continue
    }

    const attrs = u.attributes || {}
    const first = (attrs.firstname || attrs.first_name || "").toString().trim() || null
    const last =
      (attrs.lastname || attrs.surname || attrs.last_name || "").toString().trim() || null

    // resolve group_id from Zephr attributes.group
    const rawGroup = getRawGroupValue(u)
    const resolvedGroupId = resolveGroupId(rawGroup)

    // fetch last_login (best effort; non-blocking failure)
    const lastLoginIso = await fetchLastLogin(externalId)

    // Build a single UPSERT. We:
    // - always cast group_id param to ::uuid (NULL::uuid is allowed)
    // - set account_id to internalAccountId (if available)
    // - set last_synced_at = now()
    const {
      rows: [row],
    } = await sql/* sql */`
      INSERT INTO users (
        external_id,
        account_id,
        email,
        firstname,
        lastname,
        attributes,
        group_id,
        last_login,
        last_synced_at,
        updated_at
      )
      VALUES (
        ${externalId},
        ${internalAccountId},
        ${email},
        ${first},
        ${last},
        ${JSON.stringify(attrs)}::jsonb,
        ${resolvedGroupId}::uuid,
        ${lastLoginIso},
        now(),
        now()
      )
      ON CONFLICT (external_id) DO UPDATE
      SET
        email          = EXCLUDED.email,
        firstname      = EXCLUDED.firstname,
        lastname       = EXCLUDED.lastname,
        attributes     = EXCLUDED.attributes,
        group_id       = EXCLUDED.group_id,
        last_login     = COALESCE(EXCLUDED.last_login, users.last_login),
        last_synced_at = now(),
        updated_at     = now()
      RETURNING
        (xmax = 0) AS inserted,
        group_id IS NOT NULL AS has_group;
    `

    if (row?.inserted === true) created++
    else updated++

    if (row?.has_group === true) linkedToGroups++
  }

  const total = zephrUsers.length
  const upserted = created + updated

  return { total, created, updated, skipped, upserted, linkedToGroups }
}
