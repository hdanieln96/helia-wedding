import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, label, value, suffix } = await request.json();
  await sql`UPDATE site_stats SET label = ${label}, value = ${value}, suffix = ${suffix} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
