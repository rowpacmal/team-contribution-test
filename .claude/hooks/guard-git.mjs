#!/usr/bin/env node
// PreToolUse hook (Bash): stops Claude from changing `main` directly or making
// release tags by hand (CONTRIBUTING.md Parts 2 and 4). Exit 2 blocks the
// command and shows the reason to Claude. Humans follow the same rules by agreement.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const MAIN = "main";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const command = input.tool_input?.command ?? "";
let cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

function currentBranch(dir) {
  try {
    return execFileSync("git", ["-C", dir, "branch", "--show-current"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function block(reason) {
  process.stderr.write(
    `Blocked by .claude/hooks/guard-git.mjs: ${reason}\n` +
      "Work on a type/N-slug branch and open a PR (start-ticket, open-pr skills). " +
      "Tags come from release-please or the pre-release workflow (release skill).\n",
  );
  process.exit(2);
}

// Rough shell split: good enough for the commands Claude writes.
const segments = command
  .split(/&&|\|\||;|\||\n/)
  .map((s) => s.trim().split(/\s+/).filter(Boolean));

for (const tokens of segments) {
  if (tokens[0] === "cd" && tokens[1]) {
    cwd = path.resolve(cwd, tokens[1].replace(/^["']|["']$/g, ""));
    continue;
  }

  const gitIndex = tokens.indexOf("git");
  if (gitIndex === -1) continue;

  // Skip git's global options to find the subcommand.
  let dir = cwd;
  let i = gitIndex + 1;
  while (i < tokens.length && tokens[i].startsWith("-")) {
    if (tokens[i] === "-C") dir = path.resolve(cwd, tokens[++i] ?? ".");
    else if (tokens[i] === "-c") i++;
    i++;
  }
  const sub = tokens[i];
  const args = tokens.slice(i + 1);
  const positional = args.filter((a) => !a.startsWith("-"));
  const onMain = currentBranch(dir) === MAIN;

  if (
    ["commit", "merge", "cherry-pick", "revert", "rebase", "am"].includes(
      sub,
    ) &&
    onMain
  ) {
    block(`\`git ${sub}\` on ${MAIN}.`);
  }

  if (sub === "push") {
    if (
      args.some((a) =>
        ["--tags", "--follow-tags", "--mirror", "--all"].includes(a),
      )
    ) {
      block(`\`git push ${args.join(" ")}\` pushes tags or all branches.`);
    }
    const refspecs = positional.slice(1); // first positional is the remote
    for (const ref of refspecs) {
      const dest = ref.replace(/^\+/, "").split(":").pop();
      if (
        dest === MAIN ||
        dest === `refs/heads/${MAIN}` ||
        (dest === "HEAD" && onMain)
      ) {
        block(`push to ${MAIN}.`);
      }
      if (dest.startsWith("refs/tags/") || /^v\d/.test(dest))
        block(`push of tag \`${dest}\`.`);
    }
    if (refspecs.length === 0 && onMain) block(`push while on ${MAIN}.`);
  }

  if (sub === "tag") {
    const listing = [
      "-l",
      "--list",
      "-d",
      "--delete",
      "-v",
      "--verify",
      "--contains",
      "--points-at",
      "--merged",
      "--no-merged",
    ];
    if (!args.some((a) => listing.includes(a)) && positional.length > 0) {
      block(`creating tag \`${positional[0]}\` by hand.`);
    }
  }
}

process.exit(0);
