"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/section-heading";
import type { ServicePackage, ServiceAddon, BookingStep, FAQ, SiteContent } from "@/types";

interface ServicesClientProps {
  packages: ServicePackage[];
  addons: ServiceAddon[];
  steps: BookingStep[];
  faqs: FAQ[];
  philosophy: SiteContent | null;
}

export default function ServicesClient({
  packages,
  addons,
  steps,
  faqs,
  philosophy,
}: ServicesClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Philosophy */}
      {philosophy && (
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-light text-charcoal italic">
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

      {/* Packages */}
      <section className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Packages" title="Choose Your Package" />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative p-8 md:p-10 border transition-all duration-500 ${
                  pkg.is_popular
                    ? "border-gold bg-charcoal text-white"
                    : "border-border hover:border-gold/50"
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] tracking-[0.3em] uppercase px-4 py-1">
                    Most Popular
                  </div>
                )}

                <h3 className="font-[family-name:var(--font-heading)] text-2xl tracking-wide">
                  {pkg.name}
                </h3>
                {pkg.subtitle && (
                  <p className={`mt-2 text-sm ${pkg.is_popular ? "text-white/60" : "text-muted-foreground"}`}>
                    {pkg.subtitle}
                  </p>
                )}
                <p className="mt-4 font-[family-name:var(--font-heading)] text-xl text-gold">
                  {pkg.price}
                </p>

                <div className="mt-6 h-px w-full bg-gold/20" />

                <ul className="mt-6 space-y-3">
                  {pkg.features?.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3 text-sm">
                      <svg
                        className="w-4 h-4 text-gold mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={pkg.is_popular ? "text-white/80" : "text-muted-foreground"}>
                        {feature.feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href={`/contact?package=${encodeURIComponent(pkg.name)}`}>
                    <Button
                      className={`w-full tracking-[0.2em] uppercase text-xs py-5 rounded-none transition-all duration-300 ${
                        pkg.is_popular
                          ? "bg-gold hover:bg-gold-dark text-white"
                          : "bg-charcoal hover:bg-charcoal/90 text-white"
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      {addons.length > 0 && (
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              label="Extras"
              title="Add-Ons"
              subtitle="Enhance your package with these additional services."
            />
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {addons.map((addon, i) => (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 border border-border hover:border-gold/30 transition-all duration-500"
                >
                  <h4 className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-charcoal">
                    {addon.name}
                  </h4>
                  {addon.description && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {addon.description}
                    </p>
                  )}
                  {addon.price && (
                    <p className="mt-3 text-gold text-sm font-medium">{addon.price}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Timeline */}
      {steps.length > 0 && (
        <section className="py-24 md:py-32 px-6 bg-charcoal text-white">
          <div className="max-w-4xl mx-auto">
            <SectionHeading label="Process" title="Your Journey With Us" light />

            <div className="mt-16 relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gold/20" />

              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 mb-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Step number circle */}
                  <div className="shrink-0 w-10 h-10 rounded-full border border-gold bg-charcoal flex items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span className="text-gold text-xs">{step.step_number}</span>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 md:w-[calc(50%-40px)] ${i % 2 === 0 ? "md:pr-12 lg:pr-16 md:text-right" : "md:pl-12 lg:pl-16"}`}>
                    <h4 className="font-[family-name:var(--font-heading)] text-lg tracking-wide">
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="mt-2 text-white/50 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1 md:w-[calc(50%-40px)]" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading label="FAQ" title="Common Questions" />

            <div className="mt-16 space-y-4">
              {faqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-warm-white/50 transition-colors"
                  >
                    <span className="font-[family-name:var(--font-heading)] text-base tracking-wide text-charcoal pr-4">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: openFaq === faq.id ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gold text-xl shrink-0"
                    >
                      +
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === faq.id ? "auto" : 0,
                      opacity: openFaq === faq.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 bg-warm-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeading
              label="Ready?"
              title="Let&apos;s Capture Your Story"
              subtitle="Contact us today to discuss your vision and find the perfect package for your special day."
            />
            <div className="mt-10">
              <Link href="/contact">
                <Button className="bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs px-12 py-6 rounded-none">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
