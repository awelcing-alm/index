"use client"

import React from "react"
import { GroupFolderCard } from "@/components/pages/users-table/GroupFolderCard"

export type GroupOption = { id: string; name: string; icon?: string | null; color?: string | null }

export function GroupFoldersList({
  groups,
  counts,
  onDropUserIds,
}: {
  groups: GroupOption[]
  counts: Record<string, number>
  onDropUserIds: (groupId: string, userIds: string[]) => void | Promise<void>
}) {
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <GroupFolderCard
          key={g.id}
          id={g.id}
          name={g.name}
          icon={g.icon}
          color={g.color}
          count={counts[g.id] ?? 0}
          onDropUserIds={onDropUserIds}
        />
      ))}
    </div>
  )
}
