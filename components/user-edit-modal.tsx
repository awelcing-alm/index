"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Save, AlertTriangle, Info } from "lucide-react"
import { updateUserAttributesAction } from "@/lib/user-actions"
import type { ZephrUser } from "@/lib/user-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserEditModalProps {
  userDetails: ZephrUser | null
  loading: boolean
  error: string | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated?: () => void
}

const ATTRIBUTE_SCHEMA: Record<string, { label: string; type: string; options?: string[] }> = {
  firstname: { label: "First Name", type: "text" },
  lastname: { label: "Last Name", type: "text" },
  organization: { label: "Organization", type: "text" },
  "job-area": {
    label: "Job Area",
    type: "select",
    options: ["In-House Counsel", "Technology Executive", "Corporate Executive", "Law Firm", "Solo Practitioner"],
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

export function UserEditModal({ userDetails, loading, error, isOpen, onClose, onUserUpdated }: UserEditModalProps) {
  const [editedAttributes, setEditedAttributes] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (userDetails && isOpen) {
      console.log(`[UserEditModal] Initializing with user details:`, JSON.stringify(userDetails, null, 2))
      console.log(`[UserEditModal] User attributes:`, JSON.stringify(userDetails.attributes, null, 2))

      // Initialize form with actual user attributes
      const initialAttributes: Record<string, any> = {}

      // Set all schema attributes with current values or empty string
      Object.keys(ATTRIBUTE_SCHEMA).forEach((key) => {
        const value = userDetails.attributes[key]
        initialAttributes[key] = value || ""
        console.log(`[UserEditModal] Setting ${key} = "${value}"`)
      })

      // Add any additional attributes not in schema
      Object.keys(userDetails.attributes).forEach((key) => {
        if (!ATTRIBUTE_SCHEMA[key]) {
          initialAttributes[key] = userDetails.attributes[key]
          console.log(`[UserEditModal] Adding custom attribute ${key} = "${userDetails.attributes[key]}"`)
        }
      })

      console.log(`[UserEditModal] Final initial form attributes:`, JSON.stringify(initialAttributes, null, 2))
      setEditedAttributes(initialAttributes)
      setSaveError(null)
      setSuccess(null)
    }
  }, [userDetails, isOpen])

  const handleAttributeChange = (key: string, value: string) => {
    console.log(`[UserEditModal] Changing ${key} from "${editedAttributes[key]}" to "${value}"`)
    setEditedAttributes((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!userDetails) return

    setSaving(true)
    setSaveError(null)
    setSuccess(null)

    // Only send non-empty attributes
    const attributesToSave: Record<string, any> = {}
    Object.entries(editedAttributes).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        attributesToSave[key] = value
      }
    })

    if (Object.keys(attributesToSave).length === 0) {
      setSaveError("No attributes to save")
      setSaving(false)
      return
    }

    try {
      console.log(`[UserEditModal] Saving attributes via server action:`, JSON.stringify(attributesToSave, null, 2))
      const result = await updateUserAttributesAction(userDetails.user_id, attributesToSave)

      if (result.success) {
        setSuccess("User updated successfully!")
        onUserUpdated?.()
        setTimeout(() => onClose(), 1500)
      } else {
        setSaveError(result.error || "Failed to update user")
      }
    } catch (err) {
      console.error(`[UserEditModal] Error saving:`, err)
      setSaveError(err instanceof Error ? err.message : "Failed to update user")
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
            Edit User: {userDetails?.identifiers.email_address || "Loading..."}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="ml-2 text-gray-300">Loading user details...</span>
            </div>
          ) : error ? (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-400">
                <p className="font-semibold">Warning</p>
                <p className="text-sm mt-1">{error}</p>
              </AlertDescription>
            </Alert>
          ) : null}

          {saveError && (
            <Alert variant="destructive" className="border-red-700 bg-red-900/30">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">{saveError}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {userDetails && (
            <>
              {/* Debug Info */}
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-blue-400">
                  <p className="font-semibold">Current Values:</p>
                  <p className="text-sm mt-1 font-mono">
                    firstname: "{editedAttributes.firstname}" | lastname: "{editedAttributes.lastname}" | job-area: "
                    {editedAttributes["job-area"]}"
                  </p>
                </AlertDescription>
              </Alert>

              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">User Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(ATTRIBUTE_SCHEMA).map(([key, schema]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-gray-300">
                          {schema.label}
                        </Label>
                        {schema.type === "select" && schema.options ? (
                          <Select
                            value={editedAttributes[key] || ""}
                            onValueChange={(value) => handleAttributeChange(key, value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder={`Select ${schema.label}...`} />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/10">
                              {schema.options.map((option) => (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className="text-white hover:bg-white/10 focus:bg-white/10"
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={key}
                            type={schema.type}
                            value={editedAttributes[key] || ""}
                            onChange={(e) => handleAttributeChange(key, e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder={`Enter ${schema.label}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
