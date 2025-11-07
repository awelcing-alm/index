"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ChevronUp, ChevronDown, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function TemplatePicker({
  available,
  value,
  onChange,
  title = "Templates",
}: {
  available: string[]
  value: string[]
  onChange: (next: string[]) => void
  title?: string
}) {
  const [query, setQuery] = useState("")
  const remaining = useMemo(
    () => available.filter((n) => !value.includes(n) && n.toLowerCase().includes(query.toLowerCase())),
    [available, value, query],
  )

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[hsl(var(--muted-foreground))]">{title}</Label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          className="h-8 w-56 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </div>

      {/* Selected / ordered */}
      <div className="rounded-none border border-line bg-paper p-2">
        {value.length === 0 ? (
          <div className="text-xs text-[hsl(var(--muted-foreground))]">No templates selected.</div>
        ) : (
          <motion.ul layout className="space-y-1">
            <AnimatePresence initial={false}>
              {value.map((n, i) => (
                <motion.li
                  key={`${n}-${i}`}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  <Badge variant="outline" className="rounded-none border-line text-ink">{n}</Badge>
                  <div className="ms-auto flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-none" onClick={() => move(i, -1)} aria-label="Move up"><ChevronUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-none" onClick={() => move(i, +1)} aria-label="Move down"><ChevronDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-none" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove"><X className="h-4 w-4" /></Button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      {/* Available */}
      <div className="rounded-none border border-line bg-paper p-2">
        <div className="mb-1 text-xs text-[hsl(var(--muted-foreground))]">Available</div>
        <div className="flex flex-wrap gap-2">
          {remaining.slice(0, 50).map((n) => (
            <Button key={n} size="sm" variant="outline" className="rounded-none border-line text-ink" onClick={() => onChange([...value, n])}>
              <Plus className="mr-1 h-3 w-3" /> {n}
            </Button>
          ))}
          {remaining.length === 0 && (
            <div className="text-xs text-[hsl(var(--muted-foreground))]">No matches.</div>
          )}
        </div>
      </div>
    </div>
  )
}
