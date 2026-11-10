export const ZILLOW_HREF = "https://www.zillow.com/";

export type ZillowBannerArt = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const ZILLOW_HOME_BANNER: ZillowBannerArt = {
  src: "/zillow-banner-smaller.png",
  width: 853,
  height: 480,
  alt: "Advertisement. Zillow. Thinking about selling? Explore homes and your local market.",
};

export const ZILLOW_PAGE_BANNER: ZillowBannerArt = {
  src: "/zillow-thin-banner.png",
  width: 1024,
  height: 212,
  alt: "Advertisement. Zillow. Thinking about selling? Explore your local market.",
};

export const ZILLOW_FOOTER_BANNER: ZillowBannerArt = {
  src: "/zillow-footer-banner-text-lowered.png",
  width: 1024,
  height: 80,
  alt: "Advertisement. Zillow. Thinking about selling?",
};

const FOOTER_BANNER_ROOTS = [
  "/about",
  "/admin",
  "/advertise",
  "/contact",
  "/disclosure",
  "/editorial-policy",
  "/photo-credits",
  "/privacy",
  "/terms",
  "/stages",
  "/tips",
  "/tools",
] as const;

export function isFooterBannerPath(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (path === "/") {
    return true;
  }
  return FOOTER_BANNER_ROOTS.some((root) => path === root || path.startsWith(`${root}/`));
}
