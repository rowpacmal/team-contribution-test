# Test plan: contribution rules

What we try on this repo before presenting CONTRIBUTING.md to the team. Update the status and findings as we go.

Status: ⬜ not tested · ✅ works as written · ⚠️ works, rule changed · ❌ broken

## Setup (PRs #1–#3)

| Item | Status | Notes |
|---|---|---|
| Audit of the proposal; contradictions fixed | ✅ | PR #1. Parts merged into `CONTRIBUTING.md` |
| Repo settings: squash-only, PR title default, auto-delete, Actions can create PRs | ✅ | Applied via API |
| Title check, template, CODEOWNERS, release-please, pre-release workflow | ⬜ | PR #2 |
| `AGENTS.md`, `CLAUDE.md` → `@AGENTS.md`, skills | ⬜ | PR #3 |
| Branch protection / CODEOWNERS enforcement | ❌ | Needs a public repo (or Pro). Decide whether to make this repo public |

## Part 1 — Titles

| Test | Status | Notes |
|---|---|---|
| Valid title passes | ⬜ | |
| Wrong type / capitalized subject / trailing period fails | ⬜ | |
| `type/N-slug` branch without `OP#N` in title fails | ⬜ | |
| Editing the title re-runs the check | ⬜ | |
| GitHub revert button → title fails → rename per Part 1 passes | ⬜ | |
| Squash commit on `main` equals PR title + `(#PR)`, empty body | ⬜ | |

## Part 2 — Branches and flow

| Test | Status | Notes |
|---|---|---|
| Branch auto-deleted after merge | ⬜ | |
| "Update branch" on a stale PR | ⬜ | |
| Hotfix via `release/x.y.x` + release-please on that branch | ⬜ | Needs a release first |

## Part 3 — PRs and reviews

| Test | Status | Notes |
|---|---|---|
| Template fills new PRs | ⬜ | |
| CODEOWNERS auto-requests review on `.github/` changes | ⬜ | Solo repo: author is the owner, so it may not show |
| Claude Code GitHub Action review (safety setup) | ⬜ | Needs an API key secret |

## Part 4 — Releases

| Test | Status | Notes |
|---|---|---|
| Only `docs`/`chore` merged → no release PR | ⬜ | |
| `feat` merged → release PR `chore(main): release 0.1.0`, section "Added" | ⬜ | |
| `fix` → patch, "Fixed" | ⬜ | |
| `feat!:` below 1.0 → minor, not 1.0.0 | ⬜ | Checks `bump-minor-pre-major` |
| Release PR passes the title check | ⬜ | With `GITHUB_TOKEN` checks won't run on it at all |
| `BEGIN_COMMIT_OVERRIDE` in PR body, edited after merge | ⬜ | |
| Merging release PR → tag + GitHub Release with same notes | ⬜ | |
| Pre-release button → `vX.Y.Z-dev.1`, then `-dev.2` | ⬜ | |
| Pre-release with no release PR → next patch from manifest | ⬜ | |

## Findings

Add one line per finding: what happened, what changed (PR link).
