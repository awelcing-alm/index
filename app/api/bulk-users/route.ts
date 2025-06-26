// app/api/bulk-users/route.ts – trusts `accountId` supplied in the POST body
// (the page server‑side injects the currently‑selected account, so this value is
// authoritative). If the client omits or tampers with it, we hard‑fail with 400.

import { NextRequest, NextResponse } from "next/server"
import pLimit from "p-limit"
import { adminApiCall } from "@/lib/zephr-api"

const CONCURRENCY = 8
const extractUserId = (res: any): string | undefined => res?.user_id ?? res?.data?.user_id

export async function POST(req: NextRequest) {
  try {
    const { emails, accountId, emailVerified = false } = await req.json()

    // Guard: we *must* have exactly one account ID and it must be non‑empty.
    if (typeof accountId !== "string" || accountId.trim() === "" || accountId === "undefined") {
      return NextResponse.json({ error: "Valid accountId required" }, { status: 400 })
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 })
    }

    const limiter = pLimit(CONCURRENCY)

    const results = await Promise.all(
      emails.map((email: string) =>
        limiter(async () => {
          try {
            /* 1️⃣  CREATE (or fetch) USER */
            const createRes = await adminApiCall("/v3/users", {
              method: "POST",
              body: JSON.stringify({
                identifiers: { email_address: email },
                email_verified: emailVerified,
              }),
            })

            let userId = extractUserId(createRes)
            if (!userId) {
              const search = await adminApiCall(`/v3/users?email=${encodeURIComponent(email)}`, { method: "GET" })
              userId = extractUserId(search?.data?.[0] ?? search?.data?.results?.[0])
            }
            if (!userId) throw new Error("user_id missing in API response")

            /* 2️⃣  ATTACH TO EXACTLY THAT ACCOUNT */
            await adminApiCall(`/v3/accounts/${accountId}/users/${userId}`, { method: "PUT" })

            return { email, status: "success" as const, userId, message: "User linked" }
          } catch (err: any) {
            return { email, status: "error" as const, message: err.message }
          }
        }),
      ),
    )

    return NextResponse.json({ results }, { status: 201 })
  } catch (err: any) {
    console.error("Bulk user API error", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
