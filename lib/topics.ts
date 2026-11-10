import {
  CFPB_CLOSING,
  CFPB_REVERSE_MORTGAGE,
  IRS_PUB_523,
  IRS_RECORDKEEPING,
  IRS_TOPIC_701,
  TREC_CONTRACTS,
  TREC_HOME,
  TREC_SELLER_DISCLOSURE,
} from "@/lib/sources";
import type { CitedSource } from "@/lib/page-sources";

export const TOPIC_IDS = [
  "capital-gains",
  "mortgage-payoff",
  "inherited-house",
  "foundation",
  "pre-listing-inspection",
  "texas",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];

export type TopicAdvice = "tax" | "estate" | "money" | "texas" | "none";

type TopicCopy = {
  title: string;
  h1: string;
  summary: string;
  description: string;
  advice: TopicAdvice;
};

const TOPICS: Record<TopicId, TopicCopy> = {
  "capital-gains": {
    title: "Capital gains tax",
    h1: "Capital gains tax when selling a house",
    summary: "What gain means, the main-home exclusion in Publication 523, and the records to keep.",
    description:
      "Capital gains tax when selling a house: the main-home exclusion, basis, and the records IRS Publication 523 tells you to keep.",
    advice: "tax",
  },
  "mortgage-payoff": {
    title: "Mortgage payoff",
    h1: "Selling a house with a mortgage",
    summary: "How a dated payoff quote works, including a sale before the loan ends and a reverse mortgage.",
    description:
      "Selling a house with a mortgage: order a dated payoff quote, compare it with your net, and read the CFPB closing guide first.",
    advice: "money",
  },
  "inherited-house": {
    title: "Inherited house",
    h1: "Selling an inherited house",
    summary: "Who may sign, what a trust changes, and how Publication 523 treats basis after a death.",
    description:
      "Selling an inherited house, or a house in a trust or estate: who can sign the deed, and the basis rules in Publication 523.",
    advice: "estate",
  },
  foundation: {
    title: "Foundation issues",
    h1: "Selling a house with foundation issues",
    summary: "What to write down, when to get a letter, and how disclosure fits a repair or a credit.",
    description:
      "Selling a house with foundation issues: document what you know, price a repair or a credit, and disclose it on the state form.",
    advice: "none",
  },
  "pre-listing-inspection": {
    title: "Pre-listing inspection",
    h1: "Pre-listing home inspection",
    summary: "A paid report before you list, kept separate from the walk you do yourself.",
    description:
      "A pre-listing home inspection is a paid report before you list. Compare the fee, the limits, and your own walkthrough first.",
    advice: "none",
  },
  texas: {
    title: "Texas",
    h1: "Selling a house in Texas",
    summary: "The seller disclosure, a title quote, and the steps whether or not you hire a broker.",
    description:
      "Selling a house in Texas: the TREC seller disclosure, a title quote, closing costs from your contract, and selling without a broker.",
    advice: "texas",
  },
};

const TAX_NOTE =
  "IRS Publication 523 explains federal rules for selling a home, including the main-home exclusion and which records to keep.";
const RECORDS_NOTE = "IRS guidance on how long to keep records after you dispose of property.";
const TOPIC_NOTE = "IRS topic page for the sale of your home, including the exclusion amounts and the tests.";
const CLOSE_NOTE = "What happens at closing, and which papers to read before you are paid.";
const REVERSE_NOTE = "CFPB explanation of reverse mortgages, including home equity conversion mortgages.";
const TREC_NOTE = "The state agency that publishes Texas contract forms and the seller disclosure notice.";
const DISCLOSURE_NOTE =
  "TREC's notice for sellers of previously occupied single-family residences, citing Texas Property Code section 5.008.";
const CONTRACTS_NOTE = "TREC's library of contract forms. License holders must use the promulgated forms.";

function isTopicId(value: string): value is TopicId {
  return (TOPIC_IDS as readonly string[]).includes(value);
}

export function parseTopicId(value: string): TopicId {
  if (!isTopicId(value)) {
    throw new Error(`Unknown topic ${value}`);
  }
  return value;
}

export function topicTitle(topic: TopicId): string {
  return TOPICS[topic].title;
}

export function topicHeading(topic: TopicId): string {
  return TOPICS[topic].h1;
}

export function topicSummary(topic: TopicId): string {
  return TOPICS[topic].summary;
}

export function topicDescription(topic: TopicId): string {
  return TOPICS[topic].description;
}

export function topicAdvice(topic: TopicId): TopicAdvice {
  return TOPICS[topic].advice;
}

export function topicPath(topic: TopicId): string {
  return `/topics/${topic}`;
}

export function topicGuidePath(topic: TopicId): string {
  return `/topics/${topic}/guide`;
}

export function sourcesForTopic(topic: TopicId): readonly CitedSource[] {
  switch (topic) {
    case "capital-gains":
      return [
        { ...IRS_PUB_523, note: TAX_NOTE },
        { ...IRS_TOPIC_701, note: TOPIC_NOTE },
        { ...IRS_RECORDKEEPING, note: RECORDS_NOTE },
      ];
    case "mortgage-payoff":
      return [
        { ...CFPB_CLOSING, note: CLOSE_NOTE },
        { ...CFPB_REVERSE_MORTGAGE, note: REVERSE_NOTE },
      ];
    case "inherited-house":
      return [
        { ...IRS_PUB_523, note: TAX_NOTE },
        { ...IRS_RECORDKEEPING, note: RECORDS_NOTE },
      ];
    case "foundation":
      return [{ ...TREC_SELLER_DISCLOSURE, note: DISCLOSURE_NOTE }];
    case "pre-listing-inspection":
      return [];
    case "texas":
      return [
        { ...TREC_HOME, note: TREC_NOTE },
        { ...TREC_SELLER_DISCLOSURE, note: DISCLOSURE_NOTE },
        { ...TREC_CONTRACTS, note: CONTRACTS_NOTE },
      ];
    default: {
      const exhaustive: never = topic;
      return exhaustive;
    }
  }
}
