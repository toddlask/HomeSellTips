import type { StageId } from "@/lib/types";

export const STAGE_CHECKLISTS: Record<StageId, readonly string[]> = {
  "prep-and-repairs": [
    "Walk every room and write one line per issue.",
    "Separate function repairs from finish work.",
    "Finish the function items you chose to do.",
    "Keep receipts for repairs you will disclose.",
    "Retest anything you fixed before photos.",
  ],
  staging: [
    "Clear counters, tables, and the refrigerator door.",
    "Box personal papers and loose photos.",
    "Open the path from the front door through the main rooms.",
    "Make beds and put clothes away.",
    "Turn on the lights you will leave on.",
  ],
  pricing: [
    "List sold homes that match this house on facts you can check.",
    "Note condition differences you can see.",
    "Run net proceeds with your own numbers.",
    "Write the lowest net you will accept.",
    "Decide what you will not negotiate away.",
  ],
  "listing-photos": [
    "Shoot in daylight with the lights on.",
    "Photograph finished work, not an open repair.",
    "Include the front, the main rooms, and each bathroom.",
    "Skip closets that are still packed.",
    "Look at the set once and reshoot the dark frames.",
  ],
  "agent-vs-fsbo": [
    "List the jobs: price, photos, showings, forms, offers, closing.",
    "Write who will do each job.",
    "Ask which disclosure forms your state expects.",
    "Price the help you plan to hire.",
    "Keep the decision on one page.",
  ],
  "offers-and-negotiation": [
    "Read price, credits, earnest money, and every date.",
    "Recalculate proceeds with the new credits.",
    "Put each deadline on one page and name who owns it.",
    "Ask what each contingency lets the buyer do.",
    "Answer in writing before the offer expires.",
  ],
  closing: [
    "Request the mortgage payoff for the closing date.",
    "Confirm wire instructions with the closing office by phone.",
    "Match the disclosure draft to the house you will sign over.",
    "Walk the house and test what you agreed to leave.",
    "Leave keys, remotes, and codes where the contract says.",
  ],
  moving: [
    "Book the mover after the closing date is in the contract.",
    "Get cancellation terms in writing.",
    "Label boxes by room on two sides.",
    "Keep documents and a first-night box with you.",
    "Measure large pieces before moving day.",
  ],
};
