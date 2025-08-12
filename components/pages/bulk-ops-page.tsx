// components/pages/bulk-ops-page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Layers, Upload, Users, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { ZephrAccount } from "@/lib/zephr-types"

interface BulkUserResult {
  email: string
  status: "success" | "error" | "skipped"
  message: string
  userId?: string
}

interface BulkOpsPageProps {
  activeAccount?: ZephrAccount
}

export function BulkOpsPage({ activeAccount }: BulkOpsPageProps) {
  const accountId = activeAccount?.account_id

  const [csvInput, setCsvInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<BulkUserResult[]>([])
  const [progress, setProgress] = useState(0)
  const [verifyFlag, setVerifyFlag] = useState(false)

  const parseEmails = (input: string): string[] => {
    return [
      ...new Set(
        input
          .split(/[;,\n\r\t]/)
          .map((e) => e.trim())
          .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
      ),
    ]
  }

  const handleBulkAdd = async () => {
    const emails = parseEmails(csvInput)
    if (!accountId) {
      alert("No account selected – please choose an account first.")
      return
    }
    if (emails.length === 0) {
      alert("Please enter valid email addresses")
      return
    }
    if (emails.length > 100) {
      alert("Maximum 100 emails allowed per batch")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResults([])

    try {
      const res = await fetch("/api/bulk-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails, accountId, emailVerified: verifyFlag }),
      })

      if (!res.ok) throw new Error(await res.text())
      const json = (await res.json()) as { results: BulkUserResult[] }
      setResults(json.results)
      setProgress(100)
    } catch (err) {
      console.error(err)
      alert("Bulk operation failed. Please check the console for details.")
    } finally {
      setIsProcessing(false)
    }
  }

  const previewEmails = parseEmails(csvInput)
  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length
  const skippedCount = results.filter((r) => r.status === "skipped").length

  return (
    <div className="space-y-6">
      {/* ============================ INPUT CARD ============================ */}
      <Card className="rounded-none border border-line bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-2xl text-ink">
            <Layers className="h-6 w-6" aria-hidden="true" />
            Bulk Operations
          </CardTitle>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Perform bulk operations on users for the active account.
          </p>
          {activeAccount && (
            <p className="mt-2 text-xs text-ink/70">Target account: {activeAccount.name}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* info alert */}
            <Alert className="rounded-none border border-line bg-[hsl(var(--secondary))]/20">
              <Info className="h-4 w-4 text-ink" aria-hidden="true" />
              <AlertDescription className="text-ink">
                <p className="font-medium">Bulk Add Users</p>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  Paste a list of email addresses (comma, semicolon, or newline separated) to create Zephr
                  users and add them to <strong>the currently selected account</strong>.
                </p>
              </AlertDescription>
            </Alert>

            {/* textarea */}
            <div>
              <Label htmlFor="csvInput" className="text-ink">Email Addresses</Label>
              <Textarea
                id="csvInput"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder={
                  "Enter email addresses separated by commas, semicolons, or new lines:\n\n" +
                  "john.doe@example.com\n" +
                  "jane.smith@company.com\n" +
                  "admin@organization.org"
                }
                className="min-h-[120px] rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))] focus-visible:ring-0 focus:border-ink"
                disabled={isProcessing}
              />
            </div>

            {/* email verified toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="emailVerified"
                checked={verifyFlag}
                onCheckedChange={(checked) => setVerifyFlag(checked === true)}
                disabled={isProcessing}
                className="rounded-none"
              />
              <Label htmlFor="emailVerified" className="text-ink">Mark emails as verified</Label>
            </div>

            {/* preview chips */}
            {previewEmails.length > 0 && (
              <div>
                <Label className="text-ink">
                  Preview ({previewEmails.length} emails detected)
                </Label>
                <div className="mt-2 max-h-32 overflow-y-auto rounded-none border border-line bg-paper p-3">
                  <div className="flex flex-wrap gap-1">
                    {previewEmails.slice(0, 20).map((email) => (
                      <Badge key={email} variant="outline" className="rounded-none border-line text-ink text-xs">
                        {email}
                      </Badge>
                    ))}
                    {previewEmails.length > 20 && (
                      <Badge variant="outline" className="rounded-none border-line text-[hsl(var(--muted-foreground))] text-xs">
                        +{previewEmails.length - 20} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-ink">Processing…</Label>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="w-full rounded-none" />
              </div>
            )}

            {/* actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleBulkAdd}
                disabled={previewEmails.length === 0 || isProcessing || !accountId}
                className="rounded-none bg-ink text-paper hover:bg-ink/90 disabled:opacity-60"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing…" : `Add ${previewEmails.length} Users`}
              </Button>

              {!isProcessing && (
                <Button
                  variant="outline"
                  className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
                  onClick={() => {
                    setCsvInput("")
                    setResults([])
                    setProgress(0)
                    setVerifyFlag(false)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================ RESULTS CARD ============================ */}
      {results.length > 0 && (
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ink">
              <Users className="h-5 w-5" aria-hidden="true" />
              Bulk Operation Results
            </CardTitle>
            <div className="mt-2 flex gap-3">
              <Badge className="rounded-none border border-line bg-[hsl(var(--muted))] text-ink">
                {successCount} successful
              </Badge>
              <Badge className="rounded-none border border-line bg-[hsl(var(--muted))] text-ink">
                {skippedCount} skipped
              </Badge>
              <Badge className="rounded-none border border-line bg-[hsl(var(--muted))] text-ink">
                {errorCount} errors
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={[
                    "flex items-center gap-3 rounded-none border p-2",
                    result.status === "success"
                      ? "border-line bg-[hsl(var(--secondary))]/15"
                      : result.status === "skipped"
                      ? "border-line bg-[hsl(var(--muted))]"
                      : "border-line bg-[hsl(var(--destructive))]/10",
                  ].join(" ")}
                >
                  {result.status === "success" && <CheckCircle className="h-4 w-4 text-ink" />}
                  {result.status === "skipped" && <AlertTriangle className="h-4 w-4 text-ink" />}
                  {result.status === "error" && <XCircle className="h-4 w-4 text-[hsl(var(--destructive))]" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{result.email}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{result.message}</p>
                    {result.userId && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">User ID: {result.userId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
