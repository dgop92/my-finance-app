# My Finance App — Project Specification

## 1. Overview

My Finance App is a personal finance tracker for recording, over time, how much
money a person holds across different places ("savings sources") and what
significant expenses occurred between check-ins. It is a single-user
application — there is no authentication, multi-user support, or server-side
persistence in the current implementation; all data lives in the browser
(`localStorage`) on a single device.

The domain works like a series of financial "snapshots": a user periodically
creates a **Financial Record**, which captures the amount of money held in
each **Savings Source** at that moment, plus any **Expenses** worth
remembering since the last snapshot. The app then derives totals and
period-over-period differences from that history.

Currency throughout the app is **Colombian Peso (COP)**.

This document describes desired behavior at the level of requirements and
user stories, independent of any specific technology, so it can be used to
rebuild the product on a different stack. Where the current reference
implementation has gaps (planned but not built, or partially built), this is
called out explicitly under **Implementation Status**.

---

## 2. Domain Model

### 2.1 Savings Source
A named place where money is stored (e.g., "Bank X", "Cash", "Money under the
mattress").

- `id`
- `name` — 2–100 characters, required
- `isNA` — boolean flag marking the special system-defined "NA" source
- `createdAt`, `updatedAt`

**Special "NA" source**: The system guarantees exactly one built-in savings
source used to hold unclassified/orphaned money. It:
- Is created automatically the first time the app runs (seed/default data).
- Cannot be renamed or deleted by the user.
- Appears in every financial record, alongside all other sources.
- Receives the balance of any savings source that gets deleted (see 2.1.1).

#### 2.1.1 Deleting a savings source
When a savings source is deleted:
- It is removed from the list of savings sources.
- It is removed from every financial record's breakdown.
- Its amount, in every financial record where it had a value, is added into
  that same record's "NA" value (so the record's grand total is unaffected).

#### 2.1.2 Creating a savings source
When a new savings source is created, it is retroactively added (with amount
0) to every existing financial record, so all records always contain an entry
for every savings source currently defined.

#### 2.1.3 Renaming a savings source
Renaming updates the source's display name everywhere it is referenced
(all financial records reference the current name, not a copy).

### 2.2 Financial Record
A snapshot of the amount held in each savings source at a point in time, plus
any expenses logged against that snapshot.

- `id`
- `createdAt` — set automatically at creation time (local time), immutable
- `updatedAt` — set automatically, updated on every edit (including adding,
  editing, or removing an expense)
- `values` — one entry per savings source: `{ savingsSourceId, amount }`
  (amount ≥ 0)
- `expenses` — zero or more Expense entries

Financial records are conceptually ordered by `createdAt` descending (newest
first); "previous record" always means the record immediately before a given
one in that ordering.

### 2.3 Expense
A notable expense worth remembering, attached to a specific financial record
(representing something that happened in the period leading up to that
record).

- `id`
- `name` — 1–100 characters, required
- `amount` — positive number, in COP
- `createdAt`, `updatedAt`

---

## 3. Derived Calculations

These are pure functions of the domain data and must be recomputed, never
stored redundantly:

- **Record total** = sum of `amount` across all of a record's savings-source
  values.
- **Record difference (amount)** = current record's total − previous
  record's total. If there is no previous record, difference is 0.
- **Record difference (percentage)** = `(current total − previous total) /
  |previous total| × 100`. Special case: if the previous total is 0, the
  percentage is 100% if the current total is > 0, otherwise 0%.
- **Per-source difference** = same amount/percentage formulas applied to a
  single savings source's value between the current and previous record
  (matched by savings source id; a source with no matching entry in the
  previous record is treated as "new").
- **Total expenses for a record** = sum of the record's expense amounts.

---

## 4. Epics & User Stories

### EP001 — Savings Source Management

**US001 — Create Savings Source**
As a user, I want to create a new savings source, so that I can track money
stored in a new location.
- Enter a name; validated as non-empty and under 100 characters (min 2 in
  current implementation).
- New source is saved and immediately available across the app.
- A success confirmation is shown on creation.

**US002 — List Savings Sources**
As a user, I want to view all my savings sources, so I can see everywhere my
money is held.
- Dedicated list view, one row/card per source, showing at least the name.
- The "NA" source always appears, visually marked as special, and cannot be
  edited or deleted from this view.

