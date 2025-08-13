// app/api/groups/route.ts
import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { listGroups, saveGroup, deleteGroup } from "@/lib/groups"

/** Resolve active Zephr account id (string) from header or cookie. */
async function resolveAccountId(): Promise<string | null> {
  const h = await headers()
  const fromHeader = h.get("x-account-id")
  if (fromHeader && fromHeader.trim()) return fromHeader.trim()

  const c = await cookies()
  const raw = (c.get("active_account_id")?.value || "").trim()
  return raw || null
}

export async function GET(req: Request) {
  const accountId = await resolveAccountId()
  if (!accountId) return new NextResponse("Missing active account", { status: 400 })

  try {
    const groups = await listGroups(accountId)
    return NextResponse.json(groups)
  } catch (err: any) {
    console.error("[GET /api/groups] failed:", err)
    return new NextResponse("Failed to fetch groups", { status: 500 })
  }
}

export async function POST(req: Request) {
  const accountId = await resolveAccountId()
  if (!accountId) return new NextResponse("Missing active account", { status: 400 })

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  if (!payload?.name) {
    return new NextResponse("name is required", { status: 400 })
  }

  try {
    const saved = await saveGroup(accountId, payload)
    return NextResponse.json(saved, { status: 200 })
  } catch (err: any) {
    console.error("[POST /api/groups] upsert failed:", err)
    return new NextResponse(err?.message || "Failed to save group", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const accountId = await resolveAccountId()
  if (!accountId) return new NextResponse("Missing active account", { status: 400 })

  const url = new URL(req.url)
  const id = url.searchParams.get("id") || undefined
  const slug = url.searchParams.get("slug") || undefined

  if (!id && !slug) return new NextResponse("id or slug required", { status: 400 })

  try {
    await deleteGroup(accountId, { id, slug })
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    console.error("[DELETE /api/groups] failed:", err)
    return new NextResponse("Failed to delete group", { status: 500 })
  }
}
