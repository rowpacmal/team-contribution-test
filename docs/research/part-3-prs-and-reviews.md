# Part 3 — Pull Requests and Reviews

**Ticket:** OP#690 — Define Contribution rules and code Style Guide
**Status:** Decided
**Scope:** Shared standard (all projects)

## Decision

**Risk-based review:**

- **Every PR** gets an AI review and must pass CI.
- **High-risk areas** also need **one human approval** (via `CODEOWNERS`).
- Everything else: the author merges once CI is green and AI feedback is handled.
- **Codex Security** covers security findings. **Claude Code GitHub Action** is the general AI reviewer (trial first).

## Why

- We are a small team working mostly with AI. Reviewing every AI-written PR by hand is not realistic.
- Today PRs get **no** review at all (last 12 PRs: all self-merged within minutes). AI review on every PR is a big step up at low cost.
- A human still checks the places where a mistake is expensive.

## Rules for every PR

- **Title** follows Part 1: `type(scope): subject OP#N`.
- **Fill in the PR template** (below).
- **The author owns the PR**, even when AI wrote the code. Read the diff before asking for review or merging.
- **Use draft PRs** for work in progress.
- **CI must pass** before merging.
- **Handle AI review comments:** fix them, or reply in one line why not.
- **Squash-merge** into `main` (Part 2). The author merges.
- **Keep PRs small.** Aim for under ~400 changed lines, not counting tests and generated files. Split larger work into a series of PRs. Guideline only, not enforced.

## High-risk areas (human approval required)

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

## PR template

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
- [ ] Changelog updated (user- or operator-facing change)
- [ ] Docs updated (README / SECURITY / guides) if behavior changed
- [ ] Tests added or updated
- [ ] Screenshots attached (UI changes)
```

## AI review tools

| Tool | Role | Status |
|---|---|---|
| **Codex Security** (GitHub app) | Security findings | Planned. Check what our OpenAI plan includes. |
| **Claude Code GitHub Action** (`anthropics/claude-code-action`) | General code review | Trial for 2–3 weeks, then decide. Official Anthropic action. Can read our existing `CLAUDE.md` rules. |
| PR-Agent (Qodo) | Backup option | Not planned. Legit and established, but had real security bugs in 2024–25 (fixed). No reason to pick it while we use Claude. |

AI reviewers **comment, they do not block**. CI and `CODEOWNERS` do the blocking.

### Safety setup for AI review bots (important on public repos)

Anyone can open a PR or comment on a public repo. An AI bot reads that text, so it can be tricked ("prompt injection") into leaking secrets or doing things it should not. All AI review tools share this risk. Set them up like this:

- Do **not** run on PRs from forks. Do **not** use the `pull_request_target` trigger.
- Give the workflow minimal permissions: `contents: read`, `pull-requests: write`.
- Only allow team members to trigger the bot by mention (e.g. `@claude`).
- The only secret the workflow gets is the AI key/token.
- Pin the action to a version.

## Enforcement and GitHub plans

| | Public repo | Private repo |
|---|---|---|
| Free org | Rules enforced | Rules **not** enforced; CODEOWNERS still auto-requests reviewers; CI still runs |
| Team org (~$4/user/month) | Rules enforced | Rules enforced |

**Decision:** enforcement is a nice-to-have. On private repos with a Free plan, the team follows these rules by agreement. We do not need the Team plan for this.

## To do

- [ ] Add the PR template to each org's `.github` repo (see Part 6).
- [ ] Add `CODEOWNERS` with the high-risk list; turn on "Require review from Code Owners" for `main`.
- [ ] Set up Claude Code GitHub Action with the safety setup above; trial for 2–3 weeks.
- [ ] Set up Codex Security GitHub app; confirm cost/credits with our OpenAI plan.
- [ ] Use a team Anthropic API key (org secret) for the Claude action, not a personal subscription token.
