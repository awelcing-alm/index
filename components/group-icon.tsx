// components/group-icon.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import type { Group } from "@/lib/groups"
import { getActiveAccountId } from "@/lib/account-store"

/* ------------------------------ Lucide icons ------------------------------ */
import {
  Scale,
  Landmark,
  ClipboardList,
  Shield,
  User as UserIcon,
  Users as UsersIcon,
  Briefcase,
  FileText,
  BarChart3,
  PieChart,
  Gavel,
  Building2,
  Folder,
  BookOpen,
  Globe,
  GraduationCap,
  Newspaper,
  Mail,
  Users,
} from "lucide-react"

/** Curated list of icon ids you’ll allow in the UI */
export const ICON_OPTIONS = [
  { id: "folder", label: "Folder", Icon: Folder },
  { id: "users", label: "Users", Icon: Users as any },
  { id: "user", label: "User", Icon: UserIcon },
  { id: "scale", label: "Scale", Icon: Scale },
  { id: "landmark", label: "Landmark", Icon: Landmark },
  { id: "clipboard", label: "Clipboard", Icon: ClipboardList },
  { id: "shield", label: "Shield", Icon: Shield },
  { id: "briefcase", label: "Briefcase", Icon: Briefcase },
  { id: "file", label: "File", Icon: FileText },
  { id: "barchart", label: "Bar Chart", Icon: BarChart3 },
  { id: "pie", label: "Pie Chart", Icon: PieChart },
  { id: "gavel", label: "Gavel", Icon: Gavel },
  { id: "building", label: "Building", Icon: Building2 },
  { id: "book", label: "Book", Icon: BookOpen },
  { id: "globe", label: "Globe", Icon: Globe },
  { id: "gradcap", label: "Graduation Cap", Icon: GraduationCap },
  { id: "newspaper", label: "Newspaper", Icon: Newspaper },
  { id: "mail", label: "Mail", Icon: Mail },
] as const

type IconId = (typeof ICON_OPTIONS)[number]["id"]

/** Direct lookup map so we can render quickly by key */
const LUCIDE_ICON_MAP: Record<IconId, React.ComponentType<any>> = ICON_OPTIONS
  .reduce((acc, it) => ((acc[it.id] = it.Icon), acc), {} as Record<IconId, React.ComponentType<any>>)

/** Back-compat: map old emoji keys → new lucide ids */
const OLD_TO_NEW: Record<string, IconId> = {
  // your old stored keys on groups:
  scale: "scale",
  bank: "landmark",
  clipboard: "clipboard",
  shield: "shield",
  user: "user",
  users: "users",
  briefcase: "briefcase",
  file: "file",
  chart: "barchart",
  pie: "pie",
  gavel: "gavel",
  building: "building",
  folder: "folder",
  book: "book",
}

/** Normalize whatever we stored previously to a Lucide id */
export function normalizeIconKey(raw?: string | null): IconId {
  if (!raw) return "folder"
  const lower = String(raw).toLowerCase().trim()
  if (lower in LUCIDE_ICON_MAP) return lower as IconId
  if (lower in OLD_TO_NEW) return OLD_TO_NEW[lower]
  // Try a few loose matches
  if (lower.includes("chart")) return "barchart"
  if (lower.includes("pie")) return "pie"
  if (lower.includes("landmark") || lower.includes("bank")) return "landmark"
  return "folder"
}

/* -------------------------- membership fetch/cache ------------------------- */

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
  const cached = memoryCache.get(k)
  if (cached && cached.expiry > now()) return cached.data

  const running = inflight.get(k)
  if (running) return running

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

/** Generic inline group icon (use anywhere) */
export function GroupIconInline({
  icon,
  color,
  title,
  className = "h-5 w-5",
  "aria-label": ariaLabel,
}: {
  icon?: string | null
  color?: string | null
  title?: string | null
  className?: string
  "aria-label"?: string
}) {
  const key = normalizeIconKey(icon)
  const IconComp = LUCIDE_ICON_MAP[key] ?? Folder
  return (
    <IconComp
      className={className}
      style={{ color: color || undefined }}
      aria-label={ariaLabel ?? title ?? "Group"}
      title={title ?? undefined}
    />
  )
}

/** Existing user-row icon renderer, now Lucide + colored */
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

  const iconKey = normalizeIconKey(m?.icon ?? g?.icon ?? fallbackIcon ?? "folder")
  const title = (m?.name ?? g?.name ?? fallbackName ?? "Group") as string
  const color = g?.color || undefined

  const IconComp = LUCIDE_ICON_MAP[iconKey] ?? Folder

  // Lucide icons inherit text color via currentColor
  return (
    <IconComp
      className="h-5 w-5"
      style={{ color }}
      title={title}
      aria-label={title}
    />
  )
}

/* ----------------------------- Icon picker UI ----------------------------- */

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function GroupIconPicker({
  value,
  onChange,
  color,
  className,
}: {
  value?: string | null
  onChange: (next: IconId) => void
  color?: string | null
  className?: string
}) {
  const current = normalizeIconKey(value)
  return (
    <Select value={current} onValueChange={(v) => onChange(normalizeIconKey(v))}>
      <SelectTrigger className={className ?? "h-9 w-56 rounded-none border border-line bg-paper text-ink"}>
        <div className="flex items-center gap-2">
          <GroupIconInline icon={current} color={color ?? undefined} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 overflow-y-auto rounded-none border border-line bg-paper">
        {ICON_OPTIONS.map(({ id, label, Icon }) => (
          <SelectItem key={id} value={id} className="rounded-none">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color: color || undefined }} />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
