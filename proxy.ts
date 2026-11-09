import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONTENT_ROUTES, permanentRedirectTarget } from "@/lib/numbered-duplicate";

export function proxy(request: NextRequest): NextResponse {
  const target = permanentRedirectTarget(
    request.headers.get("host"),
    request.nextUrl.pathname,
    request.nextUrl.search,
    CONTENT_ROUTES,
  );
  if (!target) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(target, request.url), 308);
}
