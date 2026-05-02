#!/bin/bash
set -euo pipefail

# 10-iteration post-fix validation review via codex GPT 5.4 high fast
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
REVIEW_DIR="$ROOT/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review"
ITER_DIR="$REVIEW_DIR/iterations"
STATE_FILE="$REVIEW_DIR/deep-review-state.jsonl"
LOG_FILE="$REVIEW_DIR/post-fix-review-log.txt"
SESSION_ID="rvw-2026-04-12T11-30-00Z"

cd "$ROOT"

echo "=== Post-Fix Validation Review ===" | tee "$LOG_FILE"
echo "Start: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "Validating fixes from 6 copilot batches against 80 original findings" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

DIMENSIONS=(
  "correctness"      # 21
  "security"         # 22
  "traceability"     # 23
  "maintainability"  # 24
  "correctness"      # 25
  "security"         # 26
  "traceability"     # 27
  "maintainability"  # 28
  "correctness"      # 29
  "maintainability"  # 30
)

FOCUS_AREAS=(
  "VALIDATION: Verify reducer fixes landed correctly. Check sk-deep-review/scripts/reduce-state.cjs for synthesis_complete parsing, lineage persistence, claim-adjudication finalSeverity handling, stale STOP veto guard, fail-closed corruption, and ACTIVE RISKS object rendering. Check sk-deep-research/scripts/reduce-state.cjs for synthesis_complete consumption, lineage persistence, and graph convergence blendedScore fallback. Check sk-improve-agent/scripts/reduce-state.cjs for schema alignment, mutation-coverage derivation, and new dashboard sections."
  "VALIDATION: Verify namespace isolation fixes. Check coverage-graph-query.ts for full composite-key predicates in ALL NOT EXISTS subqueries and findContradictions joins. Check coverage-graph-signals.ts for namespace threading in edge lookups. Check handler files (query.ts, status.ts, convergence.ts) for mandatory sessionId. Check optimizer promote.cjs for path restriction, search.cjs for manifest enforcement, replay-corpus.cjs for root constraints."
  "VALIDATION: Verify traceability fixes. Check deep_research_config.json removed fork/completed-continue. Check review_mode_contract.yaml has only 3 modes. Check improvement_config.json stripped dormant resume. Check convergence.md matches blocked_stop shape. Check loop_protocol.md describes full replay not delta. Check Phase 001 spec.md downgraded completed-continue to deferred."
  "VALIDATION: Verify wave executor and CJS lib fixes. Check wave-segment-planner.cjs for composite hotspot scoring and registrable-domain clustering. Check wave-lifecycle.cjs for transition matrix. Check wave-coordination-board.cjs for 5-key composite dedup and board transition API. Check coverage-graph-core.cjs for session normalization. Check coverage-graph-signals.cjs for renamed momentum function and cycle handling."
  "VALIDATION: Verify improve-agent helper fixes. Check trade-off-detector.cjs for scored dimension emission. Check improvement-journal.cjs for plateau stop reason. Check workflow YAMLs for explicit helper call steps, real target agent identifier, and session-boundary gate."
  "VALIDATION: Verify workflow YAML fixes. Check deep-review auto+confirm YAMLs for graphBlockerDetail in blocked_stop payload and single reviewDimensions normalization. Check deep-research auto+confirm YAMLs for removed completed-session-to-synthesize routing. Check agent/deep-review.md for collapsed canonical iteration skeleton. Check agent/deep-research.md for config as explicit Step 1."
  "VALIDATION: Verify spec doc traceability fixes. Check 042 root spec.md for 8-phase structure (not 4). Check tasks.md for correct Phase 7 folder routing. Check implementation-summary.md for fixed remediation proof chain and Lane 3 status. Check Phase 005 and 006 implementation summaries for corrected attribution. Check playbook 034-replay-consumer.md and 029-graph-events-emission.md for updated content."
  "VALIDATION: Verify test quality fixes. Check coverage-graph-integration.vitest.ts for real TS contract import instead of shadow copy. Check coverage-graph-stress.vitest.ts for opt-in benchmarks and proper contradiction-free graph test. Check session-isolation.vitest.ts for new colliding-ID higher-level fixtures. Check optimizer-replay-runner.vitest.ts for threshold-straddling fixtures. Check for archived stale test suites."
  "REGRESSION CHECK: Look for any new issues introduced by the 6 copilot fix batches. Check for broken imports, syntax errors, inconsistent function signatures, missing exports, or logic regressions in the modified files. Focus on the 3 reducer files, coverage-graph query/signals, wave modules, and workflow YAMLs."
  "OVERALL ASSESSMENT: Evaluate whether the 80 original findings have been adequately addressed. Check for remaining open issues, partially fixed findings, or new risks introduced. Assess release readiness of the 042 bundle after all fixes."
)

