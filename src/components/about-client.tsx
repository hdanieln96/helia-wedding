"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import StatsCounter from "@/components/stats-counter";
import SectionHeading from "@/components/section-heading";
import type { AboutSection, TeamMember, SiteStat, SiteContent } from "@/types";

interface AboutClientProps {
  sections: AboutSection[];
  team: TeamMember[];
  stats: SiteStat[];
  philosophy: SiteContent | null;
}

export default function AboutClient({ sections, team, stats, philosophy }: AboutClientProps) {
  return (
    <>
      {/* Story Sections — alternating image/text */}
      {sections.map((section, i) => (
        <section key={section.id} className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: section.image_position === "left" ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`relative aspect-[4/5] overflow-hidden ${
                section.image_position === "right" ? "lg:order-2" : ""
              }`}
            >
              <Image
                src={section.image_url || "/hero-placeholder.jpg"}
                alt={section.title || "About"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: section.image_position === "left" ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={section.image_position === "right" ? "lg:order-1" : ""}
            >
              {section.title && (
                <>
                  <span className="text-gold text-xs tracking-[0.4em] uppercase">
                    Chapter {i + 1}
                  </span>
                  <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-light text-charcoal">
                    {section.title}
                  </h2>
                  <div className="mt-6 h-px w-16 bg-gold" />
                </>
              )}
              {section.body.split("\n\n").map((p, j) => (
                <p key={j} className="mt-6 text-muted-foreground leading-[1.9]">
                  {p}
                </p>
              ))}
            </motion.div>
          </div>
        </section>
      ))}

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-16 px-6 bg-charcoal">
          <div className="max-w-4xl mx-auto">
            <div className="[&_*]:!text-white [&_*]:!border-white/20">
              <StatsCounter stats={stats} />
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading label="The Team" title="Meet the Artists" />
            <div className={`mt-16 grid gap-12 ${team.length === 1 ? "max-w-lg mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-6">
                    <Image
                      src={member.image_url || "/hero-placeholder.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl tracking-wide text-charcoal">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="mt-1 text-gold text-xs tracking-[0.3em] uppercase">{member.role}</p>
                  )}
                  {member.bio && (
                    <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy */}
      {philosophy && (
        <section className="py-24 md:py-32 px-6 bg-warm-white">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase">Philosophy</span>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-light text-charcoal italic">
                {philosophy.title}
              </h2>
              <div className="mt-6 h-px w-16 bg-gold mx-auto" />
              <p className="mt-8 text-muted-foreground text-lg leading-[1.9]">
                {philosophy.body}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            label="Connect"
            title="Let&apos;s Tell Your Story"
            subtitle="We'd love to learn about your vision and create something beautiful together."
          />
          <div className="mt-10">
            <Link href="/contact">
              <Button className="bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs px-12 py-6 rounded-none">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
