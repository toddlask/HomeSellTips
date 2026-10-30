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

## Content

There is no scheduled publisher. Queued tips stay queued until a commit publishes them. Approve an open review with:

```bash
npm run content:approve -- review-<slug>
```

Then commit and push. Email sending is hard-disabled. There is no provider and no send control. Do not add a Vercel cron for publishing.

## Advertising

The advertise page checks the fields in the browser, then the browser posts them to FormSubmit.

Ad slots appear only when `ADSENSE_PUBLISHER_ID` and a slot id are set. Ad scripts load after cookie consent. `/ads.txt` responds with 404 until that publisher id is set, and then it serves the publisher line.

Affiliate links stay off unless `AFFILIATES_ENABLED` is true and a URL is set.
