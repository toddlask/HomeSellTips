import type { Placement, PlacementProduct, ProCategory } from "@/lib/types";

export const SPONSORED_LABEL = "Sponsored";

export function placementProductLabel(product: PlacementProduct): string {
  switch (product) {
    case "category-sponsor":
      return "Category sponsor banner";
    case "sitewide-header":
      return "Sitewide header sponsor";
    default: {
      const exhaustive: never = product;
      return exhaustive;
    }
  }
}

export function isActivePlacement(placement: Placement, today: string): boolean {
  return placement.approved && placement.startsOn <= today && placement.expiresOn >= today;
}

export function selectSitewideHeader(placements: readonly Placement[], today: string): Placement | null {
  const headers = placements.filter(
    (placement) => placement.product === "sitewide-header" && isActivePlacement(placement, today),
  );
  if (headers.length === 0) {
    return null;
  }
  return (
    headers.toSorted((left, right) => left.startsOn.localeCompare(right.startsOn) || left.id.localeCompare(right.id))[0] ??
    null
  );
}

export function headerSlotTaken(placements: readonly Placement[], today: string): boolean {
  return selectSitewideHeader(placements, today) !== null;
}

export function activeCategorySponsor(
  placements: readonly Placement[],
  category: ProCategory,
  today: string,
): Placement | null {
  const matches = placements.filter(
    (placement) =>
      placement.product === "category-sponsor" &&
      placement.category === category &&
      isActivePlacement(placement, today),
  );
  return matches.toSorted((left, right) => left.id.localeCompare(right.id))[0] ?? null;
}
