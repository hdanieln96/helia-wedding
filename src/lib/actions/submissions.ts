"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function markAsRead(id: number) {
  await requireAdmin();
  await sql`UPDATE contact_submissions SET is_read = true WHERE id = ${id}`;
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function archiveSubmission(id: number) {
  await requireAdmin();
  await sql`UPDATE contact_submissions SET is_archived = true WHERE id = ${id}`;
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
