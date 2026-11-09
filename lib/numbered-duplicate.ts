import { tips } from "@/lib/catalog";
import { canonicalRedirect } from "@/lib/host-redirect";
import { publicPaths } from "@/lib/site";

const NUMBERED_SUFFIX = /-(\d+)$/;

export const CONTENT_ROUTES: ReadonlySet<string> = new Set([
  ...publicPaths(tips).map((entry) => entry.path),
  "/admin",
]);

function leavesStaticAndApiAlone(pathname: string): boolean {
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return true;
  }
  if (pathname === "/_next" || pathname.startsWith("/_next/")) {
    return true;
  }
  return pathname.slice(pathname.lastIndexOf("/") + 1).includes(".");
}

export function numberedDuplicateRedirect(pathname: string, routes: ReadonlySet<string>): string | null {
  if (leavesStaticAndApiAlone(pathname)) {
    return null;
  }
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (routes.has(path)) {
    return null;
  }
  const slash = path.lastIndexOf("/");
  const last = path.slice(slash + 1);
  const suffix = NUMBERED_SUFFIX.exec(last);
  if (!suffix) {
    return null;
  }
  const strippedLast = last.slice(0, -suffix[0].length);
  const stripped = strippedLast.length === 0 ? (slash <= 0 ? "/" : path.slice(0, slash)) : `${path.slice(0, slash + 1)}${strippedLast}`;
  if (stripped === path || !routes.has(stripped)) {
    return null;
  }
  return stripped;
}

export function permanentRedirectTarget(
  host: string | null,
  pathname: string,
  search: string,
  routes: ReadonlySet<string>,
): string | null {
  const numbered = numberedDuplicateRedirect(pathname, routes);
  const canonical = canonicalRedirect(host, numbered ?? pathname);
  if (canonical) {
    return `${canonical}${search}`;
  }
  if (!numbered) {
    return null;
  }
  return `${numbered}${search}`;
}
