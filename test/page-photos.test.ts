import { statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tips } from "@/lib/catalog";
import { CURB_WINS } from "@/lib/curb";
import { allPhotos, heroPhoto, pagePhoto } from "@/lib/photos";
import { TOOL_LINKS } from "@/lib/site";
import { STAGE_IDS } from "@/lib/types";

const banned =
  /\b(schools?|crime|religion|religious|racial|race|disability|disabled|handicap|familial|demographic|children|kids|gender|neighborhood|national origin)\b|\bsafe neighborhood\b|\bfamily neighborhood\b|\bsex\b|\bcolor\b|\bstudies show\b|\baverage\b|\btypically\b|\blorem\b|%/i;

function coveredPaths(): string[] {
  const tipPaths = tips
    .filter((tip) => tip.status === "published" || tip.status === "archived")
    .map((tip) => `/tips/${tip.slug}`);
  const stagePaths = STAGE_IDS.map((stage) => `/stages/${stage}`);
  const toolPaths = ["/tools", ...TOOL_LINKS.map((tool) => tool.href)];
  const hubPaths = ["/tips", "/stages", "/archive"];
  return [...tipPaths, ...stagePaths, ...toolPaths, ...hubPaths];
}

describe("page photos", () => {
  it("gives every tip, stage, tool, and hub page a photo nobody else on that set uses", () => {
    const paths = coveredPaths();
    const photos = paths.map((path) => pagePhoto(path));
    const srcs = photos.map((photo) => photo.src);
    expect(new Set(srcs).size).toBe(paths.length);
    expect(srcs).not.toContain(heroPhoto.src);
    expect(new Set(photos.map((photo) => photo.alt)).size).toBe(photos.length);
    for (const photo of photos) {
      expect(photo.alt.length).toBeGreaterThan(20);
      expect(banned.test(photo.alt)).toBe(false);
      expect(photo.src).toMatch(/^\/photos\/.+\.webp$/);
      const file = resolve(process.cwd(), "public", photo.src.slice(1));
      expect(statSync(file).size).toBeLessThan(150 * 1024);
    }
    expect(CURB_WINS[0]?.photo.src).toBe(pagePhoto("/tools/curb-appeal").src);
    const pageSrcs = new Set(srcs);
    for (const win of CURB_WINS.slice(1)) {
      expect(pageSrcs.has(win.photo.src)).toBe(false);
      expect(win.photo.src).not.toBe(heroPhoto.src);
    }
    const extras = allPhotos().filter((photo) => photo.id !== heroPhoto.id && !pageSrcs.has(photo.src));
    expect(extras).toHaveLength(CURB_WINS.length - 1);
  });
});
