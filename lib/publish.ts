import { daysBetweenIso } from "@/lib/dates";
import type { ReviewFile, ReviewItem, Tip } from "@/lib/types";

export type PublishAction = "skip" | "publish" | "queue-review";

export type PublishPlan = {
  action: PublishAction;
  tips: Tip[];
  reviews: ReviewFile;
  reason: string;
};

export function latestPublishedOn(tips: readonly Tip[]): string | null {
  const dates = tips.filter((tip) => tip.status === "published").map((tip) => tip.updatedOn);
  if (dates.length === 0) {
    return null;
  }
  return dates.toSorted()[dates.length - 1] ?? null;
}

export function nextQueuedTip(tips: readonly Tip[]): Tip | null {
  const queued = tips.filter((tip) => tip.status === "queued");
  if (queued.length === 0) {
    return null;
  }
  return (
    queued.toSorted((left, right) => left.queueOrder - right.queueOrder || left.slug.localeCompare(right.slug))[0] ??
    null
  );
}

export function planContentUpdate(input: {
  tips: Tip[];
  reviews: ReviewFile;
  today: string;
  reviewRequired: boolean;
}): PublishPlan {
  const latest = latestPublishedOn(input.tips);
  if (latest !== null && daysBetweenIso(latest, input.today) < 2) {
    return {
      action: "skip",
      tips: input.tips,
      reviews: input.reviews,
      reason: "Latest published tip is less than 2 days old.",
    };
  }

  const next = nextQueuedTip(input.tips);
  if (!next) {
    return {
      action: "skip",
      tips: input.tips,
      reviews: input.reviews,
      reason: "No queued tip to publish.",
    };
  }

  if (input.reviewRequired) {
    const alreadyOpen = input.reviews.items.some((item) => item.tipSlug === next.slug && item.status === "open");
    if (alreadyOpen) {
      return {
        action: "skip",
        tips: input.tips,
        reviews: input.reviews,
        reason: "An open review already exists for the next tip.",
      };
    }
    const item: ReviewItem = {
      id: `review-${next.slug}`,
      tipSlug: next.slug,
      openedOn: input.today,
      status: "open",
    };
    return {
      action: "queue-review",
      tips: input.tips,
      reviews: { items: [...input.reviews.items, item] },
      reason: `Opened a review for ${next.slug}.`,
    };
  }

  const tips = input.tips.map((tip) =>
    tip.slug === next.slug ? { ...tip, status: "published" as const, updatedOn: input.today } : tip,
  );
  return {
    action: "publish",
    tips,
    reviews: input.reviews,
    reason: `Published ${next.slug}.`,
  };
}

export function approveReview(
  tips: Tip[],
  reviews: ReviewFile,
  reviewId: string,
  today: string,
): { tips: Tip[]; reviews: ReviewFile } {
  const item = reviews.items.find((review) => review.id === reviewId);
  if (!item || item.status !== "open") {
    throw new Error("No open review matches that id.");
  }
  const tip = tips.find((entry) => entry.slug === item.tipSlug);
  if (!tip || tip.status !== "queued") {
    throw new Error("The reviewed tip is not queued.");
  }
  return {
    tips: tips.map((entry) =>
      entry.slug === item.tipSlug ? { ...entry, status: "published" as const, updatedOn: today } : entry,
    ),
    reviews: {
      items: reviews.items.map((review) =>
        review.id === reviewId ? { ...review, status: "approved" as const } : review,
      ),
    },
  };
}
