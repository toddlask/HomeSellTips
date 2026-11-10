import Link from "next/link";
import { ZillowFooterBanner } from "@/components/zillow-footer-banner";
import { DISCLAIMER } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <ZillowFooterBanner />
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
            <a href="/privacy">Privacy</a>
          </li>
          <li>
            <a href="/terms">Terms</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/editorial-policy">Editorial policy</a>
          </li>
          <li>
            <a href="/disclosure">Disclosure</a>
          </li>
          <li>
            <a href="/advertise">Advertise</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
