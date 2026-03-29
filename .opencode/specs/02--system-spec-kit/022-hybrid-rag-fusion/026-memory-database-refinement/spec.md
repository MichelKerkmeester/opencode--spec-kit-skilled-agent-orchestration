---
title: "Feature Specification: Memory Database Refinement"
description: "The Spec Kit Memory MCP server has 31 tools, 57-column schema, 5-channel hybrid search, causal graph, FSRS scheduling, and a 2,500-LOC save pipeline. A systematic deep-research review audit is needed to surface logic errors, integrity risks, and correctness issues across the full runtime surface before they manifest as production failures."
trigger_phrases:
  - "memory database refinement"
  - "memory db audit"
  - "mcp server review"
  - "causal graph issues"
  - "search pipeline bugs"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Memory Database Refinement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase 12 in progress — 30-iteration audit + 4 fix sprints + P2 triage complete; 10-iteration meta-review found 29 new findings (1 P0 + 17 P1 + 11 P2); remediation pending |
| **Created** | 2026-03-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec Kit Memory MCP server is a 70K+ LOC system with 31 MCP tools, a 57-column `memory_index` table, 5-channel hybrid search, causal graph traversal, FSRS-based scheduling, PE-gating, reconsolidation, lineage versioning, and a 2,500-LOC monolithic save pipeline. Prior spec work (023-ablation-benchmark-integrity) already exposed silent cross-DB scoring, evaluation-time truncation leaking into Recall@20, and stale ground-truth IDs. The system has 26 documented BUG-fix comments, a flagged modularization TODO on the save handler, and multiple gated feature flags whose interaction paths are untested in combination.

No systematic review has been performed across the full runtime surface. Logic errors in causal graph traversal, transaction boundaries that do not cover file-system writes, race conditions in embedding generation, and edge cases in the chunking/thinning pipeline may exist undetected.

### Purpose
Run a 30-iteration deep-research review audit across the full MCP server runtime, then fix all P0 blockers and P1 required fixes. The review phase (complete) produced 121 findings. The fix phase addressed them in 4 sprints organized by risk cluster, plus P2 triage (22 fixed, 16 deferred then fixed, 3 rejected). A subsequent 10-iteration meta-review (iterations 031-040) assessed the quality of both the audit and the fixes, finding 29 additional issues that require remediation in Phase 12.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

The review audit covers these dimensions, one per iteration or grouped as the review agent deems productive:

| # | Dimension | Key Files |
|---|-----------|-----------|
| 1 | **Save pipeline integrity** | `handlers/memory-save.ts`, `pe-gating.ts`, `quality-loop.ts`, `mutation-hooks.ts` |
| 2 | **Transaction safety** | `lib/storage/transaction-manager.ts`, `vector-index-mutations.ts` |
| 3 | **Causal graph correctness** | `lib/storage/causal-edges.ts`, `handlers/causal-graph.ts` |
| 4 | **Hybrid search pipeline** | `lib/search/hybrid-search.ts`, `bm25-index.ts`, `sqlite-fts.ts`, `vector-index-queries.ts` |
| 5 | **Embedding lifecycle** | `lib/providers/embeddings.ts`, `lib/cache/embedding-cache.ts`, `vector-index-store.ts` |
| 6 | **Chunking and thinning** | `handlers/chunking-orchestrator.ts`, chunk-related helpers |
| 7 | **Lineage and versioning** | `lib/storage/lineage-state.ts`, `active_memory_projection` table |
| 8 | **Schema migrations** | `lib/search/vector-index-schema.ts`, migration safety |
| 9 | **Feature flag interactions** | All `SPECKIT_*` flags, `search-flags.ts`, `lib/config/` |
| 10 | **Memory parsing and validation** | `lib/parsing/memory-parser.ts`, `content-normalizer.ts` |
| 11 | **Checkpoint lifecycle** | `handlers/checkpoints.ts`, `lib/storage/checkpoints.ts` |
| 12 | **Shared memory and governance** | `handlers/shared-memory.ts`, tenant/scope enforcement |
| 13 | **Session learning (FSRS)** | `handlers/session-learning.ts`, stability/difficulty columns |
| 14 | **Reconsolidation bridge** | `lib/storage/reconsolidation.ts`, interference scoring |
| 15 | **Query routing and intent** | `lib/search/query-router.ts`, `intent-classifier.ts` |
| 16 | **Error handling and recovery** | `lib/errors.ts`, handler-level error paths |
| 17 | **Index scan and ingest** | `handlers/memory-index.ts`, `memory-ingest.ts` |
| 18 | **Graph signals and degree boost** | `lib/graph/graph-signals.ts`, `search/graph-search-fn.ts` |
| 19 | **Eval framework correctness** | `lib/eval/ablation-framework.ts`, `eval-metrics.ts`, `reporting-dashboard.ts` |
| 20 | **Cross-cutting: concurrency and state** | Global singletons, module-level state, race conditions |

### Out of Scope
- UI/UX changes to MCP tool schemas

**Note:** The original spec declared fix implementation and performance tuning out of scope. Scope was expanded during execution to include fix sprints (Phases 2-10), P2 triage (Phase 9), deferred P2 fixes (Phase 10), documentation alignment (Phase 11), meta-review remediation (Phase 12), and deep research refinement implementation (Phase 13 covering concurrency, performance, SQLite optimization, error recovery, and dead code cleanup).

