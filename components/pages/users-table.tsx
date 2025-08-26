// components/pages/users-table.tsx
"use client"

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
  useRef,
  type DragEvent,
} from "react"

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type FilterFn,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Crown,
  User as UserIcon,
  Users as UsersIcon,
  Folder,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
} from "lucide-react"

import { GroupIconInline } from "@/components/group-icon"

import { updateUserAttributesAction } from "@/lib/user-actions"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import type { Group } from "@/lib/groups"
import { UserEditButton } from "@/components/user-edit-button"

/* ====================== types ====================== */
export type GroupWithCount = Group & { user_count?: number }
export type UiUser = {
  user_id: string
  identifiers: { email_address: string }
  attributes: Record<string, any>
  user_type?: string | null
  group_id?: string | null
  group_icon?: string | null
  group_name?: string | null
}

type Membership = { group_id: string; name: string | null; icon: string | null }

/* Ensure <tr> has only element children (prevents whitespace hydration errors). */
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

/* ---------------- helpers ---------------- */
const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
  ""

function getRawGroupValue(u: UiUser): string | null {
  const a = u?.attributes ?? {}
  const candidates: unknown[] = [
    a.group,
    a.Group,
    a["group-name"],
    a["group_name"],
    a["group-id"],
    a["group_id"],
    a["group-slug"],
    a["group_slug"],
  ]
  for (const c of candidates) {
    if (!c) continue
    if (typeof c === "string") return c.trim()
    if (
      typeof c === "object" &&
      c &&
      "value" in (c as any) &&
      typeof (c as any).value === "string"
    ) {
      return (c as any).value.trim()
    }
  }
  return null
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  })
  const raw = await res.text().catch(() => "")
  let data: any = null
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {}
  return { res, data, raw }
}

function coerceBoolMap(obj: any): Record<string, boolean> {
  const out: Record<string, boolean> = {}
  if (!obj || typeof obj !== "object") return out
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "boolean") out[k] = v
    else if (v === "true" || v === "false") out[k] = v === "true"
    else out[k] = Boolean(v)
  }
  return out
}

