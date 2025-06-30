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
} from "lucide-react";
import {
  getUsersForCurrentAccount,
  getProductsForCurrentAccount,
  getCurrentUser,
} from "@/lib/auth-actions";
import { cookies } from "next/headers";
import { listTpls } from "@/lib/blob"; 

/* ---------------- helper: template names via blob ---------------- */
async function getTemplateNames(): Promise<string[]> {
  // ⬇️  add await here
  const accId = (await cookies()).get("active_account_id")?.value;
  if (!accId) return [];

  return await listTpls(accId);
}

/* ==================================================================== */
export async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.activeAccount) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="border-yellow-500/50 bg-yellow-500/10 max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-yellow-400">
            No active account selected
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /* ---------- data pulls ---------- */
  let users: any[] = [];
  let products: any[] = [];
  let templateNames: string[] = [];

  let usersError: string | null = null;
  let productsError: string | null = null;
  let tplError: string | null = null;

  try {
    users = await getUsersForCurrentAccount();
  } catch (e) {
    usersError = (e as Error).message ?? "Failed to load users";
  }

  try {
    products = await getProductsForCurrentAccount();
  } catch (e) {
    productsError = (e as Error).message ?? "Failed to load products";
  }

  try {
    templateNames = await getTemplateNames();
  } catch (e) {
    tplError = (e as Error).message ?? "Failed to load templates";
  }

  /* ---------- derived stats ---------- */
  const totalUsers = users.length;
  const ownerUsers = users.filter((u) => u.user_type === "owner").length;
  const regularUsers = totalUsers - ownerUsers;

  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.expiry_state === "active",
  ).length;

  const totalTemplates = templateNames.length;

  /* ---------- mock recent activity ---------- */
  const recentActivity = [
    {
      type: "user",
      action: "User added",
      details: "New user joined the account",
      time: "2 hours ago",
    },
    {
      type: "product",
      action: "Product assigned",
      details: "Compass assigned to 3 users",
      time: "1 day ago",
    },
    {
      type: "template",
      action: "Template created",
      details: "Legal Professional template",
      time: "2 days ago",
    },
  ];

  /* ================================================================== */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8" />
          Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Overview for{" "}
          <span className="text-purple-300">{user.activeAccount.name}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {usersError ? "Error" : totalUsers}
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

        {/* Products card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {productsError ? "Error" : totalProducts}
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

        {/* Templates card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Templates
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {tplError ? "Error" : totalTemplates}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {tplError
                ? tplError
                : totalTemplates === 0
                ? "No templates created"
                : "Custom Templates Available"}
            </p>
          </CardContent>
        </Card>

        {/* Health card */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Account Health
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {usersError || productsError || tplError ? "Warning" : "Good"}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {usersError || productsError || tplError
                ? "Some issues detected"
                : "All systems operational"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users & Products overviews remain unchanged … */}
      {/* Templates Overview card: */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tplError ? (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">
                  {tplError}
                </AlertDescription>
              </Alert>
            ) : totalTemplates === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No templates created yet
              </p>
            ) : (
              <div className="space-y-3">
                {templateNames.slice(0, 3).map((name) => (
                  <div
                    key={name}
                    className="p-2 rounded bg-white/5 flex items-center justify-between"
                  >
                    <p className="text-white text-sm font-medium">{name}</p>
                    <Badge
                      variant="outline"
                      className="border-purple-500/50 text-purple-300 text-xs"
                    >
                      Custom
                    </Badge>
                  </div>
                ))}
                {totalTemplates > 3 && (
                  <p className="text-gray-400 text-sm text-center">
                    And {totalTemplates - 3} more templates…
                  </p>
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
  );
}