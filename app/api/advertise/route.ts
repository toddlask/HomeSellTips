import { inquiryError, readInquiry } from "@/lib/inquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json().catch(() => null);
  const error = inquiryError(readInquiry(body), Date.now());
  if (error) {
    return Response.json({ error }, { status: 400 });
  }
  return Response.json({ ok: true });
}
