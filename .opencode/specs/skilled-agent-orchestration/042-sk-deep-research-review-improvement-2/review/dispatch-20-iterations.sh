#!/bin/bash
set -euo pipefail

# 20-iteration deep-review dispatch via cli-codex (GPT 5.4 high fast)
# Session: rvw-2026-04-12T11-30-00Z
# Target: 042-sk-deep-research-review-improvement-2 (all 8 phases)

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
REVIEW_DIR="$ROOT/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review"
ITER_DIR="$REVIEW_DIR/iterations"
STATE_FILE="$REVIEW_DIR/deep-review-state.jsonl"
LOG_FILE="$REVIEW_DIR/dispatch-log.txt"
MAX_ITER=20
SESSION_ID="rvw-2026-04-12T11-30-00Z"

cd "$ROOT"

echo "=== Deep Review Dispatch: $SESSION_ID ===" | tee "$LOG_FILE"
echo "Start: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "Engine: codex exec --model gpt-5.4 -c model_reasoning_effort=high -c service_tier=fast" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Dimension rotation plan (5 per dimension, interleaved)
DIMENSIONS=(
  "correctness"      # 1
  "security"         # 2
  "traceability"     # 3
  "maintainability"  # 4
  "correctness"      # 5
  "security"         # 6
  "traceability"     # 7
  "maintainability"  # 8
  "correctness"      # 9
  "security"         # 10
  "traceability"     # 11
  "maintainability"  # 12
  "correctness"      # 13
  "security"         # 14
  "traceability"     # 15
  "maintainability"  # 16
  "correctness"      # 17
  "security"         # 18
  "traceability"     # 19
  "maintainability"  # 20
)

