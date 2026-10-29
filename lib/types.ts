export const STAGE_IDS = [
  "prep-and-repairs",
  "staging",
  "pricing",
  "listing-photos",
  "agent-vs-fsbo",
  "offers-and-negotiation",
  "closing",
  "moving",
] as const;

export type StageId = (typeof STAGE_IDS)[number];

export const TIP_STATUSES = ["published", "queued"] as const;

export type TipStatus = (typeof TIP_STATUSES)[number];

export type Tip = {
  slug: string;
  title: string;
  stage: StageId;
  status: TipStatus;
  updatedOn: string;
  publishedOn?: string;
  queueOrder: number;
  summary: string;
  body: string[];
  steps: string[];
};

export type ReviewStatus = "open" | "approved";

export type ReviewItem = {
  id: string;
  tipSlug: string;
  openedOn: string;
  status: ReviewStatus;
};

export type ReviewFile = {
  items: ReviewItem[];
};

export const PRO_CATEGORIES = [
  "agent",
  "photographer",
  "stager",
  "inspector",
  "attorney",
  "mover",
  "handyman",
] as const;

export type ProCategory = (typeof PRO_CATEGORIES)[number];

export const PLACEMENT_PRODUCTS = ["category-sponsor", "sitewide-header"] as const;

export type PlacementProduct = (typeof PLACEMENT_PRODUCTS)[number];

export type Placement = {
  id: string;
  product: PlacementProduct;
  sponsorName: string;
  href: string;
  message: string;
  city: string;
  state: string;
  category: ProCategory | "";
  approved: boolean;
  startsOn: string;
  expiresOn: string;
};

export type OutboxDraft = {
  id: string;
  placementId: string;
  subject: string;
  body: string;
  createdOn: string;
  status: "draft";
};

export type OutboxFile = {
  drafts: OutboxDraft[];
};

export const ROI_BUCKETS = [
  "safety-function",
  "curb-entry",
  "kitchen-baths",
  "paint-floors",
  "leave-for-buyer",
] as const;

export type RoiBucket = (typeof ROI_BUCKETS)[number];

export type RoiItem = {
  id: string;
  bucket: RoiBucket;
  label: string;
  cost: number;
  expectedValue: number;
};

export const AD_SLOTS = ["header", "in-content", "sidebar"] as const;

export type AdSlotName = (typeof AD_SLOTS)[number];

export const AFFILIATE_KINDS = ["moving-boxes", "home-warranty", "staging-supplies"] as const;

export type AffiliateKind = (typeof AFFILIATE_KINDS)[number];

export type AffiliateOffer = {
  kind: AffiliateKind;
  href: string;
  label: string;
};
