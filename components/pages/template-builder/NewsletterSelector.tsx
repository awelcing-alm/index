"use client"

import React, { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ALL_NEWSLETTER_GROUPS, type NewsletterSlug } from "@/lib/newsletters"
import { computeDisabledNewsletterSlugs } from "@/lib/product-policy"

export function NewsletterSelector({
  query,
  setQuery,
  attributes,
  setAttributes,
  overwriteFalse,
  setOverwriteFalse,
  productGrants,
}: {
  query: string
  setQuery: (v: string) => void
  attributes: Record<string, any>
  setAttributes: (patch: Record<string, any>) => void
  overwriteFalse: boolean
  setOverwriteFalse: (v: boolean) => void
  productGrants: Record<string, boolean> | null
}) {
  const groupsToRender = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_NEWSLETTER_GROUPS
    return ALL_NEWSLETTER_GROUPS.map((g) => ({
      name: g.name,
      slugs: g.slugs.filter((slug) => slug.includes(q) || slug.replace(/-/g, " ").includes(q)),
    })).filter((g) => g.slugs.length > 0)
  }, [query])

  const visibleSlugs = useMemo<NewsletterSlug[]>(
    () => groupsToRender.flatMap((g) => g.slugs) as NewsletterSlug[],
    [groupsToRender],
  )

  const disabledSlugSet = useMemo(() => computeDisabledNewsletterSlugs(productGrants), [productGrants])

  const setAllVisible = (value: boolean) => {
    if (visibleSlugs.length === 0) return
    const patch: Record<string, boolean> = {}
    visibleSlugs.forEach((slug) => {
      if (disabledSlugSet.has(slug)) return
      patch[slug] = value
    })
    setAttributes({ ...attributes, ...patch })
  }

  const attrChecked = (k: string) => attributes[k] || false
  const attrCount = Object.values(attributes || {}).filter(Boolean).length

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Checkbox checked={overwriteFalse} onCheckedChange={(v) => setOverwriteFalse(v === true)} className="rounded-none" />
          <Label className="text-[hsl(var(--muted-foreground))]">
            Include <em>all</em> newsletter keys (unchecked = <span className="font-semibold">false</span>)
          </Label>
        </div>
        <Badge className="rounded-none border border-line bg-[hsl(var(--muted))] text-ink">{attrCount} attributes selected</Badge>
      </div>

      <div className="flex items-center gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter newsletters…" className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]" />
        <Button variant="ghost" size="sm" onClick={() => setAllVisible(true)} className="rounded-none" disabled={visibleSlugs.length === 0} title="Select all visible">Select All</Button>
        <Button variant="ghost" size="sm" onClick={() => setAllVisible(false)} className="rounded-none" disabled={visibleSlugs.length === 0} title="Clear all visible">Clear</Button>
      </div>

      {groupsToRender.length === 0 ? (
        <div className="text-sm text-[hsl(var(--muted-foreground))]">No newsletter fields matched your filter.</div>
      ) : (
        <div className="space-y-6">
          {groupsToRender.map((group) => (
            <div key={group.name}>
              <div className="mb-2 font-semibold text-ink">{group.name}</div>
              <div className="grid gap-3 rounded-none border border-line bg-paper p-4 sm:grid-cols-2 md:grid-cols-3">
                {group.slugs.map((slug) => {
                  const disabled = disabledSlugSet.has(slug)
                  return (
                    <div key={slug} className="flex items-center space-x-2 opacity-100">
                      <Checkbox
                        checked={attrChecked(slug)}
                        onCheckedChange={(v) => setAttributes({ ...attributes, [slug]: v === true })}
                        disabled={disabled}
                        className="rounded-none"
                      />
                      <Label className={`cursor-pointer capitalize ${disabled ? "text-[hsl(var(--muted-foreground))]/60" : "text-[hsl(var(--muted-foreground))]"}`} title={disabled ? "Managed by product access" : slug.replace(/-/g, " ") }>
                        {slug.replace(/-/g, " ")}
                        {disabled && (<span className="ml-2 rounded-none border border-line bg-[hsl(var(--muted))]/40 px-1 py-0.5 text-[10px] uppercase tracking-wide text-ink">locked</span>)}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
