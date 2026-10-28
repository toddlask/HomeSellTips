import { inquiryProblem, readInquiry, type InquiryInput } from "@/lib/inquiry";

export const INQUIRY_ENDPOINT = "https://formsubmit.co/ajax/4b67484cb46ea9e59ce9af67ffb8c591";

const DELIVERY_FAILURE = "The inquiry was not sent.";

export function inquiryDeliveryBody(input: InquiryInput): Record<string, string> {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    _replyto: input.email.trim(),
    company: input.company.trim(),
    offer: input.offer.trim(),
    budget: input.budget.trim(),
    message: input.message.trim(),
    _subject: "HomeSellTips advertising inquiry",
    _template: "table",
    _captcha: "false",
  };
}

function deliverySucceeded(payload: unknown): boolean {
  if (payload === null || typeof payload !== "object") {
    return false;
  }
  const success = (payload as { success?: unknown }).success;
  return success === true || success === "true";
}

export async function forwardInquiry(
  input: InquiryInput,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true } | { ok: false; error: string }> {
  let response: Response;
  try {
    response = await fetchImpl(INQUIRY_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(inquiryDeliveryBody(input)),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return { ok: false, error: DELIVERY_FAILURE };
  }
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok || !deliverySucceeded(payload)) {
    return { ok: false, error: DELIVERY_FAILURE };
  }
  return { ok: true };
}

export async function respondToInquiry(
  body: unknown,
  now: number,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  const input = readInquiry(body);
  const problem = inquiryProblem(input, now);
  if (problem) {
    return Response.json({ error: problem.message, field: problem.field }, { status: 400 });
  }
  const result = await forwardInquiry(input, fetchImpl);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }
  return Response.json({ ok: true });
}
