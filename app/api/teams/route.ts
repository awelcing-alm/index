// app/api/teams/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { listTeams, saveTeam, deleteTeam } from "@/lib/teams";
import { getUsersByAccount } from "@/lib/user-api";

export const runtime = "nodejs";

async function currentAccountId(): Promise<string | null> {
  const c = await cookies();
  return c.get("active_account_id")?.value ?? null;
}

export async function GET(req: NextRequest) {
  const accountId = await currentAccountId();
  if (!accountId) return NextResponse.json([], { status: 200 });

  const includeMembers =
    req.nextUrl.searchParams.get("includeMembers") === "true";

  const teams = await listTeams(accountId);
  if (!includeMembers) return NextResponse.json(teams);

  // derive counts from Zephr only when requested
  const users = await getUsersByAccount(accountId);
  const counts = new Map<string, number>();
  for (const u of users) {
    const teamId = (u as any)?.attributes?.team as string | undefined;
    if (teamId) counts.set(teamId, (counts.get(teamId) ?? 0) + 1);
  }
  const withCounts = teams.map((t) => ({
    ...t,
    member_count: counts.get(t.id) ?? 0,
  }));
  return NextResponse.json(withCounts);
}

export async function POST(req: NextRequest) {
  const accountId = await currentAccountId();
  if (!accountId)
    return NextResponse.json({ error: "No active account" }, { status: 400 });

  const body = await req.json();
  if (!body?.id || !body?.name) {
    return NextResponse.json(
      { error: "Missing team id/name" },
      { status: 400 }
    );
  }
  await saveTeam(accountId, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const accountId = await currentAccountId();
  if (!accountId)
    return NextResponse.json({ error: "No active account" }, { status: 400 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteTeam(accountId, id);
  return NextResponse.json({ ok: true });
}
