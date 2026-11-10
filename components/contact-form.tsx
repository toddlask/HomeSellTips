"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { contactProblem, INQUIRY_ENDPOINT, INQUIRY_LIMITS, type InquiryField } from "@/lib/inquiry";

type InquiryResult = { success?: string | boolean; message?: string };

function fieldDescribed(field: InquiryField, active: InquiryField | null): {
  "aria-invalid"?: true;
  "aria-describedby"?: string;
} {
  if (active !== field) {
    return {};
  }
  return { "aria-invalid": true, "aria-describedby": "contact-error" };
}

export function ContactForm() {
  const [startedAt] = useState(() => Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    const problem = contactProblem({ name, email, message, honey, startedAt }, Date.now());
    if (problem) {
      setError(problem.message);
      setFieldError(problem.field);
      if (problem.field) {
        document.getElementById(`contact-${problem.field}`)?.focus();
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
          message: message.trim(),
          company: "General contact",
          offer: "General contact",
          _subject: "HomeSellTips contact",
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
      });
      const payload = (await sentResponse.json().catch(() => null)) as InquiryResult | null;
      if (payload?.success !== true && payload?.success !== "true") {
        setError(payload?.message || "The message was not sent.");
        return;
      }
      setSent(true);
    } catch {
      setError("The message was not sent.");
      setFieldError(null);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="panel" role="status">
        Thanks. Your message was sent. We will read it and reply by email.
      </p>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit} noValidate aria-describedby={error && !fieldError ? "contact-error" : undefined}>
      <label htmlFor="contact-name">
        Name
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.name}
          {...fieldDescribed("name", fieldError)}
        />
      </label>
      <label htmlFor="contact-email">
        Email
        <input
          id="contact-email"
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
      <label htmlFor="contact-message">
        Message
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          maxLength={INQUIRY_LIMITS.message}
          {...fieldDescribed("message", fieldError)}
        />
      </label>
      <div className="inquiry-honey" aria-hidden="true">
        <label htmlFor="contact-website">
          Website
          <input
            id="contact-website"
            name="honey"
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={(event) => setHoney(event.target.value)}
          />
        </label>
      </div>
      {error ? (
        <p id="contact-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
