import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

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

export async function POST(req: Request, ctx: { params: Promise<{ product: string }> } | { params: { product: string } }) {
  try {
    const { product } = await (ctx as any).params
    const type = normalizeProduct(product)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const name = String(body?.name || "").trim()
    const description = typeof body?.description === "string" ? body.description.trim() : null
    const attributes = (body?.attributes && typeof body.attributes === "object") ? body.attributes : {}

    if (!name) return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 })

    await sql/* sql */`
      INSERT INTO public.templates (account_id, name, type, description, attributes, overwrite_false, is_default)
      VALUES (${accountId}, ${name}, ${type}, ${description}, ${JSON.stringify(attributes)}::jsonb, false, false)
      ON CONFLICT (account_id, name) DO UPDATE
        SET description = EXCLUDED.description,
            attributes  = EXCLUDED.attributes,
            updated_at  = now();
    `

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
