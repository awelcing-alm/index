import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { getUserDetails, updateUserAttributes } from "@/lib/zephr-api"
import { mergeTemplates } from "@/lib/template-merge"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { z } from "zod"
import pLimit from "p-limit"
import { logServer } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Target = { type: "user" | "group"; ids: string[] }

const BodySchema = z.object({
  templateNames: z.array(z.string().min(1)).min(1, "at least one template"),
  target: z.object({
    type: z.enum(["user", "group"]),
    ids: z.array(z.string().min(1)).min(1, "ids required"),
  }),
  dryRun: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const t0 = Date.now()
    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
    const { templateNames, target, dryRun = false } = parsed.data

    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    if (!templateNames.length) return NextResponse.json({ dryRun: !!dryRun, results: [] })
    if (!target || !target.type || !Array.isArray(target.ids) || !target.ids.length) {
      return NextResponse.json({ ok: false, error: "Invalid target" }, { status: 400 })
    }

    // Load templates (account custom first; fallback to globals)
    const rows = (await sql<{ name: string; attributes: any; overwrite_false: boolean | null }>/* sql */`
      SELECT name, attributes, overwrite_false
        FROM public.templates
       WHERE (account_id = ${accountId} AND is_default = false AND (type = 'newsletter' OR type IS NULL) AND name = ANY(${templateNames}))
          OR (is_default = true AND (type = 'newsletter' OR type IS NULL) AND name = ANY(${templateNames}))
    `).rows

    const templates = rows
      .filter((r) => !!r && r.name && r.attributes)
      .map((r) => ({ name: r.name, attributes: r.attributes || {}, overwrite_false: !!r.overwrite_false }))

  // Resolve user IDs
    let userIds: string[] = []
    if (target.type === "user") {
      userIds = target.ids.map(String)
    } else {
      const rows = (await sql<{ user_external_id: string }>/* sql */`
        SELECT DISTINCT user_external_id
          FROM group_memberships
         WHERE account_id = ${accountId}
           AND group_id = ANY(${target.ids})
      `).rows
      userIds = rows.map((r) => r.user_external_id)
    }

    const results: Array<{ id: string; wrote: number; errors?: string[] }> = []
    const limit = pLimit(10)

    let totalWrote = 0
    await Promise.all(userIds.map((uid) => limit(async () => {
      try {
        const baseUser = await getUserDetails(uid)
        const baseAttrs = baseUser.attributes || {}
        const baseNewsletter: Record<string, any> = {}
        for (const k of NEWSLETTER_KEYS as unknown as string[]) {
          const v = (baseAttrs as any)[k]
          if (v === true || v === "true" || v === 1 || v === "1") baseNewsletter[k] = true
          else if (v === false || v === "false" || v === 0 || v === "0") baseNewsletter[k] = false
        }

        const { result } = mergeTemplates(templates, baseNewsletter)

        // compute diff: only keys that change
        const diff: Record<string, boolean> = {}
        for (const k of NEWSLETTER_KEYS as unknown as string[]) {
          const prev = baseNewsletter[k]
          const cur = result[k]
          if (cur === undefined) continue
          if (prev !== cur) diff[k] = !!cur
        }

        if (dryRun) {
          results.push({ id: uid, wrote: Object.keys(diff).length })
        } else {
          if (Object.keys(diff).length) {
            await updateUserAttributes(uid, diff)
          }
          const wrote = Object.keys(diff).length
          totalWrote += wrote
          results.push({ id: uid, wrote })
        }
      } catch (e: any) {
        results.push({ id: uid, wrote: 0, errors: [e?.message || "Failed"] })
      }
    })))

    try { logServer("template_apply", { templates: templateNames.length, users: userIds.length, dryRun, wrote: dryRun ? undefined : totalWrote, ms: Date.now() - t0 }) } catch {}

    return NextResponse.json({ dryRun: !!dryRun, results })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
