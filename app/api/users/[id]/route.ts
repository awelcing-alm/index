// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserDetails, updateUserAttributes } from "@/lib/zephr-api";

type IdParams = { id: string };
type RouteCtx = { params: IdParams } | Promise<{ params: IdParams }>;

export async function GET(_req: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = (await ctx).params;
    const user = await getUserDetails(id);
    return NextResponse.json(user);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = (await ctx).params;
    const body = await req.json();
    const attributes = body?.attributes ?? {};
    await updateUserAttributes(id, attributes);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
