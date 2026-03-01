---
title: "Implementation Plan: Sprint 0 — Measurement Foundation"
description: "Fix graph channel ID format, chunk collapse dedup, co-activation hub domination, and build evaluation infrastructure with BM25 baseline."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 0 plan"
  - "measurement foundation plan"
  - "eval infrastructure plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Sprint 0 — Measurement Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Node.js MCP server |
| **Storage** | SQLite (better-sqlite3), FTS5, sqlite-vec |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 0 — the blocking foundation sprint. Two independent tracks run in parallel: (1) Bug fixes (G1 graph ID, G3 chunk collapse, R17 fan-effect) targeting known regressions in the graph and search subsystems; (2) Eval infrastructure (R13-S1 schema, logging hooks, metric computation, BM25 baseline) creating the measurement foundation that gates all subsequent sprints.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Research complete — 142 analysis and recommendations reviewed
- [ ] G1 code location verified (`graph-search-fn.ts` ~line 110)
- [ ] G3 code location verified (`memory-search.ts` ~line 303)
- [ ] Eval DB 5-table schema designed and documented

### Definition of Done
- [ ] Sprint 0 exit gate passed — all 4 P0 requirements verified
- [ ] 20-30 new tests added and passing
- [ ] 158+ existing tests still passing
- [ ] BM25 contingency decision recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent subsystem tracks converging at verification

### Key Components
- **Graph subsystem** (Track 1): `graph-search-fn.ts` — ID format fix, returns numeric memory IDs
- **Search handlers** (Track 1): `memory-search.ts` — chunk collapse dedup on all paths
- **Scoring** (Track 1): `co-activation.ts` — fan-effect divisor for co-activation scoring
- **Eval infrastructure** (Track 2): New `speckit-eval.db` with 5-table schema — `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth`, `eval_metric_snapshots`
- **Logging hooks** (Track 2): Intercepts in search/context/trigger handlers to log queries and results to eval DB
- **Metric computation** (Track 2): MRR@5, NDCG@10, Recall@20, Hit Rate@1 computed from logged data

### Data Flow
1. **Track 1 (Bug Fixes)**: Direct code changes → unit tests → integration verification
2. **Track 2 (Eval)**: Schema creation → handler hook injection → metric computation → synthetic ground truth → BM25 baseline measurement
3. **Convergence**: Both tracks verified via Sprint 0 exit gate
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Bug Fixes (Track 1 — can run in parallel)
- [ ] G1: Fix graph ID format in `graph-search-fn.ts` lines 110 AND 151 — convert `mem:${edgeId}` to numeric (3-5h) — WHY: Graph channel has 0% hit rate due to string-vs-numeric ID mismatch; ALL downstream graph work (R4, R10, N2) is blocked until this is fixed. **Risk**: Fix may reveal sparse graph (few edges) — this is informational, not a failure.
- [ ] G3: Fix chunk collapse conditional in `memory-search.ts` — dedup on ALL paths (2-4h) — WHY: Duplicate chunks inflate result counts and distort MRR/NDCG metrics, making baseline measurements unreliable. Note: The bug is at the call site (~line 1002), not the function definition (~line 303).
- [ ] R17: Add fan-effect divisor to co-activation in `co-activation.ts` (1-2h) — WHY: Without fan-effect correction, hub memories with many co-activations dominate results regardless of query relevance, poisoning evaluation baselines.
- [ ] TM-02: Add SHA256 content-hash fast-path dedup in `memory-save.ts` — O(1) check BEFORE embedding generation, rejects exact duplicates in same `spec_folder` (2-3h) — WHY: Prevents wasted embedding API calls on re-saves; establishes the checkpoint where PI-A5 quality gate will be inserted.

### Phase 2: Eval Infrastructure (Track 2 — sequential)
- [ ] R13-S1: Create `speckit-eval.db` with 5-table schema (8-10h)
- [ ] R13-S1: Add logging hooks to search, context, and trigger handlers (6-8h)
- [ ] R13-S1: Implement core metric computation — MRR@5, NDCG@10, Recall@20, Hit Rate@1 (4-6h)

### Phase 2b: Agent Consumption Pre-Analysis (before ground truth generation)
- [ ] G-NEW-2 Pre-Analysis: Lightweight agent consumption pattern survey (3-4h) — WHY: Understanding how AI agents currently query memory_search (what patterns, what they select, what they ignore) directly informs ground truth query design. Without this, synthetic queries risk being unrepresentative of real usage.
  - Analyze recent agent query logs for pattern categories
  - Identify top 5-10 consumption patterns by frequency
  - Document findings as input to ground truth query design (T007)
  - **Risk**: If no agent logs available, fall back to manual pattern enumeration from CLAUDE.md and skill definitions

