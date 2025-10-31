import { NextResponse } from "next/server"
import { productKeyFromString, PRODUCT_APP_IDS } from "@/lib/product-templates"
import { getUserAppProfile, upsertUserAppProfile } from "@/lib/extended-profile"
import { sanitizeMyLawProfile, sanitizeRadarProfile } from "@/lib/product-profiles"
import { logServer } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string; product: string }> } | { params: { id: string; product: string } },
) {
  try {
    const { id, product } = await (ctx as any).params
    const userId = decodeURIComponent(id)
    const key = productKeyFromString(product)
    if (!userId || !key) return NextResponse.json({ ok: false, error: "Bad params" }, { status: 400 })

  const appId = PRODUCT_APP_IDS[key]
    const data = await getUserAppProfile(userId, appId)
    return NextResponse.json({ ok: true, appId, data: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string; product: string }> } | { params: { id: string; product: string } },
) {
  try {
    const bodyText = await req.text()
    let payload: any = null
    try { payload = bodyText ? JSON.parse(bodyText) : {} } catch {}

    const { id, product } = await (ctx as any).params
    const userId = decodeURIComponent(id)
    const key = productKeyFromString(product)
    if (!userId || !key) return NextResponse.json({ ok: false, error: "Bad params" }, { status: 400 })

    // Normalize payloads by product so upstream receives stable shape
    let normalized: any = payload || {}
    try {
      if (key === "mylaw") normalized = sanitizeMyLawProfile(payload)
      else if (key === "radar") normalized = sanitizeRadarProfile(payload)
    } catch {}

    const appId = PRODUCT_APP_IDS[key]
    const ok = await upsertUserAppProfile(userId, appId, normalized)
  try { logServer("profile_save", { userId, product: key, appId, ok }) } catch {}
    return NextResponse.json({ ok, appId })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
