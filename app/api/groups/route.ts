import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyRlsFromRequest } from "@/lib/rls";

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
};

export async function GET(req: NextRequest) {
  try {
    await applyRlsFromRequest(req);

    // 1) Fetch groups
    const groups = await prisma.groups.findMany({
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
        created_at: true,
        updated_at: true,
      },
    });

    // 2) Count memberships per group via groupBy (avoids _count typing issues)
    const ids = groups.map(g => g.id);
    const counts = ids.length
      ? await prisma.group_memberships.groupBy({
          by: ["group_id"],
          where: { group_id: { in: ids } },
          _count: { group_id: true },
        })
      : [];

    const countMap = new Map<string, number>();
    for (const c of counts) countMap.set(c.group_id as string, Number(c._count.group_id));

    // 3) Shape for UI
    const results = groups.map((g: GroupRow) => ({
      ...g,
      demographics: (g.demographics ?? {}) as Record<string, unknown>,
      user_count: countMap.get(g.id) ?? 0,
    }));

    return NextResponse.json({ results });
  } catch (err: any) {
    const msg = err?.message || "Failed";
    const code = msg.includes("No active account") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "GET, OPTIONS" } });
}
