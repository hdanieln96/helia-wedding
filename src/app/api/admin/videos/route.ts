import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, embed_url, category } = await request.json();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM videos`;
  await sql`INSERT INTO videos (title, embed_url, category, sort_order) VALUES (${title}, ${embed_url}, ${category}, ${maxOrder[0].next})`;
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  await sql`DELETE FROM videos WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}
