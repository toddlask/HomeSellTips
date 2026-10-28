import Link from "next/link";
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
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/tips">Tips</Link>
          </li>
          <li>
            <Link href="/stages">Stages</Link>
          </li>
          <li>
            <Link href="/tools">Tools</Link>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/photo-credits">Photo credits</a>
          </li>
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
