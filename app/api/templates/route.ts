import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyRlsFromRequest } from "@/lib/rls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await applyRlsFromRequest(req);

    const zephrAccountId = req.cookies.get("active_account_id")?.value;
    if (!zephrAccountId) {
      return NextResponse.json({ error: "No active account" }, { status: 401 });
    }

    const account = await prisma.accounts.findFirst({
      where: { external_id: zephrAccountId },
      select: { id: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const results = await prisma.templates.findMany({
      where: { account_id: account.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        account_id: true,
        name: true,
        description: true,
        attributes: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("Templates GET error:", err);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "GET, OPTIONS" } });
}
