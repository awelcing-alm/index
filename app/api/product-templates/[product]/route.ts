import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { z } from "zod"
import { logServer } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const revalidate = 0

function normalizeProduct(p: string): string {
  const s = String(p || "").toLowerCase()
  if (s.includes("mylaw") || s.includes("my-law")) return "mylaw"
  if (s.includes("radar")) return "radar"
  if (s.includes("compass")) return "compass"
  if (s.includes("scholar")) return "scholar"
  return s
}

export async function GET(_req: Request, ctx: { params: Promise<{ product: string }> } | { params: { product: string } }) {
  try {
    const { product } = await (ctx as any).params
    const type = normalizeProduct(product)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json([])

    const rows = (await sql<{ name: string }>/* sql */`
      SELECT name FROM public.templates
      WHERE account_id = ${accountId} AND is_default = false AND type = ${type}
      ORDER BY name;
    `).rows

    return NextResponse.json(rows.map(r => r.name))
  } catch (err: any) {
    return NextResponse.json([], { status: 200 })
  }
}

const BodySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  attributes: z.record(z.any()).default({}),
})

export async function POST(req: Request, ctx: { params: Promise<{ product: string }> } | { params: { product: string } }) {
  try {
    const t0 = Date.now()
    const { product } = await (ctx as any).params
    const type = normalizeProduct(product)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
    const { name, description = null, attributes } = parsed.data

    if (!name) return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 })

    // collision detection
    const exists = (await sql/* sql */`
      SELECT 1 FROM public.templates
       WHERE account_id = ${accountId} AND name = ${name} AND type = ${type}
       LIMIT 1;
    `).rows.length > 0
    if (exists) {
      // suggest a new name
      let i = 1; let suggestion = `${name} (${i})`
      while ((await sql/* sql */`SELECT 1 FROM public.templates WHERE account_id=${accountId} AND name=${suggestion} AND type=${type} LIMIT 1;`).rows.length > 0 && i < 99) {
        i++; suggestion = `${name} (${i})`
      }
      return NextResponse.json({ ok: false, code: "name_exists", suggestion }, { status: 409 })
    }

    await sql/* sql */`
      INSERT INTO public.templates (account_id, name, type, description, attributes, overwrite_false, is_default)
      VALUES (${accountId}, ${name}, ${type}, ${description}, ${JSON.stringify(attributes)}::jsonb, false, false)
    `

    logServer("template_save_product", { accountId, type, name, ms: Date.now() - t0 })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
