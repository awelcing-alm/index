import crypto from "crypto"

// Environment variables for Zephr API
const ZEPHR_BASE_URL = process.env.ZEPHR_BASE_URL || "https://alm.api.zephr.com"
const ZEPHR_PUBLIC_BASE_URL = process.env.ZEPHR_PUBLIC_BASE_URL || "alm-lawcom-live.non-prod.cdn.zephr.com"
const ZEPHR_ACCESS_KEY = process.env.ZEPHR_ACCESS_KEY || "a2252e52-a897-4bfa-8e45-7269ed39631a"
const ZEPHR_SECRET_KEY = process.env.ZEPHR_SECRET_KEY || "7ee7fc30-1737-4122-8d00-f345c6d7968c"

// Correct HMAC signing function following the Java reference implementation
function signRequest(method: string, fullPath: string, body?: string): { authHeader: string; debugInfo: any } {
  // Parse path and query from fullPath
  const [path, queryString] = fullPath.split("?")
  const query = queryString || ""

  // Timestamp should be milliseconds since epoch (not seconds)
  const timestamp = Date.now().toString()
  const nonce = crypto.randomBytes(16).toString("hex")
  const bodyContent = body || ""

  // Create SHA-256 hash following the exact Java implementation order:
  // secretKey + body + path + query + method + timestamp + nonce
  const hash = crypto.createHash("sha256")
  hash.update(ZEPHR_SECRET_KEY, "utf8")
  hash.update(bodyContent, "utf8")
  hash.update(path, "utf8")
  hash.update(query, "utf8")
  hash.update(method.toUpperCase(), "utf8")
  hash.update(timestamp, "utf8")
  hash.update(nonce, "utf8")

  // Output as hex (not base64)
  const signature = hash.digest("hex")

  // Authorization header format: ZEPHR-HMAC-SHA256 accessKey:timestamp:nonce:hash
  const authHeader = `ZEPHR-HMAC-SHA256 ${ZEPHR_ACCESS_KEY}:${timestamp}:${nonce}:${signature}`

  return {
    authHeader,
    debugInfo: {
      method: method.toUpperCase(),
      path,
      query,
      accessKey: ZEPHR_ACCESS_KEY,
      timestamp,
      nonce,
      bodyContent,
      signature,
      baseUrl: ZEPHR_BASE_URL,
      fullPath,
      hashInputString: `${ZEPHR_SECRET_KEY}${bodyContent}${path}${query}${method.toUpperCase()}${timestamp}${nonce}`,
    },
  }
}

