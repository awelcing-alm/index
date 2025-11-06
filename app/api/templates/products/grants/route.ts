import { NextResponse } from "next/server"
import { getProductsForCurrentAccount, getCurrentUser } from "@/lib/zephr-api"
import { PRODUCT_APP_IDS, isProductMatch } from "@/lib/product-templates"
import { hasExtendedProfileApp } from "@/lib/extended-profile"

export const dynamic = "force-dynamic"
export const revalidate = 0

function parseProducts(param: string | null): string[] {
  if (!param) return []
  return param.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const requested = parseProducts(url.searchParams.get("products"))
    const session = await getCurrentUser()
    const accountId = session?.activeAccount?.account_id || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No active account" }, { status: 401 })

    const products = await getProductsForCurrentAccount()

    const keys = (requested.length ? requested : ["radar", "compass", "scholar", "mylaw"]).map((k) => k.toLowerCase())
    const result: Record<string, boolean> = {}
    for (const k of Array.from(new Set(keys))) {
      // Try to map to known product key for robust matching
      let has = false
      try {
        if (k in PRODUCT_APP_IDS) {
          // known key
          has = products.some((p) => isProductMatch(p, k as any))
        } else {
          // fallback: substring match on labels/ids
          const needle = k.toLowerCase()
          has = products.some((p: any) => {
            const hay = [p?.label, p?.id, p?.name, p?.description, p?.entitlement?.id, p?.entitlement?.type]
              .filter(Boolean)
              .map((s: any) => String(s).toLowerCase())
              .join(" ")
            return hay.includes(needle)
          })
        }
      } catch {}
      // App capability check; use known app id if present, else the key itself (allowlist can enable)
      const appId = (PRODUCT_APP_IDS as any)[k] || k
      const ok = has && (await hasExtendedProfileApp(accountId, appId))
      result[k] = !!ok
    }

    return NextResponse.json({ ok: true, accountId, apps: PRODUCT_APP_IDS, grants: result })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed to check grants" }, { status: 500 })
  }
}
