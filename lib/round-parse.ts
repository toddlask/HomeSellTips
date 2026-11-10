import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type RoundFaq = {
  question: string;
  answer: string;
};

export type RoundExample = {
  title: string;
  paragraphs: string[];
};

export type RoundSection = {
  heading: string;
  paragraphs: string[];
};

export type RoundGuide = {
  id: string;
  kind: "stage" | "topic";
  title: string;
  h1: string;
  description: string;
  lede: string;
  sections: RoundSection[];
  checklist: string[];
  examples: RoundExample[];
  mistakes: string[];
  callPro: string[];
  faqs: RoundFaq[];
};

function takeBlock(lines: string[], start: number): { text: string[]; next: number } {
  const text: string[] = [];
  let index = start;
  while (index < lines.length && !lines[index].startsWith("## ") && !lines[index].startsWith("### ")) {
    text.push(lines[index]);
    index += 1;
  }
  return { text, next: index };
}

function paragraphsFrom(lines: string[]): string[] {
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        paragraphs.push(current.join(" ").trim());
        current = [];
      }
      continue;
    }
    if (line.startsWith("- ")) {
      continue;
    }
    current.push(line.trim());
  }
  if (current.length > 0) {
    paragraphs.push(current.join(" ").trim());
  }
  return paragraphs.filter((paragraph) => paragraph.length > 0);
}

function bulletsFrom(lines: string[]): string[] {
  return lines.filter((line) => line.startsWith("- ")).map((line) => line.slice(2).trim());
}

export function parseGuide(source: string, file: string): RoundGuide {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  if (lines[0]?.trim() !== "---") {
    throw new Error(`Missing front matter in ${file}`);
  }
  const end = lines.indexOf("---", 1);
  if (end < 0) {
    throw new Error(`Unclosed front matter in ${file}`);
  }
  const meta = new Map<string, string>();
  for (const line of lines.slice(1, end)) {
    const split = line.indexOf(":");
    if (split < 0) {
      continue;
    }
    meta.set(line.slice(0, split).trim(), line.slice(split + 1).trim());
  }
  const body = lines.slice(end + 1);
  let lede = "";
  const sections: RoundSection[] = [];
  const checklist: string[] = [];
  const examples: RoundExample[] = [];
  const mistakes: string[] = [];
  const callPro: string[] = [];
  const faqs: RoundFaq[] = [];
  let index = 0;
  while (index < body.length && body[index].trim() === "") {
    index += 1;
  }
  const intro = takeBlock(body, index);
  lede = paragraphsFrom(intro.text).join("\n\n");
  index = intro.next;
  let mode: "section" | "checklist" | "examples" | "mistakes" | "call" | "faq" | "" = "";
  while (index < body.length) {
    const line = body[index];
    if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();
      if (heading === "Checklist") {
        mode = "checklist";
      } else if (heading === "Worked examples") {
        mode = "examples";
      } else if (heading === "Common mistakes") {
        mode = "mistakes";
      } else if (heading === "When to call a pro") {
        mode = "call";
      } else if (heading === "Questions") {
        mode = "faq";
      } else {
        mode = "section";
        sections.push({ heading, paragraphs: [] });
      }
      index += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      const heading = line.slice(4).trim();
      const block = takeBlock(body, index + 1);
      if (mode === "examples") {
        examples.push({ title: heading, paragraphs: paragraphsFrom(block.text) });
      } else if (mode === "faq") {
        const answer = paragraphsFrom(block.text).join(" ");
        faqs.push({ question: heading, answer });
      } else {
        throw new Error(`Unexpected heading ${heading} in ${file}`);
      }
      index = block.next;
      continue;
    }
    const block = takeBlock(body, index);
    if (mode === "section") {
      const section = sections.at(-1);
      if (!section) {
        throw new Error(`Section text before a heading in ${file}`);
      }
      section.paragraphs.push(...paragraphsFrom(block.text));
    } else if (mode === "checklist") {
      checklist.push(...bulletsFrom(block.text));
    } else if (mode === "mistakes") {
      mistakes.push(...bulletsFrom(block.text));
    } else if (mode === "call") {
      callPro.push(...paragraphsFrom(block.text));
    }
    index = block.next;
  }
  const kind = meta.get("kind");
  if (kind !== "stage" && kind !== "topic") {
    throw new Error(`Bad kind in ${file}`);
  }
  const guide: RoundGuide = {
    id: meta.get("id") ?? "",
    kind,
    title: meta.get("title") ?? "",
    h1: meta.get("h1") ?? "",
    description: meta.get("description") ?? "",
    lede,
    sections,
    checklist,
    examples,
    mistakes,
    callPro,
    faqs,
  };
  if (!guide.id || !guide.title || !guide.h1 || !guide.description || !guide.lede) {
    throw new Error(`Incomplete guide ${file}`);
  }
  if (guide.sections.length < 3 || guide.checklist.length < 5 || guide.examples.length < 1 || guide.mistakes.length < 3 || guide.callPro.length < 1 || guide.faqs.length < 3) {
    throw new Error(`Thin guide ${file}`);
  }
  return guide;
}

export function loadGuides(): RoundGuide[] {
  const dir = join(process.cwd(), "content", "guides");
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .toSorted()
    .map((name) => parseGuide(readFileSync(join(dir, name), "utf8"), name));
}
