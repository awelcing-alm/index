// lib/db-rls.ts
import { sql } from "./db"

/**
 * RLS helpers:
 * - withRlsTx(): Run a callback inside a single connection/transaction, set session GUCs.
 * - withRls():   Fallback when transactions aren't available on `sql` (less strict).
 *
 * Policies expect:
 *   current_setting('app.account_id', true)::text
 *   current_setting('app.role', true)
 */

export type RlsContext = {
  accountId?: string | null
  role?: string | null // e.g. "owner" | "admin" | "viewer"
}

/** Set session variables (GUCs) for RLS in the current connection. */
async function setRlsGucs(q: any, ctx: RlsContext) {
  const { accountId, role } = ctx
  // Use text for GUC; policy casts to uuid as needed.
  await q/* sql */`select set_config('app.account_id', ${accountId ?? null}::text, true);`
  await q/* sql */`select set_config('app.role', ${role ?? null}::text, true);`
}

/** Clear RLS GUCs in the current connection. */
async function clearRlsGucs(q: any) {
  await q/* sql */`select set_config('app.account_id', null, true);`
  await q/* sql */`select set_config('app.role', null, true);`
}

/**
 * Preferred: run inside a single connection/transaction if the `sql` client supports it (postgres.js style).
 * Ensures all queries in `fn` see the same session GUCs.
 */
export async function withRlsTx<T>(ctx: RlsContext, fn: (q: typeof sql) => Promise<T>): Promise<T> {
  const anySql: any = sql as any
  if (typeof anySql.begin === "function") {
    return anySql.begin(async (q: typeof sql) => {
      await setRlsGucs(q, ctx)
      try {
        const result = await fn(q)
        return result
      } finally {
        // Best effort cleanup; not strictly required as tx ends, but keeps things tidy for pooled conns.
        await clearRlsGucs(q)
      }
    })
  }

  // Fallback if `sql.begin` isn't available: emulate by setting on the default connection.
  // NOTE: This does not guarantee the same physical connection across multiple queries.
  // Prefer `withRlsTx` behavior when possible.
  await setRlsGucs(anySql, ctx)
  try {
    return await fn(sql)
  } finally {
    await clearRlsGucs(anySql)
  }
}

/**
 * Lightweight convenience wrapper when you need a one-off RLS context and your code body is a single query.
 * If you need multiple queries under the same session, use withRlsTx().
 */
export async function withRls<T>(ctx: RlsContext, fn: () => Promise<T>): Promise<T> {
  const anySql: any = sql as any
  try {
    await setRlsGucs(anySql, ctx)
    return await fn()
  } finally {
    await clearRlsGucs(anySql)
  }
}
