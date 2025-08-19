// app/api/search/route.ts
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-actions"

/**
 * GET /api/search?q=term&limit=8
 * Response: { users: [], groups: [], templates: [] }
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const q = (searchParams.get("q") || "").trim()
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 8), 1), 25)

  if (!q) {
    return NextResponse.json({ users: [], groups: [], templates: [] })
  }

  const session = await getCurrentUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  if (!session.isAdmin) return NextResponse.json({ error: "Not authorized" }, { status: 403 })

  const accountId =
    (session.activeAccount as any)?.account_id ??
    (session.activeAccount as any)?.id ??
    null
  if (!accountId) {
    return NextResponse.json({ error: "No active account" }, { status: 400 })
  }

  const like = `%${q}%`

  // ---- Groups (definite)
  const { rows: groupRows } = await sql/* sql */`
    SELECT id::text AS id, name, icon, slug
    FROM public.groups
    WHERE account_id = ${accountId}
      AND (name ILIKE ${like} OR slug ILIKE ${like})
    ORDER BY name ASC
    LIMIT ${limit};
  `

  // ---- Users (best-effort: email + firstname/lastname in JSONB)
  // Notes:
  //  - Works if your table has either `email` column OR `identifiers` JSONB with email_address.
  //  - Safe to ship; adjust selectors if your schema differs.
  const { rows: userRows } = await sql/* sql */`
    SELECT
      external_id::text AS user_id,
      COALESCE(email, (identifiers->>'email_address')) AS email,
      attributes
    FROM public.users
    WHERE account_id = ${accountId}
      AND (
        COALESCE(email, (identifiers->>'email_address')) ILIKE ${like}
        OR (attributes->>'firstname') ILIKE ${like}
        OR (attributes->>'lastname') ILIKE ${like}
      )
    ORDER BY updated_at DESC NULLS LAST
    LIMIT ${limit};
  `

  // ---- Templates (via local API to reuse existing store)
  // We call our own templates endpoint to avoid duplicating its storage logic.
  const namesRes = await fetch(`${origin}/api/templates`, { cache: "no-store" }).catch(() => null)
  const templateNames: string[] = namesRes && namesRes.ok ? await namesRes.json() : []
  const filteredTpls = templateNames
    .filter((n) => n.toLowerCase().includes(q.toLowerCase()))
    .slice(0, limit)
    .map((name) => ({ name }))

  return NextResponse.json({
    users: (userRows as any[]).map((r) => ({
      user_id: r.user_id,
      email: r.email,
      firstname: r.attributes?.firstname ?? null,
      lastname: r.attributes?.lastname ?? r.attributes?.surname ?? null,
    })),
    groups: groupRows as any[],
    templates: filteredTpls,
  })
}
