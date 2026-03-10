## F-01: Causal edge creation (memory_causal_link)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. Wildcard barrel re-exports are used in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`), which conflicts with explicit-export guidance.
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md:102`).
  2. `tests/causal-edges.vitest.ts` is largely deferred placeholder coverage with `expect(true)` assertions (`.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:11,15,24,30`).
  3. No direct regression tests were found for auto-edge cap/strength cap (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:43-45,145-164`) or `createSpecDocumentChain` wiring (`causal-edges.ts:602-640`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Replace wildcard barrel exports with explicit named exports in error modules.
  2. Replace deferred placeholder causal tests with DB-backed assertions.
  3. Add targeted tests for auto-edge bounds and spec-document chain generation.

## F-02: Causal graph statistics (memory_causal_stats)
- **Status:** FAIL
- **Code Issues:**
  1. Coverage numerator counts distinct IDs from `causal_edges` without validating they exist in `memory_index`, so orphan IDs can inflate reported coverage (`.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:578-589`).
- **Standards Violations:**
  1. Wildcard barrel re-exports in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`).
- **Behavior Mismatch:**
  1. Feature defines coverage as "percentage of memories" participating (`feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md:7`), but implementation can count orphan/non-existent IDs toward the numerator (`handlers/causal-graph.ts:578-589`).
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md:105`).
  2. Handler/integration causal graph suites are deferred and do not assert orphan-inflated coverage behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:24`, `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:27`).
  3. Unit stats tests cover storage-level counts but not tool-level coverage semantics under orphan conditions (`.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:621-705,711-750`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Compute `uniqueLinked` using IDs joined against `memory_index`.
  2. Add regression test where orphan edges exist and coverage remains bounded to real memory rows.
  3. Replace wildcard error barrels with explicit exports.

## F-03: Causal edge deletion (memory_causal_unlink)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. Wildcard barrel re-exports in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md:98`).
  2. End-to-end unlink behavior remains weakly tested because causal handler/integration suites are deferred (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:24`, `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:27`).
  3. Placeholder-heavy `tests/causal-edges.vitest.ts` does not materially assert unlink workflow quality (`.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:11-39`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add DB-backed scenario tests for link -> drift_why edge discovery -> unlink cleanup.
  2. Remove stale `retry.vitest.ts` references from source tables.
  3. Replace wildcard error barrel exports with explicit exports.

## F-04: Causal chain tracing (memory_drift_why)
- **Status:** FAIL
- **Code Issues:**
  1. `max_depth_reached` can be set for natural leaf nodes (no truncation) when depth is `>= maxDepth - 1`, creating false-positive truncation warnings (`.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:122-127`).
- **Standards Violations:**
  1. Wildcard barrel re-exports in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`).
- **Behavior Mismatch:**
  1. Feature describes `maxDepthReached` as a signal that depth limit may have truncated results (`feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md:11`), but current logic can flag true without truncation (`handlers/causal-graph.ts:122-127`).
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md:109`).
  2. No assertions found for `maxDepthReached` correctness in causal handler/integration tests (both deferred: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:24`, `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:27`).
  3. `tests/causal-edges.vitest.ts` placeholder coverage does not validate depth-warning semantics (`.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:11-39`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Set `max_depth_reached` only when traversal was actually cut off by depth constraint.
  2. Add focused tests for natural leaf vs truncated chain scenarios.
  3. Replace wildcard error barrels with explicit exports.

## F-05: Epistemic baseline capture (task_preflight)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. Wildcard barrel re-exports in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:101`).
  2. Main session-learning handler suite is deferred/validation-heavy (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:28-58`).
  3. No explicit regression test validates the completed-record overwrite guard (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:191-197`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add DB-backed tests for preflight update-vs-insert behavior and complete-record protection.
  2. Remove stale `retry.vitest.ts` references from feature docs.
  3. Replace wildcard error barrels with explicit exports.

## F-06: Post-task learning measurement (task_postflight)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. Wildcard barrel re-exports in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:101`).
  2. Existing tests are primarily validation-path checks; interpretation band behavior and LI thresholds are not directly asserted (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:359-370`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:153-204`).
  3. Re-postflight correction flow (`phase IN ('preflight','complete')`) lacks targeted regression coverage (`handlers/session-learning.ts:335-342`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add table-driven tests for LI formula and interpretation boundaries.
  2. Add regression test for repeated postflight updates on an already-complete record.
  3. Replace wildcard error barrels with explicit exports.

## F-07: Learning history (memory_get_learning_history)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. Wildcard barrel re-exports in error modules (`.opencode/skill/system-spec-kit/mcp_server/lib/errors.ts:7`, `.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts:4-5`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:101`).
  2. Filter coverage exists, but boundary/ordering assertions are missing (e.g., interpretation thresholds around 15/7/0 and strict `updated_at DESC` ordering) (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:507-621`; `.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:72-274`).
  3. Deferred integration suite remains validation-only and does not verify full response semantics (`.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:12-50`).
- **Playbook Coverage:** EX-028..EX-031, NEW-* (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add response-order and interpretation-threshold regression tests.
  2. Replace deferred integration checks with DB-backed history semantics tests.
  3. Replace wildcard error barrels with explicit exports.
