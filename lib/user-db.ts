// lib/user-db.ts
import { sql } from "@/lib/db"

export type DbUser = {
  id: number
  external_id: string
  email: string
  firstname: string | null
  lastname: string | null
  attributes: Record<string, any>
  last_login: string | null
  last_synced_at: string | null
}

/**
 * Upsert minimal user profile, including last_login and last_synced_at.
 * - Identified by external_id (Zephr user_id).
 * - Updates email/name/attributes/last_login/last_synced_at.
 */
export async function upsertUserBasics(u: {
  external_id: string
  email: string
  firstname?: string | null
  lastname?: string | null
  attributes?: Record<string, any> | null
  last_login?: string | null
  last_synced_at?: string | null
}): Promise<DbUser> {
  const attrs = u.attributes ? JSON.stringify(u.attributes) : "{}"

  const { rows } = await sql/* sql */`
    INSERT INTO users (
      external_id, email, firstname, lastname, attributes, last_login, last_synced_at
    )
    VALUES (
      ${u.external_id},
      ${u.email},
      ${u.firstname ?? null},
      ${u.lastname ?? null},
      ${attrs}::jsonb,
      ${u.last_login ?? null},
      ${u.last_synced_at ?? null}
    )
    ON CONFLICT (external_id) DO UPDATE
    SET
      email          = EXCLUDED.email,
      firstname      = COALESCE(EXCLUDED.firstname, users.firstname),
      lastname       = COALESCE(EXCLUDED.lastname, users.lastname),
      attributes     = COALESCE(EXCLUDED.attributes, users.attributes),
      last_login     = COALESCE(EXCLUDED.last_login, users.last_login),
      last_synced_at = COALESCE(EXCLUDED.last_synced_at, now()),
      updated_at     = now()
    RETURNING
      id, external_id, email, firstname, lastname, attributes, last_login, last_synced_at;
  `

  return rows[0] as DbUser
}
