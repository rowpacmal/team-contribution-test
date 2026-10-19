---
name: open-pr
description: Push the current branch and open a GitHub PR into main with a Part 1 title and the PR template filled in. Use when the user asks to open, create, or submit a PR.
---

# Open PR

PR rules: CONTRIBUTING.md, Part 3 "Rules for every PR". Template: `.github/pull_request_template.md`.

1. Check you're not on `main` and the tree is clean. Commit leftover changes only if the user asked.
2. Check the size: `git diff --stat origin/main...HEAD`. If well over ~400 changed lines (not counting tests, generated files, or pure deletions), tell the user and suggest a split. Don't block.
3. Write the title with the `commit-message` skill.
4. Fill in every template section from the actual diff and what was really run:
   - **Verification:** only what was actually run or tested. If nothing was, say so.
   - **Checklist:** tick only what is true.
   - Add a `BEGIN_COMMIT_OVERRIDE` block if the PR has several user-facing changes (Part 4).
5. Push and create:

   ```bash
   git push -u origin HEAD
   gh pr create --base main --title "<title>" --body "<filled template>"
   ```

   Add `--draft` if the work isn't finished.

6. Check the title check started: `gh pr checks <number> --watch`. If it fails, fix the title with `gh pr edit <number> --title "..."`.
7. Give the user the PR URL. Don't merge unless asked; the author merges (Part 3).
