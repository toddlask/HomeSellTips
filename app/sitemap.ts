import type { MetadataRoute } from "next";
import { tips } from "@/lib/catalog";
import { getSiteUrl, publicPaths } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  return publicPaths(tips).map((entry) => ({
    url: `${origin}${entry.path}`,
    lastModified: entry.lastModified,
  }));
}
