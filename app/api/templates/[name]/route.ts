// app/api/templates/[name]/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"

export const dynamic = "force-dynamic"
export const revalidate = 0

type TplRow = { name: string; attributes: Record<string, any> | null }

async function getCustomTemplate(accountId: string, name: string): Promise<TplRow | null> {
  // Try newsletter_templates first
  try {
    const { rows } = await sql<TplRow>`
      SELECT name, attributes
      FROM public.newsletter_templates
      WHERE account_id = ${accountId} AND name = ${name}
      LIMIT 1
    `
    if (rows?.[0]) return rows[0]
  } catch {}
  // Fallback: generic templates table (if you use one)
  try {
    const { rows } = await sql<TplRow>`
      SELECT name, attributes
      FROM public.templates
      WHERE account_id = ${accountId} AND name = ${name}
        AND (type = 'newsletter' OR type IS NULL)
      LIMIT 1
    `
    if (rows?.[0]) return rows[0]
  } catch {}
  return null
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> } | { params: { name: string } }
) {
  try {
    const { name } = await (ctx as any).params; // ✅ must await in App Router
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ error: "No account" }, { status: 401 })

    const decoded = decodeURIComponent(name)

    // 1) Try DB
    const row = await getCustomTemplate(accountId, decoded)
    if (row?.attributes) {
      return NextResponse.json({ name: row.name, attributes: row.attributes })
    }

    // 2) Fallback to defaults
    const def = DEFAULT_TEMPLATES.find(t => t.name === decoded)
    if (def) {
      return NextResponse.json({ name: def.name, attributes: def.attributes })
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 })
  }
}
