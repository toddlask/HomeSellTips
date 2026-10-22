import { todayIso } from "../lib/dates";
import { planRenewalDrafts } from "../lib/outbox";
import { parseOutbox, parsePlacements } from "../lib/parse";
import { readJson, writeJson } from "./content-store";

const today = process.env.PUBLISH_TODAY?.trim() || todayIso();
const existing = parseOutbox(readJson("outbox.json"));
const drafts = planRenewalDrafts(parsePlacements(readJson("placements.json")), existing.drafts, today);
if (drafts.length === existing.drafts.length) {
  console.log("skip: no new renewal drafts");
  process.exit(0);
}
writeJson("outbox.json", { drafts });
console.log(`drafted: ${drafts.length - existing.drafts.length} renewal note(s). Nothing was sent.`);
