"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function BulkActionsBar({
  selectedCount,
  groups,
  templateNames,
  onApplyGroup,
  onApplyTemplate,
  onOpenApplyTemplates,
  loading,
  savedStacks,
  setInitialStack,
}: {
  selectedCount: number
  groups: Array<{ id: string; name: string }>
  templateNames: string[]
  onApplyGroup: (groupId: string) => void
  onApplyTemplate: (name: string) => void
  onOpenApplyTemplates: () => void
  loading: boolean
  savedStacks: Array<{ name: string; list: string[] }>
  setInitialStack: (stack: string[]) => void
}) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mb-4 flex flex-wrap items-center gap-4 rounded-none border border-line bg-[hsl(var(--muted))] p-3">
          <p className="text-sm text-ink">{selectedCount} selected</p>

          <Select onValueChange={onApplyGroup} disabled={loading}>
            <SelectTrigger className="h-8 w-48 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Assign Group…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={onApplyTemplate} disabled={loading}>
            <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
              <SelectValue placeholder="Apply Template…" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto rounded-none border border-line bg-paper">
              {templateNames.map((n) => (
                <SelectItem key={n} value={n} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" onClick={onOpenApplyTemplates} className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]">
            Apply Templates…
          </Button>

          {savedStacks.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Stacks:</span>
              {savedStacks.map((p) => {
                const label = p.name
                const tip = (p.list || []).slice(0, 6).join(" + ") + ((p.list || []).length > 6 ? " + …" : "")
                return (
                  <TooltipProvider key={label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="rounded-none border-line text-ink" onClick={() => setInitialStack(p.list)}>
                          {label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="rounded-none border-line bg-paper text-ink">{tip || "(empty)"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          )}
          {loading && <Loader2 className="h-4 w-4 animate-spin text-ink" aria-label="Working…" />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
