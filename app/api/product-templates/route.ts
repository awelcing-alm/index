import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

function parseProducts(param: string | null): string[] {
  if (!param) return []
  return param.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
}

function normalizeProduct(p: string): string {
  const s = String(p || "").toLowerCase()
  if (s.includes("mylaw") || s.includes("my-law") || s.includes("my law")) return "mylaw"
  if (s.includes("radar")) return "radar"
  if (s.includes("compass")) return "compass"
  if (s.includes("scholar")) return "scholar"
  return s
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const requested = parseProducts(url.searchParams.get("products"))
    const keys = (requested.length ? requested : ["mylaw", "radar", "compass", "scholar"]).map(normalizeProduct)

    const jar = await cookies()
    const accountId = jar.get("active_account_id")?.value || ""
    if (!accountId) return NextResponse.json({ ok: true, products: {} })

    const out: Record<string, string[]> = {}
    for (const k of Array.from(new Set(keys))) {
      try {
        const rows = (await sql<{ name: string }>/* sql */`
          SELECT name FROM public.templates
           WHERE account_id = ${accountId}
             AND is_default = false
             AND type = ${k}
          ORDER BY name;
        `).rows
        out[k] = rows.map((r) => r.name)
      } catch {
        out[k] = []
      }
    }

    return NextResponse.json({ ok: true, products: out })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
