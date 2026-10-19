# AGENTS.md

## What this repo is

A sandbox for testing the team's contribution rules (OP#690) and AI skills (OP#692) before they are presented to the team and rolled out to Edge Studio. There is no product code here. The "product" is the rules, the CI that enforces them, and the skills that apply them.

- Rules: [CONTRIBUTING.md](CONTRIBUTING.md). Single source; skills point to it and never copy it.
- Test plan and findings: [docs/test-plan.md](docs/test-plan.md). Read it at the start of a session; update it when something is tested or a rule changes.

## Hard rules

A Claude hook (`.claude/hooks/guard-git.mjs`) blocks commits, merges, and pushes on `main`, and hand-made tags. If it blocks you, follow the rule; don't work around the hook.

Details and reasons are in CONTRIBUTING.md.

- Never commit or push to `main`. Work on a `type/N-slug` branch and open a PR (Part 2).
- PR titles follow Part 1. The PR title is what ends up on `main`; branch commit messages can be informal.
- Never create release tags or edit `CHANGELOG.md` / `version.txt` by hand. release-please and the pre-release workflow do that (Part 4).
- Squash-merge only. Don't merge PRs unless the user asks.
- When a rule turns out wrong or unclear while testing, fix it in CONTRIBUTING.md (in a `docs:` PR) and log it in the test plan. Don't work around it silently.

## Skills

| Skill            | Use for                                        |
| ---------------- | ---------------------------------------------- |
| `start-ticket`   | Create a branch for a ticket                   |
| `commit-message` | Write a PR title / squash commit               |
| `open-pr`        | Push and open a PR with the template filled in |
| `release`        | Pre-release tags and the release PR            |

## Repo specifics

- GitHub: `rowpacmal/team-contribution-test`, private, personal Free account. Branch protection and CODEOWNERS enforcement are not available until it is public.
- No OpenProject access from here. Ask the user for the ticket number; current tickets are OP#690 (rules) and OP#692 (AI configs and skills).
- Checks: `npm run check` (Prettier, ESLint, tsc). Python: `uvx ruff check` / `uvx ruff format`. Shell: ShellCheck. CI runs all of them (`.github/workflows/checks.yml`). A Claude hook formats each file after edit.
- release-please uses `release-type: simple` (`version.txt`). No `RELEASE_PLEASE_TOKEN` yet, so it runs with `GITHUB_TOKEN`.
