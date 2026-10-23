export const INQUIRY_ENDPOINT = "https://formsubmit.co/ajax/4b67484cb46ea9e59ce9af67ffb8c591";

const MIN_WAIT_MS = 2000;
const MAX_WAIT_MS = 24 * 60 * 60 * 1000;

export type InquiryInput = {
  name: string;
  email: string;
  company: string;
  offer: string;
  budget: string;
  message: string;
  honey: string;
  startedAt: number;
};

function field(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function readInquiry(body: unknown): InquiryInput {
  const record = body !== null && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return {
    name: field(record.name),
    email: field(record.email),
    company: field(record.company),
    offer: field(record.offer),
    budget: field(record.budget),
    message: field(record.message),
    honey: field(record.honey),
    startedAt: typeof record.startedAt === "number" ? record.startedAt : Number.NaN,
  };
}

export function inquiryError(input: InquiryInput, now: number): string | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const company = input.company.trim();
  const offer = input.offer.trim();
  const budget = input.budget.trim();
  const message = input.message.trim();
  if (input.honey.trim()) {
    return "That submission was rejected.";
  }
  if (!name || name.length > 80) {
    return "Enter your name.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return "Enter a valid email.";
  }
  if (!company || company.length > 120) {
    return "Enter the company or business.";
  }
  if (!offer || offer.length > 400) {
    return "Say what you want to advertise.";
  }
  if (budget.length > 80) {
    return "Shorten the budget and try again.";
  }
  if (!message || message.length > 4000) {
    return "Enter a message.";
  }
  const waited = now - input.startedAt;
  if (!Number.isFinite(input.startedAt) || waited < MIN_WAIT_MS || waited > MAX_WAIT_MS) {
    return "Wait a moment and send it again.";
  }
  return null;
}
