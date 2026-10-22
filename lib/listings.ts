import type { Listing, ProCategory } from "@/lib/types";

export function categoryLabel(category: ProCategory): string {
  switch (category) {
    case "agent":
      return "Agent";
    case "photographer":
      return "Photographer";
    case "stager":
      return "Stager";
    case "inspector":
      return "Inspector";
    case "attorney":
      return "Attorney";
    case "mover":
      return "Mover";
    case "handyman":
      return "Handyman";
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
}

export function isLiveListing(listing: Listing, today: string): boolean {
  return listing.approved && listing.paid && listing.startsOn <= today && listing.expiresOn >= today;
}

export type ListingQuery = {
  city: string;
  state: string;
  category: ProCategory | null;
};

export function filterListings(listings: readonly Listing[], query: ListingQuery, today: string): Listing[] {
  const city = query.city.trim().toLowerCase();
  return listings.filter((listing) => {
    if (!isLiveListing(listing, today)) {
      return false;
    }
    if (query.state && listing.state !== query.state) {
      return false;
    }
    if (city && !listing.city.toLowerCase().includes(city)) {
      return false;
    }
    if (query.category && listing.category !== query.category) {
      return false;
    }
    return true;
  });
}

export function directoryEmptyMessage(query: ListingQuery): string {
  const place = [query.city.trim(), query.state.trim()].filter(Boolean).join(", ");
  if (place && query.category) {
    return `No approved listings for ${place} in this service.`;
  }
  if (place) {
    return `No approved listings for ${place}.`;
  }
  if (query.category) {
    return "No approved listings in this service.";
  }
  return "No approved listings yet.";
}
