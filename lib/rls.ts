// lib/rls.ts
import { prisma } from "@/lib/prisma"
import type { NextRequest } from "next/server"

export function accountIdFrom(req: NextRequest): string | null {
  return (
    req.cookies.get("active_account_id")?.value ??
    req.headers.get("x-active-account-id") ??
    null
  )
}

export function roleFrom(req: NextRequest): string {
  return (
    req.cookies.get("active_role")?.value ??
    req.headers.get("x-role") ??
    "user"
  )
}

/** Must be called at the top of every route that touches the DB. */
export async function applyRlsFromRequest(req: NextRequest): Promise<string> {
  const zephrAccountId = accountIdFrom(req)
  if (!zephrAccountId) throw new Error("No active account")

  // Set session GUCs on this DB connection (Prisma pool)
  await prisma.$executeRaw`select set_config('app.account_id', ${zephrAccountId}, true)`
  await prisma.$executeRaw`select set_config('app.role', ${roleFrom(req)}, true)`
  return zephrAccountId
}
