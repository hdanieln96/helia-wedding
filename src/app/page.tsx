import sql from "@/lib/db";
import type { HeroSlide, SiteStat, Testimonial } from "@/types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HomeClient from "@/components/home-client";

export default async function Home() {
  const [heroSlides, stats, testimonials, storyContent, settings] =
    await Promise.all([
      sql`SELECT * FROM hero_slides WHERE is_active = true ORDER BY sort_order`,
      sql`SELECT * FROM site_stats ORDER BY sort_order`,
      sql`SELECT * FROM testimonials ORDER BY sort_order`,
      sql`SELECT * FROM site_content WHERE section IN ('home_story_title', 'home_story')`,
      sql`SELECT key, value FROM site_settings`,
    ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  const storyTitle =
    storyContent.find((c) => c.section === "home_story_title")?.title ||
    "Where Art Meets <em>Emotion</em>";
  const storyBody =
    storyContent.find((c) => c.section === "home_story")?.body || "";

  return (
    <>
      <Navbar />
      <HomeClient
        heroSlides={heroSlides as HeroSlide[]}
        stats={stats as SiteStat[]}
        testimonials={testimonials as Testimonial[]}
        storyTitle={storyTitle}
        storyBody={storyBody}
        showreelUrl={settingsMap.showreel_url || ""}
        showShowreel={settingsMap.show_showreel === "true"}
      />
      <Footer />
    </>
  );
}
