"use client"

import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { GroupWithCount } from "./types"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"

export function UsersSelectionBar({
  selectedCount,
  groups,
  loading,
  onApplyGroup,
  onApplyTemplate,
}: {
  selectedCount: number
  groups: GroupWithCount[]
  loading: boolean
  onApplyGroup: (groupId: string) => void
  onApplyTemplate: (templateName: string) => void
}) {
  if (selectedCount === 0) return null
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 rounded-none border border-line bg-[hsl(var(--muted))] p-3">
      <p className="text-sm text-ink">{selectedCount} selected</p>

      <Select onValueChange={onApplyGroup} disabled={loading}>
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

      <Select onValueChange={onApplyTemplate} disabled={loading}>
        <SelectTrigger className="h-8 w-52 rounded-none border border-line bg-paper text-ink">
          <SelectValue placeholder="Apply Template…" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
          {DEFAULT_TEMPLATES.map((t) => (
            <SelectItem key={t.name} value={t.name} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading && <Loader2 className="h-4 w-4 animate-spin text-ink" aria-label="Working…" />}
    </div>
  )
}