// Admin API call with correct HMAC signing and better error handling
export async function adminApiCall(path: string, options: RequestInit = {}) {
  const method = options.method || "GET"
  const body = options.body as string

  const { authHeader, debugInfo } = signRequest(method, path, body)

  // Enhanced logging for all requests, but especially PATCH
  if (method.toUpperCase() === "PATCH" || method.toUpperCase() === "POST" || method.toUpperCase() === "PUT") {
    console.log(`--- Admin API ${method.toUpperCase()} Request Debug ---`)
    console.log("Timestamp:", new Date().toISOString())
    console.log("Full URL:", `${ZEPHR_BASE_URL}${path}`)
    console.log("Method:", method.toUpperCase())
    console.log("Request Body (raw):", body)
    console.log("Request Body Length:", body ? body.length : 0)
    console.log("Request Body Type:", typeof body)

    // Log headers being sent
    const headers = {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...options.headers,
    }
    console.log("Request Headers:", JSON.stringify(headers, null, 2))

    // Log HMAC debug info
    console.log("HMAC Debug Info:")
    console.log("  - Access Key:", debugInfo.accessKey)
    console.log("  - Timestamp:", debugInfo.timestamp)
    console.log("  - Nonce:", debugInfo.nonce)
    console.log("  - Path:", debugInfo.path)
    console.log("  - Query:", debugInfo.query)
    console.log("  - Method:", debugInfo.method)
    console.log("  - Body Content:", `"${debugInfo.bodyContent}"`)
    console.log("  - Hash Input String:", debugInfo.hashInputString)
    console.log("  - Generated Signature:", debugInfo.signature)
    console.log("  - Authorization Header:", authHeader)
    console.log("-----------------------------")
  }

  try {
    const fetchOptions: RequestInit = {
      ...options,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...options.headers,
      },
    }

    // Only add body if it exists and method supports it
    if (
      body &&
      (method.toUpperCase() === "POST" || method.toUpperCase() === "PUT" || method.toUpperCase() === "PATCH")
    ) {
      fetchOptions.body = body
    }

    console.log(`Making ${method.toUpperCase()} request to: ${ZEPHR_BASE_URL}${path}`)

    const response = await fetch(`${ZEPHR_BASE_URL}${path}`, fetchOptions)

    console.log(`Response status: ${response.status} ${response.statusText} for ${path}`)
    // console.log("Response headers:", Object.fromEntries(response.headers.entries())); // Can be verbose

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error for ${method} ${path}: ${response.status} - ${errorText}`)
      throw new Error(`Admin API call failed for ${path}: ${response.status} ${response.statusText} - ${errorText}`)
    }

    // Handle cases where response might be empty (e.g., 204 No Content for PATCH)
    if (response.status === 204) {
      console.log(`Received 204 No Content for ${path} - operation successful`)
      return null
    }

    const responseText = await response.text()
    // console.log(`Raw response text for ${path}:`, responseText); // Can be very verbose

    if (responseText) {
      try {
        const responseData = JSON.parse(responseText)
        // console.log(`Parsed response data for ${path}:`, responseData); // Can be verbose
        return responseData
      } catch (parseError) {
        console.warn(`Failed to parse response as JSON for ${path}:`, parseError, "\nResponse text:", responseText)
        return responseText // Return text if JSON parsing fails
      }
    }

    return null // Return null if responseText is empty
  } catch (error) {
    console.error(`Admin API call error for ${method} ${path}:`, error)

    // Enhanced error information
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      console.error("This is likely a network/CORS issue. Possible causes:")
      console.error("1. CORS policy blocking the request")
      console.error("2. Network connectivity issues")
      console.error("3. Server rejecting the request before processing")
      console.error("4. Invalid URL or unreachable endpoint")
    }

    throw error
  }
}

// Public API call for user authentication
export async function publicApiCall(path: string, options: RequestInit = {}) {
  const url = `https://${ZEPHR_PUBLIC_BASE_URL}${path}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Public API Error Response:", errorText)
      throw new Error(`Public API call failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response
  } catch (error) {
    console.error("Public API call error:", error)
    throw error
  }
}

// Types for API responses
export interface ZephrAccount {
  account_id: string
  name: string
  email_address: string
  number_of_seats: number
  tenant_id: string
  created_date?: string
  modified_date?: string
}

export interface ZephrAccountsResponse {
  results: ZephrAccount[]
  total: number
}

export interface ZephrAccountUser {
  user_id: string
  account_id: string
  tenantId: string
  subTenantId: string
  user_email: string
  user_type: string
  attributes?: Record<string, any>
}

export interface ZephrUser {
  user_id: string
  identifiers: {
    email_address: string
  }
  attributes?: {
    firstname?: string // Correct API attribute name
    lastname?: string // Correct API attribute name
    organization?: string
    address?: string
    city?: string
    country?: string
    state?: string
    phone?: string
    "zip-code"?: string
    "job-area"?: string
    "job-function"?: string
    "area-of-practice"?: string
    [key: string]: any
  }
  email_verified: boolean
  created_date?: string
  modified_date?: string
  account_id?: string
  user_type?: string
}

export interface ZephrUsersResponse {
  results: ZephrUser[]
  total: number
}

export interface ZephrAccountGrant {
  grantId: string
  user_id: string // This field is in the sample, might be useful for context
  account_id: string
  expiry_state: string
  entitlement_type: string
  entitlement_id: string
  startTime: string
  endTime: string
  product_id: string // This is crucial for linking to a specific product
  createdAt: string
}

export interface ZephrEntitlement {
  id: string // The ID of the entitlement itself
  label: string
  description?: string
  auto_assign?: string
  // Other fields might exist
}

export interface ZephrGrantDetail {
  // This type might not be needed if grant list is comprehensive
  grantId: string
  entitlement_type: string
  entitlement_id: string
  startTime: string
  endTime: string
  product_id: string
}

export interface ZephrProduct {
  tenantId: string
  subTenantId?: string
  id: string // The ID of the product
  label: string
  description?: string
  entitlement?: {
    // The general entitlement associated with this product definition
    id: string
    type: string
    entitlementTenant: string
  }
  mapping?: Record<string, any>
  sharingLimit?: number
}

export interface ZephrProductWithGrant extends ZephrProduct {
  grantId: string // From the ZephrAccountGrant
  startTime: string // From the ZephrAccountGrant
  endTime: string // From the ZephrAccountGrant
  expiry_state: string // From the ZephrAccountGrant
  entitlement_details?: ZephrEntitlement // Details of the specific entitlement_id from the grant
}

export interface ZephrProductsResponse {
  results: ZephrProduct[]
  total: number
}

export interface ZephrLoginResponse {
  cookie?: string
  message: string
  tracking_id: string
  success?: boolean
}

// API functions for fetching account-specific data
export async function getAccountsByOwner(ownerEmail: string): Promise<ZephrAccount[]> {
  let page = 1
  const rpp = 50
  let hasMorePages = true
  const userAccounts: ZephrAccount[] = []

  while (hasMorePages) {
    const accountsResponse: ZephrAccountsResponse = await adminApiCall(`/v3/accounts?page=${page}&rpp=${rpp}`)
    const ownedAccounts = accountsResponse.results.filter(
      (account) => account.email_address?.toLowerCase() === ownerEmail.toLowerCase(),
    )
    userAccounts.push(...ownedAccounts)
    const totalPages = Math.ceil(accountsResponse.total / rpp)
    hasMorePages = page < totalPages
    page++
  }
  return userAccounts
}

export async function getUserDetails(userId: string): Promise<ZephrUser> {
  console.log(`[getUserDetails] === FETCHING USER DETAILS FOR: ${userId} ===`)
  try {
    const response = await adminApiCall(`/v3/users/${userId}`)
    console.log(`[getUserDetails] Raw API response for user ${userId}:`, JSON.stringify(response, null, 2))

    // Based on your API example, the response structure is:
    // { "data": { "user_id": "...", "attributes": { "firstname": "George", ... } } }
    let user: ZephrUser

    if (response && response.data) {
      // Response has a 'data' wrapper
      console.log(`[getUserDetails] Found 'data' property in response`)
      user = response.data as ZephrUser
    } else if (response && response.user_id) {
      // Response is the user object directly
      console.log(`[getUserDetails] Response appears to be user object directly`)
      user = response as ZephrUser
    } else {
      console.error(`[getUserDetails] Unexpected response structure:`, response)
      throw new Error(`Unexpected response structure from /v3/users/${userId}`)
    }

    if (!user || !user.user_id) {
      console.error(`[getUserDetails] User data is missing user_id. User object:`, user)
      throw new Error(`User data for ${userId} is missing required user_id field.`)
    }

    // Log the specific attributes we care about
    console.log(`[getUserDetails] User attributes:`, JSON.stringify(user.attributes, null, 2))
    if (user.attributes) {
      console.log(`[getUserDetails] firstname: "${user.attributes.firstname}"`)
      console.log(`[getUserDetails] lastname: "${user.attributes.lastname}"`)
      console.log(`[getUserDetails] job-area: "${user.attributes["job-area"]}"`)
      console.log(`[getUserDetails] organization: "${user.attributes.organization}"`)
    } else {
      console.log(`[getUserDetails] No attributes found in user object`)
    }

    console.log(`[getUserDetails] === SUCCESSFULLY PROCESSED USER DETAILS ===`)
    return user
  } catch (error) {
    console.error(`[getUserDetails] Error fetching user details for ${userId}:`, error)
    throw new Error(
      `Unable to fetch user details. The GET /v3/users/{id} endpoint may not be accessible or returned an error. Original error: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function updateUserAttributes(userId: string, attributes: Record<string, any>): Promise<ZephrUser | null> {
  const endpointPath = `/v3/users/${userId}/attributes`
  console.log(`=== Starting PATCH user attributes for user: ${userId} ===`)
  console.log("Attributes to update:", JSON.stringify(attributes, null, 2))

  // Validate that we have some attributes to update
  if (!attributes || Object.keys(attributes).length === 0) {
    throw new Error("No attributes provided for update")
  }

  // Clean up attributes - remove empty strings and null values if needed
  const cleanedAttributes: Record<string, any> = {}
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== null && value !== undefined) {
      // Keep empty strings if they are intentional
      cleanedAttributes[key] = value
    }
  }

  console.log("Cleaned attributes for PATCH:", JSON.stringify(cleanedAttributes, null, 2))

  try {
    const response = await adminApiCall(endpointPath, {
      method: "PATCH",
      body: JSON.stringify(cleanedAttributes),
    })

    if (response === null) {
      console.log(`✅ Attributes updated successfully for user ${userId} (204 No Content).`)
      return null
    }

    console.log(`✅ Attributes updated successfully for user ${userId}, response:`, response)
    return response.data || response
  } catch (error) {
    console.error(`❌ Error updating user attributes for ${userId} via PATCH ${endpointPath}:`, error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          `Network error: Unable to reach the PATCH ${endpointPath} endpoint. This could be due to CORS restrictions, network issues, or the endpoint being unavailable.`,
        )
      } else if (error.message.includes("400")) {
        throw new Error(
          `Bad Request: The server rejected the attribute update. Please check that the attribute names and values are valid according to the schema.`,
        )
      } else if (error.message.includes("401") || error.message.includes("403")) {
        throw new Error(`Authentication/Authorization error: You may not have permission to update user attributes.`)
      } else if (error.message.includes("404")) {
        throw new Error(`User not found: The user ${userId} may not exist or the endpoint may not be available.`)
      }
    }

    throw error
  }
}

