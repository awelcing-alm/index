"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export function LastSessionBadge({ userId }: { userId: string }) {
  const [label, setLabel] = React.useState<string>("—")
  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`/api/users/sessions?user_ids=${encodeURIComponent(userId)}`, { cache: "no-store" })
        const payload = await res.json().catch(() => null)
        const entry = payload?.sessions?.[userId]
        const iso = entry?.lastSession
        const count: number | undefined = entry?.count
        if (!alive) return
        if (!iso) { setLabel(count ? `Sessions: ${count}` : "never"); return }
        const d = new Date(iso)
        const diff = Date.now() - d.getTime()
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        const base = days <= 0 ? "Last session: today" : `Last session: ${days}d ago`
        setLabel(count ? `${base} • Sessions: ${count}` : base)
      } catch {
        if (alive) setLabel("—")
      }
    })()
    return () => { alive = false }
  }, [userId])
  return (
    <Badge variant="outline" className="rounded-none border-line text-xs text-ink">{label}</Badge>
  )
}
