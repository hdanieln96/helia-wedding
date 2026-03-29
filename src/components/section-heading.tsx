"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {label && (
        <span
          className={cn(
            "text-xs tracking-[0.4em] uppercase",
            light ? "text-gold" : "text-gold"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-light tracking-wide",
          light ? "text-white" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mt-6 h-px w-16 bg-gold",
          align === "center" && "mx-auto"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "mt-8 leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
            light ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
