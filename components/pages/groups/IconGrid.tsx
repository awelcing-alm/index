"use client"

import React from "react"
import { GroupIconInline } from "@/components/group-icon"

const ICON_CHOICES: string[] = [
  "scale","bank","clipboard","shield","user","users","briefcase","file","chart","pie","gavel","building","folder","book",
]

export function IconGrid({ value, onChange, color }: { value: string; onChange: (next: string) => void; color?: string | null }) {
  return (
    <div className="rounded-md border p-3 bg-[hsl(var(--muted))]/10">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="select-none">Current:</span>
        <GroupIconInline icon={value} color={color ?? undefined} className="h-5 w-5" title="Current icon" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {ICON_CHOICES.map((key) => {
          const selected = value === key
          return (
            <button key={key} type="button" onClick={() => onChange(key)} aria-pressed={selected}
              className={["flex h-14 items-center justify-center rounded-md border transition-colors","bg-white/50 hover:bg-[hsl(var(--muted))]/30", selected?"ring-2 ring-offset-2 ring-blue-500 border-blue-500":"border-[hsl(var(--border))]"].join(" ")}
              title={key}
            >
              <GroupIconInline icon={key} color={color ?? undefined} className="h-6 w-6" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
