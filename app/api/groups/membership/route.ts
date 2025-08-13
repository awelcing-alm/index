// app/api/groups/membership/route.ts
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { applyGroupCountDeltas, type GroupCountChange } from "@/lib/groups"

export async function POST(req: Request) {
  const h = await headers()
  const accountId = h.get("x-account-id") || ""
  if (!accountId) return new NextResponse("Missing active account", { status: 400 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const arr = Array.isArray((body as any)?.changes) ? (body as any).changes : []
  const changes: GroupCountChange[] = arr
    .map((c: any) => ({ id: String(c?.groupId || c?.id || ""), delta: Number(c?.delta) }))
    .filter((c: { id: any; delta: unknown }) => c.id && Number.isFinite(c.delta) && c.delta !== 0)

  if (!changes.length) return new NextResponse(null, { status: 204 })

  try {
    await applyGroupCountDeltas(accountId, changes)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error("[POST /api/groups/membership] failed:", err)
    return new NextResponse("Failed to update membership counters", { status: 500 })
  }
}
