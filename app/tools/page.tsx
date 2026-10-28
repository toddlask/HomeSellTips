import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-meta";
import { CALCULATOR_NOTE, TOOL_LINKS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Tools",
  description: "Calculators and checklists that use only the numbers you enter.",
  path: "/tools",
});

export default function ToolsIndexPage() {
  return (
    <>
      <h1>Tools</h1>
      <p className="lede">{CALCULATOR_NOTE}</p>
      <ul className="tool-grid">
        {TOOL_LINKS.map((tool) => (
          <li key={tool.href}>
            <a className="card" href={tool.href}>
              <h2>{tool.title}</h2>
              <p>{tool.text}</p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
