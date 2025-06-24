import { getCurrentUser, logoutUser } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, Building } from "lucide-react"
import { AccountSwitcher } from "@/components/account-switcher"

export async function UserHeader() {
  const user = await getCurrentUser()

  if (!user) return null

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg p-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Logged in as:</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            {user.isAdmin && (
              <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                Admin
              </span>
            )}
          </div>

          {user.accounts && user.accounts.length > 0 && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Account:</p>
                <AccountSwitcher accounts={user.accounts} activeAccount={user.activeAccount} />
              </div>
            </div>
          )}
        </div>

        <form action={logoutUser}>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </form>
      </div>
    </header>
  )
}
