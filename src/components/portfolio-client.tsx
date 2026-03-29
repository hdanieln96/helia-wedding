"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Lightbox from "@/components/lightbox";
import type { PortfolioCategory, PortfolioItem } from "@/types";

interface PortfolioClientProps {
  categories: PortfolioCategory[];
  items: PortfolioItem[];
}

export default function PortfolioClient({ categories, items }: PortfolioClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category_slug === activeCategory);

  const lightboxImages = filteredItems.map((item) => ({
    url: item.image_url,
    title: item.title || undefined,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  // Show placeholder if no items in DB yet
  const showPlaceholder = items.length === 0;

  return (
    <>
      {/* Category Filter */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`text-xs tracking-[0.3em] uppercase whitespace-nowrap transition-colors ${
              activeCategory === "all"
                ? "text-gold"
                : "text-muted-foreground hover:text-charcoal"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`text-xs tracking-[0.3em] uppercase whitespace-nowrap transition-colors ${
                activeCategory === cat.slug
                  ? "text-gold"
                  : "text-muted-foreground hover:text-charcoal"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {showPlaceholder ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-lg">
                Portfolio coming soon. Check back for our latest work.
              </p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-3 md:gap-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="mb-3 md:mb-4 break-inside-avoid overflow-hidden group cursor-pointer relative"
                    onClick={() => openLightbox(i)}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title || "Portfolio photo"}
                      width={item.width || 800}
                      height={item.height || 600}
                      className="w-full h-auto transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      {item.title && (
                        <h3 className="text-white font-[family-name:var(--font-heading)] text-sm tracking-wide">
                          {item.title}
                        </h3>
                      )}
                      {item.category_name && (
                        <p className="text-white/60 text-xs tracking-[0.2em] uppercase mt-1">
                          {item.category_name}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % filteredItems.length)}
      />
    </>
  );
}
