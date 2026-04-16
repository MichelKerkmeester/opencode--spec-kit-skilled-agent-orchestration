#!/bin/bash
# Batch driver for the combined deep review loop.
# Runs a contiguous range of iterations sequentially, dispatching each to the copilot CLI.
#
# Usage: batch_driver.sh <start_iter> <end_iter>
#   Processes iterations start..end inclusive using the planned dimension schedule.
#
# Planned schedule:
#   1        : inventory    / all-four
#   2..13    : correctness  / rotate [009, 010, 012, 014, 009+010, 012+014, ...]
#   14..25   : security     / rotate
#   26..37   : traceability / rotate
#   38..49   : maintainability / rotate
#   50       : final-sweep  / all-four

set -uo pipefail

START="${1:?start iter required}"
END="${2:?end iter required}"

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs"
ABS_SPEC="$REPO/$SPEC"
BATCH_LOG="$ABS_SPEC/review/logs/batch-${START}-${END}.log"

dispatch_script="$ABS_SPEC/review/dispatch_iter.sh"
reducer="$REPO/.opencode/skill/sk-deep-review/scripts/reduce-state.cjs"

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
    0)  echo "009" ;;
    1)  echo "010" ;;
    2)  echo "012" ;;
    3)  echo "014" ;;
    4)  echo "009+010" ;;
    5)  echo "012+014" ;;
    6)  echo "009+012" ;;
    7)  echo "010+014" ;;
    8)  echo "009+014" ;;
    9)  echo "010+012" ;;
    10) echo "009+010+012" ;;
    11) echo "010+012+014" ;;
    *)  echo "all-four" ;;
  esac
}

{
  echo "=== Batch driver start: $(date -u +%Y-%m-%dT%H:%M:%SZ) range=$START..$END ==="
} | tee -a "$BATCH_LOG"

FAIL_STREAK=0
for (( N=START; N<=END; N++ )); do
  # Skip if already done (iteration file present)
  NNN=$(printf "%03d" "$N")
  ITER_FILE="$ABS_SPEC/review/iterations/iteration-$NNN.md"
  if [ -f "$ITER_FILE" ]; then
    echo "[$(date -u +%H:%M:%SZ)] iter $N: already present, skipping" | tee -a "$BATCH_LOG"
    continue
  fi

  DIM=$(schedule_dim "$N")
  if [ "$N" -eq 1 ] || [ "$N" -eq 50 ]; then
    SUBSET="all-four"
  else
    SUBSET=$(schedule_subset "$N")
  fi

  echo "[$(date -u +%H:%M:%SZ)] iter $N: dim=$DIM subset=$SUBSET — dispatching" | tee -a "$BATCH_LOG"
  bash "$dispatch_script" "$N" "$DIM" "$SUBSET" >>"$BATCH_LOG" 2>&1
  RC=$?
  if [ $RC -ne 0 ]; then
    echo "[$(date -u +%H:%M:%SZ)] iter $N: FAIL rc=$RC" | tee -a "$BATCH_LOG"
    FAIL_STREAK=$(( FAIL_STREAK + 1 ))
    if [ $FAIL_STREAK -ge 3 ]; then
      echo "[$(date -u +%H:%M:%SZ)] 3 consecutive failures — halting batch" | tee -a "$BATCH_LOG"
      break
    fi
    continue
  else
    FAIL_STREAK=0
  fi

  # Run reducer to refresh findings registry + dashboard
  if [ -f "$reducer" ]; then
    echo "[$(date -u +%H:%M:%SZ)] iter $N: running reducer" | tee -a "$BATCH_LOG"
    node "$reducer" "$ABS_SPEC" >>"$BATCH_LOG" 2>&1 || echo "[$(date -u +%H:%M:%SZ)] reducer warn rc=$?" | tee -a "$BATCH_LOG"
  fi

  echo "[$(date -u +%H:%M:%SZ)] iter $N: done" | tee -a "$BATCH_LOG"
done

echo "=== Batch driver end: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$BATCH_LOG"
