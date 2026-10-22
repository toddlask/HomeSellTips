import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { CURB_WINS } from "@/lib/curb";
import { splitGlossary } from "@/lib/glossary";
import { MYTH_CARDS } from "@/lib/myths";
import { allPhotos } from "@/lib/photos";
import { roomTaskIds, ROOM_PREP } from "@/lib/rooms";
import { SEASON_MONTHS, seasonMax } from "@/lib/season";
import { STAGE_CHECKLISTS } from "@/lib/stage-checklists";
import { STAGE_IDS } from "@/lib/types";
import { faqJsonLd, FAQ_ITEMS } from "@/lib/faq";

const banned =
  /\b(schools?|crime|religion|religious|racial|race|disability|disabled|handicap|familial|demographic|children|kids|gender|neighborhood|national origin)\b|\bsafe neighborhood\b|\bfamily neighborhood\b|\bsex\b|\bcolor\b|\bstudies show\b|\baverage\b|\btypically\b|\blorem\b|%/i;

describe("seller tools", () => {
  it("gives every room a stable task id", () => {
    const ids = roomTaskIds();
    expect(new Set(ids).size).toBe(ids.length);
    expect(ROOM_PREP.length).toBeGreaterThanOrEqual(5);
    expect(banned.test(ROOM_PREP.flatMap((room) => room.tasks.map((task) => task.label)).join(" "))).toBe(false);
  });

  it("credits every curb-appeal photo and uses the three cost bands", () => {
    const costs = new Set(CURB_WINS.map((win) => win.cost));
    expect(costs).toEqual(new Set(["$", "$$", "$$$"]));
    for (const win of CURB_WINS) {
      expect(allPhotos().some((photo) => photo.id === win.photo.id)).toBe(true);
      expect(existsSync(resolve(process.cwd(), "public", win.photo.src.slice(1)))).toBe(true);
      expect(win.photo.sourcePage).toMatch(/^https:\/\/www\.pexels\.com\/photo\//);
      expect(banned.test(`${win.title} ${win.detail} ${win.time}`)).toBe(false);
    }
  });

  it("uses the published FRED existing-home sales counts", () => {
    expect(SEASON_MONTHS.map((month) => month.sales)).toEqual([
      355000, 359000, 295000, 346000, 228000, 259000, 329000, 356000, 391000, 424000, 401000, 358000, 341000,
    ]);
    expect(seasonMax(SEASON_MONTHS)).toBe(424000);
    expect(SEASON_MONTHS.find((month) => month.sales === 424000)?.label).toBe("Jun 2026");
  });

  it("has a one-page checklist for every stage", () => {
    for (const stage of STAGE_IDS) {
      expect(STAGE_CHECKLISTS[stage].length).toBeGreaterThanOrEqual(5);
      expect(banned.test(STAGE_CHECKLISTS[stage].join(" "))).toBe(false);
    }
  });

  it("keeps myth cards original and free of invented rates", () => {
    expect(MYTH_CARDS.length).toBeGreaterThanOrEqual(4);
    const text = MYTH_CARDS.map((card) => `${card.myth} ${card.fact}`).join(" ");
    expect(banned.test(text)).toBe(false);
  });

  it("marks glossary words and leaves the rest of the sentence", () => {
    const parts = splitGlossary("Ask what each contingency lets the buyer do with earnest money.");
    expect(parts.filter((part) => part.kind === "term").map((part) => part.text)).toEqual(["contingency", "earnest money"]);
    expect(splitGlossary("A CMA is not a promise.").some((part) => part.kind === "term" && part.text === "CMA")).toBe(true);
    expect(splitGlossary("The cma lowercase stays plain.").every((part) => part.kind === "text")).toBe(true);
  });

  it("publishes FAQPage structured data for the accordion questions", () => {
    const data = faqJsonLd(FAQ_ITEMS);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(FAQ_ITEMS.length);
  });
});
