import { todayIso } from "../lib/dates";
import { isAffirmative } from "../lib/flags";
import { parseReviews, parseTips } from "../lib/parse";
import { planContentUpdate, type PublishAction } from "../lib/publish";
import { readJson, writeJson } from "./content-store";

const today = process.env.PUBLISH_TODAY?.trim() || todayIso();
const plan = planContentUpdate({
  tips: parseTips(readJson("tips.json")),
  reviews: parseReviews(readJson("reviews.json")),
  today,
  reviewRequired: isAffirmative(process.env.REVIEW_REQUIRED),
});

function logAction(action: PublishAction): void {
  switch (action) {
    case "skip":
    case "publish":
    case "queue-review":
      console.log(`${action}: ${plan.reason}`);
      return;
    default: {
      const exhaustive: never = action;
      throw new Error(exhaustive);
    }
  }
}

logAction(plan.action);

if (plan.action === "skip") {
  process.exit(0);
}

writeJson("tips.json", plan.tips);
writeJson("reviews.json", plan.reviews);
