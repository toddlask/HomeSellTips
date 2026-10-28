import { STAGE_IDS, type Placement, type StageId, type Tip, type TipStatus } from "@/lib/types";

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

export const FIXTURE_PUBLISHED_SLUG = "fixture-deep-clean";
export const FIXTURE_QUEUED_SLUG = "fixture-replace-caulk";
export const FIXTURE_ARCHIVED_SLUG = "fixture-archived-note";
export const FIXTURE_NEWEST_PUBLISHED_ON = "2026-10-22";

function fixtureTip(input: {
  slug: string;
  stage: StageId;
  status: TipStatus;
  updatedOn: string;
  queueOrder: number;
}): Tip {
  return {
    slug: input.slug,
    title: "Fixture tip",
    stage: input.stage,
    status: input.status,
    updatedOn: input.updatedOn,
    queueOrder: input.queueOrder,
    summary: "Fixture summary used only in tests.",
    body: ["Fixture body used only in tests."],
    steps: ["Fixture step used only in tests."],
  };
}

export function fixtureLibrary(): Tip[] {
  const tips: Tip[] = [];
  for (const stage of STAGE_IDS) {
    const newest = stage === "pricing";
    tips.push(
      fixtureTip({
        slug: newest ? FIXTURE_PUBLISHED_SLUG : `${stage}-published-a`,
        stage,
        status: "published",
        updatedOn: newest ? FIXTURE_NEWEST_PUBLISHED_ON : "2026-10-21",
        queueOrder: 0,
      }),
      fixtureTip({
        slug: `${stage}-published-b`,
        stage,
        status: "published",
        updatedOn: "2026-10-21",
        queueOrder: 0,
      }),
    );
  }
  const queuedStages: StageId[] = ["prep-and-repairs", "staging", "pricing", "listing-photos", "closing", "moving"];
  for (const [index, stage] of queuedStages.entries()) {
    tips.push(
      fixtureTip({
        slug: index === 0 ? FIXTURE_QUEUED_SLUG : `fixture-queued-${index}`,
        stage,
        status: "queued",
        updatedOn: "2026-10-21",
        queueOrder: index + 1,
      }),
    );
  }
  tips.push(
    fixtureTip({
      slug: FIXTURE_ARCHIVED_SLUG,
      stage: "moving",
      status: "archived",
      updatedOn: "2026-10-21",
      queueOrder: 0,
    }),
  );
  return tips;
}
