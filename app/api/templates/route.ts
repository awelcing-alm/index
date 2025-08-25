// app/api/templates/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: true, names: DEFAULT_TEMPLATES.map(t => t.name) })

    // Try both tables, tolerate whichever exists
    const custom = new Set<string>()
    try {
      const { rows } = await sql<{ name: string }>`
        SELECT name FROM public.newsletter_templates WHERE account_id = ${accountId}
      `
      rows.forEach(r => custom.add(r.name))
    } catch {}
    try {
      const { rows } = await sql<{ name: string }>`
        SELECT name FROM public.templates
        WHERE account_id = ${accountId} AND (type = 'newsletter' OR type IS NULL)
      `
      rows.forEach(r => custom.add(r.name))
    } catch {}

    const defaults = DEFAULT_TEMPLATES.map(t => t.name)
    const all = Array.from(new Set([...defaults, ...custom])).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    )

    return NextResponse.json({ ok: true, names: all })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Failed" }, { status: 500 })
  }
}
