"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { INQUIRY_ENDPOINT, INQUIRY_LIMITS, inquiryProblem, type InquiryField } from "@/lib/inquiry";

type InquiryResult = { success?: string | boolean; message?: string };

function fieldDescribed(field: InquiryField, active: InquiryField | null): {
  "aria-invalid"?: true;
  "aria-describedby"?: string;
} {
  if (active !== field) {
    return {};
  }
  return { "aria-invalid": true, "aria-describedby": "inquiry-error" };
}

export function AdvertiseForm() {
  const [startedAt] = useState(() => Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [offer, setOffer] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<InquiryField | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldError(null);
    const problem = inquiryProblem({ name, email, company, offer, budget, message, honey, startedAt }, Date.now());
    if (problem) {
      setError(problem.message);
      setFieldError(problem.field);
      if (problem.field) {
        document.getElementById(`inquiry-${problem.field}`)?.focus();
      }
      return;
    }
    setPending(true);
    try {
      const sentResponse = await fetch(INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _replyto: email.trim(),
          company: company.trim(),
          offer: offer.trim(),
          budget: budget.trim(),
          message: message.trim(),
          _subject: "HomeSellTips advertising inquiry",
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
      });
      const payload = (await sentResponse.json().catch(() => null)) as InquiryResult | null;
      if (payload?.success !== true && payload?.success !== "true") {
        setError(payload?.message || "The inquiry was not sent.");
        return;
      }
      setSent(true);
    } catch {
      setError("The inquiry was not sent.");
      setFieldError(null);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="panel" role="status">
        Thanks. Your inquiry was sent. We will read it and reply by email.
      </p>
    );
  }

  return (
    <form
      className="inquiry-form"
      onSubmit={onSubmit}
      noValidate
      aria-describedby={error && !fieldError ? "inquiry-error" : undefined}
    >
      <label htmlFor="inquiry-name">
        Name
        <input
          id="inquiry-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.name}
          {...fieldDescribed("name", fieldError)}
        />
      </label>
      <label htmlFor="inquiry-email">
        Email
        <input
          id="inquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.email}
          {...fieldDescribed("email", fieldError)}
        />
      </label>
      <label htmlFor="inquiry-company">
        Company or business
        <input
          id="inquiry-company"
          name="company"
          autoComplete="organization"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.company}
          {...fieldDescribed("company", fieldError)}
        />
      </label>
      <label htmlFor="inquiry-offer">
        What do you want to advertise
        <textarea
          id="inquiry-offer"
          name="offer"
          value={offer}
          onChange={(event) => setOffer(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.offer}
          {...fieldDescribed("offer", fieldError)}
        />
      </label>
      <label htmlFor="inquiry-budget">
        Budget (optional)
        <input
          id="inquiry-budget"
          name="budget"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          maxLength={INQUIRY_LIMITS.budget}
          {...fieldDescribed("budget", fieldError)}
        />
      </label>
      <label htmlFor="inquiry-message">
        Message
        <textarea
          id="inquiry-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.message}
          {...fieldDescribed("message", fieldError)}
        />
      </label>
      <div className="inquiry-honey" aria-hidden="true">
        <label htmlFor="inquiry-website">
          Website
          <input
            id="inquiry-website"
            name="honey"
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={(event) => setHoney(event.target.value)}
          />
        </label>
      </div>
      {error ? (
        <p id="inquiry-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
