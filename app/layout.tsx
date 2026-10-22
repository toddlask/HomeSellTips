import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { HeaderAd, SidebarAd } from "@/components/ad-regions";
import { CookieConsent } from "@/components/cookie-consent";
import { HeaderSponsor } from "@/components/placement-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "./globals.css";

export const revalidate = 86400;

export const viewport: Viewport = {
  themeColor: "#1e4d3a",
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
  icons: { icon: "/favicon.svg" },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: SITE_NAME,
    description: "Plain-language tips for selling a home in the United States, plus calculators you fill in yourself.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
        <CookieConsent />
      </body>
    </html>
  );
}
