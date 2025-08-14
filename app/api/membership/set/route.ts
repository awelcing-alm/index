// app/api/membership/set/route.ts
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-actions"
import { setMembershipBulk } from "@/lib/membership"

type Body = {
  accountId?: string
  userIds: string[]
  groupId: string | null  // null => remove from any group
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()
    if (!session) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    if (!session.isAdmin) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })

    const body = (await req.json().catch(() => ({}))) as Partial<Body>
    const activeAccountId =
      (session.activeAccount as any)?.account_id ?? (session.activeAccount as any)?.id ?? ""
    const accountId = (body.accountId || activeAccountId || "").toString().trim()
    const groupId = body.groupId ?? null
    const userIds = Array.isArray(body.userIds) ? body.userIds.map(String) : []

    if (!accountId) return NextResponse.json({ ok: false, error: "Missing accountId" }, { status: 400 })
    if (userIds.length === 0) return NextResponse.json({ ok: false, error: "No userIds" }, { status: 400 })

    // Ensure the account is one of the user's allowed accounts
    const allowed = (session.accounts || []).some((a: any) => (a.account_id ?? a.id) === accountId)
    if (!allowed) return NextResponse.json({ ok: false, error: "Account not allowed" }, { status: 403 })

    const result = await setMembershipBulk({
      accountId,
      userIds,
      targetGroupId: groupId,
      actorEmail: session.email,
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 })
}
