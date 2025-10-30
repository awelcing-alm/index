// lib/product-templates.ts
// Helpers for product-template gating and Zephr Extended Profile app IDs

export type ProductKey = "radar" | "compass" | "scholar"

export const PRODUCT_APP_IDS: Record<ProductKey, string> = {
  radar: process.env.ZEPHR_APPID_RADAR_PROFILE || "RadarProfile",
  compass: process.env.ZEPHR_APPID_COMPASS_PROFILE || "CompassProfile",
  scholar: process.env.ZEPHR_APPID_SCHOLAR_PROFILE || "ScholarProfile",
}

// loosely match product names/ids/entitlements coming back from Zephr
export function isProductMatch(p: any, key: ProductKey): boolean {
  const hay = [
    p?.label,
    p?.id,
    p?.name,
    p?.description,
    p?.entitlement?.id,
    p?.entitlement?.type,
  ]
    .filter(Boolean)
    .map((s: any) => String(s).toLowerCase())
    .join(" ")

  const needle = key.toLowerCase()
  return hay.includes(needle) || hay.includes(`law.com ${needle}`) || hay.includes(`lawcom ${needle}`)
}

export function productKeyFromString(v: string | null | undefined): ProductKey | null {
  const s = String(v || "").toLowerCase()
  if (s.includes("radar")) return "radar"
  if (s.includes("compass")) return "compass"
  if (s.includes("scholar")) return "scholar"
  return null
}
