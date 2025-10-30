import { NextResponse } from "next/server"
import { getProductsForCurrentAccount, getCurrentUser } from "@/lib/zephr-api"
import { PRODUCT_APP_IDS, isProductMatch } from "@/lib/product-templates"
import { hasExtendedProfileApp } from "@/lib/extended-profile"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const session = await getCurrentUser()
    const accountId = session?.activeAccount?.account_id || ""
    if (!accountId) return NextResponse.json({ ok: false, error: "No active account" }, { status: 401 })

    const products = await getProductsForCurrentAccount()

    const hasRadar = products.some((p) => isProductMatch(p, "radar"))
    const hasCompass = products.some((p) => isProductMatch(p, "compass"))
  const hasScholar = products.some((p) => isProductMatch(p, "scholar"))
  const hasMyLaw = products.some((p) => isProductMatch(p, "mylaw"))

  const radarOk = hasRadar && (await hasExtendedProfileApp(accountId, PRODUCT_APP_IDS.radar))
  const compassOk = hasCompass && (await hasExtendedProfileApp(accountId, PRODUCT_APP_IDS.compass))
  const scholarOk = hasScholar && (await hasExtendedProfileApp(accountId, PRODUCT_APP_IDS.scholar))
  const mylawOk = hasMyLaw && (await hasExtendedProfileApp(accountId, PRODUCT_APP_IDS.mylaw))

    return NextResponse.json({
      ok: true,
      accountId,
      apps: PRODUCT_APP_IDS,
      grants: {
        radar: !!radarOk,
        compass: !!compassOk,
        scholar: !!scholarOk,
        mylaw: !!mylawOk,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed to check grants" }, { status: 500 })
  }
}
