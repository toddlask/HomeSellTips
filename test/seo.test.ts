import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { checklistCrumbs, photoCreditCrumbs, stageCrumbs, stagesHubCrumbs, tipCrumbs, tipsHubCrumbs, toolCrumbs } from "@/lib/crumbs";
import { aboutPageJsonLd, articleJsonLd, breadcrumbJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { ABOUT_DESCRIPTION, aboutWordCount, HUB_DESCRIPTIONS, INFO_DESCRIPTIONS, TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { resolvedDocumentTitle, tipPageTitle } from "@/lib/page-meta";
import { stagePhoto } from "@/lib/photos";
import { checklistDescription, stageDescription, stagePath, stageTitle } from "@/lib/stages";
import { getSiteUrl, llmsText, SITE_NAME, TOOL_LINKS } from "@/lib/site";
import { tipKeyPhrase, tipMetaDescription } from "@/lib/tip-meta";
import { tipShareImage } from "@/lib/tip-card";
import { STAGE_IDS } from "@/lib/types";

function expectMetaLength(text: string) {
  expect(text.length).toBeGreaterThanOrEqual(120);
  expect(text.length).toBeLessThanOrEqual(155);
}

describe("search metadata", () => {
  it("keeps hub, tool, stage, and checklist descriptions in range", () => {
    for (const text of [
      ...Object.values(HUB_DESCRIPTIONS),
      ...Object.values(TOOL_DESCRIPTIONS),
      ...Object.values(INFO_DESCRIPTIONS),
      ABOUT_DESCRIPTION,
    ]) {
      expectMetaLength(text);
    }
    const seen = new Set<string>();
    for (const tip of tips) {
      if (tip.status !== "published") {
        continue;
      }
      const description = tipMetaDescription(tip);
      expectMetaLength(description);
      expect(description).toContain(tipKeyPhrase(tip.title));
      expect(seen.has(description)).toBe(false);
      seen.add(description);
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
    expect(home).toContain("Before you list");
    expect(home).toContain("absoluteTitle: true");
    const homeTitle = resolvedDocumentTitle({
      title: `${SITE_NAME} · Before you list`,
      path: "/",
      absoluteTitle: true,
    });
    expect(homeTitle).toContain(SITE_NAME);
    expect(homeTitle.length).toBeLessThanOrEqual(60);
    expect(resolvedDocumentTitle({ title: "Ad and affiliate disclosure", path: "/disclosure" }).length).toBeLessThanOrEqual(60);
    expect(resolvedDocumentTitle({ title: "Net proceeds calculator", path: "/tools/net-proceeds" }).length).toBeLessThanOrEqual(60);
    const toolsTitle = resolvedDocumentTitle({ title: "Seller calculators and checklists", path: "/tools" });
    const mythsTitle = resolvedDocumentTitle({ title: "Selling claims and the plain version", path: "/tools/myths" });
    expect(toolsTitle.length).toBeGreaterThanOrEqual(40);
    expect(toolsTitle.length).toBeLessThanOrEqual(60);
    expect(mythsTitle.length).toBeGreaterThanOrEqual(40);
    expect(mythsTitle.length).toBeLessThanOrEqual(60);
    expect(toolsTitle).not.toBe(mythsTitle);
    expect(readFileSync(resolve(process.cwd(), "app/tools/page.tsx"), "utf8")).toContain(
      'title: "Seller calculators and checklists"',
    );
    expect(readFileSync(resolve(process.cwd(), "app/tools/myths/page.tsx"), "utf8")).toContain(
      'title: "Selling claims and the plain version"',
    );
    for (const stage of STAGE_IDS) {
      const checklistTitle = resolvedDocumentTitle({
        title: `${stageTitle(stage)} checklist`,
        path: `${stagePath(stage)}/checklist`,
      });
      expect(checklistTitle.length).toBeLessThanOrEqual(60);
      expect(checklistTitle.endsWith(" · HomeSellTips")).toBe(true);
    }
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
          image: `${origin}/og/tips/read-the-whole-offer.jpg`,
          url: `${origin}/tips/read-the-whole-offer`,
          authorName: SITE_NAME,
          publisherUrl: origin,
        }),
      ),
    ) as Record<string, unknown>;
    expect(article["@context"]).toBe("https://schema.org");
    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe("Read the whole offer");
    expect(article.datePublished).toBeUndefined();
    expect(article.dateModified).toBeUndefined();
    expect(article.image).toBe(`${origin}/og/tips/read-the-whole-offer.jpg`);
    expect(article.author).toEqual({ "@type": "Organization", name: SITE_NAME, url: origin });
    expect(article.publisher).toEqual(article.author);
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

  it("links the hubs from breadcrumbs, the header, and llms.txt", () => {
    const tip = tips.find((entry) => entry.slug === "read-the-whole-offer");
    expect(tip).toBeDefined();
    if (!tip) {
      return;
    }
    expect(tipCrumbs(tip).map((crumb) => crumb.path)).toEqual([
      "/",
      "/tips",
      stagePath(tip.stage),
      `/tips/${tip.slug}`,
    ]);
    expect(stageCrumbs("pricing").map((crumb) => crumb.path)).toEqual(["/", "/stages", "/stages/pricing"]);
    expect(checklistCrumbs("pricing").some((crumb) => crumb.path === "/stages")).toBe(true);
    expect(toolCrumbs().map((crumb) => crumb.path)).toEqual(["/", "/tools"]);
    expect(tipsHubCrumbs().map((crumb) => crumb.path)).toEqual(["/", "/tips"]);
    expect(stagesHubCrumbs().map((crumb) => crumb.path)).toEqual(["/", "/stages"]);
    expect(photoCreditCrumbs().map((crumb) => crumb.path)).toEqual(["/", "/photo-credits"]);
    for (const file of ["app/tips/page.tsx", "app/stages/page.tsx", "app/tools/layout.tsx"]) {
      const page = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(page).toContain("<Breadcrumbs");
      expect(page).toContain("linkLast");
    }
    const header = readFileSync(resolve(process.cwd(), "components/site-header.tsx"), "utf8");
    const footer = readFileSync(resolve(process.cwd(), "components/site-footer.tsx"), "utf8");
    expect(footer).not.toContain("/archive");
    const nav = `${header}\n${footer}`;
    for (const path of ["/tips", "/stages", "/tools"]) {
      expect(nav).toContain(`"${path}"`);
    }
    const origin = getSiteUrl();
    const guide = llmsText();
    for (const path of ["/", "/tips", "/stages", "/tools", "/about", "/photo-credits"]) {
      expect(guide).toContain(`${origin}${path}`);
    }
    for (const tool of TOOL_LINKS) {
      expect(guide).toContain(`${origin}${tool.href}`);
    }
    const share = tipShareImage(tip);
    expect(share).toEqual({
      url: `/og/tips/${tip.slug}.jpg`,
      width: 1200,
      height: 630,
      alt: tip.title,
    });
    const curb = readFileSync(resolve(process.cwd(), "app/tools/curb-appeal/page.tsx"), "utf8");
    expect(curb).toContain("priority={index === 0}");
    const engines = readFileSync(resolve(process.cwd(), "package.json"), "utf8");
    expect(engines).toContain('"node": "^22.12.0 || ^24.0.0 || >=26.0.0"');
    expect(readFileSync(resolve(process.cwd(), ".nvmrc"), "utf8").trim()).toBe("22");
    expect(readFileSync(resolve(process.cwd(), ".github/workflows/ci.yml"), "utf8")).toContain('node-version-file: ".nvmrc"');
  });

  it("keeps every published tip in range and marks it revised", () => {
    const published = tips.filter((tip) => tip.status === "published");
    expect(published).toHaveLength(59);
    expect(published.some((tip) => tip.slug === "deep-clean-after-the-dusty-work")).toBe(true);
    for (const tip of published) {
      if (!tip.publishedOn) {
        continue;
      }
      const words = `${tip.summary} ${tip.body.join(" ")} ${tip.steps.join(" ")}`.trim().split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(300);
      expect(words).toBeLessThanOrEqual(450);
      expect(tip.publishedOn < tip.updatedOn).toBe(true);
    }
  });
});
