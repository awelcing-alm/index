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
  // Prefer Zephr session fields when present
  if (s?.expiryDate) return String(s.expiryDate)
  if (s?.startDate) return String(s.startDate)
  const candidates = [
    s?.last_access,
    s?.lastAccess,
    s?.updatedAt,
    s?.updated_at,
    s?.start_time,
    s?.startTime,
    s?.end_time,
    s?.endTime,
    s?.createdAt,
    s?.created_at,
    s?.timestamp,
    s?.time,
    s?.ts,
    s?.last_seen,
    s?.lastSeen,
  ]
  for (const c of candidates) if (c != null) return String(c)
  return null
}

function toIsoFromZephr(s: string): string | null {
  // Typical input: "2017-11-15 02:29 PM UTC" (but sometimes 24h + AM/PM). Normalize.
  const raw = String(s || "").trim()
  if (!raw) return null
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*UTC$/i)
  if (m) {
    const [, Y, M, D, hStr, mStr, ap] = m
    let h = parseInt(hStr, 10)
    const ampm = ap.toUpperCase()
    if (ampm === "AM") {
      if (h === 12) h = 0
    } else if (ampm === "PM") {
      if (h < 12) h += 12
      // if h > 12 (bad input like 14 PM), keep as-is
    }
    const HH = String(h).padStart(2, "0")
    return `${Y}-${M}-${D}T${HH}:${mStr}:00Z`
  }
  // Fallback: replace trailing UTC with Z when no AM/PM
  if (/UTC$/i.test(raw)) {
    const cleaned = raw.replace(/\s*UTC$/i, "Z").replace(" ", "T")
    return cleaned
  }
  return null
}

function parseTs(v: any): number {
  if (v == null) return NaN
  if (typeof v === "number") {
    // Heuristic: treat 10-digit values as seconds, 13-digit as ms
    if (v < 1e12) return v * 1000
    return v
  }
  const s = String(v)
  const n = Number(s)
  if (!isNaN(n)) return parseTs(n)
  const z = toIsoFromZephr(s)
  const t = Date.parse(z || s)
  return t
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
            // Consider both expiryDate and startDate; use the later as the session's time
            const exp = s?.expiryDate ? parseTs(s.expiryDate) : NaN
            const sta = s?.startDate ? parseTs(s.startDate) : NaN
            const primary = !isNaN(exp) ? exp : (!isNaN(sta) ? sta : NaN)
            let t = primary
            if (isNaN(t)) {
              const ts = pickTimestamp(s)
              if (ts) t = parseTs(ts)
            }
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
