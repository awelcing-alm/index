// app/(dashboard)/products/page.tsx  (or wherever your ProductsPage lives)

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Package, AlertTriangle, Info } from "lucide-react"

// KEEP: we still read the active account from zephr-api
import { getCurrentUser } from "@/lib/zephr-api"

// NEW: pull products via product-api (normalized grants)
import { getProductsByAccount } from "@/lib/product-api"

/* Helper: safe date format */
function formatDate(dateString: string): string {
  if (!dateString || dateString === "N/A") return "Not specified"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return "Invalid Date"
  }
}

/* Helper: status badge classes (subtle + on-brand) */
function statusBadgeClasses(state?: string) {
  switch (state) {
    case "active":
      return "rounded-none border border-line text-lawgreen bg-lawgreen/10 hover:bg-lawgreen/20"
    case "pending":
      return "rounded-none border border-line text-gold bg-gold/10 hover:bg-gold/20"
    case "unknown":
      return "rounded-none border border-line text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted-foreground))]/10 hover:bg-[hsl(var(--muted-foreground))]/20"
    default:
      return "rounded-none border border-line text-burgundy bg-burgundy/10 hover:bg-burgundy/20"
  }
}

export async function ProductsPage() {
  const user = await getCurrentUser()

  if (!user?.activeAccount) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Alert className="max-w-md rounded-none border border-line bg-[hsl(var(--muted))]">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-ink">No active account selected</AlertDescription>
        </Alert>
      </div>
    )
  }

  let products: any[] = []
  let error: string | null = null

  try {
    // ⬇️ Use product-api with the active account id
    products = await getProductsByAccount(user.activeAccount.account_id)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load products"
  }

  return (
    <div className="grid h-full">
      <div>
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl text-ink">
                <Package className="h-6 w-6" aria-hidden="true" />
                Account Subscriptions
              </CardTitle>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                {error ? "Error loading subscriptions" : `${products.length} subscriptions found`} for{" "}
                <span className="text-ink">{user.activeAccount.name}</span>
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {error ? (
              <Alert variant="destructive" className="rounded-none">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>
                  <p className="font-semibold">Failed to load account subscriptions</p>
                  <p className="mt-1 text-sm">{error}</p>
                </AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                <p className="mb-2 text-[hsl(var(--muted-foreground))]">No subscriptions found</p>
                <p className="mb-4 text-sm text-[hsl(var(--muted-foreground))]">
                  This account may not have any product grants assigned
                </p>
              </div>
            ) : (
              <>
                <Alert className="mb-4 rounded-none border border-line bg-[hsl(var(--muted))]">
                  <Info className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription className="text-ink">
                    <p className="font-semibold">Account Subscriptions</p>
                    <p className="mt-1 text-sm">
                      Showing {products.length} product grants for this account. Product details are enhanced when
                      available from the API.
                    </p>
                  </AlertDescription>
                </Alert>

                <Table>
                  <TableHeader>
                    <TableRow className="border-line hover:bg-[hsl(var(--muted))]">
                      <TableHead className="text-ink">Product</TableHead>
                      <TableHead className="text-ink">Description</TableHead>
                      <TableHead className="text-ink">Grant Period</TableHead>
                      <TableHead className="text-ink">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={`${product.grantId || product.id}-${index}`} className="border-line hover:bg-[hsl(var(--muted))]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-line bg-paper">
                              <Package className="h-4 w-4 text-ink" aria-hidden="true" />
                            </div>
                            <div>
                              <span className="font-medium text-ink">{product.label}</span>
                              <p className="text-xs text-[hsl(var(--muted-foreground))]">ID: {product.id}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs text-[hsl(var(--muted-foreground))]">
                          <div className="space-y-1">
                            <p className="text-sm">
                              {product.description || "No description available"}
                            </p>
                            {product.entitlement && (
                              <p className="text-xs">
                                {product.entitlement.type}: {product.entitlement.id}
                              </p>
                            )}
                            {product.grantId && <p className="text-xs">Grant: {product.grantId}</p>}
                          </div>
                        </TableCell>

                        <TableCell className="text-[hsl(var(--muted-foreground))]">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-ink" aria-hidden="true" />
                            <div>
                              <p>Start: {formatDate(product.startTime)}</p>
                              <p>End: {formatDate(product.endTime)}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={statusBadgeClasses(String(product.expiry_state || "").toLowerCase())}>
                            {product.expiry_state || "unknown"}
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
