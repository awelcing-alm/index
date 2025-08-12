"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { switchAccount } from "@/lib/auth-actions";
import { setActiveAccount } from "@/lib/account-store";
import type { ZephrAccount } from "@/lib/zephr-types";

interface AccountSwitcherProps {
  accounts: ZephrAccount[];
  activeAccount?: ZephrAccount;
}

export function AccountSwitcher({ accounts, activeAccount }: AccountSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setActiveAccount(activeAccount);
  }, [activeAccount]);

  const handleAccountChange = (accountId: string) => {
    startTransition(async () => {
      await switchAccount(accountId);
      router.refresh();
    });
  };

  if (!accounts || accounts.length <= 1) {
    return (
      <div className="text-sm">
        <p className="font-medium text-ink">{activeAccount?.name || "No Account"}</p>
      </div>
    );
  }

  return (
    <div className="relative z-50">
      <Select
        value={activeAccount?.account_id}
        onValueChange={handleAccountChange}
        disabled={isPending}
      >
        <SelectTrigger
          className="min-w-[200px] max-w-[300px] rounded-none border border-line bg-paper text-ink hover:bg-[hsl(var(--muted))]"
          aria-label="Select account"
        >
          <SelectValue placeholder="Select account" />
        </SelectTrigger>

        <SelectContent
          className="z-50 min-w-[200px] max-w-[300px] rounded-none border border-line bg-paper"
          position="popper"
          align="start"
        >
          {accounts.map((account) => (
            <SelectItem
              key={account.account_id}
              value={account.account_id}
              className="rounded-none text-ink hover:bg-[hsl(var(--muted))] focus:bg-[hsl(var(--muted))]"
            >
              <div className="w-full">
                <p className="truncate font-medium text-ink">{account.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {account.number_of_seats} seats
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* subtle busy hint for screen readers */}
      {isPending && (
        <span className="sr-only" aria-live="polite">
          Switching account…
        </span>
      )}
    </div>
  );
}
