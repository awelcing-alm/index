// components/pages/template-builder-page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle } from "lucide-react"
import {
  NEWSLETTER_KEYS,
  ALL_NEWSLETTER_GROUPS,
  type NewsletterSlug,
} from "@/lib/newsletters"
import { computeDisabledNewsletterSlugs, applyNewsletterPolicy } from "@/lib/product-policy"
import { getActiveAccountId } from "@/lib/account-store"
import { DefaultTemplatesSection } from "@/components/pages/default-templates-section"
import { TypePicker } from "@/components/pages/template-builder/TypePicker"
import { ManageTemplatesList } from "@/components/pages/template-builder/ManageTemplatesList"
import { PRODUCT_SCHEMAS } from "@/lib/product-schemas"
import { toast } from "@/hooks/use-toast"
import { fingerprintAttributes } from "@/lib/utils"
import { NewsletterSelector } from "@/components/pages/template-builder/NewsletterSelector"
import { ProductEditor } from "@/components/pages/template-builder/ProductEditor"
import { SaveActions } from "@/components/pages/template-builder/SaveActions"

/* ---------------- types ---------------- */
type Kind = "newsletter" | "radar" | "compass" | "scholar" | "mylaw"

interface Template {
  name: string
  description: string
  attributes: Record<string, any>
  overwriteFalse: boolean
  createdAt: string
  updatedAt?: string
}
              

/* ---------------- helpers (API) ---------------- */

