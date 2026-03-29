import sql from "@/lib/db";
import type { AboutSection, TeamMember, SiteStat, SiteContent } from "@/types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHeader from "@/components/page-header";
import AboutClient from "@/components/about-client";

export const metadata = {
  title: "About | Helia Wedding",
  description: "Learn about our story, our team, and our approach to wedding photography.",
};

export default async function AboutPage() {
  const [sections, team, stats, philosophy] = await Promise.all([
    sql`SELECT * FROM about_sections ORDER BY sort_order`,
    sql`SELECT * FROM team_members ORDER BY sort_order`,
    sql`SELECT * FROM site_stats ORDER BY sort_order`,
    sql`SELECT * FROM site_content WHERE section = 'about_philosophy'`,
  ]);

  return (
    <>
      <Navbar />
      <PageHeader title="Our Story" subtitle="The heart behind the lens." />
      <AboutClient
        sections={sections as AboutSection[]}
        team={team as TeamMember[]}
        stats={stats as SiteStat[]}
        philosophy={(philosophy[0] as SiteContent) || null}
      />
      <Footer />
    </>
  );
}
