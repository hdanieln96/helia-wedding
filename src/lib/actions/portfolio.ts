"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { requireAdmin } from "@/lib/auth-check";

export async function addPortfolioItem(
  imageUrl: string,
  cloudinaryId: string,
  width: number,
  height: number,
  categoryId: number | null,
  title: string
) {
  await requireAdmin();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM portfolio_items`;
  await sql`
    INSERT INTO portfolio_items (image_url, cloudinary_id, width, height, category_id, title, sort_order)
    VALUES (${imageUrl}, ${cloudinaryId}, ${width}, ${height}, ${categoryId}, ${title}, ${maxOrder[0].next})
  `;
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function deletePortfolioItem(id: number) {
  await requireAdmin();
  await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function toggleFeatured(id: number, isFeatured: boolean) {
  await requireAdmin();
  await sql`UPDATE portfolio_items SET is_featured = ${isFeatured} WHERE id = ${id}`;
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function addCategory(name: string, slug: string) {
  await requireAdmin();
  await sql`INSERT INTO portfolio_categories (name, slug) VALUES (${name}, ${slug})`;
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  await sql`DELETE FROM portfolio_categories WHERE id = ${id}`;
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
}
