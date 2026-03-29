import Link from "next/link";
import Image from "next/image";
import sql from "@/lib/db";
import SocialLinksDisplay from "@/components/social-icons";
import type { SocialLink } from "@/components/social-icons";

export default async function Footer() {
  let settingsMap: Record<string, string> = {};
  let socialLinks: SocialLink[] = [];
  try {
    const settings = await sql`SELECT key, value FROM site_settings`;
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    const links = await sql`SELECT * FROM social_links ORDER BY sort_order`;
    socialLinks = links as SocialLink[];
  } catch {
    // Fallback if DB is unavailable
  }

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/White-logo.png"
                alt="Helia Wedding"
                width={32}
                height={32}
              />
              <span className="font-[family-name:var(--font-heading)] text-lg tracking-wider text-white">
                Helia Wedding
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Capturing love stories through artful photography and cinematic videography.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/portfolio", label: "Portfolio" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-gold transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-5">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 text-sm text-white/50">
              {settingsMap.email && (
                <a href={`mailto:${settingsMap.email}`} className="hover:text-gold transition-colors">
                  {settingsMap.email}
                </a>
              )}
              {settingsMap.phone && (
                <a href={`tel:${settingsMap.phone}`} className="hover:text-gold transition-colors">
                  {settingsMap.phone}
                </a>
              )}
              {settingsMap.address && <p>{settingsMap.address}</p>}

              <SocialLinksDisplay links={socialLinks} className="mt-3" iconClassName="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/30 tracking-wider">
            &copy; {new Date().getFullYear()} Helia Wedding. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
