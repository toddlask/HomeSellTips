import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalRedirect } from "@/lib/host-redirect";

export function proxy(request: NextRequest): NextResponse {
  const target = canonicalRedirect(request.headers.get("host"), request.nextUrl.pathname);
  if (!target) {
    return NextResponse.next();
  }
  const destination = new URL(target);
  destination.search = request.nextUrl.search;
  return NextResponse.redirect(destination, 308);
}
