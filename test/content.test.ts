import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { CONTENT_EPOCH, isIsoDate, todayIso } from "@/lib/dates";
import { affiliateOffers, AFFILIATE_DISCLOSURE } from "@/lib/affiliates";
import { adsTxtBody, adsTxtLine } from "@/lib/ads";
import { GET as adsTxtGet } from "@/app/ads.txt/route";
import { STAGE_IDS, type Tip } from "@/lib/types";
import { publicPaths } from "@/lib/site";
import { deliverEmail, EMAIL_DELIVERY_ENABLED, planRenewalDrafts } from "@/lib/outbox";
import { digestsMatch, tokenDigest } from "@/lib/admin-token";
import {
  CONTENT_SECURITY_POLICY,
  GENERATED_OG_CACHE_CONTROL,
  NETLIFY_GENERATED_OG_PATH,
  NETLIFY_STATIC_IMAGE_PATHS,
  RESPONSE_HEADERS,
  STATIC_IMAGE_CACHE_CONTROL,
} from "@/lib/csp";
import {
  FIXTURE_PUBLISHED_SLUG,
  FIXTURE_QUEUED_SLUG,
  fixtureCategorySponsor,
  fixtureLibrary,
} from "./fixtures";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AffiliateList } from "@/components/affiliate-list";

const banned =
  /\b(schools?|crime|religion|religious|racial|race|disability|disabled|handicap|familial|demographic|children|kids|gender|neighborhood|national origin)\b|\bsafe neighborhood\b|\bfamily neighborhood\b|\bsex\b|\bcolor\b|\bstudies show\b|\baverage\b|\btypically\b|\blorem\b|%/i;

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry);
    if (entry === "node_modules" || entry === ".next" || entry === ".netlify" || entry === "test") {
      continue;
    }
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...walk(path));
    } else if (/\.(tsx|ts|json|md|css)$/.test(entry)) {
      files.push(path);
    }
  }
  return files;
}

function tipText(tip: Tip): string {
  return `${tip.title} ${tip.summary} ${tip.body.join(" ")} ${tip.steps.join(" ")}`;
}

function expectCurrentCopy(library: readonly Tip[], today: string) {
  for (const tip of library) {
    expect(isIsoDate(tip.updatedOn)).toBe(true);
    expect(tip.updatedOn >= CONTENT_EPOCH).toBe(true);
    expect(tip.updatedOn <= today).toBe(true);
    expect(banned.test(tipText(tip))).toBe(false);
  }
}

describe("published library", () => {
  it("uses a fixed library for counts, dates, and sitemap membership", () => {
    const library = fixtureLibrary();
    for (const stage of STAGE_IDS) {
      expect(library.filter((tip) => tip.stage === stage && tip.status === "published")).toHaveLength(2);
    }
    expect(library.filter((tip) => tip.status === "queued")).toHaveLength(6);
    expectCurrentCopy(library, "2026-10-24");
    const paths = publicPaths(library).map((entry) => entry.path);
    expect(paths).toContain(`/tips/${FIXTURE_PUBLISHED_SLUG}`);
    expect(paths).not.toContain(`/tips/${FIXTURE_QUEUED_SLUG}`);
    expect(paths).not.toContain("/archive");
    expect(paths).toContain("/tips");
    expect(paths).toContain("/about");
    expect(paths).toContain("/stages");
    expect(paths).toContain("/tools");
    expect(paths).not.toContain("/admin");
    expect(paths).not.toContain("/directory");
  });

  it("keeps the live library dated and leaves queued tips out of the sitemap", () => {
    expect(tips.length).toBeGreaterThan(0);
    expectCurrentCopy(tips, todayIso());
    const paths = new Set(publicPaths(tips).map((entry) => entry.path));
    for (const tip of tips) {
      expect(paths.has(`/tips/${tip.slug}`)).toBe(tip.status === "published");
    }
    expect(paths.has("/tips/deep-clean-after-the-dusty-work")).toBe(true);
    expect(paths.has("/archive")).toBe(false);
    expect(paths.has("/about")).toBe(true);
  });
});

