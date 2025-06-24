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
