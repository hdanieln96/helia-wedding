"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export async function addFAQ(question: string, answer: string) {
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM faqs`;
  await sql`INSERT INTO faqs (question, answer, sort_order) VALUES (${question}, ${answer}, ${maxOrder[0].next})`;
  revalidatePath("/services");
  revalidatePath("/admin/faq");
}

export async function updateFAQ(id: number, question: string, answer: string) {
  await sql`UPDATE faqs SET question = ${question}, answer = ${answer} WHERE id = ${id}`;
  revalidatePath("/services");
  revalidatePath("/admin/faq");
}

export async function deleteFAQ(id: number) {
  await sql`DELETE FROM faqs WHERE id = ${id}`;
  revalidatePath("/services");
  revalidatePath("/admin/faq");
}

export async function toggleFAQ(id: number, isActive: boolean) {
  await sql`UPDATE faqs SET is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/services");
}
