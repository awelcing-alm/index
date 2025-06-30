"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Save, AlertTriangle, FileText } from "lucide-react"
import { getUserDetails, updateUserAttributes } from "@/lib/zephr-api"
import type { ZephrUser } from "@/lib/zephr-api"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"

/* ---------- template helpers ---------- */
interface TemplateResp {
  name: string
  description: string
  overwriteFalse: boolean
  attributes: Record<string, boolean>
}

const fetchTemplateNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json()

const fetchTemplate = async (name: string): Promise<TemplateResp | null> => {
  // default templates live in code, not in blob
  const defaultHit = DEFAULT_TEMPLATES.find((d) => d.name === name)
  if (defaultHit) return defaultHit as any
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`)
  return res.ok ? ((await res.json()) as TemplateResp) : null
}

const postTemplate = async (tpl: TemplateResp) =>
  fetch("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  })

/* ---------- component ---------- */
interface Props {
  userId: string
  userEmail: string
  children: React.ReactNode
  onUserUpdated?: () => void
}

export function UserEditDialog({
  userId,
  userEmail,
  children,
  onUserUpdated,
}: Props) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<ZephrUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [edited, setEdited] = useState<Record<string, any>>({})

  /* ------ templates ------- */
  const [tplNames, setTplNames] = useState<string[]>([])
  const [tplErr, setTplErr] = useState<string | null>(null)

  /* load template list once dialog opens */
  useEffect(() => {
    if (!open) return
      ; (async () => {
        try {
          const names = await fetchTemplateNames()
          const combined = Array.from(
            new Set([...DEFAULT_TEMPLATES.map((d) => d.name), ...names]),
          ).sort()
          setTplNames(combined)
        } catch (e) {
          console.error(e)
          setTplErr("Template list failed")
        }
      })()
  }, [open])

  /* load user details on open */
  useEffect(() => {
    if (!open) return
      ; (async () => {
        setLoading(true)
        setError(null)
        try {
          const details = await getUserDetails(userId)
          setUser(details)
          setEdited(details.attributes || {})
        } catch (e) {
          console.error(e)
          setError("Unable to load user")
        } finally {
          setLoading(false)
        }
      })()
  }, [open, userId])

  /* reset when closed */
  useEffect(() => {
    if (!open) {
      setUser(null)
      setEdited({})
      setError(null)
    }
  }, [open])

  /* -------- handlers -------- */
  const handleAttrChange = (k: string, v: any) =>
    setEdited((p) => ({ ...p, [k]: v }))

  const applyTemplate = async (name: string) => {
    if (!name) return
    const tpl = await fetchTemplate(name)
    if (!tpl) return
    setEdited((prev) => {
      // start from previous, then add / overwrite true keys
      const next = { ...prev, ...tpl.attributes }
      if (tpl.overwriteFalse) {
        // for all newsletters not in tpl.attributes make them false
        NEWSLETTER_KEYS.forEach((slug) => {
          if (!(slug in tpl.attributes)) next[slug] = false
        })
      }
      return next
    })
  }

  const saveTemplateFromUser = async () => {
    if (!user) return
    const tpl: TemplateResp = {
      name: userEmail,
      description: `Template captured from ${userEmail}`,
      overwriteFalse: true,
      attributes: NEWSLETTER_KEYS.reduce<Record<string, boolean>>(
        (acc, key) => {
          if (key in edited) acc[key] = !!edited[key]
          return acc
        },
        {},
      ),
    }
    try {
      await postTemplate(tpl)
      if (!tplNames.includes(tpl.name))
        setTplNames((prev) => [...prev, tpl.name].sort())
    } catch (e) {
      console.error("Save template failed", e)
      setError("Could not save template")
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      await updateUserAttributes(userId, edited)
      onUserUpdated?.()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Failed to update user")
    } finally {
      setSaving(false)
    }
  }

  const changed =
    user &&
    JSON.stringify(edited) !== JSON.stringify(user.attributes || {})

  /* ---------- UI ---------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User • {userEmail}
          </DialogTitle>
        </DialogHeader>

        {/* template selector */}
        <div className="mb-4">
          <Label className="text-gray-300 mb-1 block">Apply Template</Label>
          {tplErr ? (
            <p className="text-xs text-red-400">{tplErr}</p>
          ) : tplNames.length === 0 ? (
            <Badge>No templates</Badge>
          ) : (
            <Select onValueChange={applyTemplate}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Choose template…" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {tplNames.map((n) => (
                  <SelectItem
                    key={n}
                    value={n}
                    className="text-white capitalize hover:bg-white/10 focus:bg-white/10"
                  >
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={saveTemplateFromUser}
            className="mt-2 border-purple-500/50 text-purple-300"
          >
            <FileText className="h-3 w-3 mr-1" /> Save as Template
          </Button>
        </div>

        {/* status */}
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        ) : error ? (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        ) : null}

        {/* main form */}
        {user && !loading && (
          <>
            <Card className="bg-black/20 border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {NEWSLETTER_KEYS.map((slug) => (
                  <div key={slug} className="flex items-center gap-2">
                    <Checkbox
                      checked={!!edited[slug]}
                      onCheckedChange={(v) =>
                        handleAttrChange(slug, v === true)
                      }
                    />
                    <Label className="text-gray-300 capitalize">
                      {slug.replace(/-/g, " ")}
                    </Label>
                  </div>
                ))}

                {/* Extra (non-newsletter) attributes */}
                {Object.entries(edited)
                  .filter(([k]) => !(NEWSLETTER_KEYS as readonly string[]).includes(k as string)).map(([key, val]) => (
                    <div key={key}>
                      <Label className="text-gray-300">{key}</Label>
                      <Input
                        value={val ?? ""}
                        onChange={(e) =>
                          handleAttrChange(key, e.target.value)
                        }
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                disabled={!changed || saving}
                onClick={handleSave}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}