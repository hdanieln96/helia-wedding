"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/lib/actions/contact";
import SocialLinksDisplay from "@/components/social-icons";
import type { SocialLink } from "@/components/social-icons";
import type { ContactField } from "@/types";

interface ContactClientProps {
  fields: ContactField[];
  packageNames: string[];
  settings: Record<string, string>;
  socialLinks: SocialLink[];
  title: string;
  subtitle: string;
}

export default function ContactClient({ fields, packageNames, settings, socialLinks, title, subtitle }: ContactClientProps) {
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get("package") || "";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Something went wrong.");
    }
    setLoading(false);
  }

  function renderField(field: ContactField) {
    const labelEl = (
      <Label htmlFor={field.label} className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
        {field.label} {field.is_required && "*"}
      </Label>
    );

    switch (field.field_type) {
      case "textarea":
        return (
          <div key={field.id}>
            {labelEl}
            <Textarea
              id={field.label}
              name={field.label}
              required={field.is_required}
              placeholder={field.placeholder || ""}
              rows={5}
              className="mt-2 rounded-none border-border focus:border-gold resize-none"
            />
          </div>
        );

      case "select":
        const options = field.options ? field.options.split(",").map((o) => o.trim()) : [];
        return (
          <div key={field.id}>
            {labelEl}
            <select
              id={field.label}
              name={field.label}
              required={field.is_required}
              className="mt-2 w-full h-10 px-3 border border-border bg-transparent text-sm focus:border-gold focus:outline-none"
            >
              <option value="">{field.placeholder || "Select..."}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );

      case "package-select":
        return (
          <div key={field.id}>
            {labelEl}
            <select
              id={field.label}
              name={field.label}
              defaultValue={preselectedPackage}
              className="mt-2 w-full h-10 px-3 border border-border bg-transparent text-sm focus:border-gold focus:outline-none"
            >
              <option value="">{field.placeholder || "Select package"}</option>
              {packageNames.map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
        );

      default: // text, email, tel, date
        return (
          <div key={field.id}>
            {labelEl}
            <Input
              id={field.label}
              name={field.label}
              type={field.field_type}
              required={field.is_required}
              placeholder={field.placeholder || ""}
              className="mt-2 rounded-none border-border focus:border-gold"
            />
          </div>
        );
    }
  }

  // Split fields into pairs for two-column layout on wider screens
  // Single fields (textarea) get full width
  const fieldRows: ContactField[][] = [];
  let i = 0;
  while (i < fields.length) {
    if (fields[i].field_type === "textarea") {
      fieldRows.push([fields[i]]);
      i++;
    } else if (i + 1 < fields.length && fields[i + 1].field_type !== "textarea") {
      fieldRows.push([fields[i], fields[i + 1]]);
      i += 2;
    } else {
      fieldRows.push([fields[i]]);
      i++;
    }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold text-xs tracking-[0.4em] uppercase">Contact</span>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-charcoal">
              {title}
            </h1>
            <div className="mt-6 h-px w-16 bg-gold mx-auto" />
            {subtitle && (
              <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Split Layout */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl text-charcoal">
                  Thank You
                </h3>
                <p className="mt-4 text-muted-foreground max-w-sm">
                  We&apos;ve received your message and will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {fieldRows.map((row, idx) => (
                  <div
                    key={idx}
                    className={row.length === 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : ""}
                  >
                    {row.map((field) => renderField(field))}
                  </div>
                ))}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-xs py-6 rounded-none transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  We typically respond within 24 hours.
                </p>
              </form>
            )}
          </motion.div>

          {/* Contact Info + Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src="/hero-placeholder.jpg" alt="Contact" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
            </div>

            <div className="space-y-6 pt-4">
              {settings.email && (
                <div>
                  <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Email</h4>
                  <a href={`mailto:${settings.email}`} className="text-charcoal hover:text-gold transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings.phone && (
                <div>
                  <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Phone</h4>
                  <a href={`tel:${settings.phone}`} className="text-charcoal hover:text-gold transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings.address && (
                <div>
                  <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Location</h4>
                  <p className="text-charcoal">{settings.address}</p>
                </div>
              )}
              {settings.office_hours && (
                <div>
                  <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Hours</h4>
                  <p className="text-muted-foreground text-sm">{settings.office_hours}</p>
                </div>
              )}
              <div>
                <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Follow Us</h4>
                <SocialLinksDisplay links={socialLinks} className="" iconClassName="w-5 h-5 text-charcoal" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
