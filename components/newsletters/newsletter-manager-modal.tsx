// components/newsletters/newsletter-manager-modal.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import {
  NEWSLETTER_KEYS,
  ALL_NEWSLETTER_GROUPS,
  type NewsletterSlug,
} from "@/lib/newsletters"
import { updateUserAttributesAction } from "@/lib/user-actions"

type Props = {
  isOpen: boolean
  onClose: () => void
  userId: string
  userEmail: string
  existingAttributes?: Record<string, any> | null
}

export default function NewsletterManagerModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  existingAttributes,
}: Props) {
  const [query, setQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // seed from user attributes on open
  const [checked, setChecked] = useState<Record<NewsletterSlug, boolean>>({} as any)
  useEffect(() => {
    if (!isOpen) return
    const initial: Record<string, boolean> = {}
    NEWSLETTER_KEYS.forEach((k) => {
      const v = existingAttributes?.[k]
      initial[k] = Boolean(v === true || v === "true" || v === 1 || v === "1")
    })
    setChecked(initial as any)
    setError(null)
    setSuccess(null)
    setQuery("")
  }, [isOpen, existingAttributes])

  // Filter within groups (default order preserved)
  const groupsToRender = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_NEWSLETTER_GROUPS
    return ALL_NEWSLETTER_GROUPS.map(g => ({
      name: g.name,
      slugs: g.slugs.filter(
        (slug) => slug.includes(q) || slug.replace(/-/g, " ").includes(q)
      ),
    })).filter(g => g.slugs.length > 0)
  }, [query])

  const visibleSlugs = useMemo<NewsletterSlug[]>(
    () => groupsToRender.flatMap(g => g.slugs) as NewsletterSlug[],
    [groupsToRender]
  )

  const selectedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  )

  const toggle = (slug: NewsletterSlug, v: boolean) =>
    setChecked((p) => ({ ...p, [slug]: v }))

  const setAllVisible = (v: boolean) => {
    if (visibleSlugs.length === 0) return
    const patch: Record<NewsletterSlug, boolean> = {} as any
    visibleSlugs.forEach((slug) => (patch[slug] = v))
    setChecked((p) => ({ ...p, ...patch }))
  }

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(null)
    try {
      // Only send changed keys
      const outgoing: Record<string, boolean> = {}
      NEWSLETTER_KEYS.forEach((k) => {
        const prev = Boolean(
          existingAttributes?.[k] === true ||
            existingAttributes?.[k] === "true" ||
            existingAttributes?.[k] === 1 ||
            existingAttributes?.[k] === "1"
        )
        const cur = !!checked[k as NewsletterSlug]
        if (prev !== cur) outgoing[k] = cur
      })

      await updateUserAttributesAction(userId, outgoing)
      setSuccess("Newsletter preferences saved")
      setTimeout(onClose, 900)
    } catch (e: any) {
      setError(e?.message ?? "Failed to save subscriptions")
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const noMatches = groupsToRender.length === 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none border border-line bg-paper text-ink">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            Manage Newsletters for {userEmail}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="rounded-none">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="rounded-none border border-line bg-[hsl(var(--secondary))]/20">
            <AlertDescription className="text-ink">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="mt-2 rounded-none border border-line bg-paper">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-base">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                disabled={noMatches}
                title="Select all visible"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAllVisible(false)}
                className="rounded-none"
                disabled={noMatches}
                title="Clear all visible"
              >
                Clear
              </Button>
              <span className="ml-auto text-xs text-[hsl(var(--muted-foreground))]">
                {selectedCount} selected
              </span>
            </div>

            {noMatches ? (
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
                        <label
                          key={slug}
                          className="flex cursor-pointer select-none items-center gap-2"
                        >
                          <Checkbox
                            className="rounded-none"
                            checked={!!checked[slug as NewsletterSlug]}
                            onCheckedChange={(v) =>
                              toggle(slug as NewsletterSlug, v === true)
                            }
                          />
                          <span className="capitalize text-[hsl(var(--muted-foreground))]">
                            {slug.replace(/-/g, " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted)))]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-none bg-ink text-paper hover:bg-ink/90 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
