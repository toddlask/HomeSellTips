"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "@/lib/consent";

type Choice = "unknown" | "accepted" | "declined";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
}

function readChoice(): Choice {
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === "accepted" || stored === "declined") {
    return stored;
  }
  return "unknown";
}

function serverChoice(): Choice {
  return "unknown";
}

function subscribeClient(onChange: () => void) {
  return () => {
    void onChange;
  };
}

function isClient() {
  return true;
}

function isServer() {
  return false;
}

export function CookieConsent({ enabled }: { enabled: boolean }) {
  const client = useSyncExternalStore(subscribeClient, isClient, isServer);
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);

  function choose(next: Exclude<Choice, "unknown">) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, next);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (!enabled || !client || choice !== "unknown") {
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
