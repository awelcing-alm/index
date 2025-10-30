import { NextResponse } from "next/server"
import { PRODUCT_APP_IDS } from "@/lib/product-templates"
import { probeKnownUserApps } from "@/lib/extended-profile"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } | { params: { id: string } },
) {
  try {
    const { id } = await (ctx as any).params
    const userId = decodeURIComponent(id)
    if (!userId) return NextResponse.json({ ok: false, error: "Missing user" }, { status: 400 })

    const probes = await probeKnownUserApps(userId)

    const payload = Object.fromEntries(
      probes.map((p) => [p.key, { appId: p.appId, exists: p.exists }]) as [string, any][],
    )

    return NextResponse.json({ ok: true, apps: PRODUCT_APP_IDS, availability: payload })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
