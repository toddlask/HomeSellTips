"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminConfigured, digestsMatch, tokenDigest } from "@/lib/admin-token";

export async function loginAdmin(formData: FormData): Promise<void> {
  const expected = process.env.ADMIN_TOKEN?.trim() ?? "";
  if (!adminConfigured(expected)) {
    redirect("/admin?error=unconfigured");
  }
  const provided = String(formData.get("token") ?? "");
  const providedDigest = tokenDigest(provided);
  const expectedDigest = tokenDigest(expected);
  if (!digestsMatch(providedDigest, expectedDigest)) {
    redirect("/admin?error=denied");
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, expectedDigest, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  });
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin");
}
