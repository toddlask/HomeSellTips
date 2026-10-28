import { curbExtra, pagePhoto, type HomePhoto } from "@/lib/photos";

export type CurbCost = "$" | "$$" | "$$$";

export type CurbWin = {
  id: string;
  title: string;
  detail: string;
  cost: CurbCost;
  time: string;
  photo: HomePhoto;
};

export const CURB_WINS: readonly CurbWin[] = [
  {
    id: "walk",
    title: "Edge the front walk",
    detail: "Sweep the walk and pull weeds that cross it. Coil the hose out of the way.",
    cost: "$",
    time: "One afternoon",
    photo: pagePhoto("/tools/curb-appeal"),
  },
  {
    id: "lights",
    title: "Replace bulbs that are out",
    detail: "Check the entry, the porch, and the garage lights before a showing.",
    cost: "$",
    time: "Under an hour",
    photo: curbExtra("lights"),
  },
  {
    id: "glass",
    title: "Wash the glass and the door",
    detail: "Clean the glass a buyer sees from the street, then wipe the door and the hardware.",
    cost: "$",
    time: "A few hours",
    photo: curbExtra("glass"),
  },
  {
    id: "paint-door",
    title: "Paint a worn front door",
    detail: "If the door finish is peeling, paint that door. Leave the rest of the house alone.",
    cost: "$$",
    time: "A weekend",
    photo: curbExtra("paint-door"),
  },
  {
    id: "step",
    title: "Repair a broken step or rail",
    detail: "A loose step is a function repair. Hire it out if you will not do the work, and keep the bid.",
    cost: "$$$",
    time: "Ask for the time in the bid",
    photo: curbExtra("step"),
  },
];
