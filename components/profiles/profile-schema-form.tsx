"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"

export type FieldType = "string" | "number" | "boolean" | "date" | "datetime" | "enum" | "picklist" | "object" | "array"

export type FieldSpec = (
  {
    key: string
    label?: string
    type: FieldType
  } & (
    | { type: "enum" | "picklist"; options: string[] }
    | { type: "object"; fields: FieldSpec[] }
    | { type: "array"; items: FieldSpec }
    | { type: "string" | "number" | "boolean" | "date" | "datetime" }
  )
)

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
          case "object": {
            const objVal = (v && typeof v === "object") ? v : {}
            return (
              <div key={f.key} className="space-y-2 md:col-span-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <ProfileSchemaForm
                  fields={(f as any).fields || []}
                  value={objVal}
                  onChange={(child) => setVal(f.key, child)}
                  disabled={disabled}
                />
              </div>
            )
          }
          case "array": {
            const items = (f as any).items as FieldSpec
            const arr: any[] = Array.isArray(v) ? v : []
            const addItem = () => {
              let empty: any = {}
              if (items.type === "object") {
                empty = {}
                ;((items as any).fields || []).forEach((sf: FieldSpec) => { empty[sf.key] = undefined })
              } else {
                empty = ""
              }
              setVal(f.key, [...arr, empty])
            }
            const updateAt = (idx: number, itemVal: any) => {
              const next = [...arr]
              next[idx] = itemVal
              setVal(f.key, next)
            }
            const removeAt = (idx: number) => {
              const next = [...arr]
              next.splice(idx, 1)
              setVal(f.key, next)
            }
            return (
              <div key={f.key} className="space-y-2 md:col-span-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <div className="space-y-3 rounded-none border border-line bg-paper p-2">
                  {arr.length === 0 && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">No items yet.</p>
                  )}
                  {arr.map((item, idx) => (
                    <div key={idx} className="rounded-none border border-line bg-paper p-2">
                      {items.type === "object" ? (
                        <ProfileSchemaForm
                          fields={(items as any).fields || []}
                          value={item || {}}
                          onChange={(child) => updateAt(idx, child)}
                          disabled={disabled}
                        />
                      ) : (
                        <Input
                          value={item ?? ""}
                          onChange={(e) => updateAt(idx, e.target.value)}
                          disabled={disabled}
                          className="rounded-none border border-line bg-paper text-ink"
                        />
                      )}
                      <div className="mt-2 text-right">
                        <button type="button" onClick={() => removeAt(idx)} className="text-xs text-[hsl(var(--destructive))] underline">Remove</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addItem} className="rounded-none border border-line px-2 py-1 text-xs text-ink hover:bg-[hsl(var(--muted))]">Add</button>
                </div>
              </div>
            )
          }
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
              <div key={(f as any).key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Select value={v ?? "__unset__"} onValueChange={(val) => setVal((f as any).key, val === "__unset__" ? "" : val)} disabled={disabled}>
                  <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border border-line bg-paper">
                    <SelectItem value="__unset__" className="rounded-none">—</SelectItem>
                    {(((f as any).options) || []).map((opt: string) => (
                      <SelectItem key={opt} value={opt} className="rounded-none">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          case "picklist":
            return (
              <div key={(f as any).key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <div className="rounded-none border border-line bg-paper p-2">
                  {(((f as any).options) || []).map((opt: string) => {
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
                            setVal((f as any).key, Array.from(next))
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
              <div key={(f as any).key} className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">{label}</Label>
                <Input
                  value={v ?? ""}
                  onChange={(e) => setVal((f as any).key, e.target.value)}
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
