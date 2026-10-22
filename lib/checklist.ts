export type ChecklistGroup = {
  id: string;
  title: string;
  items: string[];
};

export const SELLER_CHECKLIST: readonly ChecklistGroup[] = [
  {
    id: "before-photos",
    title: "Before photos",
    items: [
      "Walk the property and write one line per issue.",
      "Finish function repairs you decided to do.",
      "Replace cracked caulk and burned-out bulbs.",
      "Clear counters, floors, and the refrigerator door.",
      "Box personal papers and photos.",
      "Clean windows and turn on the lights you will leave on.",
    ],
  },
  {
    id: "paperwork",
    title: "Paperwork to gather",
    items: [
      "Mortgage servicer phone number and the latest statement.",
      "Association contact, if you have one.",
      "Receipts for repairs you will disclose.",
      "Warranty paperwork you plan to transfer.",
      "A draft of your state disclosure forms.",
      "The lowest net you will accept, from your own calculator entries.",
    ],
  },
  {
    id: "showings",
    title: "Showing week",
    items: [
      "Confirm showing hours you can keep.",
      "Reset the entry: door, mat, and light.",
      "Put valuables and spare keys out of sight.",
      "Leave a clear path from the front door through the main rooms.",
      "Ask how feedback will get back to you.",
    ],
  },
  {
    id: "offers",
    title: "When an offer arrives",
    items: [
      "Read price, credits, earnest money, and every date.",
      "Recalculate proceeds with the new credits.",
      "Put each deadline on one page and name who owns it.",
      "Have an agent or attorney explain contingencies you do not know.",
      "Answer in writing before the offer expires.",
    ],
  },
  {
    id: "closing-week",
    title: "Closing week",
    items: [
      "Request the mortgage payoff for the closing date.",
      "Call the closing office to confirm wire instructions.",
      "Walk the house and test what you agreed to leave.",
      "Report anything that broke after you signed.",
      "Leave remotes, keys, and codes where the contract says.",
    ],
  },
  {
    id: "move-week",
    title: "Move week",
    items: [
      "Book the mover only after the closing date is in the contract.",
      "Get cancellation terms in writing.",
      "Label boxes by room on two sides.",
      "Keep documents and the first-night box with you.",
      "Measure large pieces before moving day.",
    ],
  },
];
