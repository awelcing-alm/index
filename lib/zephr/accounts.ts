"use server"

import "server-only"
import { adminApiCall } from "./http"
import { HAS_ADMIN_KEYS, ACCOUNTS_TTL_MS } from "./env"
import { ZephrAccount, ZephrAccountsResponse } from "./types"
import { logServer } from "@/lib/logger"

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

    for (const a of results) {
      if (a?.email_address?.toLowerCase() === want) owned.push(a)
    }

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
    if (page > 10000) break
  }

  memoSetAccounts(ownerEmail, owned)
  return owned
}
