import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Row = {
  name: string
  description: string | null
  attributes: Record<string, any> | null
  overwrite_false: boolean | null
  is_default: boolean | null
  created_at: string | null
  updated_at: string | null
}

function expandAttributes(attrs: any, overwriteFalse: boolean): Record<string, boolean> {
  // Build full map (all keys false), then overlay provided attrs
  const full: Record<string, boolean> = Object.fromEntries(NEWSLETTER_KEYS.map(k => [k, false]))
  if (attrs && typeof attrs === "object") {
    for (const [k, v] of Object.entries(attrs)) if (k in full) full[k] = !!v
  }
  return overwriteFalse ? full : (attrs || full)
}

export async function GET(req: Request, ctx: { params: Promise<{ name: string }> } | { params: { name: string } }) {
  try {
    const { name } = await (ctx as any).params
    const tplName = decodeURIComponent(name)

    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ error: "No account" }, { status: 401 })

    // 1) Account-specific
    const acc = (await sql<Row>`
      SELECT name, description, attributes, overwrite_false, is_default, created_at, updated_at
      FROM public.templates
      WHERE account_id = ${accountId}
        AND is_default = false
        AND name = ${tplName}
        AND (type = 'newsletter' OR type IS NULL)
      LIMIT 1;
    `).rows[0]

    if (acc) {
      const attributes = expandAttributes(acc.attributes, !!acc.overwrite_false)
      return NextResponse.json({
        name: acc.name,
        description: acc.description ?? undefined,
        attributes,
        overwriteFalse: !!acc.overwrite_false,
        createdAt: acc.created_at ?? undefined,
        updatedAt: acc.updated_at ?? undefined,
      })
    }

    // 2) Global default
    const def = (await sql<Row>`
      SELECT name, description, attributes, overwrite_false, is_default, created_at, updated_at
      FROM public.templates
      WHERE is_default = true
        AND name = ${tplName}
        AND (type = 'newsletter' OR type IS NULL)
      LIMIT 1;
    `).rows[0]

    if (def) {
      const attributes = expandAttributes(def.attributes, true) // defaults always overwriteFalse
      return NextResponse.json({
        name: def.name,
        description: def.description ?? undefined,
        attributes,
        overwriteFalse: true,
        createdAt: def.created_at ?? undefined,
        updatedAt: def.updated_at ?? undefined,
      })
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 })
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ name: string }> } | { params: { name: string } }) {
  try {
    const { name } = await (ctx as any).params
    const tplName = decodeURIComponent(name)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    // Do not allow overriding reserved default names
    if (["top-content","regional-updates","no-newsletters"].includes(tplName.toLowerCase()))
      return NextResponse.json({ ok: false, error: "Default templates are not editable" }, { status: 409 })

    const body = await req.json().catch(() => ({}))
    const description = typeof body?.description === "string" ? body.description.trim() : null
    const attributes = body?.attributes && typeof body.attributes === "object" ? body.attributes : {}
    const overwriteFalse = body?.overwriteFalse === true

    await sql/* sql */`
      INSERT INTO public.templates (account_id, name, type, description, attributes, overwrite_false, is_default)
      VALUES (${accountId}, ${tplName}, 'newsletter', ${description}, ${JSON.stringify(attributes)}::jsonb, ${overwriteFalse}, false)
      ON CONFLICT (account_id, name) DO UPDATE
        SET description     = EXCLUDED.description,
            attributes      = EXCLUDED.attributes,
            overwrite_false = EXCLUDED.overwrite_false,
            updated_at      = now();
    `
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ name: string }> } | { params: { name: string } }) {
  try {
    const { name } = await (ctx as any).params
    const tplName = decodeURIComponent(name)
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    // Never delete globals
    await sql/* sql */`
      DELETE FROM public.templates
      WHERE account_id = ${accountId}
        AND is_default = false
        AND name = ${tplName}
        AND (type = 'newsletter' OR type IS NULL);
    `
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Failed" }, { status: 500 })
  }
}
