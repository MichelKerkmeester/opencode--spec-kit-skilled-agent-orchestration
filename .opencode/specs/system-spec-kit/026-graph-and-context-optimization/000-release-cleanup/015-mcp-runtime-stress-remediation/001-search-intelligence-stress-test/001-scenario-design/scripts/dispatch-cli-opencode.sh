#!/usr/bin/env bash
# Dispatch a single scenario via cli-opencode (full Spec Kit Memory MCP).
# Usage: dispatch-cli-opencode.sh <scenario_id> <run_n> <prompt_file> <out_dir> [agent_slug]
#   agent_slug defaults to "general" (full tool access). Pass "context" for ablation cell.
set -euo pipefail

SCENARIO_ID="${1:?missing scenario_id}"
RUN_N="${2:?missing run_n}"
PROMPT_FILE="${3:?missing prompt_file}"
OUT_DIR="${4:?missing out_dir}"
AGENT="${5:-general}"
ABLATION_MODE="${6:-none}"   # "none" | "pure" — pure disables ALL plugins (cli-codex review P0 fix)

# Self-invocation guard: do NOT dispatch opencode if we're already inside opencode
if env | grep -q '^OPENCODE_'; then
  echo "[cli-opencode/${SCENARIO_ID}/${RUN_N}] SKIPPED: self-invocation guard tripped (inside OpenCode)" >&2
  exit 99
fi

LABEL="cli-opencode"
if [ "$ABLATION_MODE" = "pure" ]; then
  LABEL="cli-opencode-pure"
elif [ "$AGENT" != "general" ]; then
  LABEL="cli-opencode-${AGENT}"
fi

CELL_DIR="${OUT_DIR}/${LABEL}-${RUN_N}"
mkdir -p "$CELL_DIR"
cp "$PROMPT_FILE" "${CELL_DIR}/prompt.md"

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
START_EPOCH=$(python3 -c 'import time;print(int(time.time()*1000))')

PURE_FLAG=""
if [ "$ABLATION_MODE" = "pure" ]; then
  PURE_FLAG="--pure"   # disables plugins; isolates model quality from full-MCP advantage (cli-codex review P0)
fi

set +e
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent "$AGENT" \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  $PURE_FLAG \
  "$(cat "$PROMPT_FILE")" \
  </dev/null > "${CELL_DIR}/output.txt" 2>&1
EXIT_CODE=$?
set -e

END_EPOCH=$(python3 -c 'import time;print(int(time.time()*1000))')
COMPLETED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LATENCY_MS=$((END_EPOCH - START_EPOCH))

OUT_BYTES=$(wc -c < "${CELL_DIR}/output.txt")
EST_TOKENS_OUT=$((OUT_BYTES / 4))
PROMPT_BYTES=$(wc -c < "$PROMPT_FILE")
EST_TOKENS_IN=$((PROMPT_BYTES / 4))

cat > "${CELL_DIR}/meta.json" <<JSON
{
  "scenario_id": "${SCENARIO_ID}",
  "cli": "${LABEL}",
  "run_n": ${RUN_N},
  "model": "opencode-go/deepseek-v4-pro",
  "agent": "${AGENT}",
  "variant": "high",
  "format": "json",
  "ablation_mode": "${ABLATION_MODE}",
  "pure_flag": "${PURE_FLAG}",
  "started_at": "${STARTED_AT}",
  "completed_at": "${COMPLETED_AT}",
  "latency_ms": ${LATENCY_MS},
  "tokens_in_estimate": ${EST_TOKENS_IN},
  "tokens_out_estimate": ${EST_TOKENS_OUT},
  "exit_code": ${EXIT_CODE}
}
JSON

echo "[${LABEL}/${SCENARIO_ID}/${RUN_N}] exit=${EXIT_CODE} latency=${LATENCY_MS}ms output=${OUT_BYTES}b"
