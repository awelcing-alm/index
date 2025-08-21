// app/api/bulk-users/one/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ensureUserExists, attachUserToAccount } from "@/lib/zephr-api";

type Payload = {
  email: string;
  accountId: string;
  emailVerified?: boolean;
};

export async function POST(req: NextRequest) {
  let payload: Payload | null = null;

  try {
    payload = (await req.json()) as Payload;
    const { email, accountId, emailVerified } = payload;

    if (!email || !accountId) {
      return NextResponse.json(
        { error: "Missing 'email' or 'accountId'." },
        { status: 400 },
      );
    }

    // 1) ensure the user exists (optionally mark verified)
    const { user, created } = await ensureUserExists(email, {
      emailVerified,
    });

    // 2) attach to account (expects Zephr user_id)
    await attachUserToAccount({
      accountId,
      userExternalId: user.user_id,
    });

    return NextResponse.json({
      email,
      status: "success",
      message: created ? "User created and attached to account" : "User attached to account",
      userId: user.user_id,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        email: payload?.email,
        status: "error",
        message: err?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }
}
