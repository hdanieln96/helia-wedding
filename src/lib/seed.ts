import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  console.log("Seeding database...");

  // Admin user (password: admin123 — change in production!)
  const passwordHash = await hash("admin123", 12);
  await sql`
    INSERT INTO admin_users (email, password_hash, name)
    VALUES ('admin@heliawedding.com', ${passwordHash}, 'Admin')
    ON CONFLICT (email) DO NOTHING
  `;

  // Site settings
  const settings = [
    { key: "tagline", value: "Photography & Videography", type: "text" },
    { key: "email", value: "hello@heliawedding.com", type: "email" },
    { key: "phone", value: "(555) 123-4567", type: "phone" },
    { key: "address", value: "Los Angeles, California", type: "text" },
    { key: "instagram_url", value: "https://instagram.com/heliawedding", type: "url" },
    { key: "facebook_url", value: "https://facebook.com/heliawedding", type: "url" },
    { key: "tiktok_url", value: "https://tiktok.com/@heliawedding", type: "url" },
    { key: "youtube_url", value: "", type: "url" },
    { key: "showreel_url", value: "", type: "url" },
    { key: "office_hours", value: "Monday - Friday: 9:00 AM - 6:00 PM", type: "text" },
  ];
  for (const s of settings) {
    await sql`
      INSERT INTO site_settings (key, value, type)
      VALUES (${s.key}, ${s.value}, ${s.type})
      ON CONFLICT (key) DO NOTHING
    `;
  }

  // Site content
  const content = [
    {
      section: "home_story_title",
      title: "Where Art Meets Emotion",
      body: null,
    },
    {
      section: "home_story",
      title: null,
      body: "We believe every love story has its own unique rhythm and beauty. Our passion lies in discovering those quiet, genuine moments — the stolen glances, the tears of joy, the unscripted laughter — and transforming them into timeless visual narratives.\n\nWith a blend of documentary authenticity and fine-art elegance, we create photographs and films that don't just capture how your day looked, but how it felt.",
    },
    {
      section: "services_philosophy",
      title: "Every Detail Matters",
      body: "We approach each celebration with fresh eyes and an artist's heart. Our services are designed to give you complete peace of mind, so you can be fully present in every moment while we quietly capture the magic unfolding around you.",
    },
    {
      section: "contact_subtitle",
      title: "Let's Connect",
      body: "We'd love to hear about your special day. Tell us your story and let's create something beautiful together.",
    },
    {
      section: "about_philosophy",
      title: "Our Approach",
      body: "We blend documentary storytelling with fine-art aesthetics. Our style is unobtrusive yet intentional — we capture the real moments as they unfold while creating space for timeless, editorial portraits that you'll treasure forever.",
    },
  ];
  for (const c of content) {
    await sql`
      INSERT INTO site_content (section, title, body)
      VALUES (${c.section}, ${c.title}, ${c.body})
      ON CONFLICT (section) DO NOTHING
    `;
  }

  // Site stats
  const stats = [
    { label: "Years Experience", value: 8, suffix: "+", sort_order: 0 },
    { label: "Happy Couples", value: 200, suffix: "+", sort_order: 1 },
    { label: "Photos Delivered", value: 50, suffix: "K+", sort_order: 2 },
  ];
  for (const s of stats) {
    await sql`
      INSERT INTO site_stats (label, value, suffix, sort_order)
      VALUES (${s.label}, ${s.value}, ${s.suffix}, ${s.sort_order})
    `;
  }

  // Portfolio categories
  const categories = [
    { name: "Wedding Day", slug: "wedding-day", sort_order: 0 },
    { name: "Pre-Wedding", slug: "pre-wedding", sort_order: 1 },
    { name: "Engagement", slug: "engagement", sort_order: 2 },
    { name: "Events", slug: "events", sort_order: 3 },
  ];
  for (const c of categories) {
    await sql`
      INSERT INTO portfolio_categories (name, slug, sort_order)
      VALUES (${c.name}, ${c.slug}, ${c.sort_order})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  // Service packages
  await sql`
    INSERT INTO service_packages (name, subtitle, price, is_popular, sort_order)
    VALUES
      ('Essential', 'Perfect for intimate celebrations', 'Contact Us', false, 0),
      ('Premium', 'Our most popular package', 'Contact Us', true, 1),
      ('Luxury', 'The complete experience', 'Contact Us', false, 2)
    ON CONFLICT DO NOTHING
  `;

  // Package features
  const packages = await sql`SELECT id, name FROM service_packages ORDER BY sort_order`;
  for (const pkg of packages) {
    let features: string[] = [];
    if (pkg.name === "Essential") {
      features = [
        "1 photographer",
        "6 hours of coverage",
        "Wedding day coordination",
        "300+ edited photos",
        "Online gallery for sharing & download",
        "Full quality, no watermarks",
      ];
    } else if (pkg.name === "Premium") {
      features = [
        "2 photographers",
        "8 hours of coverage",
        "Engagement session included",
        "Wedding day coordination",
        "500+ edited photos",
        "30 sneak peek photos within 1 week",
        "Online gallery for sharing & download",
        "Full quality, no watermarks",
        "Highlight video (4-6 min)",
      ];
    } else if (pkg.name === "Luxury") {
      features = [
        "2 photographers + 1 videographer",
        "Full day coverage (unlimited hours)",
        "Engagement session included",
        "Pre-wedding shoot",
        "Wedding day coordination",
        "800+ edited photos",
        "50 sneak peek photos within 1 week",
        "Online gallery for sharing & download",
        "Full quality, no watermarks",
        "Cinematic highlight film (8-10 min)",
        "Full ceremony & reception film",
        "Premium photo album (30 pages)",
      ];
    }
    for (let i = 0; i < features.length; i++) {
      await sql`
        INSERT INTO package_features (package_id, feature, sort_order)
        VALUES (${pkg.id}, ${features[i]}, ${i})
      `;
    }
  }

  // Service add-ons
  const addons = [
    { name: "Extra Coverage Hour", description: "Additional hour of photography coverage", price: "Contact Us" },
    { name: "Second Videographer", description: "Additional videographer for multi-angle coverage", price: "Contact Us" },
    { name: "Drone Footage", description: "Aerial photography and videography of your venue", price: "Contact Us" },
    { name: "Photo Album Upgrade", description: "Premium fine-art album with custom design", price: "Contact Us" },
    { name: "Same-Day Edit", description: "A short highlight video delivered on your wedding day", price: "Contact Us" },
    { name: "Canvas Print", description: "24x36 gallery-quality canvas of your favorite photo", price: "Contact Us" },
  ];
  for (let i = 0; i < addons.length; i++) {
    await sql`
      INSERT INTO service_addons (name, description, price, sort_order)
      VALUES (${addons[i].name}, ${addons[i].description}, ${addons[i].price}, ${i})
    `;
  }

  // Booking steps
  const steps = [
    { step: 1, title: "Initial Inquiry", desc: "Reach out through our contact form or give us a call to tell us about your special day." },
    { step: 2, title: "Consultation", desc: "We'll schedule a meeting to discuss your vision, style preferences, and event details." },
    { step: 3, title: "Custom Proposal", desc: "Receive a tailored package proposal designed around your unique celebration." },
    { step: 4, title: "Secure Your Date", desc: "Sign the agreement and place a deposit to reserve your wedding date." },
    { step: 5, title: "Pre-Wedding Planning", desc: "We coordinate timelines, scout locations, and plan every detail together." },
    { step: 6, title: "Your Wedding Day", desc: "Relax and enjoy every moment while we capture the magic as it unfolds." },
    { step: 7, title: "Sneak Peek", desc: "Receive a curated selection of your best photos within 1-2 weeks." },
    { step: 8, title: "Final Delivery", desc: "Your complete gallery and films are delivered within 6-8 weeks, ready to cherish forever." },
  ];
  for (const s of steps) {
    await sql`
      INSERT INTO booking_steps (step_number, title, description, sort_order)
      VALUES (${s.step}, ${s.title}, ${s.desc}, ${s.step - 1})
    `;
  }

  // FAQs
  const faqs = [
    { q: "How far in advance should we book?", a: "We recommend booking 8-12 months before your wedding date, especially for peak season (May-October). Popular dates fill up quickly, so the earlier you reach out, the better!" },
    { q: "Do you travel for weddings?", a: "Absolutely! We love destination weddings and are happy to travel anywhere. Travel fees may apply for locations outside our service area, which we'll discuss during your consultation." },
    { q: "How long until we receive our photos?", a: "You'll receive a curated sneak peek within 1-2 weeks. Your complete gallery will be delivered within 6-8 weeks after your wedding, depending on the season." },
    { q: "Can we request specific shots?", a: "Of course! We'll work together to create a photography plan that includes all your must-have shots while still capturing the natural, candid moments of your day." },
    { q: "What happens if it rains on our wedding day?", a: "Rain can actually create some of the most dramatic and romantic photos! We always have backup plans and creative solutions. Some of our most stunning work has been captured in the rain." },
    { q: "Do you offer payment plans?", a: "Yes, we offer flexible payment plans. Typically, a deposit secures your date and the remaining balance can be split into installments leading up to your wedding day." },
  ];
  for (let i = 0; i < faqs.length; i++) {
    await sql`
      INSERT INTO faqs (question, answer, sort_order)
      VALUES (${faqs[i].q}, ${faqs[i].a}, ${i})
    `;
  }

  // Testimonials
  const testimonials = [
    { name: "Sarah & James", quote: "Helia Wedding captured our day so beautifully. Every photo tells a story and every frame brings back the emotions we felt. We couldn't have asked for anything more perfect.", type: "Wedding", featured: true },
    { name: "Emily & Michael", quote: "From the first consultation to the final delivery, the experience was nothing short of exceptional. They made us feel so comfortable and the results exceeded our wildest expectations.", type: "Wedding", featured: false },
    { name: "Jessica & David", quote: "The attention to detail and artistic vision is unmatched. Our wedding film still makes us cry happy tears every time we watch it. Truly a work of art.", type: "Wedding", featured: false },
  ];
  for (let i = 0; i < testimonials.length; i++) {
    await sql`
      INSERT INTO testimonials (client_name, quote, event_type, is_featured, sort_order)
      VALUES (${testimonials[i].name}, ${testimonials[i].quote}, ${testimonials[i].type}, ${testimonials[i].featured}, ${i})
    `;
  }

  // About sections
  await sql`
    INSERT INTO about_sections (title, body, image_position, sort_order)
    VALUES
      ('Our Beginning', 'What started as a passion for capturing beautiful moments has grown into a dedicated studio committed to telling love stories through artful photography and cinematic videography. Every wedding we photograph reminds us why we fell in love with this craft in the first place.', 'right', 0),
      ('Our Philosophy', 'We believe the best photographs happen when people forget the camera is there. Our approach is unobtrusive yet intentional — we blend into your celebration, capturing authentic emotions and real connections as they unfold naturally.', 'left', 1)
  `;

  console.log("Seeding complete!");
}

seed().catch(console.error);
