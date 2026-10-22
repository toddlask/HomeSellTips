import { stagePath, stageTitle } from "@/lib/stages";
import { SITE_NAME } from "@/lib/site";
import { STAGE_IDS } from "@/lib/types";

const toolLinks = [
  ["/tools/net-proceeds", "Proceeds"],
  ["/tools/commission", "Commission"],
  ["/tools/what-to-fix", "What to fix"],
  ["/tools/checklist", "Checklist"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header no-print">
      <div className="wrap header-bar">
        <a className="brand" href="/">
          {SITE_NAME}
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            <li>
              <a href="/">Home</a>
            </li>
            {STAGE_IDS.map((stage) => (
              <li key={stage}>
                <a href={stagePath(stage)}>{stageTitle(stage)}</a>
              </li>
            ))}
            {toolLinks.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
            <li>
              <a href="/directory">Directory</a>
            </li>
            <li>
              <a href="/advertise">Advertise</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
