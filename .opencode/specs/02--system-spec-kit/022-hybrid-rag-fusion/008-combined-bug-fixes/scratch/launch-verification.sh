#!/usr/bin/env bash
# launch-verification.sh — 30-agent code verification for Spec 012/013 + last 15 commits
# Created: 2026-03-08
# Agents: 20 Opus 4.6 (via Claude Code Agent tool) + 10 gpt-5.4 (via Codex CLI)
#
# Usage: This script documents the verification plan. Actual execution is
# orchestrated by the Claude Code session dispatching agents in 6 waves.

set -euo pipefail

BASE="$(cd "$(dirname "$0")/../../../.." && pwd)"
SK="$BASE/.opencode/skill/system-spec-kit"
SCRATCH="$(dirname "$0")"

# --- Codex CLI launcher for 10 gpt-5.4 agents ---
launch_codex() {
  local agent_id="$1"
  local prompt="$2"
  local output_file="$SCRATCH/verify-${agent_id}.md"

  codex -p "$prompt" --model gpt-5.4 --allow-all-tools 2>&1 > "$output_file"
  echo "[$agent_id] Done → $output_file"
}

# --- Wave Plan ---
# Wave 1 (Opus): A01 A02 A03 B01 B02  — Cross-commit regression + Spec 012
# Wave 2 (Opus): C01 C02 C03 D01 D02  — Spec 013 new code + Security
# Wave 3 (Codex): E01 E02 E03 F01 F02 — TypeScript build + Tests
# Wave 4 (Mixed): G01 G02 G03 G04 F03 — Import/export consistency
# Wave 5 (Mixed): H01 H02 H03 I01 I02 — README accuracy + Spec alignment
# Wave 6 (Opus): I03 I04 I05 I06 I07  — Integration cross-checks

# --- Output files: scratch/verify-{A01..I07}.md ---
# --- Synthesis: scratch/verification-synthesis.md ---
