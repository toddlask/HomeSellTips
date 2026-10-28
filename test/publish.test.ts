import { describe, expect, it } from "vitest";
import { approveReview, planContentUpdate } from "@/lib/publish";
import type { ReviewFile } from "@/lib/types";
import { FIXTURE_NEWEST_PUBLISHED_ON, FIXTURE_QUEUED_SLUG, fixtureLibrary } from "./fixtures";

const emptyReviews: ReviewFile = { items: [] };

describe("every-other-day publisher", () => {
  it("skips when the newest published tip is under two days old", () => {
    const plan = planContentUpdate({
      tips: fixtureLibrary(),
      reviews: emptyReviews,
      today: FIXTURE_NEWEST_PUBLISHED_ON,
      reviewRequired: false,
    });
    expect(plan.action).toBe("skip");
    expect(plan.tips.filter((tip) => tip.status === "queued")).toHaveLength(6);
  });

  it("publishes the next queued tip when the latest published tip is two days old", () => {
    const plan = planContentUpdate({
      tips: fixtureLibrary(),
      reviews: emptyReviews,
      today: "2026-10-24",
      reviewRequired: false,
    });
    expect(plan.action).toBe("publish");
    const published = plan.tips.find((tip) => tip.slug === FIXTURE_QUEUED_SLUG);
    expect(published?.status).toBe("published");
    expect(published?.updatedOn).toBe("2026-10-24");
    expect(plan.tips.filter((tip) => tip.status === "queued")).toHaveLength(5);
  });

  it("opens a review item instead of publishing when review is required", () => {
    const plan = planContentUpdate({
      tips: fixtureLibrary(),
      reviews: emptyReviews,
      today: "2026-10-24",
      reviewRequired: true,
    });
    expect(plan.action).toBe("queue-review");
    expect(plan.tips.every((tip) => tip.slug !== FIXTURE_QUEUED_SLUG || tip.status === "queued")).toBe(true);
    expect(plan.reviews.items).toEqual([
      {
        id: `review-${FIXTURE_QUEUED_SLUG}`,
        tipSlug: FIXTURE_QUEUED_SLUG,
        openedOn: "2026-10-24",
        status: "open",
      },
    ]);
  });

  it("does not open a second review for the same tip", () => {
    const first = planContentUpdate({
      tips: fixtureLibrary(),
      reviews: emptyReviews,
      today: "2026-10-24",
      reviewRequired: true,
    });
    const second = planContentUpdate({
      tips: first.tips,
      reviews: first.reviews,
      today: "2026-10-24",
      reviewRequired: true,
    });
    expect(second.action).toBe("skip");
    expect(second.reviews.items).toHaveLength(1);
  });

  it("approves a review by publishing that queued tip", () => {
    const queued = planContentUpdate({
      tips: fixtureLibrary(),
      reviews: emptyReviews,
      today: "2026-10-24",
      reviewRequired: true,
    });
    const approved = approveReview(queued.tips, queued.reviews, `review-${FIXTURE_QUEUED_SLUG}`, "2026-10-25");
    const tip = approved.tips.find((entry) => entry.slug === FIXTURE_QUEUED_SLUG);
    expect(tip?.status).toBe("published");
    expect(tip?.updatedOn).toBe("2026-10-25");
    expect(approved.reviews.items[0]?.status).toBe("approved");
  });

  it("skips when nothing is queued", () => {
    const plan = planContentUpdate({
      tips: fixtureLibrary().filter((tip) => tip.status !== "queued"),
      reviews: emptyReviews,
      today: "2026-10-24",
      reviewRequired: false,
    });
    expect(plan.action).toBe("skip");
    expect(plan.reason).toMatch(/no queued tip/i);
  });
});
