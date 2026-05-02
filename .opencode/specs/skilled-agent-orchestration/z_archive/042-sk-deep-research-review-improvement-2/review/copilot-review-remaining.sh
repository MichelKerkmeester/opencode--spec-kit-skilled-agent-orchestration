#!/bin/bash
set -euo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
REVIEW_DIR="$ROOT/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review"
ITER_DIR="$REVIEW_DIR/iterations"
STATE_FILE="$REVIEW_DIR/deep-review-state.jsonl"
LOG_FILE="$REVIEW_DIR/copilot-review-log.txt"
SESSION_ID="rvw-2026-04-12T16-00-00Z"

cd "$ROOT"

echo "" | tee -a "$LOG_FILE"
echo "=== Resuming from iteration 47 ===" | tee -a "$LOG_FILE"

DIMENSIONS=("correctness" "security" "traceability" "maintainability")
FOCUS_AREAS=(
  "RELEASE: Check for any syntax errors or broken imports introduced by the fix batches. Run a mental compilation check on all modified CJS and TS files. Look for undefined references, missing require() calls, or type mismatches."
  "RELEASE: Verify the Level 3+ documentation is consistent after the enterprise/sign-off cleanup. Check SKILL.md, README.md, template_mapping.md, level_decision_matrix.md, level_specifications.md, template_guide.md all use approval/compliance/stakeholder language consistently."
  "RELEASE: Check root repo README.md for accuracy. Verify the deep-research, deep-review, and improve-agent sections match current capabilities. Check skill catalog entries have correct version numbers. Look for any remaining stale descriptions."
  "RELEASE: Overall release readiness assessment of the 042 bundle. Evaluate whether all findings have been addressed. Check for remaining open risks, incomplete fixes, or documentation gaps. Render a PASS/CONDITIONAL/FAIL verdict."
)

for i in $(seq 0 3); do
  ITER_GLOBAL=$((47 + i))
  DIM="${DIMENSIONS[$i]}"
  FOCUS="${FOCUS_AREAS[$i]}"
  ITER_NUM=$(printf '%03d' "$ITER_GLOBAL")
  ITER_FILE="$ITER_DIR/iteration-${ITER_NUM}.md"
  START_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  echo "--- Iteration $ITER_GLOBAL/50 | $DIM | $(date) ---" | tee -a "$LOG_FILE"

  PROMPT="You are a senior code reviewer executing iteration $ITER_GLOBAL of a deep review session (ID: $SESSION_ID, generation 3).

CONTEXT: Three review rounds against the 042 bundle. Round 1 found 80 findings (all fixed). Round 2 found 14 more (all fixed). Round 3 iterations 31-46 found ~50 findings. This is the final release-readiness pass.

DIMENSION: $DIM
$FOCUS

INSTRUCTIONS:
1. Read the files mentioned carefully.
2. Report findings at P0/P1/P2 severity with Finding ID F-${ITER_NUM}-NNN.
3. Provide ITERATION SUMMARY, COVERAGE ASSESSMENT, CONFIDENCE, and for iteration 50 a final VERDICT."

  OUTPUT=$(copilot -p "$PROMPT" --model gpt-5.4 --allow-all-tools 2>&1) || {
    echo "ERROR: copilot failed for iteration $ITER_GLOBAL" | tee -a "$LOG_FILE"
    OUTPUT="## Iteration $ITER_NUM — ERROR"
  }

  END_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  cat > "$ITER_FILE" << ITEREOF
---
iteration: $ITER_GLOBAL
dimension: $DIM
sessionId: $SESSION_ID
engine: copilot-gpt-5.4-high
phase: round-3-release-readiness
startedAt: $START_TS
completedAt: $END_TS
---

# Deep Review Iteration $ITER_NUM — $DIM (Round 3 Release)

**Focus:** $FOCUS

---

$OUTPUT
ITEREOF

  ITER_FINDINGS=$(echo "$OUTPUT" | grep -c "F-${ITER_NUM}-" 2>/dev/null || echo "0")
  echo "  Findings: $ITER_FINDINGS | Written: $ITER_FILE" | tee -a "$LOG_FILE"
  echo "{\"type\":\"iteration\",\"mode\":\"review\",\"run\":$ITER_GLOBAL,\"status\":\"complete\",\"focus\":\"$DIM\",\"dimensions\":[\"$DIM\"],\"findingsCount\":$ITER_FINDINGS,\"sessionId\":\"$SESSION_ID\",\"generation\":3,\"engine\":\"copilot-gpt-5.4-high\",\"startedAt\":\"$START_TS\",\"completedAt\":\"$END_TS\"}" >> "$STATE_FILE"
  echo "" | tee -a "$LOG_FILE"
done

echo "=== COPILOT REVIEW COMPLETE ===" | tee -a "$LOG_FILE"
echo "End: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