describe("ads, affiliates, and email", () => {
  it("omits the ads.txt publisher line until a real publisher id is set", () => {
    expect(adsTxtBody(undefined)).toBe("");
    expect(adsTxtBody("")).toBe("");
    expect(adsTxtBody("not-an-id")).toBe("");
    expect(adsTxtLine("ca-pub-123")).toBe("google.com, pub-123, DIRECT, f08c47fec0942fa0");
  });

  it("hides affiliate offers unless the flag and a url are set", () => {
    expect(affiliateOffers({})).toEqual([]);
    expect(affiliateOffers({ AFFILIATES_ENABLED: "false", AFFILIATE_MOVING_BOXES_URL: "https://example.com/boxes" })).toEqual(
      [],
    );
    const offers = affiliateOffers({
      AFFILIATES_ENABLED: "true",
      AFFILIATE_MOVING_BOXES_URL: "https://example.com/boxes",
    });
    const html = renderToStaticMarkup(createElement(AffiliateList, { offers }));
    expect(html).toContain(AFFILIATE_DISCLOSURE);
    expect(html).toContain("https://example.com/boxes");
    expect(renderToStaticMarkup(createElement(AffiliateList, { offers: [] }))).toBe("");
  });

  it("does not serve an empty ads.txt and returns the publisher line when configured", () => {
    const previous = process.env.ADSENSE_PUBLISHER_ID;
    try {
      delete process.env.ADSENSE_PUBLISHER_ID;
      expect(adsTxtGet().status).toBe(404);
      process.env.ADSENSE_PUBLISHER_ID = "ca-pub-123";
      const response = adsTxtGet();
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/plain");
      return expect(response.text()).resolves.toBe("google.com, pub-123, DIRECT, f08c47fec0942fa0\n");
    } finally {
      if (previous === undefined) {
        delete process.env.ADSENSE_PUBLISHER_ID;
      } else {
        process.env.ADSENSE_PUBLISHER_ID = previous;
      }
    }
  });

  it("drafts renewal email and refuses to send it", () => {
    expect(EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(() => deliverEmail()).toThrow(/disabled/i);
    const drafts = planRenewalDrafts([fixtureCategorySponsor], [], "2026-10-21");
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.status).toBe("draft");
    expect(planRenewalDrafts([fixtureCategorySponsor], drafts, "2026-10-21")).toHaveLength(1);
  });

  it("does not ship a mail provider or a publishing cron on Vercel", () => {
    const packageJson = readFileSync(resolve(process.cwd(), "package.json"), "utf8");
    expect(packageJson).not.toMatch(/nodemailer|resend|sendgrid|postmark|mailgun/i);
    const vercel = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")) as { crons?: unknown };
    expect(vercel.crons).toBeUndefined();
    expect(existsSync(resolve(process.cwd(), ".github/workflows/publish-tip.yml"))).toBe(false);
    const ci = readFileSync(resolve(process.cwd(), ".github/workflows/ci.yml"), "utf8");
    expect(ci).not.toMatch(/schedule:|cron:/);
    const source = walk(process.cwd())
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    expect(source).not.toMatch(/nodemailer|@sendgrid|resend\.com|postmarkapp|mailgun/i);
    expect(source).not.toMatch(/\bstripe\b/i);
    expect(source).not.toMatch(/STRIPE_/);
    expect(source).not.toMatch(/\bpaypal\b/i);
    expect(source).not.toMatch(/https:\/\/api-m\.paypal\.com/);
  });

  it("ships one content security policy on Vercel and Netlify", () => {
    const vercel = JSON.parse(readFileSync(resolve(process.cwd(), "vercel.json"), "utf8")) as {
      headers: Array<{ headers: Array<{ key: string; value: string }> }>;
    };
    const vercelPolicy = vercel.headers[0]?.headers.find((header) => header.key === "Content-Security-Policy")?.value;
    expect(vercelPolicy).toBe(CONTENT_SECURITY_POLICY);
    const netlify = readFileSync(resolve(process.cwd(), "netlify.toml"), "utf8");
    expect(netlify).toContain(`Content-Security-Policy = "${CONTENT_SECURITY_POLICY}"`);
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("https://pagead2.googlesyndication.com");
    expect(CONTENT_SECURITY_POLICY).toContain("form-action 'self'");
    expect(CONTENT_SECURITY_POLICY).toMatch(/connect-src[^;]*https:\/\/formsubmit\.co/);
    expect(netlify).toContain('NEXT_PUBLIC_SITE_URL = "https://homeselltips.vercel.app"');
    expect(netlify).toContain('X-Robots-Tag = "noindex"');
    const vercelKeys = vercel.headers.flatMap((group) => group.headers.map((header) => header.key));
    expect(vercelKeys).not.toContain("X-Robots-Tag");
    expect(vercel.headers).toEqual(RESPONSE_HEADERS);
    for (const path of NETLIFY_STATIC_IMAGE_PATHS) {
      expect(netlify).toContain(`for = "${path}"`);
    }
    expect(netlify).toContain(`for = "${NETLIFY_GENERATED_OG_PATH}"`);
    expect(netlify).toContain(`Cache-Control = "${STATIC_IMAGE_CACHE_CONTROL}"`);
    expect(netlify).toContain(`Cache-Control = "${GENERATED_OG_CACHE_CONTROL}"`);
    expect(STATIC_IMAGE_CACHE_CONTROL).toBe("public, max-age=31536000, immutable");
    expect(GENERATED_OG_CACHE_CONTROL).toContain("s-maxage=2592000");
    expect(GENERATED_OG_CACHE_CONTROL).toContain("stale-while-revalidate=604800");
    const robots = readFileSync(resolve(process.cwd(), "app/robots.ts"), "utf8");
    expect(robots).toContain('allow: "/"');
    expect(robots).not.toContain("noindex");
    const footer = readFileSync(resolve(process.cwd(), "components/site-footer.tsx"), "utf8");
    expect(footer).toContain('href="/about"');
    const about = readFileSync(resolve(process.cwd(), "app/about/page.tsx"), "utf8");
    expect(about).toContain('href="/advertise"');
  });

  it("sets a canonical path from every page module", () => {
    const pageModules = walk(resolve(process.cwd(), "app")).filter((file) => file.endsWith("page.tsx"));
    expect(pageModules.length).toBeGreaterThan(10);
    for (const file of pageModules) {
      expect(readFileSync(file, "utf8")).toContain("pageMetadata");
    }
    const layout = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain("/og.png");
    expect(layout).toContain('width: 1200');
  });

  it("compares admin token digests without treating a different length as a match", () => {
    expect(digestsMatch(tokenDigest("alpha"), tokenDigest("alpha"))).toBe(true);
    expect(digestsMatch(tokenDigest("alpha"), tokenDigest("beta"))).toBe(false);
    expect(digestsMatch("short", tokenDigest("alpha"))).toBe(false);
  });
});
