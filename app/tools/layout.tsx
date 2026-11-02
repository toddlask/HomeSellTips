import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NotAdviceNote } from "@/components/page-byline";
import { toolCrumbs } from "@/lib/crumbs";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Breadcrumbs crumbs={toolCrumbs()} linkLast />
      {children}
      <NotAdviceNote />
    </>
  );
}
