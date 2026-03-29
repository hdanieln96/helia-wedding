import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps {
  href: string;
  children: string;
  light?: boolean;
  className?: string;
}

export default function AnimatedLink({
  href,
  children,
  light = false,
  className,
}: AnimatedLinkProps) {
  return (
    <Link href={href} className={cn("inline-block", className)}>
      <span
        className={cn(
          "group flex items-center gap-3 text-sm tracking-[0.2em] uppercase transition-colors",
          light
            ? "text-white/70 hover:text-gold"
            : "text-charcoal hover:text-gold"
        )}
      >
        {children}
        <span className="h-px w-8 bg-current group-hover:w-12 transition-all duration-300" />
      </span>
    </Link>
  );
}
