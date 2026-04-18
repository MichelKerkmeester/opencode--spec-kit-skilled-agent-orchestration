#!/bin/bash
# Dispatch a single implementation batch to copilot CLI.
# Usage: dispatch_batch.sh <batch_id>
# Runs copilot on the current branch — NO git checkout (parallel-safe).
# The orchestrator handles commits after completion.
set -uo pipefail

BATCH_ID="${1:?batch_id required}"

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-packets-009-014-audit"
ABS_SPEC="$REPO/$SPEC"
CONFIG="$ABS_SPEC/dispatch/batch_config.json"
PROMPT_FILE="$ABS_SPEC/dispatch/prompts/batch-${BATCH_ID}.txt"
LOG_FILE="$ABS_SPEC/dispatch/logs/batch-${BATCH_ID}.log"

cd "$REPO"

# Validate prompt exists
if [ ! -s "$PROMPT_FILE" ]; then
  echo "[$(date -u +%H:%M:%SZ)] FATAL batch=$BATCH_ID missing prompt: $PROMPT_FILE" >> "$LOG_FILE"
  exit 3
fi

PROMPT_CONTENT=$(<"$PROMPT_FILE")
if [ -z "$PROMPT_CONTENT" ]; then
  echo "[$(date -u +%H:%M:%SZ)] FATAL batch=$BATCH_ID empty prompt" >> "$LOG_FILE"
  exit 3
fi

{
  echo "=== dispatch batch $BATCH_ID ==="
  echo "=== prompt: $PROMPT_FILE ($(wc -c <"$PROMPT_FILE") bytes) ==="
  echo "=== start: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
  echo "=== branch: $(git branch --show-current 2>/dev/null) ==="
} >> "$LOG_FILE"

# Dispatch to copilot — no git checkout, works on current branch
copilot -p "$PROMPT_CONTENT" \
  --model gpt-5.4 \
  --effort high \
  --allow-all-tools \
  --add-dir "$REPO" \
  --log-level warning \
  >> "$LOG_FILE" 2>&1
RC=$?

echo "=== end: $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$RC ===" >> "$LOG_FILE"

exit $RC
