import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTENT_SECURITY_POLICY } from "@/lib/csp";

describe("web analytics", () => {
  it("loads cookieless Vercel Web Analytics from this origin", () => {
    const layout = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain('from "@vercel/analytics/next"');
    expect(layout).toContain("<Analytics />");
    expect(layout).toContain('from "@vercel/speed-insights/next"');
    expect(layout).toContain("<SpeedInsights />");
    expect(layout).toContain("adsenseClientId(process.env.ADSENSE_PUBLISHER_ID) !== null");
    const privacy = readFileSync(resolve(process.cwd(), "app/privacy/page.tsx"), "utf8");
    expect(privacy).toContain("Vercel Web Analytics");
    expect(privacy).toContain("cookieless");
    expect(privacy).toContain("anonymous page views");
    expect(privacy).toContain("measures page performance");
    expect(CONTENT_SECURITY_POLICY).toMatch(/script-src[^;]*'self'/);
    expect(CONTENT_SECURITY_POLICY).toMatch(/connect-src[^;]*'self'/);
    const packageJson = readFileSync(resolve(process.cwd(), "package.json"), "utf8");
    expect(packageJson).toContain('"@vercel/analytics"');
    expect(packageJson).toContain('"@vercel/speed-insights"');
  });
});
