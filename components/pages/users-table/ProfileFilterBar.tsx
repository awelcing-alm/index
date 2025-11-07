"use client"

import React from "react"

export function ProfileFilterBar({ productGrants, profileFilter, setProfileFilter }: {
  productGrants: Record<string, boolean> | null
  profileFilter: Record<string, boolean>
  setProfileFilter: (next: Record<string, boolean>) => void
}) {
  const keys = productGrants ? Object.entries(productGrants).filter(([, on]) => on).map(([k]) => k) : []
  const hasAny = Object.values(profileFilter).some(Boolean)
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span className="text-xs text-[hsl(var(--muted-foreground))]">Profiles:</span>
      {keys.map((k) => (
        <button key={k} type="button" onClick={() => setProfileFilter({ ...profileFilter, [k]: !profileFilter[k] })}
          className={["rounded-none border px-2 py-1 text-xs transition-colors", profileFilter[k] ? "border-blue-600 bg-blue-600/10 text-ink" : "border-line bg-paper text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"].join(" ")}
        >
          {k[0].toUpperCase() + k.slice(1)}
        </button>
      ))}
      {hasAny && (
        <button type="button" onClick={() => setProfileFilter({})} className="rounded-none border border-line px-2 py-1 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" title="Clear profile filters">Clear</button>
      )}
    </div>
  )
}
