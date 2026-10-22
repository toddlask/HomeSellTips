import type { Metadata } from "next";
import { cookies } from "next/headers";
import { loginAdmin, logoutAdmin } from "@/app/admin/actions";
import { ADMIN_COOKIE, adminConfigured, digestsMatch, tokenDigest } from "@/lib/admin-token";
import { outbox, productionPlacements, reviews } from "@/lib/catalog";
import { EMAIL_DELIVERY_ENABLED } from "@/lib/outbox";
import { placementProductLabel } from "@/lib/placements";
import { reviewStatusLabel } from "@/lib/review-label";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin gate for HomeSellTips review items and draft renewal notes.",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const secret = process.env.ADMIN_TOKEN?.trim() ?? "";
  const configured = adminConfigured(secret);
  const jar = await cookies();
  const session = jar.get(ADMIN_COOKIE)?.value ?? "";
  const signedIn = configured && session.length > 0 && digestsMatch(session, tokenDigest(secret));

  return (
    <>
      <h1>Admin</h1>
      <p className="panel">
        Email sending is disabled. Renewal notes stay in this outbox. Nothing is emailed.
        {EMAIL_DELIVERY_ENABLED ? " Sending flag drifted." : ""}
      </p>
      {!configured ? (
        <p className="panel" role="status">
          Admin is not configured on this host. Set ADMIN_TOKEN to open the gate.
        </p>
      ) : null}
      {configured && !signedIn ? (
        <form className="panel" action={loginAdmin}>
          <label htmlFor="token">
            Admin token
            <input id="token" name="token" type="password" autoComplete="current-password" />
          </label>
          <button type="submit">Unlock</button>
          {query.error === "denied" ? <p role="alert">That token does not match.</p> : null}
          {query.error === "unconfigured" ? <p role="alert">Admin is not configured on this host.</p> : null}
        </form>
      ) : null}
      {signedIn ? (
        <>
          <form action={logoutAdmin}>
            <button type="submit" className="secondary">
              Lock
            </button>
          </form>
          <section className="section-gap">
            <h2>Review queue</h2>
            {reviews.items.length === 0 ? (
              <p>No review items. With REVIEW_REQUIRED off, the daily job publishes straight to git.</p>
            ) : (
              <ul>
                {reviews.items.map((item) => (
                  <li key={item.id}>
                    {item.id} · {item.tipSlug} · {reviewStatusLabel(item.status)} · opened {item.openedOn}
                  </li>
                ))}
              </ul>
            )}
            <p className="note">
              Approvals are commits so both hosts stay on the same content. Run npm run content:approve -- review-id and
              push. This page does not publish on its own.
            </p>
          </section>
          <section className="section-gap">
            <h2>Placements</h2>
            {productionPlacements.length === 0 ? (
              <p>No placements in the repository. Unapproved and unpaid listings stay off the public directory.</p>
            ) : (
              <ul>
                {productionPlacements.map((placement) => (
                  <li key={placement.id}>
                    {placement.sponsorName} · {placementProductLabel(placement.product)} ·{" "}
                    {placement.approved ? "approved" : "waiting"} · through {placement.expiresOn}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="section-gap">
            <h2>Renewal outbox</h2>
            {outbox.drafts.length === 0 ? (
              <p>No renewal drafts.</p>
            ) : (
              <ul>
                {outbox.drafts.map((draft) => (
                  <li key={draft.id}>
                    <p>{draft.subject}</p>
                    <pre>{draft.body}</pre>
                  </li>
                ))}
              </ul>
            )}
            <p>There is no send control. Delivery stays off.</p>
          </section>
        </>
      ) : null}
    </>
  );
}
