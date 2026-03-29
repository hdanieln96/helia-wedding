"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function updateSettings(settings: Record<string, string>) {
  await requireAdmin();
  for (const [key, value] of Object.entries(settings)) {
    await sql`UPDATE site_settings SET value = ${value} WHERE key = ${key}`;
  }
  revalidatePath("/", "layout");
}
