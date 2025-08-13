// app/api/groups/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { listGroups, saveGroup, deleteGroup } from "@/lib/groups"

async function requireAccountId(): Promise<string> {
  const c = await cookies()
  const id = c.get("active_account_id")?.value
  if (!id || id === "undefined") {
    throw new Error("Missing active account")
  }
  return id
}

export async function GET() {
  try {
    const accountId = await requireAccountId()
    const groups = await listGroups(accountId)
    return NextResponse.json(groups)
  } catch (err: any) {
    const msg = err?.message || "Failed to fetch groups"
    const status = /Missing active account/i.test(msg) ? 400 : 500
    return new NextResponse(msg, { status })
  }
}

export async function POST(req: Request) {
  try {
    const accountId = await requireAccountId()
    const payload = await req.json().catch(() => null)
    if (!payload || !payload.name) {
      return new NextResponse("name is required", { status: 400 })
    }
    await saveGroup(accountId, payload)
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    const msg = err?.message || "Failed to save group"
    const status = /Missing active account/i.test(msg) ? 400 : 500
    return new NextResponse(msg, { status })
  }
}

export async function DELETE(req: Request) {
  try {
    const accountId = await requireAccountId()
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")
    if (!slug) return new NextResponse("Missing slug", { status: 400 })
    await deleteGroup(accountId, { slug })
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    const msg = err?.message || "Failed to delete group"
    const status = /Missing active account/i.test(msg) ? 400 : 500
    return new NextResponse(msg, { status })
  }
}
