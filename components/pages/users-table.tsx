// components/pages/users-table.tsx
"use client"

import React, {
  useState, useEffect, useMemo, useCallback, useTransition, type DragEvent,
} from "react"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select, SelectTrigger, SelectValue, SelectItem, SelectContent,
} from "@/components/ui/select"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"

import {
  Crown, User as UserIcon, Users as UsersIcon,
  Folder, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react"

import { getActiveAccountId } from "@/lib/account-store"
import { updateUserAttributesAction } from "@/lib/user-actions"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import type { Group } from "@/lib/groups"
import { UserEditButton } from "@/components/user-edit-button"

type GroupWithCount = Group & { user_count?: number }
type UiUser = {
  user_id: string
  identifiers: { email_address: string }
  attributes: Record<string, any>
  user_type?: string | null
  group_id?: string | null
  group_icon?: string | null
  group_name?: string | null
}

const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

/** Ensure <tr> has only element children (prevents whitespace hydration errors). */
const StrictRow = ({
  className,
  children,
  ...rest
}: {
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLTableRowElement>) => (
  <TableRow className={className} {...rest}>
    {React.Children.toArray(children).filter((c) => typeof c !== "string")}
  </TableRow>
)

/* ---------------- helpers for robust group resolution ---------------- */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || ""

function getRawGroupValue(u: UiUser): string | null {
  const a = u?.attributes ?? {}
  const candidates: unknown[] = [
    a.group, a.Group, a["group-name"], a["group_name"],
    a["group-id"], a["group_id"], a["group-slug"], a["group_slug"],
  ]
  for (const c of candidates) {
    if (!c) continue
    if (typeof c === "string") return c.trim()
    if (typeof c === "object" && c && "value" in (c as any) && typeof (c as any).value === "string") {
      return (c as any).value.trim()
    }
  }
  return null
}

export default function UsersTable({
  users,
  groups,
}: {
  users: UiUser[]
  groups: GroupWithCount[]
}) {
  const accountId = getActiveAccountId()

  /* ---------------- data & pagination ---------------- */
  const [rows, setRows] = useState(users)
  useEffect(() => setRows(users), [users])

  const PER_PAGE = 25
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(rows.length / PER_PAGE)
  const pagedRows = useMemo(
    () => rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
    [rows, page]
  )
  const pageUserIds = useMemo(() => pagedRows.map((u) => u.user_id), [pagedRows])

  const goFirst = () => setPage(0)
  const goPrev  = () => setPage((p) => Math.max(0, p - 1))
  const goNext  = () => setPage((p) => Math.min(pageCount - 1, p + 1))
  const goLast  = () => setPage(pageCount - 1)

  /* ---------------- groups lookup maps ---------------- */
  const groupById   = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups])
  const groupByNameLower = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.name.toLowerCase(), g])),
    [groups]
  )
  const groupBySlug = useMemo(() => Object.fromEntries(groups.map((g) => [g.slug, g])), [groups])
  const groupBySlugifiedName = useMemo(
    () => Object.fromEntries(groups.map((g) => [slugify(g.name), g])),
    [groups]
  )

  /** Resolve a group for a row using id/name/slug from row or attributes (stable across refresh). */
  const resolveGroupForRow = useCallback(
    (row: UiUser): GroupWithCount | null => {
      if (row.group_id && groupById[row.group_id]) return groupById[row.group_id]
      const raw = getRawGroupValue(row)
      if (!raw) return null
      const v = raw.trim()
      if (!v) return null
      if (UUID_V4.test(v) && groupById[v]) return groupById[v]
      const lower = v.toLowerCase()
      if (groupByNameLower[lower]) return groupByNameLower[lower]
      if (groupBySlug[v]) return groupBySlug[v]
      const vSlug = slugify(v)
      if (groupBySlug[vSlug]) return groupBySlug[vSlug]
      if (groupBySlugifiedName[vSlug]) return groupBySlugifiedName[vSlug]
      return null
    },
    [groupById, groupByNameLower, groupBySlug, groupBySlugifiedName]
  )

  /* ---------------- persistent counts (seeded from DB) ---------------- */
  const [counts, setCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0]))
  )
  useEffect(() => {
    setCounts(Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0])))
  }, [groups])

  /* ---------------- selection & misc ---------------- */
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const toggle = (id: string) => setSelected((p) => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n
  })
  const toggleAllOnPage = () =>
    setSelected((p) => {
      const onPageIds = pagedRows.map((u) => u.user_id)
      const allSelected = onPageIds.every((id) => p.has(id))
      if (allSelected) {
        const n = new Set(p); onPageIds.forEach((id) => n.delete(id)); return n
      }
      return new Set([...p, ...onPageIds])
    })

  /** Normalize demographics from a group (supports underscore or hyphen keys). */
  const extractDemographicAttrs = (g: GroupWithCount) => {
    const d = (g?.demographics || {}) as any
    return {
      ...(d["country"] ? { "country": d["country"] } : d["region"] ? { "country": d["region"] } : {}),
      ...(d["job-function"] ? { "job-function": d["job-function"] } : d["job_function"] ? { "job-function": d["job_function"] } : {}),
      ...(d["job-area"] ? { "job-area": d["job-area"] } : d["job_area"] ? { "job-area": d["job_area"] } : {}),
    }
  }

  /** Fetch DB memberships for the *current page* → annotate rows so icons persist. */
  const refreshMemberships = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return
    try {
      // Uses existing GET reader: /api/groups/membership?user_ids=U1,U2,...
      const qs = encodeURIComponent(userIds.join(","))
      const res = await fetch(`/api/groups/membership?user_ids=${qs}`, { cache: "no-store" })
      if (!res.ok) return
      const payload = await res.json() as {
        ok: boolean,
        memberships: Record<string, { group_id: string, name: string | null, icon: string | null }>
      }
      if (!payload?.ok) return
      const byUser = payload.memberships || {}
      startTransition(() => {
        setRows(prev =>
          prev.map(u => {
            const m = byUser[u.user_id]
            return m
              ? { ...u, group_id: m.group_id, group_icon: m.icon, group_name: m.name ?? undefined }
              : u
          })
        )
      })
    } catch (e) {
      console.error("refreshMemberships failed", e)
    }
  }, [])

  // hydrate icons for each page
  useEffect(() => {
    refreshMemberships(pageUserIds)
  }, [refreshMemberships, pageUserIds])

  /** Compute and apply counts optimistically. Keys are group IDs. */
  const applyCountDeltasLocal = (deltas: Record<string, number>) => {
    if (!Object.keys(deltas).length) return
    setCounts((prev) => {
      const next = { ...prev }
      for (const [id, delta] of Object.entries(deltas)) {
        next[id] = Math.max(0, (next[id] ?? 0) + (delta ?? 0))
      }
      return next
    })
  }

  async function assignToGroup(targetGroupId: string, userIds: string[]) {
    if (!userIds.length) return
    const g = groupById[targetGroupId]; if (!g) return

    // Build deltas: +N to target, -1 for each old group (when different)
    const deltas: Record<string, number> = { [targetGroupId]: userIds.length }
    const oldIds = new Set<string>()
    for (const u of rows) {
      if (!userIds.includes(u.user_id)) continue
      const old = u.group_id
      if (old && old !== targetGroupId) oldIds.add(old)
    }
    for (const id of oldIds) deltas[id] = (deltas[id] ?? 0) - 1

    const demo = extractDemographicAttrs(g)

    setLoading(true); setError(null)
    try {
      // 1) Patch Zephr attributes
      await Promise.all(
        userIds.map((uid) =>
          updateUserAttributesAction(uid, { group: g.name, ...demo }),
        ),
      )

      // 2) Persist membership + counts
      const payload = {
        assignments: userIds.map((uid) => ({ user_id: uid, group_id: targetGroupId })),
        changes: Object.entries(deltas).map(([id, delta]) => ({ id, delta })),
      }
      const res = await fetch("/api/groups/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to persist membership")
      }

      // 3) Optimistic UI update
      startTransition(() =>
        setRows((prev) =>
          prev.map((u) =>
            userIds.includes(u.user_id)
              ? {
                  ...u,
                  group_id: g.id,
                  group_icon: g.icon,
                  group_name: g.name,
                  attributes: { ...u.attributes, group: g.name, ...demo },
                }
              : u
          ),
        ),
      )

      // 4) Counts
      const serverDeltas: Record<string, number> | undefined = data?.deltas
      applyCountDeltasLocal(serverDeltas && Object.keys(serverDeltas).length ? serverDeltas : deltas)

      // 5) Re-hydrate for current page so icons persist reliably
      await refreshMemberships(pageUserIds)

      setSelected(new Set())
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? "Group assign failed")
    } finally {
      setLoading(false)
    }
  }

  async function applyGroup(targetGroupId: string) {
    await assignToGroup(targetGroupId, Array.from(selected))
  }

  /* ---------------- templates bulk ---------------- */
  const fetchTemplateNames = async () =>
    (await fetch("/api/templates")).json() as Promise<string[]>

  const fetchTemplate = async (name: string) => {
    const hit = DEFAULT_TEMPLATES.find((t) => t.name === name)
    if (hit) return hit
    const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
    return res.ok ? await res.json() : null
  }

  async function applyTemplate(templateName: string) {
    if (!selected.size) return
    setLoading(true); setError(null)
    try {
      const tpl = await fetchTemplate(templateName)
      if (!tpl) throw new Error("Template not found")
      await Promise.all(
        Array.from(selected).map((uid) =>
          updateUserAttributesAction(uid, tpl.attributes),
        ),
      )
      setSelected(new Set())
    } catch (e: any) {
      setError(e?.message ?? "Bulk template failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- drag & drop ---------------- */
  const onDragStart = useCallback((e: DragEvent, userId: string) => {
    e.dataTransfer.setData("text/plain", userId)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    async (e: DragEvent, targetGroupId: string) => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData("text/plain")
      const ids = selected.has(draggedId) ? Array.from(selected) : [draggedId]
      await assignToGroup(targetGroupId, ids)
    },
    [selected, assignToGroup]
  )

  /* ---------------- misc helpers ---------------- */
  const DynamicTemplateOptions = () => {
    const [names, setNames] = useState<string[]>([])
    useEffect(() => { fetchTemplateNames().then(setNames).catch(console.error) }, [])
    return (
      <>
        {names.map((n) => (
          <SelectItem key={n} value={n}>
            {n}
          </SelectItem>
        ))}
      </>
    )
  }

  const EmailCopy = ({ email }: { email: string }) => {
    const [copied, setCopied] = useState(false)
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(email)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      } catch {}
    }
    return (
      <button
        onClick={copy}
        className="underline decoration-dotted hover:opacity-80"
        title="Click to copy"
        type="button"
      >
        {email}
        {copied && <span className="ml-2 text-xs text-green-700">Copied</span>}
      </button>
    )
  }

  const GroupIconCell = ({ row }: { row: UiUser }) => {
    const g = resolveGroupForRow(row)
    if (!g && !row.group_icon) return <span className="text-[hsl(var(--muted-foreground))]">—</span>
    const iconKey = (row.group_icon ?? g?.icon ?? "") as string
    const icon = GROUP_ICON_EMOJI[iconKey] ?? "📁"
    const title = g?.name ?? row.group_name ?? "Group"
    return (
      <span className="text-lg leading-none" title={title} aria-label={title}>
        {icon}
      </span>
    )
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4 rounded-none">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-none border border-line bg-[hsl(var(--muted))] p-3">
          <p className="text-sm text-ink">{selected.size} selected</p>

          <Select onValueChange={applyGroup} disabled={loading}>
            <SelectTrigger className="h-8 w-48 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Assign Group…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={applyTemplate} disabled={loading}>
            <SelectTrigger className="h-8 w-52 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Apply Template…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {DEFAULT_TEMPLATES.map((t) => (
                <SelectItem key={t.name} value={t.name} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
                  {t.name}
                </SelectItem>
              ))}
              <DynamicTemplateOptions />
            </SelectContent>
          </Select>

          {loading && <Loader2 className="h-4 w-4 animate-spin text-ink" aria-label="Working…" />}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="p-3 lg:p-4">
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
              <UsersIcon className="h-5 w-5" aria-hidden="true" /> Users
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <StrictRow className="border-line hover:bg-[hsl(var(--muted))]">
                  <TableHead>
                    <Checkbox
                      checked={pagedRows.length > 0 && pagedRows.every((u) => selected.has(u.user_id))}
                      onCheckedChange={toggleAllOnPage}
                      className="rounded-none"
                      aria-label="Select all on page"
                    />
                  </TableHead>
                  <TableHead className="text-ink">User</TableHead>
                  <TableHead className="text-ink">Email</TableHead>
                  <TableHead className="text-ink">Group</TableHead>
                  <TableHead className="text-ink">Role</TableHead>
                  <TableHead className="text-ink">Edit</TableHead>
                </StrictRow>
              </TableHeader>

              <TableBody>
                {pagedRows.map((u) => {
                  const fn = u.attributes?.firstname || ""
                  const ln = u.attributes?.lastname || u.attributes?.surname || ""
                  const displayName =
                    fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]

                  return (
                    <StrictRow
                      key={u.user_id}
                      className="border-line hover:bg-[hsl(var(--muted))]"
                      draggable
                      onDragStart={(e) => onDragStart(e as any, u.user_id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected.has(u.user_id)}
                          onCheckedChange={() => toggle(u.user_id)}
                          className="rounded-none"
                          aria-label={`Select ${displayName}`}
                        />
                      </TableCell>

                      <TableCell className="font-medium text-ink">
                        {displayName}
                      </TableCell>

                      <TableCell className="text-[hsl(var(--muted-foreground))]">
                        <EmailCopy email={u.identifiers.email_address} />
                      </TableCell>

                      <TableCell>
                        <GroupIconCell row={u} />
                      </TableCell>

                      <TableCell>
                        {u.user_type === "owner" ? (
                          <Badge variant="outline" className="gap-1 rounded-none border-line text-ink">
                            <Crown className="h-3 w-3" /> Owner
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 rounded-none border-line text-ink">
                            <UserIcon className="h-3 w-3" /> User
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <UserEditButton
                          userId={u.user_id}
                          userEmail={u.identifiers.email_address}
                          existingAttributes={u.attributes}
                          groups={groups}
                        />
                      </TableCell>
                    </StrictRow>
                  )
                })}
              </TableBody>
            </Table>

            {pageCount > 1 && (
              <div className="flex items-center justify-between border-t border-line p-3 text-sm text-ink">
                <span>Page {page + 1} / {pageCount}</span>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={goFirst} disabled={page === 0}
                    className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={goPrev} disabled={page === 0}
                    className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={goNext} disabled={page === pageCount - 1}
                    className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={goLast} disabled={page === pageCount - 1}
                    className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50">
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GROUP FOLDERS */}
        <div className="space-y-6">
          <Card className="rounded-none border border-line bg-paper">
            <CardHeader className="p-3 lg:p-4">
              <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
                <Folder className="h-5 w-5" aria-hidden="true" /> Group Folders
              </CardTitle>
            </CardHeader>
          </Card>

          {groups.map((g) => (
            <Card
              key={g.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, g.id)}
              className="cursor-pointer rounded-none border border-line bg-paper transition-colors hover:bg-[hsl(var(--muted))]"
              title={`Drop users to assign to ${g.name}`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg" aria-hidden="true">
                    {GROUP_ICON_EMOJI[g.icon || ""] ?? "📁"}
                  </span>
                  <span className="capitalize text-ink" style={{ color: g.color ?? undefined }}>
                    {g.name}
                  </span>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-none border border-line bg-paper text-xs font-bold text-ink">
                  {counts[g.id] ?? 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
