import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { getProductsForCurrentAccount } from "@/lib/zephr-api"
import { isProductMatch } from "@/lib/product-templates"
import { applyNewsletterPolicy } from "@/lib/product-policy"
import { z } from "zod"
import { logServer } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const scope  = (url.searchParams.get("scope")  || "all").toLowerCase()   // all | custom | defaults
    const format = (url.searchParams.get("format") || "object").toLowerCase() // object | array

    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""

    const defaults = (await sql<{name:string}>`
      SELECT name
      FROM public.templates
      WHERE is_default = true AND (type = 'newsletter' OR type IS NULL)
      ORDER BY name;
    `).rows.map(r => r.name)

    let custom: string[] = []
    if (accountId) {
      custom = (await sql<{name:string}>`
        SELECT name
        FROM public.templates
        WHERE account_id = ${accountId}
          AND is_default = false
          AND (type = 'newsletter' OR type IS NULL)
        ORDER BY name;
      `).rows.map(r => r.name)
    }

    let names: string[]
    if (scope === "defaults") names = defaults
    else if (scope === "custom") names = custom
    else names = Array.from(new Set([...defaults, ...custom]))

    return format === "array"
      ? NextResponse.json(names)
      : NextResponse.json({ ok: true, names })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Failed" }, { status: 500 })
  }
}

const SaveBody = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  attributes: z.record(z.any()).default({}),
  overwriteFalse: z.boolean().optional(),
})

const RESERVED = new Set(["top-content","regional-updates","no-newsletters"])

export async function POST(req: Request) {
  try {
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    const parsed = SaveBody.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
    const { name, description = null } = parsed.data
    let attributes = parsed.data.attributes
    const overwriteFalse = parsed.data.overwriteFalse === true

    if (!name) return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 })
    if (RESERVED.has(name.toLowerCase())) {
      return NextResponse.json({ ok: false, error: "Default templates are not editable" }, { status: 409 })
    }

    // Enforce newsletter-policy against product grants
    try {
      const products = await getProductsForCurrentAccount()
      const grants = {
        radar: products.some((p) => isProductMatch(p, "radar")),
        compass: products.some((p) => isProductMatch(p, "compass")),
        scholar: products.some((p) => isProductMatch(p, "scholar")),
        mylaw: products.some((p) => isProductMatch(p, "mylaw")),
      }
      attributes = applyNewsletterPolicy(grants, attributes)
    } catch {
      // best-effort; if grants lookup fails, proceed without mutation
    }

    // collision detection for create (use PUT to overwrite)
    const exists = (await sql/* sql */`
      SELECT 1 FROM public.templates
       WHERE account_id = ${accountId} AND name = ${name} AND (type = 'newsletter' OR type IS NULL)
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
      VALUES (${accountId}, ${name}, 'newsletter', ${description}, ${JSON.stringify(attributes)}::jsonb, ${overwriteFalse}, false)
    `
    logServer("template_save_newsletter", { accountId, name, overwriteFalse })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Failed" }, { status: 500 })
  }
}

