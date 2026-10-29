import { isIsoDate } from "@/lib/dates";
import {
  PLACEMENT_PRODUCTS,
  STAGE_IDS,
  TIP_STATUSES,
  type OutboxDraft,
  type OutboxFile,
  type Placement,
  type PlacementProduct,
  type ProCategory,
  type ReviewFile,
  type ReviewItem,
  type ReviewStatus,
  type StageId,
  type Tip,
  type TipStatus,
} from "@/lib/types";

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value;
}

function asStringList(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`${label} must be a list of strings.`);
  }
  return value as string[];
}

function asBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be true or false.`);
  }
  return value;
}

function asDate(value: unknown, label: string): string {
  if (typeof value !== "string" || !isIsoDate(value)) {
    throw new Error(`${label} must be a YYYY-MM-DD date.`);
  }
  return value;
}

export function parseStageId(value: unknown): StageId {
  if (typeof value !== "string") {
    throw new Error("Stage must be a string.");
  }
  switch (value) {
    case "prep-and-repairs":
    case "staging":
    case "pricing":
    case "listing-photos":
    case "agent-vs-fsbo":
    case "offers-and-negotiation":
    case "closing":
    case "moving":
      return value;
    default:
      throw new Error(`Unknown stage: ${value}`);
  }
}

function parseTipStatus(value: unknown): TipStatus {
  if (typeof value !== "string") {
    throw new Error("Tip status must be a string.");
  }
  switch (value) {
    case "published":
    case "queued":
      return value;
    default:
      throw new Error(`Unknown tip status: ${value}`);
  }
}

function parseReviewStatus(value: unknown): ReviewStatus {
  if (typeof value !== "string") {
    throw new Error("Review status must be a string.");
  }
  switch (value) {
    case "open":
    case "approved":
      return value;
    default:
      throw new Error(`Unknown review status: ${value}`);
  }
}

export function parseProCategory(value: unknown): ProCategory {
  if (typeof value !== "string") {
    throw new Error("Category must be a string.");
  }
  switch (value) {
    case "agent":
    case "photographer":
    case "stager":
    case "inspector":
    case "attorney":
    case "mover":
    case "handyman":
      return value;
    default:
      throw new Error(`Unknown category: ${value}`);
  }
}

function parsePlacementProduct(value: unknown): PlacementProduct {
  if (typeof value !== "string") {
    throw new Error("Placement product must be a string.");
  }
  switch (value) {
    case "category-sponsor":
    case "sitewide-header":
      return value;
    default:
      throw new Error(`Unknown placement product: ${value}`);
  }
}

function parseTip(value: unknown): Tip {
  const record = asRecord(value, "Tip");
  const status = parseTipStatus(record.status);
  const stage = parseStageId(record.stage);
  if (!TIP_STATUSES.includes(status) || !STAGE_IDS.includes(stage)) {
    throw new Error("Tip failed status or stage checks.");
  }
  const queueOrder = record.queueOrder;
  if (typeof queueOrder !== "number" || !Number.isInteger(queueOrder)) {
    throw new Error("Tip queueOrder must be an integer.");
  }
  return {
    slug: asString(record.slug, "Tip slug"),
    title: asString(record.title, "Tip title"),
    stage,
    status,
    updatedOn: asDate(record.updatedOn, "Tip updatedOn"),
    ...(record.publishedOn === undefined
      ? {}
      : { publishedOn: asDate(record.publishedOn, "Tip publishedOn") }),
    queueOrder,
    summary: asString(record.summary, "Tip summary"),
    body: asStringList(record.body, "Tip body"),
    steps: asStringList(record.steps, "Tip steps"),
  };
}

export function parseTips(value: unknown): Tip[] {
  if (!Array.isArray(value)) {
    throw new Error("Tips must be a list.");
  }
  const tips = value.map((entry) => parseTip(entry));
  const slugs = new Set<string>();
  for (const tip of tips) {
    if (slugs.has(tip.slug)) {
      throw new Error(`Duplicate tip slug: ${tip.slug}`);
    }
    slugs.add(tip.slug);
  }
  return tips;
}

function parseReviewItem(value: unknown): ReviewItem {
  const record = asRecord(value, "Review");
  return {
    id: asString(record.id, "Review id"),
    tipSlug: asString(record.tipSlug, "Review tipSlug"),
    openedOn: asDate(record.openedOn, "Review openedOn"),
    status: parseReviewStatus(record.status),
  };
}

export function parseReviews(value: unknown): ReviewFile {
  const record = asRecord(value, "Reviews");
  if (!Array.isArray(record.items)) {
    throw new Error("Reviews items must be a list.");
  }
  return { items: record.items.map((item) => parseReviewItem(item)) };
}

function parsePlacement(value: unknown): Placement {
  const record = asRecord(value, "Placement");
  const categoryRaw = record.category;
  const category = categoryRaw === "" ? "" : parseProCategory(categoryRaw);
  if (!PLACEMENT_PRODUCTS.includes(parsePlacementProduct(record.product))) {
    throw new Error("Placement product failed checks.");
  }
  return {
    id: asString(record.id, "Placement id"),
    product: parsePlacementProduct(record.product),
    sponsorName: asString(record.sponsorName, "Sponsor name"),
    href: asString(record.href, "Placement href"),
    message: asString(record.message, "Placement message"),
    city: typeof record.city === "string" ? record.city : "",
    state: typeof record.state === "string" ? record.state : "",
    category,
    approved: asBoolean(record.approved, "Placement approved"),
    startsOn: asDate(record.startsOn, "Placement startsOn"),
    expiresOn: asDate(record.expiresOn, "Placement expiresOn"),
  };
}

export function parsePlacements(value: unknown): Placement[] {
  if (!Array.isArray(value)) {
    throw new Error("Placements must be a list.");
  }
  return value.map((entry) => parsePlacement(entry));
}

function parseDraft(value: unknown): OutboxDraft {
  const record = asRecord(value, "Draft");
  if (record.status !== "draft") {
    throw new Error("Outbox items must stay drafts. Sending is disabled.");
  }
  return {
    id: asString(record.id, "Draft id"),
    placementId: asString(record.placementId, "Draft placementId"),
    subject: asString(record.subject, "Draft subject"),
    body: asString(record.body, "Draft body"),
    createdOn: asDate(record.createdOn, "Draft createdOn"),
    status: "draft",
  };
}

export function parseOutbox(value: unknown): OutboxFile {
  const record = asRecord(value, "Outbox");
  if (!Array.isArray(record.drafts)) {
    throw new Error("Outbox drafts must be a list.");
  }
  return { drafts: record.drafts.map((draft) => parseDraft(draft)) };
}
