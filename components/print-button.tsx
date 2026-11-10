"use client";

export function PrintButton({ label = "Print this checklist" }: { label?: string }) {
  return (
    <button type="button" className="no-print" onClick={() => window.print()}>
      {label}
    </button>
  );
}
