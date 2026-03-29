import sql from "@/lib/db";
import ContactAdmin from "@/components/admin/contact-admin";

export default async function AdminContactPage() {
  const [fields, content] = await Promise.all([
    sql`SELECT * FROM contact_fields ORDER BY sort_order`,
    sql`SELECT * FROM site_content WHERE section = 'contact_subtitle'`,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Contact Page</h1>
      <p className="text-sm text-gray-500 mt-1">Customize the contact page text and form fields.</p>
      <ContactAdmin
        fields={fields as any}
        pageTitle={content[0]?.title || "Let's Connect"}
        pageSubtitle={content[0]?.body || ""}
      />
    </div>
  );
}
