import { getCurrentUser, logoutUser } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Building } from "lucide-react";
import { AccountSwitcher } from "@/components/account-switcher";

export async function UserHeader() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-0">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        {/* Left side: identity + account */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-ink" aria-hidden="true" />
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Logged in as:</p>
              <p className="font-medium text-ink">{user.email}</p>
            </div>

            {user.isAdmin && (
              <span
                className="rounded-none border border-line px-2 py-0.5 text-xs"
                aria-label="Admin"
                title="Administrator"
              >
                <span className="smallcaps text-ink">Admin</span>
              </span>
            )}
          </div>

          {user.accounts?.length ? (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
              <div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Account:</p>
                <AccountSwitcher accounts={user.accounts} activeAccount={user.activeAccount} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Right side: actions */}
        <form action={logoutUser}>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none text-ink hover:bg-[hsl(var(--muted))] hover:text-ink"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
