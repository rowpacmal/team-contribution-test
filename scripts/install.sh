#!/usr/bin/env bash
# Dummy installer: checks requirements and prints what it would do.
set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/opt/dummy-tool}"

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "error: '$1' is required" >&2
    exit 1
  fi
}

require curl
require tar

echo "Would install dummy-tool into ${INSTALL_DIR}"
