import type { Placement } from "@/lib/types";

export const FIXTURE_NAME = "Fixture Ridge Photography";

export const fixtureHeader: Placement = {
  id: "fixture-header",
  product: "sitewide-header",
  sponsorName: FIXTURE_NAME,
  href: "https://example.com/fixture-ridge",
  message: "Fixture placement used only in tests.",
  city: "",
  state: "",
  category: "",
  approved: true,
  startsOn: "2026-10-21",
  expiresOn: "2026-12-31",
};

export const fixtureSecondHeader: Placement = {
  ...fixtureHeader,
  id: "fixture-header-later",
  sponsorName: "Fixture Later Header",
  startsOn: "2026-10-22",
};

export const fixtureCategorySponsor: Placement = {
  id: "fixture-category",
  product: "category-sponsor",
  sponsorName: FIXTURE_NAME,
  href: "https://example.com/fixture-ridge",
  message: "Fixture category banner.",
  city: "Austin",
  state: "TX",
  category: "photographer",
  approved: true,
  startsOn: "2026-10-21",
  expiresOn: "2026-10-28",
};
