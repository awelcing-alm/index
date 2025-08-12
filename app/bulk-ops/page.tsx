// app/bulk-ops/page.tsx
import { cookies } from "next/headers"
import { BulkOpsPage } from "@/components/pages/bulk-ops-page"
import { MainLayout } from "@/components/main-layout"
import { adminApiCall } from "@/lib/zephr-api"
import type { ZephrAccount } from "@/lib/zephr-types" // ✅

export const runtime = "nodejs"

export default async function BulkOps() {
  // In your build, cookies() -> Promise<ReadonlyRequestCookies>
  const c = await cookies()
  const accountId = c.get("active_account_id")?.value ?? null

  let activeAccount: ZephrAccount | undefined
  if (accountId) {
    try {
      const raw = (await adminApiCall(`/v3/accounts/${accountId}`, { method: "GET" })) as
        | ZephrAccount
        | { data: ZephrAccount }

      activeAccount = ("data" in (raw as any) ? (raw as any).data : raw) as ZephrAccount
    } catch (err) {
      console.error("Failed to fetch active account", err)
    }
  }

  return (
    <MainLayout>
      <BulkOpsPage activeAccount={activeAccount} />
    </MainLayout>
  )
}
