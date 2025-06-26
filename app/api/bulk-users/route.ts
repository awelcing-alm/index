// app/api/bulk-users/route.ts – patched to reliably capture `user_id`
import { NextRequest, NextResponse } from "next/server"
import pLimit from "p-limit"
import { adminApiCall } from "@/lib/zephr-api"

const CONCURRENCY = 8

// 🔎 helper – Zephr sometimes wraps response in { data: { … } }
const extractUserId = (res: any): string | undefined =>
  res?.user_id ?? res?.data?.user_id ?? res?.data?.data?.user_id

export async function POST(req: NextRequest) {
  try {
    const { emails, accountId, emailVerified = false } = await req.json()

    if (!accountId) return NextResponse.json({ error: "Missing accountId" }, { status: 400 })
    if (!Array.isArray(emails) || emails.length === 0) return NextResponse.json({ error: "No emails provided" }, { status: 400 })

    const limiter = pLimit(CONCURRENCY)
    const results = await Promise.all(
      emails.map((email: string) =>
        limiter(async () => {
          /* 1️⃣ CREATE USER */
          try {
            const createRes = await adminApiCall("/v3/users", {
              method: "POST",
              body: JSON.stringify({
                identifiers: { email_address: email },
                email_verified: emailVerified,
              }),
            })

            let userId = extractUserId(createRes)

            // If Zephr returns 202/201 with no body, fetch by email
            if (!userId) {
              const search = await adminApiCall(`/v3/users?email=${encodeURIComponent(email)}`, { method: "GET" })
              userId = extractUserId(search?.data?.[0] ?? search?.data?.results?.[0])
            }

            if (!userId) throw new Error("user_id missing in API response")

            /* 2️⃣ ADD TO ACCOUNT */
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
    console.error(err)
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 })
  }
}
