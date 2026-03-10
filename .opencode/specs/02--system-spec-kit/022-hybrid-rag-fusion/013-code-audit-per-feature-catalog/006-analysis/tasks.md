# Tasks — Phase 006: Analysis

## Summary

| Priority | Count | Description                                            |
| -------- | ----- | ------------------------------------------------------ |
| **P0**   | 4     | FAIL findings — correctness bugs, behavior mismatches  |
| **P1**   | 8     | WARN findings — standards violations, significant gaps |
| **P2**   | 7     | WARN findings — test/doc gaps only                     |
| **Total**| 19    |                                                        |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Fix orphan-inflated causal coverage computation
- **Priority:** P0
- **Feature:** F-02 Causal graph statistics (memory_causal_stats)
- **Status:** TODO
- **Source:** `handlers/causal-graph.ts:578-589`
- **Issue:** Coverage numerator counts distinct IDs from `causal_edges` without validating they exist in `memory_index`, so orphan IDs can inflate reported coverage beyond actual memory count.
- **Fix:** Compute `uniqueLinked` using IDs joined against `memory_index` so only real memory rows contribute to coverage.

### T-02: Add orphan-edge coverage regression test
- **Priority:** P0
- **Feature:** F-02 Causal graph statistics (memory_causal_stats)
- **Status:** TODO
- **Source:** `tests/handler-causal-graph.vitest.ts:24`, `tests/integration-causal-graph.vitest.ts:27`, `tests/causal-edges-unit.vitest.ts:621-705,711-750`
- **Issue:** Handler/integration causal graph suites are deferred; unit stats tests cover storage-level counts but not tool-level coverage semantics under orphan conditions.
- **Fix:** Add regression test where orphan edges exist and verify coverage remains bounded to real memory rows.

### T-03: Fix false-positive maxDepthReached flag
- **Priority:** P0
- **Feature:** F-04 Causal chain tracing (memory_drift_why)
- **Status:** TODO
- **Source:** `handlers/causal-graph.ts:122-127`
- **Issue:** `max_depth_reached` can be set for natural leaf nodes (no truncation) when depth is `>= maxDepth - 1`, creating false-positive truncation warnings that mislead consumers.
- **Fix:** Set `max_depth_reached` only when traversal was actually cut off by depth constraint, not when chain terminates naturally at a leaf.

### T-04: Add natural-leaf vs truncated-chain tests
- **Priority:** P0
- **Feature:** F-04 Causal chain tracing (memory_drift_why)
- **Status:** TODO
- **Source:** `tests/handler-causal-graph.vitest.ts:24`, `tests/integration-causal-graph.vitest.ts:27`, `tests/causal-edges.vitest.ts:11-39`
- **Issue:** No assertions found for `maxDepthReached` correctness; causal handler/integration tests are deferred; placeholder coverage does not validate depth-warning semantics.
- **Fix:** Add focused tests for natural leaf vs truncated chain scenarios verifying `max_depth_reached` flag accuracy.

---

## P1 — WARN (Behavior Mismatch / Standards Violations)

### T-05: Replace wildcard barrel exports in error modules
- **Priority:** P1
- **Feature:** F-01 Causal edge creation (memory_causal_link)
- **Status:** TODO
- **Source:** `lib/errors.ts:7`, `lib/errors/index.ts:4-5`
- **Issue:** Wildcard barrel re-exports conflict with explicit-export guidance; affects F-01 through F-07 in this phase.
- **Fix:** Replace wildcard re-exports with explicit named exports in error modules.

### T-06: Replace deferred causal-edge placeholder tests with DB-backed assertions
- **Priority:** P1
- **Feature:** F-01 Causal edge creation (memory_causal_link)
- **Status:** TODO
- **Source:** `tests/causal-edges.vitest.ts:11,15,24,30`, `lib/storage/causal-edges.ts:43-45,145-164,602-640`
- **Issue:** `tests/causal-edges.vitest.ts` is largely deferred placeholder coverage with `expect(true)` assertions; no regression tests for auto-edge cap/strength cap or `createSpecDocumentChain` wiring.
- **Fix:** Replace deferred placeholder tests with DB-backed assertions; add targeted tests for auto-edge bounds and spec-document chain generation.

### T-07: Add DB-backed unlink workflow tests
- **Priority:** P1
- **Feature:** F-03 Causal edge deletion (memory_causal_unlink)
- **Status:** TODO
- **Source:** `tests/handler-causal-graph.vitest.ts:24`, `tests/integration-causal-graph.vitest.ts:27`, `tests/causal-edges.vitest.ts:11-39`
- **Issue:** End-to-end unlink behavior remains weakly tested; causal handler/integration suites are deferred; placeholder-heavy tests do not materially assert unlink workflow quality.
- **Fix:** Add DB-backed scenario tests for link -> drift_why edge discovery -> unlink cleanup flow.

