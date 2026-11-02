import { SITE_NAME } from "@/lib/site";

export function PageByline() {
  return (
    <p className="byline">
      By <a href="/about">{SITE_NAME}</a>
    </p>
  );
}

export function NotAdviceNote() {
  return <p className="note">Not legal, tax or financial advice.</p>;
}