**US003 — Update Savings Source**
As a user, I want to rename a savings source, so I can correct or improve
its label.
- Same name validation as creation.
- Change propagates to all financial records that reference it.
- The "NA" source cannot be renamed.
- A success confirmation is shown on update. *(Not yet implemented in
  reference app — see status table.)*

**US004 — Delete Savings Source**
As a user, I want to delete a savings source (with its value folded into
"NA"), so I can remove sources I no longer use without losing financial
history.
- Confirmation dialog required before deletion, explaining the value
  transfer to "NA".
- On confirmation: value is merged into "NA" in every record, the source is
  removed from the list and from every record's breakdown.
- The "NA" source itself cannot be deleted.
- A success confirmation is shown on deletion. *(Not yet implemented in
  reference app.)*

**US102 — Special "NA" Source Handling** (cross-cutting, described in 2.1)

---

### EP002 — Financial Record Management

**US005 — Create Financial Record**
As a user, I want to create a new financial record with a value per savings
source, so I can capture my financial status right now.
- Form shows one input per currently-defined savings source.
- Each field is pre-filled with that source's amount from the most recent
  existing record (0 if this is the first record ever, or if the source is
  new).
- User can freely edit any/all values before saving; a running total updates
  live as values change.
- `createdAt`/`updatedAt` are set automatically to the current local time.
- A success confirmation is shown on creation. *(Confirmation not yet
  implemented.)*
- If no savings sources exist yet, the user is guided to create one first
  instead of being shown an empty form.

**US006 — View Financial Record Details**
As a user, I want to view one record in detail, so I can review the
financial picture at that point in time.
- Shows every savings source and its value for that record.
- Shows the grand total.
- Shows the difference (amount + percentage) vs. the previous record,
  both overall and per savings source, with a clear positive/negative
  visual distinction; a source not present in the previous record is
  labeled "New source" rather than showing a misleading diff.
- Shows created and last-updated timestamps.
- Links to edit the record and to manage its expenses.

**US007 — List Financial Records**
As a user, I want to see all my financial records at a glance, so I can
track my financial history over time.
- List sorted newest-first by creation date.
- Each entry shows: date, total, difference vs. previous record (amount +
  percentage, color-coded), last-updated timestamp.
- Selecting an entry opens its detail view; each entry also links directly
  to edit.
- Empty state when no records exist yet, with a call to action to create
  the first one.

