// app/api/schema/users/route.ts
import { NextResponse } from "next/server"
import { adminApiCall } from "@/lib/api-client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Pass-through to Zephr v3 schema
    const data = await adminApiCall("/v3/schema/users", { method: "GET" })
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[/api/schema/users] error", err)
    return new NextResponse("Failed to load user schema", { status: 500 })
  }
}
