// app/api/export/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildUsersCsv, type ExportUsersCsvOptions } from "@/lib/csv";
import { getUsersByAccount } from "@/lib/zephr-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------- shapes ---------- */
type ZephrUserBasic = {
  user_id: string;
  identifiers: { email_address: string };
  user_type?: string | null;
  attributes?: Record<string, unknown>;
};

type GroupLite = {
  id: string;
  name: string;
  slug: string;
  default_template: string | null;
  product_grant_ids: string[];
};

type RawMembershipRow = {
  user_external_id: string;
  id: string;
  name: string;
  slug: string;
  default_template: string | null;
  product_grant_ids: string[] | null;
};

type NewsletterRow = {
  user_id: number;
  newsletters: { name: string | null } | null;
};

/* ---------- helpers ---------- */
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
function parseOptionsFromSearch(url: URL): ExportUsersCsvOptions {
  const inc = new Set(url.searchParams.getAll("include").map((s) => s.toLowerCase()));
  return {
    includeProducts: inc.has("products"),
    includeGroups: inc.has("group") || inc.has("groups"),
    includeTemplates: inc.has("template") || inc.has("templates"),
    includeNewsletters: inc.has("newsletters"),
    includeDemographics: inc.has("demographics"),
  };
}
function parseOptionsFromBody(body: any): ExportUsersCsvOptions {
  if (Array.isArray(body?.includes)) {
    const inc = new Set<string>(body.includes.map((s: string) => s.toLowerCase()));
    return {
      includeProducts: inc.has("products"),
      includeGroups: inc.has("group") || inc.has("groups"),
      includeTemplates: inc.has("template") || inc.has("templates"),
      includeNewsletters: inc.has("newsletters"),
      includeDemographics: inc.has("demographics"),
    };
  }
  return {
    includeProducts: !!body?.includeProducts,
    includeGroups: !!body?.includeGroups,
    includeTemplates: !!body?.includeTemplates,
    includeNewsletters: !!body?.includeNewsletters,
    includeDemographics: !!body?.includeDemographics,
  };
}
function contentDispositionFor(filename: string) {
  const ascii = filename
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

/** Pulls a string from attributes across common key variants and {value} wrappers */
function pickAttr(attrs: Record<string, unknown> | undefined, keys: string[]): string | null {
  if (!attrs) return null;
  for (const k of keys) {
    // try exact, dashed/underscored variants, camel → snake/dash
    const tries = new Set<string>([
      k,
      k.replace(/-/g, "_"),
      k.replace(/_/g, "-"),
      // basic camel variants
      k.replace(/([A-Z])/g, "_$1").toLowerCase(),
      k.replace(/([A-Z])/g, "-$1").toLowerCase(),
    ]);
    for (const key of tries) {
      const v = (attrs as any)[key];
      if (!v) continue;
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "object" && "value" in (v as any) && typeof (v as any).value === "string") {
        const s = (v as any).value.trim();
        if (s) return s;
      }
    }
  }
  return null;
}

