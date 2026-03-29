"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function updateSocialLink(id: number, url: string, isActive: boolean) {
  await requireAdmin();
  await sql`UPDATE social_links SET url = ${url}, is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/", "layout");
}
