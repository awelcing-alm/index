// lib/db.ts
import "server-only"

// Prefer POSTGRES_URL, fall back to DATABASE_URL (local dev)
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  ""

if (!connectionString) {
  throw new Error(
    "Missing DB connection string. Set POSTGRES_URL (or DATABASE_URL) in .env.local"
  )
}

export type Rows<
  T extends import("pg").QueryResultRow = import("pg").QueryResultRow
> = { rows: T[] }

type SqlTag = <
  T extends import("pg").QueryResultRow = import("pg").QueryResultRow
>(
  strings: TemplateStringsArray,
  ...values: any[]
) => Promise<Rows<T>>

let _impl: SqlTag | null = null
let _end: (() => Promise<void>) | null = null

async function init() {
  try {
    // Try @vercel/postgres first (optional dependency)
    const vercel = await import("@vercel/postgres")
    const pool = vercel.createPool({ connectionString })

    // Adapt vercel's pool.sql to our SqlTag shape
    _impl = (async function <
      T extends import("pg").QueryResultRow = import("pg").QueryResultRow
    >(strings: TemplateStringsArray, ...values: any[]): Promise<Rows<T>> {
      const res = await (pool.sql as any)(strings, ...values)
      // Some versions return an array; normalize
      if (Array.isArray(res)) return { rows: res as T[] }
      return { rows: (res?.rows ?? []) as T[] }
    }) as SqlTag

    _end = async () => { /* no-op for vercel pool */ }
  } catch {
    // Fallback to node-postgres
    const pg = (await import("pg")) as typeof import("pg")
    const pool = new pg.Pool({
      connectionString,
      // Common hosted Postgres requires SSL; disable via PGSSL=disable for local
      ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false },
    })

    _impl = (async function <
      T extends import("pg").QueryResultRow = import("pg").QueryResultRow
    >(strings: TemplateStringsArray, ...values: any[]): Promise<Rows<T>> {
      // Convert template to parameterized $1, $2, ...
      const text = strings.reduce(
        (acc, s, i) => acc + s + (i < values.length ? `$${i + 1}` : ""),
        ""
      )
      const res = await pool.query<T>(text, values)
      return { rows: res.rows as T[] }
    }) as SqlTag

    _end = async () => { await pool.end() }
  }
}

// Kick off initialization once
const ready = init()

// Safe exported tag that waits for init before delegating
export const sql: SqlTag = (async function <
  T extends import("pg").QueryResultRow = import("pg").QueryResultRow
>(strings: TemplateStringsArray, ...values: any[]): Promise<Rows<T>> {
  if (!_impl) await ready
  if (!_impl) throw new Error("DB not initialized")
  return _impl<T>(strings, ...values)
}) as SqlTag

export async function end() {
  if (!_end) await ready
  if (_end) await _end()
}

export { ready }
