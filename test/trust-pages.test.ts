import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/components/contact-form";
import { NetProceedsForm } from "@/components/net-proceeds-form";
import { tips } from "@/lib/catalog";
import { contactProblem, INQUIRY_ENDPOINT } from "@/lib/inquiry";
import { pageMetadata } from "@/lib/page-meta";
import { HUB_SOURCES, sourcesForStage, sourcesForTool } from "@/lib/page-sources";
import { publicPaths } from "@/lib/site";
import { commissionExampleResult, fixExampleNet, proceedsExampleResult } from "@/lib/tool-examples";
import { timingReading } from "@/lib/season";

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === "test") {
      continue;
    }
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      files.push(...walk(path));
    } else if (/\.(tsx|ts)$/.test(entry)) {
      files.push(path);
    }
  }
  return files;
}

describe("tools and trust pages", () => {
  it("checks the worked examples and the timing note", () => {
    expect(proceedsExampleResult().proceeds).toBe(145_000);
    const commission = commissionExampleResult();
    expect(commission.listingCommission).toBe(12_000);
    expect(commission.buyerAgentCommission).toBe(10_000);
    expect(commission.fullService).toBe(22_000);
    expect(commission.fsboBuyerOnly).toBe(10_000);
    expect(commission.fsboNeither).toBe(0);
    expect(fixExampleNet()).toBe(750);
    expect(timingReading({ moveDateFixed: false, houseReady: false })).toMatch(/Finish the work/i);
    expect(timingReading({ moveDateFixed: true, houseReady: false })).toMatch(/fixed move date/i);
    expect(timingReading({ moveDateFixed: false, houseReady: true })).toMatch(/ready/i);
    const html = renderToStaticMarkup(createElement(NetProceedsForm));
    expect(html).toContain("$145,000.00");
    expect(html).toContain("What this result means");
    expect(html).toContain("Print this result");
  });

  it("adds the trust pages, footer links, sources, and homepage sections", () => {
    const paths = new Set(publicPaths(tips).map((entry) => entry.path));
    for (const path of ["/editorial-policy", "/terms", "/contact"]) {
      expect(paths.has(path)).toBe(true);
      expect(pageMetadata({ title: "Check", description: "Check.", path }).alternates?.canonical).toBe(path);
    }
    const editorial = readFileSync(resolve(process.cwd(), "app/editorial-policy/page.tsx"), "utf8");
    expect(editorial).toContain("AI tools help draft content");
    expect(editorial).toContain("{DISCLAIMER}");
    expect(editorial).not.toMatch(/Todd|credential|years of experience/i);
    const privacy = readFileSync(resolve(process.cwd(), "app/privacy/page.tsx"), "utf8");
    expect(privacy).toContain("third-party advertising");
    expect(privacy).toContain("Google AdSense");
    expect(privacy).toContain("cookies");
    expect(privacy).toContain("European Economic Area");
    const footer = readFileSync(resolve(process.cwd(), "components/site-footer.tsx"), "utf8");
    const list = footer.slice(footer.indexOf("footer-links"));
    const hrefs = [...list.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    expect(hrefs[0]).toBe("/");
    expect(hrefs).toEqual(
      expect.arrayContaining(["/privacy", "/terms", "/contact", "/editorial-policy", "/disclosure", "/photo-credits"]),
    );
    const header = readFileSync(resolve(process.cwd(), "components/site-header.tsx"), "utf8");
    expect(header).not.toContain("/photo-credits");
    const home = readFileSync(resolve(process.cwd(), "app/page.tsx"), "utf8");
    expect(home.indexOf('id="home-heading"')).toBeLessThan(home.indexOf("<ZillowHomeBanner />"));
    expect(home.indexOf("<ZillowHomeBanner />")).toBeLessThan(home.indexOf('id="tools"'));
    expect(home.indexOf('id="tools"')).toBeLessThan(home.indexOf('id="stages"'));
    expect(home).toContain("Recently updated guides");
    expect(home).toContain("updatedOn");
    expect(home).not.toContain("updatedOn}");
    const closing = sourcesForStage("closing").map((source) => source.href);
    expect(closing).toEqual(expect.arrayContaining([
      "https://www.irs.gov/publications/p523",
      "https://www.consumerfinance.gov/owning-a-home/close/",
      "https://www.consumerfinance.gov/owning-a-home/closing-disclosure/",
      "https://www.hud.gov/program_offices/housing/sfh",
      "https://www.ic3.gov/",
    ]));
    expect(sourcesForStage("agent-vs-fsbo").map((source) => source.href)).toContain(
      "https://www.nar.realtor/the-facts/what-the-nar-settlement-means-for-home-buyers-and-sellers",
    );
    expect(sourcesForStage("staging")).toEqual([]);
    expect(sourcesForTool("/tools/commission").map((source) => source.href)).toContain(
      "https://www.nar.realtor/the-facts/what-the-nar-settlement-means-for-home-buyers-and-sellers",
    );
    expect(HUB_SOURCES.length).toBeGreaterThan(4);
    const routes = new Set([...paths, "/admin"]);
    const hrefPattern = /href="(\/[^"#?]*)/g;
    for (const file of walk(resolve(process.cwd(), "app")).concat(walk(resolve(process.cwd(), "components")))) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/coming soon/i);
      for (const match of source.matchAll(hrefPattern)) {
        expect(routes.has(match[1]), `${file} -> ${match[1]}`).toBe(true);
      }
    }
  });

  it("validates the contact form without sending it", () => {
    const now = 10_000;
    const valid = {
      name: "Ada",
      email: "ada@example.com",
      message: "A question about a page.",
      honey: "",
      startedAt: now - 5_000,
    };
    expect(contactProblem(valid, now)).toBeNull();
    expect(contactProblem({ ...valid, email: "not-an-email" }, now)?.field).toBe("email");
    expect(contactProblem({ ...valid, honey: "bot" }, now)?.message).toMatch(/rejected/i);
    expect(INQUIRY_ENDPOINT).not.toContain("@");
    const form = readFileSync(resolve(process.cwd(), "components/contact-form.tsx"), "utf8");
    expect(form).toContain("INQUIRY_ENDPOINT");
    expect(form).toContain("HomeSellTips contact");
    expect(form).not.toContain("mailto:");
    const html = renderToStaticMarkup(createElement(ContactForm));
    expect(html).toContain("Send message");
    expect(html).not.toContain("@");
    expect(html).not.toMatch(/formsubmit|mailto:/i);
  });
});
