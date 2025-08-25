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
   Accounts: targeted fetch → paged scan (with caps) + memo TTL
============================================================================= */

const DEFAULT_RPP = 50
const MAX_PAGES = Number(process.env.ACCOUNTS_MAX_PAGES ?? "8")
const ZERO_HIT_BREAK_AFTER = Number(process.env.ACCOUNTS_ZERO_PAGE_STOP ?? "2")
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
  const rpp = 200; // bump if the API allows
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

    // Collect matches on this page
    for (const a of results) {
      if (a?.email_address?.toLowerCase() === want) owned.push(a)
    }

    // Work out total pages (if the API provides a total)
    if (totalPages == null && resp && typeof resp === "object" && "total" in resp) {
      const total = (resp as Partial<ZephrAccountsResponse> & { total?: number }).total
      if (typeof total === "number" && total > 0) {
        totalPages = Math.max(1, Math.ceil(total / rpp))
      }
    }

    // Stop conditions
    const lastByTotal = totalPages != null && page >= totalPages
    const lastByShort = totalPages == null && results.length < rpp
    if (lastByTotal || lastByShort) break

    page += 1
    if (page > 10000) break // hard safety guard
  }

  return owned
}

/* =============================================================================
   Auth helpers (cookies) — consolidated from auth-actions
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

    const loginData = await loginResponse.json().catch(() => ({}))

    // Extract session cookie from Set-Cookie header if present
    const setCookieHeader = loginResponse.headers.get("set-cookie") || ""
    const cookieMatch = setCookieHeader.match(/blaize_session=([^;]+)/)
    const sessionCookie = cookieMatch ? cookieMatch[1] : ""

    // Fresh accounts (fixes “new owner not detected”)
    const accounts = await getAccountsByOwner(email)
    const isAdmin = accounts.length > 0

    const cookieStore = await cookies()

    if (sessionCookie) {
      cookieStore.set("zephr_session", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set("is_admin", String(isAdmin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set("user_accounts", JSON.stringify(accounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    if (accounts.length > 0) {
      cookieStore.set("active_account_id", accounts[0].account_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return { success: true, isAdmin, userEmail: email, accounts }
  } catch (err: any) {
    return { success: false, error: err?.message || "Login failed" }
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get("user_email")?.value
  const session = cookieStore.get("zephr_session")?.value
  const activeAccountIdCookie = cookieStore.get("active_account_id")?.value

  if (!userEmail) return null

  // get fresh accounts (memoized with TTL)
  const accounts = await getAccountsByOwner(userEmail)
  const isAdmin = accounts.length > 0

  // choose active account (prefer cookie if still valid)
  const activeAccount =
    accounts.find((a) => a.account_id === activeAccountIdCookie) || accounts[0]

  // best-effort: refresh cookies to keep them in sync
  try {
    cookieStore.set("is_admin", String(isAdmin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    cookieStore.set("user_accounts", JSON.stringify(accounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    if (activeAccount && activeAccount.account_id !== activeAccountIdCookie) {
      cookieStore.set("active_account_id", activeAccount.account_id, {
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
  const cookieStore = await cookies()
  cookieStore.set("active_account_id", accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("zephr_session")
  cookieStore.delete("user_email")
  cookieStore.delete("is_admin")
  cookieStore.delete("user_accounts")
  cookieStore.delete("active_account_id")
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
   Users & Products by account (existing impls kept)
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
  let grants: ZephrAccountGrant[] = []
  try {
    const resp = await adminApiCall(`/v3/accounts/${accountId}/grants`)
    if (Array.isArray(resp)) grants = resp
    else if (resp && typeof resp === "object") {
      if (Array.isArray(resp.results)) grants = resp.results
      else if (Array.isArray(resp.data)) grants = resp.data
    }
  } catch (e) {
    console.error(`[getProductsByAccount] grants fetch failed for ${accountId}:`, e)
    return []
  }

  const out: ZephrProductWithGrant[] = []
  for (const g of grants) {
    if (!g.grantId || (!g.product_id && !g.entitlement_id) || !g.entitlement_type) continue
    out.push({
      tenantId: accountId,
      id: g.product_id || g.entitlement_id,
      label: g.product_id ? `Product: ${g.product_id}` : `Entitlement: ${g.entitlement_id}`,
      description: `${g.entitlement_type} - Grant ID: ${g.grantId}`,
      entitlement: {
        id: g.entitlement_id || "unknown",
        type: g.entitlement_type,
        entitlementTenant: accountId,
      },
      grantId: g.grantId,
      startTime: g.startTime || "N/A",
      endTime: g.endTime || "N/A",
      expiry_state: g.expiry_state || "unknown",
    })
  }
  return out
}
