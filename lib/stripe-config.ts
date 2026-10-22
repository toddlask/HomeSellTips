import { isAffirmative } from "@/lib/flags";
import type { ProductId } from "@/lib/types";

export type StripeReadiness =
  | { state: "missing" }
  | { state: "refused"; reason: string }
  | { state: "ready" };

export type ProductOffer = {
  name: string;
  unitAmount: number;
  interval: "month" | "year";
  firstMonthHalfOff: boolean;
};

export function stripeReadiness(secret: string | undefined): StripeReadiness {
  const key = secret?.trim() ?? "";
  if (!key) {
    return { state: "missing" };
  }
  if (key.startsWith("sk_test_")) {
    return { state: "ready" };
  }
  if (key.startsWith("sk_live_")) {
    return {
      state: "refused",
      reason: "Live Stripe keys are refused. HomeSellTips stays in test mode until pricing is approved.",
    };
  }
  return { state: "refused", reason: "The Stripe secret must be a test key that starts with sk_test_." };
}

export function stripeStatusMessage(status: StripeReadiness): string {
  switch (status.state) {
    case "missing":
      return "Payments are not configured. Checkout stays off until a Stripe test key is set.";
    case "refused":
      return status.reason;
    case "ready":
      return "Checkout uses Stripe test mode. Cards are not charged as live payments.";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function parseProductId(value: string): ProductId | null {
  switch (value) {
    case "featured-monthly":
    case "featured-yearly":
    case "category-sponsor":
    case "header-sponsor":
      return value;
    default:
      return null;
  }
}

export function productOffer(id: ProductId, launchPromo: boolean): ProductOffer {
  switch (id) {
    case "featured-monthly":
      return {
        name: "Featured pro listing",
        unitAmount: 2900,
        interval: "month",
        firstMonthHalfOff: launchPromo,
      };
    case "featured-yearly":
      return {
        name: "Featured pro listing, yearly",
        unitAmount: 29000,
        interval: "year",
        firstMonthHalfOff: false,
      };
    case "category-sponsor":
      return {
        name: "Category sponsor banner",
        unitAmount: 9900,
        interval: "month",
        firstMonthHalfOff: launchPromo,
      };
    case "header-sponsor":
      return {
        name: "Sitewide header sponsor",
        unitAmount: 24900,
        interval: "month",
        firstMonthHalfOff: launchPromo,
      };
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

export function launchPromoEnabled(value: string | undefined): boolean {
  return isAffirmative(value);
}
