import { describe, expect, it } from "vitest";
import {
  commissionAmount,
  commissionComparison,
  formatUsd,
  hasInvalidMoney,
  netProceeds,
  parseMoney,
} from "@/lib/money";

describe("net proceeds", () => {
  it("subtracts the known line items", () => {
    const result = netProceeds({
      salePrice: 400_000,
      mortgagePayoff: 200_000,
      listingCommission: 12_000,
      buyerAgentCommission: 10_000,
      closingCosts: 8_000,
      sellerCredits: 2_000,
      repairCosts: 5_000,
    });
    expect(result.proceeds).toBe(163_000);
    expect(result.lineItems.map((item) => item.amount)).toEqual([400_000, 200_000, 12_000, 10_000, 8_000, 2_000, 5_000]);
    expect(formatUsd(result.proceeds)).toBe("$163,000.00");
  });

  it("turns entered rates into commission amounts", () => {
    expect(commissionAmount(400_000, 3, 0)).toBe(12_000);
    expect(commissionAmount(400_000, 2.5, 0)).toBe(10_000);
  });

  it("rejects negative and blank-invalid money", () => {
    expect(parseMoney("")).toBe(0);
    expect(parseMoney("12.5")).toBe(12.5);
    expect(parseMoney("nope")).toBeNull();
    expect(hasInvalidMoney([0, 10])).toBe(false);
    expect(hasInvalidMoney([-1])).toBe(true);
    expect(hasInvalidMoney([null])).toBe(true);
  });
});

describe("commission comparison", () => {
  it("compares full service, buyer-agent-only, and neither from the same inputs", () => {
    const result = commissionComparison({
      price: 500_000,
      listingPercent: 2.5,
      buyerAgentPercent: 2.5,
      listingFlatFee: 500,
      buyerAgentFlatFee: 0,
    });
    expect(result.listingCommission).toBe(13_000);
    expect(result.buyerAgentCommission).toBe(12_500);
    expect(result.fullService).toBe(25_500);
    expect(result.fsboBuyerOnly).toBe(12_500);
    expect(result.fsboNeither).toBe(0);
  });

  it("allows zero rates", () => {
    const result = commissionComparison({
      price: 250_000,
      listingPercent: 0,
      buyerAgentPercent: 0,
      listingFlatFee: 0,
      buyerAgentFlatFee: 0,
    });
    expect(result.fullService).toBe(0);
    expect(result.fsboBuyerOnly).toBe(0);
    expect(result.fsboNeither).toBe(0);
  });
});
