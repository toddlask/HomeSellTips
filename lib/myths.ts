export type MythCard = {
  id: string;
  myth: string;
  fact: string;
};

export const MYTH_CARDS: readonly MythCard[] = [
  {
    id: "highest-price",
    myth: "The highest price is the best offer.",
    fact: "Credits, repairs, and dates change what you keep. Read those with the price.",
  },
  {
    id: "kitchen",
    myth: "You have to remodel the kitchen before you list.",
    fact: "A clean working kitchen can be shown as it is. A remodel is a project you choose and price yourself.",
  },
  {
    id: "paperwork",
    myth: "Selling it yourself skips the paperwork.",
    fact: "Disclosures, showings, and the contract still have to be done. The choice is who does each job.",
  },
  {
    id: "paint",
    myth: "A fresh coat of paint sets the sale price.",
    fact: "Paint can make a room easier to see. Your comps and the net you will accept set the price.",
  },
  {
    id: "spring",
    myth: "One season is the only time worth listing.",
    fact: "Buyers shop in every month. Closed-sales counts are context, not a rule for this house.",
  },
];
