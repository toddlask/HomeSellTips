export const HUB_DESCRIPTIONS = {
  home: "Practical tips for the months before you list a home in the United States, plus calculators that use only the numbers you enter.",
  tips: "Published home-selling tips, from the newest note in the library. Each one is a short step for the months before you list, from prep through moving.",
  stages: "Eight home-selling stages, from prep and repairs through moving. Each stage has published tips and a one-page checklist you can print.",
  tools: "Calculators and checklists for a home sale. Every figure comes from what you type. The site does not fill in a typical rate or a local rule.",
} as const;

export const TOOL_DESCRIPTIONS = {
  checklist: "A printable seller checklist for photos, paperwork, showings, offers, closing, and the move. Check a box on the screen, or print the page.",
  commission: "Compare full-service and FSBO commission totals. Enter the sale price, the percents, and any flat fees. The site does not assume a rate.",
  curb: "Small outside jobs before you list, each with a cost band and a time guess. The photos are credited Pexels images of houses and rooms.",
  myths: "Common claims about selling a house, each paired with a plain-language fact. The cards do not invent rates, averages, or local rules.",
  proceeds: "Estimate the cash you keep from a home sale. Enter the price, mortgage payoff, commissions, closing costs, seller credits, and repairs.",
  rooms: "Check off prep tasks room by room before you list. Your progress stays in this browser. The page does not ask you to create an account.",
  fix: "Rank repair projects by the cost and the value you expect. HomeSellTips does not supply a return rate or a typical project cost.",
  season: "A chart of monthly US existing-home sales from FRED series EXHOSLUSM495N. It shows one published year, not a forecast of your sale.",
} as const;

export const INFO_DESCRIPTIONS = {
  archive:
    "Archived seller notes that left the active HomeSellTips library. Each page stays readable, is marked archived, and is left out of search.",
  advertise:
    "Send an advertising inquiry from your browser. HomeSellTips reads the note and replies by email. The form does not create an account.",
  privacy:
    "How HomeSellTips saves a consent choice in this browser, when optional ad scripts can load, and what the advertise form sends. No accounts.",
  disclosure:
    "How HomeSellTips labels sponsored placements and display ads, when affiliate links stay off, and why a commission does not change your price.",
  credits:
    "Credits for every HomeSellTips picture: the home photo plus stage, tip, tool, and archive images, each with its photographer, source, and license.",
} as const;

export const ABOUT_TITLE = "About this site";

export const ABOUT_DESCRIPTION =
  "A free site of practical ideas for selling a home, arranged by stage. HomeSellTips is general information, not legal, financial, or real-estate advice.";

export const ABOUT_LEDE =
  "HomeSellTips is a free website of practical ideas for people who are getting a home ready to sell. You can use it if you plan to hire an agent, and you can use it if you plan to sell the house yourself.";

export const ABOUT_SECTIONS = [
  {
    heading: "Who it is for",
    paragraphs: [
      "The site is for people in the United States who expect to list in the next few months, including someone selling a first home. There is no account to create, no fee to pay, and no newsletter to join. Read a page, use a calculator, and leave when you are done.",
    ],
  },
  {
    heading: "Tips by stage",
    paragraphs: [
      "The tips follow the stages of a sale, in the order you are likely to meet them. Prep and repairs come first. Then come staging, pricing, and the photos for the listing. After that, the notes turn to hiring an agent or selling on your own, reading an offer, closing, and moving day.",
      "Each tip is a short list of steps for that stage. The tools beside the tips are calculators and checklists. A calculator uses only the numbers you type. It does not fill in a commission, a repair cost, or a price for your house.",
    ],
  },
  {
    heading: "General information",
    paragraphs: [
      "Everything here is general information. It is not legal advice, financial advice, tax advice, or real-estate advice. Rules, forms, and taxes differ by state, and they also depend on the contract for your sale. A licensed real-estate agent, an attorney, or a tax advisor can talk through your own case. HomeSellTips cannot. The same disclaimer is in the footer of every page.",
    ],
  },
] as const;

export const ABOUT_ADVERTISE_BEFORE = "If you want to ask about a labeled ad on the site, use the";

export const ABOUT_ADVERTISE_LINK = "advertise page";

export const ABOUT_ADVERTISE_AFTER =
  "The form checks your note and then sends it from your browser. That inquiry is not added to a mailing list, and the site does not ask you to create an account.";

export function aboutWordCount(): number {
  const parts = [
    ABOUT_TITLE,
    ABOUT_LEDE,
    ...ABOUT_SECTIONS.flatMap((section) => [section.heading, ...section.paragraphs]),
    ABOUT_ADVERTISE_BEFORE,
    ABOUT_ADVERTISE_LINK,
    ABOUT_ADVERTISE_AFTER,
  ];
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}
