"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Play, Eye, Crown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TemplatePicker } from "@/components/templates/template-picker"
import { toast } from "@/hooks/use-toast"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ApplyTarget = { type: "user" | "group"; ids: string[] }

type MergePreview = {
  result: Record<string, any>
  sources: Record<string, string[]>
  conflicts?: string[]
}

export type ApplyTemplatesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: ApplyTarget
  baseUserId?: string
  onApplied?: (args: { wrote: number; results?: any[] }) => void
  initialStack?: string[]
}

export function ApplyTemplatesModal({
  open,
  onOpenChange,
  target,
  baseUserId,
  onApplied,
  initialStack,
}: ApplyTemplatesModalProps): React.ReactElement {
  const [allTemplates, setAllTemplates] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [dryRun, setDryRun] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<MergePreview | null>(null)
  const [previewCompare, setPreviewCompare] = useState<MergePreview | null>(null)
  const [baseBooleans, setBaseBooleans] = useState<Record<string, boolean>>({})
  const [compareUserId, setCompareUserId] = useState<string>("")
  const [presetName, setPresetName] = useState("")
  const [presets, setPresets] = useState<Array<{ name: string; list: string[] }>>([])

  // Seed stack on open from props or URL (?stack=csv)
  useEffect(() => {
    if (!open) return
    let seeded = false
    try {
      if (initialStack && initialStack.length) {
        setSelected(initialStack)
        seeded = true
      }
      const url = new URL(window.location.href)
      const stackRaw = url.searchParams.get("stack") || ""
      if (stackRaw && !seeded) {
        const list = decodeURIComponent(stackRaw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        if (list.length) setSelected(list)
      }
    } catch {}
  }, [open, initialStack])

  // Load list of templates
  useEffect(() => {
    if (!open) return
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/templates?scope=all&format=array", { cache: "no-store" })
        const data = await res.json().catch(() => [])
        if (!alive) return
        setAllTemplates(Array.isArray(data) ? (data as string[]).filter(Boolean).sort() : [])
      } catch {
        if (alive) setAllTemplates([])
      }
    })()
    return () => {
      alive = false
    }
  }, [open])

  // Load presets from localStorage
  useEffect(() => {
    if (!open) return
    try {
      const raw = localStorage.getItem("template_stacks")
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr)) setPresets(arr)
    } catch {}
  }, [open])

  const runPreview = async () => {
    if (!selected.length) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/templates/merge-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateNames: selected, baseUserId }),
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) throw new Error(payload?.error || "Preview failed")
      setPreview({
        result: payload?.result || {},
        sources: payload?.sources || {},
        conflicts: payload?.conflicts || [],
      })

      // Load base user booleans for changed-count summary
      try {
        if (baseUserId) {
          const uRes = await fetch(`/api/users/${encodeURIComponent(baseUserId)}`, { cache: "no-store" })
          const u = await uRes.json().catch(() => null)
          const map: Record<string, boolean> = {}
          if (u && typeof u === "object") {
            NEWSLETTER_KEYS.forEach((k) => {
              const v = (u as any)[k]
              if (typeof v === "boolean") map[k] = v
            })
          }
          setBaseBooleans(map)
        } else {
          setBaseBooleans({})
        }
      } catch {
        setBaseBooleans({})
      }

      // Optional compare user preview
      if (compareUserId && compareUserId.trim()) {
        const rc = await fetch("/api/templates/merge-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateNames: selected, baseUserId: compareUserId.trim() }),
        })
        const pc = await rc.json().catch(() => null)
        if (rc.ok && pc) setPreviewCompare({ result: pc.result || {}, sources: pc.sources || {}, conflicts: pc.conflicts || [] })
        else setPreviewCompare(null)
      } else {
        setPreviewCompare(null)
      }
    } catch (e: any) {
      setError(e?.message || "Preview failed")
    } finally {
      setLoading(false)
    }
  }

  const apply = async () => {
    if (!selected.length) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/templates/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateNames: selected, target, dryRun }),
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) throw new Error(payload?.error || "Apply failed")
      const wrote = Array.isArray(payload?.results)
        ? payload.results.reduce((s: number, r: any) => s + (r?.wrote || 0), 0)
        : 0
      onApplied?.({ wrote, results: payload?.results || [] })
      if (!dryRun) onOpenChange(false)
    } catch (e: any) {
      setError(e?.message || "Apply failed")
    } finally {
      setLoading(false)
    }
  }

  const copyShareLink = async () => {
    try {
      const url = new URL(window.location.href)
      url.searchParams.set("stack", encodeURIComponent(selected.join(",")))
      url.searchParams.set("open", "apply")
      await navigator.clipboard.writeText(url.toString())
      toast({ title: "Link copied", description: "Template stack link placed on clipboard." })
    } catch {
      toast({ title: "Copy failed", description: "Couldn’t copy link.", variant: "destructive" as any })
    }
  }

  const savePreset = () => {
    const name = presetName.trim()
    if (!name || !selected.length) return
    const next = [...presets.filter((p) => p.name !== name), { name, list: selected }]
    setPresets(next)
    try {
      localStorage.setItem("template_stacks", JSON.stringify(next))
    } catch {}
    setPresetName("")
    toast({ title: "Stack saved", description: `Saved preset “${name}”.` })
  }

  const loadPreset = (name: string) => {
    const p = presets.find((x) => x.name === name)
    if (p) setSelected(p.list)
  }

  const deletePreset = (name: string) => {
    const next = presets.filter((p) => p.name !== name)
    setPresets(next)
    try {
      localStorage.setItem("template_stacks", JSON.stringify(next))
    } catch {}
  }

  const changedSummary = useMemo(() => {
    try {
      if (!preview) return null
      const keys = Object.keys(preview.result)
      const boolKeys = keys.filter((k) => typeof preview.result[k] === "boolean")
      const changed = baseUserId && Object.keys(baseBooleans).length
        ? boolKeys.filter((k) => baseBooleans[k] !== preview.result[k]).length
        : boolKeys.length
      return (
        <span className="ml-2">• {changed} field{changed === 1 ? "" : "s"} {baseUserId ? "will change (vs base)" : "in stack"}</span>
      )
    } catch {
      return null
    }
  }, [preview, baseUserId, baseBooleans])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] w-[96vw] max-w-none rounded-none border border-line bg-background text-ink shadow-2xl">
        <DialogHeader className="sticky top-0 z-10 border-b border-line bg-background/95 px-2 py-3 backdrop-blur">
          <DialogTitle className="font-serif text-2xl tracking-tight text-ink">Apply Templates</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="mx-2 mt-2 rounded-none border border-line bg-[hsl(var(--muted))]">
            <AlertDescription className="text-ink">{error}</AlertDescription>
          </Alert>
        )}

        <div className="h-[calc(92vh-100px)] overflow-hidden p-2">
          <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="rounded-md border border-line bg-paper shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-ink">Choose & Order</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-auto">
                <TemplatePicker available={allTemplates} value={selected} onChange={setSelected} />
                <div className="mt-3 flex items-center gap-3">
                  <Checkbox checked={dryRun} onCheckedChange={(v) => setDryRun(v === true)} className="rounded-none" />
                  <span className="text-base text-[hsl(var(--muted-foreground))]">Dry run</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto rounded-none border-line text-ink shadow-sm hover:bg-[hsl(var(--muted))]"
                    onClick={runPreview}
                    disabled={selected.length === 0 || loading}
                  >
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                </div>
                {/* Presets (local) */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Save current stack as…"
                      className="h-10 w-72 rounded-sm border border-line bg-paper px-3 text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none border-line text-ink shadow-sm hover:bg-[hsl(var(--muted-foreground))]"
                      onClick={savePreset}
                      disabled={!presetName.trim() || selected.length === 0}
                    >
                      Save Stack
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none border-line text-ink shadow-sm hover:bg-[hsl(var(--muted-foreground))]"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(JSON.stringify(presets, null, 2))
                          toast({ title: "Stacks exported", description: "Copied presets JSON to clipboard." })
                        } catch {}
                      }}
                    >
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none border-line text-ink shadow-sm hover:bg-[hsl(var(--muted-foreground))]"
                      onClick={async () => {
                        const raw = window.prompt("Paste presets JSON:")
                        if (!raw) return
                        try {
                          const arr = JSON.parse(raw)
                          if (Array.isArray(arr)) {
                            setPresets(arr)
                            try { localStorage.setItem("template_stacks", JSON.stringify(arr)) } catch {}
                            toast({ title: "Stacks imported", description: `${arr.length} preset(s) loaded.` })
                          }
                        } catch {
                          toast({ title: "Import failed", description: "Invalid JSON.", variant: "destructive" as any })
                        }
                      }}
                    >
                      Import
                    </Button>
                  </div>
                  {presets.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {presets.map((p) => (
                        <div key={p.name} className="flex items-center gap-1">
                          <Button size="sm" variant="outline" className="rounded-none border-line text-ink shadow-sm" onClick={() => loadPreset(p.name)} title={`Load ${p.name}`}>
                            {p.name}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 rounded-none" onClick={() => deletePreset(p.name)} aria-label={`Delete ${p.name}`}>
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Compare user */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={compareUserId}
                    onChange={(e) => setCompareUserId(e.target.value)}
                    placeholder="Compare with userId (optional)"
                    className="h-10 w-80 rounded-sm border border-line bg-paper px-3 text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border border-line bg-paper shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-ink">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
                    <Loader2 className="h-5 w-5 animate-spin" /> <span className="text-base">Loading…</span>
                  </div>
                ) : !preview ? (
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Run a preview to see effective values and sources.</div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {preview.conflicts && preview.conflicts.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Alert className="rounded-none border border-line bg-[hsl(var(--muted))] shadow-sm">
                            <AlertDescription className="text-ink">Conflicts in {preview.conflicts.length} field(s). Later templates win.</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="max-h-[56vh] overflow-auto rounded-none border border-line">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-paper">
                          <tr className="border-b border-line text-left">
                            <th className="px-3 py-2">Field</th>
                            <th className="px-3 py-2">Base</th>
                            {previewCompare && <th className="px-3 py-2">Compare</th>}
                            <th className="px-3 py-2">Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(preview.result)
                            .filter((k) => NEWSLETTER_KEYS.includes(k as any))
                            .slice(0, 200)
                            .map((k) => {
                              const vA = (preview.result as any)[k]
                              const vB = (previewCompare?.result as any)?.[k]
                              const src = preview.sources[k] || []
                              const differs = !!previewCompare && vA !== vB
                              return (
                                <motion.tr
                                  key={k}
                                  className={`border-b border-line/50 ${differs ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}`}
                                  initial={differs ? ({ backgroundColor: "rgba(250,204,21,0.45)" } as any) : undefined}
                                  animate={differs ? { backgroundColor: "rgba(250,204,21,0.12)" } : {}}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                  <td className="px-3 py-1 capitalize text-[hsl(var(--muted-foreground))]">{k.replace(/-/g, " ")}</td>
                                  <td className="px-3 py-1">{vA === true ? "✓" : vA === false ? "✗" : String(vA)}</td>
                                  {previewCompare && (
                                    <td className="px-3 py-1">{vB === true ? "✓" : vB === false ? "✗" : String(vB ?? "—")}</td>
                                  )}
                                  <td className="px-3 py-1">
                                    <div className="flex items-center gap-2">
                                      <motion.span
                                        key={`src-${k}-${src.join("+")}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, scale: [1, 1.04, 1] }}
                                        transition={{ duration: 0.25 }}
                                      >
                                        {src.length ? src.join(" + ") : "—"}
                                      </motion.span>
                                      {!!src.length && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Crown className="h-3.5 w-3.5 text-ink/80" aria-label={`Winner: ${src[src.length - 1]}`} />
                                            </TooltipTrigger>
                                            <TooltipContent className="rounded-none border-line bg-paper text-ink">Winner: {src[src.length - 1]}</TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </td>
                                </motion.tr>
                              )
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary line */}
        {preview && (
          <div className="mt-3 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
            <div>
              {Array.isArray(target?.ids) && target.ids.length > 0 && (
                <span>
                  {target.ids.length} {target.type === "group" ? "group(s)" : "user(s)"}
                </span>
              )}
              {changedSummary}
            </div>
          </div>
        )}

        <div className="mt-2 flex justify-end gap-3 border-t border-line px-2 pt-3">
          <Button
            variant="outline"
            className="h-10 rounded-none border-line px-4 text-base text-ink hover:bg-[hsl(var(--muted))]"
            onClick={copyShareLink}
            disabled={selected.length === 0}
          >
            Copy Link
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-none border-line px-4 text-base text-ink hover:bg-[hsl(var(--muted))]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            onClick={apply}
            disabled={selected.length === 0 || loading}
            className="h-10 rounded-none bg-ink px-5 text-base text-paper shadow hover:bg-ink/90"
          >
            <Play className="mr-2 h-5 w-5" /> {dryRun ? "Run Dry Apply" : "Apply"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
