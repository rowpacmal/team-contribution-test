# Contribution Rules and Code Style Guide

**Ticket:** OP#690 — Define Contribution rules and code Style Guide (parent OP#668)
**Related:** OP#692 — Update and enhance AI configs and skills
**Scope:** Shared standard for all our projects, with Edge Studio as the first one.

## Goal

Common rules for how code is written, reviewed, merged, and released, so the team has less friction, onboarding is easier, and we stop building up technical debt. We work AI-first, so rules are written to be applied by AI skills and enforced by CI where possible. Existing setups can change wherever they fall short.

**Principle:** docs say what the rule is, skills do the steps, CI enforces what can be checked.

## Decisions at a glance

| Part | Decision |
|---|---|
| 1. Commit and PR titles | `type(scope): subject OP#N` (Conventional Commits), enforced on PR titles; squash-merge uses the PR title |
| 2. Branches and flow | Trunk-based: only `main`; short-lived `type/N-slug` branches; releases from tags; `dev` retired |
| 3. PRs and reviews | AI review on every PR; human approval only for high-risk areas via `CODEOWNERS`; PR template; PRs under ~400 lines as a guideline |
| 4. Releases | release-please writes version, `CHANGELOG.md`, tag, and GitHub Release from PR titles; dev/canary/release channels kept |
| 5. Code style | Prettier + ESLint (TS), Ruff (Python), ShellCheck (shell), all in CI; file naming by use case; one-time format and rename PRs |
| 6. Docs, skills, structure | Public shared repo in the main org, used by both orgs; a public `.github` repo per org for the PR template; `AGENTS.md` is the single AI rules source; shared skills via OP#692 |

## Checks before setup

- Codex Security cost on our OpenAI plan.
- Whether Cursor can read `AGENTS.md` directly.
- Canary channel: kept until the team decides otherwise.

## Rollout order