/* ---------- core export ---------- */
async function doExport(req: NextRequest, options: ExportUsersCsvOptions) {
  const externalAccountId = req.cookies.get("active_account_id")?.value;
  if (!externalAccountId) {
    return NextResponse.json({ error: "No active account" }, { status: 400 });
  }

  const account = await prisma.accounts.findUnique({
    where: { external_id: externalAccountId },
    select: { name: true },
  });
  const accountName = account?.name ?? "Account";

  // 1) Users from Zephr (matches UsersTable)
  const zephrUsers = (await getUsersByAccount(externalAccountId)) as ZephrUserBasic[];
  if (!zephrUsers || zephrUsers.length === 0) {
    const csv = buildUsersCsv({
      accountName,
      users: [],
      attrDefs: [],
      productLabelMap: {},
      options,
    });
    const body = "\uFEFF" + csv;
    const fileName = `${accountName.replace(/[\\/:*?"<>|]+/g, "_").trim()} Users - ${ymd()}.csv`;
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": contentDispositionFor(fileName),
        "Cache-Control": "no-store",
        Allow: "GET, POST, OPTIONS",
      },
    });
  }

  const userExternalIds = zephrUsers.map((u) => u.user_id);

  // 2) Local ID mapping (for newsletters)
  const locals = await prisma.users.findMany({
    where: { external_id: { in: userExternalIds } },
    select: { id: true, external_id: true },
  });
  const localIdByExt = new Map<string, number>();
  for (const u of locals) localIdByExt.set(u.external_id, u.id);
  const localIds = locals.map((u) => u.id);

  // 3) Group memberships in this account, keyed by Zephr user_external_id
  let membershipsByUserExt = new Map<string, Array<{ groups: GroupLite }>>();
  if (userExternalIds.length) {
    const rows = await prisma.$queryRaw<RawMembershipRow[]>`
      SELECT 
        gm.user_external_id,
        g.id,
        g.name,
        g.slug,
        g.default_template,
        g.product_grant_ids
      FROM public.group_memberships AS gm
      JOIN public.groups AS g
        ON g.id = gm.group_id
      JOIN public.accounts AS a
        ON a.id = g.account_id
      WHERE a.external_id = ${externalAccountId}
        AND gm.user_external_id IN (${Prisma.join(userExternalIds)})
    `;
    membershipsByUserExt = new Map();
    for (const r of rows) {
      const grp: GroupLite = {
        id: r.id,
        name: r.name,
        slug: r.slug,
        default_template: r.default_template,
        product_grant_ids: r.product_grant_ids ?? [],
      };
      const arr = membershipsByUserExt.get(r.user_external_id) ?? [];
      arr.push({ groups: grp });
      membershipsByUserExt.set(r.user_external_id, arr);
    }
  }

  // 4) Newsletter subs (best-effort via local ids)
  const subs = localIds.length
    ? ((await prisma.user_newsletters.findMany({
        where: { user_id: { in: localIds }, subscribed: true },
        select: { user_id: true, newsletters: { select: { name: true } } },
      })) as unknown as NewsletterRow[])
    : [];
  const newslettersByUserId = new Map<number, Array<{ newsletters: { name: string | null } | null }>>();
  for (const s of subs) {
    const arr = newslettersByUserId.get(s.user_id) ?? [];
    arr.push({ newsletters: s.newsletters ? { name: s.newsletters.name } : null });
    newslettersByUserId.set(s.user_id, arr);
  }

  // 5) Demographic definitions
  const attrDefs = await prisma.attribute_definitions.findMany({
    select: { slug: true, label: true, input_type: true },
    orderBy: { slug: "asc" },
  });

  // 6) Build clean rows for CSV
  const rows = zephrUsers.map((zu) => {
    const attrs = (zu.attributes ?? {}) as Record<string, unknown> | undefined;

    const first = pickAttr(attrs, [
      "firstname",
      "first-name",
      "first_name",
      "firstName",
      "given_name",
      "given-name",
      "givenName",
    ]);
    const last = pickAttr(attrs, [
      "lastname",
      "last-name",
      "last_name",
      "lastName",
      "surname",
      "family_name",
      "family-name",
      "familyName",
    ]);

    const role =
      (zu.user_type && zu.user_type.trim()) ||
      pickAttr(attrs, ["role", "user_role", "user-role", "userRole"]) ||
      null;

    const status = pickAttr(attrs, ["status", "user_status", "user-status", "userStatus"]) || null;

    const localId = localIdByExt.get(zu.user_id);

    return {
      // IMPORTANT: force "User ID" to be the Zephr id (no DB ints here)
      id: zu.user_id,
      external_id: zu.user_id, // keep column consistent; same as id
      email: zu.identifiers?.email_address ?? "",
      firstname: first,
      lastname: last,
      role,
      status,
      created_at: null,
      last_login: null,
      attributes: (zu.attributes ?? {}) as Record<string, unknown> | null,
      group_memberships: membershipsByUserExt.get(zu.user_id) ?? [],
      user_newsletters: localId ? newslettersByUserId.get(localId) ?? [] : [],
    };
  });

  // 7) CSV
  const csv = buildUsersCsv({
    accountName: accountName,
    users: rows as any,
    attrDefs,
    productLabelMap: loadProductLabelMap(),
    options,
  });

  const body = "\uFEFF" + csv;
  const safe = accountName.replace(/[\\/:*?"<>|]+/g, "_").trim();
  const fileName = `${safe} Users - ${ymd()}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": contentDispositionFor(fileName),
      "Cache-Control": "no-store",
      Allow: "GET, POST, OPTIONS",
    },
  });
}

/* ---------- HTTP methods ---------- */
export async function GET(req: NextRequest) {
  try {
    const options = parseOptionsFromSearch(new URL(req.url));
    return await doExport(req, options);
  } catch (err) {
    console.error("Export users GET error:", err);
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const options = parseOptionsFromBody(body);
    return await doExport(req, options);
  } catch (err) {
    console.error("Export users POST error:", err);
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
}