### Files to Review

All files under `.opencode/skill/system-spec-kit/mcp_server/` with focus on:
- `handlers/*.ts` (13 handler modules)
- `lib/search/*.ts` (hybrid search pipeline)
- `lib/storage/*.ts` (causal edges, lineage, checkpoints, transactions)
- `lib/eval/*.ts` (ablation, metrics, reporting)
- `lib/parsing/*.ts` (memory parser, content normalizer)
- `lib/graph/*.ts` (graph signals)
- `lib/config/*.ts` (feature flags, type inference)
- `lib/providers/*.ts` (embeddings, retry)
- `tests/*.vitest.ts` (test coverage gaps)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 30-iteration deep-research review audit against the MCP server codebase. | DONE — 30 iterations complete with 121 findings in `review/iterations/`. |
| REQ-002 | Each iteration must review a distinct dimension or cross-cutting concern. | DONE — 30 dimensions covered (20 primary + 10 deep dives). |
| REQ-003 | Findings must be classified as P0/P1/P2 with fix recommendations. | DONE — 5 P0, 75 P1, 41 P2 classified in `review/review-report-v1-original-audit.md`. |
| REQ-003a | Fix all P0 blockers. | DONE — All 5 P0 findings fixed with tests and build passing. |
| REQ-003b | Fix all P1 required issues or get user-approved deferral. | DONE — 75 P1 findings fixed across 4 sprints. |
| REQ-006 | Meta-review of audit + fix quality. | DONE — 10-iteration meta-review (031-040) produced 29 findings in `review/review-report.md`. |
| REQ-007 | Remediate meta-review findings. | DONE — Phase 12 fixed all 29 meta-review findings (1 P0, 17 P1, 11 P2). |
| REQ-008 | Deep research for further refinement opportunities. | DONE — 5-iteration research found 28 findings (4 concurrency, 7 search perf, 6 SQLite, 4 error recovery, 7 dead code). |
| REQ-009 | Implement research refinement findings. | Phase 13 — 28 findings to be fixed across 5 workstreams. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Final synthesis report ranks all findings by severity and groups by dimension. | DONE — `review/review-report.md` with sorted tables and sprint plan. |
| REQ-005 | The review must identify test coverage gaps for each finding. | DONE — documented per iteration. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 30 review iterations complete (20 primary + 10 deep dives). DONE.
- **SC-002**: Final report contains a ranked findings list with zero unclassified findings. DONE.
- **SC-003**: Each P0 finding has a clear reproduction path or code citation. DONE.
- **SC-004**: The findings report is actionable — each item can seed a follow-up fix spec. DONE.
- **SC-005**: All original P0 and P1 findings fixed with passing tests. DONE.
- **SC-006**: Meta-review findings (Phase 12) remediated — 0 active P0 blockers remaining. DONE.
- **SC-007**: 5-iteration deep research completed — 28 refinement opportunities identified. DONE.
- **SC-008**: Research refinement findings (Phase 13) implemented — 28 findings fixed. PENDING.

### Acceptance Scenarios

**Given** the review agent has access to the full `mcp_server/` source tree, **when** all 30 iterations complete, **then** `review/review-report-v1-original-audit.md` exists with P0/P1/P2 classified findings covering all 20+ dimensions.

**Given** a P0 finding is reported, **when** the finding is reviewed, **then** it includes a file path, line range, code citation, and one-sentence fix recommendation.

**Given** the meta-review completes, **when** new findings are reported, **then** `review/review-report.md` (v2) contains the deduplicated registry and `tasks.md` Phase 12 tracks remediation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Review iterations may surface false positives | Noise in findings report | Each finding must cite source code; ambiguous items marked P2 |
| Risk | 30 iterations may not cover all dimensions equally | Shallow coverage on some areas | Strategy assigns priority dimensions to early iterations; deep dives 021-030 added for high-density areas |
| Dependency | CocoIndex semantic search for code discovery | Required for concept-based exploration | Verify CocoIndex MCP is available before starting |
| Risk | Context window limits per iteration | Agent may miss cross-file interactions | Cross-cutting dimensions (19-20) explicitly span multiple modules |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at spec time. The review scope and iteration count are defined; findings will drive follow-up decisions.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Each iteration must complete independently. A failure in iteration N must not block iteration N+1.
- **NFR-R02**: State must be externalized to JSONL so the review can resume after interruption.

### Quality
- **NFR-Q01**: Findings must reference specific file paths and line ranges, not general descriptions.
- **NFR-Q02**: The review must not modify any source files. Read-only audit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Files with 2,000+ LOC (memory-save.ts, hybrid-search.ts, vector-index-schema.ts): review in focused slices.
- Test files: review for coverage gaps but do not flag test code style as findings.

### Error Scenarios
- If CocoIndex is unavailable: fall back to Grep/Glob for code discovery.
- If an iteration finds zero new findings: mark as "clean" and advance to next dimension.

### State Transitions
- If convergence is detected before iteration 30: the review may terminate early with a note in the final report.
- If a single dimension yields 10+ findings: split across two iterations rather than producing an unreadable single report.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 13 handler modules, 5 search channels, causal graph, eval framework, governance |
| Risk | 16/25 | Read-only audit; risk is in false positives, not production impact |
| Research | 18/20 | Deep code comprehension required across 70K+ LOC |
| **Total** | **56/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
