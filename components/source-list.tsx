import type { CitedSource } from "@/lib/page-sources";

export function SourceList({ sources }: { sources: readonly CitedSource[] }) {
  if (sources.length === 0) {
    return null;
  }
  return (
    <section className="source-list" aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noreferrer">
              {source.label}
            </a>
            . {source.note}
          </li>
        ))}
      </ul>
    </section>
  );
}
