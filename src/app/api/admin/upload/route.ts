import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "heic",
  "heif",
]);
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

function isSupportedImage(file: File) {
  if (file.type.toLowerCase().startsWith("image/")) {
    return true;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension ? IMAGE_EXTENSIONS.has(extension) : false;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "helia-wedding";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!isSupportedImage(file)) {
    return NextResponse.json(
      {
        error:
          "Unsupported image file. Please use JPG, PNG, WebP, AVIF, HEIC, or HEIF.",
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 20MB." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, folder);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
