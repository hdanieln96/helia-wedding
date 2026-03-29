"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

// ── Packages ──

export async function addPackage(name: string, subtitle: string, price: string) {
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM service_packages`;
  await sql`
    INSERT INTO service_packages (name, subtitle, price, sort_order)
    VALUES (${name}, ${subtitle}, ${price}, ${maxOrder[0].next})
  `;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function updatePackage(id: number, name: string, subtitle: string, price: string, isPopular: boolean) {
  await sql`
    UPDATE service_packages
    SET name = ${name}, subtitle = ${subtitle}, price = ${price}, is_popular = ${isPopular}
    WHERE id = ${id}
  `;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function deletePackage(id: number) {
  await sql`DELETE FROM service_packages WHERE id = ${id}`;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function togglePackageActive(id: number, isActive: boolean) {
  await sql`UPDATE service_packages SET is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/services");
}

// ── Package Features ──

export async function addFeature(packageId: number, feature: string) {
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM package_features WHERE package_id = ${packageId}`;
  await sql`
    INSERT INTO package_features (package_id, feature, sort_order)
    VALUES (${packageId}, ${feature}, ${maxOrder[0].next})
  `;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function updateFeature(id: number, feature: string) {
  await sql`UPDATE package_features SET feature = ${feature} WHERE id = ${id}`;
  revalidatePath("/services");
}

export async function deleteFeature(id: number) {
  await sql`DELETE FROM package_features WHERE id = ${id}`;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

// ── Add-Ons ──

export async function addAddon(name: string, description: string, price: string) {
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM service_addons`;
  await sql`
    INSERT INTO service_addons (name, description, price, sort_order)
    VALUES (${name}, ${description}, ${price}, ${maxOrder[0].next})
  `;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function updateAddon(id: number, name: string, description: string, price: string) {
  await sql`
    UPDATE service_addons SET name = ${name}, description = ${description}, price = ${price}
    WHERE id = ${id}
  `;
  revalidatePath("/services");
}

export async function deleteAddon(id: number) {
  await sql`DELETE FROM service_addons WHERE id = ${id}`;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

// ── Booking Steps ──

export async function addBookingStep(title: string, description: string) {
  const maxStep = await sql`SELECT COALESCE(MAX(step_number), 0) + 1 as next FROM booking_steps`;
  await sql`
    INSERT INTO booking_steps (step_number, title, description, sort_order)
    VALUES (${maxStep[0].next}, ${title}, ${description}, ${maxStep[0].next - 1})
  `;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function updateBookingStep(id: number, title: string, description: string) {
  await sql`UPDATE booking_steps SET title = ${title}, description = ${description} WHERE id = ${id}`;
  revalidatePath("/services");
}

export async function deleteBookingStep(id: number) {
  await sql`DELETE FROM booking_steps WHERE id = ${id}`;
  revalidatePath("/services");
  revalidatePath("/admin/services");
}
