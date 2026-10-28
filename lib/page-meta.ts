import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

const SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

type OpenGraphType = "website" | "article";

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
};

export function pageMetadata(input: PageMetadataInput): Metadata {
  const description = input.ogDescription ?? input.description;
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
        images: [SHARE_IMAGE],
      };
      break;
    case "website":
      openGraph = { ...shared, type: "website", images: [SHARE_IMAGE] };
      break;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }

  const metadata: Metadata = {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph,
  };
  if (input.robots) {
    metadata.robots = input.robots;
  }
  return metadata;
}
