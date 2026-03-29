import sql from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import ReviewsClient from "@/components/reviews-client";

export const metadata = {
  title: "Reviews | Helia Wedding",
  description: "Read what our clients have to say about their experience with Helia Wedding.",
};

export default async function ReviewsPage() {
  const [reviews, settings, headerImg] = await Promise.all([
    sql`SELECT * FROM reviews ORDER BY created_at DESC`,
    sql`SELECT key, value FROM site_settings WHERE key IN ('show_star_rating', 'image_header_portfolio')`,
    sql`SELECT value FROM site_settings WHERE key = 'image_header_portfolio'`,
  ]);

  const showStars = settings.find((s) => s.key === "show_star_rating")?.value !== "false";

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum: number, r) => sum + (Number(r.rating) || 5), 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <>
      <Navbar />
      <PageHeader
        title="Kind Words"
        subtitle="What our clients say about their experience."
        imageUrl={headerImg[0]?.value || undefined}
      />
      <ReviewsClient
        reviews={reviews as any}
        showStars={showStars}
        avgRating={avgRating}
        totalReviews={reviews.length}
      />
      <Footer />
    </>
  );
}
