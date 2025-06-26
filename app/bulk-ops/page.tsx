// app/bulk-ops/page.tsx – server component
// Resolves the active account via cookie + Admin API and renders BulkOpsPage.
import { cookies } from "next/headers"
import { BulkOpsPage } from "@/components/pages/bulk-ops-page"
import { MainLayout } from "@/components/main-layout"
import { adminApiCall } from "@/lib/zephr-api"
import type { ZephrAccount } from "@/lib/zephr-api"

export default async function BulkOps() {
  // 1️⃣ Fetch the `active_account_id` cookie set by switchAccount(accountId)
  const cookieStore = await cookies()
  const accountId = cookieStore.get("active_account_id")?.value

  let activeAccount: ZephrAccount | undefined
  if (accountId) {
    try {
      // adminApiCall sometimes wraps data under `.data`; handle both shapes
      const raw = (await adminApiCall(`/v3/accounts/${accountId}`, { method: "GET" })) as
        | ZephrAccount
        | { data: ZephrAccount }

      activeAccount = ("data" in raw ? raw.data : raw) as ZephrAccount
    } catch (err) {
      console.error("Failed to fetch active account", err)
      // leave activeAccount undefined so UI shows disabled state
    }
  }

  return (
    <MainLayout>
      <BulkOpsPage activeAccount={activeAccount} />
    </MainLayout>
  )
}
