#!/bin/bash
set -euo pipefail

# Sequential copilot fix dispatch — 1 at a time for memory safety
ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
LOG="$ROOT/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/fix-log.txt"
cd "$ROOT"

echo "=== Copilot Fix Dispatch (sequential) ===" | tee "$LOG"
echo "Start: $(date)" | tee -a "$LOG"

run_fix() {
  local batch="$1"
  local prompt="$2"
  echo "--- Batch $batch | $(date) ---" | tee -a "$LOG"
  copilot -p "$prompt" --model gpt-5.4 --allow-all-tools 2>&1 | tee -a "$LOG" | tail -30
  echo "--- Batch $batch done | $(date) ---" | tee -a "$LOG"
  echo "" | tee -a "$LOG"
}

# BATCH 1: All 3 reducer correctness fixes (review + research + improve-agent)
run_fix "1-reducers" "Fix correctness bugs in all 3 deep-loop reducers. Read and edit these files:

1. .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:
   - Parse the latest synthesis_complete JSONL event to derive dashboard stopReason instead of stale config
   - Detect lifecycle events (resumed, restarted) and update config-visible lineage fields (parentSessionId, continuedFromRun, lineageMode)
   - Parse claim_adjudication events by findingId, use finalSeverity as canonical for findings registry
   - Only surface claim-adjudication STOP veto when it still applies to active P0/P1
   - Make reduceReviewState() throw on corruption when lenient is false
   - Fix ACTIVE RISKS path that can render [object Object] by reusing normalized entry from blockedStopHistory

2. .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:
   - Consume latest synthesis_complete event for dashboard status
   - Persist updated lineage fields from lifecycle events
   - Fix graph convergence scoring that collapses to 0 when blendedScore is absent — add numeric fallback

3. .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:
   - Align candidateId/parentCandidateId with id/parentId schema
   - Derive mutation-coverage metrics from raw arrays when computed metrics block missing
   - Add dashboard sections for journal summary, candidate lineage, mutation coverage
   - Emit legal_stop_evaluated and blocked_stop journal events

4. .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:
   - Emit scored dimension array into journal row, or change getTrajectory() to load from scoreOutputPath

5. .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:
   - Add plateau stop reason to STOP_REASONS enum

Make minimal targeted changes only."

# BATCH 2: Security — namespace isolation + optimizer
run_fix "2-security" "Fix security issues in coverage-graph namespace isolation and optimizer. Read and edit:

1. .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:
   - Add full namespace predicates (spec_folder, loop_type, session_id) to ALL NOT EXISTS subqueries in findCoverageGaps() and findUnverifiedClaims()
   - Join coverage_nodes on full composite key in findContradictions()
   - Introduce a namespace-safe query helper for consistent composite-key enforcement

2. .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:
   - Thread full namespace through every nested edge lookup

3. .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts, status.ts, convergence.ts:
   - Make sessionId required for all non-admin reads

4. .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:
   - Restrict savePromotionReport() to dedicated audit directory, reject symlinks
   - Make manifest mandatory for evaluateCandidate()

5. .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:
   - Derive search space from canonical manifest, reject unknown/locked fields

6. .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:
   - Constrain to approved corpus roots, reject symlinks, return explicit integrity errors

Make minimal targeted changes."

# BATCH 3: Wave executor + CJS lib maintainability
run_fix "3-wave-and-libs" "Fix correctness and maintainability issues in wave executor and CJS shared libraries:

1. .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:
   - Fix computeHotspotSpread() to use composite score (churn+issues), not just complexity >= median
   - Fix assignCluster() to use registrable-domain heuristic instead of TLD

2. .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:
   - Enforce adjacent phase transitions with an allowed-transition matrix

3. .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:
   - Use full 5-key composite (sessionId, generation, segment, wave, findingId) for merge dedup
   - Add authoritative board transition API

4. .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:
   - Centralize session normalization in shared helper

5. .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:
   - Rename computeMomentum to computeRecentEdgeActivity or unify with parity
   - Fix cycle-handling to match documented behavior

6. .opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs + replay-corpus.cjs:
   - Normalize schema so buildCorpus() emits exact metric shape replayRun() consumes

Make minimal targeted changes."

# BATCH 4: Workflow YAMLs + agent definitions + config/reference docs
run_fix "4-workflows-and-docs" "Fix workflow YAML issues, agent definitions, and reference doc accuracy:

1. .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml and _confirm.yaml:
   - Add graphBlockerDetail to emitted blocked_stop payload
   - Normalize reviewDimensions once during init

2. .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml and _confirm.yaml:
   - Remove direct completed-session to synthesize routing

3. .opencode/command/improve/assets/improve_improve-agent_auto.yaml and _confirm.yaml:
   - Add explicit loop steps calling mutation-coverage.cjs, candidate-lineage.cjs, trade-off-detector.cjs, benchmark-stability.cjs
   - Pass real target agent identifier to scan-integration.cjs
   - Add session-boundary gate before init

4. .opencode/agent/deep-review.md — Collapse iteration skeleton to one canonical template matching reduce-state.cjs
5. .opencode/agent/deep-research.md — Make config an explicit Step 1 input

6. .opencode/skill/sk-deep-research/assets/deep_research_config.json — Remove fork/completed-continue
7. .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml — Update to 3 supported modes only
8. .opencode/skill/sk-improve-agent/assets/improvement_config.json — Strip dormant resume fields
9. .opencode/skill/sk-deep-review/references/convergence.md — Fix to match actual blocked_stop event shape
10. .opencode/skill/sk-deep-research/references/loop_protocol.md — Fix wave section and delta-vs-full replay
11. .opencode/skill/sk-deep-review/references/loop_protocol.md — Fix delta-vs-full replay description

Make minimal targeted changes."

# BATCH 5: Test quality fixes
run_fix "5-tests" "Fix test quality issues:

1. .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts:
   - Replace shadow-copied contract with real TS source import
   - Replace tautological checks with executable assertions

2. .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-stress.vitest.ts:
   - Move wall-clock budgets to opt-in benchmark guards
   - Fix no-contradictions test to build contradiction-free graph

3. .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:
   - Add colliding-ID fixtures for higher-level read paths

4. .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts:
   - Replace alternate-config test with threshold-straddling fixtures

5. .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:
   - Assert heuristic outcomes directly

6. .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:
   - Add session_end alias tests

7. Create .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-contradictions.vitest.ts with session-scoped tests

8. Move stale test suites to archive:
   - mv .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts to tests/archive/
   - mv .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts to tests/archive/

Make minimal changes."

# BATCH 6: Spec doc traceability + playbook fixes
run_fix "6-spec-docs" "Fix traceability issues in spec documents and playbooks:

1. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:
   - Update from four-phase to eight-phase structure. Fix Phase 7 folder routing. Remove leaked template content.

2. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:
   - Fix Phase 7 routing to correct folder name

3. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md:
   - Fix remediation proof chain references. Update Lane 3 status. Fix archived report links.

4. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/implementation-summary.md:
   - Distinguish helper delivery from workflow wiring. Cite v1.2.0.0 as follow-on.

5. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment/implementation-summary.md:
   - Change Created to validated/cross-referenced for playbooks 022-024

6. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:
   - Downgrade completed-continue and fork to deferred. Mark REQ-007/REQ-016 as partial.

7. .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md:
   - Rewrite dashboard claims to registry-only outputs

8. .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/029-graph-events-emission.md:
   - Update to current flat graphEvents schema

Make minimal changes to fix documented inaccuracies only."

echo "=== ALL BATCHES COMPLETE ===" | tee -a "$LOG"
echo "End: $(date)" | tee -a "$LOG"
