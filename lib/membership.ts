// lib/membership.ts
import "server-only"
import { sql } from "@/lib/db"
import { listGroups, type Group } from "@/lib/groups"
import { updateUserAttributesAction } from "@/lib/user-actions"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { upsertUserAppProfile } from "@/lib/extended-profile"
import { PRODUCT_APP_IDS, type ProductKey } from "@/lib/product-templates"
import { sanitizeMyLawProfile, sanitizeRadarProfile } from "@/lib/product-profiles"

type SetMembershipInput = {
  accountId: string
  userIds: string[]              // Zephr user_id (== users.external_id)
  targetGroupId: string | null   // null = remove from group
  actorEmail?: string | null
}

type SetMembershipResult = {
  changed: number
  oldToNew: Array<{ userId: string; oldGroupId: string | null; newGroupId: string | null }>
}

/** Optional: resolve demographics to apply to Zephr when we patch attributes. */
function extractDemographicsFromGroup(g?: Group | null) {
  const d = (g?.demographics || {}) as any
  return {
    ...(d["country"]       ? { country: d["country"] }           : d["region"]        ? { country: d["region"] } : {}),
    ...(d["job-function"]  ? { "job-function": d["job-function"] } : d["job_function"] ? { "job-function": d["job_function"] } : {}),
    ...(d["job-area"]      ? { "job-area": d["job-area"] }       : d["job_area"]      ? { "job-area": d["job_area"] } : {}),
  }
}

/**
 * Atomically set (or clear) a user's membership in a group.
 * - Updates group_memberships (UPSERT) -> triggers keep users.group_id and groups.user_count in sync
 * - Returns old/new for each user (so UI can adjust optimistically if needed)
 * - Patches Zephr in the background to keep source of truth aligned
 */
