import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyRlsFromRequest } from "@/lib/rls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteCtx = { params: { name: string } };

async function requireAccountId(req: NextRequest) {
  const zephrAccountId = req.cookies.get("active_account_id")?.value;
  if (!zephrAccountId) throw new Error("No active account");

  const account = await prisma.accounts.findFirst({
    where: { external_id: zephrAccountId },
    select: { id: true },
  });
  if (!account) throw new Error("Account not found");

  return account.id;
}

/* GET /api/templates/:name */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  try {
    await applyRlsFromRequest(req);
    const { name } = (await ctx).params;

    const accountId = await requireAccountId(req);

    const tpl = await prisma.templates.findFirst({
      where: { account_id: accountId, name },
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

    if (!tpl) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tpl);
  } catch (err: any) {
    const msg = err?.message ?? "Failed";
    const code =
      msg === "No active account" ? 401 : msg === "Account not found" ? 404 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

/* PUT /api/templates/:name (create/update) */
export async function PUT(req: NextRequest, ctx: RouteCtx) {
  try {
    await applyRlsFromRequest(req);
    const { name } = (await ctx).params;

    const accountId = await requireAccountId(req);
    const body = await req.json().catch(() => ({}));
    const { description = null, attributes = {} } = body ?? {};

    const existing = await prisma.templates.findFirst({
      where: { account_id: accountId, name },
      select: { id: true },
    });

    const saved = existing
      ? await prisma.templates.update({
          where: { id: existing.id },
          data: { description, attributes, updated_at: new Date() },
          select: {
            id: true,
            account_id: true,
            name: true,
            description: true,
            attributes: true,
            created_at: true,
            updated_at: true,
          },
        })
      : await prisma.templates.create({
          data: { account_id: accountId, name, description, attributes },
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

    return NextResponse.json(saved);
  } catch (err: any) {
    const msg = err?.message ?? "Failed";
    const code =
      msg === "No active account" ? 401 : msg === "Account not found" ? 404 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

/* DELETE /api/templates/:name */
export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  try {
    await applyRlsFromRequest(req);
    const { name } = (await ctx).params;

    const accountId = await requireAccountId(req);

    const hit = await prisma.templates.findFirst({
      where: { account_id: accountId, name },
      select: { id: true },
    });
    if (!hit) return NextResponse.json({ ok: true });

    await prisma.templates.delete({ where: { id: hit.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err?.message ?? "Failed";
    const code =
      msg === "No active account" ? 401 : msg === "Account not found" ? 404 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "GET, PUT, DELETE, OPTIONS" },
  });
}
