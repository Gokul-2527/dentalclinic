import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animation/SmoothScroll";
import { getSiteContent } from "@/lib/api/client";
import { siteUrl } from "@/lib/seo/metadata";
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: "Dental clinic", template: "%s | Dental clinic" } };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getSiteContent();
  const ld = { "@context": "https://schema.org", "@type": "Dentist", name: c.settings.name, telephone: c.settings.phone, email: c.settings.email, address: c.settings.address, url: siteUrl };
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-peach focus:p-3">Skip to content</a>
        <SmoothScroll /><Navbar name={c.settings.name} />
        <main id="main">{children}</main><Footer c={c} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
