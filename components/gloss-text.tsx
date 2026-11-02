import { Fragment, type ReactNode } from "react";
import { TermTip } from "@/components/term-tip";
import { splitGlossary } from "@/lib/glossary";

const LINK_PATTERN = /\[([^\]\n]+)\]\((https:\/\/[^\s)]+|\/[^\s)]+)\)/g;

export function GlossText({ text }: { text: string }) {
  return splitGlossary(text).map((part, index) => {
    if (part.kind === "text") {
      return <Fragment key={index}>{part.text}</Fragment>;
    }
    return <TermTip key={`${part.id}-${index}`} word={part.text} definition={part.definition} />;
  });
}

export function RichText({ text }: { text: string }) {
  if (!text.includes("](")) {
    return <GlossText text={text} />;
  }
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(LINK_PATTERN);
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(<GlossText key={key} text={text.slice(last, match.index)} />);
      key += 1;
    }
    const href = match[2] ?? "";
    const label = match[1] ?? "";
    nodes.push(
      <a key={key} href={href} {...(href.startsWith("https://") ? { rel: "noreferrer" } : {})}>
        {label}
      </a>,
    );
    key += 1;
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(<GlossText key={key} text={text.slice(last)} />);
  }
  return <>{nodes}</>;
}
