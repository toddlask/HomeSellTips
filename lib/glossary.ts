export type GlossaryEntry = {
  id: string;
  terms: readonly string[];
  label: string;
  definition: string;
  caseSensitive?: boolean;
};

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    id: "earnest-money",
    terms: ["earnest money", "earnest-money"],
    label: "earnest money",
    definition: "Money the buyer puts down to show the offer is serious. The contract says who holds it and when it is due.",
  },
  {
    id: "contingency",
    terms: ["contingencies", "contingency"],
    label: "contingency",
    definition: "A condition in the offer. If it is not met, the buyer may be able to step back. The contract says which ones apply.",
  },
  {
    id: "escrow",
    terms: ["escrow"],
    label: "escrow",
    definition: "A neutral hold for money or documents until the steps in the contract are finished.",
  },
  {
    id: "cma",
    terms: ["CMA"],
    label: "CMA",
    definition: "A comparison of this house with recent sold homes, using facts you can check. It is not a promised price.",
    caseSensitive: true,
  },
  {
    id: "appraisal",
    terms: ["appraisal"],
    label: "appraisal",
    definition: "A valuation ordered for the lender. It can differ from the price in the offer.",
  },
  {
    id: "disclosure",
    terms: ["disclosures", "disclosure"],
    label: "disclosure",
    definition: "A form where you report what you know about the property. Your state decides which forms you sign.",
  },
];

export const CORE_TERMS = ["escrow", "contingency", "cma"] as const;

export type GlossPart =
  | { kind: "text"; text: string }
  | { kind: "term"; text: string; id: string; definition: string };

function wordEdge(text: string, index: number, length: number): boolean {
  const before = index === 0 || !/[A-Za-z]/.test(text[index - 1] ?? "");
  const after = index + length >= text.length || !/[A-Za-z]/.test(text[index + length] ?? "");
  return before && after;
}

export function splitGlossary(text: string): GlossPart[] {
  const matchers = GLOSSARY.flatMap((entry) => entry.terms.map((term) => ({ term, entry }))).toSorted(
    (left, right) => right.term.length - left.term.length,
  );
  const parts: GlossPart[] = [];
  let index = 0;
  let plain = "";
  while (index < text.length) {
    const match = matchers.find((matcher) => {
      const slice = text.slice(index, index + matcher.term.length);
      const same = matcher.entry.caseSensitive ? slice === matcher.term : slice.toLowerCase() === matcher.term.toLowerCase();
      return same && wordEdge(text, index, matcher.term.length);
    });
    if (!match) {
      plain += text[index];
      index += 1;
      continue;
    }
    if (plain) {
      parts.push({ kind: "text", text: plain });
      plain = "";
    }
    parts.push({
      kind: "term",
      text: text.slice(index, index + match.term.length),
      id: match.entry.id,
      definition: match.entry.definition,
    });
    index += match.term.length;
  }
  if (plain) {
    parts.push({ kind: "text", text: plain });
  }
  return parts;
}

export function glossaryById(id: string): GlossaryEntry {
  const entry = GLOSSARY.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Missing glossary entry: ${id}`);
  }
  return entry;
}
