import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { relatedTips } from "@/lib/site";
import type { StageId, Tip, TipStatus } from "@/lib/types";

function sampleTip(input: { slug: string; stage: StageId; status: TipStatus; updatedOn: string; title?: string }): Tip {
  return {
    slug: input.slug,
    title: input.title ?? input.slug,
    stage: input.stage,
    status: input.status,
    updatedOn: input.updatedOn,
    queueOrder: 0,
    summary: "Sample summary used only in tests.",
    body: ["Sample body used only in tests."],
    steps: ["Sample step used only in tests."],
  };
}

describe("related tips", () => {
  it("keeps four newer published tips from the same stage", () => {
    const library = [
      sampleTip({ slug: "keep-a", stage: "staging", status: "published", updatedOn: "2026-10-01" }),
      sampleTip({ slug: "keep-b", stage: "staging", status: "published", updatedOn: "2026-10-02" }),
      sampleTip({ slug: "keep-c", stage: "staging", status: "published", updatedOn: "2026-10-03" }),
      sampleTip({ slug: "keep-d", stage: "staging", status: "published", updatedOn: "2026-10-04" }),
      sampleTip({ slug: "keep-e", stage: "staging", status: "published", updatedOn: "2026-10-05" }),
      sampleTip({ slug: "current", stage: "staging", status: "published", updatedOn: "2026-10-06" }),
      sampleTip({ slug: "queued-one", stage: "staging", status: "queued", updatedOn: "2026-10-08" }),
      sampleTip({ slug: "other-stage", stage: "moving", status: "published", updatedOn: "2026-10-09" }),
    ];
    const current = library.find((tip) => tip.slug === "current");
    expect(current).toBeDefined();
    if (!current) {
      return;
    }
    expect(relatedTips(library, current).map((tip) => tip.slug)).toEqual(["keep-e", "keep-d", "keep-c", "keep-b"]);
  });

  it("offers published tips from the same stage", () => {
    const visible = tips.filter((tip) => tip.status === "published");
    expect(visible.some((tip) => tip.slug === "deep-clean-after-the-dusty-work")).toBe(true);
    for (const tip of visible) {
      const related = relatedTips(tips, tip);
      expect(related.length).toBeGreaterThanOrEqual(3);
      expect(related.length).toBeLessThanOrEqual(4);
      expect(related.every((entry) => entry.stage === tip.stage && entry.status === "published" && entry.slug !== tip.slug)).toBe(
        true,
      );
    }
  });
});
