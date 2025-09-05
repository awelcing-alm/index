"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { testPublicApi } from "@/lib/zephr-api"

export default function TestPublicApiPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    if (!email || !password) return

    setIsLoading(true)
    try {
      const testResult = await testPublicApi(email, password)
      setResult(testResult)
    } catch (error) {
      setResult({ success: false, error: "Test failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B1A] p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Public API Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter test email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter test password"
              />
            </div>

            <Button
              onClick={handleTest}
              disabled={isLoading || !email || !password}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Testing..." : "Test Public API Login"}
            </Button>

            {result && (
              <div className="text-white">
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <div
                  className={`p-4 rounded ${result.success ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
                >
                  {result.success ? (
                    <div>
                      <p className="text-green-400 font-semibold">✅ Public API Test Successful</p>
                      <pre className="text-sm mt-2 text-gray-300 max-h-60 overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-400 font-semibold">❌ Public API Test Failed</p>
                      <p className="text-red-300 mt-2">{result.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <a href="/test-api">Back to API Tests</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
