import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { INFO_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: INFO_DESCRIPTIONS.contact,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <h1>Contact</h1>
      <p className="lede">
        Send a note about a page, a correction, or a general question. The form uses the same delivery path as the
        advertise inquiry. It does not publish your email on the site, and it does not add you to a mailing list.
      </p>
      <ContactForm />
    </>
  );
}
