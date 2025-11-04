// components/user-edit-modal.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Loader2, Users as UsersIcon, Save, AlertTriangle, Info,
  Radar as RadarIcon, Compass as CompassIcon, GraduationCap, BookOpen,
} from "lucide-react"

import type { Group } from "@/lib/groups"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { updateUserAttributesAction } from "@/lib/user-actions"
import NewsletterManagerModal from "@/components/newsletters/newsletter-manager-modal"
import type { ProductKey } from "@/lib/product-templates"
import { sanitizeMyLawProfile, describeMyLaw, sanitizeRadarProfile, describeRadar } from "@/lib/product-profiles"
import { MYLAW_TOPIC_RECS, MYLAW_REGION_RECS } from "@/lib/mylaw-taxonomy"
import { ProfilePreferencesEditor } from "@/components/profiles/profile-preferences-editor"
import React from "react"
import { ProfileSchemaForm, type FieldSpec } from "@/components/profiles/profile-schema-form"
import { PRODUCT_SCHEMAS } from "@/lib/product-schemas"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"

/* -------------------- types --------------------- */
type GroupWithCount = Group & { user_count?: number }

type AfterSavePayload = {
  userId: string
  oldGroupId?: string | null
  newGroupId?: string | null
  newAttributes?: Record<string, any>
  appliedTemplateName?: string | null
}

/* ------------- attribute schema visible ---------- */
const ATTRIBUTE_SCHEMA: Record<
  string,
  { label: string; type: "text" | "select" | "tel"; options?: string[] }
> = {
  firstname: { label: "First Name", type: "text" },
  lastname: { label: "Last Name", type: "text" },
  organization: { label: "Organization", type: "text" },
  "job-area": {
    label: "Job Area",
    type: "select",
    options: [
      "In-House Counsel",
      "Technology Executive",
      "Corporate Executive",
      "Law Firm",
      "Solo Practitioner",
    ],
  },
  "job-function": {
    label: "Job Function",
    type: "select",
    options: ["General Counsel", "Associate", "CEO", "Student"],
  },
  address: { label: "Address", type: "text" },
  city: { label: "City", type: "text" },
  phone: { label: "Phone", type: "tel" },
}

// OptOut normalization (Zephr schema values vs UI labels)
// Schema shows: "None" | "marketing" | "All"
const OPT_OUT_LABELS = [
  { ui: "None", value: "None" },
  { ui: "Marketing", value: "marketing" },
  { ui: "All", value: "All" },
] as const

function normalizeOptOutInput(v: unknown): string {
  const s = (v ?? "").toString()
  if (s.toLowerCase() === "marketing") return "marketing"
  if (s === "All") return "All"
  return "None"
}

/* ---------------- template helpers ---------------- */
const DEFAULT_MAP = Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.name, t]))

// Robustly parse /api/templates which returns { ok, names } (or sometimes { data } / array)
const fetchCustomTemplateNames = async (): Promise<string[]> => {
  try {
    const res = await fetch("/api/templates", { cache: "no-store" })
    if (!res.ok) return []
    const payload = await res.json().catch(() => null)

    const arr = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.names)
      ? payload.names
      : Array.isArray(payload?.data)
      ? payload.data
      : []

    return arr.map(String).filter(Boolean)
  } catch {
    return []
  }
}

const fetchTemplate = async (name: string) => {
  if (DEFAULT_MAP[name]) return DEFAULT_MAP[name]
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Template not found")
  return (await res.json()) as { name: string; attributes: Record<string, any> }
}

/* ---------------- group helpers ------------------ */
const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || ""

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function getRawGroupValue(u: any): string | null {
  const a = u?.attributes ?? {}
  const candidates: unknown[] = [
    a.group, a.Group, a["group-name"], a["group_name"],
    a["group-id"], a["group_id"], a["group-slug"], a["group_slug"], u?.group,
  ]
  for (const c of candidates) {
    if (!c) continue
    if (typeof c === "string") return c.trim()
    if (typeof c === "object" && c && "value" in (c as any) && typeof (c as any).value === "string") {
      return (c as any).value.trim()
    }
  }
  return null
}

function buildLookups(groups: GroupWithCount[]) {
  const byId = Object.fromEntries(groups.map((g) => [g.id, g]))
  const byName = Object.fromEntries(groups.map((g) => [g.name, g]))
  const byNameLower = Object.fromEntries(groups.map((g) => [g.name.toLowerCase(), g]))
  const bySlug = Object.fromEntries(groups.map((g) => [g.slug, g]))
  const bySlugifiedName = Object.fromEntries(groups.map((g) => [slugify(g.name), g]))
  const resolve = (value?: string | null): GroupWithCount | null => {
    if (!value) return null
    const raw = String(value).trim()
    if (!raw) return null
    if (UUID_V4.test(raw) && byId[raw]) return byId[raw]
    if (byName[raw]) return byName[raw]
    const lower = raw.toLowerCase()
    if (byNameLower[lower]) return byNameLower[lower]
    if (bySlug[raw]) return bySlug[raw]
    const vSlug = slugify(raw)
    if (bySlug[vSlug]) return bySlug[vSlug]
    if (bySlugifiedName[vSlug]) return bySlugifiedName[vSlug]
    return null
  }
  return { byId, resolve }
}

