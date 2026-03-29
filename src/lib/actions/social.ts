"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export async function updateSocialLink(id: number, url: string, isActive: boolean) {
  await sql`UPDATE social_links SET url = ${url}, is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/", "layout");
}