export async function getUsersByAccount(accountId: string): Promise<ZephrUser[]> {
  try {
    console.log(`[getUsersByAccount] Fetching users for account: ${accountId}`)
    const accountUsersResponse = await adminApiCall(`/v3/accounts/${accountId}/users`)
    console.log(`[getUsersByAccount] Raw response:`, JSON.stringify(accountUsersResponse, null, 2))

    const accountUsers: ZephrAccountUser[] = Array.isArray(accountUsersResponse)
      ? accountUsersResponse
      : accountUsersResponse.results || accountUsersResponse.data || []

    console.log(`[getUsersByAccount] Parsed ${accountUsers.length} users from response`)

    if (accountUsers.length === 0) return []

    const users: ZephrUser[] = accountUsers.map((accountUser) => {
      console.log(`[getUsersByAccount] Processing user:`, JSON.stringify(accountUser, null, 2))

      // Don't override existing attributes - use them as-is from the API
      // The API response already contains the correct attribute names and values
      const userAttributes = accountUser.attributes || {}

      console.log(
        `[getUsersByAccount] User ${accountUser.user_id} attributes:`,
        JSON.stringify(userAttributes, null, 2),
      )

      return {
        user_id: accountUser.user_id,
        account_id: accountUser.account_id,
        user_type: accountUser.user_type,
        identifiers: { email_address: accountUser.user_email },
        attributes: userAttributes, // Use actual attributes from API, don't merge with defaults
        email_verified: true, // Assuming verified for simplicity, adjust if needed
      }
    })

    console.log(`[getUsersByAccount] Final processed users:`, JSON.stringify(users, null, 2))
    return users
  } catch (error) {
    console.error(`[getUsersByAccount] Error fetching users for account ${accountId}:`, error)
    return []
  }
}

