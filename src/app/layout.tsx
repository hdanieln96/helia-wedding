import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Helia Wedding | Photography & Videography",
    template: "%s | Helia Wedding",
  },
  description:
    "Capturing your most beautiful moments with artistry and elegance. Professional wedding photography and videography services.",
  keywords: [
    "wedding photography",
    "wedding videography",
    "wedding photographer",
    "wedding films",
    "engagement photography",
    "pre-wedding shoot",
  ],
  openGraph: {
    title: "Helia Wedding | Photography & Videography",
    description:
      "Capturing your most beautiful moments with artistry and elegance.",
    type: "website",
    locale: "en_US",
    siteName: "Helia Wedding",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helia Wedding | Photography & Videography",
    description:
      "Capturing your most beautiful moments with artistry and elegance.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
