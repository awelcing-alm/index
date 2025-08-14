// lib/groups.ts
import { sql } from "@/lib/db"

/**
 * Public Group shape used across the app.
 * NOTE: account_id/id are TEXT in the DB.
 */
export interface Group {
  account_id: string
  id: string
  slug: string
  name: string
  color: string | null
  icon: string | null
  default_template: string | null
  product_grant_ids: string[]
  demographics: Record<string, unknown>
  user_count: number
  created_at?: string
  updated_at?: string
}

/** Allow callers (e.g., withRlsTx) to pass a transaction-bound client. */
type Queryable = typeof sql

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

/** Build a safe Postgres text[] literal: '{"a","b"}' */
function toPgTextArrayLiteral(arr: string[]): string {
  const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `{${arr.map((v) => `"${esc(v)}"`).join(",")}}`
}

/**
 * List all groups. Two modes:
 *  - pass accountId  → explicit filter (and also enforced by RLS)
 *  - omit accountId  → rely on RLS (session must set app.account_id/app.role)
 */
export async function listGroups(accountId?: string, q: Queryable = sql): Promise<Group[]> {
  if (accountId) {
    const { rows } = await q/* sql */`
      SELECT
        account_id,
        id,
        slug,
        name,
        color,
        icon,
        default_template,
        COALESCE(product_grant_ids, '{}')    AS product_grant_ids,
        COALESCE(demographics, '{}'::jsonb)  AS demographics,
        COALESCE(user_count, 0)              AS user_count,
        created_at,
        updated_at
      FROM groups
      WHERE account_id = ${accountId}::text
      ORDER BY name;
    `
    return rows as unknown as Group[]
  }

  // RLS-only path (expects set_config('app.account_id', ...), etc.)
  const { rows } = await q/* sql */`
    SELECT
      account_id,
      id,
      slug,
      name,
      color,
      icon,
      default_template,
      COALESCE(product_grant_ids, '{}')    AS product_grant_ids,
      COALESCE(demographics, '{}'::jsonb)  AS demographics,
      COALESCE(user_count, 0)              AS user_count,
      created_at,
      updated_at
    FROM groups
    ORDER BY name;
  `
  return rows as unknown as Group[]
}

/**
 * Upsert a group by (account_id, slug).
 * - If slug is omitted, it is derived from name.
 * - Returns the saved row.
 */
export async function saveGroup(
  accountId: string,
  input: Partial<Group> & { name: string; slug?: string },
  q: Queryable = sql
): Promise<Group> {
  const name = input.name.trim()
  if (!name) throw new Error("name is required")

  const slug = input.slug?.trim() || slugify(name)
  const color = input.color ?? null
  const icon = input.icon ?? null
  const defaultTemplate = input.default_template ?? null
  const grants = (input.product_grant_ids ?? []) as string[]
  const demographics = input.demographics ?? {}

  const grantArray = toPgTextArrayLiteral(grants)

  const { rows } = await q/* sql */`
    INSERT INTO groups (
      account_id, slug, name, color, icon, default_template, product_grant_ids, demographics
    )
    VALUES (
      ${accountId}::text,
      ${slug},
      ${name},
      ${color},
      ${icon},
      ${defaultTemplate},
      ${grantArray}::text[],
      ${JSON.stringify(demographics)}::jsonb
    )
    ON CONFLICT (account_id, slug) DO UPDATE
    SET
      name              = EXCLUDED.name,
      color             = EXCLUDED.color,
      icon              = EXCLUDED.icon,
      default_template  = EXCLUDED.default_template,
      product_grant_ids = EXCLUDED.product_grant_ids,
      demographics      = EXCLUDED.demographics,
      updated_at        = now()
    RETURNING
      account_id,
      id,
      slug,
      name,
      color,
      icon,
      default_template,
      product_grant_ids,
      demographics,
      COALESCE(user_count, 0) AS user_count,
      created_at,
      updated_at;
  `

  return rows[0] as unknown as Group
}

/** Delete a group by id OR slug for the given account. */
export async function deleteGroup(
  accountId: string,
  by: { id?: string; slug?: string },
  q: Queryable = sql
): Promise<void> {
  if (by.id) {
    await q/* sql */`
      DELETE FROM groups
      WHERE account_id = ${accountId}::text AND id = ${by.id}::text;
    `
    return
  }
  if (by.slug) {
    await q/* sql */`
      DELETE FROM groups
      WHERE account_id = ${accountId}::text AND slug = ${by.slug};
    `
    return
  }
  throw new Error("id or slug is required")
}

/** Counter deltas to apply to groups.user_count */
export type GroupCountChange = { id: string; delta: number }

/**
 * Atomically apply membership deltas, e.g.
 *   applyGroupCountDeltas("acct-text", [{ id: "group-uuid", delta: +10 }, ...])
 * Safe with RLS enabled (relies on both RLS and explicit account filter).
 */
export async function applyGroupCountDeltas(
  accountId: string,
  changes: GroupCountChange[],
  q: Queryable = sql
): Promise<void> {
  const clean = (changes || [])
    .map((c) => ({ id: String(c?.id || ""), delta: Number(c?.delta) }))
    .filter((c) => c.id && Number.isFinite(c.delta) && c.delta !== 0)

  if (!clean.length) return

  await q/* sql */`BEGIN`
  try {
    for (const { id, delta } of clean) {
      await q/* sql */`
        UPDATE groups
           SET user_count = GREATEST(0, COALESCE(user_count, 0) + ${delta})
         WHERE account_id = ${accountId}::text
           AND id = ${id}::text;
      `
    }
    await q/* sql */`COMMIT`
  } catch (e) {
    await q/* sql */`ROLLBACK`
    throw e
  }
}
