"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getActiveAccountId } from "@/lib/account-store"

type Props = {
  /** Optional explicit accountId; if omitted we read from getActiveAccountId() */
  accountId?: string
  className?: string
  onDone?: (result: any) => void
}

export default function SyncUsersButton({ accountId, className, onDone }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  const acctId = useMemo(() => accountId ?? getActiveAccountId() ?? "", [accountId])

  const onClick = async () => {
    setErr(null)
    setOkMsg(null)

    if (!acctId) {
      setErr("No active account selected.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/sync/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: acctId }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || `Sync failed (HTTP ${res.status})`)
      }

      setOkMsg(
        `Synced ${data.total ?? 0} (created ${data.created ?? 0}, updated ${data.updated ?? 0}, skipped ${data.skipped ?? 0}).`
      )
      onDone?.(data)
      // Refresh any RSC/SSR data depending on users
      router.refresh()
    } catch (e: any) {
      setErr(e?.message ?? "Sync failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={onClick}
        disabled={loading}
        className="rounded-none bg-ink text-paper hover:bg-ink/90 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Syncing…
          </>
        ) : (
          <>Sync Users</>
        )}
      </Button>

      {err && <p className="mt-2 text-sm text-[hsl(var(--destructive))]">{err}</p>}
      {okMsg && <p className="mt-2 text-sm text-green-700">{okMsg}</p>}
    </div>
  )
}