export async function getProductsByAccount(accountId: string): Promise<ZephrProductWithGrant[]> {
  console.log(`\n[getProductsByAccount] === Starting for account ID: ${accountId} ===`)

  let accountGrants: ZephrAccountGrant[] = []
  try {
    console.log(
      `[getProductsByAccount] Step 1: Fetching grants for account ${accountId} via /v3/accounts/${accountId}/grants`,
    )
    const accountGrantsResponse = await adminApiCall(`/v3/accounts/${accountId}/grants`)

    console.log(`[getProductsByAccount] Raw grants response type:`, typeof accountGrantsResponse)
    console.log(`[getProductsByAccount] Raw grants response content:`, JSON.stringify(accountGrantsResponse, null, 2))

    if (Array.isArray(accountGrantsResponse)) {
      accountGrants = accountGrantsResponse
      console.log(
        `[getProductsByAccount] Successfully parsed grants response as a direct array. Found ${accountGrants.length} grants.`,
      )
    } else if (accountGrantsResponse && typeof accountGrantsResponse === "object" && accountGrantsResponse !== null) {
      if (Array.isArray(accountGrantsResponse.results)) {
        accountGrants = accountGrantsResponse.results
        console.log(
          `[getProductsByAccount] Parsed grants from 'results' property. Found ${accountGrants.length} grants.`,
        )
      } else if (Array.isArray(accountGrantsResponse.data)) {
        accountGrants = accountGrantsResponse.data
        console.log(`[getProductsByAccount] Parsed grants from 'data' property. Found ${accountGrants.length} grants.`)
      } else {
        console.warn(
          `[getProductsByAccount] Grants response is an object but does not have 'results' or 'data' array. Keys:`,
          Object.keys(accountGrantsResponse),
        )
        accountGrants = []
      }
    } else {
      console.warn(
        `[getProductsByAccount] Expected grants response to be an array or an object with a 'results'/'data' array, but received:`,
        typeof accountGrantsResponse,
        accountGrantsResponse,
      )
      accountGrants = []
    }

    console.log(
      `[getProductsByAccount] Final accountGrants array to process (length: ${accountGrants.length}):`,
      JSON.stringify(accountGrants, null, 2),
    )
    if (accountGrants.length === 0) {
      console.log(`[getProductsByAccount] No grants found for account ${accountId} after parsing.`)
      return []
    }
  } catch (error) {
    console.error(`[getProductsByAccount] Error fetching or parsing account grants for ${accountId}:`, error)
    throw new Error(
      `Failed to retrieve or parse account grants: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }

  const productsWithGrants: ZephrProductWithGrant[] = []

  for (const grant of accountGrants) {
    console.log(`[getProductsByAccount] Processing grant object:`, JSON.stringify(grant, null, 2))

    // Validate essential fields from the grant based on API spec
    const grantId = grant.grantId
    const productId = grant.product_id
    const entitlementId = grant.entitlement_id
    const entitlementType = grant.entitlement_type
    const startTime = grant.startTime
    const endTime = grant.endTime
    const expiryState = grant.expiry_state

    if (!grantId) {
      console.warn(`[getProductsByAccount] Skipping grant due to missing 'grantId'. Grant data:`, grant)
      continue
    }
    if (!productId && !entitlementId) {
      console.warn(
        `[getProductsByAccount] Skipping grant '${grantId}' due to missing 'product_id' and 'entitlement_id'. Grant data:`,
        grant,
      )
      continue
    }
    if (!entitlementType) {
      console.warn(
        `[getProductsByAccount] Skipping grant '${grantId}' due to missing 'entitlement_type'. Grant data:`,
        grant,
      )
      continue
    }

    try {
      // Construct ZephrProductWithGrant directly from grant details
      // The API spec for /v3/accounts/{accountId}/grants provides all necessary info.
      // No separate calls to /v3/products/{id} or /v3/entitlements/{id} seem intended by this function's structure.
      const productLabel = productId ? `Product: ${productId}` : `Entitlement: ${entitlementId}`
      const productDescription = `${entitlementType || "Unknown Type"} - Grant ID: ${grantId}`

      const productWithGrant: ZephrProductWithGrant = {
        tenantId: accountId, // Assuming grant is for this account
        id: productId || entitlementId || grantId, // Best available ID
        label: productLabel, // Placeholder, ideally grant has a product name/label
        description: productDescription, // Placeholder
        entitlement: {
          id: entitlementId || "unknown",
          type: entitlementType,
          entitlementTenant: accountId, // Assuming same tenant
        },
        grantId: grantId,
        startTime: startTime || "N/A",
        endTime: endTime || "N/A",
        expiry_state: expiryState || "unknown",
      }

      console.log(
        `[getProductsByAccount] Constructed product from grant '${grantId}':`,
        JSON.stringify(productWithGrant, null, 2),
      )
      productsWithGrants.push(productWithGrant)
    } catch (error) {
      console.error(
        `[getProductsByAccount] Error constructing product for grant '${grantId}':`,
        error,
        "Grant data:",
        grant,
      )
    }
  }

  console.log(`[getProductsByAccount] === Completed processing for account ${accountId} ===`)
  console.log(`[getProductsByAccount] Total initial grants: ${accountGrants.length}`)
  console.log(`[getProductsByAccount] Successfully constructed products: ${productsWithGrants.length}`)
  console.log(`[getProductsByAccount] Final productsWithGrants:`, JSON.stringify(productsWithGrants, null, 2))

  return productsWithGrants
}
