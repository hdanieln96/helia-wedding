"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function updateSocialLink(id: number, url: string, isActive: boolean) {
  await requireAdmin();
  // Auto-fix URLs missing protocol
  let cleanUrl = url.trim();
  if (cleanUrl && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }
  await sql`UPDATE social_links SET url = ${cleanUrl}, is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/", "layout");
}
