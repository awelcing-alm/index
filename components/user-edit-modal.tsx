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
import { Loader2, Users as UsersIcon, Save, AlertTriangle, Info, FileText, Radar } from "lucide-react"

import type { Group } from "@/lib/groups"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { updateUserAttributesAction } from "@/lib/user-actions"
import NewsletterManagerModal from "@/components/newsletters/newsletter-manager-modal"
import type { ProductKey } from "@/lib/product-templates"
import React from "react"
import { ApplyTemplatesModal } from "@/components/templates/apply-templates-modal"
import { toast } from "@/hooks/use-toast"
import { ProductProfilesSection } from "@/components/user-edit-modal/ProductProfilesSection"
import { LastSessionBadge } from "@/components/user-edit-modal/LastSessionBadge"
import { GroupInheritancePreview } from "@/components/user-edit-modal/GroupInheritancePreview"
import { SaveButton } from "@/components/user-edit-modal/SaveButton"

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
  const [tplStack, setTplStack] = useState<string[]>([])
  const [effectiveFromTemplates, setEffectiveFromTemplates] = useState<{ values: Record<string, boolean>, sources: Record<string, string[]> } | null>(null)
  const [detectedTemplates, setDetectedTemplates] = useState<string[]>([])

  // groups
  const lookups = useMemo(() => buildLookups(groups), [groups])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [fetchErr, setFetchErr] = useState<string | null>(null)

  // newsletters modal state (must be inside component)
  const [newsletterOpen, setNewsletterOpen] = useState(false)
  // simple UX for Copy/Compose/Apply
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)
  // Auto-open apply from URL share link
  useEffect(() => {
    if (!isOpen) return
    try {
      const url = new URL(window.location.href)
      const openParam = url.searchParams.get("open") || ""
      if (openParam === "apply") setApplyOpen(true)
    } catch {}
  }, [isOpen])

  // Product profiles handled in ProductProfilesSection

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

  // Detect which templates are currently applied to this user
  useEffect(() => {
    if (!isOpen || !details || !tplNames.length) return
    let alive = true
    ;(async () => {
      try {
        const userAttrs = details.attributes || {}
        const matches: string[] = []
        
        // Check each template to see if its attributes match the user
        for (const name of tplNames) {
          const tpl = await fetchTemplate(name)
          if (!tpl || !alive) continue
          
          // Check if all template attributes are present and match
          const tplAttrs = tpl.attributes || {}
          const keys = Object.keys(tplAttrs).filter(k => tplAttrs[k] === true)
          if (keys.length === 0) continue
          
          const allMatch = keys.every(k => userAttrs[k] === true || userAttrs[k] === 'true')
          if (allMatch && keys.length > 0) {
            matches.push(name)
          }
        }
        
        if (alive) setDetectedTemplates(matches)
      } catch (e) {
        console.error('Failed to detect templates:', e)
      }
    })()
    return () => { alive = false }
  }, [isOpen, details, tplNames])

  // Preview effective newsletters from template stack
  useEffect(() => {
    const userId = details?.user_id
    if (!isOpen || !userId) return
    if (!tplStack.length) { setEffectiveFromTemplates(null); return }
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates/merge-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateNames: tplStack, baseUserId: userId }),
        })
        const payload = await res.json().catch(() => null)
        if (!alive || !payload) return
        const values = (payload.result && typeof payload.result === 'object') ? payload.result : {}
        const src = (payload.sources && typeof payload.sources === 'object') ? payload.sources : {}
        setEffectiveFromTemplates({ values, sources: src })
      } catch {
        if (alive) setEffectiveFromTemplates(null)
      }
    })()
    return () => { alive = false }
  }, [isOpen, details?.user_id, tplStack])

  // Product profiles moved

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
      setTplStack([name])
      setSaveErr(null)
    } catch (e) {
      console.error(e)
      setSaveErr("Failed to apply template")
    }
  }

  // --- Copy current user to a new template (newsletter-only MVP)
  const copyUserToTemplate = async () => {
    if (!details?.user_id) return
    const name = prompt("Template name to save from this user?")?.trim()
    if (!name) return
    setBusyAction("copy")
    try {
      const res = await fetch("/api/templates/copy-from-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: details.user_id, name }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSuccess(`Saved template “${name}” from user`)
    } catch (e: any) {
      setSaveErr(e?.message || "Failed to save template")
    } finally {
      setBusyAction(null)
    }
  }

  // --- Apply multiple templates to this user (comma-separated prompt MVP)
  const applyTemplatesToThisUser = async () => {
    if (!details?.user_id) return
    setApplyOpen(true)
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

  // Product profiles moved

  /* ---------------- render ------------------ */
  if (!isOpen) return null

  // Get selected group details for showing what will be inherited
  const selectedGroup = selectedGroupId ? lookups.byId[selectedGroupId] : null

  // Detect what changes will be saved
  const originalGroup = details ? lookups.resolve(getRawGroupValue(details)) : null
  const hasGroupChange = selectedGroupId !== originalGroup?.id
  const hasTemplateChange = !!pendingTpl
  
  // Count attribute changes (compare edited vs original)
  const originalAttrs = details?.attributes || {}
  const changedAttrs = Object.entries(edited).filter(([key, value]) => {
    const originalValue = originalAttrs[key]
    // Consider it changed if values differ and new value isn't empty
    return value !== "" && value !== originalValue
  })
  const hasAttributeChanges = changedAttrs.length > 0
  const attributeChangeCount = changedAttrs.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[92vh] w-[96vw] max-w-none overflow-y-auto rounded-none border border-line bg-background text-ink shadow-2xl">
        <DialogHeader className="sticky top-0 z-10 border-b border-line bg-background/95 px-2 py-3 pr-10 backdrop-blur">
          <DialogTitle className="flex items-center gap-3 font-serif text-2xl tracking-tight text-ink">
            <UsersIcon className="h-6 w-6" aria-hidden="true" />
            Edit User: {details?.identifiers?.email_address ?? "…"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-2 pb-4">
          {/* SECTION 1: GROUP ASSIGNMENT */}
          <Card className="rounded-md border-2 border-line bg-paper shadow-lg">
            <CardHeader className="pb-3 bg-[hsl(var(--muted))]/30">
              <CardTitle className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                <UsersIcon className="h-5 w-5" />
                Step 1: Group Assignment
              </CardTitle>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Groups automatically apply demographics and may include a default newsletter template
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-medium text-ink">Assign to Group</Label>
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

              {/* Show what will be inherited from group */}
              {selectedGroup && (
                <GroupInheritancePreview group={selectedGroup} />
              )}
            </CardContent>
          </Card>

          {/* SECTION 2: NEWSLETTER TEMPLATES */}
          <Card className="rounded-md border-2 border-line bg-paper shadow-lg">
            <CardHeader className="pb-3 bg-[hsl(var(--muted))]/30">
              <CardTitle className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                <FileText className="h-5 w-5" />
                Step 2: Newsletter Preferences
              </CardTitle>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Newsletter templates control which email newsletters the user receives
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick actions */}
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-line">
                <Button size="sm" variant="outline" onClick={copyUserToTemplate} disabled={!details || !!busyAction} className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]">
                  Save as Template…
                </Button>
                <Button size="sm" variant="outline" onClick={applyTemplatesToThisUser} disabled={!details || !!busyAction} className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]">
                  Apply Templates…
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewsletterOpen(true)} disabled={!details} className="ml-auto rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]">
                  View Newsletters
                </Button>
              </div>

              {detectedTemplates.length > 0 && (
                <div className="rounded-none border border-green-200 bg-green-50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-green-900">Currently applied templates:</span>
                    {detectedTemplates.map((name) => (
                      <Badge key={name} variant="outline" className="rounded-none border-green-500 bg-white text-green-700 px-2 py-1">
                        ✓ {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-medium text-ink">Apply Newsletter Template</Label>
                {tplErr ? (
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
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Newsletter templates are independent of group settings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: PRODUCT PROFILES (Extended Features) */}
          <Card className="rounded-md border-2 border-line bg-paper shadow-lg">
            <CardHeader className="pb-3 bg-[hsl(var(--muted))]/30">
              <CardTitle className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                <Radar className="h-5 w-5" />
                Step 3: Product Profiles (Optional)
              </CardTitle>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Extended product profiles for personalized content (MyLaw, Radar, Compass, Scholar). These are separate from newsletters.
              </p>
            </CardHeader>
            <CardContent>
              <ProductProfilesSection userId={details?.user_id} />
            </CardContent>
          </Card>

          {/* User Attributes Section - below */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-ink" />
              <span className="text-[hsl(var(--muted-foreground))]">Loading…</span>
            </div>
          ) : (
            details && (
              <Card className="rounded-none border border-line bg-paper">
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
                              <SelectValue placeholder={`Select ${s.label}…`} />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border border-line bg-paper">
                              {s.options?.map((opt) => (
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
                            value={(edited[k] as string) ?? ""}
                            onChange={(e) => onAttrChange(k, e.target.value)}
                            className="rounded-none border border-line bg-paper text-ink"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Opt-out status */}
                  <div className="space-y-2 pt-4 border-t border-line">
                    <Label className="text-[hsl(var(--muted-foreground))]">Opt Out Status</Label>
                    <Select
                      value={(edited.optout as string) ?? ""}
                      onValueChange={(v) => onAttrChange("optout", v)}
                    >
                      <SelectTrigger className="h-9 rounded-none border border-line bg-paper text-ink">
                        <SelectValue placeholder="Select status…" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border border-line bg-paper">
                        <SelectItem value="None" className="rounded-none">None</SelectItem>
                        <SelectItem value="marketing" className="rounded-none">Marketing</SelectItem>
                        <SelectItem value="All" className="rounded-none">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Last session badge */}
                  {details?.user_id && (
                    <div className="pt-2">
                      <LastSessionBadge userId={details.user_id} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          )}

          {/* Alerts */}
          {(error || fetchErr) && (
            <Alert className="rounded-none border border-line bg-[hsl(var(--muted))]">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription className="text-ink">{error || fetchErr}</AlertDescription>
            </Alert>
          )}
          {saveErr && (
            <Alert variant="destructive" className="rounded-none">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription>{saveErr}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="rounded-none border border-line bg-[hsl(var(--secondary))]/20">
              <Info className="h-4 w-4" aria-hidden="true" />
              <AlertDescription className="text-ink">{success}</AlertDescription>
            </Alert>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving || !!busyAction}
              className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
            >
              Cancel
            </Button>
            <SaveButton
              saving={saving}
              disabled={saving || !!busyAction}
              hasGroupChange={hasGroupChange}
              hasTemplateChange={hasTemplateChange}
              hasAttributeChanges={hasAttributeChanges}
              attributeChangeCount={attributeChangeCount}
              newGroupName={selectedGroup?.name}
              templateName={pendingTpl || undefined}
              onClick={handleSave}
            />
          </div>
        </div>
      </DialogContent>

      {/* Modals */}
      {newsletterOpen && details && (
        <NewsletterManagerModal
          isOpen={newsletterOpen}
          onClose={() => setNewsletterOpen(false)}
          userId={details.user_id}
          userEmail={details.identifiers.email_address}
        />
      )}

      {applyOpen && details && (
        <ApplyTemplatesModal
          open={applyOpen}
          onOpenChange={(open) => setApplyOpen(open)}
          target={{ type: "user", ids: [details.user_id] }}
        />
      )}
    </Dialog>
  )
}
