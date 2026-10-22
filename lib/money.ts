export type ProceedsInput = {
  salePrice: number;
  mortgagePayoff: number;
  listingCommission: number;
  buyerAgentCommission: number;
  closingCosts: number;
  sellerCredits: number;
  repairCosts: number;
};

export type LineItem = {
  id: string;
  label: string;
  amount: number;
  kind: "start" | "cost";
};

export type ProceedsResult = {
  lineItems: LineItem[];
  proceeds: number;
};

export type CommissionInput = {
  price: number;
  listingPercent: number;
  buyerAgentPercent: number;
  listingFlatFee: number;
  buyerAgentFlatFee: number;
};

export type CommissionResult = {
  listingCommission: number;
  buyerAgentCommission: number;
  fullService: number;
  fsboBuyerOnly: number;
  fsboNeither: number;
};

export function roundCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function parseMoney(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return 0;
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return null;
  }
  return value;
}

export function hasInvalidMoney(values: Array<number | null>): boolean {
  return values.some((value) => value === null || !Number.isFinite(value) || value < 0);
}

export function commissionAmount(price: number, percent: number, flatFee: number): number {
  return roundCents((price * percent) / 100 + flatFee);
}

export function netProceeds(input: ProceedsInput): ProceedsResult {
  const lineItems: LineItem[] = [
    { id: "sale-price", label: "Sale price", amount: roundCents(input.salePrice), kind: "start" },
    { id: "mortgage-payoff", label: "Mortgage payoff", amount: roundCents(input.mortgagePayoff), kind: "cost" },
    { id: "listing-commission", label: "Listing commission", amount: roundCents(input.listingCommission), kind: "cost" },
    {
      id: "buyer-agent-commission",
      label: "Buyer agent commission",
      amount: roundCents(input.buyerAgentCommission),
      kind: "cost",
    },
    { id: "closing-costs", label: "Closing costs", amount: roundCents(input.closingCosts), kind: "cost" },
    { id: "seller-credits", label: "Seller credits", amount: roundCents(input.sellerCredits), kind: "cost" },
    { id: "repair-costs", label: "Repair costs", amount: roundCents(input.repairCosts), kind: "cost" },
  ];
  const proceeds = roundCents(
    input.salePrice -
      input.mortgagePayoff -
      input.listingCommission -
      input.buyerAgentCommission -
      input.closingCosts -
      input.sellerCredits -
      input.repairCosts,
  );
  return { lineItems, proceeds };
}

export function commissionComparison(input: CommissionInput): CommissionResult {
  const listingCommission = commissionAmount(input.price, input.listingPercent, input.listingFlatFee);
  const buyerAgentCommission = commissionAmount(input.price, input.buyerAgentPercent, input.buyerAgentFlatFee);
  return {
    listingCommission,
    buyerAgentCommission,
    fullService: roundCents(listingCommission + buyerAgentCommission),
    fsboBuyerOnly: buyerAgentCommission,
    fsboNeither: 0,
  };
}
