"use client"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  User,
  Save,
  AlertTriangle,
  Info,
  FileText,
} from "lucide-react"
import { updateUserAttributesAction } from "@/lib/user-actions"
import type { ZephrUser } from "@/lib/user-api"

/* 🔗 template helpers – client calls same API the Template page uses */
const fetchTemplateNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json()

const fetchTemplate = async (name: string) =>
  (await (await fetch(`/api/templates/${name}`)).json()) as {
    name: string
    attributes: Record<string, boolean>
  }

const saveTemplate = async (tpl: {
  name: string
  description: string
  attributes: Record<string, boolean>
}) =>
  fetch(`/api/templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  })

/* ---------------- schema for visible fields ---------------- */
const ATTRIBUTE_SCHEMA: Record<
  string,
  { label: string; type: string; options?: string[] }
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

interface UserEditModalProps {
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
}: UserEditModalProps) {
  const [editedAttributes, setEditedAttributes] = useState<
    Record<string, any>
  >({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  /* ---------- templates ----------- */
  const [templateNames, setTemplateNames] = useState<string[]>([])
  const [tplErr, setTplErr] = useState<string | null>(null)

  /* ---- load template list when modal opens ---- */
  useEffect(() => {
    if (!isOpen) return
    ;(async () => {
      try {
        setTemplateNames(await fetchTemplateNames())
      } catch (e) {
        console.error(e)
        setTplErr("Failed to load templates")
      }
    })()
  }, [isOpen])

  /* ---- init form with user data ---- */
  useEffect(() => {
    if (userDetails && isOpen) {
      const initial: Record<string, any> = {}

      Object.keys(ATTRIBUTE_SCHEMA).forEach((k) => {
        initial[k] = userDetails.attributes[k] || ""
      })
      Object.keys(userDetails.attributes).forEach((k) => {
        if (!initial[k]) initial[k] = userDetails.attributes[k]
      })
      setEditedAttributes(initial)
      setSaveError(null)
      setSuccess(null)
    }
  }, [userDetails, isOpen])

  /* ---------- handlers ---------- */
  const handleAttributeChange = (key: string, value: string) =>
    setEditedAttributes((p) => ({ ...p, [key]: value }))

  const applyTemplate = async (name: string) => {
    if (!name) return
    try {
      const tpl = await fetchTemplate(name)
      setEditedAttributes((prev) => ({
        ...prev,
        ...tpl.attributes,
      }))
      setSuccess(`Applied template “${name}”`)
      setSaveError(null)
    } catch (e) {
      console.error(e)
      setSaveError("Failed to apply template")
    }
  }

  const handleSaveAsTemplate = async () => {
    if (!userDetails) return
    const tplName = userDetails.identifiers.email_address
    try {
      await saveTemplate({
        name: tplName,
        description: `Template captured from ${tplName}`,
        attributes: editedAttributes,
      })
      setTemplateNames((prev) =>
        prev.includes(tplName) ? prev : [...prev, tplName],
      )
      setSuccess("Template saved!")
    } catch (e) {
      console.error(e)
      setSaveError("Could not save template")
    }
  }

  const handleSave = async () => {
    if (!userDetails) return
    setSaving(true)
    setSaveError(null)
    setSuccess(null)

    const attrs: Record<string, any> = {}
    Object.entries(editedAttributes).forEach(([k, v]) => {
      if (v !== "") attrs[k] = v
    })
    if (Object.keys(attrs).length === 0) {
      setSaveError("No attributes to save")
      setSaving(false)
      return
    }
    try {
      const result = await updateUserAttributesAction(
        userDetails.user_id,
        attrs,
      )
      if (result.success) {
        setSuccess("User updated successfully!")
        onUserUpdated?.()
        setTimeout(onClose, 1500)
      } else {
        setSaveError(result.error || "Failed to update user")
      }
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Failed to update user",
      )
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User: {userDetails?.identifiers.email_address || "…"}
          </DialogTitle>
        </DialogHeader>

        {/* -------------- template selector -------------- */}
        <div className="space-y-4">
          <Label className="text-gray-300">Apply Template</Label>
          {tplErr ? (
            <p className="text-xs text-red-400">{tplErr}</p>
          ) : (
            <Select onValueChange={applyTemplate}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Choose template…" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {templateNames.length === 0 ? (
                  <SelectItem value="" disabled>
                    No templates
                  </SelectItem>
                ) : (
                  templateNames.map((n) => (
                    <SelectItem
                      key={n}
                      value={n}
                      className="text-white hover:bg-white/10 focus:bg-white/10 capitalize"
                    >
                      {n}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* ---------------- existing alerts ---------------- */}
        {error && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10 mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-yellow-400">{error}</AlertDescription>
          </Alert>
        )}
        {saveError && (
          <Alert variant="destructive" className="border-red-700 bg-red-900/30 mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300">{saveError}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500/50 bg-green-500/10 mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* ---------- Attribute form ------------- */}
        {userDetails && (
          <Card className="bg-black/20 border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">User Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ATTRIBUTE_SCHEMA).map(([key, schema]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-gray-300">{schema.label}</Label>
                    {schema.type === "select" ? (
                      <Select
                        value={editedAttributes[key] || ""}
                        onValueChange={(v) => handleAttributeChange(key, v)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder={`Select ${schema.label}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10">
                          {schema.options!.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-white hover:bg-white/10">
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={schema.type}
                        value={editedAttributes[key] || ""}
                        onChange={(e) => handleAttributeChange(key, e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ---------- Actions ---------- */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button size="sm" variant="outline" onClick={onClose} className="border-white/20 text-white">
            Cancel
          </Button>

          {/* Save as template */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveAsTemplate}
            className="border-purple-500/50 text-purple-300"
            title="Create a template from current attributes"
          >
            <FileText className="h-4 w-4 mr-1" />
            Save Template
          </Button>

          {/* Save user */}
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
