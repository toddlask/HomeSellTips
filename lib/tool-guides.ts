import {
  commissionExampleText,
  fixExampleText,
  proceedsExampleText,
  timingExampleText,
} from "@/lib/tool-examples";

export const PROCEEDS_GUIDE = {
  steps: [
    "Start with the example numbers, or replace them immediately.",
    "Enter the sale price, the payoff, both commission fields, closing costs, credits, and repairs.",
    "Read the line items, then the estimated proceeds.",
    "Print the result if you want a paper copy for your notes.",
  ],
  example: proceedsExampleText,
  assumptions: [
    "Blank fields count as zero.",
    "A percent is applied to the sale price, then the flat fee is added.",
    "Seller credits and repairs are treated as money you pay, not as money you receive.",
    "Taxes, prorations, and association fees are included only if you type them into a cost field.",
  ],
} as const;

export const COMMISSION_GUIDE = {
  steps: [
    "Enter the sale price and the listing and buyer-agent rates you are comparing.",
    "Add a flat fee only if that offer uses one. Otherwise leave it at zero.",
    "Read the three rows: both commissions, buyer agent only, and neither.",
    "Print the result before you compare it with a written proposal.",
  ],
  example: commissionExampleText,
  assumptions: [
    "Compensation is negotiable. These fields are your inputs, not a required rate.",
    "A zero rate is allowed.",
    "The comparison does not subtract payoff, repairs, or other closing costs.",
  ],
} as const;

export const FIX_GUIDE = {
  steps: [
    "The leak row starts with an example. Replace the cost and the value with yours.",
    "Add a cost and your own expected value for any other row you are deciding.",
    "Read the ranking. A larger remainder means your value exceeds your cost by more.",
    "Print the ranking if you want it next to a bid.",
  ],
  example: fixExampleText,
  assumptions: [
    "The value is the number you type. The page does not supply a return rate.",
    "Leave a row blank if you are not pricing that job.",
    "A high remainder is not a promise that a buyer will pay it.",
  ],
} as const;

export const TIMING_GUIDE = {
  steps: [
    "Set whether the move date is fixed and whether the house is ready to list.",
    "Read the sentence under the choices, then look at the chart.",
    "Price this house from comps you can check. The bars are national closed sales.",
    "Print the result if you want the sentence with the chart.",
  ],
  example: timingExampleText,
  assumptions: [
    "The chart is one published span of US existing-home sales, not a forecast.",
    "A taller bar is more closed sales in that month. It is not a higher price for your house.",
    "Your contract date and your prep list outrank the chart.",
  ],
} as const;

export const CHECKLIST_GUIDE = {
  steps: [
    "Read a group and check an item when that job is done.",
    "Leave a box empty if you have not done it. The checks are for this visit to the page.",
    "Use the print button for a paper copy you can mark by hand.",
  ],
  example:
    "Before photos, the first item is a walkthrough with one line per issue. Checking that box means the walk is done. The paper copy is the same list, without the checks you made on screen.",
  assumptions: [
    "The list is a general order of work, not a contract requirement.",
    "Checks on screen are not saved after you leave.",
    "A printed copy does not include the site header or the photos.",
  ],
} as const;

export const ROOMS_GUIDE = {
  steps: [
    "Open a room and check the tasks that are done.",
    "The count at the top is how many tasks are checked in this browser.",
    "Print the page for a copy of every room, including rooms you had closed.",
  ],
  example:
    "If the entry has four tasks and you check two, that room shows 2 of 4. The top line adds those checks to the other rooms.",
  assumptions: [
    "Progress stays in this browser only. There is no account.",
    "The tasks are a prep list, not a repair bid.",
    "A printed page shows every room so a closed section is not missing.",
  ],
} as const;

export const CURB_GUIDE = {
  steps: [
    "Read the job, then the cost band and the time guess.",
    "Treat $ as a hardware-store trip, $$ as materials for a weekend you do yourself, and $$$ as a hired repair.",
    "Print the list if you want the jobs without the photos.",
  ],
  example:
    "A job tagged $ is something you can buy and finish in one hardware-store trip. It is a band, not a quote for your house.",
  assumptions: [
    "The tag is a cost band, not a bid.",
    "Time guesses assume you do the small jobs yourself.",
    "A hired repair can cost more or less than the band once you have a written bid.",
  ],
} as const;

export const MYTHS_GUIDE = {
  steps: [
    "Read the myth, then show the fact.",
    "Use the fact as a correction, not as a promise about your sale.",
    "Print the page to read the myth and the fact together.",
  ],
  example:
    "A card opens on the claim. After you show the fact, the correction is the part to keep. The printed page shows both sides.",
  assumptions: [
    "The cards do not invent a rate, a sale price, or a local rule.",
    "A fact on a card is general information, not advice for your contract.",
  ],
} as const;
