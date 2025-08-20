"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Filter as FilterIcon, X } from "lucide-react"
import type { GroupWithCount } from "./types"

const ALL = "__ALL__"

export function UsersToolbar({
  table,
  groups,
  showFilters,
  setShowFilters,
}: {
  table: any
  groups: GroupWithCount[]
  showFilters: boolean
  setShowFilters: (next: boolean) => void
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <Input
          placeholder="Search name or email…"
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-8 w-72 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
        />
        {table.getState().globalFilter ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => table.setGlobalFilter("")}
            className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        ) : null}
      </div>

      {showFilters && (
        <>
          {/* Group filter */}
          <Select
            value={((table.getColumn("group")?.getFilterValue() as string) ?? ALL)}
            onValueChange={(v) => table.getColumn("group")?.setFilterValue(v === ALL ? undefined : v)}
          >
            <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto rounded-none border border-line bg-paper">
              <SelectItem value={ALL} className="rounded-none">All groups</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id} className="rounded-none">
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role filter */}
          <Select
            value={((table.getColumn("role")?.getFilterValue() as string) ?? ALL)}
            onValueChange={(v) => table.getColumn("role")?.setFilterValue(v === ALL ? undefined : v)}
          >
            <SelectTrigger className="h-8 w-44 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="rounded-none border border-line bg-paper">
              <SelectItem value={ALL} className="rounded-none">All</SelectItem>
              <SelectItem value="Owner" className="rounded-none">Owner</SelectItem>
              <SelectItem value="User" className="rounded-none">User</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => setShowFilters(!showFilters)}
        className="ml-auto rounded-none text-ink hover:bg-[hsl(var(--muted))]"
        title={showFilters ? "Hide filters" : "Show filters"}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>
    </div>
  )
}
