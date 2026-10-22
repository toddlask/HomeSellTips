import type { StageId } from "@/lib/types";

export function stageTitle(stage: StageId): string {
  switch (stage) {
    case "prep-and-repairs":
      return "Prep and repairs";
    case "staging":
      return "Staging";
    case "pricing":
      return "Pricing";
    case "listing-photos":
      return "Listing photos";
    case "agent-vs-fsbo":
      return "Agent or FSBO";
    case "offers-and-negotiation":
      return "Offers and negotiation";
    case "closing":
      return "Closing";
    case "moving":
      return "Moving";
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function stageSummary(stage: StageId): string {
  switch (stage) {
    case "prep-and-repairs":
      return "Walk the property, then fix what has to work before you spend on finish.";
    case "staging":
      return "Clear rooms so a buyer can see the house, not the stuff in it.";
    case "pricing":
      return "Compare this property with sold homes, then write the net you will accept.";
    case "listing-photos":
      return "Use daylight, turn the lights on, and photograph the work you finished.";
    case "agent-vs-fsbo":
      return "List the jobs in a sale, then decide who will do each one.";
    case "offers-and-negotiation":
      return "Read credits and dates with the price, and answer before a deadline passes.";
    case "closing":
      return "Build the file early and check the house again before the final visit.";
    case "moving":
      return "Book the truck after the date is real, and label boxes by room.";
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function stagePath(stage: StageId): string {
  return `/stages/${stage}`;
}
