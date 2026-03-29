"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function addHeroSlide(
  imageUrl: string,
  cloudinaryId: string,
  altText: string,
  mobileImageUrl?: string,
  mobileCloudinaryId?: string
) {
  await requireAdmin();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM hero_slides`;
  await sql`
    INSERT INTO hero_slides (image_url, cloudinary_id, alt_text, mobile_image_url, mobile_cloudinary_id, sort_order)
    VALUES (${imageUrl}, ${cloudinaryId}, ${altText}, ${mobileImageUrl || null}, ${mobileCloudinaryId || null}, ${maxOrder[0].next})
  `;
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function updateHeroMobileImage(id: number, mobileImageUrl: string, mobileCloudinaryId: string) {
  await requireAdmin();
  await sql`
    UPDATE hero_slides SET mobile_image_url = ${mobileImageUrl}, mobile_cloudinary_id = ${mobileCloudinaryId}
    WHERE id = ${id}
  `;
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function deleteHeroSlide(id: number) {
  await requireAdmin();
  await sql`DELETE FROM hero_slides WHERE id = ${id}`;
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function toggleHeroSlide(id: number, isActive: boolean) {
  await requireAdmin();
  await sql`UPDATE hero_slides SET is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/");
  revalidatePath("/admin/hero");
}
