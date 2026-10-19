# Part 2 — Branch Naming and Flow

**Ticket:** OP#690 — Define Contribution rules and code Style Guide
**Status:** Decided
**Scope:** Shared standard (all projects)

## Decision

We move to **trunk-based development**:

- `main` is the **only** long-lived branch.
- All work happens on short-lived branches off `main`, merged back by squash-merge after CI passes.
- Releases come from **tags on `main`**, not from a separate branch.
- The `dev` branch is retired.

## Why

Our current `feature → dev → main` flow has real pain points:

- `dev → main` is squash-merged, which makes the two branches drift apart and needs "Sync main into dev" merges.
- Commits land directly on `main` (version bumps, changelog edits), so `main` is not fully protected.
- Hotfixes have no clear path.
- Two branches to keep in step, for a small team.

Trunk-based removes the root cause: with one long-lived branch, there is nothing to drift. It is also the best fit for AI-assisted work (many small PRs) and for release tools like release-please, which assume one main branch.

## Branch naming

```
type/N-short-slug
```

- `type` uses the same types as PR titles (Part 1): `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.
- `N` is the OpenProject ticket number. Leave it out if there is no ticket.
- `short-slug` is a few lowercase words joined by `-`.

Examples:

```
feat/536-resync-progress
fix/652-empty-balance
chore/690-contribution-guide
chore/release-0.43.0
release/0.43.x            ← only for rare hotfix branches (see below)
```

## Day-to-day flow

1. **Start:** branch from the latest `main`.
2. **Work:** keep branches short-lived (hours to days, not weeks). Merge `main` into your branch if it falls behind.
3. **PR:** open a PR into `main` with a Part 1 title. CI must pass.
4. **Merge:** squash-merge. The branch is deleted automatically.

Unfinished features may land on `main` as long as they are hidden (behind a setting, or not linked in the UI yet). `main` must always be in a working state.

## Testing on devices

Tag a **pre-release** from `main`:

```
v0.43.0-dev.1, v0.43.0-dev.2, …
```

The release workflow already handles `-dev.` tags, so test devices get builds the same way as today.

## Releasing

1. A release is cut from `main` by tagging it, e.g. `v0.43.0`.
2. If we adopt release-please (Part 4), this becomes: merge the release PR it keeps open, and it creates the tag, version bump, and changelog for us.
3. The existing release workflow builds, signs, and publishes from the tag.

Users only ever receive **signed, tagged releases**. Unreleased code on `main` never reaches them.

## Hotfixes

- **Normal case:** fix via a regular PR into `main`, then cut a patch release (`v0.43.1`).
- **If `main` has unreleased work we do not want to ship yet:** create `release/0.43.x` from the last release tag, cherry-pick the fix, tag `v0.43.1` from that branch. Delete the branch when no longer needed. This should be rare.

## GitHub settings

- **Protect `main`:** PR required, CI must pass, no direct pushes (including for admins, except emergencies).
- **Auto-delete branches** after merge.
- **Squash-merge only** (turn off merge commits and rebase-merge for PRs into `main`).
- **Default branch:** `main`.

## Switching Edge Studio over (one-time)

| Step | Notes |
|---|---|
| Finish or merge open work on `dev` | Coordinate with the team first |
| Merge `dev` into `main` one last time | Make sure both are in step |
| Make `main` the default branch | GitHub settings |
| Archive / delete `dev` | After confirming nothing is left |
| Delete stale branches | e.g. `backup/main`, `test/main-protection`, `truncated-copy*`, merged `task/*` |
| CI: remove `require-dev-to-main.yml` and `check-dev.yml` | Run checks on every PR to `main` |
| **Install command** | README one-liner and `install.sh` default use `main`. Under trunk-based, `main` holds unreleased work, so new installs must point at the **latest release** instead. Options: CI keeps a `stable` branch/tag pointing at the latest release, or CI publishes `install.sh` per release to the manifests repo / website. Fully automatic — no manual steps for users. |
| Update docs and AI rules | Changelog policy, `CLAUDE.md`/`AGENTS.md`/`.cursor` rules, skills — remove every reference to `dev` |

**Already-installed devices are not affected.** They update through the signed manifest, which only points at tagged releases.

## To do

- [ ] Agree on a switch date with the team.
- [ ] Decide how new installs find the latest release (`stable` pointer vs published `install.sh`).
- [ ] Apply GitHub settings (branch protection, auto-delete, squash-only).
- [ ] Update CI workflows.
- [ ] Update docs, AI rules, and skills.
- [ ] Clean up stale branches.
