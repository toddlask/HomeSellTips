"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "@/lib/consent";

type Choice = "unknown" | "accepted" | "declined";

export function CookieConsent({ enabled }: { enabled: boolean }) {
  const [choice, setChoice] = useState<Choice>("unknown");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") {
      setChoice(stored);
    }
    setReady(true);
  }, []);

  function choose(next: Exclude<Choice, "unknown">) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    setChoice(next);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (!enabled || !ready || choice !== "unknown") {
    return null;
  }

  return (
    <div className="cookie-banner no-print" role="dialog" aria-label="Advertising consent">
      <p>
        This choice is saved in localStorage on this browser. Advertising scripts load only if you accept, and only
        when an ad publisher id is configured.
      </p>
      <div className="cookie-actions">
        <button type="button" onClick={() => choose("accepted")}>
          Accept
        </button>
        <button type="button" className="secondary" onClick={() => choose("declined")}>
          Decline
        </button>
      </div>
    </div>
  );
}
