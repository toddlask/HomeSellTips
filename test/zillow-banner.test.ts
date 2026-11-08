import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { isFooterBannerPath, ZILLOW_FOOTER_BANNER, ZILLOW_HOME_BANNER, ZILLOW_HREF, ZILLOW_PAGE_BANNER } from "@/lib/zillow-banner";

const root = process.cwd();

function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(bytes.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function pageFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      files.push(...pageFiles(path));
    } else if (entry === "page.tsx") {
      files.push(path);
    }
  }
  return files;
}

describe("Zillow banners", () => {
  it("keeps the approved artwork size and the Zillow link", () => {
    expect(pngSize(resolve(root, "public/zillow-banner-smaller.png"))).toEqual({
      width: ZILLOW_HOME_BANNER.width,
      height: ZILLOW_HOME_BANNER.height,
    });
    expect(pngSize(resolve(root, "public/zillow-thin-banner.png"))).toEqual({
      width: ZILLOW_PAGE_BANNER.width,
      height: ZILLOW_PAGE_BANNER.height,
    });
    expect(pngSize(resolve(root, "public/zillow-footer-banner-text-lowered.png"))).toEqual({
      width: ZILLOW_FOOTER_BANNER.width,
      height: ZILLOW_FOOTER_BANNER.height,
    });
    expect(ZILLOW_HOME_BANNER.src).not.toBe(ZILLOW_PAGE_BANNER.src);
    const banner = readFileSync(resolve(root, "components/zillow-banner.tsx"), "utf8");
    expect(banner).toContain(`href={ZILLOW_HREF}`);
    expect(ZILLOW_HREF).toBe("https://www.zillow.com/");
    expect(banner).toContain('target="_blank"');
    expect(banner).toContain('rel="noopener noreferrer"');
    expect(banner).toContain("unoptimized");
    expect(banner).toContain('width: "auto"');
    expect(banner).toContain('height: "auto"');
    expect(banner).toContain('maxWidth: "100%"');
    expect(ZILLOW_HOME_BANNER.alt.startsWith("Advertisement.")).toBe(true);
    expect(ZILLOW_PAGE_BANNER.alt.startsWith("Advertisement.")).toBe(true);
    expect(ZILLOW_FOOTER_BANNER.alt.startsWith("Advertisement.")).toBe(true);
  });

  it("places the smaller banner only above the home stage section", () => {
    const home = readFileSync(resolve(root, "app/page.tsx"), "utf8");
    const bannerAt = home.indexOf("<ZillowHomeBanner />");
    const stagesAt = home.indexOf('id="stages"');
    expect(bannerAt).toBeGreaterThan(0);
    expect(bannerAt).toBeLessThan(stagesAt);
    expect(home).toContain('id="home-heading">Helpful Ideas for Selling Your Home');
    expect(home).not.toContain("ZillowPageBanner");
    expect(home).not.toContain(ZILLOW_PAGE_BANNER.src);
  });

  it("places the thin banner on content pages and leaves special routes alone", () => {
    for (const file of pageFiles(resolve(root, "app"))) {
      const rel = relative(root, file);
      if (rel === join("app", "page.tsx")) {
        continue;
      }
      const appDir = resolve(root, "app");
      let dir = resolve(file, "..");
      let found = false;
      while (dir.startsWith(appDir)) {
        const layout = join(dir, "layout.tsx");
        if (existsSync(layout)) {
          const source = readFileSync(layout, "utf8");
          if (source.includes("ZillowPageBanner") || source.includes("ZillowPageFrame")) {
            found = true;
            break;
          }
        }
        if (dir === appDir) {
          break;
        }
        dir = resolve(dir, "..");
      }
      expect(found, rel).toBe(true);
    }
    for (const file of ["app/layout.tsx", "app/not-found.tsx", "app/robots.ts", "app/sitemap.ts", "app/llms.txt/route.ts"]) {
      const source = readFileSync(resolve(root, file), "utf8");
      expect(source).not.toContain("Zillow");
      expect(source).not.toContain("zillow-");
    }
    const css = readFileSync(resolve(root, "app/globals.css"), "utf8");
    expect(css).toContain(".zillow-banner img");
    expect(css).toContain("object-fit: contain");
    expect(css).not.toMatch(/\.zillow-banner img[^}]*object-fit:\s*cover/);
  });

  it("places the footer banner immediately above the disclaimer on normal pages", () => {
    const footer = readFileSync(resolve(root, "components/site-footer.tsx"), "utf8");
    const bannerAt = footer.indexOf("<ZillowFooterBanner />");
    const disclaimerAt = footer.indexOf('id="disclaimer"');
    expect(bannerAt).toBeGreaterThan(0);
    expect(bannerAt).toBeLessThan(disclaimerAt);
    expect(footer).toContain("{DISCLAIMER}");
    expect(footer).toContain('href="/"');
    const css = readFileSync(resolve(root, "app/globals.css"), "utf8");
    expect(css).toContain("padding: 2rem 0 2.4rem");
    expect(css).toMatch(/\.footer-inner\s*\{[^}]*gap:\s*0\.8rem/);
    expect(css).toContain(".zillow-banner-footer { margin: 0 0 calc(2rem - 0.8rem); min-width: 0; }");
    expect(isFooterBannerPath("/")).toBe(true);
    expect(isFooterBannerPath("/tips/walk-the-house-before-you-hire")).toBe(true);
    expect(isFooterBannerPath("/this-page-is-not-real")).toBe(false);
    expect(isFooterBannerPath("/robots.txt")).toBe(false);
    expect(isFooterBannerPath("/sitemap.xml")).toBe(false);
    for (const file of pageFiles(resolve(root, "app"))) {
      const rel = relative(resolve(root, "app"), file).replace(/\\/g, "/");
      const route = rel === "page.tsx" ? "/" : `/${rel.replace(/\/page\.tsx$/, "")}`;
      expect(isFooterBannerPath(route), route).toBe(true);
    }
  });
});
