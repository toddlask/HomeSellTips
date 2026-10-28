import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { CALCULATOR_NOTE, TOOL_LINKS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Seller calculators and checklists",
  description: HUB_DESCRIPTIONS.tools,
  path: "/tools",
});

export default function ToolsIndexPage() {
  return (
    <>
      <h1>Tools</h1>
      <p className="lede">{CALCULATOR_NOTE}</p>
      <PagePhoto photo={pagePhoto("/tools")} />
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
