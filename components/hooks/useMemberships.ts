// components/hooks/useMemberships.ts
"use client"

import useSWR from "swr"
import { useMemo } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function stableKey(userIds: string[]) {
  // unique + sort so the key stays stable across renders
  const uniq = Array.from(new Set(userIds)).sort()
  return uniq.join(",")
}

export function useMemberships(userIds: string[]) {
  const key = useMemo(() => {
    const s = stableKey(userIds || [])
    return s ? `/api/groups/membership?user_ids=${encodeURIComponent(s)}` : null
  }, [userIds])

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    // Stop the spam:
    refreshInterval: 0,
    revalidateOnFocus: false,
    dedupingInterval: 30_000, // 30s: multiple callers share the same in-flight result
    keepPreviousData: true,
  })

  return {
    memberships: (data?.memberships as Record<string, { group_id: string; name: string; icon: string | null }>) || {},
    error,
    isLoading,
    mutate,
  }
}