for i in $(seq 1 10); do
  IDX=$((i - 1))
  ITER_GLOBAL=$((20 + i))
  DIM="${DIMENSIONS[$IDX]}"
  FOCUS="${FOCUS_AREAS[$IDX]}"
  ITER_NUM=$(printf '%03d' "$ITER_GLOBAL")
  ITER_FILE="$ITER_DIR/iteration-${ITER_NUM}.md"
  START_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  echo "--- Iteration $ITER_GLOBAL/30 | $DIM | $(date) ---" | tee -a "$LOG_FILE"

  PROMPT="You are a senior code reviewer executing POST-FIX VALIDATION iteration $ITER_GLOBAL of a deep review session (ID: $SESSION_ID).

CONTEXT: A prior 20-iteration review found 80 findings (0 P0, 67 P1, 13 P2) across 4 dimensions. Six fix batches were then applied via GitHub Copilot CLI with GPT 5.4. This iteration validates those fixes.

DIMENSION: $DIM
$FOCUS

INSTRUCTIONS:
1. Read the files mentioned and verify the fixes were correctly applied.
2. For each original finding, report: FIXED (correctly addressed), PARTIAL (partially fixed, issues remain), REGRESSED (fix introduced new problems), or OPEN (not addressed).
3. Report any NEW findings introduced by the fix batches at P0/P1/P2 severity.
4. For each new or partial finding, provide the same structured format: Finding ID (F-${ITER_NUM}-NNN), Severity, Dimension, File, Line, Title, Description, Evidence, Recommendation.

5. Provide:
   - FIX VALIDATION SUMMARY: how many original findings verified fixed vs partial vs open
   - NEW FINDINGS: any issues introduced by the fixes
   - CONFIDENCE: low/medium/high in the completeness of validation
   - RELEASE READINESS: assessment of whether the bundle is now shippable

Be thorough. Cite exact file paths and line numbers."

  OUTPUT=$(codex exec \
    --model gpt-5.4 \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox read-only \
    "$PROMPT" 2>&1) || {
    echo "ERROR: codex exec failed for iteration $ITER_GLOBAL" | tee -a "$LOG_FILE"
    OUTPUT="## Iteration $ITER_NUM — ERROR\n\nCodex exec failed."
  }

  END_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  cat > "$ITER_FILE" << ITEREOF
---
iteration: $ITER_GLOBAL
dimension: $DIM
sessionId: $SESSION_ID
engine: codex-gpt-5.4-high-fast
phase: post-fix-validation
startedAt: $START_TS
completedAt: $END_TS
---

# Deep Review Iteration $ITER_NUM — $DIM (Post-Fix Validation)

**Focus:** $FOCUS

---

$OUTPUT
ITEREOF

  ITER_FINDINGS=$(echo "$OUTPUT" | grep -c "F-${ITER_NUM}-" 2>/dev/null || echo "0")
  echo "  New findings: $ITER_FINDINGS | Written: $ITER_FILE" | tee -a "$LOG_FILE"

  echo "{\"type\":\"iteration\",\"mode\":\"review\",\"run\":$ITER_GLOBAL,\"status\":\"complete\",\"phase\":\"post-fix-validation\",\"focus\":\"$DIM validation\",\"dimensions\":[\"$DIM\"],\"findingsCount\":$ITER_FINDINGS,\"sessionId\":\"$SESSION_ID\",\"generation\":2,\"engine\":\"codex-gpt-5.4-high-fast\",\"startedAt\":\"$START_TS\",\"completedAt\":\"$END_TS\"}" >> "$STATE_FILE"
  echo "" | tee -a "$LOG_FILE"
done

echo "=== POST-FIX REVIEW COMPLETE ===" | tee -a "$LOG_FILE"
echo "End: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
