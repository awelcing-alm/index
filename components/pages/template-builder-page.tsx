// components/pages/template-builder-page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Save, Trash2, Copy, Sparkles, CheckCircle } from "lucide-react"
import {
  NEWSLETTER_KEYS,
  ALL_NEWSLETTER_GROUPS,
  type NewsletterSlug,
} from "@/lib/newsletters"
import { computeDisabledNewsletterSlugs, applyNewsletterPolicy } from "@/lib/product-policy"
import { getActiveAccountId } from "@/lib/account-store"
import { DefaultTemplatesSection } from "@/components/pages/default-templates-section"
import { ProfilePreferencesEditor } from "@/components/profiles/profile-preferences-editor"
import { ProfileSchemaForm, type FieldSpec } from "@/components/profiles/profile-schema-form"
import { MYLAW_TOPIC_RECS, MYLAW_REGION_RECS } from "@/lib/mylaw-taxonomy"

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
    const attrs: Record<string, boolean> = {}
    for (const [k, v] of Object.entries(attrsRaw)) {
      if (typeof v === "boolean") attrs[k] = v
      else if (v === "true" || v === "false") attrs[k] = v === "true"
      else if (v != null) attrs[k] = Boolean(v)
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
  const res = await fetch(`${base}${exists && kind === "newsletter" ? `/${encodeURIComponent(tpl.name)}` : (exists ? `/${encodeURIComponent(tpl.name)}` : "")}`.replace(/\/+/g, "/"), {
    method: exists ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
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
  setProductGrants({ radar: !!g.radar, compass: !!g.compass, scholar: !!g.scholar, mylaw: !!g.mylaw })
      } catch (e: any) {
        if (!alive) return
        setProductGrantError(e?.message || "Failed to check product access")
        setProductGrants({ radar: false, compass: false, scholar: false })
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Type:</span>
              {(["newsletter", "radar", "compass", "scholar", "mylaw"] as Kind[]).map((k) => {
                const disabled = k !== "newsletter" && !(productGrants as any)?.[k]
                return (
                  <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} disabled={disabled}
                    onClick={() => { setKind(k); setCurrent(emptyTpl()); setIsEditing(false); setQuery("") }}
                    className="rounded-none">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </Button>
                )
              })}
            </div>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-[hsl(var(--muted-foreground))]">Name</Label>
                  <Input
                    value={current.name}
                    onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                    className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                  />
                </div>
                <div>
                  <Label className="text-[hsl(var(--muted-foreground))]">Description</Label>
                  <Input
                    value={current.description}
                    onChange={(e) =>
                      setCurrent({ ...current, description: e.target.value })
                    }
                    className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>

              {/* overwrite toggle (newsletter only) */}
              {kind === "newsletter" && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={current.overwriteFalse}
                    onCheckedChange={(v) =>
                      setCurrent((p) => ({ ...p, overwriteFalse: v === true }))
                    }
                    className="rounded-none"
                  />
                  <Label className="text-[hsl(var(--muted-foreground))]">
                    Include <em>all</em> newsletter keys (unchecked ={" "}
                    <span className="font-semibold">false</span>)
                  </Label>
                </div>

                <Badge className="rounded-none border border-line bg-[hsl(var(--muted))] text-ink">
                  {attrCount} attributes selected
                </Badge>
              </div>
              )}

              {/* Filter + bulk actions for visible (newsletter only) */}
              {kind === "newsletter" && (
              <div className="flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter newsletters…"
                  className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAllVisible(true)}
                  className="rounded-none"
                  disabled={visibleSlugs.length === 0}
                  title="Select all visible"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAllVisible(false)}
                  className="rounded-none"
                  disabled={visibleSlugs.length === 0}
                  title="Clear all visible"
                >
                  Clear
                </Button>
              </div>
              )}

              {/* Grouped newsletter checkboxes */}
              {kind === "newsletter" && (groupsToRender.length === 0 ? (
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  No newsletter fields matched your filter.
                </div>
              ) : (
                <div className="space-y-6">
                  {groupsToRender.map((group) => (
                    <div key={group.name}>
                      <div className="mb-2 font-semibold text-ink">{group.name}</div>
                      <div className="grid gap-3 rounded-none border border-line bg-paper p-4 sm:grid-cols-2 md:grid-cols-3">
                        {group.slugs.map((slug) => {
                          const disabled = disabledSlugSet.has(slug)
                          return (
                            <div key={slug} className="flex items-center space-x-2 opacity-100">
                              <Checkbox
                                checked={attrChecked(slug)}
                                onCheckedChange={(v) =>
                                  setCurrent((p) => ({
                                    ...p,
                                    attributes: { ...p.attributes, [slug]: v === true },
                                  }))
                                }
                                disabled={disabled}
                                className="rounded-none"
                              />
                              <Label
                                className={`cursor-pointer capitalize ${disabled ? "text-[hsl(var(--muted-foreground))]/60" : "text-[hsl(var(--muted-foreground))]"}`}
                                title={disabled ? "Managed by product access" : slug.replace(/-/g, " ")}
                              >
                                {slug.replace(/-/g, " ")}
                                {disabled && (
                                  <span className="ml-2 rounded-none border border-line bg-[hsl(var(--muted))]/40 px-1 py-0.5 text-[10px] uppercase tracking-wide text-ink">locked</span>
                                )}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* MyLaw template builder (recommended chips + structured editor) */}
              {kind === "mylaw" && (
                <div className="space-y-4">
                  {/* Recommended Topics */}
                  <div>
                    <div className="mb-2 font-semibold text-ink">Recommended Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {MYLAW_TOPIC_RECS.slice(0, 40).map((t) => (
                        <Button key={t.name} type="button" size="sm" variant="outline" className="rounded-none border-line text-ink"
                          onClick={() => {
                            try {
                              const text = JSON.stringify({ preferences: current.attributes?.preferences || { topics: [], regions: [] } })
                              const parsed = JSON.parse(text)
                              const arr = parsed.preferences.topics as any[]
                              if (!arr.find((x) => (x.name || "").toLowerCase() === t.name.toLowerCase())) arr.push({ name: t.name })
                              setCurrent((p) => ({ ...p, attributes: parsed }))
                            } catch {}
                          }}
                          title={`Add ${t.name}`}
                        >
                          + {t.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Regions */}
                  <div>
                    <div className="mb-2 font-semibold text-ink">Recommended Regions</div>
                    <div className="flex flex-wrap gap-2">
                      {MYLAW_REGION_RECS.map((r) => (
                        <Button key={r.name} type="button" size="sm" variant="outline" className="rounded-none border-line text-ink"
                          onClick={() => {
                            try {
                              const text = JSON.stringify({ preferences: current.attributes?.preferences || { topics: [], regions: [] } })
                              const parsed = JSON.parse(text)
                              const arr = parsed.preferences.regions as any[]
                              if (!arr.find((x) => (x.name || "").toLowerCase() === r.name.toLowerCase())) arr.push({ name: r.name })
                              setCurrent((p) => ({ ...p, attributes: parsed }))
                            } catch {}
                          }}
                          title={`Add ${r.name}`}
                        >
                          + {r.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Structured preferences editor */}
                  <div className="rounded-none border border-line bg-paper p-3">
                    <div className="mb-2 text-sm text-[hsl(var(--muted-foreground))]">Edit preferences</div>
                    <ProfilePreferencesEditor
                      jsonText={JSON.stringify({ preferences: current.attributes?.preferences || { topics: [], regions: [] } }, null, 2)}
                      onJsonChange={(next) => {
                        try {
                          const parsed = JSON.parse(next)
                          setCurrent((p) => ({ ...p, attributes: parsed }))
                        } catch {}
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Other product editors: schema-driven form when schema is present; else JSON fallback */}
              {kind !== "newsletter" && kind !== "mylaw" && (() => {
                const attrs: any = current.attributes || {}
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
                          setCurrent((p) => ({
                            ...p,
                            attributes: { ...attrs, schema: { fields }, values: next },
                          }))
                        }}
                      />
                    </div>
                  )
                }
                return (
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--muted-foreground))]">Attributes JSON</Label>
                    <textarea
                      value={JSON.stringify(attrs, null, 2)}
                      onChange={(e) => {
                        try {
                          const val = JSON.parse(e.target.value || "{}")
                          setCurrent((p) => ({ ...p, attributes: val }))
                          setErr("")
                        } catch {
                          setErr("Invalid JSON")
                        }
                      }}
                      className="min-h-[280px] w-full rounded-none border border-line bg-paper p-2 font-mono text-sm text-ink"
                    />
                  </div>
                )
              })()}

              <div className="flex gap-3">
                <Button
                  onClick={saveCurrent}
                  className="rounded-none bg-ink text-paper hover:bg-ink/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update" : "Save"}
                </Button>

                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* ---------- MANAGE ---------- */}
            <TabsContent value="manage" className="mt-6 space-y-4">
              {kind === "newsletter" && <DefaultTemplatesSection />}

              {templates.length === 0 && (
                <Alert className="rounded-none border border-line bg-[hsl(var(--muted))]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription className="text-ink">
                    No custom templates yet. Create one in the Create tab.
                  </AlertDescription>
                </Alert>
              )}

              {templates.map((tpl) => (
                <Card key={tpl.name} className="rounded-none border border-line bg-paper">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-ink capitalize">{tpl.name}</h3>

                        <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                          Custom
                        </Badge>

                        {tpl.overwriteFalse && (
                          <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                            Overwrites&nbsp;false
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {tpl.createdAt
                          ? `Created: ${new Date(tpl.createdAt).toLocaleDateString()}`
                          : "Created: —"}
                        {tpl.updatedAt
                          ? ` (Updated ${new Date(tpl.updatedAt).toLocaleDateString()})`
                          : ""}
                      </p>

                      <p
                        className="max-w-md truncate text-sm text-[hsl(var(--muted-foreground))]"
                        title={tpl.description}
                      >
                        {tpl.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCurrent(tpl)
                          setIsEditing(true)
                          setTab("create")
                        }}
                        className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCurrent({
                            ...tpl,
                            name: `${tpl.name}-copy`,
                            createdAt: "",
                            updatedAt: undefined,
                          })
                          setIsEditing(false)
                          setTab("create")
                        }}
                        className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                        title="Duplicate template"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-none text-[hsl(var(--destructive))] hover:bg-[hsl(var(--muted))]"
                        onClick={() => deleteTpl(tpl.name)}
                        title="Delete template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
