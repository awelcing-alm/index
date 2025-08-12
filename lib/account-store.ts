// lib/account-store.ts
import type { ZephrAccount } from "@/lib/zephr-types"

// In-memory store is fine on the client (per tab/session)
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