1. Shared repo + `.github` repos (Part 6).
2. Switch to trunk-based, merge open work, clean up branches (Part 2).
3. One-time format PR and rename PR, then turn on CI checks (Part 5).
4. PR title check, PR template, `CODEOWNERS`, AI reviewers (Parts 1, 3).
5. release-please, pre-release button, installer publishing (Part 4).
6. Update AI rules and skills (OP#692).

---

## Part 1 — Commit and PR Titles

**Status:** Decided
**Scope:** Shared standard (all projects)

### Decision

We use **Conventional Commits** for PR titles, with the OpenProject ticket at the end:

```
type(scope): subject OP#N
```

Since we squash-merge, the PR title becomes the commit on `main`. Only PR titles are enforced. Commits inside a feature branch can be informal.

### Format rules

| Part | Rule |
|---|---|
| `type` | Required. One of the types below. Lowercase. |
| `(scope)` | Optional. The feature area, e.g. `minima`, `wallet`, `automation`, `ci`. |
| `subject` | Required. Short, present tense, lowercase start, no trailing period. Describes the change, not the files touched. |
| `OP#N` | The OpenProject ticket. Required when a ticket exists; leave out for small chores with no ticket. |
| `(#PR)` | Added automatically by GitHub on squash-merge. Do not type it. |

#### Types

| Type | Use for |
|---|---|
| `feat` | New user- or operator-facing feature |
| `fix` | Bug fix, including urgent hotfixes. Use `fix` (not `chore`) for anything that must ship: only `feat` and `fix` trigger a release (Part 4) |
| `refactor` | Code change with no behavior change |
| `docs` | Documentation only |
| `test` | Tests only |
| `chore` | Tooling, dependencies, CI, releases, housekeeping |

### Examples

```
feat(minima): show resync progress OP#536
fix(wallet): handle empty balance OP#652
refactor(auth): replace native bcrypt with built-in scrypt OP#216
docs: add contribution guide OP#690
chore(ci): add PR title check
feat(api)!: remove v1 device endpoints OP#701
chore(main): release 0.43.0               ← written by release-please, not by hand
```

Not allowed:

```
[#536] Improve Minima resync status      ← old format
Truncated copy2                          ← no type, unclear
Fixed table bug                          ← no type, past tense
Revert "feat(minima): show resync…"     ← GitHub's default revert title, rename it (see below)
```

#### Breaking changes

Mark them with `!` after the type/scope in the title: `feat(api)!: …`. This is the only supported way. Squash commits use the PR title with an empty body, so a `BREAKING CHANGE:` footer would never reach `main`.

#### Reverts

GitHub's revert button creates a `Revert "…"` title, which fails the title check. Rename the revert PR before merging:

- Reverting a released `feat`/`fix`: `fix(scope): revert <original subject> OP#N` (users will notice, so it goes in the changelog).
- Reverting something not yet released, or internal-only: `chore(scope): revert <original subject> OP#N`.

### Why

- **Tools can read it.** Conventional Commits is the format used by release and changelog tools (release-please, git-cliff, commitlint). This lets us automate versioning and changelogs later (see Part 4).
- **History is easy to scan.** The type shows at a glance what kind of change it was.
- **`OP#N` instead of `[#N]`.** `[#536] … (#152)` mixes a ticket number and a GitHub PR number with the same `#` sign. `OP#N` is unambiguous, and it is the format OpenProject's GitHub integration uses to link PRs to tickets.
- **Low cost.** AI writes most titles, and a CI check catches mistakes.

### How it is enforced

| What | Where | Effort |
|---|---|---|
| PR title check (fails the PR if the title is wrong) | GitHub Action `amannn/action-semantic-pull-request` (free, open source). Must be configured: `types` limited to our six (the default allows all Conventional Commits types), and `subjectPattern` for lowercase start / no trailing period | ~1 hour |
| `OP#N` matches the branch (soft check) | Same workflow: if the branch is `type/N-slug`, the title must contain `OP#N`. Titles without a ticket can't be checked, so that part stays by agreement | Small |
| Squash-merge uses the PR title as the commit message | GitHub repo setting: *Pull Requests → Allow squash merging → Default to pull request title* (title only, empty body) | 1 minute |
| AI writes titles in this format | Update the `commit-message` skill (switch to Conventional Commits, present tense, `OP#N`) | Small |
| PRs show up on OpenProject tickets | OpenProject GitHub integration (admin setup: webhook + token) | Admin task, no code |

### To do

- [ ] Add the PR title check as a shared reusable workflow (see Part 6), call it from each project.
- [ ] Set the squash-merge default in GitHub repo settings.
- [ ] Update the `commit-message` skill to the new format.
- [ ] Ask an OpenProject admin to enable the GitHub integration (check it is included in our edition).
- [ ] Update references to the old `[#N]` convention in AI rules and skills (e.g. `.claude/skills/openproject/SKILL.md`, `.claude/skills/commit-message/SKILL.md`).

### Related tools (for Part 4)

All free and open source.

| Tool | What it does |
|---|---|
| `action-semantic-pull-request` | Checks PR titles in CI |
| `commitlint` | Checks commit messages (not needed for us, since we squash) |
| `release-please` | Opens a "release PR" that bumps version, writes changelog, and tags on merge |
| `git-cliff` | Generates changelog text from commits using a template we control |
| `semantic-release` | Fully automatic release on every merge (likely too automatic for signed Pi releases) |
| GitHub auto release notes | Built-in list of merged PRs on a GitHub Release |

---

## Part 2 — Branch Naming and Flow

**Status:** Decided
**Scope:** Shared standard (all projects)

### Decision

We move to **trunk-based development**:

- `main` is the **only** long-lived branch.
- All work happens on short-lived branches off `main`, merged back by squash-merge after CI passes.
- Releases come from **tags on `main`**, not from a separate branch.
- The `dev` branch is retired.

### Why

Our current `feature → dev → main` flow has real pain points:

- `dev → main` is squash-merged, which makes the two branches drift apart and needs "Sync main into dev" merges.
- Commits land directly on `main` (version bumps, changelog edits), so `main` is not fully protected.
- Hotfixes have no clear path.
- Two branches to keep in step, for a small team.

Trunk-based removes the root cause: with one long-lived branch, there is nothing to drift. It is also the best fit for AI-assisted work (many small PRs) and for release tools like release-please, which assume one main branch.

### Branch naming

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
release/0.43.x            ← only for rare hotfix branches (see below)
```

Release PR branches (`release-please--branches--main`) are created by release-please. Don't create them by hand.

### Day-to-day flow

1. **Start:** branch from the latest `main`.
2. **Work:** keep branches short-lived (hours to days, not weeks). Merge `main` into your branch if it falls behind.
3. **PR:** open a PR into `main` with a Part 1 title. CI must pass.
4. **Merge:** squash-merge. The branch is deleted automatically.

Unfinished features may land on `main` as long as they are hidden (behind a setting, or not linked in the UI yet). `main` must always be in a working state.

### Testing on devices

Press the **pre-release button** (Part 4). It tags `main` as the next version plus `-dev.N`:

```
v0.43.0-dev.1, v0.43.0-dev.2, …
```

The release workflow already handles `-dev.` tags, so test devices get builds the same way as today.

### Releasing

1. release-please keeps a release PR open against `main` (Part 4).
2. Merging it creates the version bump, changelog, tag (e.g. `v0.43.0`), and GitHub Release.
3. The existing release workflow builds, signs, and publishes from the tag.

No hand-made tags. Users only ever receive **signed, tagged releases**. Unreleased code on `main` never reaches them.

### Hotfixes

- **Normal case:** `fix` PR into `main`, then merge the release PR → patch release (`v0.43.1`).
- **If `main` has unreleased work we do not want to ship yet:** create `release/0.43.x` from the last release tag, cherry-pick the fix in a `fix` PR into that branch. release-please opens a release PR for `release/0.43.x` (the workflow must run on `release/*` branches too); merge it to tag `v0.43.1`. Delete the branch when no longer needed. This should be rare.

### GitHub settings

- **Protect `main`:** PR required, CI must pass, no direct pushes (including for admins, except emergencies).
- **Auto-delete branches** after merge.
- **Squash-merge only** (turn off merge commits and rebase-merge for PRs into `main`).
- **Default branch:** `main`.

### Switching Edge Studio over (one-time)

| Step | Notes |
|---|---|
| Finish or merge open work on `dev` | Coordinate with the team first |
| Merge `dev` into `main` one last time | Make sure both are in step |
| Make `main` the default branch | GitHub settings |
| Archive / delete `dev` | After confirming nothing is left |
| Delete stale branches | e.g. `backup/main`, `test/main-protection`, `truncated-copy*`, merged `task/*` |
| CI: remove `require-dev-to-main.yml` and `check-dev.yml` | Run checks on every PR to `main` |
| **Install command** | README one-liner and `install.sh` default use `main`. Under trunk-based, `main` holds unreleased work, so new installs must point at the **latest release** instead. Decided: CI publishes `install.sh` with each release (Part 4). Fully automatic — no manual steps for users. |
| Update docs and AI rules | Changelog policy, `CLAUDE.md`/`AGENTS.md`/`.cursor` rules, skills — remove every reference to `dev` |

**Already-installed devices are not affected.** They update through the signed manifest, which only points at tagged releases.

### To do

- [ ] Agree on a switch date with the team.
- [ ] Apply GitHub settings (branch protection, auto-delete, squash-only).
- [ ] Update CI workflows.
- [ ] Update docs, AI rules, and skills.
- [ ] Clean up stale branches.

---

## Part 3 — Pull Requests and Reviews

**Status:** Decided
**Scope:** Shared standard (all projects)

### Decision

**Risk-based review:**

- **Every PR** gets an AI review and must pass CI.
- **High-risk areas** also need **one human approval** (via `CODEOWNERS`).
- Everything else: the author merges once CI is green and AI feedback is handled.
- **Codex Security** covers security findings. **Claude Code GitHub Action** is the general AI reviewer (trial first).

### Why

- We are a small team working mostly with AI. Reviewing every AI-written PR by hand is not realistic.
- Today PRs get **no** review at all (last 12 PRs: all self-merged within minutes). AI review on every PR is a big step up at low cost.
- A human still checks the places where a mistake is expensive.

### Rules for every PR

- **Title** follows Part 1: `type(scope): subject OP#N`.
- **Fill in the PR template** (below).
- **The author owns the PR**, even when AI wrote the code. Read the diff before asking for review or merging.
- **Use draft PRs** for work in progress.
- **CI must pass** before merging.
- **Handle AI review comments:** fix them, or reply in one line why not.
- **Squash-merge** into `main` (Part 2). The author merges.
- **Keep PRs small.** Aim for under ~400 changed lines, not counting tests and generated files. Split larger work into a series of PRs. Guideline only, not enforced.

### High-risk areas (human approval required)

Listed in `CODEOWNERS`. For Edge Studio, a starting list:

| Area | Paths (examples) |
|---|---|
| Auth | `backend/src/features/auth/`, `backend/src/features/integritas-auth/` |
| Crypto / secrets | `backend/src/shared/crypto.ts`, `backend/src/features/settings/secrets.service.ts` |
| Wallet / money movement | `backend/src/features/wallet/` |
| Minima backup / console | `backend/src/features/minima/minima-backup*`, `minima-console*` |
| Update / install trust chain | `update-agent/`, `install.sh`, `host-agent/` |
| CI and release | `.github/`, `scripts/release/` |

This mirrors the 90%-coverage "high-risk" list already in our testing rules. Each project defines its own list.

### PR template

```markdown
## Summary
What changed and why, in a few sentences.

## Ticket
OP#

## Verification
What you ran or tested (checks, manual testing, device testing).

## Risks / Notes
Anything reviewers or operators should know. Follow-up work.

## Checklist
- [ ] Title describes what users notice (`feat`/`fix` titles become the changelog)
- [ ] Docs updated (README / SECURITY / guides) if behavior changed
- [ ] Tests added or updated
- [ ] Screenshots attached (UI changes)
```

### AI review tools

| Tool | Role | Status |
|---|---|---|
| **Codex Security** (GitHub app) | Security findings | Planned. Check what our OpenAI plan includes. |
| **Claude Code GitHub Action** (`anthropics/claude-code-action`) | General code review | Trial for 2–3 weeks, then decide. Official Anthropic action. Can read our existing `CLAUDE.md` rules. |
| PR-Agent (Qodo) | Backup option | Not planned. Legit and established, but had real security bugs in 2024–25 (fixed). No reason to pick it while we use Claude. |

AI reviewers **comment, they do not block**. CI and `CODEOWNERS` do the blocking.

#### Safety setup for AI review bots (important on public repos)

Anyone can open a PR or comment on a public repo. An AI bot reads that text, so it can be tricked ("prompt injection") into leaking secrets or doing things it should not. All AI review tools share this risk. Set them up like this:

- Do **not** run on PRs from forks. Do **not** use the `pull_request_target` trigger.
- Give the workflow minimal permissions: `contents: read`, `pull-requests: write`.
- Only allow team members to trigger the bot by mention (e.g. `@claude`).
- The only secret the workflow gets is the AI key/token.
- Pin the action to a version.

### Enforcement and GitHub plans

| | Public repo | Private repo |
|---|---|---|
| Free org | Rules enforced | Rules **not** enforced; CODEOWNERS still auto-requests reviewers; CI still runs |
| Team org (~$4/user/month) | Rules enforced | Rules enforced |

**Decision:** enforcement is a nice-to-have. On private repos with a Free plan, the team follows these rules by agreement. We do not need the Team plan for this.

### To do

- [ ] Add the PR template to each org's `.github` repo (see Part 6).
- [ ] Add `CODEOWNERS` with the high-risk list; turn on "Require review from Code Owners" for `main` (only possible on public repos or paid plans, see above).
- [ ] Set up Claude Code GitHub Action with the safety setup above; trial for 2–3 weeks.
- [ ] Set up Codex Security GitHub app; confirm cost/credits with our OpenAI plan.
- [ ] Use a team Anthropic API key (org secret) for the Claude action, not a personal subscription token.

---

## Part 4 — Releases, Changelog, and Hotfixes

**Status:** Decided (canary channel kept until further notice)
**Scope:** Shared standard (all projects); Edge Studio specifics marked

### Decision

- **release-please** (free, open source, GitHub Action by Google) automates versioning, the changelog, tags, and GitHub Releases.
- **The changelog is written from PR titles.** No one edits `CHANGELOG.md` by hand any more.
- **One source, written once:** the PR title. Everything else is generated from it.
- **GitHub Releases are used**, filled automatically with the same notes as the changelog.
- **The app's Update page keeps reading `CHANGELOG.md`.**
- **Release channels stay:** development, canary, release.

### How it fits together

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

### What ends up in the changelog

| PR type | In changelog? | Section |
|---|---|---|
| `feat` | Yes | Added |
| `fix` | Yes | Fixed |
| `refactor`, `docs`, `test`, `chore` | No (hidden) | — |

Section names are configured in release-please (`changelog-sections`) to match Keep a Changelog wording.

#### Writing good titles (this is now the changelog)

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

### Versioning

Semantic Versioning, handled by release-please:

| Change | Bump (while below 1.0) | Example |
|---|---|---|
| `fix` | Patch | 0.43.0 → 0.43.1 |
| `feat` | Minor | 0.43.1 → 0.44.0 |
| Breaking change (`feat!:`, see Part 1) | Minor (major after 1.0) | 0.44.0 → 0.45.0 |

By default release-please bumps the **major** version for breaking changes even below 1.0 (0.44.0 → 1.0.0). Set `"bump-minor-pre-major": true` in `release-please-config.json` to get the table above.

Only `feat` and `fix` (and breaking changes) trigger a release. A merge of only `refactor`/`docs`/`test`/`chore` PRs opens no release PR.

### Release channels (Edge Studio)

| Channel | Tag | Who gets it |
|---|---|---|
| development | `v0.44.0-dev.N` | Dev / test devices |
| canary | `v0.44.0-canary.N` | Early testers (kept until further notice) |
| release | `v0.44.0` | All users |

- **Pre-release tags are made with a one-click button** (GitHub Actions "Run workflow"). It tags the current `main` as the **next** version plus `-dev.N` or `-canary.N`. No hand-made tags.
  - release-please does not compute "next version" for pre-releases, so this is a small custom workflow: read the version from the open release PR title (`chore(main): release X.Y.Z`), fall back to the next patch of `.release-please-manifest.json` if there is none, then count existing `-dev.N` / `-canary.N` tags.
- Pre-release numbers always point at the next upcoming version (not ahead of it, like the old `v0.50.0-dev.*` while stable was `0.42`).
- Stable releases only come from merging the release-please PR.

### Releasing (step by step)

1. Work merges into `main` as normal. release-please keeps the release PR up to date.
2. Want to test? Press the pre-release button → `v0.44.0-dev.1` → test devices update.
3. Ready to ship? Review the release PR's changelog, then merge it.
4. release-please tags `v0.44.0` and creates the GitHub Release.
5. `release.yml` builds, signs, and publishes as today.

### Hotfixes

- **Normal:** `fix` PR into `main`, merge the release PR → patch release.
- **If `main` has unreleased work we cannot ship:** `release/0.44.x` branch from the last tag, cherry-pick the fix in a `fix` PR, merge the release PR release-please opens for that branch (the release-please workflow must also run on `release/*`). Rare.

### Installer (Edge Studio)

- Normal installs already get the app from the signed manifest. Only `install.sh` itself is downloaded from `main`.
- **Change:** publish `install.sh` with each release (next to the checksum CI already publishes in the manifests repo), and point the README one-liner at the released copy.

### What goes away

- Manual version bump commits and changelog edits.
- `## [Unreleased] <branch-name>` sections and moving entries before each PR.
- Changelog merge conflicts.
- Direct commits to `main` for releases.

### Things to check when setting up

- The Update page renders release-please's format (headings like `## [0.44.0](link) (2026-10-20)`, bold scope, PR links). update-agent's version heading check already accepts `## [0.44.0]`. Decide whether the app should hide links and `OP#N` when displaying.
- update-agent currently strips unreleased sections from the changelog; with release-please, `CHANGELOG.md` on `main` only ever holds released versions, so that logic can be simplified later.
- release-please needs a token that is allowed to trigger other workflows. With the default `GITHUB_TOKEN`, GitHub does not start workflows from its actions, so:
  - `release.yml` would not run on the tag it creates, and
  - CI would not run on the release PR, so required checks never pass and the PR can't be merged under branch protection.

  Use a GitHub App token, like the manifest deploy already does. The pre-release button needs the same token to push its tag, or `release.yml` won't run for `-dev.N` / `-canary.N` either.
- With `GITHUB_TOKEN`, the repo (or org) setting *Actions → General → Allow GitHub Actions to create and approve pull requests* must be on, or release-please can't open the release PR.

### To do

- [ ] Add release-please config + workflow (shared reusable workflow, see Part 6), running on `main` and `release/*`.
- [ ] Set `bump-minor-pre-major: true`.
- [ ] Create a GitHub App token for release-please.
- [ ] Map changelog sections to Added / Fixed.
- [ ] Add the one-click pre-release workflow (dev / canary).
- [ ] Publish `install.sh` per release; update the README install command.
- [ ] Check how the Update page displays release-please changelog output.
- [ ] Remove old changelog rules from docs, AI rules, and skills.
- [ ] Keep the existing `CHANGELOG.md` history; release-please appends new versions on top.
- [ ] Decide on the canary channel later.

---

## Part 5 — Code Style

**Status:** Decided
**Scope:** Shared standard (all projects); Edge Studio specifics marked

### Decision

**Tools decide style, CI enforces it.** No long written style guide.

- One formatter and one linter per language, all enforced in CI.
- A simple file naming rule, based on what the file is.
- One-time cleanup PRs to bring existing code in line.

### Tools per language

| Language | Formatter | Linter | Status (Edge Studio) |
|---|---|---|---|
| TypeScript / JavaScript | Prettier | ESLint (`--max-warnings=0`) | ESLint done (OP#524). Prettier installed but **not enforced**: 512 of ~930 files are not formatted. |
| Python | Ruff (format) | Ruff (lint) | Not set up (camera/sensor helpers, host-agent) |
| Shell | — | ShellCheck | Not set up (`install.sh`, `bin/edge-studio`); only `bash -n` today |

All tools are free and open source.

TypeScript `strict` mode stays on in every package (already the case).

### File naming

| What | Style | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `AppShell.tsx` |
| React hooks | `useSomething.ts` | `useMinimaResync.ts` |
| Everything else (TS/JS) | `kebab-case.ts` | `data-sources.service.ts`, `automation-api.ts` |
| Python | `snake_case.py` (PEP 8; required for importable modules) | `camera_helper.py` |
| Shell scripts | `kebab-case.sh`; entry points on `PATH` have no extension | `install.sh`, `bin/edge-studio` |

TS/JS is enforced with an ESLint filename rule after the one-time rename. Ruff's `N999` covers Python module names. Shell names are by agreement.

### Editor settings

Add a small `.editorconfig` (indentation, line endings, final newline) so every editor behaves the same.

### AI auto-format (optional convenience)

A Claude Code hook runs Prettier on each file right after the AI edits it, so formatting never fails CI.

### One-time cleanup (Edge Studio)

Do these right after the switch to trunk-based (Part 2), when no other work is open:

1. **Format PR:** run Prettier on everything. After it is squash-merged, open a small follow-up PR that adds the merged commit's hash to `.git-blame-ignore-revs` so `git blame` skips it (the hash only exists after merge, and `main` takes no direct pushes).
2. **Rename PR:** rename files to the naming rule (AI does it; TypeScript and tests catch broken imports). Git keeps the history.
3. Then turn on the CI checks so it stays clean.

### Shared configs

ESLint, Prettier, Ruff, and `.editorconfig` settings move to the shared repo (see Part 6). Each project imports them and adds only project-specific rules.

### To do

- [ ] Add `prettier --check` to `npm run check` (after the format PR).
- [ ] Format PR + `.git-blame-ignore-revs`.
- [ ] Rename PR + ESLint filename rule.
- [ ] Add Ruff for Python code, in CI.
- [ ] Add ShellCheck for shell scripts, in CI.
- [ ] Add `.editorconfig`.
- [ ] Add the Claude Code Prettier hook (optional).
- [ ] Move configs to the shared repo (Part 6).

---

## Part 6 — Where Docs, Runbooks, and Skills Live

**Status:** Decided
**Scope:** Shared standard (all projects)

### Principle

- **Docs** say what the rule is. People read them.
- **Skills** do the steps and point to the docs. They never copy the rules.
- **CI** enforces what can be checked.

### Two layers

#### Shared (all projects)

- **One public shared repo** in the main org (e.g. `<main-org>/engineering-standards`). It holds:
  - `CONTRIBUTING.md` (Parts 1–5) and runbooks that apply to every project
  - The PR template
  - Reusable CI workflows (PR title check, release-please, lint/format), usable from any repo in either org
  - Shared ESLint/Prettier config (installed with `npm install github:<main-org>/engineering-standards#v1`, no token needed), Ruff and `.editorconfig` templates
  - Shared AI skills (Claude Code plugin)
- **A small public `.github` repo in each org** with `CONTRIBUTING.md` (links to the shared repo) and the PR template. GitHub applies these to every repo in that org automatically.
- **Contents:** rules, templates, CI checks, and lint settings only. No secrets, hostnames, or product code.

#### Project (each repo)

- `AGENTS.md`: only what is specific to this project, plus a link to the shared `CONTRIBUTING.md`.
- `CLAUDE.md`: one line, `@AGENTS.md` (imports it). No more copying.
- Project rules (`.claude/rules/`): Minima, Docker/Pi, feature folders, etc.
- Project runbooks: `docs/runbooks/` (e.g. Pi rollback, Minima recovery).
- Project skills: only project-specific ones (e.g. `add-device-support`, `pi-ssh`).

### Fix the AI file sync problem

Today `CLAUDE.md`/`AGENTS.md`, `.claude/rules`/`.agents/rules`, and `.cursor/rules` are kept as manual copies. Proposal:

- `AGENTS.md` + one rules folder are the single source.
- `CLAUDE.md` imports `AGENTS.md`.
- Check whether Cursor can read `AGENTS.md` directly; if yes, drop the `.cursor` copies.

### Shared skills to build (OP#692)

| Skill | Does |
|---|---|
| `start-ticket` | Reads the OpenProject ticket, creates `type/N-slug` branch from `main`, moves ticket to In progress |
| `commit-message` (update) | Writes a Part 1 title: `type(scope): subject OP#N`, present tense, user-facing for `feat`/`fix` |
| `open-pr` | Opens the PR with the template filled in, using GitHub CLI |
| `release` | Triggers a pre-release (`-dev.N` / `-canary.N`) or explains how to merge the release PR |
| `plan-doc`, `session-notes` | Existing; review against the new rules |

### Runbooks vs skills

| Flow | How often | Form |
|---|---|---|
| Start ticket, commit, open PR | Daily | Skill |
| Pre-release / release | Weekly-ish | Skill + short runbook |
| Hotfix via `release/x.y.x` | Rare | Runbook |
| Rollback / recovery on device | Rare, human | Runbook |

### Split between tickets

- **OP#690:** the rules (Parts 1–6) → `CONTRIBUTING.md` in the shared repo.
- **OP#692:** AI configs and skills that follow those rules, and the `AGENTS.md`/`CLAUDE.md` cleanup.

### To do

- [ ] Create the public shared repo in the main org (`CONTRIBUTING.md`, PR template, reusable workflows, shared config, skills).
- [ ] Create a public `.github` repo in each org with `CONTRIBUTING.md` and the PR template.
- [ ] Trim Edge Studio's `AGENTS.md`/rules to project-only content; make `CLAUDE.md` import `AGENTS.md`.
- [ ] Check Cursor support for `AGENTS.md`.
- [ ] Hand skill work to OP#692.

