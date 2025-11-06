"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Save, Radar as RadarIcon, Compass as CompassIcon, GraduationCap, BookOpen } from "lucide-react"
import { PRODUCT_SCHEMAS } from "@/lib/product-schemas"
import { ProductTemplatePicker } from "@/components/profiles/product-template-picker"
import { ProfilePreferencesEditor } from "@/components/profiles/profile-preferences-editor"
import { ProfileSchemaForm, type FieldSpec } from "@/components/profiles/profile-schema-form"
import { sanitizeMyLawProfile, describeMyLaw, sanitizeRadarProfile, describeRadar } from "@/lib/product-profiles"
import { MYLAW_TOPIC_RECS, MYLAW_REGION_RECS } from "@/lib/mylaw-taxonomy"

// In-file plugin registry: customize behavior per product key.
const PROFILE_PLUGINS: Record<string, {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  // Optional post-load sanitize + describe badges
  sanitize?: (raw: any) => any
  describe?: (norm: any) => { lastUpdated?: string; onBoardingStatus?: string } | Record<string, any>
  // Normalize attributes fetched from a template before setting into editor
  normalizeTemplate?: (attrs: any) => any
  // Optional recommendations editor UI
  recommendations?: (args: { draftJson: string; setDraft: (next: string) => void }) => React.ReactNode
}> = {
  mylaw: {
    label: "MyLaw",
    icon: BookOpen,
    sanitize: sanitizeMyLawProfile,
    describe: describeMyLaw as any,
    normalizeTemplate: (attrs: any) => {
      if (attrs && typeof attrs === "object" && (attrs as any).schema && (attrs as any).values) return (attrs as any).values
      return attrs || {}
    },
    recommendations: ({ draftJson, setDraft }) => {
      const raw = (() => { try { return JSON.parse(draftJson || "{}") } catch { return {} } })() as any
      const prefs = raw.preferences || {}
      const topics: any[] = Array.isArray(prefs.topics) ? prefs.topics : []
      const regions: any[] = Array.isArray(prefs.regions) ? prefs.regions : []
      return (
        <div className="rounded-none border border-line bg-paper p-3">
          <div className="mb-2 text-sm font-medium text-ink">Recommended Topics</div>
          <div className="flex flex-wrap gap-2">
            {MYLAW_TOPIC_RECS.slice(0, 30).map((t) => {
              const name = String(t.name)
              const selected = !!topics.find((x: any) => String(x?.name || "").toLowerCase() === name.toLowerCase())
              const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
              return (
                <button key={name} type="button" onClick={() => {
                  const next = { ...(raw || {}) } as any
                  next.preferences = next.preferences || {}
                  const list: any[] = Array.isArray(next.preferences.topics) ? next.preferences.topics : []
                  const idx = list.findIndex((x: any) => String(x?.name || "").toLowerCase() === name.toLowerCase())
                  if (idx >= 0) list.splice(idx, 1)
                  else list.push({ name })
                  next.preferences.topics = list
                  setDraft(JSON.stringify(next, null, 2))
                }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")}>{selected ? "✓ " : "+ "}{name}</button>
              )
            })}
          </div>
          <div className="mt-3 mb-2 text-sm font-medium text-ink">Recommended Regions</div>
          <div className="flex flex-wrap gap-2">
            {MYLAW_REGION_RECS.map((r) => {
              const name = String(r.name)
              const selected = !!regions.find((x: any) => String(x?.name || "").toLowerCase() === name.toLowerCase())
              const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
              return (
                <button key={name} type="button" onClick={() => {
                  const next = { ...(raw || {}) } as any
                  next.preferences = next.preferences || {}
                  const list: any[] = Array.isArray(next.preferences.regions) ? next.preferences.regions : []
                  const idx = list.findIndex((x: any) => String(x?.name || "").toLowerCase() === name.toLowerCase())
                  if (idx >= 0) list.splice(idx, 1)
                  else list.push({ name })
                  next.preferences.regions = list
                  setDraft(JSON.stringify(next, null, 2))
                }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")}>{selected ? "✓ " : "+ "}{name}</button>
              )
            })}
          </div>
        </div>
      )
    },
  },
  radar: {
    label: "Radar",
    icon: RadarIcon,
    sanitize: sanitizeRadarProfile,
    describe: describeRadar as any,
    normalizeTemplate: (attrs: any) => {
      if (attrs && typeof attrs === "object" && (attrs as any).schema && (attrs as any).values) return (attrs as any).values
      return attrs || {}
    },
    recommendations: ({ draftJson, setDraft }) => {
      const raw = (() => { try { return JSON.parse(draftJson || "{}") } catch { return {} } })() as any
      const userData = raw?.data?.userData || raw?.userData || raw
      const arr: any[] = Array.isArray(userData?.followedEntities) ? userData.followedEntities : []
      return (
        <div className="rounded-none border border-line bg-paper p-3">
          <div className="mb-2 text-sm font-medium text-ink">Recommended Topics</div>
          <div className="flex flex-wrap gap-2">
            {MYLAW_TOPIC_RECS.slice(0, 30).map((t) => {
              const id = String((t as any).id || (t as any).mylawId || "")
              const name = String(t.name)
              const selected = !!arr.find((x: any) => String(x?.id || "") === id)
              const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
              return (
                <button key={name} type="button" onClick={() => {
                  const next = { ...(raw || {}) } as any
                  const u = (next.data && next.data.userData) ? next.data.userData : (next.userData || (next.userData = {}))
                  u.followedEntities = Array.isArray(u.followedEntities) ? u.followedEntities : []
                  const idx = u.followedEntities.findIndex((x: any) => String(x?.id || "") === id)
                  if (idx >= 0) u.followedEntities.splice(idx, 1)
                  else u.followedEntities.push({ id, name, type: "topic" })
                  if (next.data && next.data.userData) next.data.userData = u
                  else next.userData = u
                  setDraft(JSON.stringify(next, null, 2))
                }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")}>{selected ? "✓ " : "+ "}{name}</button>
              )
            })}
          </div>
        </div>
      )
    },
  },
  compass: { label: "Compass", icon: CompassIcon },
  scholar: { label: "Scholar", icon: GraduationCap },
}

export function ProductProfilesSection({ userId }: { userId?: string }) {
  const [appAvail, setAppAvail] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean }>({})
  const [appErr, setAppErr] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [appLoading, setAppLoading] = useState(false)
  const [appDraft, setAppDraft] = useState<string>("")
  const [appSaveMsg, setAppSaveMsg] = useState<string | null>(null)
  const [openProduct, setOpenProduct] = useState<string | "">("")
  const [productTpls, setProductTpls] = useState<Record<string, string[]>>({})
  const [grants, setGrants] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean } | null>(null)
  const [selectedProductTemplate, setSelectedProductTemplate] = useState<Record<string, string>>({})

  const visibleKeys = useMemo(() => {
    const union = { ...(grants || {}), ...(appAvail || {}) } as Record<string, any>
    // If we know plugins for keys, keep their order preference by plugins first
    const pluginKeys = Object.keys(PROFILE_PLUGINS)
    const dynamic = Object.keys(union).filter((k) => union[k] !== false)
    const ordered = [
      ...pluginKeys.filter((k) => dynamic.includes(k)),
      ...dynamic.filter((k) => !pluginKeys.includes(k)),
    ]
    return Array.from(new Set(ordered))
  }, [grants, appAvail])

  // Load product template names + account grants
  useEffect(() => {
    if (!userId) return
    let alive = true
    ;(async () => {
      try {
        const keys = Object.keys(PROFILE_PLUGINS).length ? Object.keys(PROFILE_PLUGINS) : ["mylaw", "radar", "compass", "scholar"]
        const qs = encodeURIComponent(keys.join(","))
        const r = await fetch(`/api/product-templates?products=${qs}`, { cache: "no-store" })
        const payload = await r.json().catch(() => null)
        if (!alive) return
        const map = (payload && payload.products) || {}
        const normalized: Record<string, string[]> = {}
        for (const k of keys) normalized[k] = Array.isArray(map[k]) ? map[k] : []
        setProductTpls(normalized)
      } catch {
        if (alive) setProductTpls({})
      }
      try {
        const keys = Object.keys(PROFILE_PLUGINS).length ? Object.keys(PROFILE_PLUGINS) : ["mylaw", "radar", "compass", "scholar"]
        const qs = encodeURIComponent(keys.join(","))
        const r = await fetch(`/api/templates/products/grants?products=${qs}`, { cache: "no-store" })
        const p = await r.json().catch(() => ({}))
        if (!alive) return
        const g = p?.grants || {}
        setGrants({ ...g, mylaw: true })
      } catch {
        if (alive) setGrants({ mylaw: true })
      }
    })()
    return () => { alive = false }
  }, [userId])

  // probe Extended Profile app availability when opening and user is loaded
  useEffect(() => {
    if (!userId) return
    let alive = true
    setAppErr(null)
    ;(async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(userId)}/extended-profiles`, { cache: "no-store" })
        if (!res.ok) throw new Error(await res.text())
        const payload = await res.json()
        const a = payload?.availability || {}
        if (!alive) return
        setAppAvail({ radar: !!a.radar?.exists, compass: !!a.compass?.exists, scholar: !!a.scholar?.exists, mylaw: !!a.mylaw?.exists })
      } catch (e: any) {
        if (!alive) return
        setAppErr(e?.message || "Failed to check app profiles")
        setAppAvail({})
      }
    })()
    return () => { alive = false }
  }, [userId])

  const loadAppProfile = async (key: string) => {
    if (!userId) return
    setActiveApp(key)
    setAppLoading(true)
    setAppSaveMsg(null)
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}/extended-profiles/${key}`, { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const payload = await res.json()
      const data = payload?.data ?? null
      const text = data ? JSON.stringify(data, null, 2) : "{}"
      setAppDraft(text)
    } catch (e: any) {
      setAppDraft("{}")
      setAppErr(e?.message || "Failed to load profile")
    } finally {
      setAppLoading(false)
    }
  }

  const applyProductTemplateToDraft = async (product: string, name: string) => {
    if (!name) return
    try {
      const res = await fetch(`/api/product-templates/${product}/${encodeURIComponent(name)}`, { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const payload = await res.json().catch(() => null)
      let attrs = (payload && payload.attributes) || {}
      const plugin = PROFILE_PLUGINS[product]
      if (plugin?.normalizeTemplate) {
        attrs = plugin.normalizeTemplate(attrs)
      } else if (!(attrs && typeof attrs === 'object' && 'schema' in attrs)) {
        const schema = (PRODUCT_SCHEMAS as any)[product]?.schema || { fields: [] }
        attrs = { schema, values: attrs || {} }
      }
      setAppDraft(JSON.stringify(attrs || {}, null, 2))
      setSelectedProductTemplate((p) => ({ ...p, [product]: name }))
    } catch (e) {
      setAppSaveMsg((e as any)?.message || "Failed to load template")
      setTimeout(() => setAppSaveMsg(null), 2500)
    }
  }

  const saveAppProfile = async () => {
    if (!userId || !activeApp) return
    setAppLoading(true)
    setAppSaveMsg(null)
    try {
      let parsed: any = {}
      try { parsed = appDraft ? JSON.parse(appDraft) : {} } catch {
        setAppSaveMsg("Invalid JSON")
        setAppLoading(false)
        return
      }
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}/extended-profiles/${activeApp}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      })
      if (!res.ok) throw new Error(await res.text())
      setAppSaveMsg("Profile saved")
      setAppAvail((p) => ({ ...p, [activeApp]: true }))
      try {
        const re = await fetch(`/api/users/${encodeURIComponent(userId)}/extended-profiles/${activeApp}`, { cache: "no-store" })
        const payload = await re.json().catch(() => null)
        const data = payload?.data ?? null
        const text = data ? JSON.stringify(data, null, 2) : "{}"
        setAppDraft(text)
      } catch {}
    } catch (e: any) {
      setAppSaveMsg(e?.message || "Failed to save")
    } finally {
      setAppLoading(false)
      setTimeout(() => setAppSaveMsg(null), 2500)
    }
  }

  return (
    <div className="mt-2">
      <div className="mb-2 text-sm text-[hsl(var(--muted-foreground))]">Profiles</div>
      <Tabs
        value={openProduct || ""}
        onValueChange={(v) => {
          const key = (v || "") as string | ""
          if (key && key === openProduct) { setOpenProduct(""); setActiveApp(null); return }
          setOpenProduct(key)
          if (key) { setActiveApp(key as string); loadAppProfile(key as string) }
        }}
      >
        <TabsList className="rounded-none border-b border-line bg-transparent">
          {visibleKeys.map((k) => {
            const P = PROFILE_PLUGINS[k]
            const Icon = P?.icon || BookOpen
            const label = P?.label || (k[0]?.toUpperCase() + k.slice(1))
            const available = (appAvail as any)?.[k]
            return (
              <TabsTrigger key={k} value={k} className="rounded-none px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))] data-[state=active]:bg-ink data-[state=active]:text-paper data-[state=active]:shadow-sm">
                <div className="flex items-center gap-2"><Icon className="h-4 w-4" /> {label} {available ? <span className="ml-2 hidden text-xs text-ink sm:inline">• available</span> : null}</div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {visibleKeys.map((k) => {
          const P = PROFILE_PLUGINS[k]
          const label = P?.label || (k[0]?.toUpperCase() + k.slice(1))
          return (
            <TabsContent key={k} value={k}>
          {activeApp === k && (
            <div className="space-y-4">
              <ProductTemplatePicker product={k as any} templates={productTpls[k] || []} value={selectedProductTemplate[k]} onApply={applyProductTemplateToDraft} label={`Apply ${label} Template`} />
              <div className="rounded-none border border-line bg-paper p-3">
                {(() => {
                  try {
                    const raw = JSON.parse(appDraft || "{}")
                    const plugin = PROFILE_PLUGINS[k]
                    if (plugin?.sanitize && plugin?.describe) {
                      const norm = plugin.sanitize(raw)
                      const view = plugin.describe(norm) as any
                      return (
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="rounded-none border-line bg-[hsl(var(--muted))]/40 text-ink">Updated: {view?.lastUpdated || "—"}</Badge>
                          <Badge variant="outline" className="rounded-none border-line text-ink">Onboarding: {view?.onBoardingStatus || "—"}</Badge>
                        </div>
                      )
                    }
                    return null
                  } catch { return null }
                })()}
              </div>
              {PROFILE_PLUGINS[k]?.recommendations?.({ draftJson: appDraft, setDraft: setAppDraft })}
              <div className="rounded-none border border-line bg-paper p-3">
                <h4 className="mb-2 font-medium text-ink">Edit Preferences</h4>
                <ProfilePreferencesEditor jsonText={appDraft} onJsonChange={(next) => setAppDraft(next)} />
              </div>
              {(() => {
                try {
                  const parsed = appDraft ? JSON.parse(appDraft) : {}
                  const fields: FieldSpec[] | undefined = Array.isArray(parsed?.schema?.fields) ? parsed.schema.fields : (Array.isArray(parsed?.fields) ? parsed.fields : undefined)
                  if (fields && fields.length) {
                    const values: Record<string, any> = (parsed?.values && typeof parsed.values === "object") ? parsed.values : (parsed && parsed.schema ? {} : parsed)
                    return (
                      <div className="rounded-none border border-line bg-paper p-3">
                        <h4 className="mb-2 font-medium text-ink">Edit Fields</h4>
                        <ProfileSchemaForm fields={fields as FieldSpec[]} value={values} onChange={(next) => { const nextDoc = { ...parsed, schema: { fields }, values: next }; setAppDraft(JSON.stringify(nextDoc, null, 2)) }} />
                      </div>
                    )
                  }
                } catch {}
                return null
              })()}
              <div className="flex items-center justify-end gap-2">
                {appSaveMsg && <span className="text-sm text-[hsl(var(--muted-foreground))]">{appSaveMsg}</span>}
                <Button size="sm" onClick={saveAppProfile} className="rounded-none bg-ink text-paper hover:bg-ink/90"><Save className="mr-2 h-4 w-4" /> Save Profile</Button>
              </div>
            </div>
          )}
            </TabsContent>
          )
        })}
      </Tabs>
      {appErr && (
        <span className="mt-2 block text-xs text-[hsl(var(--destructive))]">{appErr}</span>
      )}
    </div>
  )
}
