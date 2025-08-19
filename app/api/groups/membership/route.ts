// app/api/groups/membership/route.ts
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-actions"
import { sql } from "@/lib/db"

type Assignment = { user_id: string; group_id: string }
type Change = { id: string; delta: number }

type Body = {
  accountId?: string // ignored in SQL comparisons to avoid uuid/text mismatch
  assignments?: Assignment[]
  changes?: Change[]
}

function toPgTextArrayLiteral(arr: string[]): string {
  const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return `{${arr.map((v) => `"${esc(v)}"`).join(",")}}`
}

/** GET /api/groups/membership?user_ids=U1,U2,U3
 *  Returns a map of user_external_id -> { group_id, name, icon } for the active account.
  */
export async function GET(req: Request) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    }
    if (!session.isAdmin) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }

    const url = new URL(req.url)
    const raw = url.searchParams.get("user_ids") || ""
    const userIds = Array.from(
      new Set(
        raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    )

    if (userIds.length === 0) {
      return NextResponse.json({ ok: true, memberships: {} })
    }

    const accountId =
      (session.activeAccount as any)?.account_id ??
      (session.activeAccount as any)?.id ??
      ""
    if (!accountId) {
      return NextResponse.json({ ok: false, error: "No active account" }, { status: 400 })
    }

    const arrLiteral = toPgTextArrayLiteral(userIds)

    const { rows } = await sql/* sql */`
                                                                                                                                                                                SELECT
                                                                                                                                                                                        gm.user_external_id,
                                                                                                                                                                                                gm.group_id::text AS group_id,
                                                                                                                                                                                                        g.name,
                                                                                                                                                                                                                g.icon
                                                                                                                                                                                                                      FROM public.group_memberships gm
                                                                                                                                                                                                                            JOIN public.groups g
                                                                                                                                                                                                                                    ON g.id = gm.group_id
                                                                                                                                                                                                                                         WHERE gm.account_id = ${accountId}
                                                                                                                                                                                                                                                AND gm.user_external_id = ANY(${arrLiteral}::text[])
                                                                                                                                                                                                                                                    `

    const memberships: Record<string, { group_id: string; name: string | null; icon: string | null }> = {}
    for (const r of rows as any[]) {
      memberships[r.user_external_id] = {
        group_id: r.group_id,
        name: r.name ?? null,
        icon: r.icon ?? null,
      }
    }

    {
      const res = NextResponse.json({ ok: true, memberships })
      // short client cache; still fresh enough for UI and prevents hammering
      res.headers.set("Cache-Control", "private, max-age=10, stale-while-revalidate=60")
      return res
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed to load memberships" }, { status: 500 })
  }
}

/** POST (write): persists group assignments and (optionally) count deltas. */
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

    if (assignments.length === 0 && changes.length === 0) {
      return NextResponse.json({ ok: false, error: "changes must be a non-empty array" }, { status: 400 })
    }

    // Resolve each group_id -> account_id (TEXT)
    const groupIds = new Set<string>()
    for (const a of assignments) if (a?.group_id) groupIds.add(a.group_id)
    for (const c of changes) if (c?.id) groupIds.add(c.id)

    const accountByGroup = new Map<string, string>()
    for (const gid of groupIds) {
      const { rows } = await sql/* sql */`
                                                                                                                                                                                                                                                                                                                                                                                                                  SELECT account_id FROM public.groups WHERE id = ${gid}::uuid
                                                                                                                                                                                                                                                                                                                                                                                                                        `
      const acct = rows?.[0]?.account_id as string | undefined
      if (acct) accountByGroup.set(gid, acct)
    }

    await sql/* sql */`BEGIN`

    // 1) Apply assignments (group_memberships + users.group_id)
    for (const a of assignments) {
      const gid = String(a.group_id)
      const uid = String(a.user_id) // this is Zephr user_id (TEXT in your DB)
      const acct = accountByGroup.get(gid)
      if (!acct) continue

      await sql/* sql */`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          INSERT INTO public.group_memberships (account_id, group_id, user_external_id, assigned_at)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  VALUES (${acct}, ${gid}::uuid, ${uid}, now())
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ON CONFLICT (account_id, user_external_id)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  DO UPDATE SET group_id = EXCLUDED.group_id, assigned_at = now()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        `

      await sql/* sql */`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      UPDATE public.users
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 SET group_id = ${gid}::uuid,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                updated_at = now()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         WHERE external_id = ${uid}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               `
    }

    // 2) Optionally apply count deltas (safe even if empty)
    const clean = (changes || [])
      .map((c) => ({ id: String(c?.id || ""), delta: Number(c?.delta) }))
      .filter((c) => c.id && Number.isFinite(c.delta) && c.delta !== 0)

    for (const { id, delta } of clean) {
      await sql/* sql */`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         UPDATE public.groups
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    SET user_count = GREATEST(0, COALESCE(user_count, 0) + ${delta})
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             WHERE id = ${id}::uuid
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   `
    }

    await sql/* sql */`COMMIT`

    const deltas = Object.fromEntries(changes.map((c) => [c.id, c.delta]))
    return NextResponse.json({ ok: true, deltas })
  } catch (err: any) {
    try { await sql/* sql */`ROLLBACK` } catch { }
    const msg = err?.message || "Failed to persist membership"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
