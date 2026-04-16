#!/bin/bash
# Parallel driver for code-review iterations, concurrency 3, with cleanup.
# Usage: parallel_driver.sh <start> <end> [concurrency] [stagger_seconds]
set -uo pipefail

START="${1:?start required}"
END="${2:?end required}"
CONCURRENCY="${3:-3}"
STAGGER="${4:-3}"

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review"
ABS_SPEC="$REPO/$SPEC"
DISPATCH="$ABS_SPEC/review/dispatch_iter.sh"
REDUCER="$REPO/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs"
STATE="$ABS_SPEC/review/deep-review-state.jsonl"
DELTAS="$ABS_SPEC/review/deltas"
MERGED_MARKER="$DELTAS/.merged"
BATCH_LOG="$ABS_SPEC/review/logs/parallel-${START}-${END}.log"

touch "$MERGED_MARKER"

# Schedule: read from pre-generated prompt files (already contain dim/subset)
dim_for() {
  local n=$1
  if [ "$n" -le 4 ]; then echo "inventory"; return; fi
  if [ "$n" -le 18 ]; then echo "correctness"; return; fi
  if [ "$n" -le 28 ]; then echo "security"; return; fi
  if [ "$n" -le 36 ]; then echo "traceability"; return; fi
  if [ "$n" -le 44 ]; then echo "maintainability"; return; fi
  if [ "$n" -le 50 ]; then echo "test-quality"; return; fi
  echo "operational-docs"
}

active_count() {
  pgrep -f 'bash .*016-implementation-deep-review.*dispatch_iter' 2>/dev/null | wc -l | tr -d ' '
}

merge_pending_deltas() {
  local lockdir="$ABS_SPEC/review/.merge.lock.d"
  mkdir "$lockdir" 2>/dev/null || return 0
  for delta in $(ls -1 "$DELTAS"/iter-*.jsonl 2>/dev/null | sort); do
    local fname=$(basename "$delta")
    if ! grep -Fq "$fname" "$MERGED_MARKER" 2>/dev/null; then
      if [ -s "$delta" ]; then
        cat "$delta" >> "$STATE"
        printf '\n' >> "$STATE"
      fi
      echo "$fname" >> "$MERGED_MARKER"
    fi
  done
  rmdir "$lockdir" 2>/dev/null
}

# Cleanup on exit
cleanup() {
  pkill -P $$ 2>/dev/null
  merge_pending_deltas
}
trap cleanup EXIT TERM INT

echo "=== parallel driver start: $(date -u +%Y-%m-%dT%H:%M:%SZ) range=$START..$END concurrency=$CONCURRENCY ===" >> "$BATCH_LOG"

N=$START
while [ "$N" -le "$END" ]; do
  NNN=$(printf "%03d" "$N")
  ITER_FILE="$ABS_SPEC/review/iterations/iteration-$NNN.md"
  if [ -f "$ITER_FILE" ]; then
    echo "[$(date -u +%H:%M:%SZ)] iter $N: exists, skip" >> "$BATCH_LOG"
    N=$(( N + 1 ))
    continue
  fi
  current=$(active_count)
  if [ "$current" -lt "$CONCURRENCY" ]; then
    DIM=$(dim_for "$N")
    echo "[$(date -u +%H:%M:%SZ)] iter $N: launch dim=$DIM" >> "$BATCH_LOG"
    ( bash "$DISPATCH" "$N" "$DIM" "auto" >/dev/null 2>&1; echo "[$(date -u +%H:%M:%SZ)] iter $N done rc=$?" >> "$BATCH_LOG" ) &
    N=$(( N + 1 ))
    sleep "$STAGGER"
    merge_pending_deltas
  else
    sleep 10
    merge_pending_deltas
  fi
done

# Drain
while [ "$(active_count)" -gt 0 ]; do
  sleep 10
  merge_pending_deltas
done

merge_pending_deltas

if [ -f "$REDUCER" ]; then
  echo "[$(date -u +%H:%M:%SZ)] final reducer" >> "$BATCH_LOG"
  node "$REDUCER" "$ABS_SPEC" >> "$BATCH_LOG" 2>&1 || true
fi

echo "=== parallel driver end: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" >> "$BATCH_LOG"