/* ====================== component ====================== */
export default function UsersTable({
  users,
  groups,
}: {
  users: UiUser[]
  groups: GroupWithCount[]
}) {
  /* data */
  const [rows, setRows] = useState(users)
  useEffect(() => setRows(users), [users])

  /* selection / ui */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [, startTransition] = useTransition()

  /* template names (defaults + custom) */
  const [templateNames, setTemplateNames] = useState<string[]>([])
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates?scope=all&format=array", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        })
        const payload = await res.json().catch(() => null)
        const apiNames: string[] =
          Array.isArray(payload) ? payload :
          Array.isArray(payload?.names) ? payload.names :
          Array.isArray(payload?.data) ? payload.data : []
        const merged = Array.from(
          new Set([...DEFAULT_TEMPLATES.map((t) => t.name), ...apiNames]),
        ).sort()
        if (alive) setTemplateNames(merged)
      } catch {
        const fallbacks = DEFAULT_TEMPLATES.map((t) => t.name).sort()
        if (alive) setTemplateNames(fallbacks)
      }
    })()
    return () => { alive = false }
  }, [])

  /* groups lookup */
  const groupById = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.id, g] as const)),
    [groups],
  )
  const groupByNameLower = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.name.toLowerCase(), g] as const)),
    [groups],
  )
  const groupBySlug = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.slug, g] as const)),
    [groups],
  )
  const groupBySlugifiedName = useMemo(
    () => Object.fromEntries(groups.map((g) => [slugify(g.name), g] as const)),
    [groups],
  )

  /* ----------- MEMBERSHIP HYDRATION (GLOBAL) ----------- */
  const [membershipByUser, setMembershipByUser] = useState<Record<string, Membership>>({})
  const hydratedAllRef = useRef(false)

  // Batch-membership load so filters work before visiting pages
  useEffect(() => {
    if (!users?.length) {
      hydratedAllRef.current = true
      setMembershipByUser({})
      return
    }
    const CHUNK = 200
    let cancelled = false

    ;(async () => {
      const userIds = users.map((u) => u.user_id)
      const chunks: string[][] = []
      for (let i = 0; i < userIds.length; i += CHUNK) {
        chunks.push(userIds.slice(i, i + CHUNK))
      }

      const aggregate: Record<string, Membership> = {}
      for (const ids of chunks) {
        if (cancelled) return
        const qs = encodeURIComponent(ids.join(","))
        const { res, data } = await fetchJson(`/api/groups/membership?user_ids=${qs}`)
        if (!res.ok || !data?.ok) continue
        Object.assign(aggregate, data.memberships || {})
      }

      if (cancelled) return

      hydratedAllRef.current = true
      setMembershipByUser(aggregate)

      // Merge into rows so filtering sees group_id for *all* rows
      setRows((prev) =>
        prev.map((u) => {
          const m = aggregate[u.user_id]
          return m
            ? {
                ...u,
                group_id: m.group_id,
                group_icon: m.icon,
                group_name: m.name ?? undefined,
              }
            : u
        }),
      )
    })()

    return () => {
      cancelled = true
    }
  }, [users])

  /* ----------- resolve group for a row (uses membership map first) ----------- */
  const resolveGroupForRow = useCallback(
    (row: UiUser): GroupWithCount | null => {
      const m = membershipByUser[row.user_id]
      if (m?.group_id && groupById[m.group_id]) return groupById[m.group_id]

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
    [membershipByUser, groupById, groupByNameLower, groupBySlug, groupBySlugifiedName],
  )

  /* ----------- counts (seeded) ----------- */
  const [counts, setCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0] as const)),
  )
  useEffect(() => {
    setCounts(Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0] as const)))
  }, [groups])

  /* ----------- PAGE hydration (kept for freshness; cheap) ----------- */
  const refreshMemberships = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return
    try {
      const qs = encodeURIComponent(userIds.join(","))
      const res = await fetch(`/api/groups/membership?user_ids=${qs}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      })
      if (!res.ok) return
      const payload = (await res.json()) as { ok: boolean; memberships: Record<string, Membership> }
      if (!payload?.ok) return
      const byUser = payload.memberships || {}

      // cache + rows
      startTransition(() => {
        setMembershipByUser((prev) => ({ ...prev, ...byUser }))
        setRows((prev) =>
          prev.map((u) => {
            const m = byUser[u.user_id]
            return m
              ? {
                  ...u,
                  group_id: m.group_id,
                  group_icon: m.icon,
                  group_name: m.name ?? undefined,
                }
              : u
          }),
        )
      })
    } catch (e) {
      console.error("refreshMemberships failed", e)
    }
  }, [])

  /* ================== table ================== */
  const PER_PAGE = 25
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PER_PAGE,
  })
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const globalFilterFn: FilterFn<UiUser> = (row, _columnId, filterValue) => {
    const q = String(filterValue ?? "").trim().toLowerCase()
    if (!q) return true
    const email = (row.original.identifiers?.email_address || "").toLowerCase()
    const fn = String(row.original.attributes?.firstname || "").toLowerCase()
    const ln = String(
      row.original.attributes?.lastname || row.original.attributes?.surname || "",
    ).toLowerCase()
    const name = `${fn} ${ln}`.trim()
    return email.includes(q) || name.includes(q)
  }

  const setAllOnPage = (checked: boolean, tbl: any) => {
    setRowSelection((prev) => {
      if (!checked) {
        const next = { ...prev } as Record<string, boolean>
        for (const r of tbl.getRowModel().rows) delete next[r.id]
        return next
      }
      const next = { ...prev } as Record<string, boolean>
      for (const r of tbl.getRowModel().rows) next[r.id] = true
      return next
    })
  }

  const col = createColumnHelper<UiUser>()
  const columns: ColumnDef<UiUser, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="rounded-none"
          checked={
            (table as any).getIsAllPageRowsSelected?.() ??
            table.getRowModel().rows.every((r) => r.getIsSelected())
          }
          onCheckedChange={(v) => setAllOnPage(v === true, table)}
          aria-label="Select all on page"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="rounded-none"
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(v === true)}
          aria-label={`Select ${row.original.identifiers?.email_address}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 36,
    },
    col.display({
      id: "name",
      header: () => <span className="text-ink">User</span>,
      cell: ({ row }) => {
        const u = row.original
        const fn = u.attributes?.firstname || ""
        const ln = u.attributes?.lastname || u.attributes?.surname || ""
        const displayName =
          fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]
        return <span className="font-medium text-ink">{displayName}</span>
      },
      sortingFn: (a, b) => {
        const get = (u: UiUser) => {
          const fn = u.attributes?.firstname || ""
          const ln = u.attributes?.lastname || u.attributes?.surname || ""
          return (fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address).toLowerCase()
        }
        return get(a.original).localeCompare(get(b.original))
      },
    }),
    col.accessor((u) => u.identifiers.email_address, {
      id: "email",
      header: () => <span className="text-ink">Email</span>,
      cell: (ctx) => {
        const email = ctx.getValue() as string
        return (
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(email)
              } catch {}
            }}
            className="underline decoration-dotted text-[hsl(var(--muted-foreground))] hover:opacity-80"
            title="Click to copy"
            type="button"
          >
            {email}
          </button>
        )
      },
      enableColumnFilter: true,
      filterFn: "includesString",
    }),
    col.display({
      id: "group",
      header: () => <span className="text-ink">Group</span>,
      cell: ({ row }) => {
        const u = row.original
        const g = resolveGroupForRow(u)
        const iconId = (u.group_icon ?? g?.icon ?? "folder") as string
        const title = g?.name ?? u.group_name ?? "Group"
        const color = g?.color ?? undefined
        return <GroupIconInline icon={iconId} color={color} title={title} className="h-4 w-4" />
      },
      enableColumnFilter: true,
      filterFn: (row, _id, value: string) => {
        if (!value) return true
        const g = resolveGroupForRow(row.original)
        return (g?.id ?? "") === value
      },
    }),
    col.accessor((u) => (u.user_type === "owner" ? "Owner" : "User"), {
      id: "role",
      header: () => <span className="text-ink">Role</span>,
      cell: ({ getValue }) => {
        const label = getValue() as string
        return label === "Owner" ? (
          <Badge variant="outline" className="gap-1 rounded-none border-line text-ink">
            <Crown className="h-3 w-3" /> Owner
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 rounded-none border-line text-ink">
            <UserIcon className="h-3 w-3" /> User
          </Badge>
        )
      },
      enableColumnFilter: false,
    }),
    col.display({
      id: "edit",
      header: () => <span className="text-ink">Edit</span>,
      cell: ({ row }) => {
        const u = row.original
        return (
          <UserEditButton
            userId={u.user_id}
            userEmail={u.identifiers.email_address}
            existingAttributes={u.attributes}
            groups={groups}
          />
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 72,
    }),
  ]

  const table = useReactTable({
    data: rows,
    columns,
    getRowId: (row) => row.user_id,
    enableRowSelection: true,
    state: { rowSelection, pagination, globalFilter, columnFilters, sorting },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
  })

  // reset to page 1 on filter/sort/search change
  useEffect(() => {
    setPagination((p) => (p.pageIndex === 0 ? p : { ...p, pageIndex: 0 }))
  }, [sorting, columnFilters, globalFilter])

  // keep current page hydrated for freshness
  const lastMembershipKey = useRef<string>("")
  useEffect(() => {
    const ids = table.getRowModel().rows.map((r) => r.original.user_id)
    const key = ids.join(",")
    if (key === lastMembershipKey.current) return
    lastMembershipKey.current = key
    refreshMemberships(ids)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, pagination.pageIndex, pagination.pageSize, sorting, columnFilters, globalFilter])

  /* =============== actions (assign/template) =============== */
  const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.user_id)

  const extractDemographicAttrs = (g: GroupWithCount) => {
    const d = (g?.demographics || {}) as any
    return {
      ...(d["country"]
        ? { country: d["country"] }
        : d["region"]
        ? { country: d["region"] }
        : {}),
      ...(d["job-function"]
        ? { "job-function": d["job-function"] }
        : d["job_function"]
        ? { "job-function": d["job_function"] }
        : {}),
      ...(d["job-area"]
        ? { "job-area": d["job-area"] }
        : d["job_area"]
        ? { "job-area": d["job_area"] }
        : {}),
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
    const g = groupById[targetGroupId]
    if (!g) return

    const deltas: Record<string, number> = { [targetGroupId]: userIds.length }
    const oldIds = new Set<string>()
    for (const u of rows) {
      if (!userIds.includes(u.user_id)) continue
      const old = u.group_id
      if (old && old !== targetGroupId) oldIds.add(old)
    }
    for (const id of oldIds) deltas[id] = (deltas[id] ?? 0) - 1

    const demo = extractDemographicAttrs(g)

    setLoading(true)
    setError(null)
    try {
      await Promise.all(
        userIds.map((uid) =>
          updateUserAttributesAction(uid, { group: g.name, ...demo }),
        ),
      )

      const writePayload = { userIds, groupId: targetGroupId }
      const { res, data, raw } = await fetchJson("/api/membership/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(writePayload),
      })
      if (!res.ok || !data?.ok) {
        const msg = data?.error || raw || `Request failed (${res.status})`
        throw new Error(msg)
      }

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
            : u,
        ),
      )

      const serverDeltas: Record<string, number> | undefined = data?.deltas
      applyCountDeltasLocal(
        serverDeltas && Object.keys(serverDeltas).length ? serverDeltas : deltas,
      )

      // keep the global cache in sync so filters remain correct
      setMembershipByUser((prev) => {
        const next = { ...prev }
        for (const uid of userIds) next[uid] = { group_id: g.id, name: g.name, icon: g.icon ?? null }
        return next
      })

      const ids = table.getRowModel().rows.map((r) => r.original.user_id)
      lastMembershipKey.current = ""
      await refreshMemberships(ids)

      table.resetRowSelection()
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? "Group assign failed")
    } finally {
      setLoading(false)
    }
  }

  async function applyGroup(targetGroupId: string) {
    await assignToGroup(targetGroupId, selectedIds)
  }

  const DEFAULT_MAP = useMemo(
    () => Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.name, t] as const)),
    [],
  )

  const fetchTemplate = async (name: string) => {
    if (DEFAULT_MAP[name]) return DEFAULT_MAP[name]
    const res = await fetch(`/api/templates/${encodeURIComponent(name)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    if (!data) return null
    return {
      name: String((data as any).name || name),
      attributes: coerceBoolMap((data as any).attributes || {}),
    }
  }

  async function applyTemplate(templateName: string) {
    if (!selectedIds.length) return
    setLoading(true)
    setError(null)
    try {
      const tpl = await fetchTemplate(templateName)
      if (!tpl) throw new Error("Template not found")
      await Promise.all(
        selectedIds.map((uid) => updateUserAttributesAction(uid, tpl.attributes)),
      )
      table.resetRowSelection()
    } catch (e: any) {
      setError(e?.message ?? "Bulk template failed")
    } finally {
      setLoading(false)
    }
  }

  /* drag & drop */
  const onDragStart = useCallback((e: DragEvent, userId: string) => {
    e.dataTransfer.setData("text/plain", userId)
    e.dataTransfer.effectAllowed = "move"
  }, [])
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])
  const onDrop = useCallback(
    async (e: DragEvent, targetGroupId: string) => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData("text/plain")
      const ids = selectedIds.includes(draggedId) ? selectedIds : [draggedId]
      await assignToGroup(targetGroupId, ids)
    },
    [selectedIds], // eslint-disable-line react-hooks/exhaustive-deps
  )

  /* UI */
  const ALL = "__ALL__"

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4 rounded-none">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-none border border-line bg-[hsl(var(--muted))] p-3">
          <p className="text-sm text-ink">
            {table.getSelectedRowModel().rows.length} selected
          </p>

          <Select onValueChange={applyGroup} disabled={loading}>
            <SelectTrigger className="h-8 w-48 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Assign Group…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {groups.map((g) => (
                <SelectItem
                  key={g.id}
                  value={g.id}
                  className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                >
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={applyTemplate} disabled={loading}>
            <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Apply Template…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {templateNames.map((n) => (
                <SelectItem
                  key={n}
                  value={n}
                  className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                >
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-ink" aria-label="Working…" />
          )}
        </div>
      )}

      {/* Toolbar: global search + group filter (only) */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search name or email…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-72 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
          />
          {globalFilter ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setGlobalFilter("")}
              className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          ) : null}
        </div>

        <Select
          value={((table.getColumn("group")?.getFilterValue() as string) ?? ALL)}
          onValueChange={(v) =>
            table.getColumn("group")?.setFilterValue(v === ALL ? undefined : v)
          }
        >
          <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
            <SelectValue placeholder="Filter by group" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto rounded-none border border-line bg-paper">
            <SelectItem value={ALL} className="rounded-none">
              All groups
            </SelectItem>
            {groups.map((g) => (
              <SelectItem key={g.id} value={g.id} className="rounded-none">
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowFilters((s) => !s)}
          className="ml-auto rounded-none text-ink hover:bg-[hsl(var(--muted))]"
          title={showFilters ? "Hide filters" : "Show filters"}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

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
                {table.getHeaderGroups().map((hg) => (
                  <StrictRow
                    key={hg.id}
                    className="border-line hover:bg-[hsl(var(--muted))]"
                  >
                    {hg.headers.map((header) => (
                      <TableHead key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </StrictRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  const u = row.original
                  return (
                    <StrictRow
                      key={row.id}
                      className="border-line hover:bg-[hsl(var(--muted))]"
                      draggable
                      onDragStart={(e) => onDragStart(e as any, u.user_id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </StrictRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-line p-3 text-sm text-ink">
              <span>
                Page {pagination.pageIndex + 1} / {table.getPageCount() || 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="rounded-none text-ink hover:bg-[hsl(var(--muted))] disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>
            </div>
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
                  <GroupIconInline
                    icon={(g.icon ?? "folder") as string}
                    color={g.color ?? undefined}
                    title={g.name}
                    className="h-5 w-5"
                  />
                  <span
                    className="capitalize text-ink"
                    style={{ color: g.color ?? undefined }}
                  >
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

export { UsersTable }
