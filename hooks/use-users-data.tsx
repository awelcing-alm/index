"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  })
  const raw = await res.text().catch(() => "")
  let data: any = null
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {}
  return { res, data, raw }
}

type Membership = { group_id: string; name: string | null; icon: string | null }

export function useUsersData({ users, groups }: { users: any[]; groups: any[] }) {
  const [profilesByUser, setProfilesByUser] = useState<Record<string, any>>({})
  const [productGrants, setProductGrants] = useState<{ [k: string]: boolean } | null>(null)
  const [sessionsByUser, setSessionsByUser] = useState<Record<string, { lastSession?: string; count?: number }>>({})
  const [membershipByUser, setMembershipByUser] = useState<Record<string, Membership>>({})
  const hydratedAllRef = useRef(false)
  const [, startTransition] = useTransition()

  // Load product grants once
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates/products/grants", { cache: "no-store", headers: { Accept: "application/json" } })
        const payload = await res.json().catch(() => ({}))
        const g = payload?.grants || {}
        if (!alive) return
        setProductGrants({ radar: !!g.radar, mylaw: true, compass: !!g.compass, scholar: !!g.scholar })
      } catch {
        if (alive) setProductGrants({ radar: false, mylaw: true, compass: false, scholar: false })
      }
    })()
    return () => { alive = false }
  }, [])

  // Batch-membership load
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
    })()

    return () => { cancelled = true }
  }, [users])

  const refreshMemberships = useCallback(async (userIds: string[]) => {
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
      })
    } catch (e) {
      console.error("refreshMemberships failed", e)
    }
  }, [startTransition])

  const reprobeProfiles = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return
    try {
      const qs = encodeURIComponent(userIds.join(","))
      const res = await fetch(`/api/users/extended-profiles/availability?user_ids=${qs}`, { cache: "no-store", headers: { Accept: "application/json" } })
      if (!res.ok) return
      const payload = await res.json().catch(() => null)
      const map = (payload && payload.availability) || {}
      setProfilesByUser((prev) => ({ ...prev, ...map }))
    } catch {}
  }, [])

  const reprobeSessions = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return
    try {
      const qs = encodeURIComponent(userIds.join(","))
      const res = await fetch(`/api/users/sessions?user_ids=${qs}`, { cache: "no-store", headers: { Accept: "application/json" } })
      if (!res.ok) return
      const payload = await res.json().catch(() => null)
      const map = (payload && payload.sessions) || {}
      setSessionsByUser((prev) => ({ ...prev, ...map }))
    } catch {}
  }, [])

  return {
    profilesByUser,
    setProfilesByUser,
    productGrants,
    sessionsByUser,
    setSessionsByUser,
    membershipByUser,
    setMembershipByUser,
    hydratedAll: hydratedAllRef.current,
    refreshMemberships,
    reprobeProfiles,
    reprobeSessions,
  }
}
