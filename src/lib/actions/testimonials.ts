"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function addTestimonial(clientName: string, quote: string, eventType: string, isFeatured: boolean, imageUrl?: string, cloudinaryId?: string) {
  await requireAdmin();
  await sql`
    INSERT INTO testimonials (client_name, quote, event_type, is_featured, image_url, cloudinary_id)
    VALUES (${clientName}, ${quote}, ${eventType}, ${isFeatured}, ${imageUrl || null}, ${cloudinaryId || null})
  `;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(id: number, clientName: string, quote: string, eventType: string, isFeatured: boolean, imageUrl?: string, cloudinaryId?: string) {
  await requireAdmin();
  if (imageUrl !== undefined) {
    await sql`
      UPDATE testimonials
      SET client_name = ${clientName}, quote = ${quote}, event_type = ${eventType}, is_featured = ${isFeatured}, image_url = ${imageUrl || null}, cloudinary_id = ${cloudinaryId || null}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      UPDATE testimonials
      SET client_name = ${clientName}, quote = ${quote}, event_type = ${eventType}, is_featured = ${isFeatured}
      WHERE id = ${id}
    `;
  }
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: number) {
  await requireAdmin();
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
