# Helia Wedding

Photography & videography wedding business website.

## Tech Stack
- **Next.js 16.2** (App Router, Turbopack)
- **Tailwind CSS v4** + **shadcn/ui** (components)
- **Neon Postgres** (database, free tier)
- **Cloudinary** (image storage/optimization, free tier)
- **NextAuth.js** (admin authentication)
- **Resend** (contact form email notifications, free tier)
- **Framer Motion** (animations)
- **Vercel** (hosting, Hobby plan)

## Design
- **Brand**: Helia Wedding — minimalist sun/starburst logo
- **Palette**:
  - Primary: `#3C3C3C` (dark charcoal)
  - Background: `#F2F1EF` (warm off-white)
  - Accent: `#C4A87C` (warm gold)
  - Secondary: `#B5C4B1` (soft sage)
  - Text: `#1A1A1A` (near black)
- **Style**: Clean, minimal, elegant — serif headings, sans-serif body, smooth animations, mobile-first
- **Logo file**: `logo.JPG` in project root

## Pages
1. **Home** — hero, preview sections, testimonials carousel
2. **Portfolio** — filterable gallery (Weddings, Events, Portraits, Videos), lightbox, video embeds
3. **Services** — service cards with optional pricing
4. **About** — bio, photo, story, stats
5. **Contact** — consultation request form with email notification

## Admin Dashboard (`/admin`)
- Password-protected (single admin account)
- Manage photos, videos, services, about content, testimonials
- View/manage contact form submissions
- Edit site settings (social links, contact info, tagline)

## Key Decisions
- All images go through Cloudinary (auto-resize, format optimization)
- Videos are YouTube/Vimeo embeds (no self-hosted video)
- Admin panel is part of the same app, not a separate service
- Everything runs on free tiers — total cost is just the domain
