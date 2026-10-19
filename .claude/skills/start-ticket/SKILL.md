---
name: start-ticket
description: Start work on a ticket or task by creating a correctly named branch from the latest main. Use when the user starts a new ticket, feature, fix, or chore, or asks for a new branch.
---

# Start ticket

Branch naming rules: CONTRIBUTING.md, Part 2 "Branch naming". Types: Part 1 "Types".

1. Get the ticket number (`N`) from the user. If there is no ticket, leave it out. Don't guess a number.
2. Pick the type from what the work is, using Part 1's table. If it's unclear between `feat`/`fix` and an internal type, ask: it decides whether the change goes in the changelog.
3. Make a short slug: 2–4 lowercase words joined by `-`.
4. Check the working tree is clean (`git status --short`). If not, stop and ask.
5. Create the branch from the latest `main`:

   ```bash
   git fetch origin
   git switch -c <type>/<N>-<slug> origin/main
   ```

6. Tell the user the branch name in one line.

OpenProject is not connected here, so don't try to move the ticket status. Remind the user if it matters.
