// lib/zephr-api.ts
"use server"

import "server-only"
import crypto from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { logServer } from "@/lib/logger"
// NOTE: next provides a helper to detect redirect exceptions
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { isRedirectError } from "next/dist/client/components/redirect"

/* =============================================================================
   ENV
============================================================================= */

const ZEPHR_BASE_URL =
  process.env.ZEPHR_BASE_URL || "https://alm.api.zephr.com"
const ZEPHR_PUBLIC_BASE_URL =
  process.env.ZEPHR_PUBLIC_BASE_URL || "alm-lawcom-live.non-prod.cdn.zephr.com"
const ZEPHR_ACCESS_KEY = process.env.ZEPHR_ACCESS_KEY!
const ZEPHR_SECRET_KEY = process.env.ZEPHR_SECRET_KEY!
const HAS_ADMIN_KEYS = !!(process.env.ZEPHR_ACCESS_KEY && process.env.ZEPHR_SECRET_KEY)

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

  try {
    const res = await fetch(`${ZEPHR_BASE_URL}${path}`, fetchOptions)

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      logServer("adminApiCall_error", { method, path, status: res.status, text })
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
  } catch (err: any) {
    logServer("adminApiCall_exception", { method, path, error: err?.message })
    throw err
  }
}

export async function publicApiCall(path: string, options: RequestInit = {}) {
  const url = `https://${ZEPHR_PUBLIC_BASE_URL}${path}`
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      logServer("publicApiCall_error", { method: options.method || "GET", path, status: res.status, text })
      throw new Error(
        `Public API ${options.method || "GET"} ${path} failed: ${res.status} ${res.statusText} - ${text}`,
      )
    }
    return res
  } catch (err: any) {
    logServer("publicApiCall_exception", { method: options.method || "GET", path, error: err?.message })
    throw err
  }
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

  if (!HAS_ADMIN_KEYS) {
    logServer("getAccountsByOwner_skipped_no_keys", { ownerEmail })
    return []
  }

  const rpp = 200
  const owned: ZephrAccount[] = []
  const want = ownerEmail.toLowerCase()

  let page = 1
  let totalPages: number | null = null

  while (true) {
    let resp: any
    try {
      resp = await adminApiCall(`/v3/accounts?page=${page}&rpp=${rpp}`)
    } catch (e: any) {
      logServer("getAccountsByOwner_admin_fail", { page, error: e?.message })
      break
    }

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
    logServer("login_start", { email })
    const loginResponse = await publicApiCall("/blaize/login", {
      method: "POST",
      body: JSON.stringify({
        identifiers: { email_address: email },
        validators: { password },
      }),
    })

    const setCookieHeader = loginResponse.headers.get("set-cookie") || ""
    const cookieMatch = setCookieHeader.match(/blaize_session=([^;]+)/)
    const sessionCookie = cookieMatch ? cookieMatch[1] : ""

    const accounts = HAS_ADMIN_KEYS ? await getAccountsByOwner(email) : []
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

    logServer("login_success", { email, isAdmin, accounts: accounts.length })

    return { success: true, isAdmin, userEmail: email, accounts }
  } catch (err: any) {
    logServer("login_error", { email, error: err?.message })
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