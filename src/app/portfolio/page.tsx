import sql from "@/lib/db";
import type { PortfolioCategory, PortfolioItem } from "@/types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import PortfolioClient from "@/components/portfolio-client";

export const metadata = {
  title: "Portfolio | Helia Wedding",
  description: "Explore our curated collection of wedding photography and videography.",
};

export default async function PortfolioPage() {
  const [categories, items, headerImg] = await Promise.all([
    sql`SELECT * FROM portfolio_categories ORDER BY sort_order`,
    sql`
      SELECT pi.*, pc.name as category_name, pc.slug as category_slug
      FROM portfolio_items pi
      LEFT JOIN portfolio_categories pc ON pi.category_id = pc.id
      ORDER BY pi.sort_order
    `,
    sql`SELECT value FROM site_settings WHERE key = 'image_header_portfolio'`,
  ]);

  return (
    <>
      <Navbar />
      <PageHeader
        title="Our Work"
        subtitle="A curated collection of moments we've had the honor of capturing."
        imageUrl={headerImg[0]?.value || undefined}
      />
      <PortfolioClient
        categories={categories as PortfolioCategory[]}
        items={items as PortfolioItem[]}
      />
      <Footer />
    </>
  );
}
