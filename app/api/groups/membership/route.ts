// app/api/groups/membership/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth-actions"
import { sql } from "@/lib/db"
import crypto from "crypto"

/* --------------------------------- tuning --------------------------------- */

// Keep responses small & predictable
const MAX_USER_IDS = 200

// Internal microcache to absorb bursts on a single edge/runtime instance.
// NOTE: This helps even if callers use `cache: "no-store"`.
type MemoEntry = {
  body: string
  etag: string
  expiry: number
}
const MEMO_TTL_MS = 10_000
const MEMO_MAX = 500
const memo = new Map<string, MemoEntry>()

function memoGet(key: string): MemoEntry | null {
  const hit = memo.get(key)
  if (!hit) return null
  if (Date.now() > hit.expiry) {
    memo.delete(key)
    return null
  }
  return hit
}
function memoSet(key: string, val: MemoEntry) {
  if (memo.size >= MEMO_MAX) {
    // simple LRU-ish eviction: remove first key
    const first = memo.keys().next().value
    if (first) memo.delete(first)
  }
  memo.set(key, val)
}

/* ------------------------------- utilities -------------------------------- */

type Assignment = { user_id: string; group_id: string }
type Change = { id: string; delta: number }

type Body = {
  accountId?: string // ignored in SQL comparisons to avoid uuid/text mismatch
  assignments?: Assignment[]
  changes?: Change[]
}

function toPgTextArrayLiteral(arr: string[]): string {
  const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `{${arr.map((v) => `"${esc(v)}"`).join(",")}}`
}

function normalizeIds(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  ).sort()
}

function makeEtag(accountId: string, json: string) {
  const h = crypto.createHash("sha1").update(accountId).update("|").update(json).digest("base64")
  return `"gmem-${h}"`
}

function isNoStore(req: Request) {
  const cc = req.headers.get("cache-control")?.toLowerCase() || ""
  return cc.includes("no-store")
}

/* ---------------------------------- GET ----------------------------------- */
/**
 * GET /api/groups/membership?user_ids=U1,U2,U3[&account=<id>]
 * Returns a map of user_external_id -> { group_id, name, icon } for the active account.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    }
    if (!session.isAdmin) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }

    const url = new URL(req.url)
    const userIds = normalizeIds(url.searchParams.get("user_ids") || "")
    const requestedAccountParam = url.searchParams.get("account") || ""

    const accountId =
      (session.activeAccount as any)?.account_id ??
      (session.activeAccount as any)?.id ??
      ""

    if (!accountId) {
      return NextResponse.json({ ok: false, error: "No active account" }, { status: 400 })
    }

    // Canonicalize URL (stable cache key: sorted IDs + explicit account)
    const canonicalIds = userIds.join(",")
    const needsCanonicalRedirect =
      (url.searchParams.get("user_ids") ?? "") !== canonicalIds ||
      requestedAccountParam !== accountId

    // If the client isn't forcing no-store, converge on the canonical URL with a cheap redirect
    if (needsCanonicalRedirect && !isNoStore(req)) {
      const canonical = new URL(url)
      if (canonicalIds) canonical.searchParams.set("user_ids", canonicalIds)
      else canonical.searchParams.delete("user_ids")
      canonical.searchParams.set("account", accountId)
      return NextResponse.redirect(canonical, 307)
    }

    if (userIds.length === 0) {
      const empty = { ok: true, memberships: {} as Record<string, never> }
      const res = NextResponse.json(empty)
      // Shared cache allowed; keep browser TTL tiny to avoid UI refetch storms
      res.headers.set("Cache-Control", "public, max-age=5, s-maxage=60, stale-while-revalidate=300")
      res.headers.set("Vary", "Accept, Cookie")
      return res
    }

    if (userIds.length > MAX_USER_IDS) {
      return NextResponse.json(
        { ok: false, error: `Too many user_ids (max ${MAX_USER_IDS})` },
        { status: 400 },
      )
    }

    // Internal microcache key (per-account + sorted IDs)
    const memoKey = `${accountId}|${canonicalIds}`
    const cached = memoGet(memoKey)
    const ifNoneMatch = req.headers.get("if-none-match")

    if (cached) {
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        // Fast 304 when the browser/CDN revalidates
        const notModified = new NextResponse(null, { status: 304 })
        notModified.headers.set("ETag", cached.etag)
        notModified.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
        notModified.headers.set("Vary", "Accept, Cookie")
        return notModified
      }
      const res = new NextResponse(cached.body, {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      })
      res.headers.set("ETag", cached.etag)
      res.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
      res.headers.set("Vary", "Accept, Cookie")
      return res
    }

    // DB fetch
    const arrLiteral = toPgTextArrayLiteral(userIds)
    const { rows } = await sql/* sql */`
      SELECT
        gm.user_external_id,
        gm.group_id::text AS group_id,
        g.name,
        g.icon
      FROM public.group_memberships gm
      JOIN public.groups g ON g.id = gm.group_id
      WHERE gm.account_id = ${accountId}
        AND gm.user_external_id = ANY(${arrLiteral}::text[])
    `

    const memberships: Record<string, { group_id: string; name: string | null; icon: string | null }> = {}
    for (const r of rows as any[]) {
      memberships[r.user_external_id] = {
        group_id: r.group_id,
        name: r.name ?? null,
        icon: r.icon ?? null,
      }
    }

    const payload = { ok: true, memberships }
    const json = JSON.stringify(payload)
    const etag = makeEtag(accountId, json)

    // Populate microcache
    memoSet(memoKey, { body: json, etag, expiry: Date.now() + MEMO_TTL_MS })

    if (ifNoneMatch && ifNoneMatch === etag) {
      const notModified = new NextResponse(null, { status: 304 })
      notModified.headers.set("ETag", etag)
      notModified.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
      notModified.headers.set("Vary", "Accept, Cookie")
      return notModified
    }

    const res = new NextResponse(json, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    })
    res.headers.set("ETag", etag)
    res.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
    // Vary on Cookie because authorization/session is cookie-based; prevents cross-user leaks
    res.headers.set("Vary", "Accept, Cookie")
    return res
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load memberships" },
      { status: 500 },
    )
  }
}

