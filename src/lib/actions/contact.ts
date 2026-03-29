"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

// ── Contact Form Submission (public) ──

export async function submitContactForm(formData: FormData) {
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && value.trim()) {
      data[key] = value;
    }
  });

  const fullName = data["Full Name"] || data["full_name"] || "";
  const email = data["Email"] || data["email"] || "";

  if (!fullName || !email) {
    return { success: false, error: "Name and email are required." };
  }

  try {
    await sql`
      INSERT INTO contact_submissions (full_name, email, phone, event_date, event_type, package_interest, venue, referral_source, message, form_data)
      VALUES (
        ${fullName},
        ${email},
        ${data["Phone"] || null},
        ${data["Event Date"] || null},
        ${data["Event Type"] || null},
        ${data["Package Interest"] || null},
        ${data["Venue / Location"] || null},
        ${data["How did you hear about us?"] || null},
        ${data["Your Message"] || null},
        ${JSON.stringify(data)}
      )
    `;

    sendContactNotification({
      fullName,
      email,
      phone: data["Phone"],
      eventDate: data["Event Date"],
      eventType: data["Event Type"],
      packageInterest: data["Package Interest"],
      venue: data["Venue / Location"],
      referralSource: data["How did you hear about us?"],
      message: data["Your Message"],
    }).catch(console.error);

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ── Contact Fields Admin CRUD ──

export async function addContactField(
  label: string,
  fieldType: string,
  placeholder: string,
  isRequired: boolean,
  options: string
) {
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM contact_fields`;
  await sql`
    INSERT INTO contact_fields (label, field_type, placeholder, is_required, options, sort_order)
    VALUES (${label}, ${fieldType}, ${placeholder}, ${isRequired}, ${options || null}, ${maxOrder[0].next})
  `;
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
}

export async function updateContactField(
  id: number,
  label: string,
  fieldType: string,
  placeholder: string,
  isRequired: boolean,
  options: string
) {
  await sql`
    UPDATE contact_fields
    SET label = ${label}, field_type = ${fieldType}, placeholder = ${placeholder},
        is_required = ${isRequired}, options = ${options || null}
    WHERE id = ${id}
  `;
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
}

export async function deleteContactField(id: number) {
  await sql`DELETE FROM contact_fields WHERE id = ${id}`;
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
}

export async function toggleContactField(id: number, isActive: boolean) {
  await sql`UPDATE contact_fields SET is_active = ${isActive} WHERE id = ${id}`;
  revalidatePath("/contact");
}

export async function toggleContactFieldRequired(id: number, isRequired: boolean) {
  await sql`UPDATE contact_fields SET is_required = ${isRequired} WHERE id = ${id}`;
  revalidatePath("/contact");
}

export async function updateContactPageContent(title: string, subtitle: string) {
  await sql`
    UPDATE site_content SET title = ${title}, body = ${subtitle}
    WHERE section = 'contact_subtitle'
  `;
  revalidatePath("/contact");
}
