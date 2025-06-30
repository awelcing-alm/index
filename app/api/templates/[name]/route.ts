// app/api/templates/[name]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loadTpl, saveTpl, deleteTpl } from "@/lib/blob";

type StoredTpl = {
  name: string
  description?: string
  attributes: Record<string, boolean>
  overwriteFalse?: boolean   // add default true when undefined
}

/** helper – pull account id directly from the request’s cookies */
const accountIdFrom = (req: NextRequest) =>
  req.cookies.get("active_account_id")?.value;

/* ---------- GET /api/templates/:name ---------- */
export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const accId = accountIdFrom(req);
  if (!accId)
    return NextResponse.json({ error: "No account" }, { status: 401 });

  const tpl = await loadTpl(accId, params.name);
  if (!tpl)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(tpl);
}

/* ---------- PUT ---------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const accId = accountIdFrom(req);
  if (!accId)
    return NextResponse.json({ error: "No account" }, { status: 401 });

  const body = await req.json();
  await saveTpl(accId, params.name, body);
  return NextResponse.json({ ok: true });
}

/* ---------- DELETE ---------- */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const accId = accountIdFrom(req);
  if (!accId)
    return NextResponse.json({ error: "No account" }, { status: 401 });

  await deleteTpl(accId, params.name);
  return NextResponse.json({ ok: true });
}
