// lib/with-account-rls.ts
import { withRlsTx } from "@/lib/db-rls"
import { getCurrentUser } from "@/lib/zephr-api"
import type { sql as SqlType } from "@/lib/db"

// Pass the transaction-bound query client (`q`) to your queries.
export async function withAccountRls<T>(
  fn: (q: typeof SqlType) => Promise<T>,
  opts?: { accountId?: string; role?: "owner" | "admin" | "viewer" }
) {
  const session = await getCurrentUser()
  const acct = session?.activeAccount
  const accountId =
    opts?.accountId ?? (acct as any)?.account_id ?? (acct as any)?.id ?? null
  const role = opts?.role ?? (session as any)?.role ?? "admin"

  if (!accountId) throw new Error("No active account to scope RLS")

  return withRlsTx({ accountId, role }, fn)
}
