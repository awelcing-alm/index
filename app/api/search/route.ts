import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-actions"

/**
 * GET /api/search?q=term&limit=8&only=users|groups|templates
 * Response: { users: [], groups: [], templates: [] }
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const { searchParams } = url

  const qRaw = (searchParams.get("q") || "").trim()
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 8), 1), 25)

  // scope parsing: only=users,groups,templates (comma-separated or single)
  const onlyParam = (searchParams.get("only") || "").trim().toLowerCase()
  const scopeList = onlyParam
    ? Array.from(
        new Set(
          onlyParam
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      )
    : []
  const wantUsers = scopeList.length === 0 || scopeList.includes("users")
  const wantGroups = scopeList.length === 0 || scopeList.includes("groups")
  const wantTemplates = scopeList.length === 0 || scopeList.includes("templates")

  // If no query, return empty shells
  if (!qRaw) {
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

  const like = `%${qRaw}%`
  const looksEmail = qRaw.includes("@")

  // Prepare response buckets; populate section-by-section (soft-fail)
  let users: Array<{ user_id: string; email: string | null; firstname: string | null; lastname: string | null }> = []
  let groups: Array<{ id: string; name: string; icon: string | null; slug: string | null }> = []
  let templates: Array<{ name: string }> = []

  // ---- Users (JSONB-first; avoids referencing non-existent plain `email` column)
  if (wantUsers) {
    try {
      // If it's email-ish, bias strongly to email ILIKE; otherwise include name matches too.
      const { rows } = await sql/* sql */`
        SELECT
          external_id::text AS user_id,
          (identifiers->>'email_address') AS email,
          attributes
        FROM public.users
        WHERE account_id = ${accountId}
          AND (
            (identifiers->>'email_address') ILIKE ${like}
            ${looksEmail ? sql`` : sql/* sql */`OR (attributes->>'firstname') ILIKE ${like} OR (attributes->>'lastname') ILIKE ${like}`}
          )
        ORDER BY updated_at DESC NULLS LAST
        LIMIT ${limit};
      `

      users = (rows as any[]).map((r) => ({
        user_id: r.user_id,
        email: r.email ?? null,
        firstname: r.attributes?.firstname ?? null,
        lastname: r.attributes?.lastname ?? r.attributes?.surname ?? null,
      }))
    } catch (e) {
      // Soft-fail: leave users empty
      users = []
    }
  }

  // ---- Groups
  if (wantGroups) {
    try {
      const { rows } = await sql/* sql */`
        SELECT id::text AS id, name, icon, slug
        FROM public.groups
        WHERE account_id = ${accountId}
          AND (name ILIKE ${like} OR slug ILIKE ${like})
        ORDER BY name ASC
        LIMIT ${limit};
      `
      groups = rows as any[]
    } catch (e) {
      groups = []
    }
  }

  // ---- Templates (forward cookie so auth is preserved)
  if (wantTemplates) {
    try {
      const namesRes = await fetch(new URL("/api/templates", url).toString(), {
        cache: "no-store",
        headers: {
          // forward cookies so /api/templates can authenticate this internal call
          cookie: (req.headers as any).get?.("cookie") ?? "",
        },
        // Next.js: ensure it's not cached at the edge
        next: { revalidate: 0 },
      }).catch(() => null)

      const templateNames: string[] = namesRes && namesRes.ok ? await namesRes.json() : []
      templates = templateNames
        .filter((n) => n.toLowerCase().includes(qRaw.toLowerCase()))
        .slice(0, limit)
        .map((name) => ({ name }))
    } catch (e) {
      templates = []
    }
  }

  return NextResponse.json({ users, groups, templates })
}
