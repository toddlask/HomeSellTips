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

export function stageDescription(stage: StageId): string {
  switch (stage) {
    case "prep-and-repairs":
      return "Walk the property, then fix what has to work before you spend on finish. The tips in this stage are the repair list for the months before you list.";
    case "staging":
      return "Clear rooms so a buyer can see the house, not the stuff in it. These tips cover what to pack away before the first showing and what to leave in place.";
    case "pricing":
      return "Compare this property with sold homes, then write the net you will accept. The pricing tips stay with this house and the numbers you choose.";
    case "listing-photos":
      return "Use daylight, turn the lights on, and photograph the work you finished. These tips are about the pictures of this house, not filters or wide-angle tricks.";
    case "agent-vs-fsbo":
      return "List the jobs in a sale, then decide who will do each one. The agent-or-FSBO tips name the work. They do not tell you which choice is better.";
    case "offers-and-negotiation":
      return "Read credits and dates with the price, and answer before a deadline passes. These tips are about reading the whole offer, not chasing a higher number.";
    case "closing":
      return "Build the file early and check the house again before the final visit. Closing tips cover the folder, the statement, and the last walk-through.";
    case "moving":
      return "Book the truck after the date is real, and label boxes by room. Moving tips cover the date, the labels, and what to leave for the next owner.";
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function checklistDescription(stage: StageId): string {
  switch (stage) {
    case "prep-and-repairs":
      return "A one-page checklist for prep and repairs. Mark the jobs on this page or print the sheet. It follows the repair list, not a decorating plan.";
    case "staging":
      return "A one-page checklist for staging. Mark the jobs on this page or print the sheet. It covers what to clear before a showing, room by room.";
    case "pricing":
      return "A one-page checklist for pricing. Mark the jobs on this page or print the sheet. It covers the sold homes you compare and the net you will accept.";
    case "listing-photos":
      return "A one-page checklist for listing photos. Mark the jobs on this page or print the sheet. It covers daylight, lights, and the rooms you finished.";
    case "agent-vs-fsbo":
      return "A one-page checklist for choosing an agent or selling it yourself. Mark the jobs here or print the sheet. It lists the work, not a preferred choice.";
    case "offers-and-negotiation":
      return "A one-page checklist for offers and negotiation. Mark the jobs on this page or print the sheet. It covers price, credits, dates, and the deadline.";
    case "closing":
      return "A one-page checklist for closing. Mark the jobs on this page or print the sheet. It covers the folder, the statement, and the final walk-through.";
    case "moving":
      return "A one-page checklist for moving. Mark the jobs on this page or print the sheet. It covers the date, the labels, and what you leave behind.";
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}