FOCUS_AREAS=(
  # Round 1: Phase 001-002 foundation
  "Phase 001 runtime-truth-foundation: stop-reason taxonomy, legal-stop gates, resume semantics in reduce-state.cjs and runtime-capabilities.cjs for both sk-deep-research and sk-deep-review. Check .opencode/skill/sk-deep-research/scripts/reduce-state.cjs and .opencode/skill/sk-deep-review/scripts/reduce-state.cjs for correct stopReason handling, legalStop gate logic, and blocked-stop event shapes."
  "Phase 002 coverage-graph SQLite: session isolation, namespace scoping, SQL injection surface in .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts and all 4 MCP handlers in .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/. Check composite primary keys, parameterized queries, and input validation."
  "Phase 001-002 spec-code alignment: verify .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md claims match the actual reduce-state.cjs and runtime-capabilities.cjs implementations. Cross-check references/ docs (state_format.md, loop_protocol.md, convergence.md) for both sk-deep-research and sk-deep-review."
  "Phase 001-002 code structure: review 4 CJS shared libraries in .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs for module boundaries, error handling, function complexity, and export surface area. Check vitest coverage in scripts/tests/coverage-graph-*.vitest.ts files."

  # Round 2: Phase 003-004 scale and optimization
  "Phase 003 wave-executor: fan-out/join logic, segment identity determinism, activation gates in .opencode/skill/system-spec-kit/scripts/lib/wave-*.cjs (5 modules). Check wave-lifecycle.cjs for state transitions, wave-segment-planner.cjs for deterministic ordering, wave-convergence.cjs for per-segment convergence."
  "Phase 004 offline-optimizer: replay corpus extraction, config search bounds, audit trail integrity in .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs and replay-runner.cjs. Check for path traversal in corpus loading, bounds validation in config search, and advisory-only promotion gate enforcement."
  "Phase 003-004 spec-code alignment: verify 003-wave-executor/spec.md and 004-offline-loop-optimizer/spec.md claims against the actual wave-*.cjs and optimizer/*.cjs implementations. Check that activation thresholds, segment plans, and replay corpus configs match documented values."
  "Phase 003-004 abstractions: evaluate wave-coordination-board.cjs and wave-segment-state.cjs for coupling to coverage-graph modules. Check optimizer test files (optimizer-replay-corpus.vitest.ts, optimizer-replay-runner.vitest.ts) for edge case coverage and fixture quality."

  # Round 3: Phase 005-006 agent-improver and graph testing
  "Phase 005 agent-improver alignment: verify .opencode/skill/sk-improve-agent/scripts/ (13 CJS modules) correctly implement stop-reason taxonomy, journal wiring, and advisory optimizer contract. Focus on improvement-journal.cjs, mutation-coverage.cjs, trade-off-detector.cjs, candidate-lineage.cjs, benchmark-stability.cjs."
  "Phase 005-006 MCP handler auth: check all coverage-graph MCP handlers for consistent parameter validation, error responses, and namespace enforcement. Verify .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts registration and tool schema correctness."
  "Phase 005-006 decision records and implementation summaries: cross-reference 005-agent-improver-deep-loop-alignment/ and 006-graph-testing-and-playbook-alignment/ spec docs against changelog entries in .opencode/changelog/15--sk-improve-agent/ and actual test file existence."
  "Phase 005-006 test quality: review .opencode/skill/sk-improve-agent/scripts/tests/ (5 vitest files) and .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts plus coverage-graph-stress.vitest.ts for assertion quality, edge cases, and coverage of the documented contract."

  # Round 4: Phase 007-008 closeout and runtime truth
  "Phase 007-008 regression risk: check .opencode/skill/sk-deep-review/scripts/reduce-state.cjs for fail-closed corruption handling, claim-adjudication gate implementation, and the split between persistent same-severity findings and severity changes. Verify against .opencode/skill/sk-deep-review/references/state_format.md §9 and loop_protocol.md §Step 4a."
  "Phase 007-008 database migrations: verify .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts v2 schema migration (drop-and-recreate) is safe, composite primary key correctness, and that .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts covers shared-ID collision regression."
  "Phase 007-008 root spec vs phase spec alignment: cross-reference the root implementation-summary.md, spec.md, checklist.md, and tasks.md against all 8 phase implementation summaries. Check that Lane 1-5 remediation claims (REQ-026 through REQ-034) have actual code evidence."
  "Phase 007-008 cross-cutting quality: review .opencode/agent/deep-review.md iteration skeleton alignment with reduce-state.cjs:186, review_dimensions_json pre-serialization in both review workflows, and Signal 3 convergence vote correctness. Check .opencode/agent/deep-research.md for matching runtime truth."

  # Round 5: Cross-phase synthesis and coverage gaps
  "Cross-phase reducer consistency: compare reduce-state.cjs across all 3 skills (sk-deep-research, sk-deep-review, sk-improve-agent). Check for shared contract compliance, consistent event emission shapes, convergence signal calculation, and dashboard rendering logic."
  "Cross-phase command workflow integrity: review all 6 YAML workflow assets in .opencode/command/spec_kit/assets/ and 2 in .opencode/command/improve/assets/. Verify step sequences, variable references, conditional branches, and error handling paths match the SKILL.md documented workflows."
  "Cross-phase reference doc accuracy: verify all references/ docs across sk-deep-research, sk-deep-review, and sk-improve-agent are consistent with current runtime code. Check for stale function names, outdated field names, removed branches, or phantom features documented but not implemented."
  "Overall architecture coherence: evaluate the full 042 bundle for architectural risks — shared library coupling, database schema evolution path, MCP tool surface area growth, test fixture maintainability, and operational documentation completeness. Assess release readiness."
)

FINDINGS_TOTAL=0
P0_TOTAL=0
P1_TOTAL=0
P2_TOTAL=0

for i in $(seq 1 $MAX_ITER); do
  IDX=$((i - 1))
  DIM="${DIMENSIONS[$IDX]}"
  FOCUS="${FOCUS_AREAS[$IDX]}"
  ITER_NUM=$(printf '%03d' "$i")
  ITER_FILE="$ITER_DIR/iteration-${ITER_NUM}.md"
  START_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  echo "--- Iteration $i/$MAX_ITER | $DIM | $(date) ---" | tee -a "$LOG_FILE"

  PROMPT="You are a senior code reviewer executing iteration $i of a 20-iteration deep review session (ID: $SESSION_ID).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: $DIM
FOCUS: $FOCUS

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for $DIM issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-${ITER_NUM}-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: $DIM
   - File: exact file path
   - Line: line number(s) if applicable
   - Title: brief descriptive title
   - Description: detailed explanation of the issue
   - Evidence: relevant code snippet or reference
   - Recommendation: specific fix or improvement

4. After listing all findings, provide:
   - ITERATION SUMMARY: total findings, breakdown by severity
   - COVERAGE ASSESSMENT: what percentage of the focus area was reviewed
   - CONFIDENCE: your confidence in the completeness of this iteration (low/medium/high)
   - NEXT PRIORITIES: what should the next iteration examine that you could not cover

