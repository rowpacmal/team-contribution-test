# Part 5 — Code Style

**Ticket:** OP#690 — Define Contribution rules and code Style Guide
**Status:** Decided
**Scope:** Shared standard (all projects); Edge Studio specifics marked

## Decision

**Tools decide style, CI enforces it.** No long written style guide.

- One formatter and one linter per language, all enforced in CI.
- A simple file naming rule, based on what the file is.
- One-time cleanup PRs to bring existing code in line.

## Tools per language

| Language | Formatter | Linter | Status (Edge Studio) |
|---|---|---|---|
| TypeScript / JavaScript | Prettier | ESLint (`--max-warnings=0`) | ESLint done (OP#524). Prettier installed but **not enforced**: 512 of ~930 files are not formatted. |
| Python | Ruff (format) | Ruff (lint) | Not set up (camera/sensor helpers, host-agent) |
| Shell | — | ShellCheck | Not set up (`install.sh`, `bin/edge-studio`); only `bash -n` today |

All tools are free and open source.

TypeScript `strict` mode stays on in every package (already the case).

## File naming

| What | Style | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `AppShell.tsx` |
| React hooks | `useSomething.ts` | `useMinimaResync.ts` |
| Everything else | `kebab-case.ts` | `data-sources.service.ts`, `automation-api.ts` |

Enforced with an ESLint filename rule after the one-time rename.

## Editor settings

Add a small `.editorconfig` (indentation, line endings, final newline) so every editor behaves the same.

## AI auto-format (optional convenience)

A Claude Code hook runs Prettier on each file right after the AI edits it, so formatting never fails CI.

## One-time cleanup (Edge Studio)

Do these right after the switch to trunk-based (Part 2), when no other work is open:

1. **Format PR:** run Prettier on everything. Add the commit to `.git-blame-ignore-revs` so `git blame` skips it.
2. **Rename PR:** rename files to the naming rule (AI does it; TypeScript and tests catch broken imports). Git keeps the history.
3. Then turn on the CI checks so it stays clean.

## Shared configs

ESLint, Prettier, Ruff, and `.editorconfig` settings move to the shared repo (see Part 6). Each project imports them and adds only project-specific rules.

## To do

- [ ] Add `prettier --check` to `npm run check` (after the format PR).
- [ ] Format PR + `.git-blame-ignore-revs`.
- [ ] Rename PR + ESLint filename rule.
- [ ] Add Ruff for Python code, in CI.
- [ ] Add ShellCheck for shell scripts, in CI.
- [ ] Add `.editorconfig`.
- [ ] Add the Claude Code Prettier hook (optional).
- [ ] Move configs to the shared repo (Part 6).
