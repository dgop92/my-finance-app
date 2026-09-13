# My Finance app

## Setup

To run this project, you'll need to have Node.js 20.0.0 installed on your machine

1. Clone this repository
2. Install the dependencies by running `npm install`
3. Start the development server by running `npm run dev`

## E2E tests

E2E tests use Playwright. Before running `pnpm run test:e2e` for the first time, install the browser binary and its OS-level dependencies:

```bash
pnpm exec playwright install chromium
npx playwright install-deps chromium
```

The `install-deps` step requires `sudo` and installs system packages (GTK/ATK/etc.), so it must be run manually by a human operator once per machine. Without it, tests can fail with an error like:

```
error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory
```

## Shadcn UI

This project uses Shadcn UI reusable components so we can speed up the development process for common UI elements.

To add a new component to the library, you can use their CLI:

```bash
npx shadcn@latest add <component_name>
```

Example:

```bash
npx shadcn@latest add button
```

## Tech stack

- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Router 6