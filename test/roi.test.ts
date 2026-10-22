import { describe, expect, it } from "vitest";
import { netOfItem, rankFixItems } from "@/lib/roi";

describe("what to fix first", () => {
  it("sorts by the user's value minus cost", () => {
    const ranked = rankFixItems([
      { id: "paint", bucket: "paint-floors", label: "Touch up scuffed paint", cost: 500, expectedValue: 200 },
      { id: "rail", bucket: "safety-function", label: "Secure a loose rail or step", cost: 100, expectedValue: 800 },
      { id: "remodel", bucket: "leave-for-buyer", label: "Full kitchen remodel", cost: 20_000, expectedValue: 5_000 },
    ]);
    expect(ranked.map((item) => item.id)).toEqual(["rail", "paint", "remodel"]);
    expect(netOfItem(ranked[0]!)).toBe(700);
    expect(netOfItem(ranked[2]!)).toBe(-15_000);
  });
});
