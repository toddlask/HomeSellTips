import Image from "next/image";
import type { ReactNode } from "react";
import {
  ZILLOW_FOOTER_BANNER,
  ZILLOW_HOME_BANNER,
  ZILLOW_HREF,
  ZILLOW_PAGE_BANNER,
  type ZillowBannerArt,
} from "@/lib/zillow-banner";

function ZillowBannerLink({
  art,
  className,
  priority = false,
}: {
  art: ZillowBannerArt;
  className: string;
  priority?: boolean;
}) {
  return (
    <aside className={className}>
      <a href={ZILLOW_HREF} target="_blank" rel="noopener noreferrer">
        <Image
          src={art.src}
          alt={art.alt}
          width={art.width}
          height={art.height}
          unoptimized
          priority={priority}
          style={{ width: "auto", height: "auto", maxWidth: "100%" }}
        />
        <span className="zillow-banner-note">Opens in a new tab.</span>
      </a>
    </aside>
  );
}

export function ZillowHomeBanner() {
  return <ZillowBannerLink art={ZILLOW_HOME_BANNER} className="zillow-banner zillow-banner-home" />;
}

export function ZillowPageBanner() {
  return <ZillowBannerLink art={ZILLOW_PAGE_BANNER} className="zillow-banner zillow-banner-page" priority />;
}

export function ZillowFooterBannerArt() {
  return <ZillowBannerLink art={ZILLOW_FOOTER_BANNER} className="zillow-banner zillow-banner-footer" />;
}

export function ZillowPageFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <ZillowPageBanner />
      {children}
    </>
  );
}
