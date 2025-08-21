// components/pages/users-page.tsx
import { Suspense } from "react"

/* actions */
import { getCurrentUser, getUsersForCurrentAccount } from "@/lib/auth-actions"
import { listGroups } from "@/lib/groups"

/* ui */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Users as UsersIcon } from "lucide-react"

/* client controls (button + modal wrapper) */
import UsersExportControls from "@/components/users-export-controls"

/* client table */
import UsersTable from "./users-table"
import type { UiUser, GroupWithCount } from "./users-table"

async function UsersPage() {
  const session = await getCurrentUser()
  const acct = session?.activeAccount

  if (!acct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Alert className="max-w-md rounded-none border border-line bg-[hsl(var(--muted))]">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-ink">
            No active account selected
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Normalize account id from either source (Zephr vs DB)
  const accountId: string =
    (acct as any).account_id ??
    (typeof (acct as any).id !== "undefined" ? String((acct as any).id) : "")

  // Only include fields expected by the export controls (prevents excess-prop TS errors)
  const activeAccountRef = {
    account_id: accountId,
    name: (acct as any).name ?? "Account",
  } as const

  const [usersRes, groupsRes] = await Promise.allSettled([
    getUsersForCurrentAccount(),
    listGroups(accountId),
  ])

  const users: UiUser[] =
    usersRes.status === "fulfilled" ? (usersRes.value as UiUser[]) : []

  const groups: GroupWithCount[] =
    groupsRes.status === "fulfilled" ? (groupsRes.value as GroupWithCount[]) : []

  const loadError =
    usersRes.status === "rejected"
      ? usersRes.reason?.message ?? "Unknown error"
      : null

  return (
    <Card className="rounded-none border border-line bg-paper">
      <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
        <CardTitle className="flex items-center gap-2 font-serif text-2xl text-ink">
          <UsersIcon className="h-6 w-6" aria-hidden="true" />
          <span>Account Users — {activeAccountRef.name}</span>
        </CardTitle>

        {/* right-aligned actions */}
        <div className="flex items-center gap-2">
          <UsersExportControls activeAccount={activeAccountRef} />
        </div>
      </CardHeader>

      <CardContent>
        {loadError ? (
          <Alert variant="destructive" className="rounded-none">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>
              Failed to load users: {loadError}
            </AlertDescription>
          </Alert>
        ) : (
          <Suspense
            fallback={
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Loading…
              </p>
            }
          >
            <UsersTable users={users} groups={groups} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  )
}

export default UsersPage
export { UsersPage }
