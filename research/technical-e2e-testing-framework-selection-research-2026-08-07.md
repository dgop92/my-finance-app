---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ['research/technical-react-spa-modernization-research-2026-08-07.md']
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'E2E / real-browser test automation framework selection for my-finance-app'
research_goals: 'Determine which current (2026) end-to-end / real-browser test automation framework and supporting libraries best fit my-finance-app — a solo-maintained, local-first React + Vite SPA with zero existing test coverage. The user has explicitly decided against unit/mocked tests (e.g. Vitest + jsdom component tests) in favor of E2E tests that run in a real browser. Research only — no installs or code changes.'
date: '2026-08-07'
web_research_enabled: true
source_verification: true
---

# Research Report: technical

**Date:** 2026-08-07
**Research Type:** technical

---

## Research Overview

This research follows up on `research/technical-react-spa-modernization-research-2026-08-07.md`, which recommended a Vitest + React Testing Library (jsdom, mocked) baseline before a planned Tailwind v4 migration. Having decided against unit/mocked-DOM testing in favor of E2E tests that run in a real browser, this research investigates which current (August 2026) E2E/browser-automation framework and supporting tooling best fit `my-finance-app` — a solo-maintained, local-first React 18 + Vite SPA with zero existing test coverage, no backend, and no CI pipeline.

The investigation covered the E2E tooling landscape (Playwright vs. Cypress vs. legacy alternatives), how a test runner integrates with this app's specific surfaces (its Vite dev server and its file-based import/export feature — the app's only real I/O boundary), how to structure the test suite itself (fixtures vs. Page Object Model, folder layout relative to the existing `src/features/` structure), and a practical, solo-developer-appropriate adoption path (bootstrap → first tests → optional CI later).

**Bottom line: Playwright.** It is the 2026-default recommendation for new E2E projects — true multi-browser coverage, free built-in parallel sharding, and higher developer satisfaction than Cypress (91% vs. 72% per State of JS 2025) — and it maps unusually well onto this specific app's architecture: its browser-context isolation and `addInitScript`/WebStorage seeding API line up directly with the app's existing local-storage repository pattern, letting tests seed realistic financial data without a mock API layer. See the Executive Summary and full findings below.

---

<!-- Content will be appended sequentially through research workflow steps -->

## Technical Research Scope Confirmation

**Research Topic:** E2E / real-browser test automation framework selection for my-finance-app
**Research Goals:** Determine which current (2026) end-to-end / real-browser test automation framework and supporting libraries best fit my-finance-app — a solo-maintained, local-first React + Vite SPA with zero existing test coverage. The user has explicitly decided against unit/mocked tests in favor of E2E tests that run in a real browser. Research only — no installs or code changes.

**Technical Research Scope:**

- Architecture Analysis - E2E runner integration with Vite SPAs
- Implementation Approaches - patterns suited to local-storage-only state, no backend to mock
- Technology Stack - Playwright vs Cypress vs alternatives, 2026-current state
- Integration Patterns - test data/state seeding without an API layer
- Performance Considerations - speed, flakiness, solo-dev-friendly workflows

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-08-07

---

## Technology Stack Analysis

### E2E Test Runners: Playwright vs Cypress vs Alternatives

