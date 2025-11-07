"use client"

import React from "react"
import { Radar as RadarIcon, Compass as CompassIcon, GraduationCap, BookOpen } from "lucide-react"

export type ProfileFlags = Record<string, boolean>
export type ProductGrants = Record<string, boolean> | null

export function ProfileIcons({ flags, productGrants }: { flags: ProfileFlags; productGrants: ProductGrants }) {
  const iconCls = (on?: boolean) => [
    "h-4 w-4",
    on ? "text-ink" : "text-[hsl(var(--muted-foreground))] opacity-50",
  ].join(" ")
  const keys = productGrants ? Object.entries(productGrants).filter(([, on]) => on).map(([k]) => k) : []
  const pickIcon = (k: string) => {
    const lk = k.toLowerCase()
    if (lk.includes("radar")) return <RadarIcon className={iconCls(flags[k])} />
    if (lk.includes("compass")) return <CompassIcon className={iconCls(flags[k])} />
    if (lk.includes("scholar")) return <GraduationCap className={iconCls(flags[k])} />
    if (lk.includes("law") || lk.includes("mylaw")) return <BookOpen className={iconCls(flags[k])} />
    return <BookOpen className={iconCls(flags[k])} />
  }
  return (
    <div className="flex items-center gap-2">
      <span className="sr-only">Profiles</span>
      {keys.map((k) => (
        <span key={k} title={flags[k] ? `${k} profile available` : `No ${k} profile`} className={flags[k] ? "rounded-sm ring-1 ring-ink/25 p-0.5" : undefined}>
          {pickIcon(k)}
        </span>
      ))}
    </div>
  )
}
