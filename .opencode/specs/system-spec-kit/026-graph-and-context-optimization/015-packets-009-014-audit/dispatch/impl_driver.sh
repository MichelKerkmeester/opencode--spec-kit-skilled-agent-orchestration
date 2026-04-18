#!/bin/bash
# Implementation batch driver — orchestrates 28 batches in 6 waves via copilot CLI.
# Usage: impl_driver.sh [--wave N|all]
# Concurrency: max 3 copilot agents (GitHub API hard limit).
set -uo pipefail

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-packets-009-014-audit"
ABS_SPEC="$REPO/$SPEC"
DISPATCH="$ABS_SPEC/dispatch/dispatch_batch.sh"
VERIFY="$ABS_SPEC/dispatch/verify_batch.sh"
CONFIG="$ABS_SPEC/dispatch/batch_config.json"
STATE_DIR="$ABS_SPEC/dispatch/state"
STATUS_LOG="$STATE_DIR/batch-status.jsonl"
PHASE_GATES="$STATE_DIR/phase-gates.json"
WORK_BRANCH="remedy/015-deep-review"
CONCURRENCY=3
STAGGER=5

WAVE_ARG="${1:---wave}"
WAVE_VAL="${2:-all}"
if [ "$WAVE_ARG" = "--wave" ]; then
  TARGET_WAVE="$WAVE_VAL"
else
  TARGET_WAVE="all"
fi

cd "$REPO"

# Ensure on work branch
CURRENT=$(git branch --show-current)
if [ "$CURRENT" != "$WORK_BRANCH" ]; then
  echo "ERROR: Must be on $WORK_BRANCH (currently $CURRENT)"
  exit 1
fi

# Init state files if missing
touch "$STATUS_LOG"
if [ ! -f "$PHASE_GATES" ]; then
  cat > "$PHASE_GATES" << 'GATES'
{
  "phase_0":  "pending",
  "phase_0b": "pending",
  "phase_0c": "pending",
  "phase_1":  "pending",
  "phase_2":  "pending",
  "phase_3":  "pending",
  "phase_4":  "pending",
  "phase_5":  "pending",
  "phase_6":  "pending",
  "phase_7":  "pending",
  "phase_8":  "pending"
}
GATES
fi

DRIVER_LOG="$ABS_SPEC/dispatch/logs/driver-$(date -u +%Y%m%d-%H%M%S).log"
log() { echo "[$(date -u +%H:%M:%SZ)] $*" | tee -a "$DRIVER_LOG"; }

active_count() {
  pgrep -f 'bash .*dispatch_batch' 2>/dev/null | wc -l | tr -d ' '
}

batch_status() {
  local bid="$1"
  grep "\"batch\":\"$bid\"" "$STATUS_LOG" | tail -1 | grep -oP '"event":"\K[^"]+' || echo "pending"
}

