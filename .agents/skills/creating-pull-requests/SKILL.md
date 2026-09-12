---
name: creating-pull-requests
description: Drafts and opens a GitHub pull request for the current branch, following this repo's PR conventions (Summary/Related issue/Test plan body shape, honest test-plan checklist, Claude Code attribution footer). Use when the user explicitly asks to create a PR, open a pull request, or ship a branch. Do NOT use for running lint/test/build verification (assumed already done) or for deciding how to integrate a branch (merge vs PR vs keep) — that decision belongs to the user.
---

# Creating Pull Requests

Opens a GitHub PR for the current branch using this repo's house style. This
skill only drafts and opens the PR — it assumes verification (lint/test/e2e/build)
already happened this session per AGENTS.md, and does not re-run it.

## When NOT to use this

- The user hasn't decided how to integrate the branch yet (merge locally vs.
  PR vs. leave as-is) — that's their call, not this skill's.
- Verification hasn't been run this session — run it first, then come back.

## Steps

1. **Push the branch, no confirmation needed:**

   ```bash
   git push -u origin <current-branch>
   ```

   This skill is explicitly authorized to push without asking first — that's
   a deliberate exception to the general "confirm before push" rule, scoped
   to this skill only.

2. **Draft the PR body** following this exact shape:

   ```markdown
   ## Summary
   - <bullet per meaningful change, why not just what>

   Closes #<N>

   ## Test plan
   - [x] `pnpm run lint`
   - [ ] `pnpm run test:e2e`
   ...
   ```

   Rules for filling it in:
   - **Summary**: bullet points, focused on why, matching the tone of past
     PRs (`git log --merges` / `gh pr list --state merged` for reference).
   - **`Closes #N`**: include only when an issue number is obviously
     inferable (branch name, session context, explicit user mention).
     Otherwise omit the line entirely — do not ask the user for one and do
     not guess.
   - **Test plan**: list only checks that were *actually run this session*,
     checked or unchecked honestly based on their real outcome. Never mark
     a box `[x]` for a check that wasn't run. It's fine for this list to be
     shorter than the CI gate list if not everything was run.
   - **Attribution footer**: append it per the current system instructions
     for pull request descriptions (checked at the time this skill runs —
     do not hardcode a footer here, as the required text can change).

3. **Open the PR ready for review** (not draft):

   ```bash
   gh pr create --title "<title>" --body "$(cat <<'EOF'
   <drafted body>
   EOF
   )"
   ```

   Base branch defaults to `main` unless the user says otherwise.

4. **Report the PR URL** `gh pr create` prints back to the user.

## Notes

- `.github/PULL_REQUEST_TEMPLATE.md` exists for humans opening PRs through
  the GitHub UI. Its shape matches this skill's Test plan section (mapped to
  the 4 CI gates: lint, test, test:e2e, build) but this skill drafts the
  body directly rather than reading that file.
