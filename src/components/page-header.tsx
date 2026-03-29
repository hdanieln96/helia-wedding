"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function PageHeader({
  title,
  subtitle,
  imageUrl = "/hero-placeholder.jpg",
}: PageHeaderProps) {
  return (
    <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white tracking-[0.06em] sm:tracking-[0.08em] font-light"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-white/70 text-lg tracking-wide max-w-xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 h-px bg-gold mx-auto"
        />
      </div>
    </section>
  );
}
