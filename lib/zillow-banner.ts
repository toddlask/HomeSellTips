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
