// lib/csv.ts
export type ExportUsersCsvOptions = {
  includeProducts: boolean;
  includeGroups: boolean;
  includeTemplates: boolean;
  includeNewsletters: boolean;
  includeDemographics: boolean;
};

// Minimal shapes matching what the route selects from Prisma.
type GroupLite = {
  id: string;
  name: string;
  slug: string;
  default_template: string | null;
  product_grant_ids: string[];
};

type UserRow = {
  id: number;
  external_id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  role: string | null;
  status: string | null;
  created_at: Date | null;
  last_login: Date | null;
  attributes: Record<string, unknown> | null;
  group_memberships: Array<{ groups: GroupLite }>;
  user_newsletters: Array<{ newsletters: { name: string | null } | null }>;
};

type AttrDef = {
  slug: string;
  label: string | null;
  input_type: string | null;
};

export function buildUsersCsv(args: {
  accountName: string;
  users: UserRow[];
  attrDefs: AttrDef[];
  productLabelMap: Record<string, string>;
  options: ExportUsersCsvOptions;
}) {
  const { users, attrDefs, productLabelMap, options } = args;

  const csvCell = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const fmtDate = (d?: Date | null) => (d ? new Date(d).toISOString() : "");

  // normalize any value to string|number for row push
  const toScalar = (v: unknown): string | number => {
    if (v === null || v === undefined) return "";
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? "true" : "false";
    return String(v);
  };

  // ---- Dynamic columns
  const productIdSet = new Set<string>();
  const productName = (id: string) => productLabelMap[id] || id;

  if (options.includeProducts) {
    for (const u of users) {
      for (const gm of u.group_memberships) {
        for (const pid of gm.groups?.product_grant_ids ?? []) {
          productIdSet.add(pid);
        }
      }
    }
  }
  const productIds = Array.from(productIdSet);
  const productCols = productIds.map((id) => `Product: ${productName(id)}`);

  const demoCols = options.includeDemographics
    ? attrDefs.map((d) => ({
        key: d.slug,
        header: (d.label ?? d.slug).trim(),
      }))
    : [];

  // ---- Header
  const baseHeaders = [
    "User ID",
    "User External ID",
    "Email",
    "First Name",
    "Last Name",
    "Role",
    "Status",
    "Created At",
    "Last Login",
  ];

  const extras: string[] = [];
  if (options.includeGroups) extras.push("Groups");
  if (options.includeTemplates) extras.push("Template");
  if (options.includeNewsletters) extras.push("Newsletters");
  if (options.includeProducts) extras.push(...productCols);
  if (options.includeDemographics) extras.push(...demoCols.map((d) => d.header));

  const header = [...baseHeaders, ...extras];

  // ---- Rows
  const lines: string[] = [];
  lines.push(header.map(csvCell).join(","));

  for (const u of users) {
    const groups = u.group_memberships
      .map((gm) => gm.groups?.name || gm.groups?.slug)
      .filter(Boolean) as string[];

    const templates = Array.from(
      new Set(
        u.group_memberships
          .map((gm) => gm.groups?.default_template)
          .filter((t): t is string => Boolean(t))
      )
    );

    const newsletters = u.user_newsletters
      .map((n) => n?.newsletters?.name)
      .filter((n): n is string => Boolean(n));

    // product presence map
    const userProductIds = new Set<string>();
    for (const gm of u.group_memberships) {
      for (const pid of gm.groups?.product_grant_ids ?? []) {
        userProductIds.add(pid);
      }
    }

    const row: (string | number)[] = [
      u.id,
      u.external_id,
      u.email,
      u.firstname ?? "",
      u.lastname ?? "",
      u.role ?? "",
      u.status ?? "",
      fmtDate(u.created_at),
      fmtDate(u.last_login),
    ];

    if (options.includeGroups) row.push(groups.join("; "));
    if (options.includeTemplates) row.push(templates.join("; "));
    if (options.includeNewsletters) row.push(newsletters.join("; "));

    if (options.includeProducts) {
      for (const pid of productIds) {
        row.push(userProductIds.has(pid) ? "Yes" : "");
      }
    }

    if (options.includeDemographics) {
      const attrs = (u.attributes ?? {}) as Record<string, unknown>;
      for (const col of demoCols) {
        const val = attrs[col.key];
        if (Array.isArray(val) || (val && typeof val === "object")) {
          row.push(JSON.stringify(val));
        } else {
          row.push(toScalar(val));
        }
      }
    }

    lines.push(row.map(csvCell).join(","));
  }

  return lines.join("\n") + "\n";
}