/* ---------------- component ---------------------- */
export function UserEditModal({
  userDetails,
  groups,
  loading,
  error,
  isOpen,
  onClose,
  onAfterSave,
}: {
  userDetails: any | null
  groups: GroupWithCount[]
  loading: boolean
  error: string | null
  isOpen: boolean
  onClose: () => void
  onAfterSave?: (p: AfterSavePayload) => void
}) {
  const [edited, setEdited] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // templates
  const [tplNames, setTplNames] = useState<string[]>([])
  const [tplErr, setTplErr] = useState<string | null>(null)
  const [tplValue, setTplValue] = useState<string | null>(null)
  const [pendingTpl, setPendingTpl] = useState<string | null>(null)

  // groups
  const lookups = useMemo(() => buildLookups(groups), [groups])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [fetchErr, setFetchErr] = useState<string | null>(null)

  // newsletters modal state (must be inside component)
  const [newsletterOpen, setNewsletterOpen] = useState(false)

  // Extended Profile app availability + editor
  const [appAvail, setAppAvail] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean }>({})
  const [appErr, setAppErr] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<ProductKey | null>(null)
  const [appLoading, setAppLoading] = useState(false)
  const [appDraft, setAppDraft] = useState<string>("")
  const [appSaveMsg, setAppSaveMsg] = useState<string | null>(null)
  const [openProduct, setOpenProduct] = useState<ProductKey | "">("")
  const [productTpls, setProductTpls] = useState<{ radar: string[]; compass: string[]; scholar: string[]; mylaw: string[] }>({ radar: [], compass: [], scholar: [], mylaw: [] })
  const [grants, setGrants] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean } | null>(null)
  const [selectedProductTemplate, setSelectedProductTemplate] = useState<Partial<Record<ProductKey, string>>>({})

  const details = userDetails

  /* --- load templates list on open --- */
  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      try {
        const custom = await fetchCustomTemplateNames()
        const defaults = DEFAULT_TEMPLATES.map((t) => t.name)
        // Merge safely; avoid duplicates; keep simple alpha sort
        const merged = Array.from(new Set([...defaults, ...custom])).sort((a, b) =>
          a.localeCompare(b),
        )
        setTplNames(merged)
        setTplErr(null)
      } catch (e) {
        console.error(e)
        setTplErr("Failed to load templates")
      }
    })()
  }, [isOpen])

  // Load product template names + account grants
  useEffect(() => {
    if (!isOpen) return
    let alive = true
    ;(async () => {
      try {
        const [radar, compass, scholar, mylaw] = await Promise.all([
          fetch("/api/product-templates/radar", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])),
          fetch("/api/product-templates/compass", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])),
          fetch("/api/product-templates/scholar", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])),
          fetch("/api/product-templates/mylaw", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])),
        ])
        if (!alive) return
        setProductTpls({
          radar: (Array.isArray(radar) ? radar : []).filter(Boolean).sort(),
          compass: (Array.isArray(compass) ? compass : []).filter(Boolean).sort(),
          scholar: (Array.isArray(scholar) ? scholar : []).filter(Boolean).sort(),
          mylaw: (Array.isArray(mylaw) ? mylaw : []).filter(Boolean).sort(),
        })
      } catch {
        if (alive) setProductTpls({ radar: [], compass: [], scholar: [], mylaw: [] })
      }
      try {
        const r = await fetch("/api/templates/products/grants", { cache: "no-store" })
        const p = await r.json().catch(() => ({}))
        if (!alive) return
        const g = p?.grants || {}
        setGrants({ radar: !!g.radar, compass: !!g.compass, scholar: !!g.scholar, mylaw: true })
      } catch {
        if (alive) setGrants({ radar: false, compass: false, scholar: false, mylaw: true })
      }
    })()
    return () => { alive = false }
  }, [isOpen])

  // probe Extended Profile app availability when opening and user is loaded
  useEffect(() => {
    if (!isOpen || !details?.user_id) return
    let alive = true
    setAppErr(null)
    ;(async () => {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(details.user_id)}/extended-profiles`, { cache: "no-store" })
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
  }, [isOpen, details?.user_id])

  /* --- initialise form values from user --- */
  useEffect(() => {
    if (!details || !isOpen) return

    // attributes
    const init: Record<string, any> = {}
    Object.keys(ATTRIBUTE_SCHEMA).forEach((k) => {
      init[k] = details.attributes?.[k] ?? ""
    })
    // copy through other attributes if any (so we don't erase)
    Object.entries(details.attributes ?? {}).forEach(([k, v]) => {
      if (!(k in init)) init[k] = v
    })

    // initialize optout explicitly (lives outside the grid)
    init.optout = normalizeOptOutInput(details.attributes?.optout)

    setEdited(init)
    setSaveErr(null); setSuccess(null)

    // figure current group
    const raw = getRawGroupValue(details)
    const resolved = lookups.resolve(raw)
    setSelectedGroupId(resolved?.id ?? null)

    // auto-apply default template from group (if any)
    if (resolved?.default_template) {
      const name = resolved.default_template
      setTplValue(name)
      ;(async () => {
        try {
          const tpl = await fetchTemplate(name)
          setEdited((p) => ({ ...p, ...tpl.attributes }))
          setPendingTpl(name)
        } catch (e) {
          console.error(e)
        }
      })()
    } else {
      setTplValue(null)
      setPendingTpl(null)
    }
  }, [details, isOpen, lookups])

  /* ---------------- handlers ---------------- */
  const onAttrChange = (k: string, v: string) => setEdited((p) => ({ ...p, [k]: v }))

  const onChooseTemplate = async (name: string) => {
    if (!name) return
    try {
      const tpl = await fetchTemplate(name)
      setEdited((p) => ({ ...p, ...tpl.attributes }))
      setTplValue(name)
      setPendingTpl(name)
      setSaveErr(null)
    } catch (e) {
      console.error(e)
      setSaveErr("Failed to apply template")
    }
  }

  const onChooseGroup = async (id: string) => {
    setSelectedGroupId(id)
    const g = lookups.byId[id]
    setEdited((p) => ({
      ...p,
      group: g?.name ?? "",
      ...(g?.demographics ?? {}),
    }))
    if (g?.default_template) {
      const name = g.default_template
      try {
        const tpl = await fetchTemplate(name)
        setEdited((p) => ({ ...p, ...tpl.attributes }))
        setTplValue(name)
        setPendingTpl(name)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleSave = async () => {
    if (!details) return
    setSaving(true); setSaveErr(null); setSuccess(null)

    const patch: Record<string, any> = {}
    for (const [k, v] of Object.entries(edited)) if (v !== "") patch[k] = v

    if (Object.keys(patch).length === 0) {
      setSaveErr("No attributes to save")
      setSaving(false)
      return
    }

    try {
      const res = await updateUserAttributesAction(details.user_id, patch)
      if (res?.success) {
        const before = lookups.resolve(getRawGroupValue(details))
        const after = lookups.resolve(edited.group)

        setSuccess(
          pendingTpl
            ? `Template “${pendingTpl}” applied & user updated!`
            : "User updated successfully!"
        )

        onAfterSave?.({
          userId: details.user_id,
          oldGroupId: before?.id ?? null,
          newGroupId: after?.id ?? null,
          newAttributes: patch,
          appliedTemplateName: pendingTpl ?? tplValue ?? null,
        })

        setTimeout(onClose, 1200)
      } else {
        setSaveErr(res?.error || "Failed to update user")
      }
    } catch (e: any) {
      setSaveErr(e?.message ?? "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  // load a specific app profile
  const loadAppProfile = async (key: ProductKey) => {
    if (!details?.user_id) return
    setActiveApp(key)
    setAppLoading(true)
    setAppSaveMsg(null)
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(details.user_id)}/extended-profiles/${key}`, { cache: "no-store" })
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

  const applyProductTemplateToDraft = async (product: ProductKey, name: string) => {
    if (!name) return
    try {
      const res = await fetch(`/api/product-templates/${product}/${encodeURIComponent(name)}`, { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const payload = await res.json().catch(() => null)
      let attrs = (payload && payload.attributes) || {}
      // For MyLaw/Radar use raw values (or values within schema wrapper)
      if (product === "mylaw" || product === "radar") {
        if (attrs && typeof attrs === 'object' && (attrs as any).schema && (attrs as any).values) {
          attrs = (attrs as any).values
        }
        setAppDraft(JSON.stringify(attrs || {}, null, 2))
      } else {
        // Compass/Scholar: ensure { schema, values }
        if (!(attrs && typeof attrs === 'object' && 'schema' in attrs)) {
          const schema = PRODUCT_SCHEMAS[product]?.schema || { fields: [] }
          attrs = { schema, values: attrs || {} }
        }
        setAppDraft(JSON.stringify(attrs, null, 2))
      }
      setSelectedProductTemplate((p) => ({ ...p, [product]: name }))
    } catch (e) {
      setAppSaveMsg((e as any)?.message || "Failed to load template")
      setTimeout(() => setAppSaveMsg(null), 2500)
    }
  }

  const saveAppProfile = async () => {
    if (!details?.user_id || !activeApp) return
    setAppLoading(true)
    setAppSaveMsg(null)
    try {
      let parsed: any = {}
      try { parsed = appDraft ? JSON.parse(appDraft) : {} } catch {
        setAppSaveMsg("Invalid JSON")
        setAppLoading(false)
        return
      }
      const res = await fetch(`/api/users/${encodeURIComponent(details.user_id)}/extended-profiles/${activeApp}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      })
      if (!res.ok) throw new Error(await res.text())
      setAppSaveMsg("Profile saved")
      // refresh availability (profile now exists)
      setAppAvail((p) => ({ ...p, [activeApp]: true }))
      // reload profile to reflect server-side normalization
      try {
        const re = await fetch(`/api/users/${encodeURIComponent(details.user_id)}/extended-profiles/${activeApp}`, { cache: "no-store" })
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

  /* ---------------- render ------------------ */
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border border-line text-ink">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-ink">
            <UsersIcon className="h-5 w-5" aria-hidden="true" />
            Edit User: {details?.identifiers?.email_address ?? "…"}
          </DialogTitle>
        </DialogHeader>

        {/* Top box: Group + Template */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-ink">Apply Group & Template</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profiles accordion (low visual load) */}
            <div className="mb-2 text-sm text-[hsl(var(--muted-foreground))]">Profiles</div>
            <Accordion type="single" collapsible value={openProduct} onValueChange={(v) => {
              const key = (v || "") as ProductKey | ""
              setOpenProduct(key)
              if (key) { setActiveApp(key as ProductKey); loadAppProfile(key as ProductKey) }
            }}>
              {/* MyLaw always available */}
              <AccordionItem value="mylaw">
                <AccordionTrigger className="text-ink"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> MyLaw {appAvail.mylaw ? <span className="ml-2 text-xs text-ink">• available</span> : null}</div></AccordionTrigger>
                <AccordionContent>
                  {activeApp === "mylaw" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[hsl(var(--muted-foreground))]">Apply MyLaw Template</Label>
                        <Select value={selectedProductTemplate.mylaw || ""} onValueChange={(v) => applyProductTemplateToDraft("mylaw", v)} disabled={!productTpls.mylaw.length}>
                          <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                            <SelectValue placeholder={productTpls.mylaw.length ? "Choose template…" : "No product templates"} />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border border-line bg-paper">
                            {productTpls.mylaw.map((n) => (
                              <SelectItem key={n} value={n} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedProductTemplate.mylaw && (
                          <div className="text-xs text-[hsl(var(--muted-foreground))]">Selected Template: <span className="text-ink">{selectedProductTemplate.mylaw}</span> (unsaved)</div>
                        )}
                      </div>
                      <div className="rounded-none border border-line bg-paper p-3">
                        {(() => {
                          try {
                            const raw = JSON.parse(appDraft || "{}")
                            const normalized = sanitizeMyLawProfile(raw)
                            const view = describeMyLaw(normalized)
                            return (
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="rounded-none border-line bg-[hsl(var(--muted))]/40 text-ink">Updated: {view.lastUpdated || "—"}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Onboarding: {view.onBoardingStatus || "—"}</Badge>
                              </div>
                            )
                          } catch { return <div className="text-xs text-[hsl(var(--muted-foreground))]">Invalid MyLaw JSON</div> }
                        })()}
                      </div>
                      {/* Recommended (MyLaw): Topics & Regions */}
                      <div className="rounded-none border border-line bg-paper p-3">
                        <div className="mb-2 text-sm font-medium text-ink">Recommended Topics</div>
                        <div className="flex flex-wrap gap-2">
                          {MYLAW_TOPIC_RECS.slice(0, 30).map((t) => {
                            const raw = (() => { try { return JSON.parse(appDraft || "{}") } catch { return {} } })()
                            const prefs = raw?.preferences || {}
                            const arr: any[] = Array.isArray(prefs.myLawTopics) ? prefs.myLawTopics : []
                            const id = String((t as any).id || (t as any).mylawId || "")
                            const selected = !!arr.find((x: any) => String(x?.mylawId || x?.id || "") === id)
                            const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
                            return (
                              <button key={t.name} type="button" onClick={() => {
                                const next = { ...(raw || {}) } as any
                                next.preferences = next.preferences || {}
                                const list: any[] = Array.isArray(next.preferences.myLawTopics) ? next.preferences.myLawTopics : []
                                const idx = list.findIndex((x: any) => String(x?.mylawId || x?.id || "") === id)
                                if (idx >= 0) list.splice(idx, 1)
                                else list.push({ mylawId: id, name: String(t.name) })
                                next.preferences.myLawTopics = list
                                setAppDraft(JSON.stringify(next, null, 2))
                              }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")}>{selected ? "✓ " : "+ "}{t.name}</button>
                            )
                          })}
                        </div>
                        <div className="mt-3 mb-2 text-sm font-medium text-ink">Recommended Regions</div>
                        <div className="flex flex-wrap gap-2">
                          {MYLAW_REGION_RECS.map((r) => {
                            const raw = (() => { try { return JSON.parse(appDraft || "{}") } catch { return {} } })()
                            const prefs = raw?.preferences || {}
                            const arr: any[] = Array.isArray(prefs.virtualCategories) ? prefs.virtualCategories : []
                            const selected = !!arr.find((x: any) => String(x?.name || "") === r.name)
                            const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
                            return (
                              <button key={r.name} type="button" onClick={() => {
                                const next = { ...(raw || {}) } as any
                                next.preferences = next.preferences || {}
                                const list: any[] = Array.isArray(next.preferences.virtualCategories) ? next.preferences.virtualCategories : []
                                const idx = list.findIndex((x: any) => String(x?.name || "") === r.name)
                                if (idx >= 0) list.splice(idx, 1)
                                else list.push({ id: r.id || r.name, name: r.name })
                                next.preferences.virtualCategories = list
                                setAppDraft(JSON.stringify(next, null, 2))
                              }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")}>{selected ? "✓ " : "+ "}{r.name}</button>
                            )
                          })}
                        </div>
                      </div>
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
                </AccordionContent>
              </AccordionItem>
              {/* Radar if granted */}
              {grants?.radar !== false && (
                <AccordionItem value="radar">
                  <AccordionTrigger className="text-ink"><div className="flex items-center gap-2"><RadarIcon className="h-4 w-4" /> Radar {appAvail.radar ? <span className="ml-2 text-xs text-ink">• available</span> : null}</div></AccordionTrigger>
                  <AccordionContent>
                    {activeApp === "radar" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[hsl(var(--muted-foreground))]">Apply Radar Template</Label>
                          <Select value={selectedProductTemplate.radar || ""} onValueChange={(v) => applyProductTemplateToDraft("radar", v)} disabled={!productTpls.radar.length}>
                            <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                              <SelectValue placeholder={productTpls.radar.length ? "Choose template…" : "No product templates"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border border-line bg-paper">
                              {productTpls.radar.map((n) => (
                                <SelectItem key={n} value={n} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedProductTemplate.radar && (
                            <div className="text-xs text-[hsl(var(--muted-foreground))]">Selected Template: <span className="text-ink">{selectedProductTemplate.radar}</span> (unsaved)</div>
                          )}
                        </div>
                        <div className="rounded-none border border-line bg-paper p-3">
                          {(() => {
                            try {
                              const raw = JSON.parse(appDraft || "{}")
                              const normalized = sanitizeRadarProfile(raw)
                              const view = describeRadar(normalized)
                              return (
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className="rounded-none border-line bg-[hsl(var(--muted))]/40 text-ink">Updated: {view.lastUpdated || "—"}</Badge>
                                  <Badge variant="outline" className="rounded-none border-line text-ink">Onboarding: {view.onBoardingStatus || "—"}</Badge>
                                </div>
                              )
                            } catch { return <div className="text-xs text-[hsl(var(--muted-foreground))]">Invalid Radar JSON</div> }
                          })()}
                        </div>
                        <div className="rounded-none border border-line bg-paper p-3">
                          <h4 className="mb-2 font-medium text-ink">Edit Preferences</h4>
                          <ProfilePreferencesEditor jsonText={appDraft} onJsonChange={(next) => setAppDraft(next)} />
                        </div>
                        {/* Recommended (Radar) Topics */}
                        <div className="rounded-none border border-line bg-paper p-3">
                          <div className="mb-2 text-sm font-medium text-ink">Recommended Topics</div>
                          <div className="flex flex-wrap gap-2">
                            {MYLAW_TOPIC_RECS.slice(0, 30).map((t) => {
                              const raw = (() => { try { return JSON.parse(appDraft || "{}") } catch { return {} } })()
                              const userData = raw?.data?.userData || raw?.userData || raw
                              const arr: any[] = Array.isArray(userData?.followedEntities) ? userData.followedEntities : []
                              const id = String((t as any).id || (t as any).mylawId || "")
                              const selected = !!arr.find((x: any) => String(x?.id || "") === id)
                              const cls = selected ? "bg-ink text-paper" : "border-line text-ink hover:bg-[hsl(var(--muted))]"
                              return (
                                <button key={t.name} type="button" onClick={() => {
                                  const next = { ...(raw || {}) } as any
                                  const u = (next.data && next.data.userData) ? next.data.userData : (next.userData || (next.userData = {}))
                                  u.followedEntities = Array.isArray(u.followedEntities) ? u.followedEntities : []
                                  const idx = u.followedEntities.findIndex((x: any) => String(x?.id || "") === id)
                                  if (idx >= 0) u.followedEntities.splice(idx, 1)
                                  else u.followedEntities.push({ id, name: String(t.name), type: "topic" })
                                  if (next.data && next.data.userData) next.data.userData = u
                                  else next.userData = u
                                  setAppDraft(JSON.stringify(next, null, 2))
                                }} className={["rounded-none border px-2 py-1 text-xs", cls].join(" ")}>{selected ? "✓ " : "+ "}{t.name}</button>
                              )
                            })}
                          </div>
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
                  </AccordionContent>
                </AccordionItem>
              )}
              {/* Compass if granted */}
              {grants?.compass && (
                <AccordionItem value="compass">
                  <AccordionTrigger className="text-ink"><div className="flex items-center gap-2"><CompassIcon className="h-4 w-4" /> Compass {appAvail.compass ? <span className="ml-2 text-xs text-ink">• available</span> : null}</div></AccordionTrigger>
                  <AccordionContent>
                    {activeApp === "compass" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[hsl(var(--muted-foreground))]">Apply Compass Template</Label>
                          <Select value={selectedProductTemplate.compass || ""} onValueChange={(v) => applyProductTemplateToDraft("compass", v)} disabled={!productTpls.compass.length}>
                            <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                              <SelectValue placeholder={productTpls.compass.length ? "Choose template…" : "No product templates"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border border-line bg-paper">
                              {productTpls.compass.map((n) => (
                                <SelectItem key={n} value={n} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedProductTemplate.compass && (
                            <div className="text-xs text-[hsl(var(--muted-foreground))]">Selected Template: <span className="text-ink">{selectedProductTemplate.compass}</span> (unsaved)</div>
                          )}
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
                          return <div className="text-xs text-[hsl(var(--muted-foreground))]">No schema</div>
                        })()}
                        <div className="flex items-center justify-end gap-2">
                          {appSaveMsg && <span className="text-sm text-[hsl(var(--muted-foreground))]">{appSaveMsg}</span>}
                          <Button size="sm" onClick={saveAppProfile} className="rounded-none bg-ink text-paper hover:bg-ink/90"><Save className="mr-2 h-4 w-4" /> Save Profile</Button>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
              {/* Scholar if granted */}
              {grants?.scholar && (
                <AccordionItem value="scholar">
                  <AccordionTrigger className="text-ink"><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Scholar {appAvail.scholar ? <span className="ml-2 text-xs text-ink">• available</span> : null}</div></AccordionTrigger>
                  <AccordionContent />
                </AccordionItem>
              )}
            </Accordion>
            {appErr && (
              <span className="mt-2 block text-xs text-[hsl(var(--destructive))]">{appErr}</span>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Group */}
              <div className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">Assign / Change Group</Label>
                <Select
                  value={selectedGroupId ?? ""}
                  onValueChange={onChooseGroup}
                >
                  <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                    <SelectValue placeholder="Select a group…" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border border-line bg-paper">
                    {groups.map((g) => (
                      <SelectItem
                        key={g.id}
                        value={g.id}
                        className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                      >
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template (Newsletter or Active Product) */}
              <div className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">
                  {activeApp ? `Apply ${activeApp[0].toUpperCase() + activeApp.slice(1)} Template` : "Apply Newsletter Template"}
                </Label>
                {activeApp ? (
                  <>
                  <Select
                    value={selectedProductTemplate[activeApp] || ""}
                    onValueChange={(v) => applyProductTemplateToDraft(activeApp, v)}
                    disabled={!productTpls[activeApp]?.length}
                  >
                    <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                      <SelectValue placeholder={productTpls[activeApp]?.length ? "Choose template…" : "No product templates"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border border-line bg-paper">
                      {(productTpls[activeApp] || []).map((n) => (
                        <SelectItem key={n} value={n} className="rounded-none text-ink hover:bg-[hsl(var(--muted))]">
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {activeApp && selectedProductTemplate[activeApp] ? (
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Selected Template: <span className="text-ink">{selectedProductTemplate[activeApp]}</span> (unsaved)</div>
                  ) : null}
                  </>
                ) : tplErr ? (
                  <p className="text-xs text-[hsl(var(--destructive))]">Failed to load templates</p>
                ) : tplNames.length === 0 ? (
                  <Select disabled>
                    <SelectTrigger className="rounded-none border border-line bg-paper text-[hsl(var(--muted-foreground))]">
                      <SelectValue placeholder="No templates available" />
                    </SelectTrigger>
                  </Select>
                ) : (
                  <Select value={tplValue ?? ""} onValueChange={onChooseTemplate}>
                    <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                      <SelectValue placeholder="Choose template…" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border border-line bg-paper">
                      {tplNames.map((n) => (
                        <SelectItem
                          key={n}
                          value={n}
                          className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                        >
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When an app is selected, render its JSON editor */}
        {activeApp && (
          <Card className="mt-3 rounded-none border border-line bg-paper">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-lg text-ink capitalize">{activeApp} Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Edit the user’s Extended Profile document for this app.
              </p>
              {appLoading ? (
                <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading profile…
                </div>
              ) : (
                <>
                  {activeApp === "radar" && (
                    <div className="rounded-none border border-line bg-paper p-3">
                      {(() => {
                        try {
                          const raw = JSON.parse(appDraft || "{}")
                          const normalized = sanitizeRadarProfile(raw)
                          const view = describeRadar(normalized)
                          return (
                            <div className="space-y-4">
                              {/* meta */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="rounded-none border-line bg-[hsl(var(--muted))]/40 text-ink">Updated: {view.lastUpdated || "—"}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Onboarding: {view.onBoardingStatus || "—"}</Badge>
                                <span className="ml-2 hidden h-5 w-px bg-[hsl(var(--border))] md:inline-block" />
                                <Badge variant="outline" className="rounded-none border-line text-ink">Topics: {view.counts.topics}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Companies: {view.counts.companies}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Law Firms: {view.counts.lawFirms}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Virtual: {view.counts.virtualCategories}</Badge>
                              </div>
                              <Separator className="bg-[hsl(var(--border))]" />
                              <div className="grid gap-4 md:grid-cols-2">
                                {!!view.topics.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Radar Topics</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.topics.map((t) => (
                                          <Badge key={`${t.id}-${t.name}`} variant="outline" className="rounded-none border-line text-ink">{t.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!!view.companies.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Companies</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.companies.map((c) => (
                                          <Badge key={`${c.id}-${c.name}`} variant="outline" className="rounded-none border-line text-ink">{c.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!!view.lawFirms.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Law Firms</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.lawFirms.map((lf) => (
                                          <Badge key={`${lf.id}-${lf.name}`} variant="outline" className="rounded-none border-line text-ink">{lf.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!!view.virtualCategories.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Virtual Categories</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.virtualCategories.map((v) => (
                                          <Badge key={`${v.id}-${v.name}`} variant="outline" className="rounded-none border-line text-ink">{v.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        } catch {
                          return <div className="text-sm text-[hsl(var(--muted-foreground))]">Invalid Radar JSON</div>
                        }
                      })()}
                    </div>
                  )}
                  {activeApp === "mylaw" && (
                    <div className="rounded-none border border-line bg-paper p-3">
                      {(() => {
                        try {
                          const raw = JSON.parse(appDraft || "{}")
                          const normalized = sanitizeMyLawProfile(raw)
                          const view = describeMyLaw(normalized)
                          return (
                            <div className="space-y-4">
                              {/* meta */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="rounded-none border-line bg-[hsl(var(--muted))]/40 text-ink">Updated: {view.lastUpdated || "—"}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Onboarding: {view.onBoardingStatus || "—"}</Badge>
                                <span className="ml-2 hidden h-5 w-px bg-[hsl(var(--border))] md:inline-block" />
                                <Badge variant="outline" className="rounded-none border-line text-ink">Topics: {view.counts.topics}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Industries: {view.counts.industries}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Practice Areas: {view.counts.practiceAreas}</Badge>
                                <Badge variant="outline" className="rounded-none border-line text-ink">Virtual: {view.counts.virtualCategories}</Badge>
                              </div>
                              <Separator className="bg-[hsl(var(--border))]" />
                              <div className="grid gap-4 md:grid-cols-2">
                                {!!view.topics.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">MyLaw Topics</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.topics.map((t) => (
                                          <Badge key={`${t.id}-${t.name}`} variant="outline" className="rounded-none border-line text-ink">{t.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!!view.industries?.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Industries</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.industries.map((c: any) => (
                                          <Badge key={`${c.id}-${c.name}`} variant="outline" className="rounded-none border-line text-ink">{c.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!!view.practiceAreas?.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Practice Areas</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.practiceAreas.map((c: any) => (
                                          <Badge key={`${c.id}-${c.name}`} variant="outline" className="rounded-none border-line text-ink">{c.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {!!view.virtualCategories.length && (
                                  <div>
                                    <div className="mb-1 text-sm font-medium text-ink">Virtual Categories</div>
                                    <div className="max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {view.virtualCategories.map((v) => (
                                          <Badge key={`${v.id}-${v.name}`} variant="outline" className="rounded-none border-line text-ink">{v.name}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        } catch {
                          return <div className="text-sm text-[hsl(var(--muted-foreground))]">Invalid MyLaw JSON</div>
                        }
                      })()}
                            </div>
                  )}
                            {/* Recommended adders for consistency with Template Builder */}
                            <div className="mt-4 space-y-3">
                              <div>
                                <div className="mb-2 text-sm font-medium text-ink">Recommended Topics</div>
                                <div className="flex flex-wrap gap-2">
                                  {MYLAW_TOPIC_RECS.slice(0, 30).map((t) => (
                                    <Button
                                      key={t.name}
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-none border-line text-ink"
                                      onClick={() => {
                                        try {
                                          const parsed = JSON.parse(appDraft || "{}")
                                          const pref = parsed.preferences || { topics: [], regions: [] }
                                          const list = Array.isArray(pref.topics) ? pref.topics : []
                                          if (!list.find((x: any) => String(x?.name || "").toLowerCase() === t.name.toLowerCase())) {
                                            list.push({ name: t.name })
                                          }
                                          const next = JSON.stringify({ preferences: { ...pref, topics: list } }, null, 2)
                                          setAppDraft(next)
                                        } catch {}
                                      }}
                                      title={`Add ${t.name}`}
                                    >
                                      + {t.name}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="mb-2 text-sm font-medium text-ink">Recommended Regions</div>
                                <div className="flex flex-wrap gap-2">
                                  {MYLAW_REGION_RECS.map((r) => (
                                    <Button
                                      key={r.name}
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-none border-line text-ink"
                                      onClick={() => {
                                        try {
                                          const parsed = JSON.parse(appDraft || "{}")
                                          const pref = parsed.preferences || { topics: [], regions: [] }
                                          const list = Array.isArray(pref.regions) ? pref.regions : []
                                          if (!list.find((x: any) => String(x?.name || "").toLowerCase() === r.name.toLowerCase())) {
                                            list.push({ name: r.name })
                                          }
                                          const next = JSON.stringify({ preferences: { ...pref, regions: list } }, null, 2)
                                          setAppDraft(next)
                                        } catch {}
                                      }}
                                      title={`Add ${r.name}`}
                                    >
                                      + {r.name}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>

                  {/* Structured editor */}
                  {(activeApp === "mylaw" || activeApp === "radar") && (
                    <div className="mt-3 rounded-none border border-line bg-paper p-3">
                      <h4 className="mb-2 font-medium text-ink">Edit Preferences</h4>
                      <ProfilePreferencesEditor
                        jsonText={appDraft}
                        onJsonChange={(next) => setAppDraft(next)}
                      />
                    </div>
                  )}

                  {/* Schema-driven editor for products when schema present */}
                  {(() => {
                    try {
                      const parsed = appDraft ? JSON.parse(appDraft) : {}
                      const fields: FieldSpec[] | undefined = Array.isArray(parsed?.schema?.fields)
                        ? parsed.schema.fields
                        : (Array.isArray(parsed?.fields) ? parsed.fields : undefined)
                      if (fields && fields.length) {
                        const values: Record<string, any> = (parsed?.values && typeof parsed.values === "object") ? parsed.values : (parsed && parsed.schema ? {} : parsed)
                        return (
                          <div className="mt-3 rounded-none border border-line bg-paper p-3">
                            <h4 className="mb-2 font-medium text-ink">Edit Fields</h4>
                            <ProfileSchemaForm
                              fields={fields}
                              value={values}
                              onChange={(next) => {
                                const nextDoc = { ...parsed, schema: { fields }, values: next }
                                setAppDraft(JSON.stringify(nextDoc, null, 2))
                              }}
                            />
                          </div>
                        )
                      }
                    } catch {}
                    return null
                  })()}

                  <div className="flex items-center justify-end gap-2">
                    {appSaveMsg && (
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">{appSaveMsg}</span>
                    )}
                    <Button size="sm" onClick={saveAppProfile} className="rounded-none bg-ink text-paper hover:bg-ink/90">
                      <Save className="mr-2 h-4 w-4" /> Save Profile
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* NEW: Last session + Opt-out + Newsletters row */}
        <div className="mt-3 flex items-center justify-between rounded-none border border-line bg-[hsl(var(--muted))]/20 px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Last session (best-effort) */}
            {details?.user_id && (
              <LastSessionBadge userId={details.user_id} />
            )}
            <Label className="text-[hsl(var(--muted-foreground))]">Opt Out Status</Label>
            <Select
              value={(edited.optout as string) ?? ""}
              onValueChange={(v) => onAttrChange("optout", v)}
            >
              <SelectTrigger className="h-8 w-56 rounded-none border border-line bg-paper text-ink">
                <SelectValue placeholder="Select status…" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-line bg-paper">
                <SelectItem value="None" className="rounded-none">None</SelectItem>
                <SelectItem value="marketing" className="rounded-none">Marketing</SelectItem>
                <SelectItem value="All" className="rounded-none">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => details && setNewsletterOpen(true)}
            disabled={!details}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
          >
            View Newsletters
          </Button>
        </div>

        {/* alerts */}
        {(error || fetchErr) && (
          <Alert className="mt-4 rounded-none border border-line bg-[hsl(var(--muted))]">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-ink">{error || fetchErr}</AlertDescription>
          </Alert>
        )}
        {saveErr && (
          <Alert variant="destructive" className="mt-4 rounded-none">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{saveErr}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4 rounded-none border border-line bg-[hsl(var(--secondary))]/20">
            <Info className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-ink">{success}</AlertDescription>
          </Alert>
        )}

        {/* attributes */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-ink" />
            <span className="text-[hsl(var(--muted-foreground))]">Loading…</span>
          </div>
        ) : (
          details && (
            <Card className="mt-6 rounded-none border border-line bg-paper">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-ink">User Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(ATTRIBUTE_SCHEMA).map(([k, s]) => (
                    <div key={k} className="space-y-2">
                      <Label className="text-[hsl(var(--muted-foreground))]">{s.label}</Label>
                      {s.type === "select" ? (
                        <Select
                          value={(edited[k] as string) || ""}
                          onValueChange={(v) => onAttrChange(k, v)}
                        >
                          <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                            <SelectValue placeholder={`Select ${s.label}`} />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border border-line bg-paper">
                            {s.options!.map((opt) => (
                              <SelectItem
                                key={opt}
                                value={opt}
                                className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                              >
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={s.type}
                          value={(edited[k] as string) || ""}
                          onChange={(e) => onAttrChange(k, e.target.value)}
                          className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted)))]"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !details}
            className="rounded-none bg-ink text-paper hover:bg-ink/90 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Newsletter modal (render only when details are loaded) */}
        {details && (
          <NewsletterManagerModal
            isOpen={newsletterOpen}
            onClose={() => setNewsletterOpen(false)}
            userId={details.user_id}
            userEmail={details.identifiers?.email_address || ""}
            existingAttributes={details.attributes}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function LastSessionBadge({ userId }: { userId: string }) {
  const [label, setLabel] = React.useState<string>("—")
  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`/api/users/sessions?user_ids=${encodeURIComponent(userId)}`, { cache: "no-store" })
        const payload = await res.json().catch(() => null)
        const entry = payload?.sessions?.[userId]
        const iso = entry?.lastSession
        const count: number | undefined = entry?.count
        if (!alive) return
        if (!iso) { setLabel(count ? `Sessions: ${count}` : "never"); return }
        const d = new Date(iso)
        const diff = Date.now() - d.getTime()
        const days = Math.floor(diff / (24 * 60 * 60 * 1000))
        const base = days <= 0 ? "Last session: today" : `Last session: ${days}d ago`
        setLabel(count ? `${base} • Sessions: ${count}` : base)
      } catch {
        if (alive) setLabel("—")
      }
    })()
    return () => { alive = false }
  }, [userId])
  return (
    <Badge variant="outline" className="rounded-none border-line text-xs text-ink">{label}</Badge>
  )
}
