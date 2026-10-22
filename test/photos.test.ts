import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { allPhotos, heroSlides, PEXELS_LICENSE, PEXELS_LICENSE_URL, stagePhoto } from "@/lib/photos";
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
  });

  it("rotates five credited home photos in the hero", () => {
    expect(heroSlides).toHaveLength(5);
    const ids = heroSlides.map((photo) => photo.id);
    expect(new Set(ids).size).toBe(5);
    for (const photo of heroSlides) {
      expect(allPhotos().some((item) => item.id === photo.id)).toBe(true);
    }
    const html = renderToStaticMarkup(createElement(HeroSlideshow, { photos: heroSlides }));
    expect(html.match(/class="hero-slide(?: is-active)?"/g)).toHaveLength(5);
    expect(html.match(/role="tab"/g)).toHaveLength(5);
    expect(html).toContain('data-interval="5000"');
    expect(html).toContain("hero-slide is-active");
    expect(html).toContain(heroSlides[0]?.src);
    expect(html).toContain("--hero-focus:50% 58%");
  });
});
