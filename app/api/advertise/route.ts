import { respondToInquiry } from "@/lib/inquiry-forward";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json().catch(() => null);
  return respondToInquiry(body, Date.now());
}
