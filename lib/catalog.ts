import outboxJson from "@/content/outbox.json";
import placementsJson from "@/content/placements.json";
import reviewsJson from "@/content/reviews.json";
import tipsJson from "@/content/tips.json";
import { parseOutbox, parsePlacements, parseReviews, parseTips } from "@/lib/parse";

export const tips = parseTips(tipsJson);
export const reviews = parseReviews(reviewsJson);
export const productionPlacements = parsePlacements(placementsJson);
export const outbox = parseOutbox(outboxJson);
