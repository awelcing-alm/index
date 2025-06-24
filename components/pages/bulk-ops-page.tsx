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

interface BulkUserResult {
  email: string
  status: "success" | "error" | "skipped"
  message: string
  userId?: string
}

export function BulkOpsPage() {
  const [csvInput, setCsvInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<BulkUserResult[]>([])
  const [progress, setProgress] = useState(0)

  const parseEmails = (input: string): string[] => {
    // Split by common delimiters and clean up
    const emails = input
      .split(/[,;\n\r\t]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0)
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) // Basic email validation

    // Remove duplicates
    return [...new Set(emails)]
  }

  const simulateBulkUserCreation = async (emails: string[]): Promise<BulkUserResult[]> => {
    const results: BulkUserResult[] = []

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i]
      setProgress(((i + 1) / emails.length) * 100)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate different outcomes
      const random = Math.random()
      if (random < 0.8) {
        // 80% success rate
        results.push({
          email,
          status: "success",
          message: "User created and added to account successfully",
          userId: `user-${Date.now()}-${i}`,
        })
      } else if (random < 0.9) {
        // 10% already exists
        results.push({
          email,
          status: "skipped",
          message: "User already exists in account",
          userId: `existing-user-${i}`,
        })
      } else {
        // 10% error
        results.push({
          email,
          status: "error",
          message: "Failed to create user - invalid email domain",
        })
      }
    }

    return results
  }

  const handleBulkAdd = async () => {
    const emails = parseEmails(csvInput)

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
      // In a real implementation, this would call the Zephr API
      const bulkResults = await simulateBulkUserCreation(emails)
      setResults(bulkResults)
    } catch (error) {
      console.error("Bulk operation failed:", error)
      alert("Bulk operation failed. Please try again.")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const previewEmails = parseEmails(csvInput)
  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length
  const skippedCount = results.filter((r) => r.status === "skipped").length

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Layers className="h-6 w-6" />
            Bulk Operations
          </CardTitle>
          <p className="text-gray-400">Perform bulk operations on users, products, and account settings</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-400">
                <p className="font-semibold">Bulk Add Users</p>
                <p className="text-sm mt-1">
                  Paste a list of email addresses (comma, semicolon, or newline separated) to create Zephr users and add
                  them to the current account.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="csvInput" className="text-white">
                  Email Addresses
                </Label>
                <Textarea
                  id="csvInput"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Enter email addresses separated by commas, semicolons, or new lines:&#10;&#10;john.doe@example.com&#10;jane.smith@company.com&#10;admin@organization.org"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                  disabled={isProcessing}
                />
              </div>

              {previewEmails.length > 0 && (
                <div>
                  <Label className="text-white">Preview ({previewEmails.length} emails detected)</Label>
                  <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-md max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {previewEmails.slice(0, 20).map((email, index) => (
                        <Badge key={index} variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                          {email}
                        </Badge>
                      ))}
                      {previewEmails.length > 20 && (
                        <Badge variant="outline" className="border-gray-500/50 text-gray-400 text-xs">
                          +{previewEmails.length - 20} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Processing...</Label>
                    <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleBulkAdd}
                  disabled={previewEmails.length === 0 || isProcessing}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isProcessing ? "Processing..." : `Add ${previewEmails.length} Users`}
                </Button>
                {!isProcessing && (
                  <Button
                    onClick={() => {
                      setCsvInput("")
                      setResults([])
                    }}
                    variant="outline"
                    className="border-white/20 text-white"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bulk Operation Results
            </CardTitle>
            <div className="flex gap-3 mt-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{successCount} successful</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{skippedCount} skipped</Badge>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{errorCount} errors</Badge>
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
