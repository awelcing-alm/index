// app/api/sync/users/route.ts
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/zephr-api"
import { syncUsersForAccount } from "@/lib/sync-users"

/**
 * We normalize the result to a stable shape the UI can display.
 * Your current sync returns something like { total, upserted, linkedToGroups }.
 * We map to { created, updated, skipped, upserted } with sensible fallbacks.
 */
type NormalizedSyncResult = {
  ok: boolean
  accountId: string
  created: number
  updated: number
  skipped: number
  upserted: number
  total?: number
  linkedToGroups?: number
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 })
    }

    // Prefer body.accountId, fall back to active account from cookies/session.
    const body = (await req.json().catch(() => ({}))) as Partial<{ accountId: string }>
    const bodyAccountId = (body.accountId ?? "").toString().trim()
    const activeAccountId =
      (session.activeAccount as any)?.account_id ??
      (session.activeAccount as any)?.id ??
      ""

    const accountId = bodyAccountId || activeAccountId
    if (!accountId) {
      return NextResponse.json({ ok: false, error: "Missing accountId" }, { status: 400 })
    }

    // Basic authorization: must be admin and the account must belong to this user
    if (!session.isAdmin) {
      return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }
    const allowed = (session.accounts || []).some(
      (a: any) => (a.account_id ?? a.id) === accountId
    )
    if (!allowed) {
      return NextResponse.json({ ok: false, error: "Account not allowed" }, { status: 403 })
    }

    // Call the sync function in a way that's compatible with either a 1-arg or 2-arg signature.
    const runSync = syncUsersForAccount as unknown as (
      accountId: string,
      opts?: unknown
    ) => Promise<unknown>

    const raw: any = await runSync(accountId)

    // Normalize shapes: support both new/old return payloads
    const total = Number(raw?.total ?? 0)
    const upserted = Number(raw?.upserted ?? 0)
    // If you later return explicit created/updated/skipped, we use them; otherwise infer:
    const created = Number(raw?.created ?? Math.max(0, upserted - Number(raw?.updated ?? 0)))
    const updated = Number(raw?.updated ?? (upserted > 0 ? upserted - created : 0))
    const skipped = Number(raw?.skipped ?? Math.max(0, total - upserted))
    const linkedToGroups = Number(raw?.linkedToGroups ?? 0)

    const result: NormalizedSyncResult = {
      ok: true,
      accountId,
      created,
      updated,
      skipped,
      upserted,
      total: total || undefined,
      linkedToGroups: linkedToGroups || undefined,
    }

    return NextResponse.json(result)
  } catch (err: any) {
    const message = err?.message ?? "Sync failed"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405 })
}
