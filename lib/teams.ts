// lib/teams.ts
import { sql } from "@/lib/db"

/**
 * Public Team shape used across the app.
 * - account_id is the internal DB account id (INTEGER)
 * - member_count is DERIVED ONLY (never stored in DB)
 */
export interface Team {
  account_id: number
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
 * List all teams for an *internal* account id (INTEGER).
 * No joins; returns exactly the DB contents.
 */
export async function listTeams(accountId: number): Promise<Team[]> {
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
    WHERE account_id = ${accountId}::int
    ORDER BY name;
  `
  return rows.map((r: any) => ({
    account_id: Number(r.account_id),
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    color: r.color ?? null,
    icon: r.icon ?? null,
    default_template: r.default_template ?? null,
    product_grant_ids: (r.product_grant_ids ?? []) as string[],
    demographics: (r.demographics ?? {}) as Record<string, unknown>,
    created_at: r.created_at as string | undefined,
    updated_at: r.updated_at as string | undefined,
  }))
}

/** Fetch a single team by UUID id for an *internal* account id (INTEGER). */
export async function getTeam(accountId: number, id: string): Promise<Team | null> {
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
    WHERE account_id = ${accountId}::int AND id = ${id}
    LIMIT 1;
  `
  if (rows.length === 0) return null
  const r: any = rows[0]
  return {
    account_id: Number(r.account_id),
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    color: r.color ?? null,
    icon: r.icon ?? null,
    default_template: r.default_template ?? null,
    product_grant_ids: (r.product_grant_ids ?? []) as string[],
    demographics: (r.demographics ?? {}) as Record<string, unknown>,
    created_at: r.created_at as string | undefined,
    updated_at: r.updated_at as string | undefined,
  }
}

/**
 * Upsert a team using (account_id, slug) as the natural key.
 * - INSERT does not provide `id` (DB generates UUID).
 * - product_grant_ids stored as TEXT[] (no uuid[] cast).
 * - demographics stored as JSONB.
 */
export async function saveTeam(
  accountId: number,
  t: {
    slug: string
    name: string
    color?: string | null
    icon?: string | null
    default_template?: string | null
    product_grant_ids?: string[]
    demographics?: Record<string, unknown>
  }
) {
  const slug = t.slug
  const name = t.name

  const color = t.color ?? null
  const icon = t.icon ?? null
  const defaultTemplate = t.default_template ?? null
  const grantIds = (t.product_grant_ids ?? []) as string[]
  const demographics = t.demographics ?? {}

  const pgArrayLiteral = toPgTextArrayLiteral(grantIds)

  await sql/* sql */`
    INSERT INTO teams (
      account_id, slug, name, color, icon,
      default_template, product_grant_ids, demographics
    )
    VALUES (
      ${accountId}::int,
      ${slug},
      ${name},
      ${color},
      ${icon},
      ${defaultTemplate},
      ${pgArrayLiteral}::text[],
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
      updated_at        = now();
  `
}

/** Delete a team by UUID id for an *internal* account id (INTEGER). */
export async function deleteTeam(accountId: number, id: string) {
  await sql/* sql */`
    DELETE FROM teams
    WHERE account_id = ${accountId}::int AND id = ${id};
  `
}
