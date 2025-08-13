// lib/teams.ts
import { sql } from "@/lib/db"

/**
 * Public Team shape used across the app.
 * Keep member_count DERIVED ONLY (never stored in DB).
 */
export interface Team {
  account_id: number
  id: string            // uuid
  slug: string
  name: string
  color: string | null
  icon: string | null
  default_template: string | null
  product_grant_ids: string[]       // TEXT[]
  demographics: Record<string, unknown> // JSONB
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
    WHERE account_id = ${accountId}
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
    created_at: r.created_at ?? undefined,
    updated_at: r.updated_at ?? undefined,
  }))
}

/** Fetch a single team by id. */
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
    WHERE account_id = ${accountId} AND id = ${id}
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
    created_at: r.created_at ?? undefined,
    updated_at: r.updated_at ?? undefined,
  }
}

/**
 * Upsert a team.
 * - If `t.id` is omitted, we *omit the id column* so Postgres uses DEFAULT (gen_random_uuid()).
 * - Upsert key: (account_id, slug) so client-generated ids are irrelevant.
 * - product_grant_ids is TEXT[]; demographics is JSONB.
 */
export async function saveTeam(
  accountId: number,
  t: Partial<Team> & { slug: string; name: string }
): Promise<Team> {
  const color = t.color ?? null
  const icon = t.icon ?? null
  const defaultTemplate = t.default_template ?? null
  const grantIds = (t.product_grant_ids ?? []) as string[]
  const demographics = t.demographics ?? {}
  const slug = t.slug
  const name = t.name

  // Build a Postgres array literal string safely for TEXT[]
  const pgArrayLiteral = toPgTextArrayLiteral(grantIds)

  if (t.id) {
    // Explicit id provided (must be a uuid). We include the column.
    const { rows } = await sql/* sql */`
      INSERT INTO teams (
        account_id, id, slug, name, color, icon,
        default_template, product_grant_ids, demographics
      )
      VALUES (
        ${accountId},
        ${t.id},
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
        updated_at        = now()
      RETURNING
        account_id, id, slug, name, color, icon, default_template,
        COALESCE(product_grant_ids, '{}') AS product_grant_ids,
        COALESCE(demographics, '{}'::jsonb) AS demographics,
        created_at, updated_at;
    `
    return rows[0] as unknown as Team
  } else {
    // No id provided: omit the id column so DEFAULT (gen_random_uuid()) is used
    const { rows } = await sql/* sql */`
      INSERT INTO teams (
        account_id, slug, name, color, icon,
        default_template, product_grant_ids, demographics
      )
      VALUES (
        ${accountId},
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
        updated_at        = now()
      RETURNING
        account_id, id, slug, name, color, icon, default_template,
        COALESCE(product_grant_ids, '{}') AS product_grant_ids,
        COALESCE(demographics, '{}'::jsonb) AS demographics,
        created_at, updated_at;
    `
    return rows[0] as unknown as Team
  }
}

/** Delete a team by id. */
export async function deleteTeam(accountId: number, id: string) {
  await sql/* sql */`
    DELETE FROM teams
    WHERE account_id = ${accountId} AND id = ${id};
  `
}
