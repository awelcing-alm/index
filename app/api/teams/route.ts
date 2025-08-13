// app/api/teams/route.ts
import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { listTeams, saveTeam, deleteTeam } from "@/lib/teams"

/** Resolve active account id as a NUMBER (from header or cookie). */
async function resolveAccountId(): Promise<number | null> {
  const h = await headers()
  const fromHeader = h.get("x-account-id")
  if (fromHeader && fromHeader.trim()) {
    const n = Number(fromHeader.trim())
    return Number.isFinite(n) ? n : null
  }

  const c = await cookies()
  const raw = (c.get("active_account_id")?.value || "").trim()
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export async function GET(req: Request) {
  const accountId = await resolveAccountId()
  if (accountId == null) return new NextResponse("Missing active account", { status: 400 })

  try {
    const teams = await listTeams(accountId) // <-- number
    return NextResponse.json(teams)
  } catch (err: any) {
    console.error("[GET /api/teams] failed:", err)
    return new NextResponse("Failed to fetch teams", { status: 500 })
  }
}

export async function POST(req: Request) {
  const accountId = await resolveAccountId()
  if (accountId == null) return new NextResponse("Missing active account", { status: 400 })

  let payload: any
  try {
    payload = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  if (!payload?.id || !payload?.name) {
    return new NextResponse("id and name are required", { status: 400 })
  }

  try {
    await saveTeam(accountId, payload) // <-- number
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    console.error("[POST /api/teams] upsert failed:", err)
    return new NextResponse(err?.message || "Failed to save team", { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const accountId = await resolveAccountId()
  if (accountId == null) return new NextResponse("Missing active account", { status: 400 })

  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) return new NextResponse("Missing team id", { status: 400 })

  try {
    await deleteTeam(accountId, id) // <-- number
    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    console.error("[DELETE /api/teams] failed:", err)
    return new NextResponse("Failed to delete team", { status: 500 })
  }
}