// Names: only account-custom (avoid default duplicates in Manage tab)
const apiGetNames = async (kind: Kind): Promise<string[]> => {
  try {
    const path = kind === "newsletter" ? "/api/templates?scope=custom&format=array" : `/api/product-templates/${kind}`
    const res = await fetch(path, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return []
    const data = await res.json().catch(() => [])
    return Array.isArray(data)
      ? data.filter((v: unknown): v is string => typeof v === "string")
      : []
  } catch {
    return []
  }
}

const apiGetTpl = async (kind: Kind, name: string): Promise<Template | null> => {
  try {
    const path = kind === "newsletter"
      ? `/api/templates/${encodeURIComponent(name)}`
      : `/api/product-templates/${kind}/${encodeURIComponent(name)}`
    const res = await fetch(path, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    if (!data || typeof data !== "object") return null

    const attrsRaw = (data as any).attributes || {}
    let attrs: any = {}
    if (kind === "newsletter") {
      const b: Record<string, boolean> = {}
      for (const [k, v] of Object.entries(attrsRaw)) {
        if (typeof v === "boolean") b[k] = v
        else if (v === "true" || v === "false") b[k] = v === "true"
        else if (v != null) b[k] = Boolean(v)
      }
      attrs = b
    } else {
      // Ensure product templates have a schema wrapper
      if (attrsRaw && typeof attrsRaw === "object" && (attrsRaw as any).schema && Array.isArray((attrsRaw as any).schema.fields)) {
        attrs = attrsRaw
      } else {
        const schema = PRODUCT_SCHEMAS[kind as keyof typeof PRODUCT_SCHEMAS]?.schema || { fields: [] }
        attrs = { schema, values: attrsRaw || {} }
      }
    }

    return {
      name: String((data as any).name ?? name),
      description: String((data as any).description ?? ""),
  attributes: attrs,
      overwriteFalse: (data as any).overwriteFalse === true,
      createdAt: String((data as any).createdAt ?? ""),
      updatedAt: (data as any).updatedAt ? String((data as any).updatedAt) : undefined,
    }
  } catch {
    return null
  }
}

const apiSaveTpl = async (kind: Kind, tpl: Template, exists: boolean) => {
  // Only send fields the API expects
  const payload = {
    name: tpl.name,
    description: tpl.description ?? "",
    attributes: tpl.attributes ?? {},
    overwriteFalse: !!tpl.overwriteFalse,
  }
  const base = kind === "newsletter" ? "/api/templates" : `/api/product-templates/${kind}`
  const res = await fetch(`${base}${exists ? `/${encodeURIComponent(tpl.name)}` : ""}`, {
    method: exists ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    if (res.status === 409) {
      let suggestion = ""
      try { const data = await res.json(); suggestion = data?.suggestion || "" } catch {}
      const rename = window.prompt(
        `A template named "${tpl.name}" already exists. Enter a new name to save:`,
        suggestion || `${tpl.name} (1)`
      )
      if (rename && rename.trim() && rename.trim() !== tpl.name) {
        return apiSaveTpl(kind, { ...tpl, name: rename.trim() }, exists)
      }
      const msg = await res.text().catch(() => "")
      throw new Error(msg || `Name already exists`)
    }
    const msg = await res.text().catch(() => "")
    throw new Error(msg || `Save failed (${res.status})`)
  }
}

const apiDeleteTpl = async (kind: Kind, name: string) => {
  const path = kind === "newsletter"
    ? `/api/templates/${encodeURIComponent(name)}`
    : `/api/product-templates/${kind}/${encodeURIComponent(name)}`
  const res = await fetch(path, { method: "DELETE" })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(msg || `Delete failed (${res.status})`)
  }
}

/* ---------------- component ---------------- */
const emptyTpl = (): Template => ({
  name: "",
  description: "",
  attributes: {},
  overwriteFalse: true,
  createdAt: "",
})

export default function TemplateBuilderPage() {
  const [kind, setKind] = useState<Kind>("newsletter")
  const [templates, setTemplates] = useState<Template[]>([])
  const [current, setCurrent] = useState<Template>(emptyTpl())
  const [isEditing, setIsEditing] = useState(false)
  const [tab, setTab] = useState<"create" | "manage">("create")
  const [saved, setSaved] = useState<string>("")
  const [query, setQuery] = useState("") // filter query
  const [err, setErr] = useState<string>("")
  const [savedStacks, setSavedStacks] = useState<Array<{ name: string; list: string[] }>>([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem("template_stacks")
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr)) setSavedStacks(arr)
    } catch {}
  }, [])

  // Product-template gating (Radar / Compass / Scholar)
  const [productGrants, setProductGrants] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean; mylaw?: boolean } | null>(null)
  const [productGrantError, setProductGrantError] = useState<string>("")

  const accId = getActiveAccountId()

  useEffect(() => {
    if (!accId) return
    let cancelled = false

    ;(async () => {
      setErr("")
      try {
        const names = await apiGetNames(kind)
        if (cancelled) return
        if (!names.length) {
          setTemplates([])
          return
        }
        const fetched = await Promise.all(names.map((n) => apiGetTpl(kind, n)))
        if (cancelled) return
        const list = (fetched.filter(Boolean) as Template[]).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
        setTemplates(list)
      } catch (e: any) {
        if (!cancelled) {
          setTemplates([])
          setErr(e?.message || "Failed to load templates")
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [accId, kind])

  // Seed product schema wrapper when switching to product kinds
  useEffect(() => {
    if (kind === "newsletter" || kind === "mylaw") return
    const schema = PRODUCT_SCHEMAS[kind as keyof typeof PRODUCT_SCHEMAS]?.schema
    if (schema && (!current.attributes || !("schema" in (current.attributes as any)))) {
      setCurrent((p) => ({ ...p, attributes: { schema, values: {} as any } }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  // load product-template gating flags once per account
  useEffect(() => {
    let alive = true
    setProductGrantError("")
    setProductGrants(null)
    if (!accId) return
    ;(async () => {
      try {
        const res = await fetch("/api/templates/products/grants", { cache: "no-store", headers: { Accept: "application/json" } })
        if (!res.ok) throw new Error(await res.text())
        const payload = await res.json().catch(() => ({}))
        if (!alive) return
        const g = payload?.grants || {}
        // MyLaw is available for all users; force-enable in UI
        setProductGrants({ radar: !!g.radar, compass: !!g.compass, scholar: !!g.scholar, mylaw: true })
      } catch (e: any) {
        if (!alive) return
        setProductGrantError(e?.message || "Failed to check product access")
        setProductGrants({ radar: false, compass: false, scholar: false, mylaw: true })
      }
    })()
    return () => { alive = false }
  }, [accId])

  const buildAttributePayload = (): Record<string, any> => {
    if (kind !== "newsletter") return { ...current.attributes }
    if (!current.overwriteFalse) {
      // only include toggled keys when not overwriting false, policy enforced
      return applyNewsletterPolicy(productGrants, { ...current.attributes })
    }
    // include ALL newsletter keys to explicitly set false for unchecked
    const full: Record<string, boolean> = {}
    NEWSLETTER_KEYS.forEach((slug) => {
      full[slug] = current.attributes[slug] || false
    })
    return applyNewsletterPolicy(productGrants, full)
  }

  // Dirty detection: compare working payload + flags against saved template
  const isDirty = useMemo(() => {
    if (!current.name) return false
    const saved = templates.find(t => t.name === current.name)
    if (!saved) return !!(current.name || current.description || Object.keys(current.attributes||{}).length)
    const workingPayload = buildAttributePayload()
    const workingFp = fingerprintAttributes({ attributes: workingPayload, overwriteFalse: current.overwriteFalse, description: current.description, kind })
    const savedFp = fingerprintAttributes({ attributes: saved.attributes || {}, overwriteFalse: saved.overwriteFalse, description: saved.description, kind })
    return workingFp !== savedFp
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, templates, kind, productGrants])

  const saveCurrent = async () => {
    setErr("")
    if (!current.name.trim()) {
      setErr("Template needs a name")
      return
    }

    const now = new Date().toISOString()
    const exists = templates.some((t) => t.name === current.name)

    const payload: Template = {
      ...current,
      attributes: buildAttributePayload(),
      createdAt: exists ? current.createdAt : now,
      updatedAt: now,
    }

    try {
  await apiSaveTpl(kind, payload, exists)
      setTemplates((prev) =>
        [...prev.filter((t) => t.name !== payload.name), payload].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      )
      setSaved(exists ? "Template updated" : "Template created")
      setTimeout(() => setSaved(""), 3000)
      reset()
      setTab("manage")
    } catch (e: any) {
      setErr(e?.message || "Save failed")
    }
  }

  const deleteTpl = async (name: string) => {
    setErr("")
    try {
      await apiDeleteTpl(kind, name)
      setTemplates((p) => p.filter((t) => t.name !== name))
    } catch (e: any) {
      setErr(e?.message || "Delete failed")
    }
  }

  const reset = () => {
    setCurrent(emptyTpl())
    setIsEditing(false)
    setQuery("")
  }

  const attrChecked = (k: string) => current.attributes[k] || false
  const attrCount = Object.values(current.attributes).filter(Boolean).length

  /** ---------- grouped + filtered newsletter UI ---------- */
  const groupsToRender = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_NEWSLETTER_GROUPS
    return ALL_NEWSLETTER_GROUPS.map((g) => ({
      name: g.name,
      slugs: g.slugs.filter(
        (slug) => slug.includes(q) || slug.replace(/-/g, " ").includes(q)
      ),
    })).filter((g) => g.slugs.length > 0)
  }, [query])

  const visibleSlugs = useMemo<NewsletterSlug[]>(
    () => groupsToRender.flatMap((g) => g.slugs) as NewsletterSlug[],
    [groupsToRender]
  )

  const disabledSlugSet = useMemo(() => computeDisabledNewsletterSlugs(productGrants), [productGrants])

  const setAllVisible = (value: boolean) => {
    if (visibleSlugs.length === 0) return
    setCurrent((prev) => {
      const patch: Record<string, boolean> = {}
      visibleSlugs.forEach((slug) => {
        if (disabledSlugSet.has(slug)) return
        patch[slug] = value
      })
      return { ...prev, attributes: { ...prev.attributes, ...patch } }
    })
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-none border border-line bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-2xl text-ink">
            <FileText className="h-6 w-6" aria-hidden="true" />
            Template Builder
          </CardTitle>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Create, save and apply custom templates
          </p>
          {savedStacks.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[hsl(var(--muted-foreground))]">Stacks:</span>
              {savedStacks.map((p) => (
                <Button key={p.name} size="sm" variant="outline" className="rounded-none border-line text-ink" onClick={() => {
                  try {
                    const url = new URL(window.location.href)
                    url.searchParams.set("open", "apply")
                    url.searchParams.set("stack", encodeURIComponent(p.list.join(",")))
                    navigator.clipboard.writeText(url.toString())
                    toast({ title: "Link copied", description: `Open Apply with “${p.name}” preloaded.` })
                  } catch {}
                }}>
                  {p.name}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Product templates availability */}
          {productGrants && (productGrants.radar || productGrants.compass || productGrants.scholar || (productGrants as any).mylaw) && (
            <Alert className="mb-4 rounded-none border border-line bg-[hsl(var(--muted))]">
              <AlertDescription className="text-ink">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span>Product templates available:</span>
                  {productGrants.radar && (
                    <Badge variant="outline" className="rounded-none border-line text-ink">Radar</Badge>
                  )}
                  {productGrants.compass && (
                    <Badge variant="outline" className="rounded-none border-line text-ink">Compass</Badge>
                  )}
                  {productGrants.scholar && (
                    <Badge variant="outline" className="rounded-none border-line text-ink">Scholar</Badge>
                  )}
                  {(productGrants as any).mylaw && (
                    <Badge variant="outline" className="rounded-none border-line text-ink">MyLaw</Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
          {productGrantError && (
            <Alert className="mb-4 rounded-none border border-line bg-[hsl(var(--muted))]">
              <AlertDescription className="text-ink">{productGrantError}</AlertDescription>
            </Alert>
          )}
          {err && (
            <Alert className="mb-4 rounded-none border border-line bg-[hsl(var(--muted))]">
              <AlertDescription className="text-ink">{err}</AlertDescription>
            </Alert>
          )}

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            {/* Kind chooser */}
            <TypePicker kind={kind} setKind={(k) => { setKind(k as any); setCurrent(emptyTpl()); setIsEditing(false); setQuery("") }} productGrants={productGrants as any} onReset={() => { setCurrent(emptyTpl()); setIsEditing(false); setQuery("") }} />
            <TabsList className="grid grid-cols-2 rounded-none border-b border-line bg-transparent p-0">
              <TabsTrigger value="create" className="rounded-none">
                {isEditing ? "Edit" : "Create"}
              </TabsTrigger>
              <TabsTrigger value="manage" className="rounded-none">
                Manage
              </TabsTrigger>
            </TabsList>

            {/* ---------- CREATE / EDIT ---------- */}
            <TabsContent value="create" className="mt-6 space-y-6">
              {saved && (
                <Alert className="flex items-center gap-2 rounded-none border border-line bg-[hsl(var(--secondary))]/20">
                  <CheckCircle className="h-4 w-4 text-ink" aria-hidden="true" />
                  <AlertDescription className="text-ink">{saved}</AlertDescription>
                </Alert>
              )}

              <SaveActions
                current={current}
                setCurrent={setCurrent}
                isEditing={isEditing}
                isDirty={isDirty}
                saved={saved}
                onSave={saveCurrent}
                onCancel={reset}
              />

              {kind === "newsletter" && (
                <NewsletterSelector
                  query={query}
                  setQuery={setQuery}
                  attributes={current.attributes}
                  setAttributes={(patch) => setCurrent((p) => ({ ...p, attributes: patch }))}
                  overwriteFalse={current.overwriteFalse}
                  setOverwriteFalse={(v) => setCurrent((p) => ({ ...p, overwriteFalse: v }))}
                  productGrants={productGrants as any}
                />
              )}

              {kind === "mylaw" && (
                <ProductEditor kind="mylaw" attributes={current.attributes} setAttributes={(a) => setCurrent((p) => ({ ...p, attributes: a }))} />
              )}

              {/* Other product editors: schema-driven form when schema is present; no raw JSON UI */}
              {kind !== "newsletter" && kind !== "mylaw" && (
                <ProductEditor kind={kind as any} attributes={current.attributes} setAttributes={(a) => setCurrent((p) => ({ ...p, attributes: a }))} />
              )}
            </TabsContent>

            {/* ---------- MANAGE ---------- */}
            <TabsContent value="manage" className="mt-6">
              <ManageTemplatesList
                templates={templates as any}
                onEdit={(name) => {
                  const tpl = templates.find((t) => t.name === name)
                  if (!tpl) return
                  setCurrent(tpl)
                  setIsEditing(true)
                  setTab("create")
                }}
                onDuplicate={(name) => {
                  const tpl = templates.find((t) => t.name === name)
                  if (!tpl) return
                  setCurrent({ ...tpl, name: `${tpl.name}-copy`, createdAt: "", updatedAt: undefined })
                  setIsEditing(false)
                  setTab("create")
                }}
                onDelete={(name) => deleteTpl(name)}
                showDefaultsSection={kind === "newsletter" ? <DefaultTemplatesSection /> : undefined}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
