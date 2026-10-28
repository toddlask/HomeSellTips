import type { Metadata } from "next";
import { AdvertiseForm } from "@/components/advertise-form";
import { INFO_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Advertise with us",
  description: INFO_DESCRIPTIONS.advertise,
  path: "/advertise",
});

export default function AdvertisePage() {
  return (
    <>
      <h1>Advertise with us</h1>
      <p className="lede inquiry-lede">
        Tell us what you want to place on the site. We will read your note and reply by email.
      </p>
      <AdvertiseForm />
    </>
  );
}
