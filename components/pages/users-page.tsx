// components/pages/users-page.tsx
import { Suspense } from "react"

/* ---------- server helpers ---------- */
import { getCurrentUser, getUsersForCurrentAccount } from "@/lib/zephr-api"
import { listGroups } from "@/lib/groups"

/* ---------- ui ---------- */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Users as UsersIcon } from "lucide-react"

/* ---------- client table (default export from users-table/index.tsx) ---------- */
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

  const accountId = (acct as any).account_id ?? (acct as any).id ?? ""

  const [usersRes, groupsRes] = await Promise.allSettled([
    getUsersForCurrentAccount(),
    listGroups(accountId),
  ])

  const users: UiUser[] =
    usersRes.status === "fulfilled" ? (usersRes.value as UiUser[]) : []

  // `UsersTable` accepts GroupWithCount (has optional user_count),
  // so this cast is fine even if your server returns plain Group.
  const groups: GroupWithCount[] =
    groupsRes.status === "fulfilled"
      ? (groupsRes.value as GroupWithCount[])
      : []

  const loadError =
    usersRes.status === "rejected"
      ? usersRes.reason?.message ?? "Unknown error"
      : null

  return (
    <Card className="rounded-none border border-line bg-paper">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-2xl text-ink">
          <UsersIcon className="h-6 w-6" aria-hidden="true" />
          Account Users — {(acct as any)?.name ?? "Account"}
        </CardTitle>
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
            {/* Pass users + groups (with user_count if present) to the client table */}
            <UsersTable users={users} groups={groups} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  )
}

export default UsersPage
export { UsersPage }
