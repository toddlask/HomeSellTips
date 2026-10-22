import { isAffirmative } from "@/lib/flags";
import type { AffiliateKind, AffiliateOffer, StageId } from "@/lib/types";

export const AFFILIATE_DISCLOSURE =
  "Affiliate link: we may earn a commission if you buy through this link. It does not change the price you pay.";

export function affiliateLabel(kind: AffiliateKind): string {
  switch (kind) {
    case "moving-boxes":
      return "Moving boxes";
    case "home-warranty":
      return "Home warranty";
    case "staging-supplies":
      return "Staging supplies";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export type AffiliateEnv = {
  AFFILIATES_ENABLED?: string;
  AFFILIATE_MOVING_BOXES_URL?: string;
  AFFILIATE_HOME_WARRANTY_URL?: string;
  AFFILIATE_STAGING_SUPPLIES_URL?: string;
};

export function affiliateOffers(env?: AffiliateEnv): AffiliateOffer[] {
  const source: AffiliateEnv = env ?? {
    AFFILIATES_ENABLED: process.env.AFFILIATES_ENABLED,
    AFFILIATE_MOVING_BOXES_URL: process.env.AFFILIATE_MOVING_BOXES_URL,
    AFFILIATE_HOME_WARRANTY_URL: process.env.AFFILIATE_HOME_WARRANTY_URL,
    AFFILIATE_STAGING_SUPPLIES_URL: process.env.AFFILIATE_STAGING_SUPPLIES_URL,
  };
  if (!isAffirmative(source.AFFILIATES_ENABLED)) {
    return [];
  }
  const candidates: Array<{ kind: AffiliateKind; href: string | undefined }> = [
    { kind: "moving-boxes", href: source.AFFILIATE_MOVING_BOXES_URL },
    { kind: "home-warranty", href: source.AFFILIATE_HOME_WARRANTY_URL },
    { kind: "staging-supplies", href: source.AFFILIATE_STAGING_SUPPLIES_URL },
  ];
  const offers: AffiliateOffer[] = [];
  for (const candidate of candidates) {
    const href = candidate.href?.trim() ?? "";
    if (!href) {
      continue;
    }
    offers.push({ kind: candidate.kind, href, label: affiliateLabel(candidate.kind) });
  }
  return offers;
}

export function offersForStage(stage: StageId, offers: readonly AffiliateOffer[]): AffiliateOffer[] {
  switch (stage) {
    case "moving":
      return offers.filter((offer) => offer.kind === "moving-boxes" || offer.kind === "home-warranty");
    case "staging":
      return offers.filter((offer) => offer.kind === "staging-supplies");
    case "prep-and-repairs":
    case "pricing":
    case "listing-photos":
    case "agent-vs-fsbo":
    case "offers-and-negotiation":
    case "closing":
      return [];
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}
