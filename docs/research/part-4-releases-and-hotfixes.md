# Part 4 — Releases, Changelog, and Hotfixes

**Ticket:** OP#690 — Define Contribution rules and code Style Guide
**Status:** Decided (canary channel kept until further notice)
**Scope:** Shared standard (all projects); Edge Studio specifics marked

## Decision

- **release-please** (free, open source, GitHub Action by Google) automates versioning, the changelog, tags, and GitHub Releases.
- **The changelog is written from PR titles.** No one edits `CHANGELOG.md` by hand any more.
- **One source, written once:** the PR title. Everything else is generated from it.
- **GitHub Releases are used**, filled automatically with the same notes as the changelog.
- **The app's Update page keeps reading `CHANGELOG.md`.**
- **Release channels stay:** development, canary, release.

## How it fits together

```
PR title  ──squash-merge──►  commit on main  ──release-please──►  Release PR
                                                                    (version bump + CHANGELOG.md)
                                                                          │ merge
                                                                          ▼
                                                     tag v0.43.0  +  GitHub Release (same notes)
                                                                          │
                                                                          ▼
                                                     release.yml: build, sign, publish manifest
                                                                          │
                                                                          ▼
                                                     Devices update; Update page shows CHANGELOG.md
```

| Thing | What it is | Who writes it |
|---|---|---|
| PR title | One line describing the change (Part 1 format) | Author / AI |
| Commit on `main` | Same as the PR title (squash-merge) | GitHub, automatically |
| `CHANGELOG.md` | All releases, one line per `feat`/`fix` PR | release-please |
| GitHub Release | Notes for one version, attached to the tag | release-please (same text) |
| Update page in the app | Shows `CHANGELOG.md` for the new version | Already works today |

## What ends up in the changelog

| PR type | In changelog? | Section |
|---|---|---|
| `feat` | Yes | Added |
| `fix` | Yes | Fixed |
| `refactor`, `docs`, `test`, `chore` | No (hidden) | — |

Section names are configured in release-please (`changelog-sections`) to match Keep a Changelog wording.

### Writing good titles (this is now the changelog)

- `feat` and `fix` titles are read by **operators and users**. Describe what they will notice, not how it was built.
  - Good: `feat(minima): show resync progress after page reload OP#536`
  - Bad: `feat(minima): add resync operation repository OP#536`
- Internal-only work uses `refactor`, `chore`, `test`, or `docs`, so it stays out of the changelog.
- **Need more than one line for a big PR?** Add an override block to the PR description before merging. release-please uses it instead of the title:

  ```
  BEGIN_COMMIT_OVERRIDE
  feat(minima): show resync progress after page reload
  feat(minima): show resync event log on the Minima page
  fix(minima): resync no longer shows failure when the node recovers
  END_COMMIT_OVERRIDE
  ```
- **Fixing a line after merge:** edit the merged PR's description with an override block; release-please picks it up while the release PR is still open.

## Versioning

Semantic Versioning, handled by release-please:

| Change | Bump (while below 1.0) | Example |
|---|---|---|
| `fix` | Patch | 0.43.0 → 0.43.1 |
| `feat` | Minor | 0.43.1 → 0.44.0 |
| Breaking change (`feat!:` or `BREAKING CHANGE:`) | Minor (major after 1.0) | 0.44.0 → 0.45.0 |

## Release channels (Edge Studio)

| Channel | Tag | Who gets it |
|---|---|---|
| development | `v0.44.0-dev.N` | Dev / test devices |
| canary | `v0.44.0-canary.N` | Early testers (kept until further notice) |
| release | `v0.44.0` | All users |

- **Pre-release tags are made with a one-click button** (GitHub Actions "Run workflow"). It tags the current `main` as the **next** version plus `-dev.N` or `-canary.N`. No hand-made tags.
- Pre-release numbers always point at the next upcoming version (not ahead of it, like the old `v0.50.0-dev.*` while stable was `0.42`).
- Stable releases only come from merging the release-please PR.

## Releasing (step by step)

1. Work merges into `main` as normal. release-please keeps the release PR up to date.
2. Want to test? Press the pre-release button → `v0.44.0-dev.1` → test devices update.
3. Ready to ship? Review the release PR's changelog, then merge it.
4. release-please tags `v0.44.0` and creates the GitHub Release.
5. `release.yml` builds, signs, and publishes as today.

## Hotfixes

- **Normal:** `fix` PR into `main`, merge the release PR → patch release.
- **If `main` has unreleased work we cannot ship:** `release/0.44.x` branch from the last tag, cherry-pick the fix, release from that branch (release-please supports release branches). Rare.

## Installer (Edge Studio)

- Normal installs already get the app from the signed manifest. Only `install.sh` itself is downloaded from `main`.
- **Change:** publish `install.sh` with each release (next to the checksum CI already publishes in the manifests repo), and point the README one-liner at the released copy.

## What goes away

- Manual version bump commits and changelog edits.
- `## [Unreleased] <branch-name>` sections and moving entries before each PR.
- Changelog merge conflicts.
- Direct commits to `main` for releases.

## Things to check when setting up

- The Update page renders release-please's format (headings like `## [0.44.0](link) (2026-10-20)`, bold scope, PR links). update-agent's version heading check already accepts `## [0.44.0]`. Decide whether the app should hide links and `OP#N` when displaying.
- update-agent currently strips unreleased sections from the changelog; with release-please, `CHANGELOG.md` on `main` only ever holds released versions, so that logic can be simplified later.
- release-please needs a token that is allowed to trigger `release.yml` on the tag it creates (the default `GITHUB_TOKEN` does not trigger other workflows). Use a GitHub App token, like the manifest deploy already does.

## To do

- [ ] Add release-please config + workflow (shared reusable workflow, see Part 6).
- [ ] Map changelog sections to Added / Fixed.
- [ ] Add the one-click pre-release workflow (dev / canary).
- [ ] Publish `install.sh` per release; update the README install command.
- [ ] Check how the Update page displays release-please changelog output.
- [ ] Remove old changelog rules from docs, AI rules, and skills.
- [ ] Keep the existing `CHANGELOG.md` history; release-please appends new versions on top.
- [ ] Decide on the canary channel later.
