import { resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { renderTipCard } from "@/lib/render-tip-card";

describe("tip cards", () => {
  it("renders a 1200 by 630 jpeg over the stage photo", async () => {
    const card = await renderTipCard({
      title: "Tighten loose hardware before the first visit",
      photoFile: resolve(process.cwd(), "public/photos/kitchen.webp"),
    });
    const meta = await sharp(card).metadata();
    expect(meta.format).toBe("jpeg");
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });
});
