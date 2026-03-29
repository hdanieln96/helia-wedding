import sql from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [portfolioCount, submissionCount, unreadCount, testimonialCount] =
    await Promise.all([
      sql`SELECT COUNT(*) as count FROM portfolio_items`,
      sql`SELECT COUNT(*) as count FROM contact_submissions WHERE is_archived = false`,
      sql`SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = false AND is_archived = false`,
      sql`SELECT COUNT(*) as count FROM testimonials`,
    ]);

  const recentSubmissions = await sql`
    SELECT id, full_name, email, event_type, is_read, created_at
    FROM contact_submissions
    WHERE is_archived = false
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const stats = [
    { label: "Portfolio Photos", value: portfolioCount[0].count, href: "/admin/portfolio" },
    { label: "Total Inquiries", value: submissionCount[0].count, href: "/admin/submissions" },
    { label: "Unread", value: unreadCount[0].count, href: "/admin/submissions" },
    { label: "Testimonials", value: testimonialCount[0].count, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome to your Helia Wedding admin panel.</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-4 sm:p-6 border border-gray-200 hover:border-gold/50 transition-colors"
          >
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1 tracking-wide uppercase">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
          <Link href="/admin/submissions" className="text-sm text-gold hover:text-gold-dark transition-colors">
            View all
          </Link>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          {recentSubmissions.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 text-center">No submissions yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href="/admin/submissions"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {!sub.is_read && (
                      <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${sub.is_read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                        {sub.full_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{sub.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {sub.event_type && (
                      <span className="text-xs text-gray-500">{sub.event_type}</span>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/portfolio"
            className="px-4 py-2 bg-charcoal text-white text-sm hover:bg-charcoal/90 transition-colors"
          >
            + Add Photo
          </Link>
          <Link
            href="/admin/hero"
            className="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-700 hover:border-gold/50 transition-colors"
          >
            Edit Hero Slides
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-700 hover:border-gold/50 transition-colors"
          >
            Site Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
