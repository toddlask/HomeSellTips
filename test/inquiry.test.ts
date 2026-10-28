import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdvertiseForm } from "@/components/advertise-form";
import { INQUIRY_ENDPOINT, INQUIRY_LIMITS, inquiryError, inquiryProblem, readInquiry } from "@/lib/inquiry";

const now = Date.parse("2026-10-23T16:00:00Z");

const valid = {
  name: "Ada",
  email: "ada@example.com",
  company: "Ada Homes",
  offer: "A banner beside the tools",
  budget: "",
  message: "We would like one month.",
  honey: "",
  startedAt: now - 5000,
};

describe("advertise inquiry", () => {
  it("accepts a complete inquiry and an empty budget", () => {
    expect(inquiryError(valid, now)).toBeNull();
    expect(inquiryError({ ...valid, budget: "$200" }, now)).toBeNull();
  });

  it("rejects missing fields, a bad email, a filled honeypot, and a fast submit", () => {
    expect(inquiryError({ ...valid, name: " " }, now)).toMatch(/name/i);
    expect(inquiryError({ ...valid, email: "ada" }, now)).toMatch(/email/i);
    expect(inquiryError({ ...valid, company: "" }, now)).toMatch(/company/i);
    expect(inquiryError({ ...valid, offer: "" }, now)).toMatch(/advertise/i);
    expect(inquiryError({ ...valid, message: "" }, now)).toMatch(/message/i);
    expect(inquiryError({ ...valid, honey: "http://spam.test" }, now)).toMatch(/rejected/i);
    expect(inquiryError({ ...valid, startedAt: now - 200 }, now)).toMatch(/wait/i);
  });

  it("names the first invalid field and enforces the length limits", () => {
    expect(inquiryProblem({ ...valid, name: "" }, now)).toEqual({ field: "name", message: expect.stringMatching(/name/i) });
    expect(inquiryProblem({ ...valid, offer: "x".repeat(INQUIRY_LIMITS.offer + 1) }, now)?.field).toBe("offer");
    expect(inquiryProblem({ ...valid, message: "x".repeat(INQUIRY_LIMITS.message + 1) }, now)?.field).toBe("message");
    expect(inquiryProblem({ ...valid, company: "x".repeat(INQUIRY_LIMITS.company + 1) }, now)?.field).toBe("company");
    expect(inquiryProblem({ ...valid, honey: "bot" }, now)?.field).toBeNull();
    expect(inquiryProblem(valid, now)).toBeNull();
  });

  it("reads only known fields and posts to FormSubmit from the browser", () => {
    expect(readInquiry({ name: " Ada ", budget: 12, honey: "" }).name).toBe("Ada");
    expect(readInquiry(null).email).toBe("");
    expect(INQUIRY_ENDPOINT).toBe("https://formsubmit.co/ajax/4b67484cb46ea9e59ce9af67ffb8c591");
    expect(INQUIRY_ENDPOINT).not.toContain("@");
    const html = renderToStaticMarkup(createElement(AdvertiseForm));
    expect(html).not.toMatch(/\$99|\$249|PayPal|paypal|formsubmit/i);
    expect(html).toContain('name="honey"');
    expect(html).toContain('maxLength="80"');
    expect(html).toContain('maxLength="120"');
    expect(html).toContain('maxLength="400"');
    expect(html).toContain('maxLength="4000"');
    expect(html).toContain("Send inquiry");
    const formSource = readFileSync(resolve(process.cwd(), "components/advertise-form.tsx"), "utf8");
    expect(formSource).toContain("INQUIRY_ENDPOINT");
    expect(formSource).toContain("_captcha");
    expect(formSource).toContain("aria-describedby");
    expect(formSource).toContain(".focus()");
    expect(formSource).not.toContain("/api/advertise");
    expect(formSource).not.toContain("mail.grokbot.com");
    const pageSource = readFileSync(resolve(process.cwd(), "app/advertise/page.tsx"), "utf8");
    expect(pageSource).not.toMatch(/\$99|\$249|paypal/i);
  });
});
