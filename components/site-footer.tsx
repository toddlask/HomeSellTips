import Link from "next/link";
import { allPhotos } from "@/lib/photos";
import { DISCLAIMER } from "@/lib/site";

export function SiteFooter() {
  const photos = allPhotos();
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p id="disclaimer" className="legal">
          {DISCLAIMER}
        </p>
        <h2 className="credit-title">Photo credits</h2>
        <ul className="credit-list">
          {photos.map((photo) => (
            <li key={photo.id}>
              <a href={photo.sourcePage}>{photo.alt}</a> Photograph by {photo.photographer}.{" "}
              <a href={photo.licenseUrl}>{photo.license}</a>.
            </li>
          ))}
        </ul>
        <ul className="footer-links no-print">
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
