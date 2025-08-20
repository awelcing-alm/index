// components/pages/users-table/columns.tsx
"use client"

import React from "react"
import {
  createColumnHelper,
  type ColumnDef,
  type FilterFn,
  type Row,
  type Table as ReactTable,
} from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Crown, User as UserIcon } from "lucide-react"
import { UserEditButton } from "@/components/user-edit-button"

import type { UiUser, GroupWithCount } from "./types"
import { GROUP_ICON_EMOJI } from "./group-utils"

export const globalFilterFn: FilterFn<UiUser> = (row, _columnId, filterValue) => {
  const q = String(filterValue ?? "").trim().toLowerCase()
  if (!q) return true
  const email = (row.original.identifiers?.email_address || "").toLowerCase()
  const fn = String(row.original.attributes?.firstname || "").toLowerCase()
  const ln = String(row.original.attributes?.lastname || row.original.attributes?.surname || "").toLowerCase()
  const name = `${fn} ${ln}`.trim()
  return email.includes(q) || name.includes(q)
}

const col = createColumnHelper<UiUser>()

type MembershipMap = Record<string, { group_id: string; name: string | null; icon: string | null }>

type BuildParams = {
  groups: GroupWithCount[]
  setAllOnPage: (checked: boolean) => void
  resolveGroupForRow: (u: UiUser) => GroupWithCount | null
  membershipMap: MembershipMap
}

export function buildUserColumns({
  groups,
  setAllOnPage,
  resolveGroupForRow,
  membershipMap,
}: BuildParams): ColumnDef<UiUser, any>[] {
  return [
    {
      id: "select",
      header: ({ table }: { table: ReactTable<UiUser> }) => (
        <Checkbox
          className="rounded-none"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => setAllOnPage(v === true)}
          aria-label="Select all on page"
        />
      ),
      cell: ({ row }: { row: Row<UiUser> }) => (
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
      cell: ({ row }: { row: Row<UiUser> }) => {
        const u = row.original
        const fn = u.attributes?.firstname || ""
        const ln = u.attributes?.lastname || u.attributes?.surname || ""
        const displayName = fn || ln ? `${fn} ${ln}`.trim() : u.identifiers.email_address.split("@")[0]
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
      cell: ({ row }: { row: Row<UiUser> }) => {
        const u = row.original
        const m = membershipMap[u.user_id]
        const g = m?.group_id ? null : resolveGroupForRow(u)
        const iconKey = (m?.icon ?? u.group_icon ?? g?.icon ?? "") as string
        const icon = GROUP_ICON_EMOJI[iconKey] ?? "📁"
        const title = (m?.name ?? u.group_name ?? g?.name ?? "Group") as string
        return (
          <span className="text-lg leading-none" title={title} aria-label={title}>
            {icon}
          </span>
        )
      },
      enableColumnFilter: true,
      filterFn: (row: Row<UiUser>, _id, value: string) => {
        if (!value) return true
        const u = row.original
        const m = membershipMap[u.user_id]
        const gid = m?.group_id ?? u.group_id
        return (gid ?? "") === value
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
      enableColumnFilter: true,
      filterFn: "equalsString",
    }),

    col.display({
      id: "edit",
      header: () => <span className="text-ink">Edit</span>,
      cell: ({ row }: { row: Row<UiUser> }) => {
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
}
