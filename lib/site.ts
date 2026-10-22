import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import type { StageId, Tip } from "@/lib/types";
import { STAGE_IDS } from "@/lib/types";

export const SITE_NAME = "Helpful Ideas and Tips for Selling Your Home";

export const ANNOUNCEMENT = "Selling your home is a chance to get ready for a new chapter.";

export const CALCULATOR_NOTE = "Calculators use only the numbers you enter.";

export const DISCLAIMER =
  `${SITE_NAME} is not legal, financial, tax, or real-estate advice. Rules vary by state. Consult a licensed real-estate agent, an attorney, or a tax advisor.`;

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export function publishedTips(tips: readonly Tip[]): Tip[] {
  return tips.filter((tip) => tip.status === "published");
}

export function archivedTips(tips: readonly Tip[]): Tip[] {
  return tips.filter((tip) => tip.status === "archived");
}

export function tipsForStage(tips: readonly Tip[], stage: StageId): Tip[] {
  return publishedTips(tips).filter((tip) => tip.stage === stage);
}

export type SitemapEntry = {
  path: string;
  lastModified: string;
};

export function publicPaths(tips: readonly Tip[]): SitemapEntry[] {
  const staticPaths = [
    "/",
    "/archive",
    "/advertise",
    "/privacy",
    "/disclosure",
    "/tools/net-proceeds",
    "/tools/commission",
    "/tools/what-to-fix",
    "/tools/checklist",
  ];
  const entries: SitemapEntry[] = staticPaths.map((path) => ({
    path,
    lastModified: "2026-10-21",
  }));
  for (const stage of STAGE_IDS) {
    const stageTips = tipsForStage(tips, stage);
    const lastModified = stageTips.map((tip) => tip.updatedOn).toSorted().at(-1) ?? "2026-10-21";
    entries.push({ path: stagePath(stage), lastModified });
  }
  for (const tip of publishedTips(tips)) {
    entries.push({ path: `/tips/${tip.slug}`, lastModified: tip.updatedOn });
  }
  for (const tip of archivedTips(tips)) {
    entries.push({ path: `/tips/${tip.slug}`, lastModified: tip.updatedOn });
  }
  return entries;
}

export function llmsText(): string {
  const stages = STAGE_IDS.map((stage) => `- ${stageTitle(stage)}: ${stageSummary(stage)}`).join("\n");
  return `# HomeSellTips

HomeSellTips is a public website of practical tips for people in the United States who expect to sell a home in about one to six months, including people considering a first sale or a for-sale-by-owner sale.

${DISCLAIMER}

## Stages

${stages}

## Tools

- Net proceeds calculator. You enter the sale price, mortgage payoff, commissions, closing costs, seller credits, and repair costs.
- Commission comparison. You enter the price, listing percent, buyer-agent percent, and any flat fees. It compares full service, FSBO paying a buyer agent, and FSBO paying neither.
- What to fix first. You enter a cost and your own expected value. The list sorts by your value minus your cost. It does not supply a return rate.
- Printable seller prep checklist.

## Content

Tips are original and stored in the repository. A daily GitHub Action around 14:00 UTC publishes one queued tip only when the newest published tip is at least two days old. The job does not call a language model and does not invent text. If review is required, it records a review item in git instead of publishing.

## Advertising

Paid placements are labeled Sponsored and stay hidden until an admin approves them in git. They expire on the date stored with the placement. The sitewide header has one slot. Ads load only after cookie consent and only when a publisher id is configured. Affiliate links are off unless that flag is turned on, and they carry a disclosure beside the link.

## Not included

No accounts, no comments, and no newsletter.
`;
}

export function tipStatusLabel(status: Tip["status"]): string {
  switch (status) {
    case "published":
      return "Published";
    case "queued":
      return "Queued";
    case "archived":
      return "Archived";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
