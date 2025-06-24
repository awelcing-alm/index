import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  TrendingUp,
  Calendar,
  Crown,
  User,
  AlertTriangle,
} from "lucide-react"
import { getUsersForCurrentAccount, getProductsForCurrentAccount, getCurrentUser } from "@/lib/auth-actions"

export async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user?.activeAccount) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="border-yellow-500/50 bg-yellow-500/10 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400">No active account selected</AlertDescription>
        </Alert>
      </div>
    )
  }

  let users: any[] = []
  let products: any[] = []
  let templates: any[] = []
  let usersError: string | null = null
  let productsError: string | null = null

  try {
    users = await getUsersForCurrentAccount()
  } catch (err) {
    console.error("Error loading users:", err)
    usersError = err instanceof Error ? err.message : "Failed to load users"
  }

  try {
    products = await getProductsForCurrentAccount()
  } catch (err) {
    console.error("Error loading products:", err)
    productsError = err instanceof Error ? err.message : "Failed to load products"
  }

  // Load templates from localStorage (client-side data)
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("zephr-templates")
    if (saved) {
      templates = JSON.parse(saved)
    }
  }

  // Calculate statistics
  const totalUsers = users.length
  const ownerUsers = users.filter((u) => u.user_type === "owner").length
  const regularUsers = totalUsers - ownerUsers
  const activeProducts = products.filter((p) => p.expiry_state === "active").length
  const totalProducts = products.length
  const totalTemplates = templates.length

  // Recent activity (mock data for now)
  const recentActivity = [
    { type: "user", action: "User added", details: "New user joined the account", time: "2 hours ago" },
    { type: "product", action: "Product assigned", details: "Compass assigned to 3 users", time: "1 day ago" },
    { type: "template", action: "Template created", details: "Legal Professional template", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8" />
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Overview for <span className="text-purple-300">{user.activeAccount.name}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{usersError ? "Error" : totalUsers}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-300 text-xs">
                {ownerUsers} owners
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 text-blue-300 text-xs">
                {regularUsers} users
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Products</CardTitle>
            <Package className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{productsError ? "Error" : totalProducts}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="border-green-500/50 text-green-300 text-xs">
                {activeProducts} active
              </Badge>
              <Badge variant="outline" className="border-gray-500/50 text-gray-400 text-xs">
                {totalProducts - activeProducts} inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Templates</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTemplates}</div>
            <p className="text-xs text-gray-400 mt-2">
              {totalTemplates === 0 ? "No templates created" : "Ready for bulk operations"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Account Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">Good</div>
            <p className="text-xs text-gray-400 mt-2">
              {usersError || productsError ? "Some issues detected" : "All systems operational"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Overview */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersError ? (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{usersError}</AlertDescription>
              </Alert>
            ) : users.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => {
                  const displayName =
                    user.attributes?.firstname && user.attributes?.lastname
                      ? `${user.attributes.firstname} ${user.attributes.lastname}`
                      : user.identifiers.email_address.split("@")[0]

                  return (
                    <div key={user.user_id} className="flex items-center justify-between p-2 rounded bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                          {user.user_type === "owner" ? (
                            <Crown className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <User className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{displayName}</p>
                          <p className="text-gray-400 text-xs">{user.identifiers.email_address}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          user.user_type === "owner"
                            ? "border-yellow-500/50 text-yellow-300"
                            : "border-blue-500/50 text-blue-300"
                        }
                      >
                        {user.user_type}
                      </Badge>
                    </div>
                  )
                })}
                {users.length > 5 && (
                  <p className="text-gray-400 text-sm text-center">And {users.length - 5} more users...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Overview */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsError ? (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{productsError}</AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No products found</p>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((product, index) => (
                  <div
                    key={`${product.grantId}-${index}`}
                    className="flex items-center justify-between p-2 rounded bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{product.label}</p>
                        <p className="text-gray-400 text-xs">ID: {product.id}</p>
                        {product.entitlement && (
                          <p className="text-gray-500 text-xs">
                            {product.entitlement.type}: {product.entitlement.id}
                          </p>
                        )}
                        <p className="text-purple-400 text-xs">Grant: {product.grantId}</p>
                      </div>
                    </div>
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
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-gray-400 text-sm text-center">And {products.length - 5} more products...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Templates and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates Overview */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No templates created yet</p>
            ) : (
              <div className="space-y-3">
                {templates.slice(0, 3).map((template: any) => (
                  <div key={template.id} className="p-2 rounded bg-white/5">
                    <p className="text-white text-sm font-medium">{template.name}</p>
                    <p className="text-gray-400 text-xs">{template.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                        {Object.values(template.attributes).filter(Boolean).length} attributes
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/50 text-blue-300 text-xs">
                        {Object.values(template.products).filter(Boolean).length} products
                      </Badge>
                    </div>
                  </div>
                ))}
                {templates.length > 3 && (
                  <p className="text-gray-400 text-sm text-center">And {templates.length - 3} more templates...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded bg-white/5">
                  <div className="h-6 w-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-0.5">
                    {activity.type === "user" && <Users className="h-3 w-3 text-blue-400" />}
                    {activity.type === "product" && <Package className="h-3 w-3 text-green-400" />}
                    {activity.type === "template" && <FileText className="h-3 w-3 text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.details}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
