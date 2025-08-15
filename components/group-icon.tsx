// components/group-icon.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import type { Group } from "@/lib/groups"

const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

type Membership = { group_id: string; name: string | null; icon: string | null }
type MembershipMap = Record<string, Membership>

export function useMembershipMap(userIds: string[]) {
  const [data, setData] = useState<MembershipMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const key = useMemo(() => userIds.slice().sort().join(","), [userIds])

  useEffect(() => {
    if (!userIds || userIds.length === 0) {
      setData({})
      setError(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(
          `/api/groups/membership?user_ids=${encodeURIComponent(userIds.join(","))}`,
          { cache: "no-store" }
        )
        const json = await res.json()
        if (!cancelled) {
          if (!res.ok || !json?.ok) {
            setError(json?.error || "Failed to load memberships")
            setData({})
          } else {
            setData(json.memberships || {})
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load memberships")
          setData({})
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [key])

  return { data, loading, error }
}

export function GroupIconForUser({
  userId,
  groupsById,
  membershipMap,
  fallbackGroupId,
  fallbackIcon,
  fallbackName,
}: {
  userId: string
  groupsById: Record<string, Group>
  membershipMap: MembershipMap
  fallbackGroupId?: string | null
  fallbackIcon?: string | null
  fallbackName?: string | null
}) {
  const m = membershipMap[userId]

  const groupId = m?.group_id ?? fallbackGroupId ?? null
  const g = groupId ? groupsById[groupId] : undefined

  const iconKey = (m?.icon ?? g?.icon ?? fallbackIcon ?? "") as string
  const title = (m?.name ?? g?.name ?? fallbackName ?? "Group") as string

  if (!groupId && !iconKey) {
    return <span className="text-[hsl(var(--muted-foreground))]">—</span>
  }

  const emoji = GROUP_ICON_EMOJI[iconKey] ?? "📁"

  return (
    <span className="text-lg leading-none" title={title} aria-label={title}>
      {emoji}
    </span>
  )
}
