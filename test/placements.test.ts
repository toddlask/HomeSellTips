import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { PlacementBanner } from "@/components/placement-banner";
import { productionPlacements } from "@/lib/catalog";
import { headerSlotTaken, selectSitewideHeader, SPONSORED_LABEL } from "@/lib/placements";
import { fixtureCategorySponsor, fixtureHeader, fixtureSecondHeader, FIXTURE_NAME } from "./fixtures";

describe("paid placements", () => {
  it("labels a fixture placement Sponsored and keeps it out of production content", () => {
    const html = renderToStaticMarkup(createElement(PlacementBanner, { placement: fixtureHeader }));
    expect(html).toContain(SPONSORED_LABEL);
    expect(html).toContain(FIXTURE_NAME);

    const content = ["content/placements.json", "content/tips.json"]
      .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
      .join("\n");
    expect(content).not.toContain(FIXTURE_NAME);
    expect(productionPlacements).toEqual([]);
    expect(existsSync(resolve(process.cwd(), "content/listings.json"))).toBe(false);
    expect(existsSync(resolve(process.cwd(), "app/directory/page.tsx"))).toBe(false);
  });

  it("keeps a single active header slot and expires old placements", () => {
    const today = "2026-10-21";
    expect(selectSitewideHeader([fixtureHeader, fixtureSecondHeader], today)?.id).toBe("fixture-header");
    expect(headerSlotTaken([fixtureHeader], today)).toBe(true);
    expect(headerSlotTaken([], today)).toBe(false);
    const expired = { ...fixtureCategorySponsor, expiresOn: "2026-10-20" };
    expect(selectSitewideHeader([{ ...fixtureHeader, expiresOn: "2026-10-20" }], today)).toBeNull();
    expect(expired.approved).toBe(true);
  });
});
