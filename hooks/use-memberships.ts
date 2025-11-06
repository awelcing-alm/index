"use client"

import { useEffect, useRef, useState, useTransition } from "react"

export type Membership = { group_id: string; name: string | null; icon: string | null }

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store", headers: { Accept: "application/json", ...(init?.headers || {}) }, ...init })
  const raw = await res.text().catch(() => "")
  let data: any = null
  try { data = raw ? JSON.parse(raw) : null } catch {}
  return { res, data, raw }
}

export function useMembershipsGlobal(users: Array<{ user_id: string }>, setRows: (updater: (prev: any[]) => any[]) => void) {
  const [membershipByUser, setMembershipByUser] = useState<Record<string, Membership>>({})
  const hydratedAllRef = useRef(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!users?.length) {
      hydratedAllRef.current = true
      setMembershipByUser({})
      return
    }
    const CHUNK = 200
    let cancelled = false

    ;(async () => {
      const userIds = users.map((u) => u.user_id)
      const chunks: string[][] = []
      for (let i = 0; i < userIds.length; i += CHUNK) chunks.push(userIds.slice(i, i + CHUNK))

      const aggregate: Record<string, Membership> = {}
      for (const ids of chunks) {
        if (cancelled) return
        const qs = encodeURIComponent(ids.join(","))
        const { res, data } = await fetchJson(`/api/groups/membership?user_ids=${qs}`)
        if (!res.ok || !data?.ok) continue
        Object.assign(aggregate, data.memberships || {})
      }
      if (cancelled) return

      hydratedAllRef.current = true
      setMembershipByUser(aggregate)

      setRows((prev: any[]) => prev.map((u: any) => {
        const m = aggregate[u.user_id]
        return m ? { ...u, group_id: m.group_id, group_icon: m.icon, group_name: m.name ?? undefined } : u
      }))
    })()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(users.map((u) => u.user_id))])

  const refreshMemberships = async (userIds: string[]) => {
    if (!userIds.length) return
    try {
      const qs = encodeURIComponent(userIds.join(","))
      const res = await fetch(`/api/groups/membership?user_ids=${qs}`, { cache: "no-store", headers: { Accept: "application/json" } })
      if (!res.ok) return
      const payload = (await res.json()) as { ok: boolean; memberships: Record<string, Membership> }
      if (!payload?.ok) return
      const byUser = payload.memberships || {}

      startTransition(() => {
        setMembershipByUser((prev) => ({ ...prev, ...byUser }))
        setRows((prev: any[]) => prev.map((u: any) => {
          const m = byUser[u.user_id]
          return m ? { ...u, group_id: m.group_id, group_icon: m.icon, group_name: m.name ?? undefined } : u
        }))
      })
    } catch {}
  }

  return { membershipByUser, setMembershipByUser, refreshMemberships, hydratedAllRef }
}
