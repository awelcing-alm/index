// lib/rls.ts
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/** Read the Zephr external account id from cookie or header. */
export function accountIdFrom(req: NextRequest): string | null {
  return (
    req.cookies.get("active_account_id")?.value ??
    req.headers.get("x-active-account-id") ??
    null
  );
}

/** Read the caller’s app role (default "user"). */
export function roleFrom(req: NextRequest): string {
  return (
    req.cookies.get("active_role")?.value ??
    req.headers.get("x-role") ??
    "user"
  );
}

/**
 * Run all DB work under a single connection where we set RLS GUCs via SET LOCAL.
 * This guarantees every query inside `fn(tx)` uses the same session+transaction,
 * so your policies see app.account_id/app.role.
 *
 * Usage:
 *   return withRls(req, async (db) => {
 *     return db.group.findMany({ ... }); // use `db`, NOT the global `prisma`
 *   });
 */
export async function withRls<T>(
  req: NextRequest,
  fn: (db: Prisma.TransactionClient) => Promise<T>,
  opts?: { roleOverride?: string }
): Promise<T> {
  const zephrAccountId = accountIdFrom(req);
  if (!zephrAccountId) throw new Error("No active account");

  const role = opts?.roleOverride ?? roleFrom(req);

  return prisma.$transaction(async (tx) => {
    // Set GUCs for this transaction/connection only.
    await tx.$executeRaw`select set_config('app.account_id', ${zephrAccountId}, true)`;
    await tx.$executeRaw`select set_config('app.role', ${role}, true)`;

    // All queries must use `tx`
    return fn(tx);
  });
}
