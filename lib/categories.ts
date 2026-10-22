import type { ProCategory } from "@/lib/types";

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
