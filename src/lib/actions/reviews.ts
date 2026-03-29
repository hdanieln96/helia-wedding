"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

// ── Public ──

const reviewTimes: Map<string, number[]> = new Map();

export async function submitReview(formData: FormData) {
  const clientName = formData.get("clientName") as string;
  const rating = Number(formData.get("rating")) || 5;
  const reviewText = formData.get("reviewText") as string;
  const eventType = (formData.get("eventType") as string) || null;

  if (!clientName || !reviewText) {
    return { success: false, error: "Name and review are required." };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5." };
  }

  // Rate limit: 2 reviews per name per hour
  const now = Date.now();
  const key = clientName.toLowerCase().trim();
  const times = reviewTimes.get(key) || [];
  const recent = times.filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= 2) {
    return { success: false, error: "Too many reviews. Please try again later." };
  }
  recent.push(now);
  reviewTimes.set(key, recent);

  try {
    await sql`
      INSERT INTO reviews (client_name, rating, review_text, event_type)
      VALUES (${clientName}, ${rating}, ${reviewText}, ${eventType})
    `;
    revalidatePath("/reviews");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ── Admin ──

export async function deleteReview(id: number) {
  await requireAdmin();
  await sql`DELETE FROM reviews WHERE id = ${id}`;
  revalidatePath("/reviews");
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
