"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Pages where hero is dark (navbar should start transparent with white text)
  const isHeroPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const showWhiteText = isHeroPage && !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: isHeroPage ? 2 : 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHeroPage
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src={showWhiteText ? "/White-logo.png" : "/dark-logo.png"}
              alt="Helia Wedding"
              width={36}
              height={36}
              className="sm:w-10 sm:h-10"
            />
            <span
              className={`font-[family-name:var(--font-heading)] text-lg sm:text-xl tracking-wider transition-colors duration-500 ${
                showWhiteText ? "text-white" : "text-charcoal"
              }`}
            >
              Helia Wedding
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-gold"
                    : showWhiteText
                      ? "text-white/80 hover:text-gold"
                      : "text-charcoal/70 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 z-50"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px transition-all duration-300 ${
                mobileOpen
                  ? "rotate-45 translate-y-[3.5px] bg-charcoal"
                  : showWhiteText ? "bg-white" : "bg-charcoal"
              }`}
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0"
                  : showWhiteText ? "bg-white" : "bg-charcoal"
              }`}
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${
                mobileOpen
                  ? "-rotate-45 -translate-y-[3.5px] bg-charcoal"
                  : showWhiteText ? "bg-white" : "bg-charcoal"
              }`}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-6"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className={`font-[family-name:var(--font-heading)] text-2xl tracking-[0.15em] uppercase transition-colors ${
                    pathname === link.href ? "text-gold" : "text-charcoal hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs px-8 py-5 rounded-none mt-4">
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
