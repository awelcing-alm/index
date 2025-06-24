import { testApiCredentials } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TestApiPage() {
  const adminTestResult = await testApiCredentials()

  return (
    <div className="min-h-screen bg-[#0B0B1A] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-black/40 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">API Credentials Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-white">
              <h3 className="font-semibold mb-2">Environment Variables:</h3>
              <div className="bg-gray-800 p-4 rounded text-sm font-mono">
                <p>ZEPHR_BASE_URL: {process.env.ZEPHR_BASE_URL || "Not set"}</p>
                <p>ZEPHR_PUBLIC_BASE_URL: {process.env.ZEPHR_PUBLIC_BASE_URL || "Not set"}</p>
                <p>
                  ZEPHR_ACCESS_KEY:{" "}
                  {process.env.ZEPHR_ACCESS_KEY ? `${process.env.ZEPHR_ACCESS_KEY.substring(0, 8)}...` : "Not set"}
                </p>
                <p>ZEPHR_SECRET_KEY: {process.env.ZEPHR_SECRET_KEY ? "Set (hidden)" : "Not set"}</p>
              </div>
            </div>

            <div className="text-white">
              <h3 className="font-semibold mb-2">Admin API Test Result:</h3>
              <div
                className={`p-4 rounded ${adminTestResult.success ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
              >
                {adminTestResult.success ? (
                  <div>
                    <p className="text-green-400 font-semibold">✅ Admin API Test Successful</p>
                    <pre className="text-sm mt-2 text-gray-300 max-h-40 overflow-auto">
                      {JSON.stringify(adminTestResult.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-400 font-semibold">❌ Admin API Test Failed</p>
                    <p className="text-red-300 mt-2">{adminTestResult.error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <a href="/login">Back to Login</a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href="/test-public-api">Test Public API</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
