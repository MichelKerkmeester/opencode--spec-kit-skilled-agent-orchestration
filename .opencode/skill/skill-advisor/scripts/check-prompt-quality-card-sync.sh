#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: PROMPT QUALITY CARD SYNC CHECK
# ───────────────────────────────────────────────────────────────
# Verifies that prompt quality framework tables stay in sync across CLI skills.
#
# Usage: check-prompt-quality-card-sync.sh [repo-root]
set -euo pipefail

ROOT="${1:-.}"

files=(
  "$ROOT/.opencode/skill/sk-improve-prompt/assets/cli_prompt_quality_card.md"
  "$ROOT/.opencode/skill/cli-claude-code/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skill/cli-codex/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skill/cli-copilot/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skill/cli-gemini/assets/prompt_quality_card.md"
)

extract_table() {
  awk '
    /^## .*Framework Selection Table/ { in_section=1; next }
    in_section && /^## / && seen_table { exit }
    in_section && /^\|/ { print; seen_table=1; next }
    in_section && seen_table && !/^\|/ && $0 == "" { next }
  ' "$1"
}

baseline_hash=""
baseline_file=""

for file in "${files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "MISSING: $file" >&2
    exit 1
  fi

  table="$(extract_table "$file")"
  if [[ -z "$table" ]]; then
    echo "NO FRAMEWORK TABLE: $file" >&2
    exit 1
  fi

  hash="$(printf '%s\n' "$table" | shasum -a 256 | awk '{print $1}')"
  echo "$hash  $file"

  if [[ -z "$baseline_hash" ]]; then
    baseline_hash="$hash"
    baseline_file="$file"
    continue
  fi

  if [[ "$hash" != "$baseline_hash" ]]; then
    echo "DRIFT DETECTED: $file differs from $baseline_file" >&2
    exit 1
  fi
done

echo "SYNC OK"
