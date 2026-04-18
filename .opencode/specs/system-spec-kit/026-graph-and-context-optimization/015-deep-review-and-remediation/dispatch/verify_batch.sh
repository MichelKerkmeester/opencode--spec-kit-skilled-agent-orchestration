#!/bin/bash
# Verify a completed implementation batch.
# Usage: verify_batch.sh <batch_id>
# Checks: TypeScript compilation, targeted vitest, spec validation, unexpected files.
set -uo pipefail

BATCH_ID="${1:?batch_id required}"

REPO="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-deep-review-and-remediation"
ABS_SPEC="$REPO/$SPEC"
CONFIG="$ABS_SPEC/dispatch/batch_config.json"
LOG_DIR="$ABS_SPEC/dispatch/logs"
WORK_BRANCH="remedy/015-deep-review"
PASS=true

cd "$REPO"

log() { echo "[$(date -u +%H:%M:%SZ)] $*" | tee -a "$LOG_DIR/verify-${BATCH_ID}.log"; }

log "=== VERIFY $BATCH_ID START ==="

# Checkout batch branch
git checkout "remedy/$BATCH_ID" 2>/dev/null || {
  log "FATAL: Cannot checkout remedy/$BATCH_ID"
  exit 1
}

# Step 1: TypeScript compilation
log "Step 1: TypeScript compilation"
cd "$REPO/.opencode/skill/system-spec-kit/mcp_server" 2>/dev/null && {
  npx tsc --noEmit 2>&1 | tee "$LOG_DIR/tsc-${BATCH_ID}.log"
  if [ "${PIPESTATUS[0]}" -ne 0 ]; then
    log "FAIL: TypeScript compilation errors"
    PASS=false
  else
    log "PASS: TypeScript compilation"
  fi
  cd "$REPO"
} || {
  log "SKIP: No TypeScript project found"
  cd "$REPO"
}

# Step 2: Targeted vitest run
TEST_FILES=$(python3 -c "
import json
cfg = json.load(open('$CONFIG'))
batch = cfg['batches'].get('$BATCH_ID', {})
for tf in batch.get('testFiles', []):
  print(tf)
" 2>/dev/null)

if [ -n "$TEST_FILES" ]; then
  log "Step 2: Vitest run"
  cd "$REPO/.opencode/skill/system-spec-kit/mcp_server" 2>/dev/null && {
    for tf in $TEST_FILES; do
      ABS_TF="$REPO/$tf"
      if [ -f "$ABS_TF" ]; then
        npx vitest run "$ABS_TF" 2>&1 | tee -a "$LOG_DIR/vitest-${BATCH_ID}.log"
        if [ "${PIPESTATUS[0]}" -ne 0 ]; then
          log "FAIL: vitest $tf"
          PASS=false
        else
          log "PASS: vitest $tf"
        fi
      fi
    done
    cd "$REPO"
  } || cd "$REPO"
else
  log "Step 2: SKIP (no test files specified)"
fi

# Step 3: Spec doc validation
PACKETS=$(python3 -c "
import json
cfg = json.load(open('$CONFIG'))
batch = cfg['batches'].get('$BATCH_ID', {})
for p in batch.get('packets', []):
  print(p)
" 2>/dev/null)

if [ -n "$PACKETS" ]; then
  log "Step 3: Spec validation"
  for pkt in $PACKETS; do
    ABS_PKT="$REPO/$pkt"
    if [ -d "$ABS_PKT" ]; then
      bash "$REPO/.opencode/skill/system-spec-kit/scripts/spec/validate.sh" "$ABS_PKT" 2>&1 \
        | tee -a "$LOG_DIR/validate-${BATCH_ID}.log"
      if [ "${PIPESTATUS[0]}" -eq 2 ]; then
        log "FAIL: validate.sh $pkt (exit 2 = errors)"
        PASS=false
      else
        log "PASS: validate.sh $pkt"
      fi
    fi
  done
else
  log "Step 3: SKIP (no packets specified)"
fi

# Step 4: Unexpected file detection
log "Step 4: Unexpected file check"
EXPECTED_FILES=$(python3 -c "
import json
cfg = json.load(open('$CONFIG'))
batch = cfg['batches'].get('$BATCH_ID', {})
for f in batch.get('targetFiles', []):
  print(f)
" 2>/dev/null)

ACTUAL_MODIFIED=$(git diff --name-only "$WORK_BRANCH" 2>/dev/null)
if [ -n "$ACTUAL_MODIFIED" ]; then
  for f in $ACTUAL_MODIFIED; do
    matched=false
    for ef in $EXPECTED_FILES; do
      if [ "$f" = "$ef" ]; then
        matched=true
        break
      fi
      # Also allow files under target directories
      if [[ "$f" == "$ef"* ]]; then
        matched=true
        break
      fi
    done
    # Allow dispatch log/summary files
    if [[ "$f" == *"dispatch/logs/"* ]] || [[ "$f" == *"dispatch/state/"* ]]; then
      matched=true
    fi
    if ! $matched; then
      log "WARN: Unexpected file modified: $f"
      # Don't hard-fail on unexpected files — log for review
    fi
  done
else
  log "NOTE: No file changes detected"
fi

# Return to work branch
git checkout "$WORK_BRANCH" 2>/dev/null

log "=== VERIFY $BATCH_ID END: $(if $PASS; then echo "PASSED"; else echo "FAILED"; fi) ==="

if $PASS; then
  exit 0
else
  exit 1
fi
