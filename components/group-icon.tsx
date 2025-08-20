// components/group-icon.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import type { Group } from "@/lib/groups"
import { getActiveAccountId } from "@/lib/account-store"

/* --------------------------- constants & helpers --------------------------- */

const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

type Membership = { group_id: string; name: string | null; icon: string | null }
type MembershipMap = Record<string, Membership>

// Keep in sync with API route’s MAX_USER_IDS
const MAX_IDS_PER_CALL = 200

// Small client-side cache to avoid refetch storms between components
type CacheEntry = { data: MembershipMap; expiry: number }
const TTL_MS = 10_000
const memoryCache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<MembershipMap>>()

function now() { return Date.now() }
function canonicalize(ids: string[]) {
  return Array.from(new Set((ids || []).map((s) => s.trim()).filter(Boolean))).sort()
}
function keyFor(ids: string[], accountId?: string | null) {
  const sorted = canonicalize(ids).join(",")
  return `${accountId || ""}|${sorted}`
}
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}
function mergeMaps(into: MembershipMap, from: MembershipMap) {
  for (const [k, v] of Object.entries(from)) into[k] = v
  return into
}
export function invalidateMembershipCache() {
  memoryCache.clear()
  inflight.clear()
}

/* ------------------------------ data fetching ----------------------------- */

async function fetchBatch(ids: string[], accountId?: string | null, signal?: AbortSignal): Promise<MembershipMap> {
  if (!ids.length) return {}
  // Build canonical URL (sorted ids & account param) to hit CDN cache directly
  const search = new URLSearchParams()
  search.set("user_ids", canonicalize(ids).join(","))
  if (accountId) search.set("account", accountId)

  const res = await fetch(`/api/groups/membership?${search.toString()}`, {
    // IMPORTANT: allow browser/CDN caching & ETags to work
    // (no `cache: "no-store"`)
    method: "GET",
    headers: { Accept: "application/json" },
    redirect: "follow",
    signal,
    credentials: "same-origin",
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `Failed to load memberships (${res.status})`)
  }
  return (json.memberships || {}) as MembershipMap
}

async function getMemberships(ids: string[], accountId?: string | null, signal?: AbortSignal): Promise<MembershipMap> {
  const k = keyFor(ids, accountId)
  // fresh memory cache?
  const cached = memoryCache.get(k)
  if (cached && cached.expiry > now()) return cached.data

  // existing in-flight?
  const running = inflight.get(k)
  if (running) return running

  // plan network: chunk if over per-call limit
  const chunks = chunk(canonicalize(ids), MAX_IDS_PER_CALL)
  const promise = (async () => {
    const out: MembershipMap = {}
    for (const c of chunks) {
      const part = await fetchBatch(c, accountId, signal)
      mergeMaps(out, part)
    }
    memoryCache.set(k, { data: out, expiry: now() + TTL_MS })
    inflight.delete(k)
    return out
  })()

  inflight.set(k, promise)
  return promise
}

/* ---------------------------------- hook ---------------------------------- */

export function useMembershipMap(userIds: string[]) {
  const [data, setData] = useState<MembershipMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accountId = getActiveAccountId?.() ?? null
  const ids = useMemo(() => canonicalize(userIds), [userIds])
  const memoKey = useMemo(() => keyFor(ids, accountId), [ids, accountId])

  useEffect(() => {
    if (ids.length === 0) {
      setData({})
      setError(null)
      setLoading(false)
      return
    }

    // serve from memory immediately if present
    const cached = memoryCache.get(memoKey)
    if (cached && cached.expiry > now()) {
      setData(cached.data)
      setError(null)
      setLoading(false)
      return
    }

    const ac = new AbortController()
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const map = await getMemberships(ids, accountId, ac.signal)
        if (!cancelled) {
          setData(map)
          setError(null)
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

    return () => {
      cancelled = true
      ac.abort()
    }
  }, [memoKey, ids, accountId])

  return { data, loading, error }
}

/* ------------------------------ presentation ------------------------------ */

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
