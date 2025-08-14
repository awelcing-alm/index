// app/api/groups/membership/route.ts
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-actions"
import { sql } from "@/lib/db"

type Assignment = { user_id: string; group_id: string }
type Change = { id: string; delta: number }

type Body = {
  accountId?: string // optional; we DO NOT use it in SQL comparisons to avoid uuid/text mismatch
  assignments?: Assignment[]
  changes?: Change[]
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    }
    if (!session.isAdmin) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as Body
    const assignments = Array.isArray(body.assignments) ? body.assignments : []
    const changes = Array.isArray(body.changes) ? body.changes : []

    // We allow either path; at least one must be non-empty
    if (assignments.length === 0 && changes.length === 0) {
      return NextResponse.json({ ok: false, error: "changes must be a non-empty array" }, { status: 400 })
    }

    // Collect unique group ids we need to resolve to account_id
    const groupIds = new Set<string>()
    for (const a of assignments) if (a?.group_id) groupIds.add(a.group_id)
    for (const c of changes) if (c?.id) groupIds.add(c.id)

    // Build group_id -> account_id map (account_id is TEXT in your schema)
    const accountByGroup = new Map<string, string>()
    for (const gid of groupIds) {
      const { rows } = await sql/* sql */`
        SELECT account_id FROM groups WHERE id = ${gid}::uuid
      `
      const acct = rows?.[0]?.account_id as string | undefined
      if (acct) accountByGroup.set(gid, acct)
    }

    // Start a transaction
    await sql/* sql */`BEGIN`

// 1) Apply assignments (write group_memberships and users.group_id)
for (const a of assignments) {
  const gid = String(a.group_id)
  const uid = String(a.user_id) // this is the Zephr user_id (TEXT in your DB)
  const acct = accountByGroup.get(gid)
  if (!acct) continue

  // Use user_external_id (TEXT), not user_id
  await sql/* sql */`
    INSERT INTO group_memberships (account_id, group_id, user_external_id, assigned_at)
    VALUES (${acct}, ${gid}::uuid, ${uid}, now())
    ON CONFLICT (account_id, user_external_id)
    DO UPDATE SET group_id = EXCLUDED.group_id, assigned_at = now()
  `

  // Reflect in users table by external_id (TEXT) — keep this as-is
  await sql/* sql */`
    UPDATE users
       SET group_id = ${gid}::uuid,
           updated_at = now()
     WHERE external_id = ${uid}
  `
}

    await sql/* sql */`COMMIT`

    const deltas = Object.fromEntries(changes.map((c) => [c.id, c.delta]))
    return NextResponse.json({ ok: true, deltas })
  } catch (err: any) {
    try { await sql/* sql */`ROLLBACK` } catch {}
    const msg = err?.message || "Failed to persist membership"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 })
}
