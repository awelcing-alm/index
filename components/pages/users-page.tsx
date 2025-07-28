// components/pages/users-page.tsx
import { Suspense } from "react";
import { cookies } from "next/headers";

/* ---------- server helpers ---------- */
import {
  getCurrentUser,
  getUsersForCurrentAccount,
} from "@/lib/auth-actions";
import { listTeams } from "@/lib/teams";

/* ---------- ui ---------- */
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Users as UsersIcon } from "lucide-react";

/* ---------- client component ---------- */

export async function UsersPage() {
  const session = await getCurrentUser();
  const acct = (session as any)?.activeAccount;

  if (!acct) {
    return (
      <Card className="bg-transparent border border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <UsersIcon className="w-5 h-5" /> Account Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-700/20">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>No active account selected</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const cookieStore = await cookies();
  const accountId =
    (acct as any).id ??
    (acct as any).account_id ??
    cookieStore.get("active_account_id")?.value ??
    "";

  // fetch users and teams in parallel
  const [usersRes, teamsRes] = await Promise.allSettled([
    getUsersForCurrentAccount(),
    listTeams(accountId),
  ]);

  const users =
    usersRes.status === "fulfilled" ? usersRes.value : ([] as any[]);
  const teams =
    teamsRes.status === "fulfilled" ? teamsRes.value : ([] as any[]);
  const loadError =
    usersRes.status === "rejected"
      ? usersRes.reason?.message ?? "Unknown error"
      : null;

  return (
    <Card className="bg-transparent border border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <UsersIcon className="w-5 h-5" /> Account Users —{" "}
          {(acct as any).name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loadError ? (
          <Alert variant="destructive" className="bg-red-700/20">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Failed to load users: {loadError}
            </AlertDescription>
          </Alert>
        ) : (
          <>

            {/* Link to team management */}
            <div className="mt-4">
              <a
                href="/teams"
                className="text-sm text-blue-400 underline hover:text-blue-300"
              >
                Manage Teams
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UsersPage;
