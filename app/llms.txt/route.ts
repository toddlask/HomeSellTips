import { llmsText } from "@/lib/site";

export function GET(): Response {
  return new Response(llmsText(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
