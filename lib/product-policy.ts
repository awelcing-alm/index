// lib/product-policy.ts
// Central policy for integrating product grants with newsletter/template availability

export type ProductGrantFlags = {
  radar?: boolean
  compass?: boolean
  scholar?: boolean
  mylaw?: boolean
}

// Map each product to the newsletter slugs that must be unavailable when the product is granted.
// Extend as needed when more relationships are defined.
const DISABLE_NEWSLETTERS_BY_PRODUCT: Record<keyof ProductGrantFlags, readonly string[]> = {
  // Radar product controls Radar-specific newsletters; do not allow duplicative subscriptions
  radar: ["daily-scan", "trend-detection-weekly-scan", "trend-detection-update"],
  // Placeholders for future mappings
  compass: [],
  scholar: [],
  mylaw: [],
}

export function computeDisabledNewsletterSlugs(grants: ProductGrantFlags | null | undefined): Set<string> {
  const out = new Set<string>()
  if (!grants) return out
  for (const key of Object.keys(DISABLE_NEWSLETTERS_BY_PRODUCT) as (keyof ProductGrantFlags)[]) {
    if ((grants as any)[key]) {
      for (const slug of DISABLE_NEWSLETTERS_BY_PRODUCT[key]) out.add(slug)
    }
  }
  return out
}

// Enforce policy at save-time to avoid persisting forbidden items
export function applyNewsletterPolicy(
  grants: ProductGrantFlags | null | undefined,
  attrs: Record<string, boolean>,
): Record<string, boolean> {
  if (!grants) return { ...attrs }
  const disabled = computeDisabledNewsletterSlugs(grants)
  if (!disabled.size) return { ...attrs }
  const next: Record<string, boolean> = { ...attrs }
  for (const slug of disabled) if (slug in next) next[slug] = false
  return next
}
