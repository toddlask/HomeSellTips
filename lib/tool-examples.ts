import { commissionAmount, commissionComparison, formatUsd, netProceeds } from "@/lib/money";
import { netOfItem } from "@/lib/roi";
import { busiestMonth, SEASON_MONTHS, timingReading } from "@/lib/season";

export const PROCEEDS_EXAMPLE = {
  salePrice: 400_000,
  mortgagePayoff: 220_000,
  listingPercent: 3,
  listingFlat: 0,
  buyerPercent: 2.5,
  buyerFlat: 0,
  closingCosts: 8_000,
  sellerCredits: 2_000,
  repairCosts: 3_000,
} as const;

export const COMMISSION_EXAMPLE = {
  price: 400_000,
  listingPercent: 3,
  buyerPercent: 2.5,
  listingFlat: 0,
  buyerFlat: 0,
} as const;

export const FIX_EXAMPLE = {
  cost: 450,
  expectedValue: 1_200,
} as const;

export const TIMING_EXAMPLE = {
  moveDateFixed: false,
  houseReady: false,
} as const;

export function proceedsExampleResult() {
  return netProceeds({
    salePrice: PROCEEDS_EXAMPLE.salePrice,
    mortgagePayoff: PROCEEDS_EXAMPLE.mortgagePayoff,
    listingCommission: commissionAmount(
      PROCEEDS_EXAMPLE.salePrice,
      PROCEEDS_EXAMPLE.listingPercent,
      PROCEEDS_EXAMPLE.listingFlat,
    ),
    buyerAgentCommission: commissionAmount(
      PROCEEDS_EXAMPLE.salePrice,
      PROCEEDS_EXAMPLE.buyerPercent,
      PROCEEDS_EXAMPLE.buyerFlat,
    ),
    closingCosts: PROCEEDS_EXAMPLE.closingCosts,
    sellerCredits: PROCEEDS_EXAMPLE.sellerCredits,
    repairCosts: PROCEEDS_EXAMPLE.repairCosts,
  });
}

export function commissionExampleResult() {
  return commissionComparison({
    price: COMMISSION_EXAMPLE.price,
    listingPercent: COMMISSION_EXAMPLE.listingPercent,
    buyerAgentPercent: COMMISSION_EXAMPLE.buyerPercent,
    listingFlatFee: COMMISSION_EXAMPLE.listingFlat,
    buyerAgentFlatFee: COMMISSION_EXAMPLE.buyerFlat,
  });
}

export function fixExampleNet(): number {
  return netOfItem(FIX_EXAMPLE);
}

export function proceedsExampleText(): string {
  const result = proceedsExampleResult();
  return `A ${formatUsd(PROCEEDS_EXAMPLE.salePrice)} sale with a ${formatUsd(PROCEEDS_EXAMPLE.mortgagePayoff)} payoff, a 3 percent listing commission, a 2.5 percent buyer-agent commission, ${formatUsd(PROCEEDS_EXAMPLE.closingCosts)} of closing costs, ${formatUsd(PROCEEDS_EXAMPLE.sellerCredits)} of seller credits, and ${formatUsd(PROCEEDS_EXAMPLE.repairCosts)} of repairs leaves ${formatUsd(result.proceeds)}.`;
}

export function commissionExampleText(): string {
  const result = commissionExampleResult();
  return `On a ${formatUsd(COMMISSION_EXAMPLE.price)} sale, 3 percent to the listing side and 2.5 percent to the buyer agent is ${formatUsd(result.fullService)} together, ${formatUsd(result.fsboBuyerOnly)} if you pay only the buyer agent, and ${formatUsd(result.fsboNeither)} if you pay neither.`;
}

export function fixExampleText(): string {
  return `A leak repair at ${formatUsd(FIX_EXAMPLE.cost)} with an expected value of ${formatUsd(FIX_EXAMPLE.expectedValue)} ranks at ${formatUsd(fixExampleNet())} (your value minus your cost).`;
}

export function timingExampleText(): string {
  const busiest = busiestMonth(SEASON_MONTHS);
  return `${timingReading(TIMING_EXAMPLE)} In this table, ${busiest.label} has the most closed sales.`;
}
