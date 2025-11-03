import { getCurrentUser, logoutUser, getUsersForCurrentAccount } from "@/lib/zephr-api";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Building, Radar as RadarIcon, Compass as CompassIcon, GraduationCap, BookOpen } from "lucide-react";
import { AccountSwitcher } from "@/components/account-switcher";
import { probeKnownUserApps } from "@/lib/extended-profile";

export async function UserHeader() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Subtle profile availability for the signed-in user (best-effort)
  let profileFlags: { radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean } | null = null;
  try {
    const list = await getUsersForCurrentAccount();
    const self = list.find((u) => (u.identifiers?.email_address || "").toLowerCase() === (user.email || "").toLowerCase());
    if (self?.user_id) {
      const probes = await probeKnownUserApps(self.user_id);
      profileFlags = {
        radar: !!probes.find((p) => p.key === "radar" && p.exists),
        compass: !!probes.find((p) => p.key === "compass" && p.exists),
        scholar: !!probes.find((p) => p.key === "scholar" && p.exists),
        mylaw: !!probes.find((p) => p.key === "mylaw" && p.exists),
      };
    }
  } catch {
    profileFlags = null;
  }

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

        {/* Center/right: subtle profile indicators for the current user */}
        {profileFlags && (
          <div className="hidden items-center gap-2 md:flex" aria-label="Profile availability">
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Profiles:</span>
            <span title={profileFlags.radar ? "Radar profile available" : "No Radar profile"} className="rounded-none border border-line bg-paper p-1">
              <RadarIcon className={["h-3.5 w-3.5", profileFlags.radar ? "text-ink" : "text-[hsl(var(--muted-foreground))] opacity-60"].join(" ")} aria-hidden="true" />
            </span>
            <span title={profileFlags.mylaw ? "MyLaw profile available" : "No MyLaw profile"} className="rounded-none border border-line bg-paper p-1">
              <BookOpen className={["h-3.5 w-3.5", profileFlags.mylaw ? "text-ink" : "text-[hsl(var(--muted-foreground))] opacity-60"].join(" ")} aria-hidden="true" />
            </span>
            <span title={profileFlags.compass ? "Compass profile available" : "No Compass profile"} className="rounded-none border border-line bg-paper p-1">
              <CompassIcon className={["h-3.5 w-3.5", profileFlags.compass ? "text-ink" : "text-[hsl(var(--muted-foreground))] opacity-60"].join(" ")} aria-hidden="true" />
            </span>
            <span title={profileFlags.scholar ? "Scholar profile available" : "No Scholar profile"} className="rounded-none border border-line bg-paper p-1">
              <GraduationCap className={["h-3.5 w-3.5", profileFlags.scholar ? "text-ink" : "text-[hsl(var(--muted-foreground))] opacity-60"].join(" ")} aria-hidden="true" />
            </span>
          </div>
        )}

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
