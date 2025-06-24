import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Package, AlertTriangle, Info } from "lucide-react"
import { getProductsForCurrentAccount, getCurrentUser } from "@/lib/auth-actions"

// Helper function to format dates safely
function formatDate(dateString: string): string {
  if (!dateString || dateString === "N/A") {
    return "Not specified"
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Invalid Date"
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    return "Invalid Date"
  }
}

export async function ProductsPage() {
  const user = await getCurrentUser()
  console.log("[ProductsPage] Current user for products page:", JSON.stringify(user, null, 2))

  if (!user?.activeAccount) {
    console.log("[ProductsPage] No active account selected for user:", user?.email)
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="border-yellow-500/50 bg-yellow-500/10 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400">No active account selected</AlertDescription>
        </Alert>
      </div>
    )
  }

  let products: any[] = []
  let error: string | null = null

  try {
    console.log(
      `[ProductsPage] Fetching products for account: ${user.activeAccount.name} (${user.activeAccount.account_id})`,
    )
    products = await getProductsForCurrentAccount()
    console.log("[ProductsPage] Products received:", JSON.stringify(products, null, 2))
    console.log(`[ProductsPage] Number of products: ${products.length}`)
  } catch (err) {
    console.error("[ProductsPage] Error loading products:", err)
    error = err instanceof Error ? err.message : "Failed to load products"
  }

  return (
    <div className="grid h-full">
      <div className="">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
          <CardHeader>
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Package className="h-6 w-6" />
                Account Subscriptions
              </CardTitle>
              <p className="text-gray-400 mt-1">
                {error ? "Error loading subscriptions" : `${products.length} subscriptions found`} for{" "}
                <span className="text-purple-300">{user.activeAccount.name}</span>
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  <div>
                    <p className="font-semibold">Failed to load account subscriptions</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No subscriptions found</p>
                <p className="text-sm text-gray-500 mb-4">This account may not have any product grants assigned</p>
              </div>
            ) : (
              <>
                <Alert className="border-blue-500/50 bg-blue-500/10 mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-blue-400">
                    <p className="font-semibold">Account Subscriptions</p>
                    <p className="text-sm mt-1">
                      Showing {products.length} product grants for this account. Product details are enhanced when
                      available from the API.
                    </p>
                  </AlertDescription>
                </Alert>

                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/5">
                      <TableHead className="text-white">Product</TableHead>
                      <TableHead className="text-white">Description</TableHead>
                      <TableHead className="text-white">Grant Period</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={`${product.grantId}-${index}`} className="border-white/20 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                              <span className="font-medium text-white">{product.label}</span>
                              <p className="text-xs text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs">
                          <div className="space-y-1">
                            <p className="text-sm">{product.description || "No description available"}</p>
                            {product.entitlement && (
                              <p className="text-xs text-gray-500">
                                {product.entitlement.type}: {product.entitlement.id}
                              </p>
                            )}
                            <p className="text-xs text-purple-400">Grant: {product.grantId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <div>
                              <p className="text-green-400">Start: {formatDate(product.startTime)}</p>
                              <p className="text-red-400">End: {formatDate(product.endTime)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              product.expiry_state === "active"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : product.expiry_state === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : product.expiry_state === "unknown"
                                    ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                            }
                          >
                            {product.expiry_state}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
