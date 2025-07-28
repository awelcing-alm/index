// lib/actions/team-actions.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server"

import { adminApiCall } from "@/lib/zephr-api"
import { loadTpl } from "@/lib/blob"
import {
  listTeams,
  saveTeam,
  type Team,
} from "@/lib/teams"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { getUsersByAccount } from "@/lib/zephr-api"

/* --------------------------------------------------------------- *
 * applyTeamRules – patch attrs + product grants on Zephr for users
 * --------------------------------------------------------------- */
export async function applyTeamRules(
  accountId: string,
  teamId: string,
  userIds: string[],
) {
  const team = (await listTeams(accountId)).find((t) => t.id === teamId)
  if (!team) throw new Error("team not found")

  /* 1. merge template attributes (if any) */
  let templateAttrs: Record<string, any> = {}
  if (team.default_template) {
    templateAttrs = await resolveTemplateAttrs(accountId, team.default_template)
  }

  /* 2. patch users in small parallel batches */
  const batchSize = 10
  const chunks: string[][] = []
  for (let i = 0; i < userIds.length; i += batchSize) {
    chunks.push(userIds.slice(i, i + batchSize))
  }

  const results: { userId: string; ok: boolean; reason?: string }[] = []

  for (const chunk of chunks) {
    await Promise.allSettled(
      chunk.map(async (uid) => {
        try {
          /* attributes */
          await adminApiCall(`/v3/users/${uid}/attributes`, {
            method: "PATCH",
            body: JSON.stringify(templateAttrs),
          })

          /* product grants */
          if (team.product_grant_ids?.length) {
            await adminApiCall(`/v3/users/${uid}/product-grants`, {
              method: "POST",
              body: JSON.stringify({ grantIds: team.product_grant_ids }),
            })
          }

          results.push({ userId: uid, ok: true })
        } catch (err: any) {
          console.error("[applyTeamRules]", uid, err)
          results.push({
            userId: uid,
            ok: false,
            reason: err?.message ?? "unknown",
          })
        }
      }),
    )
  }

  return results
}

/* ---------------------------------------------------------------- *
 * getTeamMembershipByAccount – users ▸ team id (or null)
 * ---------------------------------------------------------------- */
export async function getTeamMembershipByAccount(accountId: string) {
  const users = await getUsersByAccount(accountId)
  return users.map((u) => ({
    userId: u.user_id,
    email: u.identifiers?.email_address ?? "(no email)",
    team: u.attributes?.team ?? null,
  }))
}

/* ---------------------------------------------------------------- *
 * enrichTeamsWithMembers – rebuild members & counts
 * ---------------------------------------------------------------- */
export async function enrichTeamsWithMembers(accountId: string) {
  const users = await getUsersByAccount(accountId)
  const teams = await listTeams(accountId)

  /* build map */
  const map = new Map<string, string[]>()
  teams.forEach((t) => map.set(t.id, []))

  users.forEach((u) => {
    const tid = (u.attributes as any)?.team
    if (tid && map.has(tid)) map.get(tid)!.push(u.user_id)
  })

  /* save back */
  await Promise.all(
    teams.map(async (t) =>
      saveTeam(accountId, {
        ...t,
        members: map.get(t.id),
        member_count: map.get(t.id)?.length,
      }),
    ),
  )

  return { ok: true, updatedCount: teams.length }
}

/* ---------------------------------------------------------------- *
 * resolveTemplateAttrs – merge newsletter defaults if overwriteFalse
 * ---------------------------------------------------------------- */
async function resolveTemplateAttrs(
  accountId: string,
  templateName: string,
): Promise<Record<string, any>> {
  const tpl =
    (await loadTpl<any>(accountId, templateName)) ??
    (await import("@/lib/template-defaults").then((m) =>
      (m as any).DEFAULT_TEMPLATES.find((t: any) => t.name === templateName),
    ))

  if (!tpl) return {}

  const { attributes, overwriteFalse } = tpl as any
  const base = overwriteFalse
    ? Object.fromEntries(NEWSLETTER_KEYS.map((k) => [k, false]))
    : {}

  return { ...base, ...attributes }
}

/* ---------------------------------------------------------------- *
 * assignUsersToTeamAction – assign a set of users to a team and apply rules
 *
 * This server action updates the 'team' attribute for each user, then
 * invokes applyTeamRules() to propagate the team's default template
 * attributes and product grants.  Errors are propagated to the caller.
 * ---------------------------------------------------------------- */
export async function assignUsersToTeamAction(
  accountId: string,
  teamId: string,
  userIds: string[],
): Promise<{ ok: boolean }> {
  if (!teamId) return { ok: false }
  // 1. Set the 'team' attribute for each user
  await Promise.all(
    userIds.map((uid) =>
      adminApiCall(`/v3/users/${uid}/attributes`, {
        method: "PATCH",
        body: JSON.stringify({ team: teamId }),
      }),
    ),
  )
  // 2. Apply template attributes and product grants
  await applyTeamRules(accountId, teamId, userIds)
  return { ok: true }
}
