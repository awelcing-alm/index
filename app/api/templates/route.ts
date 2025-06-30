// app/api/templates/route.ts – list all template names, create/update custom template
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listTpls, saveTpl } from "@/lib/blob";
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults";

// cookies() is synchronous in the latest types; no await needed
// cookies() returns a Promise in this runtime – use await
const getAccountId = async () => (await cookies()).get("active_account_id")?.value;

/* ----------------------------- GET ------------------------------ */
export async function GET() {
    const accId = await getAccountId();
  if (!accId) return NextResponse.json([], { status: 200 });

  try {
    const custom = await listTpls(accId);
    const names = [
      ...DEFAULT_TEMPLATES.map((t) => t.name),
      ...custom.filter((n) => !DEFAULT_TEMPLATES.some((d) => d.name === n)),
    ];
    return NextResponse.json(names);
  } catch (err: any) {
    console.error("[templates GET]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ----------------------------- POST ----------------------------- */
export async function POST(req: NextRequest) {
    const accId = await getAccountId();
  if (!accId) return NextResponse.json({ error: "No account" }, { status: 400 });

  const { name, description = "", attributes = {}, products = {} } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (DEFAULT_TEMPLATES.some((d) => d.name === name)) {
    return NextResponse.json({ error: "Cannot overwrite default template" }, { status: 403 });
  }

  try {
    await saveTpl(accId, name, {
      name,
      description,
      attributes,
      products,
      createdAt: new Date().toISOString(),
      isDefault: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[templates POST]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
