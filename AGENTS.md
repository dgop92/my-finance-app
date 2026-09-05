# My Finance App

A 100% client-side personal finance tracker (React + TypeScript + Vite). No backend, no auth — all data lives in `localStorage`.

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/` | Source Code |

## Documentation Hierarchy

```
/AGENTS.md   ← You are here (Repository Root, only AGENTS.md in this repo)
```

## Build and Test Commands

| Scope | Command |
|-------|---------|
| Install dependencies | `pnpm install` |
| Dev server | `pnpm run dev` |
| Build | `pnpm run build` (runs `tsc -b` then `vite build`) |
| Type-check only | `pnpm run check-ts` |
| Lint | `pnpm run lint` |
| Format | `pnpm run format` |

No test runner is configured yet. If/when tests are added: unit-test only business logic (utility functions, pure services, hook logic) — never UI components or pages; use e2e tests for critical user journeys (creating/listing/editing core records).

## Coding Conventions and Style

- **Language:** TypeScript (strict-ish via `tsc -b`), React 18 function components only.
- **File/folder naming:** kebab-case everywhere (`saving-source-list.tsx`, not `SavingSourceList.tsx`); layout components under `components/layout` are the one existing exception (PascalCase filenames) — don't extend that exception elsewhere.
- **Exports:** named exports over default exports.
- **Styling:** Tailwind utility classes only; no separate CSS files or inline `style` props. Use `clsx`/`tailwind-merge` (`cn` in `lib/utils.ts`) for conditional classes instead of ternaries in `className`.
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod`, validated against the entity's Zod schema.
- **Event handlers:** name with a `handle` prefix (`handleSubmit`, `handleClick`).
- **Early returns** over nested conditionals.
- **Accessibility:** interactive custom elements need keyboard support (`tabIndex`, `aria-label`, `onKeyDown`) alongside `onClick`, not click-only.
- **Tools:** ESLint (`typescript-eslint` + `react-hooks` + `react-refresh` plugins, double quotes enforced), Prettier for formatting.

## Architecture Rules

- Feature-sliced structure (`entities/ → repositories/ → services/ → pages/`) — don't collapse everything into one folder or put logic directly in `src/`.
- Every persisted entity gets a repository interface in `repositories/definitions/`, one class implementing it, and a singleton instance exported from that feature's `repository.factory.ts`. Components/hooks depend on the interface via the factory export, never on `localStorage` or a concrete class directly.
- No business logic in components or pages — data fetching/mutation goes through TanStack Query (`useQuery`/`useMutation`) inside per-page hooks (`pages/<page>/hooks/`); derivations/calculations go in `services/` as pure functions with no storage dependency, so they're unit-testable with plain data in/out.
- Input validation lives in Zod schemas colocated with the entity (`Create*InputSchema`, `Update*InputSchema`), which are the single source of truth for both the inferred TS type and runtime form validation.
- Routes are centralized as constants in `lib/paths.ts` and consumed via `react-router-dom`; don't hardcode path strings elsewhere.
- New shadcn components are added via `npx shadcn@latest add <component>`, not authored by hand in `components/ui/`.

## Security and Compliance

- No backend, no network calls, no auth — data stays local to the browser (`localStorage`). Don't introduce remote persistence or telemetry without explicit user request.
- Never hardcode secrets/API keys; none should be needed given the local-only architecture.
- Import (JSON restore) fully overwrites local data — validate the shape of any uploaded file before writing it to storage.
- NEVER install or modified libraries without user permission

## Quick Reference

| Task | Resource |
|------|----------|
| Add a UI primitive | `npx shadcn@latest add <component>` |
| Route constants | `src/lib/paths.ts` |

## Agent skills

### Issue tracker

Issues are tracked as GitHub Issues in this repo (`dgop92/my-finance-app`), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
