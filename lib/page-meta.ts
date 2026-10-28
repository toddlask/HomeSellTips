import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

const SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

type OpenGraphType = "website" | "article";

type ShareImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  ogDescription?: string;
  robots?: Metadata["robots"];
  openGraphType?: OpenGraphType;
  publishedTime?: string;
  modifiedTime?: string;
  image?: ShareImage;
};

export const SHORT_SITE_NAME = "HomeSellTips";

export function tipPageTitle(title: string): string {
  return `${title} · Tips`;
}

export function usesShortTitle(path: string): boolean {
  return path.startsWith("/tools") || path.endsWith("/checklist") || path === "/disclosure";
}

export function resolvedDocumentTitle(input: { title: string; path: string; absoluteTitle?: boolean }): string {
  if (input.absoluteTitle) {
    return input.title;
  }
  const suffix = usesShortTitle(input.path) ? SHORT_SITE_NAME : SITE_NAME;
  return `${input.title} · ${suffix}`;
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const description = input.ogDescription ?? input.description;
  const image = input.image ?? SHARE_IMAGE;
  const shared = {
    title: input.title,
    description,
    url: input.path,
  };
  const kind = input.openGraphType ?? "website";
  let openGraph: Metadata["openGraph"];
  switch (kind) {
    case "article":
      openGraph = {
        ...shared,
        type: "article",
        publishedTime: input.publishedTime,
        modifiedTime: input.modifiedTime,
        images: [image],
      };
      break;
    case "website":
      openGraph = { ...shared, type: "website", images: [image] };
      break;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }

  const metadata: Metadata = {
    title: input.absoluteTitle
      ? { absolute: input.title }
      : usesShortTitle(input.path)
        ? { absolute: resolvedDocumentTitle(input) }
        : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [image.url],
    },
  };
  if (input.robots) {
    metadata.robots = input.robots;
  }
  return metadata;
}
