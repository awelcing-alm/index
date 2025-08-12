/* ------------------------------------------------------------------ */
/* components/pages/users-table.tsx                                   */
/*  • pagination (client‑side)                                        */
/*  • team counts + icon map are *derived*, never stale               */
/*  • no duplicate state → correct on load, after DnD, after bulk     */
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
  Folder, Loader2, ChevronLeft, ChevronRight, icons as lucideIcons,
} from "lucide-react"

/* ---------- helpers ---------- */
import { updateUserAttributesAction } from "@/lib/user-actions"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import type { Team } from "@/lib/teams"
import { UserEditButton } from "@/components/user-edit-button"

/* ---------- util ---------- */
const fetchTemplateNames = async () =>
  (await fetch("/api/templates")).json() as Promise<string[]>

const fetchTemplate = async (name: string) => {
  const hit = DEFAULT_TEMPLATES.find((t) => t.name === name)
  if (hit) return hit
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
  return res.ok ? await res.json() : null
}

const countTeams = (list: any[]) => {
  const out: Record<string, number> = {}
  list.forEach((u) => {
    const id = u.attributes?.team
    if (id) out[id] = (out[id] || 0) + 1
  })
  return out
}

/* =================================================================== */
export default function UsersTable({
  users,
  teams,
}: {
  users : any[]
  teams : Team[]
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
  const teamMap = useMemo(
    () => Object.fromEntries(teams.map((t) => [t.id, t])),
    [teams],
  )

  const teamCounts = useMemo(() => countTeams(rows), [rows])

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
  async function applyTeam(teamId: string) {
    if (!selected.size) return
    setLoading(true); setError(null)
    try {
      await Promise.all(
        Array.from(selected).map((uid) =>
          updateUserAttributesAction(uid, { team: teamId }),
        ),
      )
      startTransition(() =>
        setRows((prev) =>
          prev.map((u) =>
            selected.has(u.user_id)
              ? { ...u, attributes: { ...u.attributes, team: teamId } }
              : u,
          ),
        ),
      )
      setSelected(new Set())
    } catch (e: any) {
      setError(e?.message ?? "Bulk team assign failed")
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
    async (e: DragEvent, targetId: string) => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData("text/plain")
      const ids = selected.has(draggedId) ? Array.from(selected) : [draggedId]

      setLoading(true); setError(null)
      try {
        await Promise.all(
          ids.map((uid) => updateUserAttributesAction(uid, { team: targetId })),
        )
        startTransition(() =>
          setRows((prev) =>
            prev.map((u) =>
              ids.includes(u.user_id)
                ? { ...u, attributes: { ...u.attributes, team: targetId } }
                : u,
            ),
          ),
        )
        setSelected(new Set())
      } catch (e: any) {
        setError(e?.message ?? "Drag‑drop failed")
      } finally {
        setLoading(false)
      }
    },
    [selected],
  )

  /* ---------- helpers ---------- */
  const TeamDot = ({ id }: { id?: string }) => {
    if (!id) return null
    const t = teamMap[id]; if (!t) return null
    // @ts-ignore
    const Icon = lucideIcons[t.icon] ?? UsersIcon
    return <Icon className="h-3 w-3 ml-1" style={{ color: t.color ?? undefined }} />
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

        <Select onValueChange={applyTeam} disabled={loading}>
          <SelectTrigger className="h-8 w-48 rounded-none border border-line bg-paper text-ink">
            <SelectValue placeholder="Assign Team…" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.id} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
                {t.name}
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
                const fn = u.attributes?.firstname || "";
                const ln = u.attributes?.lastname || u.attributes?.surname || "";
                const name = fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0];

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
                          <TeamDot id={u.attributes?.team} />
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
                      <UserEditButton
                        userId={u.user_id}
                        userEmail={u.identifiers.email_address}
                        existingAttributes={u.attributes}
                      />
                    </TableCell>
                  </TableRow>
                );
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

      {/* TEAM FOLDERS */}
      <div className="space-y-6">
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="p-3 lg:p-4">
            <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
              <Folder className="h-5 w-5" aria-hidden="true" /> Team Folders
            </CardTitle>
          </CardHeader>
        </Card>

        {teams.map((t) => (
          <Card
            key={t.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, t.id)}
            className="cursor-pointer rounded-none border border-line bg-paper transition-colors hover:bg-[hsl(var(--muted))]"
            title={`Drop users to assign to ${t.name}`}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-ink" aria-hidden="true" />
                <span className="capitalize text-ink" style={{ color: t.color ?? undefined }}>
                  {t.name}
                </span>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-none border border-line bg-paper text-xs font-bold text-ink">
                {teamCounts[t.id] || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </>
);
}