import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { getUserDetails } from "@/lib/zephr-api"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { applyNewsletterPolicy } from "@/lib/product-policy"
import { getProductsForCurrentAccount } from "@/lib/zephr-api"
import { isProductMatch } from "@/lib/product-templates"
import { z } from "zod"
import { logServer } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * POST /api/templates/copy-from-user
 * body: { userId: string, name: string, description?: string, scope?: "newsletter"|"profile"|"both" }
 * For MVP, only newsletter attributes are captured.
 */
const BodySchema = z.object({
  userId: z.string().min(1, "userId required"),
  name: z.string().min(1, "name required").max(200),
  description: z.string().optional(),
  scope: z.enum(["newsletter", "profile", "both"]).optional(),
})

export async function POST(req: Request) {
  try {
    const t0 = Date.now()
    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
    }
    const { userId, name, description } = parsed.data

    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    const user = await getUserDetails(userId)
    const attrs = user.attributes || {}

    // capture newsletter booleans only
    const out: Record<string, boolean> = {}
    for (const k of NEWSLETTER_KEYS as unknown as string[]) {
      const v = (attrs as any)[k]
      const on = v === true || v === "true" || v === 1 || v === "1"
      if (on) out[k] = true
    }

    // Policy-gate attributes using product grants
    let attributes = out
    try {
      const products = await getProductsForCurrentAccount()
      const grants = {
        radar: products.some((p) => isProductMatch(p, "radar")),
        compass: products.some((p) => isProductMatch(p, "compass")),
        scholar: products.some((p) => isProductMatch(p, "scholar")),
        mylaw: products.some((p) => isProductMatch(p, "mylaw")),
      }
      attributes = applyNewsletterPolicy(grants, attributes)
    } catch {}

    // Collision detection
    const exists = (await sql/* sql */`
      SELECT 1 FROM public.templates
       WHERE account_id = ${accountId} AND name = ${name} AND (type='newsletter' OR type IS NULL)
       LIMIT 1;
    `).rows.length > 0
    if (exists) {
      let i = 1; let suggestion = `${name} (${i})`
      while ((await sql/* sql */`SELECT 1 FROM public.templates WHERE account_id=${accountId} AND name=${suggestion} AND (type='newsletter' OR type IS NULL) LIMIT 1;`).rows.length > 0 && i < 99) {
        i++; suggestion = `${name} (${i})`
      }
      return NextResponse.json({ ok: false, code: "name_exists", suggestion }, { status: 409 })
    }

    await sql/* sql */`
      INSERT INTO public.templates (account_id, name, type, description, attributes, overwrite_false, is_default)
      VALUES (${accountId}, ${name}, 'newsletter', ${description}, ${JSON.stringify(attributes)}::jsonb, true, false)
    `

    logServer("template_copy_from_user", { accountId, userId, name, fields: Object.keys(attributes).length, ms: Date.now() - t0 })

    return NextResponse.json({ ok: true, template: { name, attributes, overwrite_false: true } })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
