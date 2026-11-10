import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { pageMetadata } from "@/lib/page-meta";
import { guideWordCount, publishedTopicTips, roundPaths, stageGuide, stageGuidePath, topicGuide, topicTipWordCount } from "@/lib/round";
import { publicPaths } from "@/lib/site";
import { topicGuidePath, topicPath, TOPIC_IDS } from "@/lib/topics";
import { STAGE_IDS } from "@/lib/types";

const banned =
  /\b(schools?|crime|religion|religious|racial|race|disability|disabled|handicap|familial|demographic|children|kids|gender|neighborhood|national origin)\b|\bsafe neighborhood\b|\bfamily neighborhood\b|\bsex\b|\bcolor\b|\bstudies show\b|\baverage\b|\btypically\b|\blorem\b|%/i;

describe("stage guides and topic sections", () => {
  it("publishes one long guide per stage and keeps the old tip count", () => {
    expect(tips.filter((tip) => tip.status === "published")).toHaveLength(62);
    const paths = new Set(publicPaths(tips).map((entry) => entry.path));
    for (const stage of STAGE_IDS) {
      const guide = stageGuide(stage);
      const words = guideWordCount(guide);
      expect(words).toBeGreaterThanOrEqual(1200);
      expect(words).toBeLessThanOrEqual(2000);
      expect(guide.title.length).toBeLessThanOrEqual(60);
      expect(guide.description.length).toBeGreaterThanOrEqual(120);
      expect(guide.description.length).toBeLessThanOrEqual(155);
      expect(banned.test(JSON.stringify(guide))).toBe(false);
      expect(paths.has(stageGuidePath(stage))).toBe(true);
      expect(pageMetadata({ title: guide.title, description: guide.description, path: stageGuidePath(stage), absoluteTitle: true }).alternates?.canonical).toBe(stageGuidePath(stage));
      const hub = readFileSync(resolve(process.cwd(), "app/stages/[stage]/page.tsx"), "utf8");
      expect(hub).toContain("stageGuidePath");
      const tipPage = readFileSync(resolve(process.cwd(), "app/tips/[slug]/page.tsx"), "utf8");
      expect(tipPage).toContain("stageGuidePath(tip.stage)");
    }
  });

  it("adds six topic hubs, six guides, and the short tips to the sitemap", () => {
    expect(TOPIC_IDS).toHaveLength(6);
    const topicTips = publishedTopicTips();
    expect(topicTips).toHaveLength(26);
    const paths = new Set(publicPaths(tips).map((entry) => entry.path));
    expect(paths.has("/topics")).toBe(true);
    for (const topic of TOPIC_IDS) {
      const guide = topicGuide(topic);
      const words = guideWordCount(guide);
      expect(words).toBeGreaterThanOrEqual(1200);
      expect(words).toBeLessThanOrEqual(2000);
      expect(guide.title.length).toBeLessThanOrEqual(60);
      expect(paths.has(topicPath(topic))).toBe(true);
      expect(paths.has(topicGuidePath(topic))).toBe(true);
      expect(pageMetadata({ title: guide.title, description: guide.description, path: topicGuidePath(topic), absoluteTitle: true }).alternates?.canonical).toBe(topicGuidePath(topic));
    }
    for (const tip of topicTips) {
      const words = topicTipWordCount(tip);
      expect(words, tip.slug).toBeGreaterThanOrEqual(350);
      expect(words, tip.slug).toBeLessThanOrEqual(510);
      expect(tip.description.length).toBeGreaterThanOrEqual(120);
      expect(tip.description.length).toBeLessThanOrEqual(155);
      expect(`${tip.title} · Tips`.length).toBeLessThanOrEqual(60);
      expect(banned.test(`${tip.title} ${tip.summary} ${tip.body.join(" ")} ${tip.steps.join(" ")}`)).toBe(false);
      expect(paths.has(`/tips/${tip.slug}`)).toBe(true);
      expect(pageMetadata({ title: tip.title, description: tip.description, path: `/tips/${tip.slug}`, absoluteTitle: true }).alternates?.canonical).toBe(`/tips/${tip.slug}`);
      expect(tips.some((entry) => entry.slug === tip.slug)).toBe(false);
    }
    const round = new Set(roundPaths().map((entry) => entry.path));
    expect(round.has("/topics/capital-gains/guide")).toBe(true);
    expect(round.has("/stages/prep-and-repairs/guide")).toBe(true);
    const header = readFileSync(resolve(process.cwd(), "components/site-header.tsx"), "utf8");
    expect(header).toContain('"/topics"');
  });
});
