"use client";

import { useState } from "react";

export function TermTip({ word, definition }: { word: string; definition: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={open ? "term is-open" : "term"}>
      <button
        type="button"
        className="term-word"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        {word}
      </button>
      <span className="term-bubble" role="tooltip">
        {definition}
      </span>
    </span>
  );
}
