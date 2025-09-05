// lib/zephr-api.ts
"use server"

import "server-only"
import crypto from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/* =============================================================================
   ENV
============================================================================= */

const ZEPHR_BASE_URL =
  process.env.ZEPHR_BASE_URL || "https://alm.api.zephr.com"
const ZEPHR_PUBLIC_BASE_URL =
  process.env.ZEPHR_PUBLIC_BASE_URL || "alm-lawcom-live.non-prod.cdn.zephr.com"
const ZEPHR_ACCESS_KEY = process.env.ZEPHR_ACCESS_KEY!
const ZEPHR_SECRET_KEY = process.env.ZEPHR_SECRET_KEY!

/* =============================================================================
   Types (lightweight)
============================================================================= */

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
  identifiers: { email_address: string }
  attributes?: Record<string, any>
  email_verified?: boolean
  created_date?: string
  modified_date?: string
  account_id?: string
  user_type?: string
}

export interface ZephrUsersResponse {
  results: ZephrUser[]
  total: number
}

export interface ZephrProduct {
  tenantId: string
  subTenantId?: string
  id: string
  label: string
  description?: string
  entitlement?: { id: string; type: string; entitlementTenant: string }
  mapping?: Record<string, any>
  sharingLimit?: number
}

export interface ZephrAccountGrant {
  grantId: string
  account_id: string
  user_id: string
  expiry_state: string
  entitlement_type: string
  entitlement_id: string
  startTime: string
  endTime: string
  product_id: string
  createdAt: string
}

export interface ZephrProductWithGrant extends ZephrProduct {
  grantId: string
  startTime: string
  endTime: string
  expiry_state: string
}

export interface LoginResult {
  success: boolean
  error?: string
  isAdmin?: boolean
  userEmail?: string
  accounts?: ZephrAccount[]
}

/* =============================================================================
   HMAC signing + fetchers
============================================================================= */

function signRequest(method: string, fullPath: string, body?: string) {
  const [path, queryString] = fullPath.split("?")
  const query = queryString || ""
  const timestamp = Date.now().toString()
  const nonce = crypto.randomBytes(16).toString("hex")
  const bodyContent = body || ""

  const hash = crypto.createHash("sha256")
  hash.update(ZEPHR_SECRET_KEY, "utf8")
  hash.update(bodyContent, "utf8")
  hash.update(path, "utf8")
  hash.update(query, "utf8")
  hash.update(method.toUpperCase(), "utf8")
  hash.update(timestamp, "utf8")
  hash.update(nonce, "utf8")
  const signature = hash.digest("hex")

  const authHeader = `ZEPHR-HMAC-SHA256 ${ZEPHR_ACCESS_KEY}:${timestamp}:${nonce}:${signature}`
  return { authHeader }
}

