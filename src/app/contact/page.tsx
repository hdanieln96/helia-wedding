import { Suspense } from "react";
import sql from "@/lib/db";
import type { ContactField } from "@/types";
import type { SocialLink } from "@/components/social-icons";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ContactClient from "@/components/contact-client";

export const metadata = {
  title: "Contact | Helia Wedding",
  description: "Get in touch to book your wedding photography consultation.",
};

export default async function ContactPage() {
  const [fields, packages, settings, content, socialLinks] = await Promise.all([
    sql`SELECT * FROM contact_fields WHERE is_active = true ORDER BY sort_order`,
    sql`SELECT name FROM service_packages WHERE is_active = true ORDER BY sort_order`,
    sql`SELECT key, value FROM site_settings`,
    sql`SELECT * FROM site_content WHERE section = 'contact_subtitle'`,
    sql`SELECT * FROM social_links ORDER BY sort_order`,
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  const packageNames = packages.map((p) => p.name as string);

  return (
    <>
      <Navbar />
      <Suspense>
        <ContactClient
          fields={fields as ContactField[]}
          packageNames={packageNames}
          settings={settingsMap}
          socialLinks={socialLinks as SocialLink[]}
          title={content[0]?.title || "Let's Connect"}
          subtitle={content[0]?.body || ""}
        />
      </Suspense>
      <Footer />
    </>
  );
}
