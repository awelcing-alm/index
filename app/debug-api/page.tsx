import { testApiCredentials, getCurrentUser } from "@/lib/zephr-api"
import { adminApiCall } from "@/lib/zephr-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function testSpecificEndpoints() {
  const user = await getCurrentUser()
  const results: any = {}

  if (user?.activeAccount) {
    const accountId = user.activeAccount.account_id

    // Test different endpoints
    const tests = [
      { name: "Basic accounts", endpoint: "/v3/accounts?page=1&rpp=1" },
      { name: "Account users", endpoint: `/v3/accounts/${accountId}/users` },
      { name: "Account grants", endpoint: `/v3/accounts/${accountId}/grants` },
      { name: "General users", endpoint: "/v3/users?page=1&rpp=1" },
    ]

    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name}`)
        const result = await adminApiCall(test.endpoint)
        results[test.name] = { success: true, data: result }
      } catch (error) {
        results[test.name] = {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }
  }

  return results
}

export default async function DebugApiPage() {
  const user = await getCurrentUser()
  const basicTest = await testApiCredentials()
  const endpointTests = await testSpecificEndpoints()

  return (
    <div className="min-h-screen bg-[#0B0B1A] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-black/40 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">API Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-white">
              <h3 className="font-semibold mb-2">Current User Info:</h3>
              <div className="bg-gray-800 p-4 rounded text-sm font-mono">
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
            </div>

            <div className="text-white">
              <h3 className="font-semibold mb-2">Basic API Test:</h3>
              <div
                className={`p-4 rounded ${basicTest.success ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
              >
                {basicTest.success ? (
                  <div>
                    <p className="text-green-400 font-semibold">✅ Basic API Test Successful</p>
                    <pre className="text-sm mt-2 text-gray-300 max-h-40 overflow-auto">
                      {JSON.stringify(basicTest.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-400 font-semibold">❌ Basic API Test Failed</p>
                    <p className="text-red-300 mt-2">{basicTest.error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-white">
              <h3 className="font-semibold mb-2">Endpoint Tests:</h3>
              <div className="space-y-4">
                {Object.entries(endpointTests).map(([testName, result]: [string, any]) => (
                  <div
                    key={testName}
                    className={`p-4 rounded ${result.success ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
                  >
                    <h4 className="font-semibold mb-2">
                      {result.success ? "✅" : "❌"} {testName}
                    </h4>
                    {result.success ? (
                      <pre className="text-sm text-gray-300 max-h-32 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-red-300 text-sm">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <a href="/">Back to Users</a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href="/test-api">Basic API Test</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