Playwright is the 2026-default recommendation for new E2E projects: it runs out-of-process (protocol-level control of Chromium, Firefox, and WebKit), gives true multi-browser coverage rather than Chromium-only, includes free built-in parallel sharding, and has overtaken Cypress on both downloads and developer satisfaction (State of JS 2025 recorded 91% satisfaction for Playwright vs. 72% for Cypress). Cypress still has an edge in in-browser, real-time debugging UX and remains a fine choice for a JS/TS-only, single-origin SPA team that values that workflow, but its free-tier parallelization story is worse (Cypress Cloud is a paid product; Playwright's sharding is free and built in).

For `my-finance-app` specifically — solo developer, single-origin local-first SPA, no CI pipeline today — the deciding factors are less about scale (neither tool's parallelization ceiling matters yet) and more about longevity/momentum and multi-browser coverage, both of which favor Playwright.

_Verdict: **Playwright is the recommended E2E runner.** Cypress remains a credible second choice if in-browser visual debugging during development is prioritized over cross-browser coverage, but there's no ecosystem-momentum reason to pick it over Playwright for a project starting from zero in 2026._
_Source: [Cypress vs Playwright in 2026](https://bugbug.io/blog/test-automation-tools/cypress-vs-playwright/), [E2E Testing in 2026: Pick the Right Tool](https://bugbug.io/blog/test-automation/end-to-end-testing/), [Playwright vs Cypress vs Selenium 2026](https://tech-insider.org/playwright-vs-cypress-vs-selenium-2026/)_

### Legacy/Niche Alternatives: WebdriverIO, TestCafe, Selenium

WebdriverIO (v9.x) remains actively maintained, now with full WebDriver BiDi support, and is a reasonable choice if standards-based WebDriver protocol testing or native mobile (Appium) coverage is a hard requirement — neither applies here. TestCafe's release cadence has slowed and its community is smaller than Cypress or Playwright's. Selenium remains the most widely used framework overall (multi-language teams, legacy enterprise suites) but is not the tool new JS/TS-only projects reach for in 2026.

_Verdict: **None of these are a better fit than Playwright for this project.** They're relevant only if a future requirement (native mobile app, non-JS polyglot team, strict WebDriver-standard compliance) emerges — none of which apply to `my-finance-app` today._
_Source: [WebdriverIO Alternatives 2026](https://scanlyapp.com/blog/webdriverio-alternatives-2026), [TestCafe Alternatives](https://bugbug.io/blog/test-automation-tools/testcafe-alternatives/), [Selenium Alternatives 2026](https://quashbugs.com/blog/selenium-alternatives-2026)_

### Where "Real Browser" Testing Meets Component-Level Testing

The 2026 ecosystem draws a hard line between three layers: (1) unit/component tests in a simulated DOM (Vitest + jsdom + React Testing Library) — explicitly out of scope per your stated preference; (2) **Playwright Component Testing** (still experimental), which mounts individual React components inside a real browser without the full app/routing/storage stack around them — useful for interaction-heavy, isolated components; (3) full E2E tests (Playwright/Cypress) that load the real app in a real browser end-to-end, including routing, local storage, and the full component tree.

Since the goal is "E2E tests or automated tests with a real browser" and explicitly not mocked/simulated-DOM tests, layer (3) is the primary target. Playwright Component Testing (layer 2) is a legitimate secondary option later if there's a need to browser-test an isolated, complex component (e.g., a chart or form) without spinning up full app navigation — but it's optional, not a starting requirement.

_Verdict: **Full Playwright E2E tests are the core recommendation.** Playwright Component Testing is a worthwhile future addition, not a starting point — begin with full-app E2E flows since the app is small enough that "real browser, real app" coverage is achievable without a separate component-testing layer._
_Source: [Component Testing in 2026: Vitest, RTL, Storybook, Playwright](https://dualite.dev/blogs/component-tests-guide), [Playwright Component Testing in Large Frontend Codebases](https://currents.dev/posts/playwright-component-testing), [BrowserStack: Vitest vs Playwright](https://www.browserstack.com/guide/vitest-vs-playwright)_

### Visual Regression (Optional Layer)

Playwright ships a built-in `toHaveScreenshot()` assertion (pixel-diffing via `pixelmatch`) with no third-party dependency or subscription — appropriate for a solo/no-budget project. It supports masking volatile regions (timestamps, balances) before comparison, which is directly relevant to a finance app whose numbers change between runs. BackstopJS is the strongest free/open-source dedicated alternative if a standalone visual-diffing tool is ever wanted; paid AI-diffing platforms (Percy, Applitools, Chromatic) target team workflows and aren't warranted for a solo project.

_Verdict: **Use Playwright's built-in screenshot assertions if/when visual regression is wanted — no separate tool needed.** This is an optional layer to add after core E2E flows exist, not a day-one requirement._
_Source: [Playwright Visual Regression: Baselines, Flake & CI Guide 2026](https://testquality.com/playwright-visual-regression-guide/), [Best Visual Regression Testing Tools for 2026](https://bug0.com/knowledge-base/visual-regression-testing-tools)_

### Test Isolation and State Seeding (Local-Storage-Only App)

This is the most project-specific technical finding. Playwright isolates each test in its own browser context, meaning local storage, cookies, and session storage do **not** leak between tests by default — a direct fit for this app's local-storage-only persistence model (see prior research: `local-storage.memory.ts` repository). Rather than driving the UI to set up preconditions (e.g., clicking through forms to create financial records before every test), Playwright supports seeding state directly via `addInitScript()` to inject `localStorage` values before the page loads, and (in recent Playwright releases, post-v1.57) a first-class WebStorage API (`page.localStorage`/`page.sessionStorage`) for reading/writing storage directly. This means test setup for `my-finance-app` can bypass the UI entirely for state seeding — inject a known set of financial records into `localStorage` at the start of a test, then assert against the UI that renders them.

_Verdict: **This is a strong architectural fit, not just a viable option.** Because the app already funnels all persistence through a repository abstraction backed by `localStorage`, Playwright's `addInitScript`/WebStorage seeding pattern maps almost directly onto that existing seam — tests can seed realistic financial data without needing a mock API layer (which this app doesn't have anyway) or slow UI-driven setup for every test._
_Source: [Cookies and localStorage Manipulation in Playwright](https://scrolltest.com/playwright-cookies-localstorage-manipulation/), [Mastering Test Isolation & Context Management in Playwright](https://baraniramachandran255.medium.com/mastering-test-isolation-context-management-in-playwright-c753b1c6be65), [Playwright Browser Contexts (Isolation)](https://playwright.dev/docs/browser-contexts)_

### Summary Table

| Tool/Layer | Recommendation | Notes |
|---|---|---|
| E2E test runner | **Playwright** | 2026-default; multi-browser; free parallel sharding; higher developer satisfaction than Cypress |
| Alternative E2E runner | Cypress (optional) | Only if in-browser debugging UX outweighs cross-browser coverage |
| Legacy/niche runners | WebdriverIO, TestCafe, Selenium | Not recommended — no requirement (native mobile, polyglot team, WebDriver-standard) applies here |
| Component-in-browser testing | Playwright Component Testing (future) | Experimental; optional layer for isolated, interaction-heavy components later |
| Visual regression | Playwright `toHaveScreenshot()` (optional) | Built-in, free, no subscription; mask volatile financial figures |
| State seeding | Playwright `addInitScript`/WebStorage API | Fits the existing repository/local-storage architecture directly |

---

## Integration Patterns Analysis

**Scope note:** The generic checklist for this step (REST/GraphQL/gRPC APIs, message brokers, microservices, event-driven/CQRS, OAuth) doesn't apply — as the prior research established, `my-finance-app` has no backend and no remote API today. For an E2E-testing research pass, "integration" is reframed around how the test runner integrates with this specific app: the local dev server, the app's one real external-interaction surface (file-based import/export), and — forward-looking — how E2E tooling would integrate with a backend if one is ever added.

### Test Runner ↔ Dev Server Integration

Playwright's `webServer` config option launches the app's own dev server (`npm run dev`) before running tests and tears it down after, with `reuseExistingServer: !process.env.CI` so a developer's already-running Vite dev server is reused locally (fast iteration) while a fresh server is always started in CI. This requires no special Vite plugin or adapter — Playwright drives the app the same way a user's browser would, over `http://localhost:<port>`, so `my-finance-app`'s existing `npm run dev` script is the entire integration surface needed.

_Verdict: **Zero-friction integration.** No CI exists yet for this project, and none is required to start writing/running E2E tests locally — `reuseExistingServer` makes local iteration fast, and the same config will work unchanged if CI is added later._
_Source: [Playwright Web Server docs](https://playwright.dev/docs/test-webserver), [Setup a local dev server for Playwright tests](https://www.skptricks.com/2025/05/setup-local-dev-server-for-your-playwright-tests.html)_

### The App's Real Integration Surface: File-Based Import/Export

As the prior research noted, the one genuine data-interchange boundary in this app is the import/export feature (`src/features/core/pages/import-export/`). Playwright has first-class, well-documented support for exactly this: `setInputFiles()` sets files on an `<input type="file">` (or via the file-chooser event for custom-styled upload buttons) without needing real OS file-picker interaction, and `page.waitForEvent('download')` + `download.saveAs()` captures export downloads to a known path so the test can assert on the exported file's name and contents. This maps directly onto testing "import a file → verify records appear" and "export → verify the downloaded file's contents" as real, no-mocking-required E2E flows.

_Verdict: **Directly testable today with core Playwright APIs, no plugins needed.** This is the single most valuable E2E test to write first, since it's the app's only real I/O boundary and was called out in the prior research as needing continued stability._
_Source: [Playwright File Upload Testing Guide 2026](https://qaskills.sh/blog/playwright-file-upload-testing-guide-2026), [Playwright File Download Testing Guide 2026](https://qaskills.sh/blog/playwright-file-download-testing-guide-2026)_

### Forward-Looking: If a Backend Is Ever Added

Should `my-finance-app` later add sync/backup via a real API (as the prior research flagged as a possible future direction), Playwright supports request interception and mocking (`page.route()`) for isolating E2E tests from network flakiness, plus real end-to-end runs against a live backend when full-stack verification is wanted. No architectural rework of the E2E suite would be needed — the same Playwright setup extends to cover network-dependent flows once/if they exist. No action needed now.

_Verdict: **Not applicable today; no forward action required.** Noted only for completeness since the prior research left the door open to a future backend._

---

## Architectural Patterns and Design

**Scope note:** The generic checklist (microservices/monolith, distributed systems, cloud-native scaling, security architecture) doesn't map onto designing an E2E test suite. This step is reframed around how to *structure the test suite itself*: fixtures vs. Page Object Model, folder layout, and how the test suite should relate to this project's existing feature-based `src/features/<feature>/` structure.

### Fixtures vs. Page Object Model (POM)

2026 guidance has shifted from "always use POM" toward composable **fixtures** as the primary organizing pattern: Playwright's `test.extend()` fixtures give reusable setup/teardown and separation of concerns without class-hierarchy ceremony, and the recommended practice is to build fixtures around *business actions* (e.g., "a page with three seeded financial records") rather than raw Playwright calls. POM still earns its place for small-to-medium apps (4–5 pages, which matches `my-finance-app`'s current route count: Dashboard, Saving Source, Financial Records, Analysis, Import/Export) as the place to put page-specific selectors and interactions, so they're updated in one place when the UI changes. The 2026-recommended pattern for a project this size is to combine both: fixtures for setup/data-seeding (via `base.extend`), POM classes for per-page interaction logic.

_Verdict: **Use fixtures for state/setup, thin Page Objects for per-route interactions.** This matches the app's small route count and avoids over-engineering a class hierarchy for a 5-page SPA._
_Source: [Page Object Model in Playwright: 2026 Guide](https://www.browserstack.com/guide/page-object-model-with-playwright), [Building Scalable Tests with Fixtures and POM](https://kailash-pathak.medium.com/building-scalable-playwright-tests-with-fixtures-and-page-object-model-f505504dde9a), [Playwright Fixtures Guide](https://testomat.io/blog/what-is-the-use-of-fixtures-in-playwright/)_

### Test Suite Folder Structure vs. Existing Feature-Based Architecture

The 2026-standard Playwright layout keeps E2E tests in a dedicated root-level directory (commonly `e2e/` or `tests/e2e/`) — **separate from** `src/`, not colocated inside `src/features/`. This is a natural fit for `my-finance-app`'s existing `src/features/<feature>/{pages,components,hooks,repositories,entities}` structure (documented in the prior research): the app code stays organized by feature under `src/`, while the parallel test suite mirrors those same feature boundaries one level up — e.g. `e2e/financial-records/`, `e2e/import-export/`, `e2e/analytics/` — with shared `e2e/pages/` (Page Objects), `e2e/fixtures/` (data-seeding fixtures using the `addInitScript`/WebStorage pattern from the Technology Stack section above), and `e2e/utils/` for shared helpers.

_Verdict: **Mirror the existing feature-based structure at the top level, don't colocate tests inside `src/features/`.** This keeps the pattern the codebase already uses (features never cross-import) consistent in the test suite, and matches 2026 convention for Playwright projects generally._
_Source: [Organizing Playwright Tests Effectively](https://dev.to/playwright/organizing-playwright-tests-effectively-2hi0), [Ways to Organize End-to-End Tests](https://adequatica.medium.com/ways-to-organize-end-to-end-tests-76439c2fdebb)_

### Suite-Level Design Principles for This App

- **Isolation by default, seed via storage, not UI clicks.** Each spec should seed its own `localStorage` state via `addInitScript` (Technology Stack section) rather than depending on execution order or UI-driven setup — this avoids the flaky, order-dependent suites that plague E2E testing generally.
- **Test business flows, not implementation details.** Given the app's actual surfaces (create/edit financial records, saving sources, analysis views, import/export), tests should assert on user-visible outcomes (a record appears in a list, an export file contains expected rows) rather than internal state.
- **No CI-first design required yet.** Because there's no CI pipeline today, the suite can be designed purely for fast local `npx playwright test` runs (headed or headless) using `webServer` + `reuseExistingServer`; CI wiring (GitHub Actions, etc.) is a separate, later concern that requires no suite redesign when added.

_Verdict: **These three principles are sufficient architecture for a solo-maintained, 5-route SPA** — no more elaborate suite architecture (custom reporters, distributed runners, test-data services) is warranted at this project's current size._

---

## Implementation Approaches and Technology Adoption

**Scope note:** The generic checklist (vendor evaluation, incident response, cost/resource management for teams) assumes team-operated production infrastructure. This project is solo-maintained with no CI today (confirmed in the prior research: no `.github/`, no deploy config). This step is reframed around the practical steps to get a Playwright suite running for a solo developer, and how it can grow into CI later without rework.

### Getting Started

`npm init playwright@latest` is the standard 2026 entry point: it installs Playwright, scaffolds `playwright.config.ts`, an example test, downloads the Chromium/Firefox/WebKit binaries, sets `.gitignore` entries, and — via an interactive prompt — optionally scaffolds a GitHub Actions workflow. Requirements are just Node 18+/npm 9+, which this project already has (per the prior research's Vite/TypeScript stack). Built-in tooling relevant to a solo developer: **UI Mode** (visual, watch-mode test runner with time-travel debugging) and the **Trace Viewer** (post-run inspection of every action, network call, and DOM snapshot) — both included at no cost, no separate purchase.

_Verdict: **Trivial to bootstrap — a single scaffolding command**, and the built-in UI Mode/Trace Viewer give a solo developer strong debugging ergonomics without needing Cypress's in-browser UI advantage._
_Source: [How to Install Playwright in 2026](https://www.browserstack.com/guide/playwright-install), [Playwright Tutorial 2026](https://autify.com/blog/playwright-tutorial)_

### Adoption Sequencing (Incremental, Matching the Prior Research's Approach)

Consistent with the prior research's "incremental, not big-bang" philosophy for library upgrades, the recommended sequence for introducing E2E testing is:

1. Scaffold Playwright (`npm init playwright@latest`), decline the GitHub Actions prompt for now (no CI exists yet — add it once the suite is worth automating).
2. Write the first spec against the highest-value, most stable flow: **import/export** (the app's real I/O boundary, identified in Integration Patterns above).
3. Add a `localStorage`-seeding fixture (per Technology Stack/Architectural Patterns above) and cover the next-highest-value flow: creating/editing a financial record.
4. Expand feature-by-feature (`e2e/financial-records/`, `e2e/analytics/`, etc.), matching `src/features/`.
5. Once the suite has real value to protect, add the GitHub Actions workflow (`npx playwright test` in CI) — this is an additive step, not a redesign, because the suite was already built around `webServer`/`reuseExistingServer`.

_Verdict: **Start local-only, add CI later.** This avoids over-investing in automation infrastructure before there's a suite worth protecting — directly consistent with the "small, sequential, revertible steps" adoption strategy the prior research recommended for library upgrades._

### CI Option (When Ready, Not Required Now)

When CI is eventually wanted, GitHub Actions is the natural fit given the repo is presumably GitHub-hosted: public repos get unlimited Actions minutes; private repos get 2,000 free minutes/month, comfortably enough for a solo project's suite. The Playwright CLI can generate the workflow file directly (`.github/workflows/playwright.yml`), and a small suite typically completes in a few minutes; caching browser binaries keeps runs fast as the suite grows. `actions/upload-artifact` preserves HTML reports, traces, and screenshots on failure for debugging.

_Verdict: **No action needed now** — this is documented for when the suite is mature enough to warrant automated runs, not a day-one requirement._
_Source: [Playwright CI on GitHub Actions: Complete 2026 Guide](https://qaskills.sh/blog/playwright-ci-github-actions-complete-guide-2026), [Playwright on GitHub Actions: the setup that actually runs fast](https://endform.dev/blog/playwright-github-actions)_

### Skill Development Requirements

Playwright's API (locators, `expect` assertions, fixtures) is close enough to Vitest/Jest-style testing syntax that no major learning curve is expected beyond browser-automation-specific concepts (auto-waiting, browser contexts, trace debugging) — consistent with the prior research's finding that this project requires no new architectural paradigm to adopt current 2026 tooling.

### Success Metrics

Given the solo/pre-production context, success is: the import/export flow and core financial-record CRUD flow are covered by passing E2E specs; `npx playwright test` runs green locally before any risky refactor (e.g., the Tailwind v4 migration flagged in the prior research); and, once CI is added, the workflow passes on every push.

## Technical Research Recommendations

### Implementation Roadmap

1. `npm init playwright@latest` — scaffold the suite, no GitHub Actions yet.
2. Write the import/export E2E test first (highest-value, most stable, no mocking needed).
3. Add a `localStorage`-seeding fixture; cover financial-record create/edit/delete flows.
4. Expand test coverage feature-by-feature, mirroring `src/features/` in a top-level `e2e/` directory.
5. Use fixtures for setup, thin Page Objects for per-route interactions — no premature suite-architecture investment.
6. Defer: Playwright Component Testing (still experimental), visual regression (`toHaveScreenshot()`, add once core flows are stable), and CI wiring (add once the suite has real value to protect).

### Technology Stack Recommendations

**Playwright** is the recommended E2E framework — no other tool (Cypress, WebdriverIO, TestCafe, Selenium) offers a better fit for this project's profile (solo dev, single-origin SPA, local-storage-only persistence, no existing test infrastructure). This directly satisfies the stated goal of "E2E tests or automated tests with a real browser" while avoiding the unit/mocked-DOM approach (Vitest + jsdom) the prior research had assumed.

### Skill Development Requirements

None beyond standard Playwright onboarding (a few hours with the official docs/UI Mode) — no new architectural paradigm required, consistent with the prior research's overall "small, incremental" framing for this project.

### Success Metrics and KPIs

`npx playwright test` passes locally for the import/export and financial-record flows; test suite green before/after any major refactor (e.g., the pending Tailwind v4 migration); CI wiring (optional, later) passes on push once added.

**Technical research phases completed:**

- Step 1: Research scope confirmation
- Step 2: Technology stack analysis
- Step 3: Integration patterns analysis
- Step 4: Architectural patterns analysis
- Step 5: Implementation research (current step)

---

# E2E / Real-Browser Testing Framework Selection for my-finance-app

## Executive Summary

`my-finance-app` has no tests today, and the decision has been made to close that gap with E2E tests running in a real browser rather than unit tests against a simulated DOM. That's a well-supported choice in the current ecosystem: Playwright, the 2026-default E2E framework, doesn't just satisfy "real browser" — it maps unusually cleanly onto this specific app's shape. The app has no backend (all state lives in `localStorage` behind a repository abstraction) and exactly one real external-interaction surface (file-based import/export). Playwright's browser-context isolation and `addInitScript`/WebStorage seeding API let tests inject known financial data directly into `localStorage` before each test runs, bypassing slow UI-driven setup entirely, and its `setInputFiles()`/`download.saveAs()` APIs test the import/export flow end-to-end with no mocking required.

Cypress remains a credible second choice — better in-browser debugging UX, still fine for a single-origin JS/TS app — but has no clear advantage for a solo developer starting from zero in 2026, and trails Playwright on cross-browser coverage, free parallelization, and ecosystem momentum (91% vs. 72% developer satisfaction per State of JS 2025). WebdriverIO, TestCafe, and Selenium don't fit any requirement this project actually has (native mobile, polyglot teams, WebDriver-standard compliance).

The recommended path is deliberately incremental, mirroring the "small, sequential, revertible steps" philosophy the prior modernization research established for library upgrades: bootstrap Playwright with a single command, write the import/export test first (highest value, most stable, zero mocking needed), add a `localStorage`-seeding fixture and cover core financial-record CRUD flows, then expand feature-by-feature in a top-level `e2e/` directory that mirrors the app's existing `src/features/` structure. CI (GitHub Actions) is deferred until the suite has real value worth automating — not a day-one requirement. This suite would also directly de-risk the Tailwind v4 + shadcn/ui migration the prior research flagged as this project's one genuine refactor candidate.

**Key Findings:**

- Playwright is the clear 2026 recommendation: multi-browser, free parallel sharding, higher developer satisfaction than Cypress.
- The app's local-storage-only, no-backend architecture is an unusually good fit for Playwright's context isolation and storage-seeding APIs — tests can seed data without a mock API layer.
- The app's only real integration surface (file-based import/export) is directly testable with Playwright's built-in file upload/download APIs, no plugins needed.
- Fixtures (for setup/seeding) + thin Page Objects (for per-route interactions) is the right-sized suite architecture for a 5-route SPA — no heavier framework or infra is warranted.
- No CI exists today and none is needed to start; Playwright's `webServer`/`reuseExistingServer` config supports pure local iteration, with GitHub Actions as a drop-in addition later.

**Recommendations:**

1. Adopt **Playwright** as the E2E framework — `npm init playwright@latest` to bootstrap.
2. Write the import/export E2E test first, then a `localStorage`-seeding fixture plus core financial-record CRUD coverage.
3. Structure the suite as a top-level `e2e/` directory mirroring `src/features/`, using fixtures for setup and thin Page Objects for interactions.
4. Defer CI (GitHub Actions), visual regression (`toHaveScreenshot()`), and Playwright Component Testing until the core E2E suite is stable — none are required to start.
5. Use this suite to de-risk the Tailwind v4/shadcn migration identified in the prior modernization research before undertaking it.

## Table of Contents

1. [Technology Stack Analysis](#technology-stack-analysis) — Playwright vs. Cypress vs. alternatives, component-in-browser testing, visual regression, state seeding
2. [Integration Patterns Analysis](#integration-patterns-analysis) — dev server integration, file-based import/export testing, forward-looking backend notes
3. [Architectural Patterns and Design](#architectural-patterns-and-design) — fixtures vs. Page Object Model, folder structure vs. existing feature-based architecture
4. [Implementation Approaches and Technology Adoption](#implementation-approaches-and-technology-adoption) — getting started, adoption sequencing, CI options, roadmap
5. Research Conclusion (below)

*(Full detail for each section is in the corresponding section above, complete with source citations per finding.)*

## Technical Research Conclusion

### Summary of Key Technical Findings

Playwright is the right E2E framework for `my-finance-app`, not just because it's the 2026-default choice generally, but because its specific technical mechanisms (context-scoped isolation, direct storage seeding, native file upload/download handling) line up with this app's specific architecture (local-storage-only persistence, no backend, a file-based import/export boundary) more directly than any competing tool's marketed advantages would matter here.

### Strategic Technical Impact Assessment

Closing the zero-test-coverage gap with E2E tests (rather than unit tests) is a reasonable trade for a small, solo-maintained SPA: it directly exercises user-visible behavior across the app's actual routes and its one real I/O surface, without requiring a mocking layer this app doesn't otherwise need. The main risk of an E2E-only strategy — slower, potentially flakier tests than unit tests — is mitigated here by the app's small size (5 routes) and by seeding state directly via storage APIs instead of driving the UI for setup.

### Next Steps Technical Recommendations

Per the original request, no installs or code changes were made — this document is research only. Suggested next steps, in order: (1) confirm this recommendation, (2) if approved, run `npm init playwright@latest`, (3) write the import/export E2E test as the first spec, (4) add the `localStorage`-seeding fixture and financial-record CRUD coverage, (5) expand feature-by-feature before touching the Tailwind v4/shadcn migration from the prior research.

---

**Technical Research Completion Date:** 2026-08-08
**Research Period:** Current ecosystem state as of August 2026
**Source Verification:** All framework/tooling claims cited to official docs, 2026 comparison guides, and developer-survey data (State of JS 2025)
**Technical Confidence Level:** High for framework-selection and tooling-capability claims (official docs, multiply-corroborated 2026 sources); Medium for CI-cost specifics (GitHub Actions pricing subject to change)

_This document is a research artifact only — no dependencies were installed and no code was changed as part of this work._