is_phase_complete() {
  local phase="$1"
  local batches
  batches=$(python3 -c "
import json, sys
cfg = json.load(open('$CONFIG'))
print(' '.join(cfg['phases'].get('$phase', {}).get('batches', [])))
" 2>/dev/null)
  for b in $batches; do
    local s
    s=$(batch_status "$b")
    if [ "$s" != "verified" ] && [ "$s" != "merged" ]; then
      return 1
    fi
  done
  return 0
}

update_phase_gates() {
  for phase in phase_0 phase_0b phase_0c phase_1 phase_2 phase_3 phase_4 phase_5 phase_6 phase_7 phase_8; do
    if is_phase_complete "$phase"; then
      python3 -c "
import json
g = json.load(open('$PHASE_GATES'))
g['$phase'] = 'complete'
json.dump(g, open('$PHASE_GATES', 'w'), indent=2)
" 2>/dev/null
    fi
  done
}

wave_deps_met() {
  local wave_id="$1"
  local required
  required=$(python3 -c "
import json
cfg = json.load(open('$CONFIG'))
for w in cfg['waves']:
  if w['id'] == '$wave_id':
    print(' '.join(w.get('requiredPhases', [])))
    break
" 2>/dev/null)
  for phase in $required; do
    if ! is_phase_complete "$phase"; then
      return 1
    fi
  done
  return 0
}

get_wave_batches() {
  local wave_id="$1"
  python3 -c "
import json
cfg = json.load(open('$CONFIG'))
for w in cfg['waves']:
  if w['id'] == '$wave_id':
    print(' '.join(w['batches']))
    break
" 2>/dev/null
}

get_waves() {
  python3 -c "
import json
cfg = json.load(open('$CONFIG'))
for w in cfg['waves']:
  print(w['id'])
" 2>/dev/null
}

run_batch() {
  local bid="$1"
  local s
  s=$(batch_status "$bid")
  if [ "$s" = "verified" ] || [ "$s" = "merged" ]; then
    log "SKIP $bid (already $s)"
    return 0
  fi

  log "DISPATCH $bid"
  echo "{\"batch\":\"$bid\",\"event\":\"dispatched\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"pid\":$$}" >> "$STATUS_LOG"

  # Launch dispatch in background
  (
    bash "$DISPATCH" "$bid" >> "$ABS_SPEC/dispatch/logs/batch-${bid}.log" 2>&1
    RC=$?
    echo "{\"batch\":\"$bid\",\"event\":\"completed\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"rc\":$RC}" >> "$STATUS_LOG"

    if [ $RC -eq 0 ]; then
      # Run verification
      bash "$VERIFY" "$bid" >> "$ABS_SPEC/dispatch/logs/verify-${bid}.log" 2>&1
      VRC=$?
      if [ $VRC -eq 0 ]; then
        echo "{\"batch\":\"$bid\",\"event\":\"verified\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$STATUS_LOG"
        # Merge batch branch into work branch
        cd "$REPO"
        git checkout "$WORK_BRANCH" 2>/dev/null
        if git merge --no-ff "remedy/$bid" -m "remedy($bid): $(python3 -c "import json; print(json.load(open('$CONFIG'))['batches']['$bid']['description'])" 2>/dev/null)" 2>/dev/null; then
          git branch -d "remedy/$bid" 2>/dev/null
          echo "{\"batch\":\"$bid\",\"event\":\"merged\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$STATUS_LOG"
        else
          git merge --abort 2>/dev/null
          echo "{\"batch\":\"$bid\",\"event\":\"merge_conflict\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$STATUS_LOG"
        fi
      else
        echo "{\"batch\":\"$bid\",\"event\":\"verify_failed\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$STATUS_LOG"
      fi
    else
      echo "{\"batch\":\"$bid\",\"event\":\"dispatch_failed\",\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"rc\":$RC}" >> "$STATUS_LOG"
    fi
  ) &
}

run_wave() {
  local wave_id="$1"
  local batches
  batches=$(get_wave_batches "$wave_id")

  if ! wave_deps_met "$wave_id"; then
    log "WAIT $wave_id — dependencies not met"
    return 1
  fi

  log "=== WAVE $wave_id START ==="

  for bid in $batches; do
    # Wait for slot
    while [ "$(active_count)" -ge "$CONCURRENCY" ]; do
      sleep 15
      update_phase_gates
    done

    local s
    s=$(batch_status "$bid")
    if [ "$s" = "verified" ] || [ "$s" = "merged" ]; then
      continue
    fi

    run_batch "$bid"
    sleep "$STAGGER"
  done

  # Drain: wait for all batches in this wave
  log "DRAIN $wave_id — waiting for active batches"
  while true; do
    local all_done=true
    for bid in $batches; do
      local s
      s=$(batch_status "$bid")
      if [ "$s" != "verified" ] && [ "$s" != "merged" ] && [ "$s" != "verify_failed" ] && [ "$s" != "dispatch_failed" ] && [ "$s" != "merge_conflict" ]; then
        all_done=false
        break
      fi
    done
    if $all_done; then break; fi
    sleep 15
    update_phase_gates
  done

  update_phase_gates
  log "=== WAVE $wave_id END ==="

  # Check for failures
  local failed=false
  for bid in $batches; do
    local s
    s=$(batch_status "$bid")
    if [ "$s" = "verify_failed" ] || [ "$s" = "dispatch_failed" ] || [ "$s" = "merge_conflict" ]; then
      log "FAILED: $bid ($s)"
      failed=true
    fi
  done

  if $failed; then
    log "WARNING: Some batches in $wave_id failed — check logs"
  fi
  return 0
}

# Cleanup
cleanup() {
  pkill -P $$ 2>/dev/null
  log "Driver cleanup — child processes killed"
}
trap cleanup EXIT TERM INT

# Main
log "=== IMPLEMENTATION DRIVER START ==="
log "Target: $TARGET_WAVE | Concurrency: $CONCURRENCY | Branch: $WORK_BRANCH"

if [ "$TARGET_WAVE" = "all" ]; then
  for wave_id in $(get_waves); do
    # Wait until dependencies are met
    while ! wave_deps_met "$wave_id"; do
      log "WAIT $wave_id deps..."
      sleep 30
      update_phase_gates
    done
    run_wave "$wave_id"
  done
else
  run_wave "wave-$TARGET_WAVE"
fi

log "=== IMPLEMENTATION DRIVER END ==="

# Print summary
echo ""
echo "=== BATCH STATUS SUMMARY ==="
for bid in $(python3 -c "import json; [print(b) for b in json.load(open('$CONFIG'))['batches']]" 2>/dev/null); do
  echo "$bid: $(batch_status "$bid")"
done
