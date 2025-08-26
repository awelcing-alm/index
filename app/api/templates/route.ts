import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

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

type SaveBody = {
  name: string
  description?: string
  attributes: Record<string, any>
  overwriteFalse?: boolean
}

const RESERVED = new Set(["top-content","regional-updates","no-newsletters"])

export async function POST(req: Request) {
  try {
    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No account" }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as SaveBody
    const name = String(body?.name ?? "").trim()
    const description = typeof body?.description === "string" ? body.description.trim() : null
    const attributes = body?.attributes && typeof body.attributes === "object" ? body.attributes : {}
    const overwriteFalse = body?.overwriteFalse === true

    if (!name) return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 })
    if (RESERVED.has(name.toLowerCase())) {
      return NextResponse.json({ ok: false, error: "Default templates are not editable" }, { status: 409 })
    }

    await sql/* sql */`
      INSERT INTO public.templates (account_id, name, type, description, attributes, overwrite_false, is_default)
      VALUES (${accountId}, ${name}, 'newsletter', ${description}, ${JSON.stringify(attributes)}::jsonb, ${overwriteFalse}, false)
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

