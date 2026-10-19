---
name: after-merge
description: Clean up locally after a PR is merged on GitHub: switch to main, pull, delete merged branches, and report the release PR. Use when the user says they merged a PR, or asks for post-merge cleanup.
---

# After merge

Branch flow: CONTRIBUTING.md, Part 2. Release PR: Part 4.

1. Check the working tree is clean (`git status --short`). If not, stop and ask.
2. Update `main` and drop deleted remote branches:

   ```bash
   git switch main
   git pull --prune
   ```

3. Find local branches whose remote is gone: `git branch -vv | grep ': gone]'`.
   - Squash-merge means git doesn't see them as merged, so delete with `git branch -D`.
   - First check nothing would be lost: the branch tip must equal the merged PR's last commit.

     ```bash
     gh pr list --state merged --head <branch> --json number,headRefOid
     git rev-parse <branch>
     ```

     If there's no merged PR or the commits differ, show `git log --oneline <headRefOid>..<branch>` and ask.
4. Check the release PR: `gh pr list --label "autorelease: pending" --json number,title`. Give its title in one line, or say there is none (`docs`/`chore`/`refactor`/`test` merges don't make one). Its checks wait for "Approve workflows to run" until a release token is set.
5. Report in a few lines: current branch, branches deleted, release PR.

Don't merge the release PR. Point to the `release` skill if the user wants to ship.
