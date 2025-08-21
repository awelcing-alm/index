import { prisma } from "@/lib/prisma";

/** Must be awaited at the top of each request handler */
export async function applyRlsContext({
  zephrAccountId,  // e.g. from cookie "active_account_id"
  role,            // 'owner' | 'admin' | 'user'
}: { zephrAccountId: string; role?: string }) {
  // Both are LOCAL to the connection; prisma's pool reuses connections,
  // so do this at the start of every request!
  await prisma.$executeRaw`select set_config('app.account_id', ${zephrAccountId}, true)`;
  await prisma.$executeRaw`select set_config('app.role', ${role ?? 'user'}, true)`;
}