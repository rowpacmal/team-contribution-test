# Part 6 — Where Docs, Runbooks, and Skills Live

**Ticket:** OP#690 (rules) · OP#692 (AI configs and skills that apply them)
**Status:** Decided
**Scope:** Shared standard (all projects)

## Principle

- **Docs** say what the rule is. People read them.
- **Skills** do the steps and point to the docs. They never copy the rules.
- **CI** enforces what can be checked.

## Two layers

### Shared (all projects)

- **One public shared repo** in the main org (e.g. `<main-org>/engineering-standards`). It holds:
  - `CONTRIBUTING.md` (Parts 1–5) and runbooks that apply to every project
  - The PR template
  - Reusable CI workflows (PR title check, release-please, lint/format), usable from any repo in either org
  - Shared ESLint/Prettier config (installed with `npm install github:<main-org>/engineering-standards#v1`, no token needed), Ruff and `.editorconfig` templates
  - Shared AI skills (Claude Code plugin)
- **A small public `.github` repo in each org** with `CONTRIBUTING.md` (links to the shared repo) and the PR template. GitHub applies these to every repo in that org automatically.
- **Contents:** rules, templates, CI checks, and lint settings only. No secrets, hostnames, or product code.

### Project (each repo)

- `AGENTS.md`: only what is specific to this project, plus a link to the shared `CONTRIBUTING.md`.
- `CLAUDE.md`: one line, `@AGENTS.md` (imports it). No more copying.
- Project rules (`.claude/rules/`): Minima, Docker/Pi, feature folders, etc.
- Project runbooks: `docs/runbooks/` (e.g. Pi rollback, Minima recovery).
- Project skills: only project-specific ones (e.g. `add-device-support`, `pi-ssh`).

## Fix the AI file sync problem

Today `CLAUDE.md`/`AGENTS.md`, `.claude/rules`/`.agents/rules`, and `.cursor/rules` are kept as manual copies. Proposal:

- `AGENTS.md` + one rules folder are the single source.
- `CLAUDE.md` imports `AGENTS.md`.
- Check whether Cursor can read `AGENTS.md` directly; if yes, drop the `.cursor` copies.

## Shared skills to build (OP#692)

| Skill | Does |
|---|---|
| `start-ticket` | Reads the OpenProject ticket, creates `type/N-slug` branch from `main`, moves ticket to In progress |
| `commit-message` (update) | Writes a Part 1 title: `type(scope): subject OP#N`, present tense, user-facing for `feat`/`fix` |
| `open-pr` | Opens the PR with the template filled in, using GitHub CLI |
| `release` | Triggers a pre-release (`-dev.N` / `-canary.N`) or explains how to merge the release PR |
| `plan-doc`, `session-notes` | Existing; review against the new rules |

## Runbooks vs skills

| Flow | How often | Form |
|---|---|---|
| Start ticket, commit, open PR | Daily | Skill |
| Pre-release / release | Weekly-ish | Skill + short runbook |
| Hotfix via `release/x.y.x` | Rare | Runbook |
| Rollback / recovery on device | Rare, human | Runbook |

## Split between tickets

- **OP#690:** the rules (Parts 1–6) → `CONTRIBUTING.md` in the shared repo.
- **OP#692:** AI configs and skills that follow those rules, and the `AGENTS.md`/`CLAUDE.md` cleanup.

## To do

- [ ] Create the public shared repo in the main org (`CONTRIBUTING.md`, PR template, reusable workflows, shared config, skills).
- [ ] Create a public `.github` repo in each org with `CONTRIBUTING.md` and the PR template.
- [ ] Trim Edge Studio's `AGENTS.md`/rules to project-only content; make `CLAUDE.md` import `AGENTS.md`.
- [ ] Check Cursor support for `AGENTS.md`.
- [ ] Hand skill work to OP#692.
