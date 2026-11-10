import {
  CFPB_CLOSING,
  CFPB_CLOSING_DISCLOSURE,
  FBI_IC3,
  FRED_EXISTING_HOME_SALES,
  HUD_SINGLE_FAMILY,
  IRS_PUB_523,
  NAR_SETTLEMENT,
} from "@/lib/sources";
import type { StageId } from "@/lib/types";

export type CitedSource = {
  href: string;
  label: string;
  note: string;
};

export const IRS_SOURCE: CitedSource = {
  ...IRS_PUB_523,
  note: "Federal tax on selling a main home, including the exclusion and the records to keep.",
};

export const CFPB_SOURCE: CitedSource = {
  ...CFPB_CLOSING,
  note: "What happens at closing, and which papers to read before you are paid.",
};

export const CFPB_DISCLOSURE_SOURCE: CitedSource = {
  ...CFPB_CLOSING_DISCLOSURE,
  note: "How to read the Closing Disclosure line by line.",
};

export const HUD_SOURCE: CitedSource = {
  ...HUD_SINGLE_FAMILY,
  note: "HUD's single-family housing programs. Your contract and closing agent still control this sale.",
};

export const NAR_SOURCE: CitedSource = {
  ...NAR_SETTLEMENT,
  note: "What the NAR settlement changed about offers of compensation.",
};

export const FBI_SOURCE: CitedSource = {
  ...FBI_IC3,
  note: "Where to report a swapped wire instruction or other internet-payment fraud.",
};

export const FRED_SOURCE: CitedSource = {
  ...FRED_EXISTING_HOME_SALES,
  note: "National existing-home sales published by the National Association of Realtors through FRED.",
};

const CLOSING_SOURCES = [IRS_SOURCE, CFPB_SOURCE, CFPB_DISCLOSURE_SOURCE, HUD_SOURCE, FBI_SOURCE] as const;

export const HUB_SOURCES: readonly CitedSource[] = [
  IRS_SOURCE,
  CFPB_SOURCE,
  CFPB_DISCLOSURE_SOURCE,
  HUD_SOURCE,
  NAR_SOURCE,
  FBI_SOURCE,
  FRED_SOURCE,
];

export function sourcesForStage(stage: StageId): readonly CitedSource[] {
  switch (stage) {
    case "closing":
      return CLOSING_SOURCES;
    case "agent-vs-fsbo":
      return [NAR_SOURCE];
    case "offers-and-negotiation":
      return [CFPB_SOURCE, CFPB_DISCLOSURE_SOURCE];
    case "pricing":
      return [IRS_SOURCE];
    case "prep-and-repairs":
    case "staging":
    case "listing-photos":
    case "moving":
      return [];
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function sourcesForTool(path: string): readonly CitedSource[] {
  switch (path) {
    case "/tools/net-proceeds":
      return [IRS_SOURCE, CFPB_SOURCE, CFPB_DISCLOSURE_SOURCE];
    case "/tools/commission":
      return [NAR_SOURCE];
    case "/tools/when-to-sell":
      return [FRED_SOURCE];
    case "/tools/checklist":
      return [CFPB_SOURCE, FBI_SOURCE];
    case "/tools":
      return HUB_SOURCES;
    default:
      return [];
  }
}
