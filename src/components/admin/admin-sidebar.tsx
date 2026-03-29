"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/hero", label: "Hero Slides", icon: "image" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "camera" },
  { href: "/admin/videos", label: "Videos", icon: "film" },
  { href: "/admin/services", label: "Services", icon: "package" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
  { href: "/admin/about", label: "About", icon: "user" },
  { href: "/admin/faq", label: "FAQ", icon: "help" },
  { href: "/admin/contact", label: "Contact Page", icon: "inbox" },
  { href: "/admin/submissions", label: "Submissions", icon: "inbox" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/admin/help", label: "Help & Info", icon: "help" },
];

const icons: Record<string, React.ReactNode> = {
  grid: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" strokeWidth={1.5}/><rect x="14" y="3" width="7" height="7" strokeWidth={1.5}/><rect x="3" y="14" width="7" height="7" strokeWidth={1.5}/><rect x="14" y="14" width="7" height="7" strokeWidth={1.5}/></svg>,
  image: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5}/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5}/><path d="M21 15l-5-5L5 21" strokeWidth={1.5}/></svg>,
  camera: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" strokeWidth={1.5}/><circle cx="12" cy="13" r="4" strokeWidth={1.5}/></svg>,
  film: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" strokeWidth={1.5}/><line x1="7" y1="2" x2="7" y2="22" strokeWidth={1.5}/><line x1="17" y1="2" x2="17" y2="22" strokeWidth={1.5}/><line x1="2" y1="12" x2="22" y2="12" strokeWidth={1.5}/></svg>,
  package: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth={1.5}/></svg>,
  quote: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" strokeWidth={1.5}/></svg>,
  user: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth={1.5}/><circle cx="12" cy="7" r="4" strokeWidth={1.5}/></svg>,
  help: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5}/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeWidth={1.5}/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={1.5}/></svg>,
  inbox: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3H10l-2-3H2" strokeWidth={1.5}/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" strokeWidth={1.5}/></svg>,
  settings: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth={1.5}/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth={1.5}/></svg>,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Helia Wedding</h1>
        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
              isActive(item.href)
                ? "text-gold bg-gold/5 border-r-2 border-gold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {icons[item.icon]}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeWidth={1.5}/>
            <path d="M15 3h6v6M10 14L21 3" strokeWidth={1.5}/>
          </svg>
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth={1.5}/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        aria-label="Toggle admin menu"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {sidebar}
      </aside>
    </>
  );
}
