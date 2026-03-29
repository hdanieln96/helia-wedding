// ============================================================
// Database entity types for Helia Wedding
// ============================================================

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: Date;
}

export interface HeroSlide {
  id: number;
  image_url: string;
  cloudinary_id: string | null;
  mobile_image_url: string | null;
  mobile_cloudinary_id: string | null;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: string;
}

export interface SiteContent {
  id: number;
  section: string;
  title: string | null;
  body: string | null;
  updated_at: Date;
}

export interface SiteStat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
}

export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
}

export interface PortfolioItem {
  id: number;
  category_id: number | null;
  title: string | null;
  image_url: string;
  cloudinary_id: string | null;
  width: number | null;
  height: number | null;
  is_featured: boolean;
  sort_order: number;
  created_at: Date;
  // Joined fields
  category_name?: string;
  category_slug?: string;
}

export interface Video {
  id: number;
  title: string;
  embed_url: string;
  thumbnail_url: string | null;
  cloudinary_id: string | null;
  category: string;
  is_featured: boolean;
  sort_order: number;
  created_at: Date;
}

export interface ServicePackage {
  id: number;
  name: string;
  subtitle: string | null;
  price: string | null;
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
  features?: PackageFeature[];
}

export interface PackageFeature {
  id: number;
  package_id: number;
  feature: string;
  sort_order: number;
}

export interface ServiceAddon {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface BookingStep {
  id: number;
  step_number: number;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: number;
  client_name: string;
  quote: string;
  event_type: string | null;
  image_url: string | null;
  cloudinary_id: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: Date;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  cloudinary_id: string | null;
  sort_order: number;
}

export interface AboutSection {
  id: number;
  title: string | null;
  body: string;
  image_url: string | null;
  cloudinary_id: string | null;
  image_position: "left" | "right";
  sort_order: number;
}

export interface FeaturedIn {
  id: number;
  name: string;
  logo_url: string | null;
  cloudinary_id: string | null;
  website_url: string | null;
  sort_order: number;
}

export interface ContactField {
  id: number;
  label: string;
  field_type: "text" | "email" | "tel" | "date" | "select" | "textarea" | "package-select";
  placeholder: string | null;
  is_required: boolean;
  options: string | null; // comma-separated for select fields
  sort_order: number;
  is_active: boolean;
}

export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  event_date: Date | null;
  event_type: string | null;
  package_interest: string | null;
  venue: string | null;
  referral_source: string | null;
  message: string | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: Date;
}
