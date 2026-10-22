export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "How early should I start?",
    answer:
      "This site is written for the one to six months before you list. Start with a walk-through and a repair list. The week you list depends on the work you choose and the dates in your contract.",
  },
  {
    question: "Can I sell without an agent?",
    answer:
      "Yes. You still need disclosures, a way to show the home, and someone to review the contract. The agent-or-FSBO tips list the jobs. They do not tell you which choice is better.",
  },
  {
    question: "Where do the calculator numbers come from?",
    answer:
      "Only from what you type. Commission rates, fees, repair costs, and expected values are yours. The site does not fill in a typical rate.",
  },
  {
    question: "Do you rank areas?",
    answer:
      "No. Tips talk about the property and the transaction.",
  },
  {
    question: "How do sponsors and ads work?",
    answer:
      "Paid placements are labeled Sponsored and stay hidden until they are approved. Ads load only after you accept cookies, and only if a publisher id is configured. Affiliate links stay off unless that flag is turned on, and they carry a disclosure.",
  },
];

export function faqJsonLd(items: readonly FaqItem[]): {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{ "@type": "Question"; name: string; acceptedAnswer: { "@type": "Answer"; text: string } }>;
} {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
