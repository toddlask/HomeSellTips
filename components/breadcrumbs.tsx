import type { Crumb } from "@/lib/crumbs";

export function Breadcrumbs({ crumbs, linkLast = false }: { crumbs: readonly Crumb[]; linkLast?: boolean }) {
  return (
    <nav className="crumbs no-print" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          const linked = linkLast || !last;
          return (
            <li key={`${crumb.path}-${index}`}>
              {linked ? <a href={crumb.path}>{crumb.name}</a> : <span aria-current="page">{crumb.name}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
