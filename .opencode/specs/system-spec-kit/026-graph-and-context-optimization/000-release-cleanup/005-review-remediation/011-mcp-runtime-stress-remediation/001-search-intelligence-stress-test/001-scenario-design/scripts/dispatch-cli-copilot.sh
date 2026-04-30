#!/usr/bin/env bash
# Dispatch a single scenario via cli-copilot (gpt-5.4 high allow-all-tools, max 3 concurrent).
# Usage: dispatch-cli-copilot.sh <scenario_id> <run_n> <prompt_file> <out_dir>
set -euo pipefail

SCENARIO_ID="${1:?missing scenario_id}"
RUN_N="${2:?missing run_n}"
PROMPT_FILE="${3:?missing prompt_file}"
OUT_DIR="${4:?missing out_dir}"

CELL_DIR="${OUT_DIR}/cli-copilot-${RUN_N}"
mkdir -p "$CELL_DIR"
cp "$PROMPT_FILE" "${CELL_DIR}/prompt.md"

# Concurrency guard: max 3 concurrent copilot processes per Phase 018 convention
WAITED=0
while [ "$(pgrep -f 'copilot' | grep -v $$ | wc -l | tr -d ' ')" -ge 3 ]; do
  sleep 2
  WAITED=$((WAITED + 2))
  if [ $WAITED -gt 120 ]; then
    echo "[cli-copilot/${SCENARIO_ID}/${RUN_N}] WARN: queued 120s, proceeding anyway" >&2
    break
  fi
done

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
START_EPOCH=$(python3 -c 'import time;print(int(time.time()*1000))')

# --effort high explicit per cli-codex review v2 P0/P1 (reproducibility — preferred over ~/.copilot/config.json)
set +e
copilot \
  -p "$(cat "$PROMPT_FILE")" \
  --model gpt-5.4 \
  --effort high \
  --allow-all-tools \
  --no-color \
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
  "cli": "cli-copilot",
  "run_n": ${RUN_N},
  "model": "gpt-5.4",
  "effort": "high",
  "started_at": "${STARTED_AT}",
  "completed_at": "${COMPLETED_AT}",
  "latency_ms": ${LATENCY_MS},
  "tokens_in_estimate": ${EST_TOKENS_IN},
  "tokens_out_estimate": ${EST_TOKENS_OUT},
  "exit_code": ${EXIT_CODE}
}
JSON

echo "[cli-copilot/${SCENARIO_ID}/${RUN_N}] exit=${EXIT_CODE} latency=${LATENCY_MS}ms output=${OUT_BYTES}b"
