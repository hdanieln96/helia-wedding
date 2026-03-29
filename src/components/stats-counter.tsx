"use client";

import { useEffect, useState } from "react";
import { useIntersection } from "@/hooks/use-intersection";
import type { SiteStat } from "@/types";

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function StatItem({ stat, inView }: { stat: SiteStat; inView: boolean }) {
  const count = useCountUp(stat.value, inView);
  return (
    <div>
      <span className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl text-charcoal">
        {count}
        <span className="text-gold">{stat.suffix}</span>
      </span>
      <p className="mt-1 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase text-muted-foreground">
        {stat.label}
      </p>
    </div>
  );
}

interface StatsCounterProps {
  stats: SiteStat[];
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  const { ref, inView } = useIntersection(0.3);

  return (
    <div
      ref={ref}
      className="grid grid-cols-3 gap-8 pt-8 border-t border-border"
    >
      {stats.map((stat) => (
        <StatItem key={stat.id} stat={stat} inView={inView} />
      ))}
    </div>
  );
}
