#!/usr/bin/env bash
# Dispatch a single scenario via cli-codex (gpt-5.5 medium fast read-only).
# Usage: dispatch-cli-codex.sh <scenario_id> <run_n> <prompt_file> <out_dir>
#   Captures output.txt + meta.json under <out_dir>/cli-codex-<run_n>/
set -euo pipefail

SCENARIO_ID="${1:?missing scenario_id}"
RUN_N="${2:?missing run_n}"
PROMPT_FILE="${3:?missing prompt_file}"
OUT_DIR="${4:?missing out_dir}"

CELL_DIR="${OUT_DIR}/cli-codex-${RUN_N}"
mkdir -p "$CELL_DIR"
cp "$PROMPT_FILE" "${CELL_DIR}/prompt.md"

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
START_EPOCH=$(python3 -c 'import time;print(int(time.time()*1000))')

# Skill default: gpt-5.5 medium fast read-only
set +e
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  --sandbox read-only \
  "$(cat "$PROMPT_FILE")" \
  </dev/null > "${CELL_DIR}/output.txt" 2>&1
EXIT_CODE=$?
set -e

END_EPOCH=$(python3 -c 'import time;print(int(time.time()*1000))')
COMPLETED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
LATENCY_MS=$((END_EPOCH - START_EPOCH))

# tokens not directly reported by codex exec; estimate via output size / 4
OUT_BYTES=$(wc -c < "${CELL_DIR}/output.txt")
EST_TOKENS_OUT=$((OUT_BYTES / 4))
PROMPT_BYTES=$(wc -c < "$PROMPT_FILE")
EST_TOKENS_IN=$((PROMPT_BYTES / 4))

cat > "${CELL_DIR}/meta.json" <<JSON
{
  "scenario_id": "${SCENARIO_ID}",
  "cli": "cli-codex",
  "run_n": ${RUN_N},
  "model": "gpt-5.5",
  "effort": "medium",
  "service_tier": "fast",
  "sandbox": "read-only",
  "started_at": "${STARTED_AT}",
  "completed_at": "${COMPLETED_AT}",
  "latency_ms": ${LATENCY_MS},
  "tokens_in_estimate": ${EST_TOKENS_IN},
  "tokens_out_estimate": ${EST_TOKENS_OUT},
  "exit_code": ${EXIT_CODE}
}
JSON

echo "[cli-codex/${SCENARIO_ID}/${RUN_N}] exit=${EXIT_CODE} latency=${LATENCY_MS}ms output=${OUT_BYTES}b"
