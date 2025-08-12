// app/api/users/[id]/route.ts
import { NextResponse } from "next/server"
import { getUserDetails, updateUserAttributes } from "@/lib/zephr-api"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserDetails(params.id)
    return NextResponse.json(user)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { attributes } = await req.json()
    await updateUserAttributes(params.id, attributes)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
