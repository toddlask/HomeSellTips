import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NotAdviceNote } from "@/components/page-byline";
import { ZillowPageBanner } from "@/components/zillow-banner";
import { toolCrumbs } from "@/lib/crumbs";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ZillowPageBanner />
      <Breadcrumbs crumbs={toolCrumbs()} linkLast />
      {children}
      <NotAdviceNote />
    </>
  );
}
