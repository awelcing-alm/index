import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildUsersCsv, type ExportUsersCsvOptions } from "@/lib/csv";

function loadProductLabelMap(): Record<string, string> {
  try {
    const raw = process.env.PRODUCT_LABELS_JSON;
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function ymd(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs'; 

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const includeParams = url.searchParams.getAll("include");
    const includes = new Set(includeParams.map((s) => s.toLowerCase()));

    const options: ExportUsersCsvOptions = {
      includeProducts: includes.has("products"),
      includeGroups: includes.has("group") || includes.has("groups"),
      includeTemplates: includes.has("template") || includes.has("templates"),
      includeNewsletters: includes.has("newsletters"),
      includeDemographics: includes.has("demographics"),
    };

    const externalAccountId = req.cookies.get("active_account_id")?.value;
    if (!externalAccountId) {
      return NextResponse.json({ error: "No active account" }, { status: 400 });
    }

    const account = await prisma.accounts.findFirst({
      where: { external_id: externalAccountId },
      select: { id: true, name: true },
    });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const accountId = account.id;

    const users = await prisma.users.findMany({
      where: { user_accounts: { some: { account_id: accountId } } },
      select: {
        id: true,
        external_id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        status: true,
        created_at: true,
        last_login: true,
        attributes: true,
        group_memberships: {
          where: { account_id: accountId },
          select: {
            groups: {
              select: {
                id: true,
                name: true,
                slug: true,
                default_template: true,
                product_grant_ids: true,
              },
            },
          },
        },
        user_newsletters: {
          where: { subscribed: true },
          select: { newsletters: { select: { name: true } } },
        },
      },
      orderBy: [{ lastname: "asc" }, { firstname: "asc" }],
    });

    const attrDefs = await prisma.attribute_definitions.findMany({
      select: { slug: true, label: true, input_type: true },
      orderBy: { slug: "asc" },
    });

    const csv = buildUsersCsv({
      accountName: account.name ?? "Account",
      users,
      attrDefs,
      productLabelMap: loadProductLabelMap(),
      options,
    });

    const safeName = (account.name ?? "Account").replace(/[\\/:*?"<>|]+/g, "_").trim();
    const fileName = `${safeName} Users — ${ymd()}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Export users error:", err);
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
