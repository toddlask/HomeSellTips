"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY } from "@/lib/consent";

type AdsWindow = Window & { adsbygoogle?: Record<string, never>[] };

export function AdSlot({
  clientId,
  slotId,
  position,
}: {
  clientId: string;
  slotId: string;
  position: "header" | "in-content" | "sidebar";
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => {
      setAllowed(window.localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted");
    };
    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => {
      window.removeEventListener(CONSENT_EVENT, read);
    };
  }, []);

  useEffect(() => {
    if (!allowed) {
      return;
    }
    if (!document.querySelector("script[data-adsense='true']")) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
      script.crossOrigin = "anonymous";
      script.dataset.adsense = "true";
      document.head.appendChild(script);
    }
    const adsWindow = window as AdsWindow;
    adsWindow.adsbygoogle = adsWindow.adsbygoogle ?? [];
    adsWindow.adsbygoogle.push({});
  }, [allowed, clientId]);

  if (!allowed) {
    return null;
  }

  return (
    <div className={`ad-slot ad-slot-${position} no-print`}>
      <p className="sponsored-label">Sponsored</p>
      <ins className="adsbygoogle" data-ad-client={clientId} data-ad-slot={slotId} data-ad-format="auto" />
    </div>
  );
}
