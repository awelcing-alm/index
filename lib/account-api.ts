// lib/account-api.ts
import type { ZephrAccount, ZephrAccountsResponse } from "@/lib/zephr-types"

const DEFAULT_RPP = 50
const MAX_PAGES = Number(process.env.ACCOUNTS_MAX_PAGES ?? "8")         // hard cap
const ZERO_HIT_BREAK_AFTER = Number(process.env.ACCOUNTS_ZERO_PAGE_STOP ?? "2") // early-stop if N empty pages in a row

// ------- Active account store (client-safe) -------
let _activeAccount: ZephrAccount | undefined

export function setActiveAccount(account: ZephrAccount | undefined) {
  _activeAccount = account
}
export function getActiveAccount(): ZephrAccount | undefined {
  return _activeAccount
}
export function getActiveAccountId(): string | undefined {
  return _activeAccount?.account_id
}

// ------- Server-only helper (lazy import adminApiCall) -------
export async function getAccountsByOwner(ownerEmail: string): Promise<ZephrAccount[]> {
  const { adminApiCall } = await import("./api-client")

  const rpp = DEFAULT_RPP
  const owned: ZephrAccount[] = []

  // 1) Try a targeted request first (if backend supports filtering on email_address)
  try {
    const targeted = (await adminApiCall(
      `/v3/accounts?email_address=${encodeURIComponent(ownerEmail)}&page=1&rpp=${rpp}`
    )) as Partial<ZephrAccountsResponse> | any

    const results = Array.isArray(targeted?.results) ? targeted.results : Array.isArray(targeted) ? targeted : []
    if (results.length > 0) {
      return results.filter((a: ZephrAccount) => a.email_address?.toLowerCase() === ownerEmail.toLowerCase())
    }
  } catch {
    // ignore and fall back to paged scan
  }

  // 2) Fallback: paged scan but with caps + early stop
  let page = 1
  let zeroHitStreak = 0

  // fetch first page to know total (but don't trust it blindly)
  const first = (await adminApiCall(`/v3/accounts?page=${page}&rpp=${rpp}`)) as ZephrAccountsResponse
  const totalPages = Math.max(1, Math.ceil((first.total ?? rpp) / rpp))
  const limit = Math.min(totalPages, MAX_PAGES)

  const collect = (resp: ZephrAccountsResponse) => {
    const pageOwned = resp.results.filter(
      (a) => a.email_address?.toLowerCase() === ownerEmail.toLowerCase()
    )
    if (pageOwned.length === 0) zeroHitStreak += 1
    else zeroHitStreak = 0
    owned.push(...pageOwned)
  }

  collect(first)

  while (page < limit) {
    if (zeroHitStreak >= ZERO_HIT_BREAK_AFTER) break
    page += 1

    const resp = (await adminApiCall(`/v3/accounts?page=${page}&rpp=${rpp}`)) as ZephrAccountsResponse
    collect(resp)
  }

  return owned
}
