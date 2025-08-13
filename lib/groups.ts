// lib/groups.ts
import { sql } from "@/lib/db"

// Public Group shape used across the app.
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

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

/** Build a safe Postgres text[] literal: '{"a","b"}' */
function toPgTextArrayLiteral(arr: string[]): string {
  const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `{${arr.map((v) => `"${esc(v)}"`).join(",")}}`
}

/** List all groups for a Zephr account_id (string). */
export async function listGroups(accountId: string): Promise<Group[]> {
  const { rows } = await sql/* sql */`
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
    WHERE account_id = ${accountId}
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
  input: Partial<Group> & { name: string; slug?: string }
): Promise<Group> {
  const name = input.name.trim()
  if (!name) throw new Error("name is required")

  const slug = (input.slug?.trim() || slugify(name))
  const color = input.color ?? null
  const icon = input.icon ?? null
  const defaultTemplate = input.default_template ?? null
  const grants = (input.product_grant_ids ?? []) as string[]
  const demographics = input.demographics ?? {}

  const grantArray = toPgTextArrayLiteral(grants)

  const { rows } = await sql/* sql */`
    INSERT INTO groups (
      account_id, slug, name, color, icon, default_template, product_grant_ids, demographics
    )
    VALUES (
      ${accountId},
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
      account_id, id, slug, name, color, icon, default_template,
      product_grant_ids, demographics, COALESCE(user_count, 0) AS user_count,
      created_at, updated_at;
  `

  return rows[0] as unknown as Group
}

/** Delete a group by id OR slug for the given account. */
export async function deleteGroup(accountId: string, by: { id?: string; slug?: string }) {
  if (by.id) {
    await sql/* sql */`
      DELETE FROM groups
      WHERE account_id = ${accountId} AND id = ${by.id}::uuid;
    `
    return
  }
  if (by.slug) {
    await sql/* sql */`
      DELETE FROM groups
      WHERE account_id = ${accountId} AND slug = ${by.slug};
    `
    return
  }
  throw new Error("id or slug is required")
}

/** Counter deltas to apply to groups.user_count */
export type GroupCountChange = { id: string; delta: number }

/**
 * Atomically apply membership deltas, e.g.
 *  applyGroupCountDeltas("acct-123", [{id: "...g1", delta:+10}, {id: "...g2", delta:-10}])
 */
export async function applyGroupCountDeltas(
  accountId: string,
  changes: GroupCountChange[]
): Promise<void> {
  const clean = (changes || [])
    .map((c) => ({ id: String(c?.id || ""), delta: Number(c?.delta) }))
    .filter((c) => c.id && Number.isFinite(c.delta) && c.delta !== 0)

  if (!clean.length) return

  await sql/* sql */`BEGIN`
  try {
    for (const { id, delta } of clean) {
      await sql/* sql */`
        UPDATE groups
           SET user_count = GREATEST(0, COALESCE(user_count, 0) + ${delta})
         WHERE account_id = ${accountId}
           AND id = ${id}::uuid;
      `
    }
    await sql/* sql */`COMMIT`
  } catch (e) {
    await sql/* sql */`ROLLBACK`
    throw e
  }
}
