import { NextResponse } from "next/server"
import { adminApiCall } from "@/lib/zephr-api"

export const dynamic = "force-dynamic"
export const revalidate = 0

function parseIds(q: string | null): string[] {
  if (!q) return []
  return q
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function pickTimestamp(s: any): string | null {
  const candidates = [
    s?.last_access,
    s?.lastAccess,
    s?.updatedAt,
    s?.updated_at,
    s?.start_time,
    s?.startTime,
    s?.createdAt,
    s?.created_at,
  ]
  for (const c of candidates) if (c) return String(c)
  return null
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userIds = parseIds(url.searchParams.get("user_ids"))
    if (!userIds.length) return NextResponse.json({ ok: true, sessions: {} })

  const out: Record<string, { lastSession?: string; count?: number }> = {}

    await Promise.all(
      userIds.map(async (id) => {
        try {
          const resp = await adminApiCall(`/v3/users/${encodeURIComponent(id)}/sessions`)
          const arr: any[] = Array.isArray(resp)
            ? resp
            : Array.isArray(resp?.sessions)
            ? resp.sessions
            : Array.isArray(resp?.results)
            ? resp.results
            : Array.isArray(resp?.data)
            ? resp.data
            : []
          let latest: number = 0
          for (const s of arr) {
            const ts = pickTimestamp(s)
            if (!ts) continue
            const t = Date.parse(ts)
            if (!isNaN(t) && t > latest) latest = t
          }
          const count = arr.length || undefined
          if (latest > 0) out[id] = { lastSession: new Date(latest).toISOString(), count }
          else out[id] = { count }
        } catch {
          out[id] = {}
        }
      }),
    )

    return NextResponse.json({ ok: true, sessions: out })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Failed" }, { status: 500 })
  }
}
