import sql from "@/lib/db";
import FAQAdmin from "@/components/admin/faq-admin";

export default async function AdminFAQPage() {
  const faqs = await sql`SELECT * FROM faqs ORDER BY sort_order`;
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">FAQ</h1>
      <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions shown on the services page.</p>
      <FAQAdmin faqs={faqs as any} />
    </div>
  );
}
