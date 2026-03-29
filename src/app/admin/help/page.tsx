export default function AdminHelpPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900">Help & Instructions</h1>
      <p className="text-sm text-gray-500 mt-1">Everything you need to know to manage your Helia Wedding website.</p>

      <div className="mt-8 space-y-8">

        {/* Getting Started */}
        <Section title="Getting Started">
          <p>Welcome to your Helia Wedding admin dashboard! From here you can manage every aspect of your website — photos, services, testimonials, contact form, and more.</p>
          <p>Use the sidebar on the left to navigate between sections. Any changes you make will be reflected on your live website immediately.</p>
        </Section>

        {/* Account Info */}
        <Section title="Account Information">
          <InfoRow label="Admin Login" value="/login on your website" />
          <InfoRow label="Email" value="admin@heliawedding.com" />
          <InfoRow label="Password" value="Contact your developer for password" />
          <Tip>To change your password, contact your developer.</Tip>
        </Section>

        {/* Connected Services */}
        <Section title="Connected Services">
          <p>Your website uses these services behind the scenes. They are all set up and require no maintenance. This info is here for reference only.</p>

          <SubSection title="Image Storage — Cloudinary">
            <p>All your uploaded photos are stored on Cloudinary. You don&apos;t need to manage this directly — just upload through the admin panel.</p>
            <InfoRow label="Dashboard" value="https://cloudinary.com/console" link />
            <InfoRow label="Login" value="Google auth with heliaweddingteam@gmail.com" />
            <InfoRow label="Cloud Name" value="dbwuqe9pq" />
            <InfoRow label="Free Storage" value="25 GB (photos auto-optimized)" />
          </SubSection>

          <SubSection title="Database — Neon">
            <p>Your website content (text, settings, form submissions) is stored in a Neon database.</p>
            <InfoRow label="Dashboard" value="https://console.neon.tech" link />
            <InfoRow label="Login" value="Google auth with heliaweddingteam@gmail.com" />
            <InfoRow label="Free Storage" value="500 MB" />
            <Tip>You should never need to access Neon directly. Everything is managed through this admin panel.</Tip>
          </SubSection>

          <SubSection title="Email Notifications — Resend">
            <p>When someone submits the contact form, you receive an email notification via Resend.</p>
            <InfoRow label="Dashboard" value="https://resend.com" link />
            <InfoRow label="Login" value="Google auth with heliaweddingteam@gmail.com" />
            <InfoRow label="Free Limit" value="3,000 emails per month" />
            <InfoRow label="Notifications sent to" value="hello@heliawedding.com (changeable in Settings)" />
          </SubSection>

          <SubSection title="Hosting — Vercel">
            <p>Your website is hosted on Vercel. It deploys automatically when code is updated.</p>
            <InfoRow label="Dashboard" value="https://vercel.com" link />
            <InfoRow label="Login" value="Google auth with heliaweddingteam@gmail.com" />
            <InfoRow label="Plan" value="Hobby (free)" />
          </SubSection>
        </Section>

        {/* How To Guides */}
        <Section title="How To...">
          <SubSection title="Add Hero Slideshow Images">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to <strong>Hero Slides</strong> in the sidebar</li>
              <li>Click <strong>Upload Desktop Image</strong> (landscape, 1920px+ wide recommended)</li>
              <li>Optionally click the <strong>+</strong> box to add a mobile version (portrait)</li>
              <li>Toggle the slide <strong>on/off</strong> as needed</li>
              <li>Add multiple slides — they&apos;ll auto-rotate every 6 seconds</li>
            </ol>
          </SubSection>

          <SubSection title="Add Portfolio Photos">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to <strong>Portfolio</strong> in the sidebar</li>
              <li>Create categories first (e.g. &quot;Wedding Day&quot;, &quot;Pre-Wedding&quot;)</li>
              <li>Select a category, add a title, and click <strong>Upload</strong></li>
              <li>You can upload multiple photos at once</li>
              <li>Click the <strong>★</strong> star to feature a photo on the homepage</li>
            </ol>
          </SubSection>

          <SubSection title="Edit Service Packages">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to <strong>Services</strong> in the sidebar</li>
              <li>Use the <strong>Packages</strong> tab to add/edit/delete packages</li>
              <li>Add features to each package by typing and pressing Enter</li>
              <li>Use the <strong>Add-Ons</strong> tab for extra services</li>
              <li>Use the <strong>Booking Steps</strong> tab to customize your process timeline</li>
            </ol>
          </SubSection>

          <SubSection title="Add a Showreel Video">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Upload your video to <strong>Google Drive</strong> or <strong>YouTube</strong></li>
              <li>For Google Drive: right click → Share → set to &quot;Anyone with the link&quot;</li>
              <li>Copy the link</li>
              <li>Go to <strong>Settings</strong> → paste in the <strong>Showreel Video URL</strong> field</li>
              <li>Toggle on <strong>Show Showreel Section</strong></li>
              <li>Click <strong>Save Settings</strong></li>
            </ol>
          </SubSection>

          <SubSection title="Customize the Contact Form">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to <strong>Contact Page</strong> in the sidebar</li>
              <li>Edit the page title and subtitle at the top</li>
              <li>Add, edit, or remove form fields</li>
              <li>Toggle <strong>Required</strong> to make a field mandatory</li>
              <li>Toggle <strong>Visible</strong> to show/hide a field</li>
              <li>For dropdown fields, add options one by one using the <strong>+ Add</strong> button</li>
            </ol>
          </SubSection>

          <SubSection title="View Contact Submissions">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to <strong>Submissions</strong> in the sidebar</li>
              <li>New submissions show a gold <strong>&quot;New&quot;</strong> badge</li>
              <li>Click any row to view full details</li>
              <li>Click <strong>Reply via Email</strong> to respond directly</li>
              <li>Click <strong>Archive</strong> to remove from the list</li>
            </ol>
          </SubSection>

          <SubSection title="Update Social Media Links">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to <strong>Settings</strong> in the sidebar</li>
              <li>Scroll to the <strong>Social Media</strong> section</li>
              <li>Toggle on the platforms you use</li>
              <li>Paste your profile URL for each</li>
              <li>Click <strong>Save Social Links</strong></li>
            </ol>
          </SubSection>
        </Section>

        {/* Image Guidelines */}
        <Section title="Image Guidelines">
          <div className="bg-gray-50 p-4 rounded text-sm text-gray-600 space-y-2">
            <p><strong>Hero slides (desktop):</strong> Landscape, at least 1920 x 1080px. JPG recommended.</p>
            <p><strong>Hero slides (mobile):</strong> Portrait, at least 1080 x 1920px. Close-ups work best.</p>
            <p><strong>Portfolio photos:</strong> Any size — they&apos;ll be auto-optimized. Higher resolution = better quality.</p>
            <p><strong>File formats:</strong> JPG, PNG, or WebP. JPG is best for photos (smaller file size).</p>
            <p><strong>Storage limit:</strong> 25 GB on Cloudinary free tier. That&apos;s roughly 5,000-10,000 high-quality photos.</p>
          </div>
        </Section>

        {/* Need Help */}
        <Section title="Need Help?">
          <p>If you need any changes to the website that can&apos;t be done through this admin panel, or if something isn&apos;t working, contact your developer.</p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 first:mt-0 first:pt-0 first:border-0">
      <h3 className="text-sm font-medium text-gray-800 mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, link }: { label: string; value: string; link?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-1">
      <span className="text-xs text-gray-400 uppercase tracking-wider w-40 shrink-0">{label}</span>
      {link ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:text-gold-dark transition-colors">
          {value}
        </a>
      ) : (
        <span className="text-sm text-gray-700">{value}</span>
      )}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 bg-gold/5 border-l-2 border-gold px-3 py-2 text-xs text-gray-600">
      <strong className="text-gold">Tip:</strong> {children}
    </div>
  );
}
