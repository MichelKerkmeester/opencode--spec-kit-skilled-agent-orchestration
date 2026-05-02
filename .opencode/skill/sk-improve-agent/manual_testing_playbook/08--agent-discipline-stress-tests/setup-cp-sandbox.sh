#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SANDBOX_DIR="/tmp/cp-improve-sandbox"
FIXTURE_ROOT="${REPO_ROOT}/.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test"

usage() {
  echo "Usage: setup-cp-sandbox.sh [--sandbox-dir PATH]"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sandbox-dir)
      if [[ $# -lt 2 || -z "${2:-}" ]]; then
        echo "ERROR: --sandbox-dir requires a path" >&2
        exit 2
      fi
      SANDBOX_DIR="$2"
      shift 2
      ;;
    --sandbox-dir=*)
      SANDBOX_DIR="${1#--sandbox-dir=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

require_path() {
  local path="$1"
  [[ -e "$path" ]] && return 0
  echo "ERROR: required path not found: $path" >&2
  exit 1
}

copy_dir() {
  local source="$1"
  local target="$2"
  require_path "$source"
  rm -rf "$target"
  mkdir -p "$(dirname "$target")"
  cp -a "$source" "$target"
}

copy_file() {
  local source="$1"
  local target="$2"
  require_path "$source"
  mkdir -p "$(dirname "$target")"
  cp "$source" "$target"
}

require_path "${REPO_ROOT}/.opencode/command/improve"
require_path "${REPO_ROOT}/.opencode/skill/sk-improve-agent"
require_path "${FIXTURE_ROOT}/.opencode/agent/cp-improve-target.md"
require_path "${FIXTURE_ROOT}/.claude/agents/cp-improve-target.md"
require_path "${FIXTURE_ROOT}/.gemini/agents/cp-improve-target.md"
require_path "${FIXTURE_ROOT}/.codex/agents/cp-improve-target.toml"

rm -rf "$SANDBOX_DIR"
mkdir -p "$SANDBOX_DIR"

copy_dir "${REPO_ROOT}/.opencode/command/improve" "${SANDBOX_DIR}/.opencode/command/improve"
copy_dir "${REPO_ROOT}/.opencode/skill/sk-improve-agent" "${SANDBOX_DIR}/.opencode/skill/sk-improve-agent"

copy_file "${FIXTURE_ROOT}/.opencode/agent/cp-improve-target.md" "${SANDBOX_DIR}/.opencode/agent/cp-improve-target.md"
copy_file "${FIXTURE_ROOT}/.claude/agents/cp-improve-target.md" "${SANDBOX_DIR}/.claude/agents/cp-improve-target.md"
copy_file "${FIXTURE_ROOT}/.gemini/agents/cp-improve-target.md" "${SANDBOX_DIR}/.gemini/agents/cp-improve-target.md"
copy_file "${FIXTURE_ROOT}/.codex/agents/cp-improve-target.toml" "${SANDBOX_DIR}/.codex/agents/cp-improve-target.toml"

echo "Created improve-agent sandbox at ${SANDBOX_DIR}"
