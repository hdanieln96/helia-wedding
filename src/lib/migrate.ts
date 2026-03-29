import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const tables = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255),
    created_at    TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS hero_slides (
    id                   SERIAL PRIMARY KEY,
    image_url            TEXT NOT NULL,
    cloudinary_id        TEXT,
    mobile_image_url     TEXT,
    mobile_cloudinary_id TEXT,
    alt_text             VARCHAR(255),
    sort_order           INTEGER DEFAULT 0,
    is_active            BOOLEAN DEFAULT true,
    created_at           TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    id    SERIAL PRIMARY KEY,
    key   VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type  VARCHAR(20) DEFAULT 'text'
  )`,
  `CREATE TABLE IF NOT EXISTS site_content (
    id         SERIAL PRIMARY KEY,
    section    VARCHAR(100) UNIQUE NOT NULL,
    title      TEXT,
    body       TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS site_stats (
    id         SERIAL PRIMARY KEY,
    label      VARCHAR(100) NOT NULL,
    value      INTEGER NOT NULL,
    suffix     VARCHAR(10) DEFAULT '',
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_items (
    id            SERIAL PRIMARY KEY,
    category_id   INTEGER REFERENCES portfolio_categories(id) ON DELETE SET NULL,
    title         VARCHAR(255),
    image_url     TEXT NOT NULL,
    cloudinary_id TEXT,
    width         INTEGER,
    height        INTEGER,
    is_featured   BOOLEAN DEFAULT false,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS videos (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    embed_url     TEXT NOT NULL,
    thumbnail_url TEXT,
    cloudinary_id TEXT,
    category      VARCHAR(100) DEFAULT 'wedding',
    is_featured   BOOLEAN DEFAULT false,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS service_packages (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    subtitle     VARCHAR(255),
    price        VARCHAR(100),
    is_popular   BOOLEAN DEFAULT false,
    sort_order   INTEGER DEFAULT 0,
    is_active    BOOLEAN DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS package_features (
    id         SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES service_packages(id) ON DELETE CASCADE,
    feature    VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS service_addons (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    price       VARCHAR(100),
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS booking_steps (
    id          SERIAL PRIMARY KEY,
    step_number INTEGER NOT NULL,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order  INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id         SERIAL PRIMARY KEY,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active  BOOLEAN DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id            SERIAL PRIMARY KEY,
    client_name   VARCHAR(255) NOT NULL,
    quote         TEXT NOT NULL,
    event_type    VARCHAR(100),
    image_url     TEXT,
    cloudinary_id TEXT,
    is_featured   BOOLEAN DEFAULT false,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS team_members (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    role          VARCHAR(255),
    bio           TEXT,
    image_url     TEXT,
    cloudinary_id TEXT,
    sort_order    INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS about_sections (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(255),
    body           TEXT NOT NULL,
    image_url      TEXT,
    cloudinary_id  TEXT,
    image_position VARCHAR(10) DEFAULT 'left',
    sort_order     INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS featured_in (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    logo_url      TEXT,
    cloudinary_id TEXT,
    website_url   TEXT,
    sort_order    INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS contact_submissions (
    id               SERIAL PRIMARY KEY,
    full_name        VARCHAR(255) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    phone            VARCHAR(50),
    event_date       DATE,
    event_type       VARCHAR(100),
    package_interest VARCHAR(100),
    venue            VARCHAR(255),
    referral_source  VARCHAR(255),
    message          TEXT,
    is_read          BOOLEAN DEFAULT false,
    is_archived      BOOLEAN DEFAULT false,
    created_at       TIMESTAMP DEFAULT NOW(),
    form_data        JSONB
  )`,
  `CREATE TABLE IF NOT EXISTS contact_fields (
    id            SERIAL PRIMARY KEY,
    label         VARCHAR(255) NOT NULL,
    field_type    VARCHAR(50) NOT NULL DEFAULT 'text',
    placeholder   VARCHAR(255),
    is_required   BOOLEAN DEFAULT false,
    options       TEXT,
    sort_order    INTEGER DEFAULT 0,
    is_active     BOOLEAN DEFAULT true
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id            SERIAL PRIMARY KEY,
    client_name   VARCHAR(255) NOT NULL,
    rating        INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text   TEXT NOT NULL,
    event_type    VARCHAR(100),
    created_at    TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS social_links (
    id         SERIAL PRIMARY KEY,
    platform   VARCHAR(50) NOT NULL,
    url        TEXT NOT NULL DEFAULT '',
    is_active  BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
  )`,
];

async function migrate() {
  console.log("Running migrations...");
  for (let i = 0; i < tables.length; i++) {
    await sql.query(tables[i]);
    console.log(`  Created table ${i + 1}/${tables.length}`);
  }
  console.log("Migrations complete!");
}

migrate().catch(console.error);
