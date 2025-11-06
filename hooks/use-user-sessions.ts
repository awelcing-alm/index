"use client"

import { useEffect, useState } from "react"

export function useUserSessions(userIds: string[], deps: any[] = []) {
  const [sessionsByUser, setSessionsByUser] = useState<Record<string, { lastSession?: string; count?: number }>>({})

  useEffect(() => {
    if (!userIds.length) return
    let alive = true
    ;(async () => {
      try {
        const qs = encodeURIComponent(userIds.join(","))
        const res = await fetch(`/api/users/sessions?user_ids=${qs}`, { cache: "no-store", headers: { Accept: "application/json" } })
        if (!res.ok) return
        const payload = await res.json().catch(() => null)
        const map = (payload && payload.sessions) || {}
        if (alive) setSessionsByUser((prev) => ({ ...prev, ...map }))
      } catch {}
    })()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userIds), ...deps])

  return { sessionsByUser, setSessionsByUser }
}
