const MIN_WAIT_MS = 2000;
const MAX_WAIT_MS = 24 * 60 * 60 * 1000;

export const INQUIRY_LIMITS = {
  name: 80,
  email: 120,
  company: 120,
  offer: 400,
  budget: 80,
  message: 4000,
} as const;

export type InquiryField = keyof typeof INQUIRY_LIMITS;

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

export type InquiryProblem = {
  field: InquiryField | null;
  message: string;
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

export function inquiryProblem(input: InquiryInput, now: number): InquiryProblem | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const company = input.company.trim();
  const offer = input.offer.trim();
  const budget = input.budget.trim();
  const message = input.message.trim();
  if (input.honey.trim()) {
    return { field: null, message: "That submission was rejected." };
  }
  if (!name || name.length > INQUIRY_LIMITS.name) {
    return { field: "name", message: "Enter your name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > INQUIRY_LIMITS.email) {
    return { field: "email", message: "Enter a valid email." };
  }
  if (!company || company.length > INQUIRY_LIMITS.company) {
    return { field: "company", message: "Enter the company or business." };
  }
  if (!offer || offer.length > INQUIRY_LIMITS.offer) {
    return { field: "offer", message: "Say what you want to advertise." };
  }
  if (budget.length > INQUIRY_LIMITS.budget) {
    return { field: "budget", message: "Shorten the budget and try again." };
  }
  if (!message || message.length > INQUIRY_LIMITS.message) {
    return { field: "message", message: "Enter a message." };
  }
  const waited = now - input.startedAt;
  if (!Number.isFinite(input.startedAt) || waited < MIN_WAIT_MS || waited > MAX_WAIT_MS) {
    return { field: null, message: "Wait a moment and send it again." };
  }
  return null;
}

export function inquiryError(input: InquiryInput, now: number): string | null {
  return inquiryProblem(input, now)?.message ?? null;
}
