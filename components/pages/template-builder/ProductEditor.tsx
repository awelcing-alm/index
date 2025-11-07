"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ProfilePreferencesEditor } from "@/components/profiles/profile-preferences-editor"
import { ProfileSchemaForm, type FieldSpec } from "@/components/profiles/profile-schema-form"
import { PRODUCT_SCHEMAS } from "@/lib/product-schemas"
import { MYLAW_TOPIC_RECS, MYLAW_REGION_RECS } from "@/lib/mylaw-taxonomy"
import { sanitizeMyLawProfile, describeMyLaw } from "@/lib/product-profiles"

export function ProductEditor({ kind, attributes, setAttributes }: {
  kind: "mylaw" | "radar" | "compass" | "scholar"
  attributes: any
  setAttributes: (a: any) => void
}) {
  if (kind === "mylaw") {
    return (
      <div className="space-y-4">
        <div>
          {(() => {
            try {
              const normalized = sanitizeMyLawProfile(attributes)
              const view = describeMyLaw(normalized) as any
              const topics = Array.isArray(attributes?.preferences?.topics) ? attributes.preferences.topics : []
              const regions = Array.isArray(attributes?.preferences?.regions) ? attributes.preferences.regions : []
              return (
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="rounded-none border-line text-xs text-ink">Topics: {topics.length}</Badge>
                  <Badge variant="outline" className="rounded-none border-line text-xs text-ink">Regions: {regions.length}</Badge>
                  <Badge variant="outline" className="rounded-none border-line bg-[hsl(var(--muted))]/40 text-ink">Updated: {view?.lastUpdated || "—"}</Badge>
                </div>
              )
            } catch { return null }
          })()}
          <div className="flex flex-wrap gap-2">
            {MYLAW_TOPIC_RECS.slice(0, 40).map((t) => {
              const arr: any[] = Array.isArray(attributes?.preferences?.topics) ? attributes.preferences.topics : []
              const selected = !!arr.find((x: any) => String(x?.name || "").toLowerCase() === t.name.toLowerCase())
              const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
              return (
                <button key={t.name} type="button" onClick={() => {
                  const next = { preferences: { ...(attributes?.preferences || { topics: [], regions: [] }) } }
                  const list: any[] = Array.isArray(next.preferences.topics) ? next.preferences.topics : []
                  const idx = list.findIndex((x: any) => String(x?.name || "").toLowerCase() === t.name.toLowerCase())
                  if (idx >= 0) list.splice(idx, 1)
                  else list.push({ name: t.name })
                  next.preferences.topics = list
                  setAttributes(next)
                }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")} title={`Toggle ${t.name}`}>{selected ? "✓ " : "+ "}{t.name}</button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="font-semibold text-ink">Recommended Regions</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {MYLAW_REGION_RECS.map((r) => {
              const arr: any[] = Array.isArray(attributes?.preferences?.regions) ? attributes.preferences.regions : []
              const selected = !!arr.find((x: any) => String(x?.name || "").toLowerCase() === r.name.toLowerCase())
              const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
              return (
                <button key={r.name} type="button" onClick={() => {
                  const next = { preferences: { ...(attributes?.preferences || { topics: [], regions: [] }) } }
                  const list: any[] = Array.isArray(next.preferences.regions) ? next.preferences.regions : []
                  const idx = list.findIndex((x: any) => String(x?.name || "").toLowerCase() === r.name.toLowerCase())
                  if (idx >= 0) list.splice(idx, 1)
                  else list.push({ name: r.name })
                  next.preferences.regions = list
                  setAttributes(next)
                }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")} title={`Toggle ${r.name}`}>{selected ? "✓ " : "+ "}{r.name}</button>
              )
            })}
          </div>
        </div>

        <div className="rounded-none border border-line bg-paper p-3">
          <div className="mb-2 text-sm text-[hsl(var(--muted-foreground))]">Edit preferences</div>
          <ProfilePreferencesEditor
            jsonText={JSON.stringify({ preferences: attributes?.preferences || { topics: [], regions: [] } }, null, 2)}
            onJsonChange={(next) => {
              try { const parsed = JSON.parse(next); setAttributes(parsed) } catch {}
            }}
          />
        </div>
      </div>
    )
  }

  // Other product editors: schema-driven form
  const attrs: any = attributes || {}
  const fields: FieldSpec[] | undefined = Array.isArray(attrs?.schema?.fields)
    ? attrs.schema.fields as FieldSpec[]
    : (Array.isArray(attrs?.fields) ? (attrs.fields as FieldSpec[]) : undefined)

  if (fields && fields.length) {
    const values: Record<string, any> = (attrs?.values && typeof attrs.values === "object")
      ? attrs.values as Record<string, any>
      : Object.fromEntries(fields.map((f) => [f.key, attrs?.[f.key]]))
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-[hsl(var(--muted-foreground))]">Template Fields</Label>
        </div>
        <ProfileSchemaForm
          fields={fields}
          value={values}
          onChange={(next) => {
            setAttributes({ ...attrs, schema: { fields }, values: next })
          }}
        />
      </div>
    )
  }

  return (
    <Alert className="rounded-none border border-line bg-[hsl(var(--muted))]">
      <AlertDescription className="text-ink">No schema defined for this product template yet.</AlertDescription>
    </Alert>
  )
}
