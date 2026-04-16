#!/bin/bash
# Parallel driver for deep-review iterations (v2, prompt-file-based dispatch).
# Usage: parallel_driver.sh <start> <end> [concurrency] [stagger_seconds]

set -uo pipefail

START="${1:?start required}"
END="${2:?end required}"
CONCURRENCY="${3:-10}"
STAGGER="${4:-2}"

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs"
ABS_SPEC="$REPO/$SPEC"
DISPATCH="$ABS_SPEC/review/dispatch_iter_v2.sh"
REDUCER="$REPO/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs"
STATE="$ABS_SPEC/review/deep-review-state.jsonl"
DELTAS="$ABS_SPEC/review/deltas"
PROMPTS="$ABS_SPEC/review/prompts"
MERGED_MARKER="$DELTAS/.merged"
LOCK="$ABS_SPEC/review/.merge.lock"
BATCH_LOG="$ABS_SPEC/review/logs/parallel-${START}-${END}.log"

touch "$MERGED_MARKER"

schedule_dim() {
  local n=$1
  if [ "$n" -eq 1 ]; then echo "inventory"; return; fi
  if [ "$n" -eq 50 ]; then echo "final-sweep"; return; fi
  if [ "$n" -le 13 ]; then echo "correctness"; return; fi
  if [ "$n" -le 25 ]; then echo "security"; return; fi
  if [ "$n" -le 37 ]; then echo "traceability"; return; fi
  echo "maintainability"
}

schedule_subset() {
  local n=$1
  local block_idx=$(( (n - 2) % 12 ))
  case "$block_idx" in
    0)  echo "009" ;; 1) echo "010" ;; 2) echo "012" ;; 3) echo "014" ;;
    4)  echo "009+010" ;; 5) echo "012+014" ;; 6) echo "009+012" ;; 7) echo "010+014" ;;
    8)  echo "009+014" ;; 9) echo "010+012" ;; 10) echo "009+010+012" ;; 11) echo "010+012+014" ;;
    *)  echo "all-four" ;;
  esac
}

active_count() {
  pgrep -f 'bash .*dispatch_iter_v2.sh' 2>/dev/null | wc -l | tr -d ' '
}

launch_one() {
  local N=$1
  local NNN=$(printf "%03d" "$N")
  local ITER_FILE="$ABS_SPEC/review/iterations/iteration-$NNN.md"
  if [ -f "$ITER_FILE" ]; then
    echo "[$(date -u +%H:%M:%SZ)] iter $N: already present, skipping" >> "$BATCH_LOG"
    return 0
  fi
  local PROMPT_FILE="$PROMPTS/iter-$NNN.txt"
  if [ ! -s "$PROMPT_FILE" ]; then
    echo "[$(date -u +%H:%M:%SZ)] iter $N: no prompt file, skipping" >> "$BATCH_LOG"
    return 1
  fi
  local DIM SUBSET
  DIM=$(schedule_dim "$N")
  if [ "$N" -eq 1 ] || [ "$N" -eq 50 ]; then SUBSET="all-four"; else SUBSET=$(schedule_subset "$N"); fi
  echo "[$(date -u +%H:%M:%SZ)] iter $N: launch dim=$DIM subset=$SUBSET" >> "$BATCH_LOG"
  ( bash "$DISPATCH" "$N" "$DIM" "$SUBSET" "$PROMPT_FILE" >/dev/null 2>&1; echo "[$(date -u +%H:%M:%SZ)] iter $N done rc=$?" >> "$BATCH_LOG" ) &
  return 0
}

merge_pending_deltas() {
  # macOS has no flock; use mkdir as a cheap mutex instead
  local lockdir="${LOCK}.d"
  mkdir "$lockdir" 2>/dev/null || return 0
  trap "rmdir '$lockdir' 2>/dev/null" RETURN
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

echo "=== parallel driver start: $(date -u +%Y-%m-%dT%H:%M:%SZ) range=$START..$END concurrency=$CONCURRENCY stagger=${STAGGER}s ===" >> "$BATCH_LOG"

N=$START
while [ "$N" -le "$END" ]; do
  current=$(active_count)
  if [ "$current" -lt "$CONCURRENCY" ]; then
    launch_one "$N" && sleep "$STAGGER"
    N=$(( N + 1 ))
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
  echo "[$(date -u +%H:%M:%SZ)] running final reducer" >> "$BATCH_LOG"
  node "$REDUCER" "$ABS_SPEC" >> "$BATCH_LOG" 2>&1 || echo "reducer-warn" >> "$BATCH_LOG"
fi

echo "=== parallel driver end: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" >> "$BATCH_LOG"
