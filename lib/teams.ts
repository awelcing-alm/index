// lib/teams.ts
import { sql } from "@/lib/db"
/**
 * Public Team shape used across the app.
 * Keep member_count DERIVED ONLY (never stored in DB).
 */
export interface Team {
  account_id: string
  id: string
  slug: string
  name: string
  color: string | null
  icon: string | null
  default_template: string | null
  product_grant_ids: string[]
  demographics: Record<string, unknown>
  created_at?: string
  updated_at?: string
  member_count?: number
}

/** Build a safe Postgres text[] literal: '{"a","b"}' */
function toPgTextArrayLiteral(arr: string[]): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `{${arr.map((v) => `"${esc(v)}"`).join(",")}}`
}

/**
 * List all teams for an account. No joins; return exactly the DB contents.
 */
export async function listTeams(accountId: string): Promise<Team[]> {
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
      created_at,
      updated_at
    FROM teams
    WHERE account_id = ${accountId}
    ORDER BY name;
  `
  return rows.map((r: any) => ({
    account_id: r.account_id,
    id: r.id,
    slug: r.slug,
    name: r.name,
    color: r.color,
    icon: r.icon,
    default_template: r.default_template ?? null,
    product_grant_ids: (r.product_grant_ids ?? []) as string[],
    demographics: (r.demographics ?? {}) as Record<string, unknown>,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }))
}

/** Fetch a single team by id. */
export async function getTeam(accountId: string, id: string): Promise<Team | null> {
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
      created_at,
      updated_at
    FROM teams
    WHERE account_id = ${accountId} AND id = ${id}
    LIMIT 1;
  `
  if (rows.length === 0) return null
  const r: any = rows[0]
  return {
    account_id: r.account_id,
    id: r.id,
    slug: r.slug,
    name: r.name,
    color: r.color,
    icon: r.icon,
    default_template: r.default_template ?? null,
    product_grant_ids: (r.product_grant_ids ?? []) as string[],
    demographics: (r.demographics ?? {}) as Record<string, unknown>,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }
}

/**
 * Upsert a team.
 * - Uses a text[] literal for product_grant_ids (compatible with older @vercel/postgres)
 * - JSONB demographics via explicit ::jsonb cast
 */
export async function saveTeam(accountId: string, t: Partial<Team> & { id: string; name: string }) {
  const id = t.id
  const slug = t.slug ?? id
  const name = t.name

  const color = t.color ?? null
  const icon = t.icon ?? null
  const defaultTemplate = t.default_template ?? null
  const grantIds = (t.product_grant_ids ?? []) as string[]
  const demographics = t.demographics ?? {}

  // Build a Postgres array literal string safely
  const pgArrayLiteral = toPgTextArrayLiteral(grantIds)

  await sql/* sql */`
    INSERT INTO teams (
      account_id, id, slug, name, color, icon,
      default_template, product_grant_ids, demographics
    )
    VALUES (
      ${accountId},
      ${id},
      ${slug},
      ${name},
      ${color},
      ${icon},
      ${defaultTemplate},
      ${pgArrayLiteral}::text[],                 -- change to ::uuid[] if your column is uuid[]
      ${JSON.stringify(demographics)}::jsonb
    )
    ON CONFLICT (account_id, id) DO UPDATE
    SET
      slug              = EXCLUDED.slug,
      name              = EXCLUDED.name,
      color             = EXCLUDED.color,
      icon              = EXCLUDED.icon,
      default_template  = EXCLUDED.default_template,
      product_grant_ids = EXCLUDED.product_grant_ids,
      demographics      = EXCLUDED.demographics,
      updated_at        = now();
  `
}

/** Delete a team by id. */
export async function deleteTeam(accountId: string, id: string) {
  await sql/* sql */`
    DELETE FROM teams
    WHERE account_id = ${accountId} AND id = ${id};
  `
}
