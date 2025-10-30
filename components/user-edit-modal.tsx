// components/user-edit-modal.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Loader2, Users as UsersIcon, Save, AlertTriangle, Info,
  Radar as RadarIcon, Compass as CompassIcon, GraduationCap,
} from "lucide-react"

import type { Group } from "@/lib/groups"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { updateUserAttributesAction } from "@/lib/user-actions"
import NewsletterManagerModal from "@/components/newsletters/newsletter-manager-modal"
import type { ProductKey } from "@/lib/product-templates"

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
  const [appAvail, setAppAvail] = useState<{ radar?: boolean; compass?: boolean; scholar?: boolean }>({})
  const [appErr, setAppErr] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<ProductKey | null>(null)
  const [appLoading, setAppLoading] = useState(false)
  const [appDraft, setAppDraft] = useState<string>("")
  const [appSaveMsg, setAppSaveMsg] = useState<string | null>(null)

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
        setAppAvail({ radar: !!a.radar?.exists, compass: !!a.compass?.exists, scholar: !!a.scholar?.exists })
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
            {/* Extended Profile apps row */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Profiles:</span>
              <button
                type="button"
                onClick={() => loadAppProfile("radar")}
                className={[
                  "flex items-center gap-1 rounded-md border px-2 py-1",
                  appAvail.radar ? "border-blue-500 ring-2 ring-blue-300 animate-pulse" : "border-line",
                  "hover:bg-[hsl(var(--muted))]",
                ].join(" ")}
                title={appAvail.radar ? "Radar profile available" : "No Radar profile yet"}
              >
                <RadarIcon className="h-4 w-4 text-ink" />
                <span className="text-sm">Radar</span>
              </button>
              <button
                type="button"
                onClick={() => loadAppProfile("compass")}
                className={[
                  "flex items-center gap-1 rounded-md border px-2 py-1",
                  appAvail.compass ? "border-green-600 ring-2 ring-green-300 animate-pulse" : "border-line",
                  "hover:bg-[hsl(var(--muted))]",
                ].join(" ")}
                title={appAvail.compass ? "Compass profile available" : "No Compass profile yet"}
              >
                <CompassIcon className="h-4 w-4 text-ink" />
                <span className="text-sm">Compass</span>
              </button>
              <button
                type="button"
                onClick={() => loadAppProfile("scholar")}
                className={[
                  "flex items-center gap-1 rounded-md border px-2 py-1",
                  appAvail.scholar ? "border-purple-600 ring-2 ring-purple-300 animate-pulse" : "border-line",
                  "hover:bg-[hsl(var(--muted))]",
                ].join(" ")}
                title={appAvail.scholar ? "Scholar profile available" : "No Scholar profile yet"}
              >
                <GraduationCap className="h-4 w-4 text-ink" />
                <span className="text-sm">Scholar</span>
              </button>

              {appErr && (
                <span className="ml-2 text-xs text-[hsl(var(--destructive))]">{appErr}</span>
              )}
            </div>

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

              {/* Template */}
              <div className="space-y-2">
                <Label className="text-[hsl(var(--muted-foreground))]">Apply Template</Label>
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
                  <textarea
                    value={appDraft}
                    onChange={(e) => setAppDraft(e.target.value)}
                    className="min-h-[220px] w-full rounded-none border border-line bg-paper p-2 font-mono text-sm text-ink"
                  />
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

        {/* NEW: Opt-out + Newsletters row */}
        <div className="mt-3 flex items-center justify-between rounded-none border border-line bg-[hsl(var(--muted))]/20 px-4 py-3">
          <div className="flex items-center gap-3">
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
