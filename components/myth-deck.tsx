"use client";

import { useState } from "react";
import { MYTH_CARDS } from "@/lib/myths";

export function MythDeck() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  return (
    <ul className="myth-grid">
      {MYTH_CARDS.map((card) => {
        const showFact = flipped[card.id] === true;
        return (
          <li key={card.id} className={showFact ? "myth is-flipped" : "myth"}>
            <div className="myth-inner">
              <div className="myth-face" aria-hidden={showFact}>
                <p className="myth-kicker">Myth</p>
                <p>{card.myth}</p>
              </div>
              <div className="myth-face myth-back" aria-hidden={!showFact}>
                <p className="myth-kicker">Fact</p>
                <p>{card.fact}</p>
              </div>
            </div>
            <button
              type="button"
              aria-pressed={showFact}
              onClick={() => setFlipped((current) => ({ ...current, [card.id]: current[card.id] !== true }))}
            >
              {showFact ? "Show the myth" : "Show the fact"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
