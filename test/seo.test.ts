import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { aboutPageJsonLd, articleJsonLd, breadcrumbJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { ABOUT_DESCRIPTION, aboutWordCount, HUB_DESCRIPTIONS, TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { tipPageTitle } from "@/lib/page-meta";
import { stagePhoto } from "@/lib/photos";
import { checklistDescription, stageDescription, stagePath, stageTitle } from "@/lib/stages";
import { SITE_NAME } from "@/lib/site";
import { STAGE_IDS } from "@/lib/types";

function expectMetaLength(text: string) {
  expect(text.length).toBeGreaterThanOrEqual(120);
  expect(text.length).toBeLessThanOrEqual(155);
}

describe("search metadata", () => {
  it("keeps hub, tool, stage, and checklist descriptions in range", () => {
    for (const text of [...Object.values(HUB_DESCRIPTIONS), ...Object.values(TOOL_DESCRIPTIONS), ABOUT_DESCRIPTION]) {
      expectMetaLength(text);
    }
    expect(aboutWordCount()).toBeGreaterThanOrEqual(200);
    expect(aboutWordCount()).toBeLessThanOrEqual(350);
    const stages = new Set<string>();
    const lists = new Set<string>();
    for (const stage of STAGE_IDS) {
      const stageText = stageDescription(stage);
      const listText = checklistDescription(stage);
      expectMetaLength(stageText);
      expectMetaLength(listText);
      stages.add(stageText);
      lists.add(listText);
    }
    expect(stages.size).toBe(STAGE_IDS.length);
    expect(lists.size).toBe(STAGE_IDS.length);
  });

  it("keeps tip document titles under 60 characters and uses the stage photo", () => {
    for (const tip of tips) {
      const title = tipPageTitle(tip.title);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title.endsWith(" · Tips")).toBe(true);
      expect(stagePhoto(tip.stage).src).toMatch(/^\/photos\/.+\.webp$/);
    }
    const layout = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain('weight: "600"');
    expect(layout).not.toContain("italic");
    expect(layout).toContain("adsenseClientId");
    const home = readFileSync(resolve(process.cwd(), "app/page.tsx"), "utf8");
    expect(home).toContain("SITE_NAME");
    expect(home).toContain("absoluteTitle: true");
    const consent = readFileSync(resolve(process.cwd(), "components/cookie-consent.tsx"), "utf8");
    expect(consent).toContain("localStorage");
    expect(consent).not.toMatch(/one cookie/i);
  });

  it("publishes article, breadcrumb, website, and organization JSON-LD", () => {
    const origin = "https://homeselltips.vercel.app";
    const article = JSON.parse(
      JSON.stringify(
        articleJsonLd({
          headline: "Read the whole offer",
          datePublished: "2026-10-22T00:00:00.000Z",
          dateModified: "2026-10-22T00:00:00.000Z",
          image: `${origin}/photos/dining-room.webp`,
          url: `${origin}/tips/read-the-whole-offer`,
        }),
      ),
    ) as Record<string, unknown>;
    expect(article["@context"]).toBe("https://schema.org");
    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe("Read the whole offer");
    expect(article.datePublished).toBe("2026-10-22T00:00:00.000Z");
    expect(article.dateModified).toBe("2026-10-22T00:00:00.000Z");
    expect(article.image).toBe(`${origin}/photos/dining-room.webp`);

    const crumbs = JSON.parse(
      JSON.stringify(
        breadcrumbJsonLd(origin, [
          { name: "Home", path: "/" },
          { name: stageTitle("offers-and-negotiation"), path: stagePath("offers-and-negotiation") },
          { name: "Read the whole offer", path: "/tips/read-the-whole-offer" },
        ]),
      ),
    ) as { "@type": string; itemListElement: Array<{ position: number; name: string; item: string }> };
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(crumbs.itemListElement.map((item) => item.name)).toEqual([
      "Home",
      "Offers and negotiation",
      "Read the whole offer",
    ]);
    expect(crumbs.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(crumbs.itemListElement[2]?.item).toBe(`${origin}/tips/read-the-whole-offer`);

    expect(websiteJsonLd(origin, "Helpful Ideas for Selling Your Home")["@type"]).toBe("WebSite");
    const organization = organizationJsonLd(origin, SITE_NAME);
    expect(organization["@type"]).toBe("Organization");

    const about = JSON.parse(JSON.stringify(aboutPageJsonLd(origin, SITE_NAME, ABOUT_DESCRIPTION))) as {
      "@type": string;
      url: string;
      description: string;
      mainEntity: { "@type": string; name: string; url: string };
    };
    expect(about["@type"]).toBe("AboutPage");
    expect(about.url).toBe(`${origin}/about`);
    expect(about.description).toBe(ABOUT_DESCRIPTION);
    expect(about.mainEntity).toEqual({
      "@type": "Organization",
      name: organization.name,
      url: organization.url,
    });
  });
});
