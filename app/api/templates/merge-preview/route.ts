import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { getUserDetails } from "@/lib/zephr-api"
import { mergeTemplates } from "@/lib/template-merge"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { z } from "zod"
import { logServer } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BodySchema = z.object({
  templateNames: z.array(z.string().min(1)).min(1, "at least one template"),
  baseUserId: z.string().min(1).optional(),
})

export async function POST(req: Request) {
  try {
    const t0 = Date.now()
    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
    const { templateNames, baseUserId } = parsed.data

    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

  if (!templateNames.length) return NextResponse.json({ result: {}, sources: {}, conflicts: [] })

    const placeholders = templateNames.map((_, i) => `$${i + 1}`).join(",")
    const rows = (await sql<{ name: string; attributes: any; overwrite_false: boolean | null }>/* sql */`
      SELECT name, attributes, overwrite_false
        FROM public.templates
       WHERE (account_id = ${accountId} AND is_default = false AND (type = 'newsletter' OR type IS NULL) AND name = ANY(${templateNames}))
          OR (is_default = true AND (type = 'newsletter' OR type IS NULL) AND name = ANY(${templateNames}))
      ORDER BY name;
    `).rows

    const templates = rows
      .filter((r) => !!r && r.name && r.attributes)
      .map((r) => ({ name: r.name, attributes: r.attributes || {}, overwrite_false: !!r.overwrite_false }))

  let base: Record<string, any> | undefined
    if (baseUserId) {
      try {
        const user = await getUserDetails(baseUserId)
        const attrs = user.attributes || {}
        base = {}
        for (const k of NEWSLETTER_KEYS as unknown as string[]) {
          const v = (attrs as any)[k]
          if (v === true || v === "true" || v === 1 || v === "1") base[k] = true
          else if (v === false || v === "false" || v === 0 || v === "0") base[k] = false
        }
      } catch {}
    }

    // Detect conflicts: a field is conflicting if >1 distinct value across templates
    const conflicts: string[] = []
    const seen: Record<string, Set<string>> = {}
    for (const t of templates) {
      for (const [k, v] of Object.entries(t.attributes || {})) {
        const set = (seen[k] ||= new Set<string>())
        if (typeof v === "boolean") set.add(v ? "true" : "false")
        else set.add(JSON.stringify(v))
      }
    }
    for (const [k, set] of Object.entries(seen)) {
      if (set.size > 1) conflicts.push(k)
    }

    const { result, sources } = mergeTemplates(templates, base)
    // Audit
    try {
      const boolCount = Object.values(result).filter(v => v === true || v === false).length
      logServer("template_merge_preview", { names: templateNames.length, base: !!baseUserId, conflicts: conflicts.length, fields: boolCount, ms: Date.now() - t0 })
    } catch {}
    return NextResponse.json({ result, sources, conflicts })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