**US008 — Update Financial Record**
As a user, I want to edit an existing record's values, so I can correct
mistakes or catch up missed entries.
- Same per-source input form as creation, pre-filled with the record's
  current values (not the previous record's).
- `updatedAt` is refreshed on save; the total is recalculated.
- A success confirmation is shown on update. *(Not yet implemented.)*

**US009 — Delete Financial Record**
As a user, I want to delete a record I created in error or no longer need.
- Confirmation required before deletion.
- Deleted record disappears from the list, and recalculates the
  previous/next relationship (differences) for neighboring records.
- A success confirmation is shown on deletion.
- *(Entirely unimplemented in the reference app — no delete action exists
  in the UI, though the underlying data layer supports it.)*

---

### EP003 — Expense Tracking

**US309 — Add Relevant Expenses to a Financial Record**
As a user, I want to log notable expenses against a record, so I remember
what significant spending happened before that snapshot.
- Add one or more expenses per record; each has a name and a COP amount
  (positive number).
- Saved as part of the record; the record's `updatedAt` is bumped.
- A success confirmation is shown. *(Not yet implemented.)*

**US310 — View Relevant Expenses**
As a user, I want to see all expenses tied to a record, so I can recall
what happened.
- List of expenses shown within the record detail view, each with name and
  amount.
- Clear empty state when a record has no expenses.

**US311 — Edit or Remove Expenses**
As a user, I want to correct or delete a logged expense.
- Edit name and/or amount of an existing expense.
- Delete an expense, with a confirmation step.
- Record's `updatedAt` is bumped on either change.
- A success confirmation is shown. *(Not yet implemented.)*

---

### EP004 — Financial Analysis & Reporting

**US012 — Financial Summary / Dashboard**
As a user, I want a summary view of my current financial position, so I can
understand it at a glance without digging through records.
- Shows the latest record's total.
- Shows the difference vs. the previous record.
- Shows a breakdown by savings source (e.g., proportion chart).
- Shows a handful of the most recent records with quick links to the full
  list and to creating a new record.
- All amounts in COP, properly formatted.
- *(Currently a placeholder page in the reference app — route and
  navigation entry exist, but no summary content is implemented.)*

**US013 — Currency Display and Formatting**
As a user, I want consistent, readable currency formatting everywhere, so
figures are easy to parse.
- All monetary values shown in COP with locale-appropriate thousands
  separators (e.g., `$1.000.000`), no decimal places.
- Positive/negative changes are visually distinguished (color + sign
  prefix): green with a leading "+" for gains, red for losses, neutral for
  zero change.
- Dates formatted consistently (day/month/year, two-digit day and month).

**Analysis & Reports (trend view)** — described in the frontend design as a
dedicated screen with:
- A line chart of total balance over a selectable date range, with
  toggleable per-source lines.
- A distribution chart (pie/stacked bar) of current balance by savings
  source.
- A period-over-period comparison chart of gains/losses.
- Grouping controls (by month/quarter/year) and a data export action.
- *(Not implemented — placeholder page only.)*

---

### EP005 — Data Portability (implemented, not yet in formal stories)

**Export data**
As a user, I want to export all my data as a single file, so I can back it
up or move it elsewhere.
- One action produces a downloadable JSON file containing all savings
  sources and all financial records (with their expenses), timestamped in
  the filename.

**Import data**
As a user, I want to import a previously exported file, so I can restore or
transfer my data.
- User selects a JSON file matching the export shape (`savingsSources` +
  `financialRecords` arrays).
- File is validated for the expected shape before applying; invalid files
  produce a clear error and are not applied.
- On success, the imported data **fully replaces** existing local data.
  The user is warned about this destructive, irreversible replacement
  before/while importing.
- Success/error feedback is shown inline (auto-dismissing on success).

---

## 5. Cross-Cutting Requirements

### 5.1 Validation
- Savings source name: required, 2–100 characters.
- Expense name: required, 1–100 characters.
- Expense amount: required, positive number.
- Financial record values: required per source, ≥ 0.
- Inline validation errors shown next to the offending field, not just on
  submit.

### 5.2 Confirmations & Feedback
- Destructive actions (delete savings source, delete financial record,
  delete expense) require an explicit confirmation dialog before
  proceeding.
- Successful create/update/delete actions should show non-disruptive
  success feedback (e.g., toast/inline banner). Note: in the current
  implementation this is inconsistently applied — see the per-story notes
  above for what's missing.

### 5.3 Navigation / Information Architecture
Top-level sections, all reachable from persistent navigation:
1. Dashboard (default landing page)
2. Savings Sources
3. Financial Records (list → detail → edit; separate create flow)
4. Analysis & Reports
5. Import / Export

Financial record URLs are addressable by id (detail and edit are distinct
views/routes from the create flow). A not-found view handles unknown routes.

### 5.4 Responsive Design
- Distinct desktop and mobile layouts for every screen; tables become
  card lists on narrow viewports.
- Mobile navigation collapses into a hamburger/overlay menu.
- Minimum touch target size ~44×44px; forms and dialogs go full-screen on
  mobile.

### 5.5 Accessibility
- Sufficient color contrast; color is never the sole indicator (e.g.,
  +/- signs accompany color coding for gains/losses).
- Keyboard navigability and visible focus states for interactive elements.
- Descriptive labels (e.g., `aria-label`) on icon-only action buttons.

### 5.6 Data Persistence
- Current implementation: all data stored in the browser's local storage,
  scoped to one device/browser, with no backend or sync. A rebuild on a
  different stack should treat this as the baseline (single-user, offline
  data) unless multi-device/server persistence is explicitly a new goal.
- Seed data: on first run, the "NA" savings source is created automatically
  so the app is immediately usable.

---

## 6. Implementation Status Summary

(as observed in the current codebase; useful for prioritizing a rebuild)

| Area | Status |
|---|---|
| Savings sources: create, list, update, delete (incl. NA handling) | Implemented |
| Financial records: create, list, view detail, update | Implemented |
| Financial records: delete | Not implemented (data layer supports it; no UI) |
| Expenses: add, view, edit, delete | Implemented |
| Dashboard / financial summary | Not implemented (placeholder page) |
| Analysis & Reports (charts/trends) | Not implemented (placeholder page) |
| Import / Export | Implemented |
| Success/confirmation toasts on mutations | Partially implemented — missing on most create/update/delete actions across savings sources, financial records, and expenses |
| Currency & date formatting (COP, es-CO locale) | Implemented |
