import { todayIso } from "../lib/dates";
import { parseReviews, parseTips } from "../lib/parse";
import { approveReview } from "../lib/publish";
import { readJson, writeJson } from "./content-store";

const reviewId = process.argv[2]?.trim() ?? "";
if (!reviewId) {
  console.error("Usage: npm run content:approve -- <reviewId>");
  process.exit(1);
}

const today = process.env.PUBLISH_TODAY?.trim() || todayIso();
const next = approveReview(parseTips(readJson("tips.json")), parseReviews(readJson("reviews.json")), reviewId, today);
writeJson("tips.json", next.tips);
writeJson("reviews.json", next.reviews);
console.log(`Approved ${reviewId} on ${today}. Push the commit so both hosts pick it up.`);
