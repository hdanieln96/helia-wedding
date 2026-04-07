import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId } = await request.json();
  if (!publicId) {
    return NextResponse.json({ error: "No publicId provided" }, { status: 400 });
  }

  try {
    await deleteImage(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete upload failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 }
    );
  }
}
