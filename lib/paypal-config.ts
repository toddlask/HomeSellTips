import { isAffirmative } from "@/lib/flags";
import type { ProductId } from "@/lib/types";

export type PaypalReadiness =
  | { state: "missing" }
  | { state: "refused"; reason: string }
  | { state: "ready" };

export type PaypalEnv = {
  clientId: string | undefined;
  clientSecret: string | undefined;
  mode: string | undefined;
};

export type ProductOffer = {
  name: string;
  unitAmount: number;
  interval: "month" | "year";
  firstMonthHalfOff: boolean;
};

function normalizedMode(mode: string | undefined): string {
  return mode?.trim().toLowerCase() ?? "";
}

export function paypalReadiness(env: PaypalEnv): PaypalReadiness {
  const mode = normalizedMode(env.mode);
  const clientId = env.clientId?.trim() ?? "";
  const clientSecret = env.clientSecret?.trim() ?? "";

  if (mode === "live" || mode === "production") {
    return {
      state: "refused",
      reason: "Live PayPal mode is refused. HomeSellTips stays in the PayPal sandbox.",
    };
  }
  if (mode !== "" && mode !== "sandbox") {
    return {
      state: "refused",
      reason: "PayPal mode must be sandbox. Live charges are not available.",
    };
  }
  if (!clientId || !clientSecret) {
    return { state: "missing" };
  }
  if (mode !== "sandbox") {
    return {
      state: "refused",
      reason: "PayPal mode must be sandbox. Live charges are not available.",
    };
  }
  return { state: "ready" };
}

export function paypalStatusMessage(status: PaypalReadiness): string {
  switch (status.state) {
    case "missing":
      return "Payments are not configured. Checkout stays off until a PayPal sandbox client id and secret are set.";
    case "refused":
      return status.reason;
    case "ready":
      return "Checkout uses the PayPal sandbox. These payments are not live charges.";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function parseProductId(value: string): ProductId | null {
  switch (value) {
    case "category-sponsor":
    case "header-sponsor":
      return value;
    default:
      return null;
  }
}

export function productOffer(id: ProductId, launchPromo: boolean): ProductOffer {
  switch (id) {
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

export function chargeCents(offer: ProductOffer): number {
  if (offer.firstMonthHalfOff) {
    return Math.round(offer.unitAmount / 2);
  }
  return offer.unitAmount;
}

export function formatUsd(cents: number): string {
  const dollars = Math.trunc(cents / 100);
  const remainder = Math.abs(cents % 100);
  return `${dollars}.${remainder.toString().padStart(2, "0")}`;
}
