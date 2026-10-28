import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PhotoCreditsPage from "@/app/photo-credits/page";
import { allPhotos, heroPhoto, pagePhoto, photoPlacements } from "@/lib/photos";

describe("photo credits", () => {
  it("lists every photo, with the home link first in the footer", () => {
    const html = renderToStaticMarkup(createElement(PhotoCreditsPage));
    expect(html).toContain("<h1>Photo credits</h1>");
    expect(html).toContain('loading="lazy"');
    for (const photo of allPhotos()) {
      expect(html).toContain(`alt="${photo.alt}"`);
      expect(html).toContain(`src="${photo.src}"`);
      expect(html).toContain(`Photograph by ${photo.photographer}.`);
      expect(html).toContain(`href="${photo.sourcePage}"`);
      expect(html).toContain(`href="${photo.licenseUrl}"`);
    }
    const placements = photoPlacements();
    expect(placements).toHaveLength(allPhotos().length);
    expect(placements.every((item) => item.pages.length > 0)).toBe(true);
    const order = placements.map((item) => item.photo.id);
    const at = (id: string) => order.indexOf(id);
    expect(order[0]).toBe(heroPhoto.id);
    expect(at("hub-stages")).toBeLessThan(at("hub-tips"));
    expect(at("hub-tips")).toBeLessThan(at("hub-archive"));
    expect(at("hub-archive")).toBeLessThan(at(pagePhoto("/tools").id));

    const footer = readFileSync(resolve(process.cwd(), "components/site-footer.tsx"), "utf8");
    const homeAt = footer.indexOf('href="/"');
    const tipsAt = footer.indexOf('href="/tips"');
    expect(homeAt).toBeGreaterThanOrEqual(0);
    expect(homeAt).toBeLessThan(tipsAt);
    expect(footer).toContain(">Home</");
    expect(footer).toContain('href="/photo-credits"');
    expect(footer).not.toContain(heroPhoto.alt);
    expect(footer).not.toContain("allPhotos");
    expect(footer).not.toContain("Photograph by");

    for (const file of ["app/tips/page.tsx", "app/stages/page.tsx", "app/archive/page.tsx", "app/tools/page.tsx"]) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source).toContain("<PagePhoto");
      expect(source).toContain("priority");
    }
    const curb = readFileSync(resolve(process.cwd(), "app/tools/curb-appeal/page.tsx"), "utf8");
    expect(curb).toContain("Photograph by");
  });
});
