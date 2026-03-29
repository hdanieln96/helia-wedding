"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import HeroSlideshow from "@/components/hero-slideshow";
import StatsCounter from "@/components/stats-counter";
import SectionHeading from "@/components/section-heading";
import AnimatedLink from "@/components/animated-link";
import StarRating from "@/components/star-rating";
import type { HeroSlide, SiteStat, Testimonial, PortfolioItem } from "@/types";

interface HomeClientProps {
  heroSlides: HeroSlide[];
  stats: SiteStat[];
  testimonials: Testimonial[];
  storyTitle: string;
  storyBody: string;
  showreelUrl: string;
  showShowreel: boolean;
  featuredPhotos: PortfolioItem[];
  siteImages: Record<string, string>;
  showStars: boolean;
}

export default function HomeClient({
  heroSlides,
  stats,
  testimonials,
  storyTitle,
  storyBody,
  showreelUrl,
  showShowreel,
  featuredPhotos,
  siteImages,
  showStars,
}: HomeClientProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);


  const featuredTestimonial =
    testimonials.find((t) => t.is_featured) || testimonials[0];

  // Use placeholder if no hero slides in DB yet
  const slides =
    heroSlides.length > 0
      ? heroSlides
      : [
          { id: 1, image_url: "/hero-placeholder.jpg", alt_text: "Wedding", sort_order: 0, is_active: true, cloudinary_id: null, mobile_image_url: null, mobile_cloudinary_id: null, created_at: new Date() },
        ];

  return (
    <>

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <HeroSlideshow slides={slides} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl">
          {/* Stage 1: Logo + Name — immediate */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src="/White-logo.png"
              alt="Helia Wedding"
              width={100}
              height={100}
              className="mx-auto mb-6"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.06em] sm:tracking-[0.08em] font-light"
          >
            Helia Wedding
          </motion.h1>

          {/* Tagline — delayed */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="mx-auto mt-8 max-w-sm sm:max-w-md"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold" />
              <p className="text-gold/90 text-sm tracking-[0.4em] uppercase whitespace-nowrap">
                Photography & Videography
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold" />
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.3 }}
            className="mt-6 text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto"
          >
            Capturing your most precious moments with artistry,
            emotion, and timeless elegance.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/contact">
              <Button className="bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs px-10 py-6 rounded-none min-w-[200px] transition-all duration-300">
                Book a Consultation
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 tracking-[0.2em] uppercase text-xs px-10 py-6 rounded-none min-w-[200px] transition-all duration-300 bg-transparent"
              >
                View Our Work
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section ref={parallaxRef} className="relative py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <motion.div style={{ y: parallaxY }} className="absolute inset-[-20%]">
              <Image
                src={siteImages.image_story || "/hero-placeholder.jpg"}
                alt="Our story"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute inset-4 border border-gold/30 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">
              Our Story
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-light text-charcoal leading-tight">
              {storyTitle.includes("<em>")
                ? <>
                    {storyTitle.split("<em>")[0]}
                    <em>{storyTitle.split("<em>")[1]?.replace("</em>", "")}</em>
                  </>
                : storyTitle
              }
            </h2>
            <div className="mt-6 h-px w-16 bg-gold" />
            {storyBody.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mt-6 text-muted-foreground leading-[1.9] text-base">
                {paragraph}
              </p>
            ))}

            {stats.length > 0 && (
              <div className="mt-12">
                <StatsCounter stats={stats} />
              </div>
            )}

            <AnimatedLink href="/about" className="mt-10">
              Learn Our Story
            </AnimatedLink>
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES PREVIEW ═══ */}
      <section className="py-32 md:py-40 bg-charcoal text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="What We Offer"
            title="Our Services"
            subtitle="Every detail matters. We offer comprehensive services tailored to make your celebration truly unforgettable."
            light
          />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Wedding Photography", description: "Artful images that preserve the raw emotion and beauty of your celebration.", number: "01" },
              { title: "Cinematic Films", description: "Story-driven wedding films that let you relive every heartfelt moment.", number: "02" },
              { title: "Pre-Wedding Shoots", description: "Romantic sessions that capture the anticipation and excitement before the big day.", number: "03" },
              { title: "Post-Production", description: "Professional editing, color grading, and retouching for a flawless finish.", number: "04" },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative p-8 border border-white/10 hover:border-gold/40 transition-all duration-700 cursor-pointer"
              >
                <span className="font-[family-name:var(--font-heading)] text-5xl text-white/5 group-hover:text-gold/10 transition-colors duration-700 absolute top-4 right-6">
                  {service.number}
                </span>
                <div className="relative z-10">
                  <div className="h-px w-8 bg-gold mb-6" />
                  <h3 className="font-[family-name:var(--font-heading)] text-lg tracking-wide">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gold group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <AnimatedLink href="/services" light>
              Explore All Services
            </AnimatedLink>
          </div>
        </div>
      </section>

      {/* ═══ PORTFOLIO PREVIEW ═══ */}
      <section className="py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span className="text-gold text-xs tracking-[0.4em] uppercase">Portfolio</span>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-light text-charcoal">
                Featured Work
              </h2>
            </div>
            <AnimatedLink href="/portfolio">View All</AnimatedLink>
          </motion.div>

          {featuredPhotos.length > 0 ? (
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              {featuredPhotos[0] && (
                <PortfolioPreviewItem
                  className="col-span-12 md:col-span-7 aspect-[4/3]"
                  label={featuredPhotos[0].category_name || ""}
                  title={featuredPhotos[0].title || ""}
                  imageUrl={featuredPhotos[0].image_url}
                  delay={0}
                />
              )}
              <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
                {featuredPhotos[1] && (
                  <PortfolioPreviewItem
                    className=""
                    label={featuredPhotos[1].category_name || ""}
                    title={featuredPhotos[1].title || ""}
                    imageUrl={featuredPhotos[1].image_url}
                    delay={0.15}
                  />
                )}
                {featuredPhotos[2] && (
                  <PortfolioPreviewItem
                    className=""
                    label={featuredPhotos[2].category_name || ""}
                    title={featuredPhotos[2].title || ""}
                    imageUrl={featuredPhotos[2].image_url}
                    delay={0.3}
                  />
                )}
              </div>
              {featuredPhotos.slice(3, 6).map((photo, i) => (
                <PortfolioPreviewItem
                  key={photo.id}
                  className="col-span-4 aspect-square"
                  label=""
                  title={photo.title || ""}
                  imageUrl={photo.image_url}
                  delay={0.1 * i}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-3 md:gap-4">
              <PortfolioPreviewItem className="col-span-12 md:col-span-7 aspect-[4/3]" label="Wedding" title="A Beautiful Celebration" delay={0} />
              <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
                <PortfolioPreviewItem className="" label="Pre-Wedding" title="Love in the Golden Hour" delay={0.15} />
                <PortfolioPreviewItem className="" label="Event" title="Moments of Joy" delay={0.3} />
              </div>
              {["Ceremony", "Reception", "Details"].map((title, i) => (
                <PortfolioPreviewItem key={title} className="col-span-4 aspect-square" label="" title={title} delay={0.1 * i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      {testimonials.length > 0 && (
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="absolute inset-0">
            <Image src={siteImages.image_testimonial_bg || "/hero-placeholder.jpg"} alt="Background" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <span className="text-gold text-xs tracking-[0.4em] uppercase">Kind Words</span>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-light text-white tracking-wide">
                What Our Clients Say
              </h2>
              <div className="mt-6 h-px w-16 bg-gold mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative overflow-hidden aspect-[3/4]"
                >
                  {/* Background photo */}
                  {t.image_url ? (
                    <Image src={t.image_url} alt={t.client_name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 bg-charcoal" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <svg className="w-6 h-6 text-gold/50 mb-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                    </svg>
                    <p className="text-white text-sm leading-relaxed italic line-clamp-3">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <p className="text-gold text-sm tracking-wide">{t.client_name}</p>
                      {t.event_type && (
                        <span className="text-white/40 text-xs">· {t.event_type}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mt-10"
            >
              <AnimatedLink href="/reviews" light>
                See All Reviews
              </AnimatedLink>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ VIDEO SHOWREEL ═══ */}
      {showShowreel && <ShowreelSection url={showreelUrl} thumbnailUrl={siteImages.image_showreel_thumb || "/hero-placeholder.jpg"} />}

      {/* ═══ CTA ═══ */}
      <section className="py-32 md:py-40 bg-warm-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Get Started</span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-charcoal leading-tight">
              Let&apos;s Create Something<br /><em>Beautiful Together</em>
            </h2>
            <div className="mt-6 h-px w-16 bg-gold mx-auto" />
            <p className="mt-8 text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              Ready to tell your story? We&apos;d love to hear about your special day and how we can make it unforgettable.
            </p>
            <div className="mt-10">
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs px-12 py-6 rounded-none transition-all duration-300">
                  Start the Conversation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}

function getEmbedUrl(url: string): { type: "youtube" | "vimeo" | "gdrive" | "direct"; embedUrl: string } | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1` };

  // Google Drive
  const gdriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch) return { type: "gdrive", embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview` };

  // Direct video URL
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return { type: "direct", embedUrl: url };

  // Fallback — try as iframe
  return { type: "direct", embedUrl: url };
}

function ShowreelSection({ url, thumbnailUrl }: { url: string; thumbnailUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const embed = getEmbedUrl(url);

  return (
    <section className="py-32 md:py-40">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading label="Watch" title="Our Showreel" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative aspect-video bg-charcoal/5 overflow-hidden"
        >
          {playing && embed ? (
            embed.type === "direct" && !embed.embedUrl.includes("drive.google.com") ? (
              <video src={embed.embedUrl} autoPlay controls className="w-full h-full object-cover" />
            ) : (
              <iframe
                src={embed.embedUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                frameBorder="0"
              />
            )
          ) : (
            <div className="absolute inset-0 cursor-pointer group" onClick={() => setPlaying(true)}>
              <Image src={thumbnailUrl} alt="Video showreel" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:scale-110 group-hover:border-gold transition-all duration-500">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function PortfolioPreviewItem({
  className,
  label,
  title,
  delay,
  imageUrl = "/hero-placeholder.jpg",
}: {
  className: string;
  label: string;
  title: string;
  delay: number;
  imageUrl?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={`relative overflow-hidden group cursor-pointer bg-charcoal/5 ${className}`}
    >
      <Image
        src={imageUrl}
        alt={title || "Portfolio photo"}
        fill
        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        {label && (
          <p className="text-white text-xs tracking-[0.3em] uppercase">{label}</p>
        )}
        <h3 className="text-white font-[family-name:var(--font-heading)] text-lg mt-1">{title}</h3>
      </div>
    </motion.div>
  );
}
