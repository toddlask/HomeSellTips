import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Great_Vibes, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { HeaderAd, SidebarAd } from "@/components/ad-regions";
import { CookieConsent } from "@/components/cookie-consent";
import { HeaderSponsor } from "@/components/placement-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { adsenseClientId } from "@/lib/ads";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-display",
});

const scriptFont = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
});

export const revalidate = 86400;

export const viewport: Viewport = {
  themeColor: "#633e28",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: "Plain-language tips for selling a home in the United States, plus calculators you fill in yourself.",
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: SITE_NAME,
    description: "Plain-language tips for selling a home in the United States, plus calculators you fill in yourself.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Plain-language tips for selling a home in the United States, plus calculators you fill in yourself.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${scriptFont.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <HeaderSponsor />
        <HeaderAd />
        <div className="page-shell">
          <div className="wrap">
            <main id="main">{children}</main>
            <SidebarAd />
          </div>
        </div>
        <SiteFooter />
        <CookieConsent enabled={adsenseClientId(process.env.ADSENSE_PUBLISHER_ID) !== null} />
        <Analytics />
      </body>
    </html>
  );
}