### T-08: Add preflight overwrite guard regression test
- **Priority:** P1
- **Feature:** F-05 Epistemic baseline capture (task_preflight)
- **Status:** TODO
- **Source:** `handlers/session-learning.ts:191-197`, `tests/handler-session-learning.vitest.ts:28-58`
- **Issue:** Main session-learning handler suite is deferred/validation-heavy; no explicit regression test validates the completed-record overwrite guard.
- **Fix:** Add DB-backed tests for preflight update-vs-insert behavior and complete-record protection.

### T-09: Add LI formula and interpretation band tests
- **Priority:** P1
- **Feature:** F-06 Post-task learning measurement (task_postflight)
- **Status:** TODO
- **Source:** `handlers/session-learning.ts:335-342,359-370`, `tests/handler-session-learning.vitest.ts:153-204`
- **Issue:** Existing tests are primarily validation-path checks; interpretation band behavior and LI thresholds are not directly asserted; re-postflight correction flow lacks targeted regression coverage.
- **Fix:** Add table-driven tests for LI formula and interpretation boundaries; add regression test for repeated postflight updates on an already-complete record.

### T-10: Add learning history ordering and threshold regression tests
- **Priority:** P1
- **Feature:** F-07 Learning history (memory_get_learning_history)
- **Status:** TODO
- **Source:** `handlers/session-learning.ts:507-621`, `tests/learning-stats-filters.vitest.ts:72-274`, `tests/integration-learning-history.vitest.ts:12-50`
- **Issue:** Filter coverage exists but boundary/ordering assertions are missing (e.g., interpretation thresholds around 15/7/0 and strict `updated_at DESC` ordering); deferred integration suite remains validation-only.
- **Fix:** Add response-order and interpretation-threshold regression tests; replace deferred integration checks with DB-backed history semantics tests.

### T-11: Add causal-stats handler integration coverage
- **Priority:** P1
- **Feature:** F-02 Causal graph statistics (memory_causal_stats)
- **Status:** TODO
- **Source:** `tests/handler-causal-graph.vitest.ts:24`, `tests/integration-causal-graph.vitest.ts:27`
- **Issue:** Both handler and integration causal graph suites are deferred, providing no real coverage of the stats tool path.
- **Fix:** Replace deferred suites with DB-backed handler integration tests covering edge counts, coverage computation, and graph density.

### T-12: Add drift_why handler integration tests
- **Priority:** P1
- **Feature:** F-04 Causal chain tracing (memory_drift_why)
- **Status:** TODO
- **Source:** `tests/handler-causal-graph.vitest.ts:24`, `tests/integration-causal-graph.vitest.ts:27`
- **Issue:** Handler and integration causal graph suites are deferred; no handler-level tests validate drift_why argument handling or response structure.
- **Fix:** Replace deferred suites with DB-backed handler integration tests covering depth traversal, cycle detection, and response envelope.

---

## P2 — WARN (Documentation / Test Gaps)

### T-13: Remove stale retry.vitest.ts reference (F-01)
- **Priority:** P2
- **Feature:** F-01 Causal edge creation (memory_causal_link)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md:102`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-14: Remove stale retry.vitest.ts reference (F-02)
- **Priority:** P2
- **Feature:** F-02 Causal graph statistics (memory_causal_stats)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md:105`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-15: Remove stale retry.vitest.ts reference (F-03)
- **Priority:** P2
- **Feature:** F-03 Causal edge deletion (memory_causal_unlink)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md:98`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-16: Remove stale retry.vitest.ts reference (F-04)
- **Priority:** P2
- **Feature:** F-04 Causal chain tracing (memory_drift_why)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md:109`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-17: Remove stale retry.vitest.ts reference (F-05)
- **Priority:** P2
- **Feature:** F-05 Epistemic baseline capture (task_preflight)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md:101`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-18: Remove stale retry.vitest.ts reference (F-06)
- **Priority:** P2
- **Feature:** F-06 Post-task learning measurement (task_postflight)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md:101`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.

### T-19: Remove stale retry.vitest.ts reference (F-07)
- **Priority:** P2
- **Feature:** F-07 Learning history (memory_get_learning_history)
- **Status:** TODO
- **Source:** `feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:101`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature test inventory.
