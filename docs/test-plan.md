# Test plan: contribution rules

What we try on this repo before presenting CONTRIBUTING.md to the team. Update the status and findings as we go.

Status: ⬜ not tested · ✅ works as written · ⚠️ works, rule changed · ❌ broken

## Setup

| Item                                                                              | Status | Notes                                                                                       |
| --------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| Audit of the proposal; contradictions fixed                                       | ✅     | PR #1. Parts merged into `CONTRIBUTING.md`                                                  |
| Repo settings: squash-only, PR title default, auto-delete, Actions can create PRs | ✅     | Applied via API                                                                             |
| Title check, template, CODEOWNERS, release-please, pre-release workflow           | ✅     | PR #2, merged                                                                               |
| `AGENTS.md`, `CLAUDE.md` → `@AGENTS.md`, skills                                   | ✅     | PR #3, merged                                                                               |
| Lint/format CI, dummy code, Claude format hook                                    | ✅     | PR #4, merged                                                                               |
| Branch protection / CODEOWNERS enforcement                                        | ❌     | Skipped: needs public repo or Pro; nice-to-have (Part 3). Claude hook guards `main` instead |
| Claude hook blocks commit/merge/push on `main` and hand-made tags                 | ✅     | PR #5. Local tests: 13 block/allow cases; check live after merge                            |

## Part 1 — Titles

| Test                                                          | Status | Notes                                                    |
| ------------------------------------------------------------- | ------ | -------------------------------------------------------- |
| Valid title passes                                            | ✅     | PR #2                                                    |
| Wrong type / capitalized subject / trailing period fails      | ✅     | Capitalized + period tested on PR #2; wrong type not yet |
| `type/N-slug` branch without `OP#N` in title fails            | ⬜     |                                                          |
| Editing the title re-runs the check                           | ✅     | PR #2                                                    |
| GitHub revert button → title fails → rename per Part 1 passes | ⬜     |                                                          |
| Squash commit on `main` equals PR title + `(#PR)`, empty body | ✅     | PRs #1–#3                                                |

## Part 2 — Branches and flow

| Test                                                       | Status | Notes                                          |
| ---------------------------------------------------------- | ------ | ---------------------------------------------- |
| Branch auto-deleted after merge                            | ✅     | PRs #1–#3                                      |
| "Update branch" on a stale PR                              | ✅     | PRs #1, #3 after #2 merged; title check re-ran |
| Hotfix via `release/x.y.x` + release-please on that branch | ⬜     | Needs a release first                          |

## Part 3 — PRs and reviews

| Test                                                  | Status | Notes                                              |
| ----------------------------------------------------- | ------ | -------------------------------------------------- |
| Template fills new PRs                                | ⬜     |                                                    |
| CODEOWNERS auto-requests review on `.github/` changes | ⬜     | Solo repo: author is the owner, so it may not show |
| Claude Code GitHub Action review (safety setup)       | ⬜     | Needs an API key secret                            |

## Part 4 — Releases

| Test                                                                     | Status | Notes                                             |
| ------------------------------------------------------------------------ | ------ | ------------------------------------------------- |
| Only `docs`/`chore` merged → no release PR                               | ✅     | After PRs #1–#3                                   |
| `feat` merged → release PR `chore(main): release 0.1.0`, section "Added" | ⬜     |                                                   |
| `fix` → patch, "Fixed"                                                   | ⬜     |                                                   |
| `feat!:` below 1.0 → minor, not 1.0.0                                    | ⬜     | Checks `bump-minor-pre-major`                     |
| Release PR passes the title check                                        | ⬜     | With `GITHUB_TOKEN` checks won't run on it at all |
| `BEGIN_COMMIT_OVERRIDE` in PR body, edited after merge                   | ⬜     |                                                   |
| Merging release PR → tag + GitHub Release with same notes                | ⬜     |                                                   |
| Pre-release button → `vX.Y.Z-dev.1`, then `-dev.2`                       | ⬜     |                                                   |
| Pre-release with no release PR → next patch from manifest                | ⬜     |                                                   |

## Part 5 — Code style

| Test                                                                    | Status | Notes                                                                    |
| ----------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| `npm run check` (Prettier, ESLint, tsc) passes in CI                    | ✅     | PR #4                                                                    |
| Ruff lint + format, Python name check pass in CI                        | ✅     | PR #4                                                                    |
| ShellCheck on `*.sh` and `bin/*` passes in CI                           | ✅     | PR #4                                                                    |
| Bad TS/TSX/hook file names fail ESLint                                  | ✅     | Local: `formatBalance.ts`, `balance-card.tsx`, `use-thing.ts` all caught |
| Bad Python file name fails CI                                           | ✅     | PR #4, `CameraTool.py`                                                   |
| A lint/format error fails the PR                                        | ✅     | PR #4: Prettier, ESLint (`any`), Ruff F401, ShellCheck SC2086 all failed |
| Claude hook formats files after edit (TS via Prettier, Python via Ruff) | ✅     | Local run of the hook script; check in a real session                    |
| One-time format of existing files                                       | ✅     | PR #4 (docs only so far)                                                 |

## Part 6 — Shared repo

Later, once everything here is final.

## Out of scope for now

- OpenProject integration: tickets are handled manually, `OP#N` is a reference only.

## Findings

Add one line per finding: what happened, what changed (PR link).

- TypeScript 7 is out, but typescript-eslint 8.x supports only `<6.1`. Pinned TS 6.0.3. (PR #4)
- `unicorn/filename-case` (v78) also checks folder names by default, so `src/` failed the PascalCase rule for `.tsx`. Set `checkDirectories: false`. (PR #4)
- Ruff `N999` only checks files inside packages (with `__init__.py`); loose scripts like `CameraTool.py` pass. Added a CI name check, fixed Part 5 text. (PR #4)
- `jq` isn't installed everywhere; the format hook reads its input with Node (fallback Python). (PR #4)
- Prettier reformats Markdown tables in the docs: big one-time diff, as expected for the format PR. (PR #4)
- CI stopped each job at the first error, hiding the rest. Steps now run independently so a PR shows every problem at once. (PR #4)
- Plain ESLint config doesn't know Node globals; the hook imports `process` from `node:process` instead of adding a globals config. (PR #5)
