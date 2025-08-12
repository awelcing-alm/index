// lib/team-actions.ts
"use server"
import { adminApiCall } from "@/lib/zephr-api"
import { Team } from "./teams"
import { loadTpl } from "@/lib/blob"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"

type UserLite = {
  user_id: string
  attributes?: Record<string, unknown> | null
}

/**
 * Resolve a template by name:
 *  - Try Blob (loadTpl)
 *  - Fallback to DEFAULT_TEMPLATES array
 * Returns {} when not found or no name given.
 */
async function resolveTemplateAttrs(
  accountId: string,
  templateName?: string | null
): Promise<Record<string, unknown>> {
  if (!templateName) return {}

  const tplFromBlob = await loadTpl<any>(accountId, templateName).catch(() => null)
  const tpl =
    tplFromBlob ??
    DEFAULT_TEMPLATES.find((t: any) => t?.name === templateName) ??
    null

  if (!tpl) return {}

  const base =
    tpl.overwriteFalse === true
      ? Object.fromEntries(NEWSLETTER_KEYS.map((k: string) => [k, false]))
      : {}

  return { ...base, ...(tpl.attributes ?? {}) }
}

/**
 * Build final attribute payload for users when applying a team.
 */
async function buildAttributePatch(
  accountId: string,
  team: Team
): Promise<Record<string, unknown>> {
  const templatePart = await resolveTemplateAttrs(accountId, team.default_template)
  const demographicsPart = (team.demographics ?? {}) as Record<string, unknown>
  return { ...templatePart, ...demographicsPart, team: team.id }
}

/**
 * Assign a grant idempotently.
 * Swallows “already assigned” kinds of errors.
 */
async function assignGrantToUser(grantId: string, userId: string) {
  try {
    await adminApiCall(`/v3/grants/${grantId}/assign`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    })
  } catch (err: any) {
    const msg = String(err?.message ?? err ?? "")
    if (/already/i.test(msg)) return
    throw err
  }
}

/**
 * Apply a team to many users.
 */
export async function applyTeamToUsers(
  accountId: string,
  team: Team,
  users: UserLite[]
) {
  const patch = await buildAttributePatch(accountId, team)
  const grants = (team.product_grant_ids ?? []) as string[]

  for (const u of users) {
    const currentAttrs = (u.attributes ?? {}) as Record<string, unknown>

    // 1) Patch user attributes
    await adminApiCall(`/v3/users/${u.user_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        attributes: { ...currentAttrs, ...patch },
      }),
    })

    // 2) Ensure product grants
    for (const grantId of grants) {
      await assignGrantToUser(grantId, u.user_id)
    }
  }
}

/**
 * Convenience: apply a team to a single user id.
 */
export async function applyTeamToUser(
  accountId: string,
  team: Team,
  user: UserLite
) {
  await applyTeamToUsers(accountId, team, [user])
}
