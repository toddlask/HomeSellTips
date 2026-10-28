# HomeSellTips

Practical US home-selling tips for people about one to six months from listing, plus calculators that use only the numbers you enter.

This is not legal, financial, tax, or real-estate advice. Rules vary by state.

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` if you need to try a feature. Leave values empty when you do not have them.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

## Content schedule

`.github/workflows/publish-tip.yml` runs daily at 14:00 UTC. It publishes the next queued tip only when the newest published tip is at least two days old. It does not call a model and does not write new prose.

`REVIEW_REQUIRED` unset or false publishes. Set the repository variable to `true` to append an open review item in `content/reviews.json` instead. Approve with:

```bash
npm run content:approve -- review-<slug>
```

Then commit and push. Both hosts deploy the same git commit, so they cannot drift.

Renewal reminders are drafted into `content/outbox.json` only. Email sending is hard-disabled. There is no provider and no send control.

Do not add a Vercel cron for publishing. The GitHub Action is the only publisher.

## Advertising

The advertise page posts to `/api/advertise`. That route checks the fields, then forwards the inquiry to FormSubmit. The browser does not call FormSubmit itself.

Ad slots appear only when `ADSENSE_PUBLISHER_ID` and a slot id are set. Ad scripts load after cookie consent. `/ads.txt` responds with 404 until that publisher id is set, and then it serves the publisher line.

Affiliate links stay off unless `AFFILIATES_ENABLED` is true and a URL is set.
