import sql from "@/lib/db";
import PortfolioAdmin from "@/components/admin/portfolio-admin";

export default async function AdminPortfolioPage() {
  const [items, categories] = await Promise.all([
    sql`
      SELECT pi.*, pc.name as category_name
      FROM portfolio_items pi
      LEFT JOIN portfolio_categories pc ON pi.category_id = pc.id
      ORDER BY pi.sort_order
    `,
    sql`SELECT * FROM portfolio_categories ORDER BY sort_order`,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Portfolio</h1>
      <p className="text-sm text-gray-500 mt-1">Manage your gallery photos and categories.</p>
      <PortfolioAdmin items={items as any} categories={categories as any} />
    </div>
  );
}
