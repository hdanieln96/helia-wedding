"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export async function updateSettings(settings: Record<string, string>) {
  for (const [key, value] of Object.entries(settings)) {
    await sql`UPDATE site_settings SET value = ${value} WHERE key = ${key}`;
  }
  revalidatePath("/", "layout");
}
