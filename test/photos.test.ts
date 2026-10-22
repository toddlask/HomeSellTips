import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { allPhotos, heroPhoto, PEXELS_LICENSE, PEXELS_LICENSE_URL, stagePhoto } from "@/lib/photos";
import { STAGE_IDS } from "@/lib/types";

describe("home photos", () => {
  it("credits every photo with a Pexels source, photographer, license, and alt text", () => {
    const photos = allPhotos();
    expect(photos.length).toBe(STAGE_IDS.length + 1);
    const ids = new Set(photos.map((photo) => photo.id));
    expect(ids.size).toBe(photos.length);
    for (const photo of photos) {
      expect(photo.alt.length).toBeGreaterThan(20);
      expect(photo.photographer.length).toBeGreaterThan(2);
      expect(photo.sourcePage).toMatch(/^https:\/\/www\.pexels\.com\/photo\//);
      expect(photo.license).toBe(PEXELS_LICENSE);
      expect(photo.licenseUrl).toBe(PEXELS_LICENSE_URL);
      expect(existsSync(resolve(process.cwd(), "public", photo.src.slice(1)))).toBe(true);
    }
    for (const stage of STAGE_IDS) {
      expect(stagePhoto(stage).src.startsWith("/photos/")).toBe(true);
    }
    expect(heroPhoto.src).toBe("/photos/hero-house.webp");
    expect(allPhotos()[0]?.id).toBe(heroPhoto.id);
  });
});
