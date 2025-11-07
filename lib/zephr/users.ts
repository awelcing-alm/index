"use server"

import "server-only"
import { adminApiCall } from "./http"
import { ZephrAccountUser, ZephrUser } from "./types"

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

  if (res == null) return null
  try {
    return normalizeUser(res)
  } catch {
    return null
  }
}

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

// Create or fetch a user by email; returns created flag
export async function ensureUserExists(email: string, opts?: { emailVerified?: boolean }): Promise<{ user: ZephrUser; created: boolean }> {
  const e = String(email || "").trim()
  if (!e) throw new Error("email is required")
  // 1) Try to find existing via likely query endpoint(s)
  try {
    const candidates = [
      `/v3/users?email_address=${encodeURIComponent(e)}`,
      `/v3/users?email=${encodeURIComponent(e)}`,
    ]
    for (const path of candidates) {
      try {
        const data = await adminApiCall(path, { method: "GET" })
        const list: any[] = Array.isArray((data as any)?.results) ? (data as any).results : (Array.isArray(data) ? data : [])
        if (list.length) return { user: normalizeUser(list[0]), created: false }
      } catch {}
    }
  } catch {}
  // 2) Create
  const payload = {
    identifiers: { email_address: e },
    attributes: { email_verified: opts?.emailVerified ?? true },
  }
  const created = await adminApiCall(`/v3/users`, { method: "POST", body: JSON.stringify(payload) })
  return { user: normalizeUser(created), created: true }
}

// Attach a user (by external/user id) to an account
export async function attachUserToAccount({ accountId, userExternalId }: { accountId: string; userExternalId: string }): Promise<void> {
  const id = String(accountId || "").trim()
  const uid = String(userExternalId || "").trim()
  if (!id || !uid) throw new Error("accountId and userExternalId are required")
  // Try common shapes
  const bodies = [
    { user_id: uid },
    { id: uid },
    { userExternalId: uid },
  ]
  let lastErr: any = null
  for (const body of bodies) {
    try {
      await adminApiCall(`/v3/accounts/${encodeURIComponent(id)}/users`, { method: "POST", body: JSON.stringify(body) })
      return
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr || new Error("attachUserToAccount failed")
}
