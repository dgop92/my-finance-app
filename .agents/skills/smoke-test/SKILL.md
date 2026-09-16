---
name: smoke-test
description: Browser-driven smoke test for this app's UI — starts the dev server, seeds localStorage directly with realistic Account/LedgerEntry data, drives a page with Playwright, and screenshots it for visual review. Use when asked to visually verify a UI change, check that a page renders correctly, or confirm a feature works in a real browser (not just unit/e2e tests). Do NOT use for the e2e test suite itself (`pnpm run test:e2e`, `e2e/*.spec.ts`) — this is for one-off manual/visual checks, not written test files. An empty-state screenshot proves nothing in this app, so seeding is not optional.
---

# Smoke Test

This app is 100% client-side and `localStorage`-backed with no seed/fixture
data by default. A screenshot of an empty state proves nothing — seeding
realistic data before looking at the page is the point of this skill, not
an optional extra.

## Steps

### 1. Start the dev server

```bash
pnpm run dev > /tmp/smoke-dev-server.log 2>&1 &
```

Poll instead of guessing with a fixed `sleep`:

```bash
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
  [ "$code" = "200" ] && break
  sleep 1
done
```

The dev server runs on port `5173` (Vite default, also the `baseURL` in
`playwright.config.ts`).

### 2. Write a throwaway Playwright driver script

`@playwright/test` is already a dev dependency (used for `pnpm run test:e2e`)
and re-exports the standalone browser API, so no new install is needed:

```js
import { chromium } from "@playwright/test";
```

The script **must live inside the project directory** (e.g. a scratch file
at the repo root, not `/tmp`) so this import resolves against this repo's
`node_modules`. Delete it in step 6.

Launch, seed, and navigate:

```js
const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(err.message));

await page.goto("http://localhost:5173/");
await page.evaluate(
  ({ accounts, ledgerEntries }) => {
    localStorage.setItem("financeApp:accounts", JSON.stringify(accounts));
    localStorage.setItem("financeApp:ledgerEntries", JSON.stringify(ledgerEntries));
  },
  { accounts, ledgerEntries },
);
await page.reload();
```

An initial `page.goto` before seeding is required — `localStorage` is scoped
to the page's origin, so it isn't accessible until a page from that origin
has loaded. The `page.reload()` after seeding is what makes the app read the
seeded data on boot.

### 3. Seed data shapes

These are the exact `localStorage` keys and shapes the repositories expect
(source of truth: `account-local-storage-repository.ts`,
`ledger-entry-storage.ts` — re-check those files if this drifts).

**`financeApp:accounts`** → `Account[]`:

```js
const accounts = [
  { id: "acc-1", name: "Checking", createdAt: new Date().toISOString(), archived: false },
];
```

**`financeApp:ledgerEntries`** → `LedgerEntry[]`:

```js
const ledgerEntries = [
  {
    id: "entry-1",
    createdAt: new Date().toISOString(),
    accountId: "acc-1", // must match an account's id above
    type: "debit", // "debit" = Deposit (increases balance), "credit" = Withdrawal (decreases)
    amount: 100000, // positive integer
    date: new Date().toISOString(),
  },
];
```

`createdAt` and `date` are stored as ISO strings and parsed back into `Date`
objects by the repositories on read — write ISO strings here, not `Date`
objects (they won't survive `JSON.stringify` cleanly for this purpose).

Parameterize these per check — add more accounts/entries, vary `date` across
months for trend charts, archive an account, etc., rather than hardcoding
one fixed dataset for every page.

### 4. Wait for a real signal

```js
await page.waitForSelector("text=Checking");
```

Use a selector or text that only appears once the feature under test has
actually rendered with the seeded data — not just the page shell. Pick this
per check (e.g. a specific account name, a chart's stat value, a table row).

After the check, assert `consoleErrors` is empty. A page can render its
shell successfully while a data fetch or computation silently throws.

### 5. Screenshot and look at it

```js
await page.screenshot({ path: "/tmp/smoke-test.png", fullPage: true });
await browser.close();
```

Then actually view `/tmp/smoke-test.png` with the Read tool — don't just
check that the script exited without throwing. The screenshot is the point;
a script that ran clean but rendered a blank div is not a passing check.

### 6. Clean up

```bash
rm -f <scratch-driver-script>
lsof -ti:5173 -sTCP:LISTEN | xargs -r kill
```

Delete the scratch script and free the port even if the check failed.

## Full example

```js
import { chromium } from "@playwright/test";

const accounts = [
  { id: "acc-1", name: "Checking", createdAt: new Date().toISOString(), archived: false },
];
const ledgerEntries = [
  {
    id: "entry-1",
    createdAt: new Date().toISOString(),
    accountId: "acc-1",
    type: "debit",
    amount: 100000,
    date: new Date().toISOString(),
  },
];

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(err.message));

await page.goto("http://localhost:5173/");
await page.evaluate(
  ({ accounts, ledgerEntries }) => {
    localStorage.setItem("financeApp:accounts", JSON.stringify(accounts));
    localStorage.setItem("financeApp:ledgerEntries", JSON.stringify(ledgerEntries));
  },
  { accounts, ledgerEntries },
);
await page.reload();

await page.waitForSelector("text=Checking");
await page.screenshot({ path: "/tmp/smoke-test.png", fullPage: true });

console.log("consoleErrors:", JSON.stringify(consoleErrors));
await browser.close();
```

## Notes

- If launching the browser fails with a missing shared library error (e.g.
  `libatk-1.0.so.0: cannot open shared object file`), stop and tell the user
  that `npx playwright install-deps chromium` has not been run — don't try
  to install OS packages yourself (see `AGENTS.md`).
- This skill is for ad hoc visual verification, not for writing or running
  the `e2e/*.spec.ts` suite — those use `pnpm run test:e2e` and drive the UI
  through real interactions rather than seeding storage directly.
