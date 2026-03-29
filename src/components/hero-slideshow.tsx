"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { HeroSlide } from "@/types";

interface HeroSlideshowProps {
  slides: HeroSlide[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrent((prev) => (prev + 1) % slides.length);
      } else {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  }

  if (slides.length === 0) {
    return <div className="absolute inset-0 bg-charcoal" />;
  }

  const currentSlide = slides[current];
  const imageUrl =
    isMobile && currentSlide.mobile_image_url
      ? currentSlide.mobile_image_url
      : currentSlide.image_url;

  return (
    <div
      className="absolute inset-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current}-${isMobile ? "m" : "d"}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { duration: 8, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={imageUrl}
            alt={currentSlide.alt_text || "Wedding photography"}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
            quality={85}
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-px transition-all duration-500 ${
                i === current ? "w-12 bg-gold" : "w-6 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
