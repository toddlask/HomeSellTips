import { adsTxtBody } from "@/lib/ads";

export const dynamic = "force-dynamic";

export function GET(): Response {
  return new Response(adsTxtBody(process.env.ADSENSE_PUBLISHER_ID), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
