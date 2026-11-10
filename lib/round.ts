import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadGuides, type RoundGuide } from "@/lib/round-parse";
import { stagePath } from "@/lib/stages";
import { topicGuidePath, topicPath, type TopicId } from "@/lib/topics";
import { STAGE_IDS, type StageId } from "@/lib/types";

export const ROUND_UPDATED_ON = "2026-11-10";

export type TopicTip = {
  slug: string;
  topic: TopicId;
  title: string;
  description: string;
  summary: string;
  body: string[];
  steps: string[];
  updatedOn: string;
};

const guides = loadGuides();

function readTopicTips(): TopicTip[] {
  const dir = join(process.cwd(), "content", "topic-tips");
  const tips: TopicTip[] = [];
  for (const name of readdirSync(dir).filter((entry) => entry.endsWith(".json")).toSorted()) {
    const parsed = JSON.parse(readFileSync(join(dir, name), "utf8")) as TopicTip[];
    tips.push(...parsed.map((tip) => ({ ...tip, updatedOn: tip.updatedOn || ROUND_UPDATED_ON })));
  }
  return tips;
}

const topicTips = readTopicTips();

export function allGuides(): RoundGuide[] {
  return guides;
}

export function stageGuide(stage: StageId): RoundGuide {
  const guide = guides.find((entry) => entry.kind === "stage" && entry.id === stage);
  if (!guide) {
    throw new Error(`Missing stage guide ${stage}`);
  }
  return guide;
}

export function topicGuide(topic: TopicId): RoundGuide {
  const guide = guides.find((entry) => entry.kind === "topic" && entry.id === topic);
  if (!guide) {
    throw new Error(`Missing topic guide ${topic}`);
  }
  return guide;
}

export function stageGuidePath(stage: StageId): string {
  return `${stagePath(stage)}/guide`;
}

export function publishedTopicTips(): TopicTip[] {
  return topicTips;
}

export function topicTipsFor(topic: TopicId): TopicTip[] {
  return topicTips.filter((tip) => tip.topic === topic);
}

export function topicTipBySlug(slug: string): TopicTip | undefined {
  return topicTips.find((tip) => tip.slug === slug);
}

export function guideWordCount(guide: RoundGuide): number {
  const parts = [
    guide.lede,
    ...guide.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...guide.checklist,
    ...guide.examples.flatMap((example) => [example.title, ...example.paragraphs]),
    ...guide.mistakes,
    ...guide.callPro,
    ...guide.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function topicTipWordCount(tip: TopicTip): number {
  return `${tip.summary} ${tip.body.join(" ")} ${tip.steps.join(" ")}`.trim().split(/\s+/).filter(Boolean).length;
}

export function roundPaths(): { path: string; lastModified: string }[] {
  const entries: { path: string; lastModified: string }[] = [
    { path: "/topics", lastModified: ROUND_UPDATED_ON },
  ];
  for (const stage of STAGE_IDS) {
    entries.push({ path: stageGuidePath(stage), lastModified: ROUND_UPDATED_ON });
  }
  for (const guide of guides.filter((entry) => entry.kind === "topic")) {
    entries.push({ path: topicPath(guide.id as TopicId), lastModified: ROUND_UPDATED_ON });
    entries.push({ path: topicGuidePath(guide.id as TopicId), lastModified: ROUND_UPDATED_ON });
  }
  for (const tip of topicTips) {
    entries.push({ path: `/tips/${tip.slug}`, lastModified: tip.updatedOn });
  }
  return entries;
}
