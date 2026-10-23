import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdvertiseForm } from "@/components/advertise-form";
import { INQUIRY_ENDPOINT, inquiryError, readInquiry } from "@/lib/inquiry";

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

  it("reads only known fields and posts to the FormSubmit alias", () => {
    expect(readInquiry({ name: " Ada ", budget: 12, honey: "" }).name).toBe("Ada");
    expect(readInquiry(null).email).toBe("");
    expect(INQUIRY_ENDPOINT).toBe("https://formsubmit.co/ajax/4b67484cb46ea9e59ce9af67ffb8c591");
    expect(INQUIRY_ENDPOINT).not.toContain("@");
    const html = renderToStaticMarkup(createElement(AdvertiseForm));
    expect(html).not.toMatch(/\$99|\$249|PayPal|paypal/);
    expect(html).toContain('name="honey"');
    expect(html).toContain("Send inquiry");
    const formSource = readFileSync(resolve(process.cwd(), "components/advertise-form.tsx"), "utf8");
    expect(formSource).toContain("INQUIRY_ENDPOINT");
    expect(formSource).toContain("_captcha");
    expect(formSource).not.toContain("mail.grokbot.com");
    const pageSource = readFileSync(resolve(process.cwd(), "app/advertise/page.tsx"), "utf8");
    expect(pageSource).not.toMatch(/\$99|\$249|paypal/i);
  });
});
