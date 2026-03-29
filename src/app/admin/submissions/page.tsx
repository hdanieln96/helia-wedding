import sql from "@/lib/db";
import SubmissionsClient from "@/components/admin/submissions-client";

export default async function AdminSubmissionsPage() {
  const submissions = await sql`
    SELECT * FROM contact_submissions
    WHERE is_archived = false
    ORDER BY created_at DESC
  `;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Contact Submissions</h1>
      <p className="text-sm text-gray-500 mt-1">
        View and manage inquiries from your contact form.
      </p>
      <SubmissionsClient submissions={submissions as any} />
    </div>
  );
}
