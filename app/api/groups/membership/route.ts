// app/api/groups/membership/route.ts
import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/zephr-api"
import { sql } from "@/lib/db"
import crypto from "crypto"

/* Ensure this runs on Node (DB drivers etc.) and stays dynamic */
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

/* --------------------------------- tuning --------------------------------- */

// Keep responses small & predictable
const MAX_USER_IDS = 200

// Internal microcache to absorb bursts on a single edge/runtime instance.
// NOTE: This helps even if callers use `cache: "no-store"`.
type MemoEntry = {
  body: string
  etag: string
  expiry: number
}
const MEMO_TTL_MS = 10_000
const MEMO_MAX = 500
const memo = new Map<string, MemoEntry>()

function memoGet(key: string): MemoEntry | null {
  const hit = memo.get(key)
  if (!hit) return null
  if (Date.now() > hit.expiry) {
    memo.delete(key)
    return null
  }
  return hit
}
function memoSet(key: string, val: MemoEntry) {
  if (memo.size >= MEMO_MAX) {
    const first = memo.keys().next().value
    if (first) memo.delete(first)
  }
  memo.set(key, val)
}

/* ------------------------------- utilities -------------------------------- */

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

function normalizeIds(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  ).sort()
}

function makeEtag(accountId: string, json: string) {
  const h = crypto.createHash("sha1").update(accountId).update("|").update(json).digest("base64")
  return `"gmem-${h}"`
}

/* ---------------------------------- GET ----------------------------------- */
/**
 * GET /api/groups/membership?user_ids=U1,U2,U3
 * Returns a map of user_external_id -> { group_id, name, icon } for the active account.
 * (No redirects; we canonicalize internally for caching.)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    }
    if (!session.isAdmin) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }

    const url = new URL(req.url)
    const userIds = normalizeIds(url.searchParams.get("user_ids") || "")

    const accountId =
      (session.activeAccount as any)?.account_id ??
      (session.activeAccount as any)?.id ??
      ""

    if (!accountId) {
      return NextResponse.json({ ok: false, error: "No active account" }, { status: 400 })
    }

    // Empty list: fast exit (avoid DB)
    if (userIds.length === 0) {
      const empty = { ok: true, memberships: {} as Record<string, never> }
      const res = NextResponse.json(empty)
      res.headers.set("Cache-Control", "public, max-age=5, s-maxage=60, stale-while-revalidate=300")
      res.headers.set("Vary", "Accept, Cookie")
      return res
    }

    if (userIds.length > MAX_USER_IDS) {
      return NextResponse.json(
        { ok: false, error: `Too many user_ids (max ${MAX_USER_IDS})` },
        { status: 400 },
      )
    }

    // Internal cache key uses canonicalized IDs (sorted) + account
    const canonicalIds = userIds.join(",")
    const memoKey = `${accountId}|${canonicalIds}`
    const cached = memoGet(memoKey)
    const ifNoneMatch = req.headers.get("if-none-match")

    if (cached) {
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        const notModified = new NextResponse(null, { status: 304 })
        notModified.headers.set("ETag", cached.etag)
        notModified.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
        notModified.headers.set("Vary", "Accept, Cookie")
        return notModified
      }
      const res = new NextResponse(cached.body, {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      })
      res.headers.set("ETag", cached.etag)
      res.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
      res.headers.set("Vary", "Accept, Cookie")
      return res
    }

    // DB fetch
    const arrLiteral = toPgTextArrayLiteral(userIds)
    const { rows } = await sql/* sql */`
      SELECT
        gm.user_external_id,
        gm.group_id::text AS group_id,
        g.name,
        g.icon
      FROM public.group_memberships gm
      JOIN public.groups g ON g.id = gm.group_id
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

    const payload = { ok: true, memberships }
    const json = JSON.stringify(payload)
    const etag = makeEtag(accountId, json)

    // Populate microcache
    memoSet(memoKey, { body: json, etag, expiry: Date.now() + MEMO_TTL_MS })

    if (ifNoneMatch && ifNoneMatch === etag) {
      const notModified = new NextResponse(null, { status: 304 })
      notModified.headers.set("ETag", etag)
      notModified.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
      notModified.headers.set("Vary", "Accept, Cookie")
      return notModified
    }

    const res = new NextResponse(json, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    })
    res.headers.set("ETag", etag)
    res.headers.set("Cache-Control", "public, max-age=10, s-maxage=300, stale-while-revalidate=600")
    res.headers.set("Vary", "Accept, Cookie")
    return res
  } catch (err: any) {
    console.error("[membership GET]", err)
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to load memberships" },
      { status: 500 },
    )
  }
}

/* ---------------------------------- POST ---------------------------------- */
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

    type Body = {
      assignments?: { user_id: string; group_id: string }[]
      changes?: { id: string; delta: number }[]
    }

    const body = (await req.json().catch(() => ({}))) as Body
    const assignmentsIn = Array.isArray(body.assignments) ? body.assignments : []
    const changesIn = Array.isArray(body.changes) ? body.changes : []

    if (assignmentsIn.length === 0 && changesIn.length === 0) {
      return NextResponse.json(
        { ok: false, error: "changes must be a non-empty array" },
        { status: 400 },
      )
    }

    // ... (unchanged below)
    // your existing POST implementation
  } catch (err: any) {
    try { await sql/* sql */`ROLLBACK` } catch {}
    const msg = err?.message || "Failed to persist membership"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
