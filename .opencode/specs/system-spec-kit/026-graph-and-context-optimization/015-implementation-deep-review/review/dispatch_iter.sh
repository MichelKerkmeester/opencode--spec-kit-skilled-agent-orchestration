#!/bin/bash
# Parallel-safe dispatch for one code-review iteration via copilot CLI.
# Usage: dispatch_iter.sh <iter> <dim> <subset> [prompt_file]
set -uo pipefail

ITER="${1:?iter required}"
DIM="${2:?dim required}"
SUBSET="${3:-all}"

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review"
ABS_SPEC="$REPO/$SPEC"
NNN=$(printf "%03d" "$ITER")
ITER_FILE="$ABS_SPEC/review/iterations/iteration-$NNN.md"
DELTA_FILE="$ABS_SPEC/review/deltas/iter-$NNN.jsonl"
LOG_FILE="$ABS_SPEC/review/logs/iter-$NNN.log"
PROMPT_FILE="${4:-$ABS_SPEC/review/prompts/iter-$NNN.txt}"

cd "$REPO"

if [ ! -s "$PROMPT_FILE" ]; then
  echo "[$(date -u +%H:%M:%SZ)] FATAL iter=$ITER missing prompt: $PROMPT_FILE" >> "$LOG_FILE"
  exit 3
fi

PROMPT_CONTENT=$(<"$PROMPT_FILE")
if [ -z "$PROMPT_CONTENT" ]; then
  echo "[$(date -u +%H:%M:%SZ)] FATAL iter=$ITER empty prompt" >> "$LOG_FILE"
  exit 3
fi

{
  echo "=== dispatch iter $ITER / dim=$DIM / subset=$SUBSET ==="
  echo "=== prompt: $PROMPT_FILE ($(wc -c <"$PROMPT_FILE") bytes) ==="
  echo "=== start: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
} >> "$LOG_FILE"

# Record PID for cleanup
copilot -p "$PROMPT_CONTENT" \
  --model gpt-5.4 \
  --effort high \
  --allow-all-tools \
  --add-dir "$REPO" \
  --log-level warning \
  >> "$LOG_FILE" 2>&1
RC=$?

echo "=== end: $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$RC ===" >> "$LOG_FILE"

if [ ! -f "$ITER_FILE" ] || [ ! -f "$DELTA_FILE" ]; then
  echo "MISSING_OUTPUT iter=$ITER iter_file=$([ -f "$ITER_FILE" ] && echo yes || echo no) delta_file=$([ -f "$DELTA_FILE" ] && echo yes || echo no)" >> "$LOG_FILE"
  exit 2
fi
exit $RC
