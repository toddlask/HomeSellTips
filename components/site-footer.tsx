import { DISCLAIMER } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p id="disclaimer" className="legal">
          {DISCLAIMER}
        </p>
        <ul className="footer-links no-print">
          <li>
            <a href="/archive">Archive</a>
          </li>
          <li>
            <a href="/privacy">Privacy</a>
          </li>
          <li>
            <a href="/disclosure">Ad and affiliate disclosure</a>
          </li>
          <li>
            <a href="/advertise">Advertise</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
