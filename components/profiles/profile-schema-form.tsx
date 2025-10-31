"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"

export type FieldType = "string" | "number" | "boolean" | "date" | "datetime" | "enum" | "picklist"

export type FieldSpec = {
  key: string
  label?: string
  type: FieldType
  options?: string[] // for enum/picklist
}

export function ProfileSchemaForm({
  fields,
  value,
  onChange,
  disabled,
}: {
  fields: FieldSpec[]
  value: Record<string, any>
  onChange: (next: Record<string, any>) => void
  disabled?: boolean
}) {
  const setVal = (k: string, v: any) => {
    const next = { ...(value || {}) }
    next[k] = v
    onChange(next)
  }

  const bool = (v: any) => (typeof v === "boolean" ? v : v === "true")

  const toDateInput = (v: any) => {
    if (!v) return ""
    try {
      const d = new Date(v)
      if (isNaN(d.getTime())) return String(v)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const dd = String(d.getDate()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}`
    } catch { return String(v) }
  }

  const toDateTimeInput = (v: any) => {
    if (!v) return ""
    try {
      const d = new Date(v)
      if (isNaN(d.getTime())) return String(v)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const dd = String(d.getDate()).padStart(2, "0")
      const hh = String(d.getHours()).padStart(2, "0")
      const mi = String(d.getMinutes()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
    } catch { return String(v) }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((f) => {
        const label = f.label || f.key
        const v = value?.[f.key]
        switch (f.type) {
          case "string":
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Input
                  value={v ?? ""}
                  onChange={(e) => setVal(f.key, e.target.value)}
                  disabled={disabled}
                  className="rounded-none border border-line bg-paper text-ink"
                />
              </div>
            )
          case "number":
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Input
                  type="number"
                  value={v ?? ""}
                  onChange={(e) => setVal(f.key, e.target.value === "" ? "" : Number(e.target.value))}
                  disabled={disabled}
                  className="rounded-none border border-line bg-paper text-ink"
                />
              </div>
            )
          case "boolean":
            return (
              <div key={f.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    className="rounded-none"
                    checked={bool(v)}
                    onCheckedChange={(c) => setVal(f.key, c === true)}
                    disabled={disabled}
                  />
                  <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                </div>
              </div>
            )
          case "date":
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Input
                  type="date"
                  value={toDateInput(v)}
                  onChange={(e) => setVal(f.key, e.target.value)}
                  disabled={disabled}
                  className="rounded-none border border-line bg-paper text-ink"
                />
              </div>
            )
          case "datetime":
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Input
                  type="datetime-local"
                  value={toDateTimeInput(v)}
                  onChange={(e) => setVal(f.key, e.target.value)}
                  disabled={disabled}
                  className="rounded-none border border-line bg-paper text-ink"
                />
              </div>
            )
          case "enum":
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Select value={v ?? "__unset__"} onValueChange={(val) => setVal(f.key, val === "__unset__" ? "" : val)} disabled={disabled}>
                  <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border border-line bg-paper">
                    <SelectItem value="__unset__" className="rounded-none">—</SelectItem>
                    {(f.options || []).map((opt) => (
                      <SelectItem key={opt} value={opt} className="rounded-none">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          case "picklist":
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <div className="rounded-none border border-line bg-paper p-2">
                  {(f.options || []).map((opt) => {
                    const arr: any[] = Array.isArray(v) ? v : []
                    const checked = arr.includes(opt)
                    return (
                      <div key={opt} className="flex items-center gap-2 py-1">
                        <Checkbox
                          className="rounded-none"
                          checked={checked}
                          onCheckedChange={(c) => {
                            const next = new Set(arr)
                            if (c === true) next.add(opt)
                            else next.delete(opt)
                            setVal(f.key, Array.from(next))
                          }}
                          disabled={disabled}
                        />
                        <span className="text-ink text-sm">{opt}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          default:
            return (
              <div key={f.key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Input
                  value={v ?? ""}
                  onChange={(e) => setVal(f.key, e.target.value)}
                  disabled={disabled}
                  className="rounded-none border border-line bg-paper text-ink"
                />
              </div>
            )
        }
      })}
    </div>
  )
}
