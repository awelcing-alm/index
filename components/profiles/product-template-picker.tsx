"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductKey } from "@/lib/product-templates"

export function ProductTemplatePicker({
  product,
  templates,
  value,
  onApply,
  disabled,
  label,
}: {
  product: ProductKey
  templates: string[]
  value?: string
  onApply: (product: ProductKey, name: string) => void
  disabled?: boolean
  label?: string
}) {
  const isDisabled = disabled || !templates || templates.length === 0
  return (
    <div className="space-y-2">
      {label ? (
        <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
      ) : null}
      <Select
        value={value || ""}
        onValueChange={(v) => onApply(product, v)}
        disabled={isDisabled}
      >
        <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
          <SelectValue placeholder={isDisabled ? "No product templates" : "Choose template…"} />
        </SelectTrigger>
        <SelectContent className="rounded-none border border-line bg-paper">
          {(templates || []).map((n) => (
            <SelectItem key={n} value={n} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value ? (
        <div className="text-xs text-[hsl(var(--muted-foreground))]">
          Selected Template: <span className="text-ink">{value}</span> (unsaved)
        </div>
      ) : null}
    </div>
  )
}