export async function adminApiCall(path: string, options: RequestInit = {}) {
  const method = (options.method || "GET").toUpperCase()
  const rawBody = options.body as string | undefined
  const { authHeader } = signRequest(method, path, rawBody)

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...(options.headers || {}),
    },
  }

  if (rawBody && ["POST", "PUT", "PATCH"].includes(method)) {
    fetchOptions.body = rawBody
  }

  const res = await fetch(`${ZEPHR_BASE_URL}${path}`, fetchOptions)

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `Admin API ${method} ${path} failed: ${res.status} ${res.statusText} - ${text}`,
    )
  }

  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function publicApiCall(path: string, options: RequestInit = {}) {
  const url = `https://${ZEPHR_PUBLIC_BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `Public API ${options.method || "GET"} ${path} failed: ${res.status} ${res.statusText} - ${text}`,
    )
  }
  return res
}

/* =============================================================================
   Accounts: scan all pages (with TTL memo to reduce spam)
============================================================================= */

const ACCOUNTS_TTL_MS = Number(process.env.ACCOUNTS_TTL_MS ?? "60000")
const _accountsMemo = new Map<string, { expiry: number; data: ZephrAccount[] }>()

function memoGetAccounts(email: string) {
  const hit = _accountsMemo.get(email.toLowerCase())
  if (hit && Date.now() < hit.expiry) return hit.data
  return null
}
function memoSetAccounts(email: string, data: ZephrAccount[]) {
  _accountsMemo.set(email.toLowerCase(), { expiry: Date.now() + ACCOUNTS_TTL_MS, data })
}

export async function getAccountsByOwner(ownerEmail: string): Promise<ZephrAccount[]> {
  const cached = memoGetAccounts(ownerEmail)
  if (cached) return cached

  const rpp = 200 // bump if the API allows
  const owned: ZephrAccount[] = []
  const want = ownerEmail.toLowerCase()

  let page = 1
  let totalPages: number | null = null

  while (true) {
    const resp = await adminApiCall(`/v3/accounts?page=${page}&rpp=${rpp}`)

    // Normalize results with type guards
    let results: ZephrAccount[] = []
    if (Array.isArray(resp)) {
      results = resp as ZephrAccount[]
    } else if (resp && typeof resp === "object") {
      if ("results" in resp && Array.isArray((resp as any).results)) {
        results = (resp as any).results as ZephrAccount[]
      } else if ("data" in resp && Array.isArray((resp as any).data)) {
        results = (resp as any).data as ZephrAccount[]
      }
    }

    // collect matches
    for (const a of results) {
      if (a?.email_address?.toLowerCase() === want) owned.push(a)
    }

    // compute total pages when possible
    if (totalPages == null && resp && typeof resp === "object" && "total" in resp) {
      const total = (resp as Partial<ZephrAccountsResponse> & { total?: number }).total
      if (typeof total === "number" && total > 0) {
        totalPages = Math.max(1, Math.ceil(total / rpp))
      }
    }

    const lastByTotal = totalPages != null && page >= totalPages
    const lastByShort = totalPages == null && results.length < rpp
    if (lastByTotal || lastByShort) break

    page += 1
    if (page > 10000) break // hard guard
  }

  memoSetAccounts(ownerEmail, owned)
  return owned
}

/* =============================================================================
   Auth helpers (cookies)
============================================================================= */

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password },
      }),
    })

    // Extract session cookie
    const setCookieHeader = loginResponse.headers.get("set-cookie") || ""
    const cookieMatch = setCookieHeader.match(/blaize_session=([^;]+)/)
    const sessionCookie = cookieMatch ? cookieMatch[1] : ""

    // Fresh accounts (detects newly added owners)
    const accounts = await getAccountsByOwner(email)
    const isAdmin = accounts.length > 0

    const jar = await cookies()

    if (sessionCookie) {
      jar.set("zephr_session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    jar.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    jar.set("is_admin", String(isAdmin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    jar.set("user_accounts", JSON.stringify(accounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    if (accounts.length > 0) {
      jar.set("active_account_id", accounts[0].account_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    // drain body for good measure
    await loginResponse.text().catch(() => "")

    return { success: true, isAdmin, userEmail: email, accounts }
  } catch (err: any) {
    return { success: false, error: err?.message || "Login failed" }
  }
}

export async function getCurrentUser() {
  const jar = await cookies()
  const userEmail = jar.get("user_email")?.value
  const session = jar.get("zephr_session")?.value
  const activeAccountIdCookie = jar.get("active_account_id")?.value

  if (!userEmail) return null

  // Fresh accounts (memoized with TTL)
  const accounts = await getAccountsByOwner(userEmail)
  const isAdmin = accounts.length > 0

  const activeAccount =
    accounts.find((a) => a.account_id === activeAccountIdCookie) || accounts[0]

  // best-effort cookie sync
  try {
    jar.set("is_admin", String(isAdmin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    jar.set("user_accounts", JSON.stringify(accounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    if (activeAccount && activeAccount.account_id !== activeAccountIdCookie) {
      jar.set("active_account_id", activeAccount.account_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }
  } catch {}

  return {
    email: userEmail,
    isAdmin,
    role: isAdmin ? "admin" : "member",
    session,
    accounts,
    activeAccount,
  }
}

export async function switchAccount(accountId: string) {
  const jar = await cookies()
  jar.set("active_account_id", accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function logoutUser() {
  const jar = await cookies()
  jar.delete("zephr_session")
  jar.delete("user_email")
  jar.delete("is_admin")
  jar.delete("user_accounts")
  jar.delete("active_account_id")
  redirect("/login")
}

/* =============================================================================
   Users / Products for current account (wrappers)
============================================================================= */

export async function getUsersForCurrentAccount(): Promise<ZephrUser[]> {
  const user = await getCurrentUser()
  if (!user?.activeAccount) return []
  try {
    return await getUsersByAccount(user.activeAccount.account_id)
  } catch (e) {
    console.error("Error fetching users for account:", e)
    return []
  }
}

export async function getProductsForCurrentAccount(): Promise<ZephrProductWithGrant[]> {
  const user = await getCurrentUser()
  if (!user?.activeAccount) return []
  try {
    return await getProductsByAccount(user.activeAccount.account_id)
  } catch (e) {
    console.error("Error fetching products for account:", e)
    return []
  }
}

export async function testApiCredentials() {
  try {
    const res = await adminApiCall("/v3/accounts?page=1&rpp=1")
    return { success: true, data: res }
  } catch (e: any) {
    return { success: false, error: e?.message || "Admin API test failed" }
  }
}

export async function testPublicApi(email: string, password: string) {
  try {
    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password },
      }),
    })
    const data = await loginResponse.json().catch(() => ({}))
    return { success: true, data, status: loginResponse.status, statusText: loginResponse.statusText }
  } catch (e: any) {
    return { success: false, error: e?.message || "Public API test failed" }
  }
}

/* =============================================================================
   User helpers (normalize GET/PATCH)
============================================================================= */

function coerceBoolMap(obj: any): Record<string, any> {
  if (!obj || typeof obj !== "object") return {}
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === "true") out[k] = true
    else if (v === "false") out[k] = false
    else out[k] = v
  }
  return out
}

function normalizeUser(raw: any): ZephrUser {
  const u = raw?.data ?? raw ?? {}
  const attrs = coerceBoolMap(u.attributes || {})
  const email =
    u.identifiers?.email_address ??
    u.email_address ??
    u.user_email ??
    ""

  return {
    user_id: String(u.user_id || u.id || ""),
    identifiers: { email_address: String(email || "") },
    attributes: attrs,
    email_verified:
      typeof u.email_verified === "boolean" ? u.email_verified : true,
    created_date: u.created_date ?? u.createdAt ?? undefined,
    modified_date: u.modified_date ?? u.updatedAt ?? undefined,
    account_id: u.account_id ?? undefined,
    user_type: u.user_type ?? undefined,
  }
}

export async function getUserDetails(userId: string): Promise<ZephrUser> {
  if (!userId) throw new Error("userId is required")
  const raw = await adminApiCall(`/v3/users/${encodeURIComponent(userId)}`, { method: "GET" })
  const user = normalizeUser(raw)
  if (!user.user_id) {
    throw new Error(`Unexpected /v3/users/${userId} response shape`)
  }
  return user
}

export async function updateUserAttributes(
  userId: string,
  attributes: Record<string, any>
): Promise<ZephrUser | null> {
  if (!userId) throw new Error("userId is required")
  if (!attributes || typeof attributes !== "object" || !Object.keys(attributes).length) {
    throw new Error("No attributes provided for update")
  }

  const res = await adminApiCall(
    `/v3/users/${encodeURIComponent(userId)}/attributes`,
    { method: "PATCH", body: JSON.stringify(attributes) }
  )

  // 204 -> null (success with no content)
  if (res == null) return null
  try {
    return normalizeUser(res)
  } catch {
    return null
  }
}

/* =============================================================================
   Users & Products by account
============================================================================= */

export async function getUsersByAccount(accountId: string): Promise<ZephrUser[]> {
  try {
    const accountUsersResponse = await adminApiCall(`/v3/accounts/${accountId}/users`)
    const accountUsers: ZephrAccountUser[] = Array.isArray(accountUsersResponse)
      ? accountUsersResponse
      : accountUsersResponse.results || accountUsersResponse.data || []

    return accountUsers.map((au) => ({
      user_id: au.user_id,
      account_id: au.account_id,
      user_type: au.user_type,
      identifiers: { email_address: au.user_email },
      attributes: au.attributes || {},
      email_verified: true,
    }))
  } catch (e) {
    console.error(`[getUsersByAccount] error for ${accountId}:`, e)
    return []
  }
}

// ---------------------------
// Helpers for user lifecycle
// ---------------------------

function parseUserFromAny(response: any): ZephrUser | null {
  if (!response) return null
  if (response.data && response.data.user_id) return response.data as ZephrUser
  if (response.user_id) return response as ZephrUser
  return null
}

/**
 * Try to find a user by email. The Zephr APIs aren’t fully consistent across tenants,
 * so we probe a couple of common shapes and normalize.
 */
export async function getUserByEmail(email: string): Promise<ZephrUser | null> {
  const enc = encodeURIComponent(email)
  const candidatePaths = [
    `/v3/users?email=${enc}`,                 // common
    `/v3/users?email_address=${enc}`,         // sometimes used
    `/v3/users/search?email_address=${enc}`,  // alternate search path
  ]

  for (const path of candidatePaths) {
    try {
      const res = await adminApiCall(path)
      // responses can be {results:[...]}, {data:[...]}, or a plain array
      const arr: any[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data)
        ? res.data
        : []

      const hit = arr.find(
        (u: any) =>
          u?.user_id &&
          (u?.identifiers?.email_address?.toLowerCase?.() === email.toLowerCase() ||
            u?.user_email?.toLowerCase?.() === email.toLowerCase())
      )
      if (hit) {
        // normalize user shape
        const user: ZephrUser = {
          user_id: hit.user_id,
          identifiers: hit.identifiers ?? { email_address: hit.user_email ?? email },
          attributes: hit.attributes ?? {},
          email_verified: !!hit.email_verified,
          created_date: hit.created_date,
          modified_date: hit.modified_date,
          account_id: hit.account_id,
          user_type: hit.user_type,
        }
        return user
      }
    } catch (e) {
      // try next strategy
      console.warn(`[getUserByEmail] probe failed for ${path}:`, e)
    }
  }

  return null
}

/**
 * Create a user (minimal body works; add attributes if you have them).
 */
export async function createUser(args: {
  email: string
  attributes?: Record<string, any>
  email_verified?: boolean
}): Promise<ZephrUser> {
  const body = {
    identifiers: { email_address: args.email },
    attributes: args.attributes ?? {},
    // Some Zephr tenants accept top-level email_verified on create
    ...(typeof args.email_verified === "boolean" ? { email_verified: args.email_verified } : {}),
  }

  const resp = await adminApiCall(`/v3/users`, {
    method: "POST",
    body: JSON.stringify(body),
  })

  const user = parseUserFromAny(resp)
  if (!user) {
    console.warn(`[createUser] Unexpected create response shape:`, resp)
    // last-resort normalization
    return {
      user_id: resp?.user_id ?? resp?.data?.user_id ?? "",
      identifiers: resp?.identifiers ?? resp?.data?.identifiers ?? { email_address: args.email },
      attributes: resp?.attributes ?? resp?.data?.attributes ?? {},
      email_verified: !!(resp?.email_verified ?? resp?.data?.email_verified),
    }
  }
  return user
}

/**
 * Update core user fields (e.g., email_verified). This is different from your
 * existing updateUserAttributes(), which only touches the /attributes subresource.
 */
export async function updateUser(userId: string, patch: Partial<Pick<ZephrUser, "email_verified" | "attributes" | "user_type">>) {
  const resp = await adminApiCall(`/v3/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
  return parseUserFromAny(resp) ?? resp
}

