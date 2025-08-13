"use client"

import {
  useState, useEffect, useMemo, useCallback, useTransition, type DragEvent,
} from "react"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️", bank: "🏛️", clipboard: "📋", shield: "🛡️", user: "👤", users: "👥",
  briefcase: "💼", file: "📄", chart: "📈", pie: "📊", gavel: "🔨", building: "🏢",
  folder: "🗂️", book: "📘",
}

const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || ""

/* =================================================================== */
export default function UsersTable({
  users,
  groups,
}: {
  users : any[]
  groups: Group[]
}) {
  const accountId = getActiveAccountId() // header switcher populates this (client-only)

  /* ---------------- data & pagination ---------------- */
  const [rows, setRows] = useState(users)
  useEffect(() => setRows(users), [users])

  const PER_PAGE = 25
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(rows.length / PER_PAGE)
  const pagedRows = useMemo(() => rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE), [rows, page])
  const goFirst = () => setPage(0)
  const goPrev  = () => setPage((p) => Math.max(0, p - 1))
  const goNext  = () => setPage((p) => Math.min(pageCount - 1, p + 1))
  const goLast  = () => setPage(pageCount - 1)

  /* ---------------- groups lookup maps ---------------- */
  const groupById   = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups])
  const groupByName = useMemo(() => Object.fromEntries(groups.map((g) => [g.name, g])), [groups])
  const groupBySlug = useMemo(() => Object.fromEntries(groups.map((g) => [g.slug, g])), [groups])

  const resolveGroup = useCallback((value?: string | null): Group | null => {
    if (!value) return null
    if (groupByName[value]) return groupByName[value]
    const vSlug = slugify(value)
    if (groupBySlug[vSlug]) return groupBySlug[vSlug]
    return null
  }, [groupByName, groupBySlug])

  /* ---------------- persistent counts (seeded from DB) ---------------- */
  const [counts, setCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0]))
  )
  useEffect(() => {
    setCounts(Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0])))
  }, [groups])

  /* ---------------- selection & misc ---------------- */
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [, startTransition]     = useTransition()

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
  const extractDemographicAttrs = (g: Group) => {
    const d = (g?.demographics || {}) as any
    return {
      ...(d["country"]        ? { "country": d["country"] } : d["region"] ? { "country": d["region"] } : {}),
      ...(d["job-function"]   ? { "job-function": d["job-function"] } : d["job_function"] ? { "job-function": d["job_function"] } : {}),
      ...(d["job-area"]       ? { "job-area": d["job-area"] } : d["job_area"] ? { "job-area": d["job_area"] } : {}),
    }
  }

  /** Post membership deltas to server (persists DB counters). */
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
      // If this fails, UI remains correct but DB count won’t be updated until next action.
      console.error("membership delta post failed", e)
    }
  }

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

    // Build membership deltas: +N to target, -1 for each old group (when different)
    const deltas: Record<string, number> = { [targetGroupId]: userIds.length }
    const demo = extractDemographicAttrs(g)

    setLoading(true); setError(null)
    try {
      // Update Zephr user attributes
      await Promise.all(
        userIds.map((uid) =>
          updateUserAttributesAction(uid, { group: g.name, ...demo }),
        ),
      )

      // Update local rows
      startTransition(() =>
        setRows((prev) =>
          prev.map((u) =>
            userIds.includes(u.user_id)
              ? { ...u, attributes: { ...u.attributes, group: g.name, ...demo } }
              : u,
          ),
        ),
      )

      // Figure out old groups to decrement
      const oldIds = new Set<string>()
      for (const u of rows) {
        if (!userIds.includes(u.user_id)) continue
        const old = resolveGroup(u.attributes?.group)
        const oldId = old?.id
        if (oldId && oldId !== targetGroupId) oldIds.add(oldId)
      }
      for (const id of oldIds) {
        deltas[id] = (deltas[id] ?? 0) - 1
      }

      // Persist + optimistic update
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
    [selected, rows, groupById, accountId] // rows is used for old count calc
  )

  /* ---------------- small helpers ---------------- */
  const GroupDot = ({ name }: { name?: string }) => {
    const g = name ? (groupByName[name] ?? groupBySlug[slugify(name)]) : null
    if (!g) return null
    return (
      <span
        className="ml-1 inline-flex h-3 w-3 items-center justify-center"
        title={g.name}
        aria-hidden="true"
      >
        {GROUP_ICON_EMOJI[g.icon || ""] ?? "📁"}
      </span>
    )
  }

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
                <TableRow className="border-line hover:bg-[hsl(var(--muted))]">
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
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagedRows.map((u) => {
                  const fn = u.attributes?.firstname || ""
                  const ln = u.attributes?.lastname || u.attributes?.surname || ""
                  const displayName = fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]

                  return (
                    <TableRow
                      key={u.user_id}
                      draggable
                      onDragStart={(e) => onDragStart(e, u.user_id)}
                      className="border-line hover:bg-[hsl(var(--muted))]"
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
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-none border border-line">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-paper text-ink">
                              {displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex items-center font-medium text-ink">
                            {displayName}
                            <GroupDot name={u.attributes?.group} />
                          </span>
                        </div>
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
                        />
                      </TableCell>
                    </TableRow>
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
