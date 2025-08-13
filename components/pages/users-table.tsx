/* ------------------------------------------------------------------ */
/* components/pages/users-table.tsx                                   */
/*  • pagination (client-side)                                        */
/*  • group counts + icon/color are *derived*, never stale            */
/*  • “group” user attribute is used for assignment                   */
/* ------------------------------------------------------------------ */
"use client"

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
  type DragEvent,
} from "react"

/* ---------- ui ---------- */
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

/* ---------- icons ---------- */
import {
  Crown, User as UserIcon, Users as UsersIcon,
  Folder, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react"

/* ---------- helpers ---------- */
import { updateUserAttributesAction } from "@/lib/user-actions"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import type { Group } from "@/lib/groups"

/* ---------- util ---------- */
const fetchTemplateNames = async () =>
  (await fetch("/api/templates")).json() as Promise<string[]>

const fetchTemplate = async (name: string) => {
  const hit = DEFAULT_TEMPLATES.find((t) => t.name === name)
  if (hit) return hit
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
  return res.ok ? await res.json() : null
}

const countGroups = (list: any[]) => {
  const out: Record<string, number> = {}
  list.forEach((u) => {
    const slug = u.attributes?.group
    if (slug) out[slug] = (out[slug] || 0) + 1
  })
  return out
}

/* =================================================================== */
export default function UsersTable({
  users,
  groups,
}: {
  users : any[]
  groups: Group[]
}) {
  /* ---------- row state ---------- */
  const [rows, setRows] = useState(users)
  useEffect(() => setRows(users), [users])

  /* ---------- pagination ---------- */
  const PER_PAGE = 25
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(rows.length / PER_PAGE)

  const pagedRows = useMemo(
    () => rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE),
    [rows, page],
  )

  const goFirst  = () => setPage(0)
  const goPrev   = () => setPage((p) => Math.max(0, p - 1))
  const goNext   = () => setPage((p) => Math.min(pageCount - 1, p + 1))
  const goLast   = () => setPage(pageCount - 1)

  /* ---------- derived maps ---------- */
  // key by slug, since user.attributes.group stores the slug
  const groupBySlug = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.slug, g] as const)),
    [groups],
  )

  const groupCounts = useMemo(() => countGroups(rows), [rows])

  /* ---------- misc state ---------- */
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [, startTransition] = useTransition()

  /* ---------- selection helpers ---------- */
  const toggle = (id: string) => setSelected((p) => {
    const n = new Set(p)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })
  const toggleAllOnPage = () =>
    setSelected((p) => {
      const onPageIds = pagedRows.map((u) => u.user_id)
      const allSelected = onPageIds.every((id) => p.has(id))
      if (allSelected) {
        const n = new Set(p)
        onPageIds.forEach((id) => n.delete(id))
        return n
      }
      return new Set([...p, ...onPageIds])
    })

  /* ---------- bulk ops ---------- */
  async function applyGroup(groupSlug: string) {
    if (!selected.size) return
    setLoading(true); setError(null)
    try {
      // Store the slug in Zephr user attributes (stable across renames of id)
      await Promise.all(
        Array.from(selected).map((uid) =>
          updateUserAttributesAction(uid, { group: groupSlug }),
        ),
      )
      startTransition(() =>
        setRows((prev) =>
          prev.map((u) =>
            selected.has(u.user_id)
              ? { ...u, attributes: { ...u.attributes, group: groupSlug } }
              : u,
          ),
        ),
      )
      setSelected(new Set())
    } catch (e: any) {
      setError(e?.message ?? "Bulk group assign failed")
    } finally {
      setLoading(false)
    }
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

  /* ---------- drag & drop ---------- */
  const onDragStart = useCallback((e: DragEvent, userId: string) => {
    e.dataTransfer.setData("text/plain", userId)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    async (e: DragEvent, targetSlug: string) => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData("text/plain")
      const ids = selected.has(draggedId) ? Array.from(selected) : [draggedId]

      setLoading(true); setError(null)
      try {
        await Promise.all(
          ids.map((uid) => updateUserAttributesAction(uid, { group: targetSlug })),
        )
        startTransition(() =>
          setRows((prev) =>
            prev.map((u) =>
              ids.includes(u.user_id)
                ? { ...u, attributes: { ...u.attributes, group: targetSlug } }
                : u,
            ),
          ),
        )
        setSelected(new Set())
      } catch (e: any) {
        setError(e?.message ?? "Drag-drop failed")
      } finally {
        setLoading(false)
      }
    },
    [selected],
  )

  /* ---------- helpers ---------- */
  const GroupDot = ({ slug }: { slug?: string }) => {
    if (!slug) return null
    const g = groupBySlug[slug]; if (!g) return null
    const style: React.CSSProperties = {
      background: g.color || "currentColor",
      display: "inline-block",
      borderRadius: 2,
      height: 8,
      width: 8,
      marginLeft: 6,
    }
    return <span aria-label={g.name} title={g.name} style={style} />
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

  /* ---------- UI ---------- */
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4 rounded-none">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* bulk bar */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-none border border-line bg-[hsl(var(--muted))] p-3">
          <p className="text-sm text-ink">{selected.size} selected</p>

          <Select onValueChange={applyGroup} disabled={loading}>
            <SelectTrigger className="h-8 w-48 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Assign Group…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {groups.map((g) => (
                <SelectItem key={g.slug} value={g.slug} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
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

      {/* grid: table + folders */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* USERS TABLE */}
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
                  const name = fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]

                  return (
                    <TableRow
                      key={u.user_id}
                      draggable
                      onDragStart={(e) => onDragStart(e, u.user_id)}
                      className="border-line hover:bg-[hsl(var(--muted)))]"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selected.has(u.user_id)}
                          onCheckedChange={() => toggle(u.user_id)}
                          className="rounded-none"
                          aria-label={`Select ${name}`}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-none border border-line">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-paper text-ink">
                              {name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex items-center font-medium text-ink">
                            {name}
                            <GroupDot slug={u.attributes?.group} />
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-[hsl(var(--muted-foreground))]">
                        {u.identifiers.email_address}
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
                        {/* Keep your existing edit button */}
                        {/* If you renamed props, update accordingly */}
                        {/* @ts-ignore - component lives elsewhere in your codebase */}
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

            {/* pagination footer */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between border-t border-line p-3 text-sm text-ink">
                <span>
                  Page {page + 1} / {pageCount}
                </span>
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
              key={g.slug}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, g.slug)}
              className="cursor-pointer rounded-none border border-line bg-paper transition-colors hover:bg-[hsl(var(--muted))]"
              title={`Drop users to assign to ${g.name}`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-ink" aria-hidden="true" />
                  <span className="capitalize text-ink" style={{ color: g.color ?? undefined }}>
                    {g.name}
                  </span>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-none border border-line bg-paper text-xs font-bold text-ink">
                  {groupCounts[g.slug] || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
