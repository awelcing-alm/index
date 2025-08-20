// app/api/zephr/schema/users/route.ts
import { NextResponse } from "next/server"
import { adminApiCall } from "@/lib/api-client" // your existing Zephr server helper

export async function GET() {
  try {
    const json = await adminApiCall("/v3/schema/users", { method: "GET" })
    // pass-through so the client can choose how to filter
    return NextResponse.json({ ok: true, data: json?.data ?? [], raw: json })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Failed to fetch Zephr user schema" },
      { status: 500 }
    )
  }
}
