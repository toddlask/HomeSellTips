import { daysBetweenIso } from "@/lib/dates";
import { placementProductLabel } from "@/lib/placements";
import type { OutboxDraft, Placement } from "@/lib/types";

export const EMAIL_DELIVERY_ENABLED = false;

export function deliverEmail(): never {
  throw new Error("Email delivery is disabled. Drafts stay in the admin outbox.");
}

export function isRenewalWindow(expiresOn: string, today: string): boolean {
  const days = daysBetweenIso(today, expiresOn);
  return days >= 0 && days <= 7;
}

export function buildRenewalDraft(placement: Placement, today: string): OutboxDraft {
  return {
    id: `renewal-${placement.id}-${placement.expiresOn}`,
    placementId: placement.id,
    subject: `Your HomeSellTips ${placementProductLabel(placement.product)} ends ${placement.expiresOn}`,
    body: [
      `Hello ${placement.sponsorName},`,
      "",
      `Your paid placement (${placement.id}) is scheduled to end on ${placement.expiresOn}.`,
      "This note is a draft in the admin outbox. It has not been sent.",
      "A renewal still needs admin approval before anything shows on the site.",
      "",
      `Drafted ${today}.`,
    ].join("\n"),
    createdOn: today,
    status: "draft",
  };
}

export function planRenewalDrafts(
  placements: readonly Placement[],
  existing: readonly OutboxDraft[],
  today: string,
): OutboxDraft[] {
  const known = new Set(existing.map((draft) => draft.id));
  const additions: OutboxDraft[] = [];
  for (const placement of placements) {
    if (!placement.approved || !isRenewalWindow(placement.expiresOn, today)) {
      continue;
    }
    const draft = buildRenewalDraft(placement, today);
    if (known.has(draft.id)) {
      continue;
    }
    additions.push(draft);
  }
  if (additions.length === 0) {
    return [...existing];
  }
  return [...existing, ...additions];
}
