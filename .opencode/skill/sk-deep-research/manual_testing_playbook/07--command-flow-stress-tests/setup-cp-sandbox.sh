#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SANDBOX_DIR="/tmp/cp-deep-research-sandbox"

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

require_path "${REPO_ROOT}/.opencode/command/spec_kit/deep-research.md"
require_path "${REPO_ROOT}/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml"
require_path "${REPO_ROOT}/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml"
require_path "${REPO_ROOT}/.opencode/skill/sk-deep-research"
require_path "${REPO_ROOT}/.opencode/skill/system-spec-kit"
require_path "${REPO_ROOT}/.opencode/agent/deep-research.md"
require_path "${REPO_ROOT}/.claude/agents/deep-research.md"
require_path "${REPO_ROOT}/.gemini/agents/deep-research.md"
require_path "${REPO_ROOT}/.codex/agents/deep-research.toml"

rm -rf "$SANDBOX_DIR"
mkdir -p "$SANDBOX_DIR"

copy_dir "${REPO_ROOT}/.opencode/command/spec_kit" "${SANDBOX_DIR}/.opencode/command/spec_kit"
copy_dir "${REPO_ROOT}/.opencode/skill/sk-deep-research" "${SANDBOX_DIR}/.opencode/skill/sk-deep-research"
copy_dir "${REPO_ROOT}/.opencode/skill/system-spec-kit" "${SANDBOX_DIR}/.opencode/skill/system-spec-kit"

copy_file "${REPO_ROOT}/.opencode/agent/deep-research.md" "${SANDBOX_DIR}/.opencode/agent/deep-research.md"
copy_file "${REPO_ROOT}/.claude/agents/deep-research.md" "${SANDBOX_DIR}/.claude/agents/deep-research.md"
copy_file "${REPO_ROOT}/.gemini/agents/deep-research.md" "${SANDBOX_DIR}/.gemini/agents/deep-research.md"
copy_file "${REPO_ROOT}/.codex/agents/deep-research.toml" "${SANDBOX_DIR}/.codex/agents/deep-research.toml"

if [[ -e "${REPO_ROOT}/.gemini/commands/spec_kit/deep-research.toml" ]]; then
  copy_file "${REPO_ROOT}/.gemini/commands/spec_kit/deep-research.toml" "${SANDBOX_DIR}/.gemini/commands/spec_kit/deep-research.toml"
fi

echo "Created deep-research command sandbox at ${SANDBOX_DIR}"
