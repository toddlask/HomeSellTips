"use client";

import { usePathname } from "next/navigation";
import { ZillowFooterBannerArt } from "@/components/zillow-banner";
import { isFooterBannerPath } from "@/lib/zillow-banner";

export function ZillowFooterBanner() {
  const pathname = usePathname() ?? "";
  if (!isFooterBannerPath(pathname)) {
    return null;
  }
  return <ZillowFooterBannerArt />;
}
