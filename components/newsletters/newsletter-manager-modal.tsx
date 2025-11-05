// components/newsletters/newsletter-manager-modal.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import {
  NEWSLETTER_KEYS,
  ALL_NEWSLETTER_GROUPS,
  type NewsletterSlug,
} from "@/lib/newsletters"
import { updateUserAttributesAction } from "@/lib/user-actions"

/**
 * ✨ Goals
 * - Reduce multi-line wrapping + weird row heights
 * - Make hit targets consistent (44px) on mobile
 * - Keep an efficient dense layout on desktop
 * - Preserve existing behavior & types
 */

type Props = {
  isOpen: boolean
  onClose: () => void
  userId: string
  userEmail: string
  existingAttributes?: Record<string, any> | null
  effectiveFromTemplates?: { values: Record<string, boolean>; sources: Record<string, string[]> }
}

export default function NewsletterManagerModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  existingAttributes,
  effectiveFromTemplates,
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
    return ALL_NEWSLETTER_GROUPS.map((g) => ({
      name: g.name,
      slugs: g.slugs.filter(
        (slug) => slug.includes(q) || slug.replace(/-/g, " ").includes(q)
      ),
    })).filter((g) => g.slugs.length > 0)
  }, [query])

  const visibleSlugs = useMemo<NewsletterSlug[]>(
    () => groupsToRender.flatMap((g) => g.slugs) as NewsletterSlug[],
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
    setSaving(true)
    setError(null)
    setSuccess(null)
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none border border-line bg-paper text-ink">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            Manage Newsletters for {userEmail}
          </DialogTitle>
        </DialogHeader>

        {/* status banners */}
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
            {/* Toolbar: sticky so the filter stays visible while scrolling */}
            <div className="sticky top-0 z-10 -mx-4 -mt-2 mb-2 flex flex-wrap items-center gap-2 border-b border-line bg-paper/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter newsletters…"
                className="h-9 w-full min-w-0 flex-1 rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))] md:w-auto"
              />
              <div className="ms-auto flex w-full items-center gap-2 md:w-auto">
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
                <span className="ms-auto text-xs text-[hsl(var(--muted-foreground))]">
                  {selectedCount} selected
                </span>
              </div>
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

                    {/* Responsive, even columns with a sensible min width to reduce wrap */}
                    <div
                      className="grid gap-2 rounded-none border border-line bg-paper p-3
                                 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
                    >
                      {group.slugs.map((slug) => {
                        const isChecked = !!checked[slug as NewsletterSlug]
                        const label = slug.replace(/-/g, " ")
                        const eff = effectiveFromTemplates?.values?.[slug] ?? undefined
                        const effSrc = effectiveFromTemplates?.sources?.[slug] || []
                        return (
                          <label
                            key={slug}
                            className="group relative flex min-h-[44px] cursor-pointer select-none items-center gap-2 rounded border border-line/60 px-3 py-2
                                       hover:bg-[hsl(var(--muted))]/30 focus-within:ring-1 focus-within:ring-[hsl(var(--ring))]"
                            title={label}
                          >
                            <Checkbox
                              className="rounded-none mt-0.5"
                              checked={isChecked}
                              onCheckedChange={(v) => toggle(slug as NewsletterSlug, v === true)}
                              aria-label={label}
                            />
                            <span
                              className="min-w-0 truncate capitalize text-sm leading-tight text-[hsl(var(--muted-foreground))]"
                            >
                              {label}
                            </span>
                            {/* effective chip */}
                            <AnimatePresence initial={false}>
                              {typeof eff === "boolean" && (
                                <motion.span
                                  key={`chip-${slug}-${eff}-${effSrc.join("+")}`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1, scale: [1, 1.04, 1] }}
                                  exit={{ opacity: 0 }}
                                  className="ml-auto rounded border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]"
                                >
                                  Effective: {eff ? "✓" : "✗"} {effSrc.length ? `(${effSrc.join("+")})` : "(Manual)"}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {/* Revert quick action when diverged */}
                            <AnimatePresence initial={false}>
                              {typeof eff === "boolean" && eff !== isChecked && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggle(slug as NewsletterSlug, eff)}
                                    className="ml-2 h-6 rounded-none border-line px-2 text-[10px] text-ink hover:bg-[hsl(var(--muted))]"
                                    title="Revert to composed value"
                                  >
                                    Revert
                                  </Button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {/* subtle background when selected */}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 rounded ring-0
                                         data-[on=true]:bg-[hsl(var(--secondary))]/20"
                              data-on={isChecked}
                            />
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* actions */}
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
            aria-busy={saving}
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
