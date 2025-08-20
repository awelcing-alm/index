"use client"

import React, { useState, useEffect, useMemo, useCallback, useTransition, type DragEvent } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users as UsersIcon } from "lucide-react"

import { updateUserAttributesAction } from "@/lib/user-actions"
import { getActiveAccountId } from "@/lib/account-store"
import type { GroupWithCount, UiUser } from "./types"
import { slugify, resolveGroupForUser } from "./group-utils"
import { buildUserColumns, globalFilterFn } from "./columns"
import { UsersSelectionBar } from "./UsersSelectionBar"
import { UsersToolbar } from "./UsersToolbar"
import { UsersDataTable } from "./UsersDataTable"
import { GroupFolders } from "./GroupFolders"

// membership hydration (shared cache + CDN-friendly)
import { useMembershipMap, invalidateMembershipCache } from "@/components/group-icon"

export default function UsersTable({ users, groups }: { users: UiUser[]; groups: GroupWithCount[] }) {
  const accountId = getActiveAccountId()

  /* ---------------- data source ---------------- */
  const [rows, setRows] = useState(users)
  useEffect(() => setRows(users), [users])

  /* ---------------- selection / UI state ---------------- */
  const [rowSelection, setRowSelection] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [, startTransition] = useTransition()

  /* ---------------- groups lookup maps ---------------- */
  const groupById = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups])
  const groupByNameLower = useMemo(
    () => Object.fromEntries(groups.map((g) => [g.name.toLowerCase(), g])),
    [groups]
  )
  const groupBySlug = useMemo(() => Object.fromEntries(groups.map((g) => [g.slug, g])), [groups])
  const groupBySlugifiedName = useMemo(
    () => Object.fromEntries(groups.map((g) => [slugify(g.name), g])),
    [groups]
  )

  const resolveGroupForRow = useCallback(
    (row: UiUser) =>
      resolveGroupForUser(row, {
        byId: groupById,
        byNameLower: groupByNameLower,
        bySlug: groupBySlug,
        bySlugifiedName: groupBySlugifiedName,
      }),
    [groupById, groupByNameLower, groupBySlug, groupBySlugifiedName]
  )

  /* ---------------- persistent counts (seeded from DB) ---------------- */
  const [counts, setCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0]))
  )
  useEffect(() => {
    setCounts(Object.fromEntries(groups.map((g) => [g.id, g.user_count ?? 0])))
  }, [groups])

  /* ---------------- table setup ---------------- */
  const PER_PAGE = 25

  // columns depend on membershipMap; we’ll create table first, then compute page ids
  const table = useReactTable({
    data: rows,
    columns: [], // temp; will set later after we have membershipMap
    getRowId: (row) => row.user_id,
    enableRowSelection: true,
    state: { rowSelection, pagination: { pageIndex: 0, pageSize: PER_PAGE } },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
  })

  // derive current page user IDs for hydration (prevents request spam)
  const { pageIndex, pageSize } = table.getState().pagination
  const sorting = table.getState().sorting
  const columnFilters = table.getState().columnFilters
  const globalFilter = table.getState().globalFilter

  const pageUserIds = useMemo(
    () => table.getRowModel().rows.map((r: any) => r.original.user_id),
    // re-compute only when visible page or underlying rows change
    [pageIndex, pageSize, sorting, columnFilters, globalFilter, rows]
  )

  // Hydrate memberships for the current page using the shared, cached hook
  const { data: membershipMap } = useMembershipMap(pageUserIds)

  // Now that we have membership info (or not), build columns
  table.setOptions((prev) => ({
    ...prev,
    columns: buildUserColumns({
      groups,
      membershipMap,
      resolveGroupForRow,
      setAllOnPage: (checked: boolean) => {
        setRowSelection((prevSel: any) => {
          if (!checked) {
            const next = { ...prevSel }
            for (const r of table.getRowModel().rows) delete next[r.id]
            return next
          }
          const next = { ...prevSel }
          for (const r of table.getRowModel().rows) next[r.id] = true
          return next
        })
      },
    }),
  }))

  /* ---------------- actions (assign/template) ---------------- */
  const selectedIds: string[] = table.getSelectedRowModel().rows.map((r: any) => r.original.user_id)

  const extractDemographicAttrs = (g: GroupWithCount) => {
    const d = (g?.demographics || {}) as any
    return {
      ...(d["country"] ? { country: d["country"] } : d["region"] ? { country: d["region"] } : {}),
      ...(d["job-function"] ? { "job-function": d["job-function"] } : d["job_function"] ? { "job-function": d["job_function"] } : {}),
      ...(d["job-area"] ? { "job-area": d["job-area"] } : d["job_area"] ? { "job-area": d["job_area"] } : {}),
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

    // deltas: +N target, -1 for each distinct old group
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
      await Promise.all(userIds.map((uid) => updateUserAttributesAction(uid, { group: g.name, ...demo })))

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
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to persist membership")

      // 3) Optimistic UI update for rows
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
        )
      )

      // 4) Counts
      const serverDeltas: Record<string, number> | undefined = data?.deltas
      applyCountDeltasLocal(serverDeltas && Object.keys(serverDeltas).length ? serverDeltas : deltas)

      // 5) Re-hydrate memberships for the current page (client cache)
      invalidateMembershipCache()
      // Hook will refetch on next render with same keys

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

  async function applyTemplate(templateName: string) {
    if (!selectedIds.length) return
    setLoading(true); setError(null)
    try {
      // templates are applied client-side to Zephr attributes only (no membership write)
      const { DEFAULT_TEMPLATES } = await import("@/lib/template-defaults")
      const tpl = DEFAULT_TEMPLATES.find((t) => t.name === templateName)
      if (!tpl) throw new Error("Template not found")
      await Promise.all(selectedIds.map((uid) => updateUserAttributesAction(uid, tpl.attributes)))
      table.resetRowSelection()
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
      const ids = selectedIds.includes(draggedId) ? selectedIds : [draggedId]
      await assignToGroup(targetGroupId, ids)
    },
    [selectedIds] // eslint-disable-line react-hooks/exhaustive-deps
  )

  /* ---------------- UI ---------------- */
  return (
    <Card className="rounded-none border border-line bg-paper">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
          <UsersIcon className="h-5 w-5" aria-hidden="true" /> Users
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-none">
            <Alert variant="destructive" className="rounded-none">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <UsersSelectionBar
          selectedCount={table.getSelectedRowModel().rows.length}
          groups={groups}
          loading={loading}
          onApplyGroup={applyGroup}
          onApplyTemplate={applyTemplate}
        />

        <UsersToolbar
          table={table}
          groups={groups}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-none border border-line bg-paper">
            <div className="p-0">
              <UsersDataTable table={table} onDragStart={onDragStart as any} />
            </div>
          </div>

          <GroupFolders
            groups={groups}
            counts={counts}
            onDragOver={onDragOver as any}
            onDrop={onDrop as any}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { UsersTable }
