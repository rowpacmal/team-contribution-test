---
name: commit-message
description: Write a PR title (which becomes the squash commit and changelog line) in the team's Conventional Commits format. Use when committing, naming or renaming a PR, or reverting.
---

# Commit message / PR title

The format and every rule are in CONTRIBUTING.md, Part 1. Read it before writing a title; don't work from memory. For `feat`/`fix`, also read Part 4 "Writing good titles".

## Steps

1. Look at the full change (`git diff origin/main...HEAD`, or the staged diff).
2. Pick `type` and optional `scope` from Part 1.
3. Write the subject: what changed from the user's or operator's point of view for `feat`/`fix`, what was done for internal types.
4. Add `OP#N`. Take `N` from the branch name (`type/N-slug`) if there is one. The PR title check fails if the branch has a number and the title doesn't match.
5. Check the special cases in Part 1: breaking changes (`!`), reverts.
6. Self-check against Part 1's "Not allowed" examples and the `subjectPattern` in `.github/workflows/pr-title.yml`.

## Commits inside a branch

Informal messages are fine (Part 1). Still prefer the PR-title format, so a single-commit PR's title is ready-made.

## If a PR covers several user-facing changes

Suggest a `BEGIN_COMMIT_OVERRIDE` block for the PR description (Part 4) instead of cramming them into one title.
