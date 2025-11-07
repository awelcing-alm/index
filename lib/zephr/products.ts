"use server"

import "server-only"
import { adminApiCall } from "./http"
import { ZephrProductWithGrant } from "./types"

export async function getProductsByAccount(accountId: string): Promise<ZephrProductWithGrant[]> {
  let grants: any[] = []
  try {
    const resp = await adminApiCall(`/v3/accounts/${accountId}/grants`)
    if (Array.isArray(resp)) grants = resp
    else if (resp && typeof resp === "object") {
      if (Array.isArray((resp as any).results)) grants = (resp as any).results
      else if (Array.isArray((resp as any).data)) grants = (resp as any).data
    }
  } catch (e) {
    console.error(`[getProductsByAccount] grants fetch failed for ${accountId}:`, e)
    return []
  }

  const out: ZephrProductWithGrant[] = []
  for (const g of grants) {
    const grantId         = g.grant_id        ?? g.grantId
    const productId       = g.product_id      ?? g.productId
    const entitlementId   = g.entitlement_id  ?? g.entitlementId
    const entitlementType = g.entitlement_type?? g.entitlementType
    const startTime       = g.start_time      ?? g.startTime ?? "N/A"
    const endTime         = g.end_time        ?? g.endTime   ?? "N/A"
    const expiryState     = g.expiry_state    ?? g.expiryState ?? "unknown"

    if (!grantId || (!productId && !entitlementId) || !entitlementType) continue

    out.push({
      tenantId: accountId,
      id: productId || entitlementId || grantId,
      label: productId ? `Product: ${productId}` : `Entitlement: ${entitlementId}`,
      description: `${entitlementType} - Grant ID: ${grantId}`,
      entitlement: {
        id: entitlementId || "unknown",
        type: entitlementType,
        entitlementTenant: accountId,
      },
      grantId,
      startTime,
      endTime,
      expiry_state: String(expiryState).toLowerCase(),
    })
  }
  return out
}

