---
name: release
description: Make a dev or canary pre-release tag, or check and explain the release-please release PR. Use when the user wants to test a build, make a pre-release, ship a release, or do a hotfix.
---

# Release

Process: CONTRIBUTING.md, Part 4. Hotfix branches: Part 2 "Hotfixes". Never create tags or edit `CHANGELOG.md` / `version.txt` by hand.

## Pre-release (dev / canary)

```bash
gh workflow run pre-release.yml --ref main -f channel=dev   # or canary
gh run list --workflow pre-release.yml --limit 1
```

Report the tag the run created (shown in its summary, or `git fetch --tags && git tag -l 'v*-dev.*' --sort=-v:refname | head -1`).

## Stable release

1. Find the release PR: `gh pr list --label "autorelease: pending"`.
2. Show the user the version and changelog from its diff. Point out any `feat`/`fix` lines that read as implementation detail (Part 4 "Writing good titles"); they can be fixed with an override block in the original PR's description.
3. Merge only when the user says so: `gh pr merge <number> --squash`.
4. Check the tag and GitHub Release appeared: `gh release list --limit 1`.

No release PR means nothing releasable (`feat`/`fix`) has merged since the last release.

## Hotfix

Normal case: use the usual flow with a `fix` PR into `main`. Use a `release/x.y.x` branch only if the user confirms `main` has unreleased work that must not ship. Follow Part 2 step by step.
