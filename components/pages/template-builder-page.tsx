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
import { getActiveAccountId } from "@/lib/account-store"
import { DefaultTemplatesSection } from "@/components/pages/default-templates-section"

/* ---------------- types ---------------- */
interface Template {
  name: string
  description: string
  attributes: Record<string, boolean>
  overwriteFalse: boolean
  createdAt: string
  updatedAt?: string
}

/* ---------------- helpers (API) ---------------- */

// Names: only account-custom (avoid default duplicates in Manage tab)
const apiGetNames = async (): Promise<string[]> => {
  try {
    const res = await fetch("/api/templates?scope=custom&format=array", {
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

const apiGetTpl = async (name: string): Promise<Template | null> => {
  try {
    const res = await fetch(`/api/templates/${encodeURIComponent(name)}`, {
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

const apiSaveTpl = async (tpl: Template, exists: boolean) => {
  // Only send fields the API expects
  const payload = {
    name: tpl.name,
    description: tpl.description ?? "",
    attributes: tpl.attributes ?? {},
    overwriteFalse: !!tpl.overwriteFalse,
  }
  const res = await fetch(`/api/templates${exists ? `/${encodeURIComponent(tpl.name)}` : ""}`, {
    method: exists ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(msg || `Save failed (${res.status})`)
  }
}

const apiDeleteTpl = async (name: string) => {
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`, { method: "DELETE" })
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
  const [templates, setTemplates] = useState<Template[]>([])
  const [current, setCurrent] = useState<Template>(emptyTpl())
  const [isEditing, setIsEditing] = useState(false)
  const [tab, setTab] = useState<"create" | "manage">("create")
  const [saved, setSaved] = useState<string>("")
  const [query, setQuery] = useState("") // filter query
  const [err, setErr] = useState<string>("")

  const accId = getActiveAccountId()

  useEffect(() => {
    if (!accId) return
    let cancelled = false

    ;(async () => {
      setErr("")
      try {
        const names = await apiGetNames()
        if (cancelled) return
        if (!names.length) {
          setTemplates([])
          return
        }
        const fetched = await Promise.all(names.map(apiGetTpl))
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
  }, [accId])

  const buildAttributePayload = (): Record<string, boolean> => {
    if (!current.overwriteFalse) {
      // only include toggled keys when not overwriting false
      return { ...current.attributes }
    }
    // include ALL newsletter keys to explicitly set false for unchecked
    const full: Record<string, boolean> = {}
    NEWSLETTER_KEYS.forEach((slug) => {
      full[slug] = current.attributes[slug] || false
    })
    return full
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
      await apiSaveTpl(payload, exists)
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
      await apiDeleteTpl(name)
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

  const setAllVisible = (value: boolean) => {
    if (visibleSlugs.length === 0) return
    setCurrent((prev) => {
      const patch: Record<string, boolean> = {}
      visibleSlugs.forEach((slug) => (patch[slug] = value))
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
          {err && (
            <Alert className="mb-4 rounded-none border border-line bg-[hsl(var(--muted))]">
              <AlertDescription className="text-ink">{err}</AlertDescription>
            </Alert>
          )}

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
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

              {/* overwrite toggle */}
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

              {/* Filter + bulk actions for visible */}
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

              {/* Grouped newsletter checkboxes */}
              {groupsToRender.length === 0 ? (
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  No newsletter fields matched your filter.
                </div>
              ) : (
                <div className="space-y-6">
                  {groupsToRender.map((group) => (
                    <div key={group.name}>
                      <div className="mb-2 font-semibold text-ink">{group.name}</div>
                      <div className="grid gap-3 rounded-none border border-line bg-paper p-4 sm:grid-cols-2 md:grid-cols-3">
                        {group.slugs.map((slug) => (
                          <div key={slug} className="flex items-center space-x-2">
                            <Checkbox
                              checked={attrChecked(slug)}
                              onCheckedChange={(v) =>
                                setCurrent((p) => ({
                                  ...p,
                                  attributes: { ...p.attributes, [slug]: v === true },
                                }))
                              }
                              className="rounded-none"
                            />
                            <Label className="cursor-pointer capitalize text-[hsl(var(--muted-foreground))]">
                              {slug.replace(/-/g, " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
              <DefaultTemplatesSection />

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
