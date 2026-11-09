import { describe, expect, it } from "vitest";
import { CANONICAL_ORIGIN } from "@/lib/host-redirect";
import { CONTENT_ROUTES, numberedDuplicateRedirect, permanentRedirectTarget } from "@/lib/numbered-duplicate";

const SEARCH_CONSOLE = [
  ["/tips/move-cars-before-the-photo-appointment-3", "/tips/move-cars-before-the-photo-appointment"],
  ["/tips/read-the-settlement-statement-when-it-arrives-3", "/tips/read-the-settlement-statement-when-it-arrives"],
  ["/tips/photograph-empty-rooms-on-the-last-day-3", "/tips/photograph-empty-rooms-on-the-last-day"],
  ["/tips/tighten-loose-hardware-3", "/tips/tighten-loose-hardware"],
  ["/tips/questions-if-you-sell-it-yourself-3", "/tips/questions-if-you-sell-it-yourself"],
  ["/stages/agent-vs-fsbo-2", "/stages/agent-vs-fsbo"],
  ["/-0", "/"],
  ["/tips/walk-the-house-before-you-hire-3", "/tips/walk-the-house-before-you-hire"],
  ["/tools-1", "/tools"],
] as const;

describe("numbered duplicate redirects", () => {
  it("sends a numbered copy to the real page and leaves everything else alone", () => {
    for (const [from, to] of SEARCH_CONSOLE) {
      expect(CONTENT_ROUTES.has(to)).toBe(true);
      expect(numberedDuplicateRedirect(from, CONTENT_ROUTES)).toBe(to);
      expect(numberedDuplicateRedirect(to, CONTENT_ROUTES)).toBeNull();
    }

    for (const path of CONTENT_ROUTES) {
      expect(numberedDuplicateRedirect(path, CONTENT_ROUTES)).toBeNull();
      const copy = path === "/" ? "/-7" : `${path}-7`;
      if (CONTENT_ROUTES.has(copy)) {
        expect(numberedDuplicateRedirect(copy, CONTENT_ROUTES)).toBeNull();
      } else {
        expect(numberedDuplicateRedirect(copy, CONTENT_ROUTES)).toBe(path);
      }
    }

    const numberedSlug = new Set(["/tips/keep-the-real-page-2", "/tips/keep-the-real-page"]);
    expect(numberedDuplicateRedirect("/tips/keep-the-real-page-2", numberedSlug)).toBeNull();
    expect(numberedDuplicateRedirect("/tips/keep-the-real-page-2-4", numberedSlug)).toBe("/tips/keep-the-real-page-2");
    expect(numberedDuplicateRedirect("/tips/not-a-real-page-3", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/stages/missing-stage-2", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/api/advertise-1", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/_next/static/chunk-1", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/ads.txt", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/robots.txt", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/sitemap.xml", CONTENT_ROUTES)).toBeNull();
    expect(numberedDuplicateRedirect("/photos/hero-house-1.webp", CONTENT_ROUTES)).toBeNull();
  });

  it("keeps the query string and folds a host redirect into the same hop", () => {
    expect(permanentRedirectTarget("www.helpfulideasforsellingyourhome.com", "/tools-1", "?ref=gsc", CONTENT_ROUTES)).toBe(
      "/tools?ref=gsc",
    );
    expect(permanentRedirectTarget("homeselltips.vercel.app", "/tools-1", "?ref=gsc", CONTENT_ROUTES)).toBe(
      `${CANONICAL_ORIGIN}/tools?ref=gsc`,
    );
    expect(permanentRedirectTarget("homeselltips.vercel.app", "/tips", "", CONTENT_ROUTES)).toBe(`${CANONICAL_ORIGIN}/tips`);
    expect(permanentRedirectTarget("www.helpfulideasforsellingyourhome.com", "/tips", "", CONTENT_ROUTES)).toBeNull();
    expect(permanentRedirectTarget("homeselltips.vercel.app", "/google4f514a5b84ae4e70.html", "", CONTENT_ROUTES)).toBeNull();
  });
});
