#!/usr/bin/env bash
# PostToolUse hook: formats the file Claude just edited, so formatting never
# fails CI (CONTRIBUTING.md Part 5). Never blocks: missing tools are skipped.
set -uo pipefail

input=$(cat)
if command -v node >/dev/null 2>&1; then
  file=$(node -e 'console.log(JSON.parse(process.argv[1]).tool_input?.file_path ?? "")' "$input")
elif command -v python3 >/dev/null 2>&1; then
  file=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1]).get("tool_input", {}).get("file_path", ""))' "$input")
else
  exit 0
fi
[ -n "$file" ] && [ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

case "$file" in
  *.py)
    if command -v ruff >/dev/null 2>&1; then
      ruff format --quiet "$file"
    elif command -v uvx >/dev/null 2>&1; then
      uvx -q ruff@0.17.1 format --quiet "$file"
    fi
    ;;
  *)
    if [ -x node_modules/.bin/prettier ]; then
      node_modules/.bin/prettier --write --ignore-unknown --log-level warn "$file"
    fi
    ;;
esac

exit 0
