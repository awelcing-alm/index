// app/api/groups/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withRls } from "@/lib/rls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type GroupRow = {
  id: string;
  account_id: string;
  slug: string;
  name: string;
  icon: string | null;
  color: string | null;
  demographics: unknown;
  default_template_id: string | null;
  user_count?: number | null;
  created_at: Date;
  updated_at: Date;
};

export async function GET(req: NextRequest) {
  try {
    return await withRls(req, async (db) => {
      // 1) Fetch groups (RLS will scope by account automatically)
      const groups = (await db.groups.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          account_id: true,
          slug: true,
          name: true,
          icon: true,
          color: true,
          demographics: true,
          default_template_id: true,
          user_count: true,
          created_at: true,
          updated_at: true,
        },
      })) as GroupRow[];

      // 2) Build a fallback membership count map if needed
      const ids = groups.map((g: GroupRow) => g.id);
      const countMap = new Map<string, number>();

      if (ids.length) {
        const counts = (await db.group_memberships.groupBy({
          by: ["group_id"],
          where: { group_id: { in: ids } },
          _count: { group_id: true },
        })) as Array<{ group_id: string; _count: { group_id: number } }>;

        for (const c of counts) {
          countMap.set(c.group_id, Number(c._count.group_id));
        }
      }

      // 3) Shape for UI; ensure demographics is an object and user_count is populated
      const results = groups.map((g: GroupRow) => ({
        ...g,
        demographics: (g.demographics ?? {}) as Record<string, unknown>,
        user_count:
          typeof g.user_count === "number" ? g.user_count : countMap.get(g.id) ?? 0,
      }));

      return NextResponse.json({ results });
    });
  } catch (err: any) {
    const msg = err?.message || "Failed";
    const code = msg.includes("No active account") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "GET, OPTIONS" },
  });
}
