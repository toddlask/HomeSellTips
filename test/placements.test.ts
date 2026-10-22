import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { DirectoryResults, ListingCard } from "@/components/listing-card";
import { PlacementBanner } from "@/components/placement-banner";
import { productionListings, productionPlacements } from "@/lib/catalog";
import { filterListings } from "@/lib/listings";
import { headerSlotTaken, selectSitewideHeader, SPONSORED_LABEL } from "@/lib/placements";
import { fixtureCategorySponsor, fixtureHeader, fixtureListing, fixtureSecondHeader, FIXTURE_NAME } from "./fixtures";

describe("paid placements", () => {
  it("labels a fixture placement Sponsored and keeps it out of production content", () => {
    const html = renderToStaticMarkup(createElement(PlacementBanner, { placement: fixtureHeader }));
    expect(html).toContain(SPONSORED_LABEL);
    expect(html).toContain(FIXTURE_NAME);
    const card = renderToStaticMarkup(createElement(ListingCard, { listing: fixtureListing }));
    expect(card).toContain(SPONSORED_LABEL);

    const content = ["content/placements.json", "content/listings.json", "content/tips.json"]
      .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
      .join("\n");
    expect(content).not.toContain(FIXTURE_NAME);
    expect(productionPlacements).toEqual([]);
    expect(productionListings).toEqual([]);
    expect(filterListings(productionListings, { city: "Austin", state: "TX", category: "photographer" }, "2026-10-21")).toEqual(
      [],
    );
  });

  it("shows the directory empty state for production data", () => {
    const html = renderToStaticMarkup(
      createElement(DirectoryResults, {
        listings: filterListings(productionListings, { city: "Austin", state: "TX", category: null }, "2026-10-21"),
        emptyMessage: "No approved listings for Austin, TX.",
      }),
    );
    expect(html).toContain("No approved listings for Austin, TX.");
    expect(html).toContain("Advertise with us");
    expect(html).not.toContain(FIXTURE_NAME);
  });

  it("shows a fixture listing when tests pass one in, still labeled Sponsored", () => {
    const html = renderToStaticMarkup(
      createElement(DirectoryResults, {
        listings: [fixtureListing],
        emptyMessage: "unused",
      }),
    );
    expect(html).toContain(SPONSORED_LABEL);
    expect(html).toContain(FIXTURE_NAME);
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
