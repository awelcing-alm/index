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
  RefreshCw, Code, Table as TableIcon, Download,
} from "lucide-react"

import type { Group } from "@/lib/groups"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { updateUserAttributesAction } from "@/lib/user-actions"
import NewsletterManagerModal from "@/components/newsletters/newsletter-manager-modal"
import { getExtendedProfileAdmin, putExtendedProfileAdmin } from "@/lib/admin-zephr"

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

  // ---------------- Extended Profile state ----------------
  type FlatMap = Record<string, string | number | boolean | null>
  const [epAppId, setEpAppId] = useState("")
  const [epMode, setEpMode] = useState<"json" | "table">("json")
  const [epJsonText, setEpJsonText] = useState<string>(`{
  "first_name": "John",
  "last_name": "Doe"
}`)
  const [epOrigFlat, setEpOrigFlat] = useState<FlatMap>({})
  const [epFlat, setEpFlat] = useState<FlatMap>({})
  const [epBusy, setEpBusy] = useState<{ load: boolean; save: boolean }>({ load: false, save: false })
  const [epErr, setEpErr] = useState<string | null>(null)
  const epRows = useMemo(() => Object.entries(epFlat).sort(([a], [b]) => a.localeCompare(b)), [epFlat])

  // Helpers
  const isPlainObject = (v: any) => v && typeof v === "object" && !Array.isArray(v)
  const tryParseJsonString = (s: any) => {
    if (typeof s !== "string") return s
    try { return JSON.parse(s) } catch { return s }
  }
  function flatten(obj: any, prefix = ""): FlatMap {
    const out: FlatMap = {}
    const walk = (o: any, path: string[]) => {
      if (o == null) { out[path.join(".")] = null; return }
      if (typeof o !== "object") { out[path.join(".")] = o as any; return }
      if (Array.isArray(o)) {
        o.forEach((v, i) => walk(v, [...path, String(i)]))
        return
      }
      for (const [k, v] of Object.entries(o)) walk(v, [...path, k])
    }
    if (isPlainObject(obj)) for (const [k, v] of Object.entries(obj)) walk(v, [k])
    return out
  }
  function unflatten(map: FlatMap): any {
    const root: any = {}
    for (const [key, value] of Object.entries(map)) {
      const parts = key.split(".")
      let cur: any = root
      parts.forEach((p, i) => {
        const isLast = i === parts.length - 1
        const nextKey = parts[i + 1]
        const shouldBeArray = !isLast && /^\d+$/.test(nextKey || "")
        if (isLast) {
          cur[p] = value
        } else {
          if (!(p in cur)) cur[p] = shouldBeArray ? [] : {}
          cur = cur[p]
        }
      })
    }
    return root
  }
  function diffFlat(a: FlatMap, b: FlatMap) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    const changes: Array<{ key: string; kind: "added" | "removed" | "changed"; from?: any; to?: any }> = []
    for (const k of keys) {
      const va = a[k]
      const vb = b[k]
      if (va === undefined && vb !== undefined) changes.push({ key: k, kind: "added", to: vb })
      else if (va !== undefined && vb === undefined) changes.push({ key: k, kind: "removed", from: va })
      else if (va !== vb) changes.push({ key: k, kind: "changed", from: va, to: vb })
    }
    return changes
  }

  async function epLoad() {
    if (!details) return
    setEpBusy((p) => ({ ...p, load: true })); setEpErr(null)
    try {
      if (!epAppId) throw new Error("Enter App ID")
      const res = await getExtendedProfileAdmin(details.user_id, epAppId)
      if (!res.ok) throw new Error(`${res.status} fetching profile`)
      let payload: any = res.json
      if (payload && typeof payload === "object" && "message" in payload && (payload as any).message != null) {
        const inner = tryParseJsonString((payload as any).message)
        if (isPlainObject(inner)) payload = inner
      }
      if (!isPlainObject(payload)) payload = {}
      const flatNow = flatten(payload)
      setEpOrigFlat(flatNow)
      setEpFlat(flatNow)
      setEpJsonText(JSON.stringify(payload, null, 2))
      setEpMode("table")
    } catch (e: any) {
      setEpErr(e?.message || "Failed to load profile")
    } finally {
      setEpBusy((p) => ({ ...p, load: false }))
    }
  }

  async function epSaveFromTable() {
    const bodyObj = unflatten(epFlat)
    setEpJsonText(JSON.stringify(bodyObj, null, 2))
    await epSave(bodyObj)
  }
  async function epSaveFromJson() {
    let obj: unknown
    try { obj = JSON.parse(epJsonText) } catch (e: any) { setEpErr(`Invalid JSON: ${e?.message}`); return }
    if (isPlainObject(obj)) {
      const f = flatten(obj as any)
      setEpFlat(f)
      if (Object.keys(epOrigFlat).length === 0) setEpOrigFlat(f)
    }
    await epSave(obj)
  }
  async function epSave(obj: unknown) {
    if (!details) return
    setEpBusy((p) => ({ ...p, save: true })); setEpErr(null)
    try {
      if (!epAppId) throw new Error("Enter App ID")
      const res = await putExtendedProfileAdmin(details.user_id, epAppId, obj)
      if (!res.ok) throw new Error(`${res.status} saving profile`)
      const afterFlat = isPlainObject(obj) ? flatten(obj as any) : {}
      const changes = diffFlat(epOrigFlat, afterFlat)
      setEpOrigFlat(afterFlat)
      setSuccess(
        changes.length === 0
          ? "Profile saved (no changes)"
          : `Profile updated (${changes.length} ${changes.length === 1 ? "change" : "changes"})`,
      )
    } catch (e: any) {
      setEpErr(e?.message || "Failed to save profile")
    } finally {
      setEpBusy((p) => ({ ...p, save: false }))
    }
  }
  function epUpdateCell(key: string, raw: string) {
    const trimmed = raw.trim()
    let val: any = raw
    if (/^(true|false)$/i.test(trimmed)) val = /^true$/i.test(trimmed)
    else if (trimmed === "null") val = null
    else if (trimmed !== "" && !isNaN(Number(trimmed))) {
      if (!/^0[0-9]+$/.test(trimmed)) val = Number(trimmed)
    }
    setEpFlat((prev) => ({ ...prev, [key]: val }))
  }
  function epPretty() {
    try { setEpJsonText(JSON.stringify(JSON.parse(epJsonText), null, 2)) }
    catch (e: any) { setEpErr(`Cannot pretty-print: ${e?.message || "invalid JSON"}`) }
  }

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

        {/* NEW: Extended Profile */}
        {details && (
          <Card className="mt-4 rounded-none border border-line bg-paper">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-lg text-ink">Extended Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {epErr && (
                <Alert variant="destructive" className="rounded-none">
                  <AlertDescription>{epErr}</AlertDescription>
                </Alert>
              )}

              {/* IDs */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1">
                  <Label>User ID</Label>
                  <Input value={details.user_id} disabled className="bg-[hsl(var(--muted))]/20" />
                </div>
                <div className="grid gap-1">
                  <Label>App ID</Label>
                  <Input placeholder="my-app-id" value={epAppId} onChange={(e) => setEpAppId(e.target.value)} />
                </div>
              </div>

              {/* Mode toggle & actions */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 border rounded-md overflow-hidden">
                  <Button type="button" variant={epMode === "table" ? "default" : "outline"} size="sm" onClick={() => setEpMode("table")}>
                    <TableIcon className="h-4 w-4" />
                    <span className="ml-2">Table</span>
                  </Button>
                  <Button type="button" variant={epMode === "json" ? "default" : "outline"} size="sm" onClick={() => setEpMode("json")}>
                    <Code className="h-4 w-4" />
                    <span className="ml-2">JSON</span>
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={epLoad} disabled={epBusy.load || !epAppId}>
                  {epBusy.load ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="ml-2">Load Current</span>
                </Button>

                {epMode === "json" ? (
                  <Button onClick={epSaveFromJson} disabled={epBusy.save || !epAppId}>
                    {epBusy.save ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span className="ml-2">Save (JSON)</span>
                  </Button>
                ) : (
                  <Button onClick={epSaveFromTable} disabled={epBusy.save || !epAppId}>
                    {epBusy.save ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span className="ml-2">Save (Table)</span>
                  </Button>
                )}

                {epMode === "json" && (
                  <Button variant="outline" size="sm" onClick={epPretty} title="Pretty-print JSON">
                    <Download className="h-4 w-4" />
                    <span className="ml-2">Pretty</span>
                  </Button>
                )}
              </div>

              {/* Editor / Table */}
              {epMode === "json" ? (
                <textarea
                  value={epJsonText}
                  onChange={(e) => setEpJsonText(e.target.value)}
                  className="font-mono text-sm min-h-[260px] w-full rounded-md border border-line bg-paper p-2"
                />
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50">
                      <tr className="text-left">
                        <th className="px-3 py-2 w-[40%]">Key (dot path)</th>
                        <th className="px-3 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {epRows.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-3 py-8 text-center text-neutral-500">
                            No properties. Load current, or switch to JSON to add keys.
                          </td>
                        </tr>
                      ) : (
                        epRows.map(([k, v]) => (
                          <tr key={k} className="border-t align-top">
                            <td className="px-3 py-2 font-mono text-xs text-neutral-700">{k}</td>
                            <td className="px-3 py-2">
                              {typeof v === "boolean" ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={!!v}
                                    onChange={(e) => epUpdateCell(k, e.target.checked ? "true" : "false")}
                                  />
                                  <span className="text-xs text-neutral-600">(boolean)</span>
                                </div>
                              ) : (
                                <Input
                                  value={v == null ? "" : String(v)}
                                  onChange={(e) => epUpdateCell(k, e.target.value)}
                                  placeholder="null / text / number"
                                  className="text-sm"
                                />
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
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