### Phase 3: Baseline (requires Phase 2 and Phase 2b)
- [ ] G-NEW-1/G-NEW-3: Generate ground truth — minimum 100 query-relevance pairs (50 minimum for initial baseline; >=100 required for BM25 contingency decision). MUST satisfy diversity requirement: >=5 queries per intent type, >=3 query complexity tiers (simple, moderate, complex), >=30 manually curated queries NOT derived from trigger phrases. Incorporate G-NEW-2 pre-analysis findings into query design. (2-4h)
- [ ] G-NEW-1: Run BM25-only baseline measurement and record MRR@5 (4-6h)

### Phase 4: Verification
- [ ] Sprint 0 exit gate verification — all P0 requirements confirmed
- [ ] BM25 contingency decision recorded

**Note**: PI-A5 (Verify-Fix-Verify for Memory Quality, 12-16h) deferred to Sprint 1 per Ultra-Think Review REC-09 — P1 priority, not in handoff criteria, not a downstream dependency for Sprint 0 exit gate. TM-02 (T054, SHA256 content-hash dedup) remains in Sprint 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | G1 numeric IDs, G3 all code paths, R17 bounds | Vitest | 4-6 tests |
| Unit | R13-S1 schema creation, hooks, metric computation | Vitest | 3-4 tests |
| Unit | BM25 baseline path | Vitest | 1-2 tests |
| Unit | T054 SHA256 content-hash dedup — reject exact duplicates, pass distinct content | Vitest | 2-3 tests |
| Unit | T004b observer effect — search p95 with eval logging on vs off | Vitest | 1-2 tests |
| Unit | T006a-e diagnostic metrics — inversion rate, constitutional surfacing, importance-weighted recall, cold-start detection, intent-weighted NDCG | Vitest | 5 tests |
| Unit | T006f ceiling eval — full-context LLM ceiling metric computation | Vitest | 1 test |
| Unit | T006g quality proxy — formula produces [0,1] range, correlates with manual | Vitest | 1-2 tests |
| Unit | T007 ground truth diversity — query distribution meets intent/complexity/manual thresholds | Vitest | 1-2 tests |
| Integration | End-to-end search with graph channel active | Vitest | ~2 tests |
| Manual | Verify graph hit rate > 0% in real queries | Manual inspection | N/A |

**Total**: 20-30 new tests, estimated 400-600 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| better-sqlite3 | Internal | Green | Cannot create eval DB |
| FTS5 extension | Internal | Green | BM25 baseline blocked |
| 142 research analysis | Internal | Green | Design decisions unclear |
| None (Sprint 0 is first) | N/A | N/A | No predecessor dependencies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: G1/G3 fixes cause test regressions, or eval DB impacts primary DB performance
- **Procedure**: Revert 3 function changes (G1, G3, R17) + delete `speckit-eval.db` file
- **Estimated time**: 1-2h
- **Difficulty**: LOW — changes are isolated; eval DB is a new separate file
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Bug Fixes) ────────────────────┐
  G1, G3, R17 — parallel               │
                                         ├──► Phase 4 (Verification)
Phase 2 (Eval Infrastructure) ──────────┤
  Schema → Hooks → Metrics — sequential │
                              │         │
                              ▼         │
                    Phase 3 (Baseline) ─┘
                      G-NEW-1 — requires Phase 2
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Bug Fixes) | None | Phase 4 (Verification) |
| Phase 2 (Eval Infrastructure) | None | Phase 2b, Phase 3 (Baseline), Phase 4 |
| Phase 2b (Agent Consumption Pre-Analysis) | None (can start independently) | Phase 3 (findings feed query design) |
| Phase 3 (Baseline) | Phase 2, Phase 2b | Phase 4 |
| Phase 4 (Verification) | Phase 1, Phase 2, Phase 3 | Sprint 1 (next sprint) |

**Note**: Phase 1 and Phase 2 are independent tracks — they can execute in parallel.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Bug Fixes) | Low-Medium | 8-14h |
| Phase 2 (Eval Infrastructure) | High | 28-39h |
| Phase 2b (Agent Pre-Analysis) | Low-Medium | 3-4h |
| Phase 3 (Baseline) | Medium | 8-13h |
| Phase 4 (Verification) | Low | Included in phases |
| ~~Phase 5 (PI-A5)~~ | ~~Medium~~ | ~~12-16h~~ — **Deferred to Sprint 1 (REC-09)** |
| **Total** | | **47-70h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] 158+ existing tests verified passing before changes
- [ ] Eval DB path configured as separate file (not in primary DB)
- [ ] G1/G3/R17 changes are function-scoped (no cross-cutting impact)

### Rollback Procedure
1. **Immediate**: Disable eval logging hooks (comment out or flag)
2. **Revert code**: `git revert` for G1, G3, R17 function changes
3. **Delete eval DB**: Remove `speckit-eval.db` file — no primary DB impact
4. **Verify rollback**: Run 158+ existing test suite

### Data Reversal
- **Has data migrations?** Yes — new `speckit-eval.db` file with 5 tables
- **Reversal procedure**: Delete `speckit-eval.db` file. No changes to primary database schema.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../plan.md`

---

<!--
LEVEL 2 PLAN — Phase 1 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 0: BLOCKING foundation sprint
- Two independent tracks: Bug Fixes + Eval Infrastructure
-->
