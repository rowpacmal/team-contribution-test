# Part 1 — Commit and PR Titles

**Ticket:** OP#690 — Define Contribution rules and code Style Guide
**Status:** Decided
**Scope:** Shared standard (all projects)

## Decision

We use **Conventional Commits** for PR titles, with the OpenProject ticket at the end:

```
type(scope): subject OP#N
```

Since we squash-merge, the PR title becomes the commit on `main`. Only PR titles are enforced. Commits inside a feature branch can be informal.

## Format rules

| Part | Rule |
|---|---|
| `type` | Required. One of the types below. Lowercase. |
| `(scope)` | Optional. The feature area, e.g. `minima`, `wallet`, `automation`, `ci`. |
| `subject` | Required. Short, present tense, lowercase start, no trailing period. Describes the change, not the files touched. |
| `OP#N` | The OpenProject ticket. Required when a ticket exists; leave out for small chores with no ticket. |
| `(#PR)` | Added automatically by GitHub on squash-merge. Do not type it. |

### Types

| Type | Use for |
|---|---|
| `feat` | New user- or operator-facing feature |
| `fix` | Bug fix, including urgent hotfixes (release-please only makes a patch release for `fix`) |
| `refactor` | Code change with no behavior change |
| `docs` | Documentation only |
| `test` | Tests only |
| `chore` | Tooling, dependencies, CI, releases, housekeeping |

## Examples

```
feat(minima): show resync progress OP#536
fix(wallet): handle empty balance OP#652
refactor(auth): replace native bcrypt with built-in scrypt OP#216
docs: add contribution guide OP#690
chore(ci): add PR title check
chore: release v0.43.0
```

Not allowed:

```
[#536] Improve Minima resync status      ← old format
Truncated copy2                          ← no type, unclear
Fixed table bug                          ← no type, past tense
```

## Why

- **Tools can read it.** Conventional Commits is the format used by release and changelog tools (release-please, git-cliff, commitlint). This lets us automate versioning and changelogs later (see Part 4).
- **History is easy to scan.** The type shows at a glance what kind of change it was.
- **`OP#N` instead of `[#N]`.** `[#536] … (#152)` mixes a ticket number and a GitHub PR number with the same `#` sign. `OP#N` is unambiguous, and it is the format OpenProject's GitHub integration uses to link PRs to tickets.
- **Low cost.** AI writes most titles, and a CI check catches mistakes.

## How it is enforced

| What | Where | Effort |
|---|---|---|
| PR title check (fails the PR if the title is wrong) | GitHub Action, e.g. `amannn/action-semantic-pull-request` (free, open source) | ~1 hour |
| Squash-merge uses the PR title as the commit message | GitHub repo setting: *Pull Requests → Allow squash merging → Default to pull request title* | 1 minute |
| AI writes titles in this format | Update the `commit-message` skill (switch to Conventional Commits, present tense, `OP#N`) | Small |
| PRs show up on OpenProject tickets | OpenProject GitHub integration (admin setup: webhook + token) | Admin task, no code |

## To do

- [ ] Add the PR title check as a shared reusable workflow (see Part 6), call it from each project.
- [ ] Set the squash-merge default in GitHub repo settings.
- [ ] Update the `commit-message` skill to the new format.
- [ ] Ask an OpenProject admin to enable the GitHub integration (check it is included in our edition).
- [ ] Update references to the old `[#N]` convention in AI rules and skills (e.g. `.claude/skills/openproject/SKILL.md`, `.claude/skills/commit-message/SKILL.md`).

## Related tools (for Part 4)

All free and open source.

| Tool | What it does |
|---|---|
| `action-semantic-pull-request` | Checks PR titles in CI |
| `commitlint` | Checks commit messages (not needed for us, since we squash) |
| `release-please` | Opens a "release PR" that bumps version, writes changelog, and tags on merge |
| `git-cliff` | Generates changelog text from commits using a template we control |
| `semantic-release` | Fully automatic release on every merge (likely too automatic for signed Pi releases) |
| GitHub auto release notes | Built-in list of merged PRs on a GitHub Release |
