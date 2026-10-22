import { ANNOUNCEMENT, SITE_NAME } from "@/lib/site";

const navLinks = [
  ["/", "Home"],
  ["/#stages", "Stages"],
  ["/#tools", "Tools"],
  ["/advertise", "Advertise"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header no-print">
      <p className="announce">{ANNOUNCEMENT}</p>
      <div className="wrap header-bar">
        <a className="brand" href="/">
          {SITE_NAME}
        </a>
        <nav className="primary-nav" aria-label="Primary">
          <ul className="nav-links">
            {navLinks.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
