import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { CONTENT_EPOCH, isIsoDate, todayIso } from "@/lib/dates";
import { affiliateOffers, AFFILIATE_DISCLOSURE } from "@/lib/affiliates";
import { adsTxtBody, adsTxtLine } from "@/lib/ads";
import { STAGE_IDS } from "@/lib/types";
import { publicPaths } from "@/lib/site";
import { deliverEmail, EMAIL_DELIVERY_ENABLED, planRenewalDrafts } from "@/lib/outbox";
import { digestsMatch, tokenDigest } from "@/lib/admin-token";
import { launchPromoEnabled, productOffer } from "@/lib/paypal-config";
import { fixtureCategorySponsor } from "./fixtures";
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

describe("published library", () => {
  it("has two published tips per stage, six queued tips, and an archive", () => {
    for (const stage of STAGE_IDS) {
      const published = tips.filter((tip) => tip.stage === stage && tip.status === "published");
      expect(published.length).toBeGreaterThanOrEqual(2);
    }
    expect(tips.filter((tip) => tip.status === "queued").length).toBeGreaterThanOrEqual(6);
    expect(tips.filter((tip) => tip.status === "archived").length).toBeGreaterThanOrEqual(1);
  });

  it("dates published content on the content epoch, not before it and not in the future", () => {
    const today = todayIso();
    for (const tip of tips) {
      expect(isIsoDate(tip.updatedOn)).toBe(true);
      expect(tip.updatedOn >= CONTENT_EPOCH).toBe(true);
      expect(tip.updatedOn <= today).toBe(true);
      expect(banned.test(`${tip.title} ${tip.summary} ${tip.body.join(" ")} ${tip.steps.join(" ")}`)).toBe(false);
    }
  });

  it("keeps queued tips out of the public sitemap paths' published set and includes archive", () => {
    const paths = publicPaths(tips).map((entry) => entry.path);
    expect(paths).toContain("/tips/deep-clean-after-the-dusty-work");
    expect(paths).not.toContain("/tips/replace-cracked-caulk-before-photos");
    expect(paths).not.toContain("/admin");
  });
});

describe("ads, affiliates, paypal, and email", () => {
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

  it("keeps the listed renewal price when the launch promo is on", () => {
    expect(launchPromoEnabled(undefined)).toBe(false);
    const monthly = productOffer("featured-monthly", true);
    expect(monthly.unitAmount).toBe(2900);
    expect(monthly.firstMonthHalfOff).toBe(true);
    expect(productOffer("featured-yearly", true).unitAmount).toBe(29000);
    expect(productOffer("featured-yearly", true).firstMonthHalfOff).toBe(false);
    expect(productOffer("category-sponsor", false).unitAmount).toBe(9900);
    expect(productOffer("header-sponsor", false).unitAmount).toBe(24900);
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
    const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/publish-tip.yml"), "utf8");
    expect(workflow).toContain('cron: "0 14 * * *"');
    expect(workflow).not.toMatch(/openai|anthropic|llm/i);
    const source = walk(process.cwd())
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    expect(source).not.toMatch(/nodemailer|@sendgrid|resend\.com|postmarkapp|mailgun/i);
    expect(source).not.toMatch(/\bstripe\b/i);
    expect(source).not.toMatch(/STRIPE_/);
    expect(source).not.toMatch(/https:\/\/api-m\.paypal\.com/);
  });

  it("compares admin token digests without treating a different length as a match", () => {
    expect(digestsMatch(tokenDigest("alpha"), tokenDigest("alpha"))).toBe(true);
    expect(digestsMatch(tokenDigest("alpha"), tokenDigest("beta"))).toBe(false);
    expect(digestsMatch("short", tokenDigest("alpha"))).toBe(false);
  });
});
