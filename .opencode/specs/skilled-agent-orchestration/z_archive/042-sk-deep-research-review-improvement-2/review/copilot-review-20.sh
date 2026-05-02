#!/bin/bash
set -euo pipefail

# 20-iteration deep review via cli-copilot (GPT 5.4 high)
# Focuses on updated workflow logic after all prior fixes landed
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
REVIEW_DIR="$ROOT/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review"
ITER_DIR="$REVIEW_DIR/iterations"
STATE_FILE="$REVIEW_DIR/deep-review-state.jsonl"
LOG_FILE="$REVIEW_DIR/copilot-review-log.txt"
SESSION_ID="rvw-2026-04-12T16-00-00Z"

cd "$ROOT"

echo "=== Copilot Deep Review: $SESSION_ID ===" | tee "$LOG_FILE"
echo "Start: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "Engine: copilot -p --model gpt-5.4 --allow-all-tools (reasoning: high)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Append new session config to JSONL
echo "{\"type\":\"config\",\"mode\":\"review\",\"topic\":\"20-iteration Copilot GPT-5.4 review of updated 042 workflow logic\",\"reviewTarget\":\"skilled-agent-orchestration/042-sk-deep-research-review-improvement-2\",\"sessionId\":\"$SESSION_ID\",\"parentSessionId\":\"rvw-2026-04-12T11-30-00Z\",\"lineageMode\":\"continued\",\"generation\":3,\"maxIterations\":20,\"convergenceThreshold\":0.05,\"createdAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"executionEngine\":\"cli-copilot\",\"executionModel\":\"gpt-5.4\"}" >> "$STATE_FILE"

DIMENSIONS=(
  "correctness"      # 31
  "security"         # 32
  "traceability"     # 33
  "maintainability"  # 34
  "correctness"      # 35
  "security"         # 36
  "traceability"     # 37
  "maintainability"  # 38
  "correctness"      # 39
  "security"         # 40
  "traceability"     # 41
  "maintainability"  # 42
  "correctness"      # 43
  "security"         # 44
  "traceability"     # 45
  "maintainability"  # 46
  "correctness"      # 47
  "security"         # 48
  "traceability"     # 49
  "maintainability"  # 50
)

FOCUS_AREAS=(
  # Round 1: Reducer workflow logic after fixes
  "UPDATED WORKFLOW: Verify reduce-state.cjs in sk-deep-review now correctly parses synthesis_complete, persists lineage on resume/restart, handles claim-adjudication finalSeverity, guards stale STOP vetos, throws on corruption, and renders ACTIVE RISKS without [object Object]. Check .opencode/skill/sk-deep-review/scripts/reduce-state.cjs end to end."
  "UPDATED WORKFLOW: Verify coverage-graph namespace isolation after fixes. Check .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts for full composite-key predicates in ALL subqueries. Check coverage-graph-signals.ts for session-scoped edge lookups. Check all 4 MCP handlers for mandatory sessionId."
  "UPDATED WORKFLOW: Verify config and reference doc accuracy after fixes. Check deep_research_config.json has no fork/completed-continue. Check review_mode_contract.yaml has 3 modes only. Check convergence.md uses blocked_stop schema throughout. Check loop_protocol.md describes full replay consistently."
  "UPDATED WORKFLOW: Verify wave executor fixes. Check wave-segment-planner.cjs for composite hotspot scoring. Check wave-lifecycle.cjs for adjacent-transition matrix. Check wave-coordination-board.cjs for 5-key composite merge and board transition API. Check coverage-graph-core.cjs session normalization."

  # Round 2: Improve-agent and workflow YAMLs
  "UPDATED WORKFLOW: Verify improve-agent reducer and helpers after fixes. Check reduce-state.cjs for aligned lineage schema, derived mutation-coverage metrics, dashboard sections for journal/lineage/coverage. Check improvement-journal.cjs for plateau stop reason. Check trade-off-detector.cjs for scored dimension emission."
  "UPDATED WORKFLOW: Verify workflow YAML security after fixes. Check deep-review auto+confirm YAMLs for graphBlockerDetail in blocked_stop, single reviewDimensions normalization. Check deep-research auto+confirm YAMLs removed completed-session-to-synthesize. Check improve-agent confirm YAML for enforced session-boundary gate."
  "UPDATED WORKFLOW: Verify spec doc traceability after all fixes. Check 042 root spec.md is 8-phase structure. Check tasks.md has correct Phase 7 folder. Check implementation-summary.md has correct remediation proof chain and Lane 3 status. Check Phase 001 spec downgraded completed-continue to deferred."
  "UPDATED WORKFLOW: Verify test quality improvements. Check coverage-graph-integration.vitest.ts uses real TS imports. Check session-isolation.vitest.ts has colliding-ID higher-level fixtures. Check that stale coverage-graph-db.vitest.ts and coverage-graph-tools.vitest.ts are archived. Check new contradictions test file exists."

  # Round 3: Cross-cutting workflow consistency
  "CROSS-CUTTING: Compare all 3 reduce-state.cjs files (review, research, improve-agent) for consistent event handling. All should parse synthesis_complete, handle corruption fail-closed, and persist lineage from lifecycle events. Check for any asymmetry."
  "CROSS-CUTTING: Verify all 6 workflow YAMLs (deep-research auto+confirm, deep-review auto+confirm, improve-agent auto+confirm) for consistent patterns. Check that blocked_stop events, session gates, and lineage tracking follow the same contract across all 6."
  "CROSS-CUTTING: Verify all agent definitions (deep-research.md, deep-review.md, improve-agent.md) reference the correct reducer contract, iteration skeleton, and config handling. Check for stale references to removed lifecycle modes or phantom features."
  "CROSS-CUTTING: Verify all 3 skill READMEs and SKILL.md frontmatter versions match their changelogs. Check sk-deep-review v1.3.2.0, sk-deep-research v1.6.2.0, sk-improve-agent v1.2.2.0, system-spec-kit v3.3.1.0, cli-copilot v1.3.4.0."

  # Round 4: Deep contract verification
  "CONTRACT: Verify the coverage-graph DB schema and migration path. Check coverage-graph-db.ts for v2 composite primary keys, drop-and-recreate migration safety, and that the documented schema matches the actual CREATE TABLE statements."
  "CONTRACT: Verify optimizer security hardening. Check promote.cjs restricts output to audit directory. Check search.cjs derives space from manifest. Check replay-corpus.cjs constrains to approved roots. Verify no path traversal is possible."
  "CONTRACT: Verify the 042 root spec, plan, tasks, checklist, and implementation-summary are internally consistent. Cross-reference phase counts, folder names, verification claims, and remediation lane statuses."
  "CONTRACT: Verify all manual testing playbooks reference current code reality. Check 034-replay-consumer.md, 029-graph-events-emission.md, and any playbook that references the deep-loop graph, journal, or coverage surface."

  # Round 5: Release readiness and architecture
  "RELEASE: Check for any syntax errors or broken imports introduced by the fix batches. Run a mental compilation check on all modified CJS and TS files. Look for undefined references, missing require() calls, or type mismatches."
  "RELEASE: Verify the Level 3+ documentation is consistent after the enterprise/sign-off cleanup. Check SKILL.md, README.md, template_mapping.md, level_decision_matrix.md, level_specifications.md, template_guide.md all use approval/compliance/stakeholder language consistently."
  "RELEASE: Check root repo README.md for accuracy. Verify the deep-research, deep-review, and improve-agent sections match current capabilities. Check skill catalog entries have correct version numbers. Look for any remaining stale descriptions."
  "RELEASE: Overall release readiness assessment of the 042 bundle. Evaluate whether all 94 original findings plus 14 post-fix findings have been addressed. Check for remaining open risks, incomplete fixes, or documentation gaps. Render a PASS/CONDITIONAL/FAIL verdict."
)

