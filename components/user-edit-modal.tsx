"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, User as UserIcon, Save, AlertTriangle, Info, FileText } from "lucide-react"

import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { updateUserAttributesAction, getUserDetailsAction } from "@/lib/user-actions"
import type { ZephrUser } from "@/lib/zephr-types"
import type { Group } from "@/lib/groups"

/* ---------------- template helpers ---------------- */
const DEFAULT_MAP = Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.name, t]))

const fetchCustomTemplateNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json()

const fetchTemplate = async (name: string) => {
  if (DEFAULT_MAP[name]) return DEFAULT_MAP[name]
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Template not found")
  return (await res.json()) as { name: string; attributes: Record<string, any> }
}

const saveTemplate = async (tpl: {
  name: string
  description: string
  attributes: Record<string, any>
}) =>
  fetch("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  })

/* ------------- visible attribute schema ------------ */
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
      "Barristers' Chambers",
      "Judiciary",
      "Government Lawyer",
      "Law School",
      "Vendor",
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

/* ---------------- groups helpers ------------------ */
const GROUP_ICON_EMOJI: Record<string, string> = {
  scale: "⚖️",
  bank: "🏛️",
  clipboard: "📋",
  shield: "🛡️",
  user: "👤",
  users: "👥",
  briefcase: "💼",
  file: "📄",
  chart: "📈",
  pie: "📊",
  gavel: "🔨",
  building: "🏢",
  folder: "🗂️",
  book: "📘",
}

const slugify = (s: string) =>
  s?.toLowerCase?.().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || ""

function buildGroupLookups(groups: Group[]) {
  return {
    byId: Object.fromEntries(groups.map((g) => [g.id, g])),
    bySlug: Object.fromEntries(groups.map((g) => [g.slug.toLowerCase().trim(), g])),
    byNameLower: Object.fromEntries(groups.map((g) => [g.name.toLowerCase().trim(), g])),
    byNameSlug: Object.fromEntries(groups.map((g) => [slugify(g.name), g])),
  }
}

function resolveGroup(raw: unknown, lookups: ReturnType<typeof buildGroupLookups>): Group | null {
  if (!raw) return null
  const v = String(raw).trim()
  const low = v.toLowerCase()
  return (
    lookups.byId[v] ||
    lookups.bySlug[low] ||
    lookups.byNameLower[low] ||
    lookups.byNameSlug[slugify(v)] ||
    null
  )
}

const extractDemographicsFromGroup = (g?: Group | null) => {
  if (!g) return {}
  const d = (g.demographics || {}) as any
  return {
    ...(d["country"] ? { country: d["country"] } : d["region"] ? { country: d["region"] } : {}),
    ...(d["job-function"]
      ? { "job-function": d["job-function"] }
      : d["job_function"]
      ? { "job-function": d["job_function"] }
      : {}),
    ...(d["job-area"]
      ? { "job-area": d["job-area"] }
      : d["job_area"]
      ? { "job-area": d["job_area"] }
      : {}),
  }
}

/* ------------------ component ---------------------- */
interface Props {
  userDetails: ZephrUser | null
  loading: boolean
  error: string | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated?: () => void
  groups: Group[]
}

export function UserEditModal({
  userDetails,
  loading,
  error,
  isOpen,
  onClose,
  onUserUpdated,
  groups,
}: Props) {
  const lookups = useMemo(() => buildGroupLookups(groups), [groups])

  const [fetching, setFetching] = useState(false)
  const [fetchErr, setFetchErr] = useState<string | null>(null)
  const [details, setDetails] = useState<ZephrUser | null>(userDetails)

  const [edited, setEdited] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /* templates */
  const [tplNames, setTplNames] = useState<string[]>([])
  const [tplErr, setTplErr] = useState<string | null>(null)
  const [pendingTpl, setPendingTpl] = useState<string | null>(null)

  const currentGroupObj = useMemo(
    () => resolveGroup(details?.attributes?.group, lookups),
    [details, lookups]
  )
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    currentGroupObj?.id ?? null
  )

  /* --- fetch single user fresh on open --- */
  useEffect(() => {
    if (!isOpen || !userDetails?.user_id) return
    ;(async () => {
      try {
        setFetching(true)
        setFetchErr(null)
        const fresh = await getUserDetailsAction(userDetails.user_id)
        setDetails(fresh)
      } catch (e: any) {
        setFetchErr(e?.message || "Failed to load user details")
      } finally {
        setFetching(false)
      }
    })()
  }, [isOpen, userDetails?.user_id])

  /* --- template list --- */
  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      try {
        const custom = await fetchCustomTemplateNames()
        const defaults = DEFAULT_TEMPLATES.map((t) => t.name)
        const merged = [...defaults, ...custom.filter((n) => !defaults.includes(n))]
        setTplNames(merged)
        setTplErr(null)
      } catch (e) {
        console.error(e)
        setTplErr("Failed to load templates")
      }
    })()
  }, [isOpen])

  /* --- initialize form when details ready --- */
  useEffect(() => {
    if (!details || !isOpen) return
    const init: Record<string, any> = {}
    Object.keys(ATTRIBUTE_SCHEMA).forEach((k) => {
      init[k] = details.attributes[k] ?? ""
    })
    // keep any extra attributes too (don’t drop)
    Object.entries(details.attributes).forEach(([k, v]) => {
      if (!(k in init)) init[k] = v
    })
    // visible group text for completeness
    init.group = details.attributes?.group ?? ""
    setEdited(init)
    setSaveErr(null)
    setSuccess(null)
    setPendingTpl(null)

    // set group selector
    const g = resolveGroup(details.attributes?.group, lookups)
    setSelectedGroupId(g?.id ?? null)
  }, [details, isOpen, lookups])

  /* ------------- handlers ----------------------- */
  const onAttrChange = (k: string, v: string) => setEdited((p) => ({ ...p, [k]: v }))

  const applyTemplate = async (name: string) => {
    if (!name) return
    try {
      const tpl = await fetchTemplate(name)
      setEdited((p) => ({ ...p, ...tpl.attributes }))
      setPendingTpl(name)
      setSaveErr(null)
    } catch (e) {
      console.error(e)
      setSaveErr("Failed to apply template")
    }
  }

  const saveAsTemplate = async () => {
    if (!details) return
    const tplName = details.identifiers.email_address
    try {
      await saveTemplate({
        name: tplName,
        description: `Template captured from ${tplName}`,
        attributes: edited,
      })
      setTplNames((p) => (p.includes(tplName) ? p : [...p, tplName]))
      setSuccess("Template saved!")
    } catch (e) {
      console.error(e)
      setSaveErr("Could not save template")
    }
  }

  const handleSave = async () => {
    if (!details) return
    setSaving(true)
    setSaveErr(null)
    setSuccess(null)

    const patch: Record<string, any> = {}
    for (const [k, v] of Object.entries(edited)) if (v !== "") patch[k] = v

    // include group mapping + demographics if a group is chosen
    if (selectedGroupId) {
      const g = lookups.byId[selectedGroupId]
      if (g) Object.assign(patch, { group: g.name }, extractDemographicsFromGroup(g))
    }

    if (Object.keys(patch).length === 0) {
      setSaveErr("No attributes to save")
      setSaving(false)
      return
    }

    try {
      await updateUserAttributesAction(details.user_id, patch)
      setSuccess(
        pendingTpl ? `Template “${pendingTpl}” applied & user updated!` : "User updated successfully!"
      )
      setPendingTpl(null)
      onUserUpdated?.()
      setTimeout(onClose, 1500)
    } catch (e: any) {
      setSaveErr(e?.message || "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- render ---------------------- */
  if (!isOpen) return null

  const headerGroup =
    (selectedGroupId && lookups.byId[selectedGroupId]) ||
    currentGroupObj ||
    null
  const groupEmoji = headerGroup ? GROUP_ICON_EMOJI[headerGroup.icon || ""] ?? "📁" : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border border-line text-ink">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-ink">
            {groupEmoji ? (
              <span className="text-xl leading-none" aria-hidden="true">
                {groupEmoji}
              </span>
            ) : (
              <UserIcon className="h-5 w-5" aria-hidden="true" />
            )}
            Edit User: {details?.identifiers.email_address || userDetails?.identifiers.email_address || "…"}
          </DialogTitle>
        </DialogHeader>

{/* Apply Template + Group (one box) */}
<Card className="mt-2 rounded-none border border-line bg-paper">
  <CardHeader className="pb-2">
    <CardTitle className="font-serif text-lg text-ink">Apply</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Left: Template */}
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
          <Select onValueChange={applyTemplate}>
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

      {/* Right: Group */}
      <div className="space-y-2">
        <Label className="text-[hsl(var(--muted-foreground))]">Assign / Change Group</Label>
        <Select
          value={selectedGroupId ?? ""}
          onValueChange={(id) => {
            setSelectedGroupId(id)
            const g = lookups.byId[id]
            setEdited((p) => ({
              ...p,
              group: g?.name ?? "",
              ...extractDemographicsFromGroup(g || undefined),
            }))
          }}
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
    </div>
  </CardContent>
</Card>


                      {/* Attributes */}
              <Card className="mt-6 rounded-none border border-line bg-paper">
                <CardHeader>
                  <CardTitle className="font-serif text-lg text-ink">User Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(ATTRIBUTE_SCHEMA).map(([k, s]) => (
                      <div key={k} className="space-y-2">
                        <Label className="text-[hsl(var(--muted-foreground))]">
                          {s.label}
                        </Label>
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

        {/* actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={saveAsTemplate}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
            title="Create template from current attributes"
          >
            <FileText className="mr-1 h-4 w-4" />
            Save Template
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
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
      </DialogContent>
    </Dialog>
  )
}
