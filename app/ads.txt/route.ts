import { adsTxtBody } from "@/lib/ads";

export const dynamic = "force-dynamic";

export function GET(): Response {
  const body = adsTxtBody(process.env.ADSENSE_PUBLISHER_ID);
  if (!body) {
    return new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
