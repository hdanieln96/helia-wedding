import sql from "@/lib/db";
import AboutAdmin from "@/components/admin/about-admin";

export default async function AdminAboutPage() {
  const [sections, team, stats] = await Promise.all([
    sql`SELECT * FROM about_sections ORDER BY sort_order`,
    sql`SELECT * FROM team_members ORDER BY sort_order`,
    sql`SELECT * FROM site_stats ORDER BY sort_order`,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">About Page</h1>
      <p className="text-sm text-gray-500 mt-1">Manage your story, team, and stats.</p>
      <AboutAdmin sections={sections as any} team={team as any} stats={stats as any} />
    </div>
  );
}
