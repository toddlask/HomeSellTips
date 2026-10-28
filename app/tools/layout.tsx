import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { toolCrumbs } from "@/lib/crumbs";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Breadcrumbs crumbs={toolCrumbs()} linkLast />
      {children}
    </>
  );
}
