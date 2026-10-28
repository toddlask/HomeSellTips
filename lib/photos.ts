import catalogJson from "@/content/page-photos.json";
import type { StageId } from "@/lib/types";

export const PEXELS_LICENSE = "Pexels License";
export const PEXELS_LICENSE_URL = "https://www.pexels.com/license/";

export type HomePhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  sourcePage: string;
  license: typeof PEXELS_LICENSE;
  licenseUrl: typeof PEXELS_LICENSE_URL;
};

const CURB_PHOTO_IDS = ["lights", "glass", "paint-door", "step"] as const;
export type CurbPhotoId = (typeof CURB_PHOTO_IDS)[number];

type CatalogEntry = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  sourcePage: string;
  page?: string;
  curb?: string;
};

function photo(entry: Omit<HomePhoto, "license" | "licenseUrl">): HomePhoto {
  return { ...entry, license: PEXELS_LICENSE, licenseUrl: PEXELS_LICENSE_URL };
}

export const heroPhoto = photo({
  id: "hero-house",
  src: "/photos/hero-house.webp",
  width: 1600,
  height: 1000,
  alt: "Two-story house with gray siding, a dark roof, three garage doors, and warm lights in the windows at dusk.",
  photographer: "Binyamin Mellish",
  sourcePage: "https://www.pexels.com/photo/brown-and-gray-painted-house-in-front-of-road-106399/",
});

function isCurbPhotoId(value: string): value is CurbPhotoId {
  return (CURB_PHOTO_IDS as readonly string[]).includes(value);
}

const pagePhotos = new Map<string, HomePhoto>();
const curbPhotos = new Map<CurbPhotoId, HomePhoto>();
const catalogPhotos: HomePhoto[] = [];
const seen = new Set<string>([heroPhoto.src]);

export type PhotoPlacement = {
  photo: HomePhoto;
  pages: readonly string[];
};

const placements: PhotoPlacement[] = [{ photo: heroPhoto, pages: ["/"] }];

for (const entry of catalogJson as CatalogEntry[]) {
  if (seen.has(entry.src) || catalogPhotos.some((item) => item.id === entry.id)) {
    throw new Error(`Duplicate photo ${entry.id}`);
  }
  seen.add(entry.src);
  const shot = photo({
    id: entry.id,
    src: entry.src,
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
    photographer: entry.photographer,
    sourcePage: entry.sourcePage,
  });
  catalogPhotos.push(shot);
  const pages: string[] = [];
  if (entry.page?.startsWith("/stages/") && entry.page.lastIndexOf("/") === "/stages".length) {
    pages.push("/");
  }
  if (entry.page) {
    pages.push(entry.page);
  }
  if (entry.curb && !pages.includes("/tools/curb-appeal")) {
    pages.push("/tools/curb-appeal");
  }
  placements.push({ photo: shot, pages });
  if (entry.page) {
    if (pagePhotos.has(entry.page)) {
      throw new Error(`Duplicate page photo ${entry.page}`);
    }
    pagePhotos.set(entry.page, shot);
  }
  if (entry.curb) {
    if (!isCurbPhotoId(entry.curb) || curbPhotos.has(entry.curb)) {
      throw new Error(`Bad curb photo ${entry.id}`);
    }
    curbPhotos.set(entry.curb, shot);
  }
}

export function pagePhoto(path: string): HomePhoto {
  const found = pagePhotos.get(path);
  if (!found) {
    throw new Error(`No photo for ${path}`);
  }
  return found;
}

export function tipPhoto(slug: string): HomePhoto {
  return pagePhoto(`/tips/${slug}`);
}

export function stagePhoto(stage: StageId): HomePhoto {
  switch (stage) {
    case "prep-and-repairs":
    case "staging":
    case "pricing":
    case "listing-photos":
    case "agent-vs-fsbo":
    case "offers-and-negotiation":
    case "closing":
    case "moving":
      return pagePhoto(`/stages/${stage}`);
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function curbExtra(id: CurbPhotoId): HomePhoto {
  switch (id) {
    case "lights":
    case "glass":
    case "paint-door":
    case "step": {
      const found = curbPhotos.get(id);
      if (!found) {
        throw new Error(`No curb photo ${id}`);
      }
      return found;
    }
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function allPhotos(): HomePhoto[] {
  return [heroPhoto, ...catalogPhotos];
}

function placementKey(pages: readonly string[]): string {
  const path = pages.find((item) => item !== "/") ?? pages[0] ?? "";
  if (path === "/") {
    return `0:${path}`;
  }
  if (path === "/stages" || path.startsWith("/stages/")) {
    return `1:${path}`;
  }
  if (path === "/tips" || path.startsWith("/tips/")) {
    return `2:${path}`;
  }
  if (path === "/archive") {
    return `3:${path}`;
  }
  if (path === "/tools" || path.startsWith("/tools/")) {
    return `4:${path}`;
  }
  return `5:${path}`;
}

export function photoPlacements(): PhotoPlacement[] {
  return placements.toSorted(
    (left, right) => placementKey(left.pages).localeCompare(placementKey(right.pages)) || left.photo.id.localeCompare(right.photo.id),
  );
}
