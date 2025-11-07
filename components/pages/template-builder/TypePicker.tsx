"use client"

import React from "react"
import { Button } from "@/components/ui/button"

type Kind = "newsletter" | "radar" | "compass" | "scholar" | "mylaw"

export function TypePicker({ kind, setKind, productGrants, onReset }: {
  kind: Kind
  setKind: (k: Kind) => void
  productGrants: Record<string, boolean> | null
  onReset: () => void
}) {
  const keys: Kind[] = ["newsletter", "radar", "compass", "scholar", "mylaw"]
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-[hsl(var(--muted-foreground))]">Type:</span>
      {keys.map((k) => {
        const disabled = k !== "newsletter" && !(productGrants as any)?.[k]
        return (
          <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} disabled={disabled}
            onClick={() => { setKind(k); onReset() }} className="rounded-none">
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </Button>
        )
      })}
    </div>
  )
}
