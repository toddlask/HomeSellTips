import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "hst_admin";

export function tokenDigest(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function digestsMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function adminConfigured(secret: string | undefined): boolean {
  return Boolean(secret?.trim());
}
