#!/bin/bash
# Dispatch a single implementation batch to copilot CLI.
# Usage: dispatch_batch.sh <batch_id>
# Creates a git branch, runs copilot, records results.
set -uo pipefail

BATCH_ID="${1:?batch_id required}"

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-implementation-deep-review"
ABS_SPEC="$REPO/$SPEC"
CONFIG="$ABS_SPEC/dispatch/batch_config.json"
PROMPT_FILE="$ABS_SPEC/dispatch/prompts/batch-${BATCH_ID}.txt"
LOG_FILE="$ABS_SPEC/dispatch/logs/batch-${BATCH_ID}.log"
WORK_BRANCH="remedy/015-deep-review"

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
} >> "$LOG_FILE"

# Create batch branch from work branch
git checkout "$WORK_BRANCH" 2>/dev/null
if git branch --list "remedy/$BATCH_ID" | grep -q "remedy/$BATCH_ID"; then
  echo "[$(date -u +%H:%M:%SZ)] Branch remedy/$BATCH_ID exists, reusing" >> "$LOG_FILE"
  git checkout "remedy/$BATCH_ID" 2>/dev/null
else
  git checkout -b "remedy/$BATCH_ID" "$WORK_BRANCH" 2>/dev/null
fi

# Dispatch to copilot
copilot -p "$PROMPT_CONTENT" \
  --model gpt-5.4 \
  --effort high \
  --allow-all-tools \
  --add-dir "$REPO" \
  --log-level warning \
  >> "$LOG_FILE" 2>&1
RC=$?

echo "=== end: $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$RC ===" >> "$LOG_FILE"

# Stage all changes on batch branch
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  DESCRIPTION=$(python3 -c "import json; print(json.load(open('$CONFIG'))['batches']['$BATCH_ID']['description'])" 2>/dev/null || echo "$BATCH_ID")
  git commit -m "remedy($BATCH_ID): $DESCRIPTION" --no-verify 2>/dev/null
  echo "[$(date -u +%H:%M:%SZ)] Committed changes on remedy/$BATCH_ID" >> "$LOG_FILE"
else
  echo "[$(date -u +%H:%M:%SZ)] No changes detected for $BATCH_ID" >> "$LOG_FILE"
fi

# Return to work branch
git checkout "$WORK_BRANCH" 2>/dev/null

exit $RC
