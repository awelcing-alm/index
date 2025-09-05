"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Info, FileSpreadsheet, XCircle, CheckCircle2 } from "lucide-react"
import type { AccountRef } from "./export-users-button"

type IncludeFlags = {
  products: boolean
  group: boolean
  template: boolean
  newsletters: boolean
  demographics: boolean
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeAccount?: AccountRef
}

export function ExportUsersModal({ open, onOpenChange, activeAccount }: Props) {
  const accountId = activeAccount ? String(activeAccount.account_id) : ""

  const [include, setInclude] = React.useState<IncludeFlags>({
    products: true,
    group: true,
    template: false,
    newsletters: true,
    demographics: true,
  })

  const [isExporting, setIsExporting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [doneMsg, setDoneMsg] = React.useState<string | null>(null)

  // select/deselect all
  const allChecked = Object.values(include).every(Boolean)
  const someChecked = !allChecked && Object.values(include).some(Boolean)
  const toggleAll = (checked: boolean) =>
    setInclude({ products: checked, group: checked, template: checked, newsletters: checked, demographics: checked })

  const toggle = (key: keyof IncludeFlags) =>
    setInclude(prev => ({ ...prev, [key]: !prev[key] }))

  const selectedSummary = Object.entries(include)
    .filter(([, v]) => v)
    .map(([k]) => k[0].toUpperCase() + k.slice(1))
    .join(", ") || "Nothing selected"

  async function runExport() {
    setErrorMsg(null)
    setDoneMsg(null)

    if (!accountId) {
      setErrorMsg("No active account selected. Choose an account and try again.")
      return
    }

    try {
      setIsExporting(true)
      setProgress(10)

      const res = await fetch("/api/export/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/csv",
        },
        body: JSON.stringify({
          accountId,
          include,
        }),
      })

      setProgress(55)

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Export failed with status ${res.status}`)
      }

      const blob = await res.blob()
      setProgress(85)

      const ts = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `users-export_${activeAccount?.name?.replace(/\s+/g, "-") ?? "account"}_${ts}.csv`

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setProgress(100)
      setDoneMsg("CSV generated and download started.")
    } catch (e: any) {
      setErrorMsg(e?.message || "Export failed. Please try again.")
      setIsExporting(false)
      setProgress(0)
      return
    } finally {
      // keep spinner visible briefly so the UI doesn’t “flash”
      setTimeout(() => setIsExporting(false), 400)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setErrorMsg(null); setDoneMsg(null); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-2xl rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Export User List</DialogTitle>
          <DialogDescription>
            Create a CSV of users for <strong>{activeAccount?.name ?? "the selected account"}</strong>. Choose what to include — the file will have clear, labeled columns. Nothing changes in your data.
          </DialogDescription>
        </DialogHeader>

        {/* what’s included */}
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded border p-3">
            <Info className="mt-0.5 h-4 w-4" aria-hidden="true" />
            <p className="text-sm">
              Products become individual columns. Demographics expand into one column per attribute. Newsletters are grouped in a single cell.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* tri-state “select all” */}
              <Checkbox
                checked={allChecked ? true : (someChecked ? "indeterminate" : false)}
                onCheckedChange={(v) => toggleAll(v === true)}
                id="selectAll"
              />
              <Label htmlFor="selectAll">Select all</Label>
            </div>
            <div className="text-xs text-muted-foreground">
              Selected: <span className="font-medium">{selectedSummary}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 rounded border p-3">
              <Checkbox id="incProducts" checked={include.products} onCheckedChange={() => toggle("products")} />
              <div>
                <Label htmlFor="incProducts">Products</Label>
                <p className="text-xs text-muted-foreground">One column per product</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded border p-3">
              <Checkbox id="incGroup" checked={include.group} onCheckedChange={() => toggle("group")} />
              <div>
                <Label htmlFor="incGroup">Group</Label>
                <p className="text-xs text-muted-foreground">User’s primary group name</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded border p-3">
              <Checkbox id="incTemplate" checked={include.template} onCheckedChange={() => toggle("template")} />
              <div>
                <Label htmlFor="incTemplate">Template</Label>
                <p className="text-xs text-muted-foreground">Defaults used for user creation</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded border p-3">
              <Checkbox id="incNews" checked={include.newsletters} onCheckedChange={() => toggle("newsletters")} />
              <div>
                <Label htmlFor="incNews">Newsletters</Label>
                <p className="text-xs text-muted-foreground">Combined in one cell</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded border p-3 md:col-span-2">
              <Checkbox id="incDemo" checked={include.demographics} onCheckedChange={() => toggle("demographics")} />
              <div>
                <Label htmlFor="incDemo">Demographics</Label>
                <p className="text-xs text-muted-foreground">One column per attribute</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* live status */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">Generating CSV…</span>
                </div>
                <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="rounded-none" />
            </div>
          )}

          {errorMsg && (
            <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/5 p-3 text-destructive">
              <XCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {doneMsg && (
            <div className="flex items-start gap-2 rounded border border-green-500/40 bg-green-500/5 p-3 text-green-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <p className="text-sm">{doneMsg}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            CSV download will start automatically. Keep this window open until it does.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button
              onClick={runExport}
              disabled={!accountId || isExporting || !Object.values(include).some(Boolean)}
              className="bg-ink text-paper hover:bg-ink/90"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
              Export CSV
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
