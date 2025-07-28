// lib/teams.ts
// ───────────────────────────────────────────────────────────
// Postgres helpers for the Teams feature
// ───────────────────────────────────────────────────────────

import { sql } from "@vercel/postgres"
import { saveTeamBlob } from "@/lib/team-blob"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface Team {
  id: string
  slug: string
  name: string
  color: string | null
  icon: string | null
  default_template?: string | null
  product_grant_ids?: string[] | null

  /* ——— virtual fields ——— */
  members?: string[]
  member_count?: number

  /**
   * When requesting `/api/teams?includeMembers=true` the API will
   * populate a `users` array containing id, name and email for each
   * member.  This is optional and not stored in the database.
   */
  users?: { id: string; name: string; email: string }[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Generate a URL‑friendly slug / fallback id from a name string. */
const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // collapse whitespace → dash
    .replace(/[^a-z0-9_-]/g, "") // strip anything funky

/* ------------------------------------------------------------------ */
/*  Queries                                                           */
/* ------------------------------------------------------------------ */

/** List all teams for an account, with *numeric* member counts. */
export async function listTeams(accountId: string): Promise<Team[]> {
  const { rows } = await sql`
    SELECT  t.*, COUNT(u.id)::int AS member_count
    FROM    teams  AS t
      LEFT  JOIN users AS u ON u.team_id = t.id
    WHERE   t.account_id = ${accountId}
    GROUP   BY t.id
    ORDER   BY t.name;
  `
  // Cast rows to Team[]; the `member_count` column is included via the
  // SELECT above.  Other virtual fields are undefined.
  return rows as Team[]
}

/** Insert / update (upsert) a team. Ensures slug & id are never NULL. */
export async function saveTeam(
  accountId: string,
  team: Partial<Team>,
): Promise<void> {
  /* ---------- derive safe id & slug ---------- */
  const safeName   = team.name ?? ""
  const derivedSlug = slugify(team.slug ?? safeName)
  const derivedId   = team.id ?? derivedSlug

  /* ---------- build Postgres array literal safely ---------- */
  const pgIdsLiteral =
    team.product_grant_ids?.length
      ? `{${team.product_grant_ids.join(",")}}`
      : null

  await sql`
    INSERT INTO teams (
      id, account_id, slug, name, color, icon,
      default_template, product_grant_ids, updated_at
    ) VALUES (
      ${derivedId},
      ${accountId},
      ${derivedSlug},
      ${team.name},
      ${team.color ?? null},
      ${team.icon ?? null},
      ${team.default_template ?? null},
      ${pgIdsLiteral}::uuid[],
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
      SET slug              = EXCLUDED.slug,
          name              = EXCLUDED.name,
          color             = EXCLUDED.color,
          icon              = EXCLUDED.icon,
          default_template  = EXCLUDED.default_template,
          product_grant_ids = EXCLUDED.product_grant_ids,
          updated_at        = NOW();
  `

  /*
   * Persist the team definition to Vercel Blob storage.  We
   * normalise the object to camelCase to match the example in the
   * specification. Errors are swallowed silently so a failed blob
   * write does not block the DB update.
   */
  try {
    await saveTeamBlob(accountId, {
      id: derivedId,
      name: team.name ?? safeName,
      color: team.color ?? null,
      icon: team.icon ?? null,
      default_template: team.default_template ?? null,
      product_grant_ids: team.product_grant_ids ?? null,
    })
  } catch (err) {
    console.warn("[saveTeam] Failed to persist team to blob", err)
  }
}

/** Delete a team (hard‑delete). */
export async function deleteTeam(
  accountId: string,
  teamId: string,
): Promise<void> {
  await sql`
    DELETE FROM teams
    WHERE id = ${teamId} AND account_id = ${accountId};
  `
}

/** Load a single team by id, with numeric member_count. */
export async function loadTeam(
  accountId: string,
  teamId: string,
): Promise<Team | null> {
  const { rows } = await sql`
    SELECT  t.*, COUNT(u.id)::int AS member_count
    FROM    teams  AS t
      LEFT  JOIN users AS u ON u.team_id = t.id
    WHERE   t.account_id = ${accountId}
      AND   t.id         = ${teamId}
    GROUP   BY t.id;
  `
  return (rows[0] as Team | undefined) ?? null
}
