import { describe, expect, it } from "vitest";
import { approveReview, planContentUpdate } from "@/lib/publish";
import { tips } from "@/lib/catalog";
import type { ReviewFile, Tip } from "@/lib/types";

const emptyReviews: ReviewFile = { items: [] };

function cloneTips(): Tip[] {
  return tips.map((tip) => ({ ...tip, body: [...tip.body], steps: [...tip.steps] }));
}

describe("every-other-day publisher", () => {
  it("skips when the newest published tip is under two days old", () => {
    const plan = planContentUpdate({
      tips: cloneTips(),
      reviews: emptyReviews,
      today: "2026-10-22",
      reviewRequired: false,
    });
    expect(plan.action).toBe("skip");
    expect(plan.tips.filter((tip) => tip.status === "queued")).toHaveLength(6);
  });

  it("publishes the next queued tip when the latest published tip is two days old", () => {
    const plan = planContentUpdate({
      tips: cloneTips(),
      reviews: emptyReviews,
      today: "2026-10-23",
      reviewRequired: false,
    });
    expect(plan.action).toBe("publish");
    const published = plan.tips.find((tip) => tip.slug === "replace-cracked-caulk-before-photos");
    expect(published?.status).toBe("published");
    expect(published?.updatedOn).toBe("2026-10-23");
  });

  it("opens a review item instead of publishing when review is required", () => {
    const plan = planContentUpdate({
      tips: cloneTips(),
      reviews: emptyReviews,
      today: "2026-10-23",
      reviewRequired: true,
    });
    expect(plan.action).toBe("queue-review");
    expect(plan.tips.every((tip) => tip.slug !== "replace-cracked-caulk-before-photos" || tip.status === "queued")).toBe(
      true,
    );
    expect(plan.reviews.items).toEqual([
      {
        id: "review-replace-cracked-caulk-before-photos",
        tipSlug: "replace-cracked-caulk-before-photos",
        openedOn: "2026-10-23",
        status: "open",
      },
    ]);
  });

  it("does not open a second review for the same tip", () => {
    const first = planContentUpdate({
      tips: cloneTips(),
      reviews: emptyReviews,
      today: "2026-10-23",
      reviewRequired: true,
    });
    const second = planContentUpdate({
      tips: first.tips,
      reviews: first.reviews,
      today: "2026-10-23",
      reviewRequired: true,
    });
    expect(second.action).toBe("skip");
    expect(second.reviews.items).toHaveLength(1);
  });

  it("approves a review by publishing that queued tip", () => {
    const queued = planContentUpdate({
      tips: cloneTips(),
      reviews: emptyReviews,
      today: "2026-10-23",
      reviewRequired: true,
    });
    const approved = approveReview(queued.tips, queued.reviews, "review-replace-cracked-caulk-before-photos", "2026-10-24");
    const tip = approved.tips.find((entry) => entry.slug === "replace-cracked-caulk-before-photos");
    expect(tip?.status).toBe("published");
    expect(tip?.updatedOn).toBe("2026-10-24");
    expect(approved.reviews.items[0]?.status).toBe("approved");
  });
});
