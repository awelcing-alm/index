"use client"

import React from "react"
import { GroupIconInline } from "@/components/group-icon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type Group = {
  id: string
  slug: string
  name: string
  color: string | null
  icon: string | null
}

export function GroupsList({
  groups,
  savedStacks,
  onApply,
  onDelete,
}: {
  groups: Group[]
  savedStacks: Array<{ name: string; list: string[] }>
  onApply: (groupId: string) => void
  onDelete: (g: Group) => void
}) {
  return (
    <section className="rounded-xl border p-4 md:p-6 bg-background">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Existing Groups</h2>
        {savedStacks.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Stacks:</span>
            {savedStacks.map((p) => {
              const tip = (p.list || []).slice(0,6).join(" + ") + ((p.list || []).length>6?" + …":"")
              return (
                <TooltipProvider key={p.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => onApply("") /* parent sets stack and opens modal */} className="rounded-none border border-line px-2 py-1 text-sm hover:bg-[hsl(var(--muted))]">{p.name}</button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-none border-line bg-paper text-ink">{tip || "(empty)"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        )}
      </div>

      {groups.length === 0 && <p className="text-muted-foreground">No groups yet.</p>}
      {groups.length > 0 && (
        <ul className="divide-y rounded-md border">
          {groups.map((g) => (
            <li key={g.slug} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <GroupIconInline icon={g.icon} color={g.color ?? undefined} title={g.name} className="h-5 w-5" />
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted-foreground">slug: {g.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!!g.color && (
                  <span className="inline-flex h-5 w-5 rounded border" style={{ background: g.color }} />
                )}
                <button onClick={() => onApply(g.id)} className="rounded-none border border-line px-2 py-1 text-sm text-ink hover:bg-[hsl(var(--muted))]" title="Apply templates to group members">Apply Templates…</button>
                <button onClick={() => onDelete(g)} className="text-red-600 hover:underline" title="Delete group">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
