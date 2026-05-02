#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SANDBOX_DIR="/tmp/cp-deep-review-sandbox"

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

require_path "${REPO_ROOT}/.opencode/command/spec_kit"
require_path "${REPO_ROOT}/.opencode/skill/sk-deep-review"
require_path "${REPO_ROOT}/.opencode/skill/system-spec-kit"
require_path "${REPO_ROOT}/.opencode/skill/sk-code-review"
require_path "${REPO_ROOT}/.opencode/agent/deep-review.md"
require_path "${REPO_ROOT}/.claude/agents/deep-review.md"
require_path "${REPO_ROOT}/.gemini/agents/deep-review.md"
require_path "${REPO_ROOT}/.codex/agents/deep-review.toml"

rm -rf "$SANDBOX_DIR"
mkdir -p "$SANDBOX_DIR"

copy_dir "${REPO_ROOT}/.opencode/command/spec_kit" "${SANDBOX_DIR}/.opencode/command/spec_kit"
copy_dir "${REPO_ROOT}/.opencode/skill/sk-deep-review" "${SANDBOX_DIR}/.opencode/skill/sk-deep-review"
copy_dir "${REPO_ROOT}/.opencode/skill/system-spec-kit" "${SANDBOX_DIR}/.opencode/skill/system-spec-kit"
copy_dir "${REPO_ROOT}/.opencode/skill/sk-code-review" "${SANDBOX_DIR}/.opencode/skill/sk-code-review"

copy_file "${REPO_ROOT}/.opencode/agent/deep-review.md" "${SANDBOX_DIR}/.opencode/agent/deep-review.md"
copy_file "${REPO_ROOT}/.claude/agents/deep-review.md" "${SANDBOX_DIR}/.claude/agents/deep-review.md"
copy_file "${REPO_ROOT}/.gemini/agents/deep-review.md" "${SANDBOX_DIR}/.gemini/agents/deep-review.md"
copy_file "${REPO_ROOT}/.codex/agents/deep-review.toml" "${SANDBOX_DIR}/.codex/agents/deep-review.toml"

mkdir -p "${SANDBOX_DIR}/targets"
cat > "${SANDBOX_DIR}/targets/review-target.js" <<'TARGET'
export function normalizeUser(user) {
  if (!user) return { id: "anonymous", role: "guest" };
  return { id: String(user.id), role: user.role || "guest" };
}
TARGET
cat > "${SANDBOX_DIR}/targets/review-target.test.js" <<'TARGET'
import { normalizeUser } from "./review-target.js";

if (normalizeUser({ id: 42 }).id !== "42") {
  throw new Error("normalizeUser should coerce id to string");
}
TARGET

echo "Created deep-review CP sandbox at ${SANDBOX_DIR}"
