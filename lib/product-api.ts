// lib/product-api.ts
import 'server-only'
import { adminApiCall } from "@/lib/zephr-api"
import type { ZephrAccountGrant, ZephrProduct } from "@/lib/zephr-types"

export async function getProductsByAccount(accountId: string): Promise<ZephrProduct[]> {
  console.log(`[getProductsByAccount] Fetching grants for account: ${accountId}`)

  const accountGrantsResponse = await adminApiCall(`/v3/accounts/${accountId}/grants`)
  console.log(`[getProductsByAccount] Raw grants response:`, JSON.stringify(accountGrantsResponse, null, 2))

  const accountGrants: ZephrAccountGrant[] = Array.isArray(accountGrantsResponse)
    ? accountGrantsResponse
    : accountGrantsResponse.results || accountGrantsResponse.data || []

  console.log(`[getProductsByAccount] Found ${accountGrants.length} grants to process`)

  const products: ZephrProduct[] = []

  for (const grant of accountGrants) {
    console.log(`[getProductsByAccount] Processing grant:`, JSON.stringify(grant, null, 2))

    // Use the correct field name from API: grant_id instead of grantId
    if (!grant.grant_id) {
      console.warn(`[getProductsByAccount] Skipping grant without grant_id`)
      continue
    }

    // Start with basic info from grant - using correct field names
    let productLabel = grant.product_id || grant.entitlement_id || grant.grant_id
    let productDescription = `${grant.entitlement_type || "Unknown Type"}`
    const productId = grant.product_id || grant.entitlement_id || grant.grant_id

    // Try to enhance with product details if product_id exists
    if (grant.product_id) {
      try {
        console.log(`[getProductsByAccount] Attempting to fetch product details for: ${grant.product_id}`)
        const productDetails = await adminApiCall(`/v3/products/${grant.product_id}`)
        console.log(`[getProductsByAccount] Product details response:`, JSON.stringify(productDetails, null, 2))

        if (productDetails?.label) {
          productLabel = productDetails.label
          console.log(`[getProductsByAccount] Enhanced label: ${productLabel}`)
        }
        if (productDetails?.description) {
          productDescription = productDetails.description
          console.log(`[getProductsByAccount] Enhanced description: ${productDescription}`)
        }
      } catch (error) {
        console.warn(`[getProductsByAccount] Failed to fetch product details for ${grant.product_id}:`, error)
        // Continue with basic grant info
      }
    }

    // Create the product object - using correct field names from API
    const product: ZephrProduct = {
      tenantId: accountId,
      id: productId,
      label: productLabel,
      description: productDescription,
      entitlement: {
        id: grant.entitlement_id || "unknown",
        type: grant.entitlement_type || "unknown",
        entitlementTenant: accountId,
      },
      grantId: grant.grant_id, // Use grant_id from API
      startTime: grant.start_time || "N/A", // Use start_time from API
      endTime: grant.end_time || "N/A", // Use end_time from API
      expiry_state: grant.expiry_state || "unknown",
    }

    console.log(`[getProductsByAccount] Created product:`, JSON.stringify(product, null, 2))
    products.push(product)
  }

  console.log(
    `[getProductsByAccount] Final result: ${products.length} products created from ${accountGrants.length} grants`,
  )
  return products
}
