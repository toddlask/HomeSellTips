import { stagePath, stageTitle } from "@/lib/stages";
import { SITE_NAME } from "@/lib/site";
import { STAGE_IDS } from "@/lib/types";

export function SiteHeader() {
  return (
    <header className="site-header no-print">
      <div className="wrap header-inner">
        <a className="brand" href="/">
          {SITE_NAME}
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <details className="nav-group">
                <summary>Tips</summary>
                <div className="nav-panel">
                  {STAGE_IDS.map((stage) => (
                    <a key={stage} href={stagePath(stage)}>
                      {stageTitle(stage)}
                    </a>
                  ))}
                  <a href="/archive">Archive</a>
                </div>
              </details>
            </li>
            <li>
              <details className="nav-group">
                <summary>Tools</summary>
                <div className="nav-panel">
                  <a href="/tools/net-proceeds">Net proceeds</a>
                  <a href="/tools/commission">Commission</a>
                  <a href="/tools/what-to-fix">What to fix</a>
                  <a href="/tools/checklist">Checklist</a>
                </div>
              </details>
            </li>
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
