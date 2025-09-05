import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SyncUsersButton from "@/components/sync-users-button";
import {
  getCurrentUser,
  getUsersForCurrentAccount,
  getProductsForCurrentAccount,
} from "@/lib/zephr-api";

import { listTplsWithMeta, loadTpl } from "@/lib/blob";
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults";

/* ---------- small util ---------- */
function takeRecent<T extends { ts: number }>(arr: T[], n = 10) {
  return arr.sort((a, b) => b.ts - a.ts).slice(0, n);
}

export async function DashboardPage() {
  /* ---------- who / where ---------- */
  const session = await getCurrentUser();
  const acct = session?.activeAccount;

  if (!acct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Alert className="max-w-md rounded-none border border-line bg-[hsl(var(--muted))]">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-ink">
            No active account selected
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const accountId = (acct as any)?.account_id ?? (acct as any)?.id ?? "";

  /* ---------- users / products ---------- */
  let users: any[] = [];
  let products: any[] = [];
  let usersError: string | null = null;
  let productsError: string | null = null;

  const [usersRes, productsRes] = await Promise.allSettled([
    getUsersForCurrentAccount(),
    getProductsForCurrentAccount(),
  ]);

  if (usersRes.status === "fulfilled") users = usersRes.value;
  else usersError = usersRes.reason?.message ?? "Failed to load users";

  if (productsRes.status === "fulfilled") products = productsRes.value;
  else productsError = productsRes.reason?.message ?? "Failed to load products";

  /* ---------- templates (defaults + custom blobs) ---------- */
  let customTemplates: any[] = [];
  let templateErr: string | null = null;

  try {
    if (accountId) {
      const metas = await listTplsWithMeta(accountId); // [{ name, uploadedAt }]
      const blobs = await Promise.all(metas.map((m) => loadTpl(accountId, m.name)));
      customTemplates = blobs.filter(Boolean);
    }
  } catch {
    templateErr = "Failed to load templates";
  }

  const templates = [...DEFAULT_TEMPLATES, ...customTemplates];

  /* ---------- derived counts ---------- */
  const totalUsers = users.length;
  const ownerUsers = users.filter((u) => u.user_type === "owner").length;
  const regularUsers = totalUsers - ownerUsers;

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.expiry_state === "active").length;

  /* ---------- recent activity feed ---------- */
  const recentUsers = users
    .filter((u) => u.created_date)
    .map((u) => ({
      type: "user" as const,
      primary: u.identifiers?.email_address,
      secondary: "User created",
      ts: new Date(u.created_date).getTime(),
    }));

  const recentProducts = products
    .filter((p) => p.created_date)
    .map((p) => ({
      type: "product" as const,
      primary: p.label,
      secondary: "Product grant",
      ts: new Date(p.created_date).getTime(),
    }));

  const recentTemplates = templates.map((t) => ({
    type: "template" as const,
    primary: t.name,
    secondary: "Template saved",
    ts: new Date((t as any).createdAt || (t as any).uploadedAt || 0).getTime(),
  }));

  const recentFeed = takeRecent(
    [...recentUsers, ...recentProducts, ...recentTemplates],
    10
  );

  /* ---------- render ---------- */
  return (
    <div className="space-y-6">
      {/* header + actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-serif text-3xl text-ink">
            <LayoutDashboard className="h-8 w-8" aria-hidden="true" />
            Dashboard
          </h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))]">
            Overview for <span className="text-ink">{acct.name}</span>
          </p>
        </div>

        {/* show sync only for admins & when we know the account */}
        {session?.isAdmin && accountId && (
          <div className="flex items-center gap-2">
            <SyncUsersButton accountId={accountId} />
          </div>
        )}
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* users card */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-ink" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">
              {usersError ? "—" : totalUsers}
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                {ownerUsers} owners
              </Badge>
              <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                {regularUsers} users
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* products card */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-ink" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">
              {productsError ? "—" : totalProducts}
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                {activeProducts} active
              </Badge>
              <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                {totalProducts - activeProducts} inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* templates card */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Templates
            </CardTitle>
            <FileText className="h-4 w-4 text-ink" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">
              {templateErr ? "—" : templates.length}
            </div>
            <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
              {templates.length === 0 ? "No templates yet" : "Ready for bulk operations"}
            </p>
          </CardContent>
        </Card>

        {/* health card */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Account Health
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-ink" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">
              {(usersError || productsError) ? "Attention" : "Good"}
            </div>
            <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
              {(usersError || productsError) ? "Some issues detected" : "All systems operational"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* products overview list (first 5) */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-ink">
              <Package className="h-5 w-5" aria-hidden="true" />
              Products Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsError ? (
              <Alert variant="destructive" className="rounded-none">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{productsError}</AlertDescription>
              </Alert>
            ) : products.length === 0 ? (
              <p className="py-4 text-center text-[hsl(var(--muted-foreground))]">No products found</p>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-none border border-line bg-paper p-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-none border border-line bg-paper">
                        <Package className="h-4 w-4 text-ink" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{p.label}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">ID: {p.id}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-none border-line text-ink"
                      title={p.expiry_state}
                    >
                      {p.expiry_state}
                    </Badge>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                    And {products.length - 5} more products…
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* templates overview list (first 5) */}
        <Card className="rounded-none border border-line bg-paper">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-ink">
              <FileText className="h-5 w-5" aria-hidden="true" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {templateErr ? (
              <Alert variant="destructive" className="rounded-none">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{templateErr}</AlertDescription>
              </Alert>
            ) : templates.length === 0 ? (
              <p className="py-4 text-center text-[hsl(var(--muted-foreground))]">
                No templates available
              </p>
            ) : (
              <div className="space-y-3">
                {templates.slice(0, 5).map((t) => (
                  <div key={t.name} className="flex flex-col gap-1 rounded-none border border-line bg-paper p-2">
                    <p className="text-sm font-medium capitalize text-ink">{t.name}</p>
                    {t.description && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{t.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Badge variant="outline" className="rounded-none border-line text-xs text-ink">
                        {Object.values((t as any).attributes || {}).filter(Boolean).length} attrs
                      </Badge>
                    </div>
                  </div>
                ))}
                {templates.length > 5 && (
                  <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                    And {templates.length - 5} more templates…
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* recent activity feed */}
      <Card className="rounded-none border border-line bg-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-ink">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentFeed.length === 0 ? (
            <p className="py-4 text-center text-[hsl(var(--muted-foreground))]">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentFeed.map((a) => (
                <div
                  key={`${a.type}-${a.ts}-${a.primary}`}
                  className="flex items-start gap-3 rounded-none border border-line bg-paper p-2"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-none border border-line bg-paper">
                    {a.type === "user" && <Users className="h-3 w-3 text-ink" aria-hidden="true" />}
                    {a.type === "product" && <Package className="h-3 w-3 text-ink" aria-hidden="true" />}
                    {a.type === "template" && <FileText className="h-3 w-3 text-ink" aria-hidden="true" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{a.secondary}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{a.primary}</p>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
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
  );
}
