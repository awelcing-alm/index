"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Filter as FilterIcon, X, Columns as ColumnsIcon } from "lucide-react"

export type GroupOption = { id: string; name: string }

export function UsersTableToolbar({
  globalFilter,
  onGlobalFilterChange,
  groupFilterValue,
  onGroupFilterChange,
  lastSessionFilter,
  onLastSessionFilterChange,
  onToggleColumns,
  showFilters,
  onToggleFilters,
  groups,
}: {
  globalFilter: string
  onGlobalFilterChange: (v: string) => void
  groupFilterValue?: string
  onGroupFilterChange: (v?: string) => void
  lastSessionFilter: string
  onLastSessionFilterChange: (v: string) => void
  onToggleColumns: () => void
  showFilters: boolean
  onToggleFilters: () => void
  groups: GroupOption[]
}) {
  const ALL = "__ALL__"
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <Input
          placeholder="Search name or email…"
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="h-8 w-72 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
        />
        {globalFilter ? (
          <Button size="sm" variant="ghost" onClick={() => onGlobalFilterChange("")} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        ) : null}
      </div>

      <Select
        value={groupFilterValue ?? ALL}
        onValueChange={(v) => onGroupFilterChange(v === ALL ? undefined : v)}
      >
        <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
          <SelectValue placeholder="Filter by group" />
        </SelectTrigger>
        <SelectContent className="max-h-64 overflow-y-auto rounded-none border border-line bg-paper">
          <SelectItem value={ALL} className="rounded-none">All groups</SelectItem>
          {groups.map((g) => (
            <SelectItem key={g.id} value={g.id} className="rounded-none">{g.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={lastSessionFilter || "any"}
        onValueChange={(v) => onLastSessionFilterChange(v === "any" ? "" : v)}
      >
        <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
          <SelectValue placeholder="Last session within…" />
        </SelectTrigger>
        <SelectContent className="max-h-64 overflow-y-auto rounded-none border border-line bg-paper">
          <SelectItem value="any" className="rounded-none">Any time</SelectItem>
          <SelectItem value="7" className="rounded-none">Last 7 days</SelectItem>
          <SelectItem value="30" className="rounded-none">Last 30 days</SelectItem>
          <SelectItem value="90" className="rounded-none">Last 90 days</SelectItem>
          <SelectItem value="180" className="rounded-none">Last 180 days</SelectItem>
          <SelectItem value="365" className="rounded-none">Last 365 days</SelectItem>
        </SelectContent>
      </Select>

      <Button size="sm" variant="ghost" onClick={onToggleColumns} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]" title="Toggle columns (Last Session, Profiles)">
        <ColumnsIcon className="mr-1 h-4 w-4" /> Columns
      </Button>

      <Button size="sm" variant="ghost" onClick={onToggleFilters} className="ml-auto rounded-none text-ink hover:bg-[hsl(var(--muted))]" title={showFilters ? "Hide filters" : "Show filters"}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>
    </div>
  )
}