for i in $(seq 1 20); do
  IDX=$((i - 1))
  ITER_GLOBAL=$((30 + i))
  DIM="${DIMENSIONS[$IDX]}"
  FOCUS="${FOCUS_AREAS[$IDX]}"
  ITER_NUM=$(printf '%03d' "$ITER_GLOBAL")
  ITER_FILE="$ITER_DIR/iteration-${ITER_NUM}.md"
  START_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  echo "--- Iteration $ITER_GLOBAL/50 | $DIM | $(date) ---" | tee -a "$LOG_FILE"

  PROMPT="You are a senior code reviewer executing iteration $ITER_GLOBAL of a deep review session (ID: $SESSION_ID, generation 3).

CONTEXT: Two prior review rounds ran against the 042 Deep Research & Review Runtime Improvement Bundle:
- Round 1 (20 iterations via Codex GPT 5.4): Found 80 findings, all fixed via 6 Copilot batches
- Round 2 (10 post-fix validation via Codex GPT 5.4): Found 14 new findings, all fixed via 2 Copilot batches
- This is Round 3: validating the updated workflow logic after all fixes landed

TARGET: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/ and all implementation code it references across sk-deep-research, sk-deep-review, sk-improve-agent, system-spec-kit MCP server, wave executor, optimizer, and workflow YAMLs.

DIMENSION: $DIM
$FOCUS

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for $DIM issues at P0/P1/P2 severity.
3. For each finding provide: Finding ID (F-${ITER_NUM}-NNN), Severity, Dimension, File, Line, Title, Description, Evidence, Recommendation.
4. Provide: ITERATION SUMMARY, COVERAGE ASSESSMENT, CONFIDENCE, NEXT PRIORITIES.

Be thorough. Cite exact file paths and line numbers."

  OUTPUT=$(copilot -p "$PROMPT" --model gpt-5.4 --allow-all-tools 2>&1) || {
    echo "ERROR: copilot failed for iteration $ITER_GLOBAL" | tee -a "$LOG_FILE"
    OUTPUT="## Iteration $ITER_NUM — ERROR\n\nCopilot failed."
  }

  END_TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  cat > "$ITER_FILE" << ITEREOF
---
iteration: $ITER_GLOBAL
dimension: $DIM
sessionId: $SESSION_ID
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: $START_TS
completedAt: $END_TS
---

# Deep Review Iteration $ITER_NUM — $DIM (Round 3)

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