export async function setMembershipBulk(input: SetMembershipInput): Promise<SetMembershipResult> {
  const { accountId, userIds, targetGroupId, actorEmail } = input
  if (!accountId) throw new Error("accountId required")
  const ids = (userIds || []).map(String).filter(Boolean)
  if (ids.length === 0) return { changed: 0, oldToNew: [] }

  let groupRow: Group | null = null
  if (targetGroupId) {
    const all = await listGroups(accountId)
    groupRow = all.find(g => g.id === targetGroupId) || null
    if (!groupRow) throw new Error("Target group not found")
  }

  const oldToNew: Array<{ userId: string; oldGroupId: string | null; newGroupId: string | null }> = []

  await sql/* sql */`BEGIN`
  try {
    // fetch existing to compute deltas & no-ops quickly
    const { rows: existing } = await sql/* sql */`
      SELECT user_external_id, group_id
        FROM group_memberships
       WHERE account_id = ${accountId}
         AND user_external_id = ANY(${ids})
    `
    const prevMap = Object.fromEntries(existing.map(r => [r.user_external_id as string, r.group_id as string | null]))

    // upsert or delete
    for (const uid of ids) {
      const oldGroupId = prevMap[uid] ?? null

      if (targetGroupId === null) {
        // delete membership (if exists)
        if (oldGroupId) {
          await sql/* sql */`
            DELETE FROM group_memberships
             WHERE account_id = ${accountId}
               AND user_external_id = ${uid}
          `
          oldToNew.push({ userId: uid, oldGroupId, newGroupId: null })
        } else {
          // no-op
          oldToNew.push({ userId: uid, oldGroupId: null, newGroupId: null })
        }
        continue
      }

      // upsert to target group
      await sql/* sql */`
        INSERT INTO group_memberships (account_id, user_external_id, group_id, assigned_by)
        VALUES (${accountId}, ${uid}, ${targetGroupId}::uuid, ${actorEmail || null})
        ON CONFLICT (account_id, user_external_id)
        DO UPDATE SET group_id = EXCLUDED.group_id, assigned_by = EXCLUDED.assigned_by, assigned_at = now()
      `
      const newGroupId = targetGroupId
      oldToNew.push({ userId: uid, oldGroupId, newGroupId })
    }

    await sql/* sql */`COMMIT`
  } catch (e) {
    await sql/* sql */`ROLLBACK`
    throw e
  }

  // Apply remote changes synchronously so UI can reflect immediately
  try {
    if (groupRow) {
        const demo = extractDemographicsFromGroup(groupRow)
        const attrs = { group: groupRow.name, ...demo }
      await Promise.all(
        oldToNew
          .filter(x => x.newGroupId === groupRow!.id)
          .map(x => updateUserAttributesAction(x.userId, attrs))
      )

        // Apply templates associated with the group
        const targetUserIds = oldToNew.filter(x => x.newGroupId === groupRow!.id).map(x => x.userId)
        if (targetUserIds.length) {
          // 1) Newsletter default template
          const newsletterName = groupRow.default_template || null
          if (newsletterName) {
            try {
              // Try account-specific first, then global default
              const rowAcc = (await sql<{ attributes: any | null; overwrite_false: boolean | null }>/* sql */`
                SELECT attributes, overwrite_false
                  FROM public.templates
                 WHERE account_id = ${groupRow.account_id}
                   AND is_default = false
                   AND (type = 'newsletter' OR type IS NULL)
                   AND name = ${newsletterName}
                 LIMIT 1;
              `).rows[0]
              const rowDef = rowAcc
                ? null
                : (await sql<{ attributes: any | null; overwrite_false: boolean | null }>/* sql */`
                    SELECT attributes, overwrite_false
                      FROM public.templates
                     WHERE is_default = true
                       AND (type = 'newsletter' OR type IS NULL)
                       AND name = ${newsletterName}
                     LIMIT 1;
                  `).rows[0]

              const src = rowAcc || rowDef
              if (src) {
                const overwriteFalse = !!src.overwrite_false
                const incoming = (src.attributes && typeof src.attributes === 'object') ? src.attributes : {}
                const full: Record<string, boolean> = Object.fromEntries(NEWSLETTER_KEYS.map(k => [k, false]))
                const attrsToApply = overwriteFalse
                  ? { ...full, ...Object.fromEntries(Object.entries(incoming).filter(([k]) => k in full)) }
                  : Object.fromEntries(Object.entries(incoming).filter(([k]) => k in full))
                // Patch users with newsletter attributes
                await Promise.all(targetUserIds.map((uid) => updateUserAttributesAction(uid, attrsToApply)))
              }
            } catch (e) {
              console.error("Apply newsletter template failed:", e)
            }
          }

          // 2) Product templates (stored under demographics["product-templates"]) => upsert Extended Profiles
          try {
            const pt = (groupRow.demographics as any)?.["product-templates"] || (groupRow.demographics as any)?.["product_templates"] || null
            if (pt && typeof pt === 'object') {
              const entries = Object.entries(pt) as Array<[string, string]>
              for (const [keyRaw, tplNameRaw] of entries) {
                const key = String(keyRaw).toLowerCase() as ProductKey
                const tplName = String(tplNameRaw || "").trim()
                if (!tplName) continue
                if (!['radar','compass','scholar','mylaw'].includes(key)) continue

                // Load template attributes for this product
                const row = (await sql<{ attributes: any | null }>/* sql */`
                  SELECT attributes
                    FROM public.templates
                   WHERE account_id = ${groupRow.account_id}
                     AND is_default = false
                     AND type = ${key}
                     AND name = ${tplName}
                   LIMIT 1;
                `).rows[0]
                let attributes: any = row?.attributes && typeof row.attributes === 'object' ? row.attributes : {}
                try {
                  if (key === 'mylaw') attributes = sanitizeMyLawProfile(attributes)
                  else if (key === 'radar') attributes = sanitizeRadarProfile(attributes)
                } catch {}
                const appId = PRODUCT_APP_IDS[key]
                // Upsert for each user (best-effort)
              await Promise.all(
                targetUserIds.map(async (uid) => {
                  try {
                    const ok = await upsertUserAppProfile(uid, appId, attributes)
                    if (!ok) console.error("Extended profile upsert returned false", { uid, key, appId })
                    return ok
                  } catch (err) {
                    console.error("Extended profile upsert failed", { uid, key, appId, err })
                    return false
                  }
                })
              )
              }
            }
          } catch (e) {
            console.error("Apply product templates failed:", e)
          }
        }
    } else {
        // Clearing group: remove only "group" key (keep others intact). (Zephr may not support delete; set empty.)
      await Promise.all(
        oldToNew.map(x => updateUserAttributesAction(x.userId, { group: "" }))
      )
    }
  } catch (patchErr) {
    console.error("Membership side-effects failed:", patchErr)
  }

  const changed = oldToNew.filter(x => x.oldGroupId !== x.newGroupId).length
  return { changed, oldToNew }
}
