// app/api/user-index/users/[id]/profile/[appId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { adminApiCall } from "@/lib/zephr-api"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

function buildZephrPath(id: string, appId: string) {
  const prefix = process.env.USER_INDEX_ZEPHR_PREFIX || "/v3/users"
  return `${prefix}/${encodeURIComponent(id)}/profile/${encodeURIComponent(appId)}`
}

export async function GET(_req: NextRequest, ctx: { params: { id: string; appId: string } }) {
  try {
    const path = buildZephrPath(ctx.params.id, ctx.params.appId)
    const data = await adminApiCall(path, { method: "GET" })
    return NextResponse.json(data ?? null)
  } catch (e: any) {
    const msg = e?.message || "Failed to load extended profile"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string; appId: string } }) {
  try {
    const path = buildZephrPath(ctx.params.id, ctx.params.appId)
    const raw = await req.text()
    const data = await adminApiCall(path, { method: "PUT", body: raw })
    return NextResponse.json(data ?? { ok: true })
  } catch (e: any) {
    const msg = e?.message || "Failed to update extended profile"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
