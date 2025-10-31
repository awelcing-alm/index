import { MainLayout } from "@/components/main-layout"
import GroupUsagePage from "@/components/pages/group-usage-page"
import { getCurrentUser, getUsersForCurrentAccount } from "@/lib/zephr-api"
import { listGroups } from "@/lib/groups"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function GroupsAnalyticsPage() {
  const session = await getCurrentUser()
  const acct = session?.activeAccount
  if (!acct) {
    return (
      <MainLayout>
        <div className="p-6 text-[hsl(var(--muted-foreground))]">No active account selected</div>
      </MainLayout>
    )
  }
  const accountId = (acct as any).account_id ?? (acct as any).id
  const [users, groups] = await Promise.all([
    getUsersForCurrentAccount(),
    listGroups(accountId),
  ])
  return (
    <MainLayout>
      <GroupUsagePage users={users as any} groups={groups as any} />
    </MainLayout>
  )
}
