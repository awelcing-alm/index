// app/api/groups/membership/route.ts
import { NextResponse } from "next/server"
import { withRls } from "@/lib/db-rls"
import { applyGroupCountDeltas, type GroupCountChange } from "@/lib/groups"
import { getCurrentUser } from "@/lib/auth-actions"

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()
    const acct = session?.activeAccount
    const accountId =
      (acct as any)?.account_id ??
      (acct as any)?.id ??
      null

    if (!accountId) {
      return NextResponse.json({ error: "No active account" }, { status: 400 })
    }

    // Derive role from your session shape
    const isAdmin = Boolean((session as any)?.isAdmin)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const changes: GroupCountChange[] = Array.isArray(body?.changes) ? body.changes : []
    if (changes.length === 0) {
      return NextResponse.json({ error: "changes must be a non-empty array" }, { status: 400 })
    }

    // Your withRls currently takes a no-arg callback; call into groups.ts inside it.
    await withRls({ accountId, role: "admin" }, async () => {
      await applyGroupCountDeltas(accountId, changes)
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("[api/groups/membership] error:", e)
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 })
  }
}
