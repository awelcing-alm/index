"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Layers,
  Upload,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { ZephrAccount } from "@/lib/zephr-api"

/**
 * BulkOpsPage – create many users then attach each to the selected account.
 * Pass the currently active account as a prop – see AccountSwitcher.
 */

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

  /* ------------------------------ helpers ------------------------------ */
  const parseEmails = (input: string): string[] => {
    return [...new Set(
      input
        .split(/[;,\n\r\t]/)
        .map((e) => e.trim())
        .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
    )]
  }

  /* --------------------------- main action --------------------------- */
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

  /* ----------------------------- derived ----------------------------- */
  const previewEmails = parseEmails(csvInput)
  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length
  const skippedCount = results.filter((r) => r.status === "skipped").length

  /* ------------------------------ render ------------------------------ */
  return (
    <div className="space-y-6">
      {/* ============================ INPUT CARD ============================ */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Layers className="h-6 w-6" />
            Bulk Operations
          </CardTitle>
          <p className="text-gray-400">
            Perform bulk operations on users for the active account.
          </p>
          {activeAccount && (
            <p className="text-sm text-purple-300 mt-2">
              Target account: {activeAccount.name}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* ---------------- info alert ---------------- */}
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-400">
                <p className="font-semibold">Bulk Add Users</p>
                <p className="text-sm mt-1">
                  Paste a list of email addresses (comma, semicolon, or newline
                  separated) to create Zephr users and add them to <strong>the
                  currently selected account</strong>.
                </p>
              </AlertDescription>
            </Alert>

            {/* ---------------- text area ---------------- */}
            <div>
              <Label htmlFor="csvInput" className="text-white">
                Email Addresses
              </Label>
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
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                disabled={isProcessing}
              />
            </div>

            {/* ---------------- email verified toggle ---------------- */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailVerified"
                checked={verifyFlag}
                onCheckedChange={(checked) => setVerifyFlag(checked === true)}
                disabled={isProcessing}
              />
              <Label htmlFor="emailVerified" className="text-white">
                Mark emails as verified
              </Label>
            </div>

            {/* ---------------- preview chips ---------------- */}
            {previewEmails.length > 0 && (
              <div>
                <Label className="text-white">
                  Preview ({previewEmails.length} emails detected)
                </Label>
                <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-md max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {previewEmails.slice(0, 20).map((email) => (
                      <Badge
                        key={email}
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 text-xs"
                      >
                        {email}
                      </Badge>
                    ))}
                    {previewEmails.length > 20 && (
                      <Badge
                        variant="outline"
                        className="border-gray-500/50 text-gray-400 text-xs"
                      >
                        +{previewEmails.length - 20} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- progress bar ---------------- */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Processing…</Label>
                  <span className="text-sm text-gray-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* ---------------- action buttons ---------------- */}
            <div className="flex gap-3">
              <Button
                onClick={handleBulkAdd}
                disabled={
                  previewEmails.length === 0 || isProcessing || !accountId
                }
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing…" : `Add ${previewEmails.length} Users`}
              </Button>
              {!isProcessing && (
                <Button
                  variant="outline"
                  className="border-white/20 text-white"
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
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bulk Operation Results
            </CardTitle>
            <div className="flex gap-3 mt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {successCount} successful
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {skippedCount} skipped
              </Badge>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {errorCount} errors
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded ${
                    result.status === "success"
                      ? "bg-green-500/10 border border-green-500/20"
                      : result.status === "skipped"
                      ? "bg-yellow-500/10 border border-yellow-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {result.status === "success" && <CheckCircle className="h-4 w-4 text-green-400" />}
                  {result.status === "skipped" && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
                  {result.status === "error" && <XCircle className="h-4 w-4 text-red-400" />}
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{result.email}</p>
                    <p className="text-gray-400 text-xs">{result.message}</p>
                    {result.userId && <p className="text-gray-500 text-xs">User ID: {result.userId}</p>}
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
