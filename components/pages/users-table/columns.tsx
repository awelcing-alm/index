"use client"

import React from "react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { GroupIconInline } from "@/components/group-icon"
import { UserEditButton } from "@/components/user-edit-button"
import { Crown, User as UserIcon } from "lucide-react"
import { Radar as RadarIcon, Compass as CompassIcon, GraduationCap, BookOpen } from "lucide-react"

type UiUser = any
type GroupWithCount = any

export function createUserColumns(opts: {
  resolveGroupForRow: (row: UiUser) => GroupWithCount | null
  profilesByUser: Record<string, any>
  productGrants: Record<string, boolean> | null
  sessionsByUser: Record<string, { lastSession?: string; count?: number }>
  setAllOnPage: (checked: boolean, tbl: any) => void
  groups: any[]
}) {
  const { resolveGroupForRow, profilesByUser, productGrants, sessionsByUser, setAllOnPage, groups } = opts
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
        const displayName = fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]
        return <span className="font-medium text-ink">{displayName}</span>
      },
    }),
    col.accessor((u) => u.identifiers.email_address, {
      id: "email",
      header: () => <span className="text-ink">Email</span>,
      cell: (ctx) => {
        const email = ctx.getValue() as string
        return (
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(email) } catch {} }}
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
      id: "profiles",
      header: () => <span className="text-ink">Profiles</span>,
      cell: ({ row }) => {
        const f = profilesByUser[row.original.user_id] || {}
        const iconCls = (on?: boolean) => ["h-4 w-4", on ? "text-ink" : "text-[hsl(var(--muted-foreground))] opacity-50"].join(" ")
        const keys = (productGrants ? (Object.entries(productGrants).filter(([, on]) => on).map(([k]) => k)) : []) as string[]
        return (
          <div className="flex items-center gap-2">
            <span className="sr-only">Profiles</span>
            {keys.includes("radar") && (
              <span title={f.radar ? "Radar profile available" : "No Radar profile"} className={f.radar ? "rounded-sm ring-1 ring-ink/25 p-0.5" : undefined}>
                <RadarIcon className={iconCls(f.radar)} />
              </span>
            )}
            {keys.includes("mylaw") && (
              <span title={f.mylaw ? "MyLaw profile available" : "No MyLaw profile"} className={f.mylaw ? "rounded-sm ring-1 ring-ink/25 p-0.5" : undefined}>
                <BookOpen className={iconCls(f.mylaw)} />
              </span>
            )}
            {keys.includes("compass") && (
              <span title={f.compass ? "Compass profile available" : "No Compass profile"} className={f.compass ? "rounded-sm ring-1 ring-ink/25 p-0.5" : undefined}>
                <CompassIcon className={iconCls(f.compass)} />
              </span>
            )}
            {keys.includes("scholar") && (
              <span title={f.scholar ? "Scholar profile available" : "No Scholar profile"} className={f.scholar ? "rounded-sm ring-1 ring-ink/25 p-0.5" : undefined}>
                <GraduationCap className={iconCls(f.scholar)} />
              </span>
            )}
          </div>
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 120,
    }),
    col.display({
      id: "lastSession",
      header: () => <span className="text-ink">Last Session</span>,
      cell: ({ row }) => {
        const iso = sessionsByUser[row.original.user_id]?.lastSession
        if (!iso) return <span className="text-[hsl(var(--muted-foreground))]">—</span>
        const d = new Date(iso)
        const diff = Date.now() - d.getTime()
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        const label = days <= 0 ? "today" : days === 1 ? "1 day ago" : `${days} days ago`
        return <span className="text-ink">{label}</span>
      },
      enableColumnFilter: false,
      size: 120,
    }),
    col.display({
      id: "sessions",
      header: () => <span className="text-ink">Sessions</span>,
      cell: ({ row }) => {
        const c = sessionsByUser[row.original.user_id]?.count
        return <span className="text-ink">{typeof c === "number" ? c : "—"}</span>
      },
      enableColumnFilter: false,
      size: 90,
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

  return columns
}
