"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder } from "lucide-react"
import type { GroupWithCount } from "./types"
import { GROUP_ICON_EMOJI } from "./group-utils"

export function GroupFolders({
  groups,
  counts,
  onDragOver,
  onDrop,
}: {
  groups: GroupWithCount[]
  counts: Record<string, number>
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, groupId: string) => void
}) {
  return (
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
  )
}
