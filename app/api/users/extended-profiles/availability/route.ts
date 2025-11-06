import { NextResponse } from "next/server"
import { probeKnownUserApps } from "@/lib/extended-profile"
import { PRODUCT_APP_IDS } from "@/lib/product-templates"

export const dynamic = "force-dynamic"
export const revalidate = 0

function parseIds(q: string | null): string[] {
  if (!q) return []
  return q
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userIds = parseIds(url.searchParams.get("user_ids"))
    const productsParam = url.searchParams.get("products")
    const requested = productsParam ? productsParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : null
    if (!userIds.length) return NextResponse.json({ ok: true, availability: {} })

    const results: Record<string, any> = {}
    await Promise.all(
      userIds.map(async (id) => {
        try {
          const probes = await probeKnownUserApps(id)
          const flags: Record<string, boolean> = {}
          for (const p of probes) flags[p.key] = !!p.exists
          if (requested && requested.length) {
            const filtered: Record<string, boolean> = {}
            for (const k of requested) {
              if (k in PRODUCT_APP_IDS) filtered[k] = !!flags[k]
            }
            results[id] = filtered
            return
          }
          results[id] = flags
        } catch {
          results[id] = {}
        }
      }),
    )

    return NextResponse.json({ ok: true, availability: results })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
