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

const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || ""

/** Ensure <tr> has only element children (prevents whitespace hydration errors). */
const StrictRow = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement> & { children: React.ReactNode }) => (
  <TableRow className={className} {...rest}>
    {React.Children.toArray(children).filter((c) => typeof c !== "string")}
  </TableRow>
)

/* ---------------- helpers for robust group resolution ---------------- */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function getRawGroupValue(u: any): string | null {
  const a = u?.attributes ?? {}
  const candidates: unknown[] = [
    a.group, a.Group, a["group-name"], a["group_name"],
    a["group-id"], a["group_id"], a["group-slug"], a["group_slug"], u.group,
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
  users: any[]
  groups: GroupWithCount[]
}) {
  const accountId = getActiveAccountId()

  /* ---------------- data & pagination ---------------- */
  const [rows, setRows] = useState(users)
  useEffect(() => setRows(users), [users])

  const PER_PAGE = 25
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(rows.length / PER_PAGE)
  const pagedRows = useMemo(() => rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE), [rows, page])
  const goFirst = () => setPage(0)
  const goPrev = () => setPage((p) => Math.max(0, p - 1))
  const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1))
  const goLast = () => setPage(pageCount - 1)

  /* ---------------- groups lookup maps ---------------- */
  const groupById = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups])
  const groupByName = useMemo(() => Object.fromEntries(groups.map((g) => [g.name, g])), [groups])
  const groupByNameLower = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.name.toLowerCase(), g])),
    [groups]
  )
  const groupBySlug = useMemo(() => Object.fromEntries(groups.map((g) => [g.slug, g])), [groups])
  const groupBySlugifiedName = useMemo(
    () => Object.fromEntries(groups.map((g) => [slugify(g.name), g])),
    [groups]
  )

  const resolveGroupFromValue = useCallback((value?: string | null): GroupWithCount | null => {
    if (!value) return null
    const raw = String(value).trim()
    if (!raw) return null
    if (UUID_V4.test(raw) && groupById[raw]) return groupById[raw]
    if (groupByName[raw]) return groupByName[raw]
    const lower = raw.toLowerCase()
    if (groupByNameLower[lower]) return groupByNameLower[lower]
    if (groupBySlug[raw]) return groupBySlug[raw]
    const vSlug = slugify(raw)
    if (groupBySlug[vSlug]) return groupBySlug[vSlug]
    if (groupBySlugifiedName[vSlug]) return groupBySlugifiedName[vSlug]
    return null
  }, [groupById, groupByName, groupByNameLower, groupBySlug, groupBySlugifiedName])

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

  const extractDemographicAttrs = (g: GroupWithCount) => {
    const d = (g?.demographics || {}) as any
    return {
      ...(d["country"] ? { "country": d["country"] } : d["region"] ? { "country": d["region"] } : {}),
      ...(d["job-function"] ? { "job-function": d["job-function"] } : d["job_function"] ? { "job-function": d["job_function"] } : {}),
      ...(d["job-area"] ? { "job-area": d["job-area"] } : d["job_area"] ? { "job-area": d["job_area"] } : {}),
    }
  }

  const postMembershipDeltas = async (deltas: Record<string, number>) => {
    const changes = Object.entries(deltas)
      .map(([id, delta]) => ({ id, delta }))
      .filter((c) => c.delta !== 0)
    if (!changes.length) return
    try {
      await fetch("/api/groups/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accountId ? { "x-account-id": accountId } : {}),
        },
        body: JSON.stringify({ changes }),
      })
    } catch (e) {
      console.error("membership delta post failed", e)
    }
  }

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

    const deltas: Record<string, number> = { [targetGroupId]: userIds.length }
    const demo = extractDemographicAttrs(g)

    setLoading(true); setError(null)
    try {
      await Promise.all(
        userIds.map((uid) =>
          updateUserAttributesAction(uid, { group: g.name, ...demo }),
        ),
      )
      startTransition(() =>
        setRows((prev) =>
          prev.map((u) =>
            userIds.includes(u.user_id)
              ? { ...u, attributes: { ...u.attributes, group: g.name, ...demo } }
              : u,
          ),
        ),
      )

      const oldIds = new Set<string>()
      for (const u of rows) {
        if (!userIds.includes(u.user_id)) continue
        const old = resolveGroupFromValue(getRawGroupValue(u))
        const oldId = old?.id
        if (oldId && oldId !== targetGroupId) oldIds.add(oldId)
      }
      for (const id of oldIds) deltas[id] = (deltas[id] ?? 0) - 1

      applyCountDeltasLocal(deltas)
      await postMembershipDeltas(deltas)
      setSelected(new Set())
    } catch (e: any) {
      setError(e?.message ?? "Group assign failed")
    } finally {
      setLoading(false)
    }
  }

  async function applyGroup(targetGroupId: string) {
    await assignToGroup(targetGroupId, Array.from(selected))
  }

  /* ------------ bulk template ------------- */
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
    [selected, rows, groupById, accountId]
  )

  /* ---------------- dynamic templates list ---------------- */
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
      } catch { }
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

  /* -------- after modal save: update row + counts -------- */
  const handleUserModalSaved = useCallback((payload: {
    userId: string
    oldGroupId?: string | null
    newGroupId?: string | null
    newAttributes?: Record<string, any>
  }) => {
    const { userId, oldGroupId, newGroupId, newAttributes } = payload

    // Update the row locally
    if (newAttributes) {
      startTransition(() =>
        setRows((prev) =>
          prev.map((u) =>
            u.user_id === userId
              ? { ...u, attributes: { ...u.attributes, ...newAttributes } }
              : u
          )
        )
      )
    }

    // Adjust counts (both sides)
    const deltas: Record<string, number> = {}
    if (oldGroupId && oldGroupId !== newGroupId) deltas[oldGroupId] = (deltas[oldGroupId] ?? 0) - 1
    if (newGroupId && oldGroupId !== newGroupId) deltas[newGroupId] = (deltas[newGroupId] ?? 0) + 1
    if (Object.keys(deltas).length) {
      applyCountDeltasLocal(deltas)
      postMembershipDeltas(deltas)
    }
  }, [])

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
                  <TableHead className="text-ink">Role</TableHead>
                  <TableHead className="text-ink">Actions</TableHead>
                </StrictRow>
              </TableHeader>

              <TableBody>
                {pagedRows.map((u) => {
                  const fn = u.attributes?.firstname || ""
                  const ln = u.attributes?.lastname || u.attributes?.surname || ""
                  const displayName = fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]

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

                      <TableCell>
                        <span className="font-medium text-ink">{displayName}</span>
                      </TableCell>

                      <TableCell className="text-[hsl(var(--muted-foreground))]">
                        <EmailCopy email={u.identifiers.email_address} />
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
                          onAfterSave={(payload: any) => {
                            // Expecting payload.membershipDeltas?: Array<{ id: string; delta: number }>
                            const deltas = payload?.membershipDeltas as { id: string; delta: number }[] | undefined
                            if (!deltas || deltas.length === 0) return

                            // Optimistically update right-rail counts
                            setCounts(prev => {
                              const next = { ...prev }
                              for (const { id, delta } of deltas) {
                                next[id] = Math.max(0, (next[id] ?? 0) + delta)
                              }
                              return next
                            })
                          }}
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
              onDrop={(e) => onDrop(e as any, g.id)}
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
