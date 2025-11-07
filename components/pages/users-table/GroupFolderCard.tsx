"use client"

import React, { type DragEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GroupIconInline } from "@/components/group-icon"

export function GroupFolderCard({
  id,
  name,
  icon,
  color,
  count,
  onDropUserIds,
}: {
  id: string
  name: string
  icon?: string | null
  color?: string | null
  count: number
  onDropUserIds: (groupId: string, userIds: string[]) => void
}) {
  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("text/plain")
    const ids = draggedId ? [draggedId] : []
    onDropUserIds(id, ids)
  }
  return (
    <Card onDragOver={onDragOver} onDrop={onDrop} className="cursor-pointer rounded-none border border-line bg-paper transition-colors hover:bg-[hsl(var(--muted))]" title={`Drop users to assign to ${name}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <GroupIconInline icon={(icon ?? "folder") as string} color={color ?? undefined} title={name} className="h-5 w-5" />
          <span className="capitalize text-ink" style={{ color: color ?? undefined }}>{name}</span>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-none border border-line bg-paper text-xs font-bold text-ink">
          {count}
        </div>
      </CardContent>
    </Card>
  )
}
