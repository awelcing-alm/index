"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Save, AlertTriangle } from "lucide-react"
import { getUserDetails, updateUserAttributes } from "@/lib/zephr-api"
import type { ZephrUser } from "@/lib/zephr-api"

interface UserEditDialogProps {
  userId: string
  userEmail: string
  children: React.ReactNode
  onUserUpdated?: () => void
}

export function UserEditDialog({ userId, userEmail, children, onUserUpdated }: UserEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<ZephrUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editedAttributes, setEditedAttributes] = useState<Record<string, any>>({})

  const loadUserDetails = async () => {
    if (!open || user) return

    setLoading(true)
    setError(null)

    try {
      console.log("Loading user details for:", userId)
      const userDetails = await getUserDetails(userId)
      console.log("Loaded user details:", userDetails)
      setUser(userDetails)
      setEditedAttributes(userDetails.attributes || {})
    } catch (err) {
      console.error("Error loading user details:", err)
      setError(err instanceof Error ? err.message : "Failed to load user details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadUserDetails()
    } else {
      // Reset state when dialog closes
      setUser(null)
      setEditedAttributes({})
      setError(null)
    }
  }, [open, userId])

  const handleAttributeChange = (key: string, value: string) => {
    setEditedAttributes((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      console.log("Saving user attributes:", editedAttributes)
      await updateUserAttributes(userId, editedAttributes)
      setUser((prev) => (prev ? { ...prev, attributes: editedAttributes } : null))
      onUserUpdated?.()
      setOpen(false)
    } catch (err) {
      console.error("Error updating user:", err)
      setError(err instanceof Error ? err.message : "Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = user && JSON.stringify(editedAttributes) !== JSON.stringify(user.attributes || {})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="ml-2 text-gray-300">Loading user details...</span>
          </div>
        ) : error ? (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        ) : user ? (
          <div className="space-y-6">
            {/* User Info */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">User ID</Label>
                    <p className="text-white font-medium font-mono text-sm">{user.user_id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Email Address</Label>
                    <p className="text-white font-medium">{user.identifiers.email_address}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Email Verified</Label>
                    <p className="text-white font-medium">{user.email_verified ? "Yes" : "No"}</p>
                  </div>
                  {user.created_date && (
                    <div>
                      <Label className="text-gray-300">Created Date</Label>
                      <p className="text-white font-medium text-sm">
                        {new Date(user.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Editable Attributes */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">User Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(editedAttributes).length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-2">No attributes found for this user.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      onClick={() => {
                        const newKey = prompt("Enter attribute name:")
                        if (newKey && !editedAttributes.hasOwnProperty(newKey)) {
                          handleAttributeChange(newKey, "")
                        }
                      }}
                    >
                      Add First Attribute
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(editedAttributes).map(([key, value]) => (
                      <div key={key}>
                        <Label htmlFor={key} className="text-gray-300 capitalize">
                          {key.replace(/_/g, " ")}
                        </Label>
                        <Input
                          id={key}
                          value={value || ""}
                          onChange={(e) => handleAttributeChange(key, e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder={`Enter ${key.replace(/_/g, " ")}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new attribute section */}
                {Object.keys(editedAttributes).length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                      onClick={() => {
                        const newKey = prompt("Enter attribute name:")
                        if (newKey && !editedAttributes.hasOwnProperty(newKey)) {
                          handleAttributeChange(newKey, "")
                        }
                      }}
                    >
                      Add Attribute
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
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
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