/* ---------------------------------- POST ---------------------------------- */
/** POST (write): persists group assignments and (optionally) count deltas. */
export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    }
    if (!session.isAdmin) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as Body
    const assignmentsIn = Array.isArray(body.assignments) ? body.assignments : []
    const changesIn = Array.isArray(body.changes) ? body.changes : []

    if (assignmentsIn.length === 0 && changesIn.length === 0) {
      return NextResponse.json(
        { ok: false, error: "changes must be a non-empty array" },
        { status: 400 },
      )
    }

    // Resolve each group_id -> account_id (TEXT) via one batched query
    const groupIdSet = new Set<string>()
    for (const a of assignmentsIn) if (a?.group_id) groupIdSet.add(String(a.group_id))
    for (const c of changesIn) if (c?.id) groupIdSet.add(String(c.id))
    const groupIds = [...groupIdSet]

    const accountByGroup = new Map<string, string>()
    if (groupIds.length) {
      const { rows } = await sql/* sql */`
        SELECT id::text AS id, account_id::text AS account_id
        FROM public.groups
        WHERE id = ANY(${toPgTextArrayLiteral(groupIds)}::uuid[])
      `
      for (const r of rows as any[]) accountByGroup.set(r.id, r.account_id)
    }

    await sql/* sql */`BEGIN`

    // Apply assignments (dedup by user_id; last write wins)
    const lastAssignmentByUser = new Map<string, string>() // user_id -> group_id
    for (const a of assignmentsIn) {
      const gid = String(a?.group_id ?? "")
      const uid = String(a?.user_id ?? "")
      if (!gid || !uid) continue
      const acct = accountByGroup.get(gid)
      if (!acct) continue
      lastAssignmentByUser.set(uid, gid)
    }

    for (const [uid, gid] of lastAssignmentByUser) {
      await sql/* sql */`
        INSERT INTO public.group_memberships (account_id, group_id, user_external_id, assigned_at)
        SELECT account_id, ${gid}::uuid, ${uid}, now()
        FROM public.groups
        WHERE id = ${gid}::uuid
        ON CONFLICT (account_id, user_external_id)
        DO UPDATE SET group_id = EXCLUDED.group_id, assigned_at = now()
      `

      await sql/* sql */`
        UPDATE public.users
        SET group_id = ${gid}::uuid,
            updated_at = now()
        WHERE external_id = ${uid}
      `
    }

    // Consolidate and apply count deltas
    const consolidated = new Map<string, number>() // group_id -> sum(delta)
    for (const c of changesIn) {
      const id = String(c?.id ?? "")
      const d = Number(c?.delta)
      if (!id || !Number.isFinite(d) || d === 0) continue
      consolidated.set(id, (consolidated.get(id) ?? 0) + d)
    }

    for (const [id, delta] of consolidated) {
      await sql/* sql */`
        UPDATE public.groups
        SET user_count = GREATEST(0, COALESCE(user_count, 0) + ${delta})
        WHERE id = ${id}::uuid
      `
    }

    await sql/* sql */`COMMIT`

    const deltas = Object.fromEntries(consolidated.entries())

    // Bust microcache entries that might be impacted (best-effort)
    // We don't know which user_ids are on current pages, so just clear entirely if we touched anything.
    if (lastAssignmentByUser.size > 0 || consolidated.size > 0) {
      memo.clear()
    }

    return NextResponse.json({ ok: true, deltas })
  } catch (err: any) {
    try {
      await sql/* sql */`ROLLBACK`
    } catch {}
    const msg = err?.message || "Failed to persist membership"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