Be thorough and precise. Cite exact file paths and line numbers. Do not report findings that require subjective style preferences — focus on functional correctness, security, traceability, and maintainability risks.

Prior session context: A previous 10-iteration review (rvw-2026-04-11T13-50-06Z) found 16 findings (0 P0 / 10 P1 / 6 P2) with CONDITIONAL verdict. That review led to a 5-lane remediation (REQ-026 through REQ-034). This session validates the remediation AND examines areas not previously covered."

  # Execute via codex
  OUTPUT=$(codex exec \
    --model gpt-5.4 \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox read-only \
    "$PROMPT" 2>&1) || {
    echo "ERROR: codex exec failed for iteration $i" | tee -a "$LOG_FILE"
    OUTPUT="## Iteration $ITER_NUM — ERROR\n\nCodex exec failed. See dispatch-log.txt for details."
  }

  END_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  # Write iteration file
  cat > "$ITER_FILE" << ITEREOF
---
iteration: $i
dimension: $DIM
sessionId: $SESSION_ID
engine: codex-gpt-5.4-high-fast
startedAt: $START_TS
completedAt: $END_TS
---

# Deep Review Iteration $ITER_NUM — $DIM

**Focus:** $FOCUS

---

$OUTPUT
ITEREOF

  # Count findings (grep for F-NNN pattern)
  ITER_FINDINGS=$(echo "$OUTPUT" | grep -c "F-${ITER_NUM}-" 2>/dev/null || echo "0")
  ITER_P0=$(echo "$OUTPUT" | grep -ci "Severity.*P0\|P0.*critical\|P0.*blocking" 2>/dev/null || echo "0")
  ITER_P1=$(echo "$OUTPUT" | grep -ci "Severity.*P1\|P1.*significant" 2>/dev/null || echo "0")
  ITER_P2=$(echo "$OUTPUT" | grep -ci "Severity.*P2\|P2.*minor" 2>/dev/null || echo "0")

  FINDINGS_TOTAL=$((FINDINGS_TOTAL + ITER_FINDINGS))
  P0_TOTAL=$((P0_TOTAL + ITER_P0))
  P1_TOTAL=$((P1_TOTAL + ITER_P1))
  P2_TOTAL=$((P2_TOTAL + ITER_P2))

  # Append to JSONL state
  echo "{\"type\":\"iteration\",\"mode\":\"review\",\"run\":$i,\"status\":\"complete\",\"focus\":\"$DIM — $(echo "$FOCUS" | head -c 80)\",\"dimensions\":[\"$DIM\"],\"findingsCount\":$ITER_FINDINGS,\"findingsSummary\":{\"P0\":$ITER_P0,\"P1\":$ITER_P1,\"P2\":$ITER_P2},\"sessionId\":\"$SESSION_ID\",\"generation\":2,\"engine\":\"codex-gpt-5.4-high-fast\",\"startedAt\":\"$START_TS\",\"completedAt\":\"$END_TS\"}" >> "$STATE_FILE"

  echo "  Findings: $ITER_FINDINGS (P0:$ITER_P0 P1:$ITER_P1 P2:$ITER_P2) | Cumulative: $FINDINGS_TOTAL" | tee -a "$LOG_FILE"
  echo "  Written: $ITER_FILE" | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"
done

# Final summary
echo "=== DISPATCH COMPLETE ===" | tee -a "$LOG_FILE"
echo "End: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "Total iterations: $MAX_ITER" | tee -a "$LOG_FILE"
echo "Total findings: $FINDINGS_TOTAL (P0:$P0_TOTAL P1:$P1_TOTAL P2:$P2_TOTAL)" | tee -a "$LOG_FILE"

# Write completion event to JSONL
echo "{\"type\":\"event\",\"event\":\"dispatch_complete\",\"mode\":\"review\",\"totalIterations\":$MAX_ITER,\"totalFindings\":$FINDINGS_TOTAL,\"activeP0\":$P0_TOTAL,\"activeP1\":$P1_TOTAL,\"activeP2\":$P2_TOTAL,\"engine\":\"codex-gpt-5.4-high-fast\",\"sessionId\":\"$SESSION_ID\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" >> "$STATE_FILE"

echo ""
echo "Review artifacts in: $REVIEW_DIR"
echo "Iteration files in: $ITER_DIR"
echo "State file: $STATE_FILE"
echo "Log file: $LOG_FILE"
