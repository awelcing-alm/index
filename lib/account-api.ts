import { adminApiCall } from "./api-client"

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

// ---------------------------------------------------------------------------
// 🔐 Active‑account tracking
// ---------------------------------------------------------------------------
// The page that handles account switching should call `setActiveAccount()` once
// it has resolved the ZephrAccount object (e.g., after `switchAccount()` and
// server refresh). Any downstream code – including the /api/bulk‑users route –
// can then call `getActiveAccount()` or `getActiveAccountId()` to obtain the
// single, authoritative account context.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 📥  Utility to fetch *only* the accounts owned by a given email address.
// ---------------------------------------------------------------------------
export async function getAccountsByOwner(ownerEmail: string): Promise<ZephrAccount[]> {
  let page = 1
  const rpp = 50
  let hasMorePages = true
  const userAccounts: ZephrAccount[] = []

  while (hasMorePages) {
    const accountsResponse: ZephrAccountsResponse = await adminApiCall(`/v3/accounts?page=${page}&rpp=${rpp}`)

    const ownedAccounts = accountsResponse.results.filter((account) =>
      account.email_address?.toLowerCase() === ownerEmail.toLowerCase(),
    )

    userAccounts.push(...ownedAccounts)

    const totalPages = Math.ceil(accountsResponse.total / rpp)
    hasMorePages = page < totalPages
    page++
  }

  return userAccounts
}
