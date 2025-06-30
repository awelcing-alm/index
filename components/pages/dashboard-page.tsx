import { cookies } from "next/headers"
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
  getCurrentUser,
  getUsersForCurrentAccount,
  getProductsForCurrentAccount,
} from "@/lib/auth-actions"

import { listTplsWithMeta, loadTpl } from "@/lib/blob"
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults"

/* ---------- small util ---------- */
function takeRecent<T extends { ts: number }>(arr: T[], n = 10) {
  return arr.sort((a, b) => b.ts - a.ts).slice(0, n)
}

export async function DashboardPage() {
  /* ---------- who / where ---------- */
  const session = await getCurrentUser()
  const acct = session?.activeAccount
  if (!acct) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="border-yellow-500/50 bg-yellow-500/10 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400">
            No active account selected
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  /* ---------- users / products ---------- */
  let users: any[] = []
  let products: any[] = []
  let usersError: string | null = null
  let productsError: string | null = null

  const [usersRes, productsRes] = await Promise.allSettled([
    getUsersForCurrentAccount(),
    getProductsForCurrentAccount(),
  ])

  if (usersRes.status === "fulfilled") users = usersRes.value
  else usersError = usersRes.reason?.message ?? "Failed to load users"

  if (productsRes.status === "fulfilled") products = productsRes.value
  else productsError =
    productsRes.reason?.message ?? "Failed to load products"

  /* ---------- templates (defaults + custom blobs) ---------- */
  const cookieStore = await cookies()
  const accountId = cookieStore.get("active_account_id")?.value

  let customTemplates: any[] = []
  let templateErr: string | null = null

  try {
    if (accountId) {
      const metas = await listTplsWithMeta(accountId) // [{ name, uploadedAt }]
      const blobs = await Promise.all(
        metas.map((m) => loadTpl(accountId, m.name)),
      )
      customTemplates = blobs.filter(Boolean)
    }
  } catch (e: any) {
    templateErr = "Failed to load templates"
  }

  const templates = [...DEFAULT_TEMPLATES, ...customTemplates]

  /* ---------- derived counts ---------- */
  const totalUsers = users.length
  const ownerUsers = users.filter((u) => u.user_type === "owner").length
  const regularUsers = totalUsers - ownerUsers

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.expiry_state === "active")
    .length

  /* ---------- recent activity feed ---------- */
  const recentUsers = users
    .filter((u) => u.created_date)
    .map((u) => ({
      type: "user" as const,
      primary: u.identifiers?.email_address,
      secondary: "User created",
      ts: new Date(u.created_date).getTime(),
    }))

  const recentProducts = products
    .filter((p) => p.created_date)
    .map((p) => ({
      type: "product" as const,
      primary: p.label,
      secondary: "Product grant",
      ts: new Date(p.created_date).getTime(),
    }))

  const recentTemplates = templates.map((t) => ({
    type: "template" as const,
    primary: t.name,
    secondary: "Template saved",
    ts: new Date(t.createdAt || t.uploadedAt || 0).getTime(),
  }))

  const recentFeed = takeRecent(
    [...recentUsers, ...recentProducts, ...recentTemplates],
    10,
  )

  /* ---------- render ---------- */
  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8" />
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Overview for{" "}
          <span className="text-purple-300">{acct.name}</span>
        </p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* users card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usersError ? "—" : totalUsers}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="border-yellow-500/50 text-yellow-300 text-xs"
              >
                {ownerUsers} owners
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-500/50 text-blue-300 text-xs"
              >
                {regularUsers} users
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* products card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {productsError ? "—" : totalProducts}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="border-green-500/50 text-green-300 text-xs"
              >
                {activeProducts} active
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-500/50 text-gray-400 text-xs"
              >
                {totalProducts - activeProducts} inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* templates card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Templates
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {templateErr ? "—" : templates.length}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {templates.length === 0
                ? "No templates yet"
                : "Ready for bulk operations"}
            </p>
          </CardContent>
        </Card>

        {/* health card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Account Health
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">Good</div>
            <p className="text-xs text-gray-400 mt-2">
              {(usersError || productsError) ? "Some issues detected" : "All systems operational"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* products overview list (first 5) */}
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
                <AlertDescription className="text-red-400">
                  {productsError}
                </AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No products found
              </p>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {p.label}
                        </p>
                        <p className="text-gray-400 text-xs">ID: {p.id}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        p.expiry_state === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }
                    >
                      {p.expiry_state}
                    </Badge>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-gray-400 text-sm text-center">
                    And {products.length - 5} more products…
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* templates overview list (first 3) */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {templateErr ? (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  {templateErr}
                </AlertDescription>
              </Alert>
            ) : templates.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No templates available
              </p>
            ) : (
              <div className="space-y-3">
                {templates.slice(0, 5).map((t) => (
                  <div
                    key={t.name}
                    className="p-2 rounded bg-white/5 flex flex-col gap-1"
                  >
                    <p className="text-white text-sm font-medium capitalize">
                      {t.name}
                    </p>
                    {t.description && (
                      <p className="text-gray-400 text-xs">{t.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-300 text-xs"
                      >
                        {
                          Object.values(t.attributes || {}).filter(
                            Boolean,
                          ).length
                        }{" "}
                        attrs
                      </Badge>
                    </div>
                  </div>
                ))}
                {templates.length > 5 && (
                  <p className="text-gray-400 text-sm text-center">
                    And {templates.length - 5} more templates…
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* recent activity feed */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentFeed.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {recentFeed.map((a) => (
                <div
                  key={`${a.type}-${a.ts}-${a.primary}`}
                  className="flex items-start gap-3 p-2 rounded bg-white/5"
                >
                  <div className="h-6 w-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-0.5">
                    {a.type === "user" && (
                      <Users className="h-3 w-3 text-blue-400" />
                    )}
                    {a.type === "product" && (
                      <Package className="h-3 w-3 text-green-400" />
                    )}
                    {a.type === "template" && (
                      <FileText className="h-3 w-3 text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {a.secondary}
                    </p>
                    <p className="text-gray-400 text-xs">{a.primary}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(a.ts).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
