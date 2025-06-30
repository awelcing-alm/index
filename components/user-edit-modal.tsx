"use client"

/* ----------------------------------------------------------------------
 * UserEditModal
 * - load / display user details
 * - let admin apply a template, edit attributes, save
 * - “Applied template” toast only appears AFTER the Save call succeeds
 * -------------------------------------------------------------------- */

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import {
  Input,
} from "@/components/ui/input"
import {
  Label,
} from "@/components/ui/label"
import {
  Button,
} from "@/components/ui/button"
import {
  Loader2,
  User,
  Save,
  AlertTriangle,
  Info,
  FileText,
} from "lucide-react"

import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"
import { updateUserAttributesAction } from "@/lib/user-actions"
import type { ZephrUser } from "@/lib/user-api"

/* ---------------- template helpers ---------------- */
const DEFAULT_MAP = Object.fromEntries(
  DEFAULT_TEMPLATES.map((t) => [t.name, t]),
)

const fetchCustomTemplateNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json()

const fetchTemplate = async (name: string) => {
  if (DEFAULT_MAP[name]) return DEFAULT_MAP[name]
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Template not found")
  return (await res.json()) as {
    name: string
    attributes: Record<string, boolean>
  }
}

const saveTemplate = async (tpl: {
  name: string
  description: string
  attributes: Record<string, boolean>
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

/* ------------------ component ---------------------- */
interface Props {
  userDetails: ZephrUser | null
  loading: boolean
  error: string | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated?: () => void
}

export function UserEditModal({
  userDetails,
  loading,
  error,
  isOpen,
  onClose,
  onUserUpdated,
}: Props) {
  const [edited, setEdited] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /* templates */
  const [tplNames, setTplNames] = useState<string[]>([])
  const [tplErr, setTplErr] = useState<string | null>(null)
  const [pendingTpl, setPendingTpl] = useState<string | null>(null)

  /* ------------ load template list ------------- */
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

  /* ------------ initialise form ----------------- */
  useEffect(() => {
    if (!userDetails || !isOpen) return
    const init: Record<string, any> = {}
    Object.keys(ATTRIBUTE_SCHEMA).forEach((k) => {
      init[k] = userDetails.attributes[k] ?? ""
    })
    Object.entries(userDetails.attributes).forEach(([k, v]) => {
      if (!(k in init)) init[k] = v
    })
    setEdited(init)
    setSaveErr(null)
    setSuccess(null)
    setPendingTpl(null)
  }, [userDetails, isOpen])

  /* ------------- handlers ----------------------- */
  const onAttrChange = (k: string, v: string) =>
    setEdited((p) => ({ ...p, [k]: v }))

  const applyTemplate = async (name: string) => {
    if (!name) return
    try {
      const tpl = await fetchTemplate(name)
      setEdited((p) => ({ ...p, ...tpl.attributes }))
      setPendingTpl(name) // toast only after successful PATCH
      setSaveErr(null)
    } catch (e) {
      console.error(e)
      setSaveErr("Failed to apply template")
    }
  }

  const saveAsTemplate = async () => {
    if (!userDetails) return
    const tplName = userDetails.identifiers.email_address
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
    if (!userDetails) return
    setSaving(true)
    setSaveErr(null)
    setSuccess(null)

    const patch: Record<string, any> = {}
    for (const [k, v] of Object.entries(edited)) if (v !== "") patch[k] = v

    if (Object.keys(patch).length === 0) {
      setSaveErr("No attributes to save")
      setSaving(false)
      return
    }

    try {
      const res = await updateUserAttributesAction(userDetails.user_id, patch)
      if (res.success) {
        setSuccess(
          pendingTpl
            ? `Template “${pendingTpl}” applied & user updated!`
            : "User updated successfully!",
        )
        setPendingTpl(null)
        onUserUpdated?.()
        setTimeout(onClose, 1500)
      } else setSaveErr(res.error || "Failed to update user")
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- render ---------------------- */
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Edit User: {userDetails?.identifiers.email_address || "…"}
          </DialogTitle>
        </DialogHeader>

        {/* ---------- template selector ---------- */}
        <div className="space-y-4">
          <Label className="text-gray-300">Apply Template</Label>
          {tplErr ? (
            <p className="text-xs text-red-400">{tplErr}</p>
          ) : tplNames.length === 0 ? (
            <Select disabled>
              <SelectTrigger className="bg-white/5 border-white/10 text-gray-400">
                <SelectValue placeholder="No templates available" />
              </SelectTrigger>
            </Select>
          ) : (
            <Select onValueChange={applyTemplate}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Choose template…" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {tplNames.map((n) => (
                  <SelectItem key={n} value={n} className="capitalize text-white hover:bg-white/10">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* ---------- alerts ---------- */}
        {error && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10 mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-yellow-400">{error}</AlertDescription>
          </Alert>
        )}
        {saveErr && (
          <Alert variant="destructive" className="border-red-700 bg-red-900/30 mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300">{saveErr}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500/50 bg-green-500/10 mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* ---------- attribute form ---------- */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="ml-2 text-gray-300">Loading…</span>
          </div>
        ) : (
          userDetails && (
            <Card className="bg-black/20 border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">User Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(ATTRIBUTE_SCHEMA).map(([k, s]) => (
                    <div key={k} className="space-y-2">
                      <Label className="text-gray-300">{s.label}</Label>
                      {s.type === "select" ? (
                        <Select value={edited[k] || ""} onValueChange={(v) => onAttrChange(k, v)}>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder={`Select ${s.label}`} />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-white/10">
                            {s.options!.map((opt) => (
                              <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={s.type}
                          value={edited[k] || ""}
                          onChange={(e) => onAttrChange(k, e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* ---------- actions ---------- */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <Button size="sm" variant="outline" onClick={onClose} className="border-white/20 text-white">
            Cancel
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={saveAsTemplate}
            className="border-purple-500/50 text-purple-300"
            title="Create template from current attributes"
          >
            <FileText className="h-4 w-4 mr-1" />
            Save Template
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
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