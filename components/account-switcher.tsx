"use client"

import { useEffect, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { switchAccount } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"
import type { ZephrAccount } from "@/lib/zephr-api"
import { setActiveAccount } from "@/lib/account-api"

interface AccountSwitcherProps {
  accounts: ZephrAccount[]
  activeAccount?: ZephrAccount
}

export function AccountSwitcher({ accounts, activeAccount }: AccountSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // 🟢  Keep the central active‑account store in sync on first render / prop change
  useEffect(() => {
    setActiveAccount(activeAccount)
  }, [activeAccount])

  const handleAccountChange = (accountId: string) => {
    startTransition(async () => {
      await switchAccount(accountId)
      // server action sets cookie; when page refreshes, server will send new activeAccount prop
      router.refresh()
    })
  }

  if (accounts.length <= 1) {
    return (
      <div className="text-sm">
        <p className="text-white font-medium">{activeAccount?.name || "No Account"}</p>
      </div>
    )
  }

  return (
    <div className="relative z-50">
      <Select value={activeAccount?.account_id} onValueChange={handleAccountChange} disabled={isPending}>
        <SelectTrigger className="min-w-[200px] max-w-[300px] bg-white/5 border-white/10 text-white hover:bg-white/10">
          <SelectValue placeholder="Select account" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 z-50 min-w-[200px] max-w-[300px]">
          {accounts.map((account) => (
            <SelectItem
              key={account.account_id}
              value={account.account_id}
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              <div className="w-full">
                <p className="font-medium truncate">{account.name}</p>
                <p className="text-xs text-gray-400">{account.number_of_seats} seats</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
