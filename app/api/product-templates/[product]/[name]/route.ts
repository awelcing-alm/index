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

export async function GET(_req: Request, ctx: { params: Promise<{ product: string; name: string }> } | { params: { product: string; name: string } }) {
  try {
    const { product, name } = await (ctx as any).params
    const type = normalizeProduct(product)
    const tplName = decodeURIComponent(name)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ error: "No account" }, { status: 401 })

    const row = (await sql<{ name: string; description: string | null; attributes: any | null; created_at: string | null; updated_at: string | null }>/* sql */`
      SELECT name, description, attributes, created_at, updated_at
        FROM public.templates
       WHERE account_id = ${accountId}
         AND is_default = false
         AND type = ${type}
         AND name = ${tplName}
       LIMIT 1;
    `).rows[0]

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({
      name: row.name,
      description: row.description ?? undefined,
      attributes: row.attributes ?? {},
      createdAt: row.created_at ?? undefined,
      updatedAt: row.updated_at ?? undefined,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed" }, { status: 500 })
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ product: string; name: string }> } | { params: { product: string; name: string } }) {
  try {
    const { product, name } = await (ctx as any).params
    const type = normalizeProduct(product)
    const tplName = decodeURIComponent(name)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const description = typeof body?.description === "string" ? body.description.trim() : null
    const attributes = (body?.attributes && typeof body.attributes === "object") ? body.attributes : {}

    await sql/* sql */`
      INSERT INTO public.templates (account_id, name, type, description, attributes, overwrite_false, is_default)
      VALUES (${accountId}, ${tplName}, ${type}, ${description}, ${JSON.stringify(attributes)}::jsonb, false, false)
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

export async function DELETE(_req: Request, ctx: { params: Promise<{ product: string; name: string }> } | { params: { product: string; name: string } }) {
  try {
    const { product, name } = await (ctx as any).params
    const type = normalizeProduct(product)
    const tplName = decodeURIComponent(name)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    await sql/* sql */`
      DELETE FROM public.templates
       WHERE account_id = ${accountId}
         AND is_default = false
         AND type = ${type}
         AND name = ${tplName};
    `

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
