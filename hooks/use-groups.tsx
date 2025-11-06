"use client"

import { useCallback, useEffect, useState } from "react"

type Group = {
  account_id: string
  id: string
  slug: string
  name: string
  color: string | null
  icon: string | null
  default_template: string | null
  product_grant_ids: string[]
  demographics: Record<string, unknown>
}

export function useGroups(accountId?: string | null) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsAccount, setNeedsAccount] = useState(false)

  const fetchGroups = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNeedsAccount(false)
    try {
      const res = await fetch("/api/groups", {
        cache: "no-store",
        headers: accountId ? { "x-account-id": accountId } : undefined,
      })

      if (res.status === 400) {
        setNeedsAccount(true)
        setGroups([])
        return
      }
      if (!res.ok) throw new Error(await res.text())

      const data: Group[] = await res.json()
      setGroups(data)
    } catch (err: any) {
      setError(err?.message ?? "Failed to load groups")
    } finally {
      setLoading(false)
    }
  }, [accountId])

  useEffect(() => { void fetchGroups() }, [fetchGroups])

  const deleteOne = useCallback(async (g: { slug: string }) => {
    const res = await fetch(`/api/groups?slug=${encodeURIComponent(g.slug)}`, {
      method: "DELETE",
      headers: accountId ? { "x-account-id": accountId } : undefined,
    })
    if (!res.ok) { throw new Error(await res.text()) }
    await fetchGroups()
  }, [accountId, fetchGroups])

  return { groups, setGroups, loading, error, needsAccount, fetchGroups, deleteOne }
}
