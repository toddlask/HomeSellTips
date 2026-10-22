import { TermTip } from "@/components/term-tip";
import { CORE_TERMS, glossaryById } from "@/lib/glossary";

export function SaleWords() {
  return (
    <aside className="sale-words" aria-label="Sale words">
      <h2>Sale words</h2>
      <p>
        {CORE_TERMS.map((id) => {
          const entry = glossaryById(id);
          return <TermTip key={id} word={entry.label} definition={entry.definition} />;
        })}
      </p>
    </aside>
  );
}
