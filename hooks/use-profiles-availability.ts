"use client"

import { useEffect, useState } from "react"

export function useProfilesAvailability(userIds: string[], deps: any[] = []) {
  const [profilesByUser, setProfilesByUser] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    if (!userIds.length) return
    let alive = true
    ;(async () => {
      try {
        const qs = encodeURIComponent(userIds.join(","))
        const res = await fetch(`/api/users/extended-profiles/availability?user_ids=${qs}`, { cache: "no-store", headers: { Accept: "application/json" } })
        if (!res.ok) return
        const payload = await res.json().catch(() => null)
        const map = (payload && payload.availability) || {}
        if (alive) setProfilesByUser((prev) => ({ ...prev, ...map }))
      } catch {}
    })()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userIds), ...deps])

  const reprobe = async (ids: string[]) => {
    if (!ids.length) return
    try {
      const qs = encodeURIComponent(ids.join(","))
      const res = await fetch(`/api/users/extended-profiles/availability?user_ids=${qs}`, { cache: "no-store", headers: { Accept: "application/json" } })
      if (!res.ok) return
      const payload = await res.json().catch(() => null)
      const map = (payload && payload.availability) || {}
      setProfilesByUser((prev) => ({ ...prev, ...map }))
    } catch {}
  }

  return { profilesByUser, setProfilesByUser, reprobe }
}