/**
 * Ensure a user exists for an email. If found, optionally mark verified; else create.
 */
export async function ensureUserExists(
  email: string,
  opts?: { emailVerified?: boolean; attributes?: Record<string, any> }
): Promise<{ user: ZephrUser; created: boolean }> {
  // 1) try to find
  const existing = await getUserByEmail(email)
  if (existing) {
    if (opts?.emailVerified && !existing.email_verified) {
      try {
        await updateUser(existing.user_id, { email_verified: true })
        existing.email_verified = true
      } catch (e) {
        console.warn(`[ensureUserExists] Failed to set email_verified on existing user ${existing.user_id}:`, e)
      }
    }
    return { user: existing, created: false }
  }

  // 2) create
  const user = await createUser({
    email,
    email_verified: !!opts?.emailVerified,
    attributes: opts?.attributes,
  })
  return { user, created: true }
}

/**
 * Attach user to an account. Different Zephr setups use different endpoints:
 *  - POST /v3/accounts/{accountId}/users { user_id }
 *  - PUT  /v3/accounts/{accountId}/users/{userId}
 * We’ll try POST first, then fall back to PUT.
 */
export async function addUserToAccount(accountId: string, userId: string) {
  // Preferred: POST with body
  try {
    return await adminApiCall(`/v3/accounts/${accountId}/users`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    })
  } catch (e) {
    console.warn(`[addUserToAccount] POST failed, will try PUT style:`, e)
  }

  // Fallback: id in path
  return adminApiCall(`/v3/accounts/${accountId}/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify({}), // some tenants require a body; harmless if ignored
  })
}

// Friendly alias to match the UI route example I gave you earlier:
export const attachUserToAccount = (args: { accountId: string; userExternalId: string }) =>
  addUserToAccount(args.accountId, args.userExternalId)


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
    // tolerate snake_case and camelCase
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
