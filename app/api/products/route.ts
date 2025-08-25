// app/api/products/route.ts
import { NextResponse } from "next/server"
import { getProductsForCurrentAccount } from "@/lib/zephr-api"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const products = await getProductsForCurrentAccount()

    // Map to configurator's ProductOption: { id, label, grantId? }
    const options = products.map((p: any) => ({
      id: String(p.id ?? p.productId ?? p.entitlement?.id ?? p.grantId ?? ""),
      label: String(p.label ?? p.name ?? p.description ?? "Product"),
      grantId: p.grantId ? String(p.grantId) : undefined,
    }))

    return NextResponse.json(options)
  } catch (err: any) {
    console.error("[/api/products] error", err)
    return new NextResponse("Failed to load products", { status: 500 })
  }
}
