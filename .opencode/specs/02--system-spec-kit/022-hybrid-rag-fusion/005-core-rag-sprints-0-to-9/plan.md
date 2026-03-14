---
title: "Implementation Plan: Core RAG Sprints 0 to 9 Consolidation"
description: "Consolidated implementation plan covering former sprint folders 006 through 019 (Sprints 0-9)."
SPECKIT_TEMPLATE_SOURCE: "plan-core + consolidation-merge | v2.2"
trigger_phrases:
  - "core rag sprints 0 to 9 plan"
  - "sprint 0 to 9 consolidated plan"
  - "sprint 9 plan"
importance_tier: "critical"
contextType: "implementation"
---
# 005 Core RAG Sprints 0 to 9 - Consolidated plan

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + consolidation-merge | v2.2 -->

This file consolidates `plan.md` from sprint folders 006 through 019.

Source folders:
- 006-measurement-foundation/plan.md
- 011-graph-signal-activation/plan.md
- 012-scoring-calibration/plan.md
- 013-query-intelligence/plan.md
- 014-feedback-and-quality/plan.md
- 015-pipeline-refactor/plan.md
- 016-indexing-and-graph/plan.md
- 017-long-horizon/plan.md
- 018-deferred-features/plan.md
- 019-extra-features/plan.md

---

## 006-measurement-foundation

Source: 006-measurement-foundation/plan.md

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
- **Parent Plan**: See `../000-feature-overview/plan.md

---

<!--
LEVEL 2 PLAN — Phase 1 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 0: BLOCKING foundation sprint
- Two independent tracks: Bug Fixes + Eval Infrastructure
-->

---

## 011-graph-signal-activation

Source: 011-graph-signal-activation/plan.md`

---
title: "Implementation Plan: Sprint 1 — Graph Signal Activation"
description: "Implement typed-weighted degree as 5th RRF channel, measure edge density, and add agent consumption instrumentation."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 1 plan"
  - "graph signal plan"
  - "R4 plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Sprint 1 — Graph Signal Activation

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
| **Storage** | SQLite (better-sqlite3), sqlite-vec, causal_edges table |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 1 — graph signal activation. The primary deliverable is R4: typed-weighted degree scoring as a 5th RRF channel. The degree formula computes `typed_degree(node) = SUM(weight_t * count_t)` per edge type, normalized via `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`. The channel runs behind a feature flag (`SPECKIT_DEGREE_BOOST`) with a dark-run phase before enablement. Secondary deliverables include edge density measurement and G-NEW-2 agent consumption instrumentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 0 exit gate passed (graph functional, eval infrastructure operational)
- [ ] BM25 baseline MRR@5 recorded (Sprint 0 deliverable)
- [ ] Edge type weights confirmed: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5

### Definition of Done
- [ ] R4 dark-run passes — MRR@5 delta >+2% absolute
- [ ] No single memory in >60% of dark-run results
- [ ] Edge density measured; R10 escalation decision documented
- [ ] 18-25 new tests added and passing
- [ ] 158+ existing tests still passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Channel extension — adding a 5th signal to existing RRF fusion pipeline

### Key Components
- **Degree computation** (`graph-search-fn.ts`): SQL query to compute typed-weighted degree per memory ID from `causal_edges` table. Formula: `typed_degree(node) = SUM(weight_t * count_t)`. Edge type weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5.
- **Normalization**: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`. MAX_TYPED_DEGREE=15 (computed global with fallback). Capped at DEGREE_BOOST_CAP=0.15.
- **RRF integration** (`rrf-fusion.ts`): Degree scores fed as 5th channel into Reciprocal Rank Fusion.
- **Feature flag**: `SPECKIT_DEGREE_BOOST` — graduated to ON by default (dark-run comparison completed; set `SPECKIT_DEGREE_BOOST=false` to disable).
- **Degree cache**: Computed once per graph mutation, not per query. Invalidated when `causal_edges` table changes.

### Data Flow
1. Query arrives at hybrid search
2. Existing 4 channels execute (vector, FTS5, trigger, graph-traverse)
3. If `SPECKIT_DEGREE_BOOST` enabled: degree computation SQL runs on `causal_edges`
4. Degree scores normalized and capped
5. 5-channel RRF fusion produces final ranking
6. Results logged to R13 eval infrastructure for dark-run comparison
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Degree Computation
- [ ] Implement typed-weighted degree SQL query against `causal_edges` table (4-5h) — WHY: Graph structural connectivity is the most orthogonal signal available (low correlation with vector/FTS5). **Risk**: Sparse graph may yield minimal differentiation; acceptable if R4 returns zero for unconnected memories.
- [ ] Add TypeScript normalization + capping logic (2-3h) — WHY: Raw degree values vary by orders of magnitude; log normalization + cap prevents degree from dominating RRF fusion.
- [ ] Implement degree cache with mutation-triggered invalidation (2-3h) — WHY: Degree computation involves SQL aggregation over `causal_edges`; per-query execution is too expensive (>10ms budget). Cache amortizes cost across queries between graph mutations.

### Phase 2: RRF Integration
- [ ] Integrate degree as 5th channel in `rrf-fusion.ts` behind `SPECKIT_DEGREE_BOOST` flag (2-3h)
- [ ] Wire degree scores into `hybrid-search.ts` pipeline (2-3h)

### Phase 3: Measurement + Co-activation
- [ ] Compute edge density (edges/node) from `causal_edges` data (2-3h)
- [ ] Document R10 escalation decision based on density threshold (included)
- [ ] A7: Increase co-activation boost strength — raise base multiplier from 0.1x to 0.25-0.3x (configurable coefficient via `SPECKIT_COACTIVATION_STRENGTH`); dark-run verifiable (2-4h) — WHY: Graph signal investment must be visible in results; current 0.1x multiplier produces ~5% effective contribution at hop 2, well below the >=15% target.

### Phase 4: Agent UX + Signal Vocabulary
- [ ] G-NEW-2: Agent consumption instrumentation — add logging for consumption patterns (4-6h)
- [ ] G-NEW-2: Initial pattern analysis and report (4-6h)
- [ ] TM-08: Expand importance signal vocabulary in `trigger-matcher.ts` — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") based on true-mem's 8-category vocabulary (2-4h)

### Phase 5: Dark-Run and Verification
- [ ] Enable R4 in dark-run mode — three-measurement sequence:
  1. Sprint 0 baseline MRR@5 (already recorded)
  2. R4-only dark-run with A7 at original 0.1x
  3. R4+A7 dark-run with A7 at 0.25-0.3x
- [ ] Verify MRR@5 delta >+2% absolute; no single memory >60% presence
- [ ] Enable R4 permanently if dark-run passes (0h — flag flip)

### Phase 6: PI-A3 — Pre-Flight Token Budget Validation (4-6h)
- [ ] PI-A3-1: Implement token count estimation across candidate result set — sum content/summary tokens before response assembly (`hybrid-search.ts` or result assembler layer) [1-2h]
- [ ] PI-A3-2: Implement truncation logic — if total tokens exceed budget, drop lowest-scoring candidates (greedy highest-first) until within budget [1-2h]
- [ ] PI-A3-3: Implement `includeContent=true` single-result summary fallback — if a single result alone exceeds budget, return summary field instead of full content [1h]
- [ ] PI-A3-4: Implement overflow event logging — log query_id, candidate_count, total_tokens, budget_limit, truncated_to_count to eval infrastructure (extends R-004 benchmark dataset) [1h]

**Dependencies**: Sprint 0 eval infrastructure (R13-S1) must be operational for overflow event logging. PI-A3 is additive — no changes to RRF fusion or scoring; only post-fusion result assembly is affected.
**Effort**: 4-6h, Low risk

**Deferral option**: PI-A3 is logically orthogonal to graph signal activation. If sprint capacity is constrained, PI-A3 can be deferred to Sprint 2 or 3 without affecting any Sprint 1 exit gate (CHK-060 through CHK-066). Prioritize T004 (G-NEW-2, P1 required) over PI-A3 if capacity is limited.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R4: Degree SQL correctness — known edge data produces expected scores | Vitest | 2-3 tests |
| Unit | R4: Normalization bounds — output in [0, 0.15] range | Vitest | 1-2 tests |
| Unit | R4: Cache invalidation — stale after mutation | Vitest | 1 test |
| Unit | R4: Constitutional exclusion — no degree boost for constitutional memories | Vitest | 1 test |
| Unit | A7: Co-activation boost at 0.25-0.3x — effective contribution >=15% at hop 2 | Vitest | 1-2 tests |
| Unit | A7: Co-activation configurable coefficient via `SPECKIT_COACTIVATION_STRENGTH` | Vitest | 1 test |
| Unit | G-NEW-2: Instrumentation hooks fire on `memory_search`, `memory_context`, `memory_match_triggers` | Vitest | 3 tests |
| Unit | G-NEW-2: Consumption log captures query text, result count, selected IDs, ignored IDs | Vitest | 1-2 tests |
| Unit | TM-08: CORRECTION signals ("actually", "wait", "I was wrong") classified correctly | Vitest | 1-2 tests |
| Unit | TM-08: PREFERENCE signals ("prefer", "like", "want") classified correctly | Vitest | 1-2 tests |
| Unit | PI-A3: Token budget truncation — candidate set reduced to fit budget (greedy highest-first) | Vitest | 1-2 tests |
| Unit | PI-A3: `includeContent=true` single-result overflow returns summary fallback | Vitest | 1 test |
| Unit | Feature flag: `SPECKIT_DEGREE_BOOST=false` yields identical results to 4-channel baseline | Vitest | 1 test |
| Integration | 5-channel RRF fusion end-to-end with degree scores | Vitest | 1-2 tests |
| Manual | Dark-run comparison via R13 metrics (three-measurement sequence) | Manual | N/A |

**Total**: 18-25 new tests, estimated 500-800 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 0 exit gate | Internal | Pending | Cannot start Sprint 1 — WHY: Graph channel must be functional (G1) and eval infrastructure (R13-S1) must be operational before degree scoring can be measured |
| R13-S1 eval infrastructure | Internal | Pending (Sprint 0) | Cannot measure dark-run results — WHY: R4 dark-run comparison requires baseline metrics and eval logging from Sprint 0 |
| Sprint 2 (parallel) | Internal | Pending | **No dependency** — Sprint 1 and Sprint 2 can execute in parallel after Sprint 0. Sprint 2's scope (R18, N4, G2, normalization) has zero technical dependency on Sprint 1 deliverables (R4, edge density). Parallel execution saves 3-5 weeks on critical path. |
| `causal_edges` table | Internal | Green | Already exists; G1 fix makes it queryable |
| Feature flag system | Internal | Green | Env var based — `SPECKIT_DEGREE_BOOST` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R4 dark-run fails (MRR@5 delta <+2%), or hub domination detected despite caps
- **Procedure**: Disable `SPECKIT_DEGREE_BOOST` flag; revert R4 code changes in 3 files
- **Estimated time**: 1-2h
- **Difficulty**: LOW — feature flag provides instant disable; code changes are additive
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Degree Computation) ──► Phase 2 (RRF Integration) ──► Phase 5 (Dark-Run)
                                                                       ▲
Phase 3 (Measurement + Co-activation) ─────────────────────────────────┘
Phase 4 (Agent UX) ─────────────────────────────────────────────────────┘

Phase 6 (PI-A3) ─── (independent, no blockers from Phase 5)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Degree Computation) | Sprint 0 gate | Phase 2 |
| Phase 2 (RRF Integration) | Phase 1 | Phase 5 |
| Phase 3 (Measurement + Co-activation) | Sprint 0 gate, Phase 1 (T003a depends on T001) | Phase 5 |
| Phase 4 (Agent UX) | Sprint 0 gate | Phase 5 |
| Phase 5 (Dark-Run) | Phase 2, Phase 3, Phase 4 | Sprint 2 (next sprint — can run in parallel) |
| Phase 6 (PI-A3 Token Budget) | Sprint 0 gate | None (independent) |

**Cross-Sprint Parallelization**: Sprint 2 can begin immediately after Sprint 0 exit gate, in parallel with Sprint 1. Sprint 2's deliverables (R18, N4, G2, score normalization) have zero technical dependency on Sprint 1's outputs. The sole coordination point is that Sprint 2's score normalization should incorporate R4 degree scores if Sprint 1 completes first. Parallel execution saves 3-5 weeks on critical path.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Degree Computation) | Medium | 8-10h |
| Phase 2 (RRF Integration) | Medium | 4-6h |
| Phase 3 (Measurement + Co-activation) | Low-Medium | 4-7h |
| Phase 4 (Agent UX + Signal Vocabulary) | Medium | 10-16h |
| Phase 5 (Dark-Run) | Low | Included |
| Phase 6 (PI-A3 Token Budget) | Low | 4-6h |
| **Total** | | **30-45h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Feature flag `SPECKIT_DEGREE_BOOST` configured — graduated to ON by default
- [ ] Dark-run comparison baseline captured before enabling R4
- [ ] Degree cache invalidation tested

### Rollback Procedure
1. **Immediate**: Set `SPECKIT_DEGREE_BOOST=false` — R4 instantly disabled
2. **Revert code**: `git revert` for degree computation, RRF integration, and search pipeline changes
3. **Verify rollback**: Run 158+ existing tests; confirm 4-channel RRF fusion works as before
4. **Cache cleanup**: Clear degree cache entries (optional — they become unused)

### Data Reversal
- **Has data migrations?** No — R4 reads from existing `causal_edges` table; no schema changes
- **Reversal procedure**: N/A — no data to reverse; disable flag is sufficient
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See ../000-feature-overview/plan.md
- **Predecessor Plan**: See `../006-measurement-foundation/plan.md

---

<!--
LEVEL 2 PLAN — Phase 2 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 1: Graph signal activation via R4 typed-degree 5th channel
- Feature flag gated with dark-run verification
-->

---

## 012-scoring-calibration

Source: 012-scoring-calibration/plan.md`

---
title: "Implementation Plan: Sprint 2 — Scoring Calibration"
description: "Implement embedding cache, cold-start boost, G2 investigation, and score normalization to resolve 15:1 magnitude mismatch."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 2 plan"
  - "scoring calibration plan"
  - "embedding cache plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 2 — Scoring Calibration

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
| **Storage** | SQLite (better-sqlite3), sqlite-vec, FTS5 |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 2 — scoring calibration. Four independent features converge to resolve the scoring pipeline's core deficiencies: (1) R18 embedding cache eliminates unnecessary API costs on re-index; (2) N4 cold-start boost makes newly indexed memories visible via exponential decay; (3) G2 investigation resolves the double intent weighting anomaly; (4) score normalization eliminates the 15:1 RRF-vs-composite magnitude mismatch. G2 outcome influences the normalization approach (Phase 4 depends on Phase 3).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 0 exit gate passed (graph functional, eval infrastructure operational, BM25 baseline recorded) — NOTE: Sprint 1 is NOT a prerequisite; Sprint 2 can run in parallel with Sprint 1
- [ ] R18 cache schema finalized: `CREATE TABLE embedding_cache (content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id))`
- [ ] N4 formula confirmed: `boost = 0.15 * exp(-elapsed_hours / 12)`
- [ ] G2 code location identified in `hybrid-search.ts`

### Definition of Done
- [ ] R18 cache hit >90% on re-index of unchanged content
- [ ] N4 dark-run passes (new memories visible, old not displaced)
- [ ] G2 resolved: fixed or documented as intentional
- [ ] Score distributions normalized to [0,1]
- [ ] 18-26 new tests added and passing
- [ ] 158+ existing tests still passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Four parallel feature tracks with G2 → normalization dependency

### Key Components
- **Embedding cache** (R18): New `embedding_cache` table in primary DB. Schema: `content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id)`. Cache lookup on re-index path; miss = normal embedding generation.
- **Cold-start boost** (N4): Applied in `composite-scoring.ts`. Formula: `boost = 0.15 * exp(-elapsed_hours / 12)`. Feature flag: `SPECKIT_NOVELTY_BOOST`. Applied BEFORE FSRS temporal decay. Cap at 0.95 combined score.
- **G2 investigation**: Locate double intent weighting in `hybrid-search.ts`. Determine if intentional (document) or bug (fix).
- **Score normalization**: Depends on G2 outcome. Normalize both RRF (~[0, 0.07]) and composite (~[0, 1]) to [0, 1] range.

### Data Flow
1. **R18 (index-time)**: Content hash computed → cache lookup → hit: use cached embedding; miss: generate + store
2. **N4 (search-time)**: Memory creation timestamp checked → if <48h: boost applied → composite score adjusted (cap 0.95) → TM-01 interference penalty applied after N4 → FSRS decay applied separately
3. **G2 (search-time)**: Intent weights traced through pipeline → duplicate application identified → fix or document
4. **Normalization (search-time)**: Post-fusion: RRF and composite scores both mapped to [0, 1] before combination
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Embedding Cache (R18)
- [ ] Create `embedding_cache` table with migration (2-3h) — WHY: Eliminates unnecessary embedding API calls on re-index of unchanged content; reduces re-index time from minutes to seconds for unchanged memories.
- [ ] Implement cache lookup + store logic in embedding pipeline (4-6h) — WHY: Cache key is `(content_hash, model_id)` ensuring correctness across model changes; SHA-256 hash collision risk is astronomically low.
- [ ] Add `last_used_at` update for cache eviction support (1-2h) — WHY: Enables future LRU eviction to prevent unbounded cache growth; not immediately required but low-cost to add now.
- [ ] Verify cache hit rate >90% on re-index of unchanged content (1h) — **Risk**: Cache miss on first index is expected; hit rate applies to re-index only.

### Phase 2: Cold-Start Boost (N4)
- [ ] Implement cold-start boost formula in `composite-scoring.ts` (2-3h)
- [ ] Wire behind `SPECKIT_NOVELTY_BOOST` feature flag (0.5-1h)
- [ ] Verify no conflict with FSRS temporal decay (0.5-1h)

### Phase 3: G2 Investigation
- [ ] Trace intent weight application through full pipeline in `hybrid-search.ts` (2-3h)
- [ ] Determine: bug or intentional design (1-2h)
- [ ] If bug: implement fix. If intentional: document rationale (1-2h)
- [ ] Select normalization method — measure RRF/composite score distributions on 100-query sample; compare linear scaling vs. min-max; document selection before Phase 4 (1-2h)

### Phase 4: Score Normalization (depends on Phase 3)
- [ ] Implement normalization for RRF output to [0, 1] (2-3h)
- [ ] Implement normalization for composite output to [0, 1] (1-2h)
- [ ] Dark-run comparison — verify no MRR@5 regression (1h)

### Phase 5: Interference Scoring (TM-01)
- [ ] Add `interference_score` column to `memory_index` via migration (1-2h)
- [ ] Compute interference score at index time — count memories with cosine similarity > 0.75 in same `spec_folder` (2-3h)
- [ ] Apply `-0.08 * interference_score` penalty in `composite-scoring.ts` behind `SPECKIT_INTERFERENCE_SCORE` flag (1-2h)

### Phase 6: Classification-Based Decay (TM-03)
- [ ] Modify `fsrs-scheduler.ts` with decay policy multipliers by `context_type`: decisions=no decay, research=2x stability, implementation/discovery/general=standard (2-3h)
- [ ] Add `importance_tier` multipliers: constitutional/critical=no decay, important=1.5x, normal=standard, temporary=0.5x (1-2h)

### Phase 7: Verification
- [ ] N4 dark-run — new memories visible, old not displaced (included)
- [ ] TM-01 dark-run — interference penalty applied correctly, no false penalties (included)
- [ ] Sprint 2 exit gate verification (included)

### Phase 8: PI-A1 — Folder-Level Relevance Scoring via DocScore Aggregation (4-8h)
- [ ] PI-A1-1: Implement FolderScore computation in reranker — group individual memory scores by `spec_folder`, apply formula `(1/sqrt(M+1)) * SUM(MemoryScore(m))` [2-3h] {Phase 4 — score normalization must produce [0,1] outputs before aggregation is meaningful}
- [ ] PI-A1-2: Expose FolderScore as metadata on search results — annotate each result with the computed folder score for use by two-phase retrieval consumers [1-2h]
- [ ] PI-A1-3: Implement two-phase retrieval path — folder selection (top-K by FolderScore) then within-folder search against selected candidates [2-3h] {PI-A1-1}
- [ ] PI-A1-4: Verify damping factor correctness — confirm large folders do not dominate via volume; test against known unequal folder sizes [included]

**Dependencies**: Phase 4 (score normalization) MUST complete first — FolderScore aggregation requires [0,1]-normalized MemoryScore values to be meaningful. No new tables or channels required.
**Effort**: 4-8h, Low risk
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R18 cache hit/miss paths, content_hash key correctness | Vitest | 2-3 tests |
| Unit | N4 boost formula at 0h, 12h, 24h, 48h, >48h | Vitest | 2-3 tests |
| Unit | N4 + FSRS interaction — no double-penalty | Vitest | 1 test |
| Unit | Score normalization — both systems output [0, 1] | Vitest | 1-2 tests |
| Integration | G2 intent weight trace through full pipeline | Vitest | 1-2 tests |
| Unit | FUT-5 K-value sensitivity — MRR@5 delta per K ∈ {20, 40, 60, 80, 100} | Vitest | 1-2 tests |
| Unit | TM-01 interference score computation — cosine similarity > 0.75 threshold, same spec_folder grouping | Vitest | 1-2 tests |
| Unit | TM-01 penalty application — `-0.08 * interference_score` in composite scoring; flag gating | Vitest | 1-2 tests |
| Integration | TM-01 no false penalties — distinct content in same folder not penalized | Vitest | 1 test |
| Unit | TM-03 context_type decay — decisions=no decay, research=2x stability, standard types | Vitest | 1-2 tests |
| Unit | TM-03 importance_tier decay — constitutional/critical=no decay, important=1.5x, temporary=0.5x | Vitest | 1-2 tests |
| Integration | TM-03 type/tier matrix interaction — combined context_type and importance_tier multiplier correctness | Vitest | 1 test |
| Unit | PI-A1 FolderScore computation — `(1/sqrt(M+1)) * SUM(MemoryScore(m))` correctness | Vitest | 1-2 tests |
| Unit | PI-A1 damping factor — large folders do not dominate by volume | Vitest | 1 test |
| Integration | T010 observability — N4 boost and TM-01 interference score logging at 5% sample rate | Vitest | 1 test |
| Manual | Dark-run comparison for N4, normalization, and TM-01 | Manual | N/A |

**Total**: 18-26 new tests, estimated 400-650 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 0 exit gate | Internal | Pending | Cannot start Sprint 2 — WHY: Eval infrastructure (R13-S1) and baseline metrics are required for dark-run comparisons. Sprint 1 is NOT a dependency — parallel execution possible. |
| R13-S1 eval infrastructure | Internal | Pending (Sprint 0) | Cannot measure dark-run results |
| Embedding API (for cache miss path) | External | Green | Cache miss = normal flow |
| Feature flag system | Internal | Green | Env var based — `SPECKIT_NOVELTY_BOOST` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N4 dark-run fails, score normalization causes MRR@5 regression, TM-01 false penalties on distinct content, or TM-03 decay incorrectly applied to constitutional/critical memories
- **Procedure**:
  1. Disable `SPECKIT_NOVELTY_BOOST` flag (N4 instantly disabled)
  2. Disable `SPECKIT_INTERFERENCE_SCORE` flag (TM-01 instantly disabled)
  3. `DROP TABLE IF EXISTS embedding_cache` (R18 removed)
  4. `ALTER TABLE memory_index DROP COLUMN interference_score` (TM-01 schema reverted)
  5. Revert normalization and G2 changes via `git revert`
  6. Revert TM-03 classification-based decay multipliers in `fsrs-scheduler.ts` via `git revert`
- **Estimated time**: 2-3h
- **Difficulty**: LOW — cache is additive; N4 and TM-01 are flag-gated; TM-03 decay multipliers are isolated in `fsrs-scheduler.ts`; normalization is isolated
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R18 Cache) ──────────────────────────────────────────────┐
Phase 2 (N4 Cold-Start) ──────────────────────────────────────────┤
Phase 3 (G2 Investigation) ──► Phase 4 (Normalization) ──────────►├──► Phase 7 (Verification)
Phase 5 (TM-01 Interference) ────────────────────────────────────►├──► Phase 8 (PI-A1)
Phase 6 (TM-03 Decay) ──────────────────────────────────────────►─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R18 Cache) | Sprint 0 gate | Phase 7 |
| Phase 2 (N4 Cold-Start) | Sprint 0 gate | Phase 7 |
| Phase 3 (G2 Investigation) | Sprint 0 gate | Phase 4 |
| Phase 4 (Normalization) | Phase 3 | Phase 7 |
| Phase 5 (TM-01 Interference Scoring) | Sprint 0 gate | Phase 7 |
| Phase 6 (TM-03 Classification Decay) | Sprint 0 gate | Phase 7 |
| Phase 7 (Verification) | Phase 1, Phase 2, Phase 4, Phase 5, Phase 6 | Sprint 3 (next sprint) |
| Phase 8 (PI-A1 Folder Scoring) | Phase 4 | Sprint 3 (next sprint) |

**Note**: Phases 1, 2, 3, 5, and 6 are independent — they can execute in parallel. Phase 4 depends on Phase 3 (G2 outcome influences normalization approach).

**Cross-Sprint Parallelization**: Sprint 2 depends on Sprint 0 exit gate only — NOT on Sprint 1. Sprint 1 (R4 typed-degree, edge density) and Sprint 2 (R18, N4, G2, normalization) can execute in parallel after Sprint 0 completes. The sole coordination point: if Sprint 1 completes first, Sprint 2's score normalization (Phase 4) should incorporate R4 degree scores — but normalization can proceed without them and be updated retroactively. Parallel execution saves 3-5 weeks on critical path.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (R18 Cache) | Medium | 8-12h |
| Phase 2 (N4 Cold-Start) | Low-Medium | 3-5h |
| Phase 3 (G2 Investigation) | Medium | 4-6h |
| Phase 4 (Normalization) | Medium | 4-6h |
| Phase 5 (TM-01 Interference Scoring) | Medium | 4-6h |
| Phase 6 (TM-03 Classification Decay) | Medium | 3-5h |
| Phase 7 (Verification) | Low | Included |
| Phase 8 (PI-A1 Folder Scoring) | Medium | 4-8h |
| **Total** | | **30-48h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Feature flag `SPECKIT_NOVELTY_BOOST` configured and defaults to disabled
- [ ] Feature flag `SPECKIT_INTERFERENCE_SCORE` configured and defaults to disabled
- [ ] R18 cache table migration tested (create + drop)
- [ ] TM-01 `interference_score` column migration tested (add + drop)
- [ ] Pre-normalization score distributions captured for comparison

### Rollback Procedure
1. **Immediate**: Set `SPECKIT_NOVELTY_BOOST=false` — N4 instantly disabled
2. **Immediate**: Set `SPECKIT_INTERFERENCE_SCORE=false` — TM-01 instantly disabled
3. **Cache removal**: `DROP TABLE IF EXISTS embedding_cache` — no impact on search
4. **TM-01 schema revert**: `ALTER TABLE memory_index DROP COLUMN interference_score` — removes interference data
5. **TM-03 revert**: `git revert` for classification-based decay multiplier changes in `fsrs-scheduler.ts` — restores standard decay for all context_type and importance_tier values
6. **Revert code**: `git revert` for normalization and G2 changes
7. **Verify rollback**: Run 158+ existing tests; verify MRR@5 matches pre-Sprint-2 baseline

### Data Reversal
- **Has data migrations?** Yes — `CREATE TABLE embedding_cache` in primary DB; `ALTER TABLE memory_index ADD COLUMN interference_score` for TM-01
- **Reversal procedure**: `DROP TABLE embedding_cache`; `ALTER TABLE memory_index DROP COLUMN interference_score`. Primary DB data otherwise untouched. TM-03 changes are code-only (no schema changes).
- **Migration protocol**: Backup before `ALTER TABLE`; nullable defaults; atomic execution
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See ../000-feature-overview/plan.md
- **Predecessor Plan**: See `../006-measurement-foundation/plan.md (direct dependency — Sprint 1 is a parallel sibling)

---

<!--
LEVEL 2 PLAN — Phase 3 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 2: Scoring calibration — R18, N4, G2, normalization
- Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->

---

## 013-query-intelligence

Source: 013-query-intelligence/plan.md`

---
title: "Implementation Plan: Sprint 3 — Query Intelligence"
description: "Query complexity routing, RSF evaluation, and channel min-representation implementation plan."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 3 plan"
  - "query intelligence plan"
  - "complexity router plan"
  - "RSF plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 3 — Query Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Storage** | SQLite / FTS5 / sqlite-vec |
| **Testing** | Vitest |
| **Feature Flags** | `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP` |

### Overview

Implement a query complexity router that classifies queries into 3 tiers (simple/moderate/complex) and routes to appropriate channel subsets for latency optimization. Evaluate Relative Score Fusion as an alternative to RRF across all 3 fusion variants with shadow comparison on 100+ queries. Enforce channel min-representation post-fusion to guarantee retrieval diversity.

### Architecture

Query classifier --> tier routing --> channel subset selection --> fusion (RRF or RSF) --> R2 enforcement
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 2 exit gate passed (cache hit >90%, N4 dark-run passes, G2 resolved, scores normalized)
- [ ] R13-S1 eval infrastructure operational with baseline metrics
- [ ] Score normalization from Sprint 2 verified (RRF and composite in [0,1] range)

### Definition of Done
- [ ] All acceptance criteria met (REQ-S3-001 through REQ-S3-005)
- [ ] Tests passing (22-28 new tests)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Off-ramp evaluation documented
- [ ] PI-B3 [P2/Optional]: completed or deferred with documented reason
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline extension — classifier stage prepended to existing pipeline; RSF runs as shadow alongside RRF; R2 appended post-fusion.

### Key Components
- **Query Classifier**: Classifies queries into simple/moderate/complex based on query features (length, term count, trigger phrase presence)
- **Tier Router**: Maps classification to channel subset (simple=2 channels, moderate=3-4, complex=5)
- **RSF Engine**: All 3 fusion variants (single-pair, multi-list, cross-variant) running in shadow mode
- **R2 Enforcer**: Post-fusion min-representation with quality floor 0.2, only for channels that returned results

### Data Flow
1. Query enters classifier --> tier assigned
2. Tier router selects channel subset (min 2 channels)
3. Selected channels execute in parallel
4. RRF fuses results (RSF runs shadow)
5. R2 enforcer checks channel representation in top-k
6. Results returned with classification metadata
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: R15 Query Complexity Router (8-14h)

#### Phase 1a: Classifier Design (2-4h)
- [ ] Design classifier features (query length, term count, trigger presence, semantic complexity)
- [ ] Define classification boundaries (simple: ≤3 terms OR trigger, complex: >8 terms AND no trigger)
- [ ] Implement 3-tier classification logic with config-driven thresholds

#### Phase 1b: Tier Routing + Flag Wiring (3-4h)
- [ ] Implement tier-to-channel-subset mapping (config-driven)
- [ ] Enforce minimum 2 channels for all tiers
- [ ] Add feature flag `SPECKIT_COMPLEXITY_ROUTER`

#### Phase 1c: Pipeline Integration (2-4h)
- [ ] Wire classifier+router into pipeline entry point
- [ ] Enable simultaneous full-pipeline and routed-pipeline execution

#### Phase 1d: Shadow Run + Verification (1-2h)
- [ ] Shadow-run both pipelines, compare results
- [ ] Verify p95 <30ms for simple queries

### Phase 2: R14/N1 Relative Score Fusion (10-14h)

#### Phase 2a: Single-Pair RSF (4-5h)
- [ ] Implement RSF single-pair variant (foundation)
- [ ] Add feature flag `SPECKIT_RSF_FUSION`
- [ ] Verify output clamped to [0,1]

#### Phase 2b: Multi-List RSF (3-5h)
- [ ] Implement RSF multi-list variant
- [ ] Verify consistency with single-pair on 2-list input

#### Phase 2c: Cross-Variant RSF (3-4h)
- [ ] Implement RSF cross-variant variant
- [ ] Shadow mode: RSF runs alongside RRF, results logged but not used

### Phase 3: R2 Channel Min-Representation (6-10h)
- [ ] Implement post-fusion channel representation check
- [ ] Add quality floor (0.2 threshold)
- [ ] Only enforce for channels that returned results
- [ ] Add feature flag `SPECKIT_CHANNEL_MIN_REP`
- [ ] Verify top-3 precision within 5% of baseline

### Phase 4: Shadow Comparison + Verification
- [ ] Run RSF vs RRF shadow comparison on 100+ queries
- [ ] Compute Kendall tau correlation
- [ ] Document RSF decision (tau <0.4 = reject RSF)
- [ ] Run off-ramp evaluation (MRR@5, constitutional, cold-start)
- [ ] Sprint 3 exit gate verification
- [ ] **Evaluate hard scope cap**: Record Sprint 0-3 actual metric values and effort actuals. If off-ramp thresholds met, document STOP decision. If continuing, document with (a) measured deficiencies, (b) updated effort estimates, (c) ROI assessment.

> **HARD SCOPE CAP — Sprint 2+3 Off-Ramp**: Sprints 4-7 require NEW spec approval based on demonstrated need from Sprint 0-3 metrics. Approval must include: (a) evidence remaining work addresses measured deficiencies, (b) updated effort estimates based on Sprint 0-3 actuals, (c) ROI assessment. Default decision after Sprint 3 is STOP unless thresholds are NOT met.

### Pre-Implementation: Eval Corpus Sourcing Strategy

The 100+ queries required for RSF shadow comparison (CHK-030) must be sourced using a stratified approach:

1. **Manual curation** (minimum 20 queries): Draw from Sprint 0 ground truth corpus. Ensure coverage across all 3 complexity tiers (simple/moderate/complex) with ≥5 queries per tier.
2. **Synthetic expansion** (60-80 queries): Generate from trigger phrases and memory content, but explicitly exclude trigger-phrase-based queries from the simple-tier count to avoid inflating easy-case representation.
3. **Tier distribution documentation**: Record the final tier distribution before running the comparison. Flag any tier with <15% representation.

**Known limitation**: Synthetic queries at <500 memories corpus may produce tau scores that reflect generation bias. Acknowledge this limitation in the RSF decision documentation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R15 classification accuracy (10+ queries/tier) | Vitest | 4-6 tests |
| Unit | R15 minimum 2-channel enforcement | Vitest | 1-2 tests |
| Unit | R15 moderate-tier routing (3-4 channels selected) | Vitest | 1 test |
| Unit | R15 classifier fallback to "complex" on failure | Vitest | 1 test |
| Unit | R14/N1 all 3 RSF variants | Vitest | 3-4 tests |
| Unit | R14/N1 RSF numerical stability (output clamped [0,1]) | Vitest | 1 test |
| Unit | R2 empty channels + quality floor | Vitest | 2-3 tests |
| Unit | REQ-S3-004 confidence truncation (gap detection, min 3 results) | Vitest | 2-3 tests |
| Unit | REQ-S3-005 dynamic token budget (tier-based allocation) | Vitest | 2-3 tests |
| Integration | R15+R2 interaction (min 2 channels preserves R2 guarantee) | Vitest | 1 test |
| Integration | Independent flag rollback (each of 3 flags disabled independently) | Vitest | 1-2 tests |
| Integration | RSF shadow comparison (100+ queries) | Vitest + eval infra | 1 test |
| Integration | PI-B3 descriptions.json generation + folder routing [P2] | Vitest | 2-3 tests |

**Total**: 22-28 new tests (600-900 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 2 exit gate | Internal | Yellow | Cannot begin — scoring calibration must be verified |
| Eval infrastructure (R13-S1) | Internal | Green | Required for shadow comparison metrics |
| Feature flag system | Internal | Green | Required for all 3 flags |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R15 misclassification causes >5% recall degradation; RSF diverges significantly from RRF; R2 degrades precision >5%
- **Procedure**: Disable 3 flags together (R15+R2+R14/N1 interact); verify independent rollback behavior
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R15 Router) ──────┐
                            ├──► Phase 3 (R2 Min-Rep) ──► Phase 4 (Shadow + Verify)
Phase 2 (R14/N1 RSF) ──────┘
`

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R15) | Sprint 2 exit gate | Phase 3, Phase 4 |
| Phase 2 (R14/N1) | Sprint 2 exit gate | Phase 4 |
| Phase 3 (R2) | Phase 1 | Phase 4 |
| Phase 4 (Shadow) | Phase 1, Phase 2, Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: R15 Router (T001a-d) | Medium | 8-14h |
| Phase 2: R14/N1 RSF (T002a-c) | Medium | 10-14h |
| Phase 3: R2 Min-Rep (T003a-c) | Low-Medium | 6-10h |
| Phase 3b: Query Optimization (T006, T007) | Low-Medium | 8-13h |
| Phase 4: Shadow + Verify (T004, T005) | Low | included |
| PI-B3: Spec Folder Discovery (T009) [P2] | Low | 4-8h |
| **Total (P1 core)** | | **32-51h** |
| **Total (incl. P2 PI-B3)** | | **36-59h** |

> **Effort reconciliation note**: Parent plan (../000-feature-overview/plan.md) lists Sprint 3 core at 34-53h. This child plan's authoritative task-level sum is 32-51h (P1 core). The difference arises because the parent plan's R15 line (10-16h) includes buffer for classifier iteration, while this child plan's Phase 1 breakdown (8-14h) reflects specific subtask estimates. Phase 3b (T006, T007) was added during child plan decomposition for REQ-S3-004 and REQ-S3-005.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:pageindex-phases -->
## PageIndex Tasks

### PI-A2: Search Strategy Degradation with Fallback Chain [DEFERRED]

> **Deferred from Sprint 3.** Re-evaluate after Sprint 3 using measured frequency of low-result/low-similarity queries. See UT review R1.

- ~~Implement similarity and result-count threshold checks after channel execution (threshold: top result similarity < 0.4 OR result count < 3)~~
- ~~Implement Tier 2 broadened search: relaxed filters, trigger matching, loosened channel constraints~~
- ~~Implement Tier 3 structural search: folder browsing, tier-based listing, no vector requirement~~
- ~~Wire three-tier chain into the R15 routing layer — fallback is automatic and bounded~~
- ~~Preserve R15 minimum-2-channel constraint at all fallback levels~~
- ~~Verify fallback triggers correctly on low-similarity and low-count results~~
- **Effort**: 12-16h | **Risk**: Medium | **Dependency**: Sprint 0 eval framework

### PI-B3: Description-Based Spec Folder Discovery (4-8h) [P2/Optional]
- [ ] Generate 1-sentence description per spec folder from spec.md content
- [ ] Write descriptions to `descriptions.json` cache file (path: project root or spec root)
- [ ] Integrate cache lookup into `memory_context` orchestration layer for folder routing
- [ ] Add cache invalidation / regeneration trigger when `spec.md` changes
- [ ] Verify folder routing uses descriptions before issuing vector queries
- **Effort**: 4-8h | **Risk**: Low
<!-- /ANCHOR:pageindex-phases -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Sprint 2 exit gate verified
- [ ] All 3 feature flags configured and defaulting to OFF
- [ ] Eval infrastructure operational for shadow comparison

### Rollback Procedure
1. Disable all 3 flags: `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, SPECKIT_CHANNEL_MIN_REP
2. Verify full 5-channel pipeline resumes for all queries
3. Verify independent flag rollback (3-5h testing)
4. Check eval metrics for regression confirmation

### Rollback Risk: MEDIUM
- R15+R2+R14/N1 interact — must verify each flag can be independently disabled
- Independent rollback testing estimated at 3-5h

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no schema changes in Sprint 3
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 4 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 3: Query Intelligence
-->

---

## 014-feedback-and-quality

Source: 014-feedback-and-quality/plan.md

---
title: "Implementation Plan: Sprint 4 — Feedback and Quality"
description: "MPAB chunk aggregation, learned relevance feedback, and shadow scoring infrastructure implementation plan."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 4 plan"
  - "feedback and quality plan"
  - "MPAB plan"
  - "R11 plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Sprint 4 — Feedback and Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Storage** | SQLite / FTS5 / sqlite-vec |
| **Testing** | Vitest |
| **Feature Flags** | `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION` |

### Overview

Implement MPAB chunk-to-memory aggregation operating after RRF fusion and before state filtering. Implement learned relevance feedback writing to a separate `learned_triggers` column at lower weight (0.7x) with 7 strict safeguards. Extend eval infrastructure with shadow scoring, channel attribution, and ground truth Phase B for full A/B evaluation.

### Architecture

R1 MPAB operates after RRF fusion, before state filtering. R11 writes to separate column, queried at lower weight (0.7x). R13-S2 extends eval with shadow scoring.

**R1 MPAB corrected**: `computeMPAB(scores)` -- sorted descending, sMax=sorted[0], remaining=sorted.slice(1), bonus=0.3*sum(remaining)/sqrt(N). Pipeline position: after RRF, before state filter. Metadata: preserve `_chunkHits: scores.length`.

**R11 safeguards**: (1) Separate column, (2) 30-day TTL, (3) 100+ stop words denylist, (4) Max 3 terms/selection + 8 per memory, (5) Only when NOT in top 3, (6) 1-week shadow, (7) Exclude <72h memories.

**Checkpoint recommended before this sprint.**

---

> **RECOMMENDED: Sub-Sprint Split (F3)**
>
> Sprint 4 should be split into S4a and S4b to isolate R11's CRITICAL FTS5 contamination risk:
>
> - **S4a** (33-49h): R1 MPAB + R13-S2 enhanced evaluation + TM-04 pre-storage quality gate. No schema changes. Delivers A/B infrastructure and save quality gating before feedback mutations.
> - **S4b** (31-48h): R11 learned feedback + TM-06 reconsolidation. Begins only after S4a metrics confirm no regressions and R13 has completed 2+ full eval cycles.
>
> Rationale: R11 FTS5 contamination is irreversible without full re-index. Isolating it prevents risk concentration and ensures the detection infrastructure (R13-S2 A/B) is operational before mutations begin.

> **F10 — CALENDAR DEPENDENCY (R11 prerequisite)**
>
> R11 prerequisite: R13 must have completed ≥2 full eval cycles. Each cycle = minimum 100 queries evaluated AND 14+ calendar days (both conditions must be met). Two cycles = **minimum 28 calendar days** of wall-clock time. This forced idle time between Sprint 3 completion and R11 enablement is NOT reflected in effort hours. Plan the project timeline explicitly to include this idle window between S4a completion and S4b start.

> **F10 Idle Window Activities (28-day S4a→S4b transition)**
>
> The 28-day mandatory window between S4a completion and S4b start is structured work, not idle time:
>
> 1. **Monitor R13-S2 A/B dashboards** — verify shadow scoring infrastructure is collecting valid comparison data
> 2. **Collect and review R1 shadow log data** — confirm MPAB aggregation impact on MRR@5, identify any edge cases
> 3. **Validate MPAB coefficient** — compare the 0.3 bonus coefficient against observed MRR@5 measurements; revise if delta >5%
> 4. **Derive R11 query weight** — use channel attribution data from R13-S2 to determine if 0.7x is appropriate for learned_triggers; adjust based on empirical signal-to-noise ratio
> 5. **14-day mid-window checkpoint** (see CHK-076a) — verify eval infrastructure is collecting valid data after one complete cycle
> 6. **Produce S4b readiness report** — document coefficient validation results, parameter decisions, and any scope adjustments before S4b begins
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Sprint 3 exit gate, R13 2+ eval cycles)
- [ ] Checkpoint created before sprint start

### Definition of Done
- [ ] All acceptance criteria met (REQ-S4-001 through REQ-S4-005)
- [ ] Tests passing (22-32 new tests)
- [ ] Docs updated (spec/plan/tasks)
- [ ] FTS5 contamination test passing
- [ ] Schema migration verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline extension + schema migration — R1 appends aggregation stage, R11 adds learned feedback column, R13-S2 extends eval infrastructure.

### Key Components
- **MPAB Aggregator**: Computes chunk-to-memory score using `sMax + 0.3 * sum(remaining) / sqrt(N)` with N=0 and N=1 guards
- **Learned Feedback Engine**: Writes to `learned_triggers` column with 7-layer safeguard stack
- **Shadow Scoring Engine**: Runs parallel scoring paths for A/B comparison without affecting production results
- **Channel Attribution**: Tags each result with source channel for eval analysis

### Data Flow
1. Chunks scored individually by pipeline
2. R1 MPAB aggregates chunk scores per memory (after RRF, before state filter)
3. R11 observes user selections, writes learned triggers (after 1-week shadow)
4. R13-S2 logs shadow scores + channel attribution for A/B analysis
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: R1 MPAB Chunk Aggregation (8-12h)
- [ ] Implement `computeMPAB(scores)` function with sorted descending logic
- [ ] Add N=0 guard (return 0) and N=1 guard (return score, no bonus)
- [ ] Implement index-based max removal (not value-based, handles ties)
- [ ] Preserve `_chunkHits: scores.length` metadata
- [ ] Add feature flag `SPECKIT_DOCSCORE_AGGREGATION`
- [ ] Position in pipeline: after RRF fusion, before state filtering
- [ ] Verify MRR@5 within 2% and N=1 no regression

### Phase 2: R11 Learned Relevance Feedback (16-24h)
- [ ] Schema migration: `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'`
- [ ] Implement safeguard 1: Separate column (NOT in FTS5 index)
- [ ] Implement safeguard 2: 30-day TTL on learned terms
- [ ] Implement safeguard 3: 100+ stop words denylist
- [ ] Implement safeguard 4: Max 3 terms/selection + 8 per memory cap
- [ ] Implement safeguard 5: Only when memory NOT in top 3 results
- [ ] Implement safeguard 6: 1-week shadow period (log but don't apply)
- [ ] Implement safeguard 7: Exclude memories <72h old
- [ ] Add feature flag `SPECKIT_LEARN_FROM_SELECTION`
- [ ] Query learned_triggers at 0.7x weight

### Phase 3: R13-S2 Shadow Scoring + Ground Truth Phase B (15-20h)
- [ ] Implement shadow scoring infrastructure
- [ ] Add channel attribution to results
- [ ] Implement ground truth Phase B (expanded annotations)
- [ ] Full A/B comparison infrastructure

### Phase 4: TM-04 Pre-Storage Quality Gate (6-10h)
- [ ] Implement Layer 1 structural validation (existing checks, formalised)
- [ ] Implement Layer 2 content quality scoring — evaluate title, triggers, length, anchors, metadata, signal density; reject if signal density < 0.4
- [ ] Implement Layer 3 semantic dedup — compute cosine similarity against existing memories; reject if >0.92 similarity found
- [ ] Wire all 3 layers behind `SPECKIT_SAVE_QUALITY_GATE` feature flag
- [ ] Implement warn-only mode (MR12 mitigation): for the first 2 weeks after activation, log quality scores and would-reject decisions but do NOT block saves; tune thresholds based on observed false-rejection rate before enabling enforcement

### Phase 5: TM-06 Reconsolidation-on-Save (6-10h)
- [ ] Create checkpoint: `memory_checkpoint_create("pre-reconsolidation")` before enabling
- [ ] After embedding generation, query top-3 most similar memories in `spec_folder`
- [ ] Implement merge path (similarity >=0.88): merge content, increment frequency counter
- [ ] Implement conflict path (0.75–0.88): replace memory, add causal supersedes edge
- [ ] Implement complement path (<0.75): store new memory unchanged
- [ ] Wire behind `SPECKIT_RECONSOLIDATION` feature flag

### Phase 6: Verification
- [ ] Verify R1 dark-run (MRR@5 within 2%, N=1 no regression)
- [ ] Analyze R11 shadow log (noise rate <5%)
- [ ] Verify FTS5 contamination test
- [ ] Verify TM-04 quality gate rejects low-quality saves and near-duplicates (>0.92)
- [ ] Verify TM-06 reconsolidation — merge/replace/store paths behave correctly
- [ ] Sprint 4 exit gate verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R1 MPAB: N=0, N=1, N=2, N=10, metadata preservation | Vitest | 4-5 tests |
| Unit | R11: column isolation, TTL, denylist, cap, eligibility, shadow | Vitest | 5-7 tests |
| Unit | R11 auto-promotion: 5 validations → normal→important, 10 → important→critical, below-threshold no-op | Vitest | 2-3 tests |
| Unit | A4 negative feedback: wasUseful=false reduces score via confidence multiplier, floor at 0.3, gradual decay | Vitest | 2-3 tests |
| Unit | B2 chunk ordering: collapsed multi-chunk results maintain document position order, not score order | Vitest | 1-2 tests |
| Unit | TM-04 quality gate: L1 structural pass/fail, L2 signal density <0.4 reject, L3 cosine >0.92 reject, flag-off no-op | Vitest | 4-6 tests |
| Unit | TM-06 reconsolidation: merge (>=0.88), conflict (0.75-0.88), complement (<0.75), checkpoint created, flag-off no-op | Vitest | 4-5 tests |
| Integration | R11 FTS5 contamination test | Vitest | 1 test |
| Integration | R13-S2 shadow scoring + attribution + exclusive contribution rate | Vitest | 2-3 tests |
| Integration | TM-04/TM-06 threshold interaction: [0.88, 0.92] passes TM-04 then triggers TM-06 merge (save-then-merge) | Vitest | 1-2 tests |

**Total**: 22-32 new tests (800-1100 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 3 exit gate | Internal | Yellow | Cannot begin — query intelligence must be verified |
| R13 2+ eval cycles | Internal | Yellow | Blocks R11 mutations (P0 prerequisite) |
| SQLite 3.35.0+ | External | Green | Required for `DROP COLUMN` rollback |
| Checkpoint infrastructure | Internal | Green | Recommended before sprint start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R1 MRR@5 regression >2%; R11 noise >5%; FTS5 contamination detected; schema migration failure
- **Procedure**: Disable flags, clear `learned_triggers` column, restore from checkpoint if needed
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (R1 MPAB) ──────────────────┐
                                      │
Phase 2 (R11 Learned Feedback) ──────┤
                                      │
Phase 3 (R13-S2 Shadow Scoring) ─────┼──► Phase 6 (Verify)
                                      │
Phase 4 (TM-04 Quality Gate) ────────┤
                                      │
Phase 5 (TM-06 Reconsolidation) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (R1) | Sprint 3 exit gate | Phase 6 |
| Phase 2 (R11) | Sprint 3 exit gate, R13 2+ eval cycles | Phase 6 |
| Phase 3 (R13-S2) | Sprint 3 exit gate | Phase 6 |
| Phase 4 (TM-04 Quality Gate) | Sprint 3 exit gate | Phase 6 |
| Phase 5 (TM-06 Reconsolidation) | Sprint 3 exit gate, Checkpoint | Phase 6 |
| Phase 6 (Verify) | Phase 1, Phase 2, Phase 3, Phase 4, Phase 5 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: R1 MPAB (incl. T001a chunk ordering) | Medium | 10-16h |
| Phase 2: R11 Learned Feedback (incl. T002a auto-promotion, T002b negative feedback) | High | 25-38h |
| Phase 3: R13-S2 Shadow Scoring (incl. T003a exclusive contribution rate) | Medium-High | 17-23h |
| Phase 4: TM-04 Pre-Storage Quality Gate | Medium | 6-10h |
| Phase 5: TM-06 Reconsolidation-on-Save | Medium | 6-10h |
| Phase 6: Verification | Low | included |
| **Total** | | **64-97h** |

> PI-A4 (Constitutional Memory as Expert Knowledge Injection, 8-12h) deferred to Sprint 5 — see REC-07 in ultra-think review.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:pageindex-phases -->
## PageIndex Tasks

> **PI-A4 deferred to Sprint 5** — Constitutional Memory as Expert Knowledge Injection (8-12h) has no Sprint 4 dependency and is retrieval-pipeline work that fits Sprint 5's theme (pipeline refactor + query expansion). See Sprint 5 spec ../015-pipeline-refactor/spec.md for updated placement. Rationale: ultra-think review REC-07.
<!-- /ANCHOR:pageindex-phases -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created before sprint start
- [ ] R13 2+ eval cycles verified (P0 gate)
- [ ] Feature flags configured and defaulting to OFF
- [ ] Schema backup taken

### Rollback Procedure
1. Disable flags: `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION`
2. Clear `learned_triggers` column: `UPDATE memory_index SET learned_triggers = '[]'`
3. R1 is independently rollbackable — flag controls aggregation
4. Verify metrics return to pre-sprint values
5. If schema rollback needed: `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+)

### Rollback Risk: MEDIUM-HIGH
- R11 schema change requires SQLite 3.35.0+ for `DROP COLUMN`
- R1 independent rollback (flag only) estimated at 1-2h
- Full rollback including schema revert estimated at 4-6h

### Data Reversal
- **Has data migrations?** Yes — `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'`
- **Reversal procedure**: `ALTER TABLE memory_index DROP COLUMN learned_triggers` (SQLite 3.35.0+) or restore from checkpoint

### Combined S4b Failure Recovery (R11 + TM-06)

If both R11 and TM-06 have been active and a regression is detected:

1. **Disable both flags immediately**: `SPECKIT_LEARN_FROM_SELECTION=false`, `SPECKIT_RECONSOLIDATION=false`
2. **Identify R11-touched memories**: Query `SELECT id FROM memory_index WHERE learned_triggers != '[]'` — these memories have R11 mutations
3. **Identify TM-06-touched memories**: Query causal edges with `relation='supersedes'` created after TM-06 enable date; check frequency counter deltas against checkpoint baseline
4. **Assess overlap**: If overlap exists (memory both R11-written and TM-06-merged), restore from `pre-sprint-4b checkpoint — partial rollback is unsafe
5. **If no overlap**: Roll back independently per existing single-system procedures
6. **Verify**: Run full test suite + R13 eval metrics against pre-S4b baseline

**Combined rollback time estimate**: 6-8h (vs 4-6h for single-system rollback). The additional time accounts for overlap assessment and potential checkpoint restore.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 5 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 4: Feedback and Quality
-->

---

## 015-pipeline-refactor

Source: 015-pipeline-refactor/plan.md`

---
title: "Implementation Plan: Sprint 5 — Pipeline Refactor"
description: "4-stage pipeline refactor, spec folder pre-filter, query expansion, and spec-kit retrieval metadata implementation plan."
trigger_phrases:
  - "sprint 5 plan"
  - "pipeline refactor plan"
  - "R6 plan"
  - "4-stage pipeline plan"
importance_tier: "normal"
contextType: "implementation" # SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
---
# Implementation Plan: Sprint 5 — Pipeline Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Storage** | SQLite / FTS5 / sqlite-vec |
| **Testing** | Vitest |
| **Feature Flags** | `SPECKIT_PIPELINE_V2`, `SPECKIT_EMBEDDING_EXPANSION` |

### Overview

Refactor the retrieval pipeline into a clean 4-stage architecture: Stage 1 (Candidate Generation), Stage 2 (Fusion + Signal Integration), Stage 3 (Rerank + Aggregate), Stage 4 (Filter + Annotate — NO SCORE CHANGES). After the pipeline refactor passes its 0-ordering-difference gate, implement spec folder pre-filter (R9), query expansion with R15 mutual exclusion (R12), template anchor optimization (S2), and validation signals as retrieval metadata (S3).

### R6 Stage Architecture

| Stage | Name | Operations |
|-------|------|------------|
| 1 | Candidate Gen | 5 channels execute (FTS5, semantic, trigger, graph, co-activation) |
| 2 | Fusion + Signal Integration | RRF/RSF, causal boost, co-activation, composite, intent weights (ONCE) |
| 3 | Rerank + Aggregate | Cross-encoder rerank, MMR diversity, MPAB chunk aggregation |
| 4 | Filter + Annotate | State filter, evidence-gap + feature/state metadata attribution; session dedup and constitutional injection run post-cache in handler — **NO SCORE CHANGES** |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Sprint 4 exit gate)
- [ ] Checkpoint created before R6 work

### Definition of Done
- [ ] All acceptance criteria met (REQ-S5-001 through REQ-S5-006)
- [ ] Tests passing (30-40 new tests + all 158+ existing)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Stage 4 invariant verified
- [ ] 0 ordering differences on full eval corpus
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline architecture — replace ad-hoc scoring/filtering with explicit 4-stage pipeline with stage interfaces and invariants.

### Key Components
- **Stage 1: Candidate Generator**: Executes 5 channels in parallel, collects raw results
- **Stage 2: Fusion Engine**: Single point for all scoring signals — RRF/RSF, causal boost, co-activation, composite, intent weights (applied ONCE here only)
- **Stage 3: Reranker + Aggregator**: Cross-encoder rerank, MMR diversity enforcement, MPAB chunk-to-memory aggregation
- **Stage 4: Filter + Annotator**: State filtering, evidence-gap detection, feature/state metadata attribution — NO score modifications (invariant). Session dedup and constitutional injection remain post-cache in handler runtime boundary.

### Data Flow
1. Query enters Stage 1 --> 5 channels generate candidates
2. Stage 2 fuses results with all scoring signals (single application point)
3. Stage 3 reranks and aggregates (cross-encoder, MMR, MPAB)
4. Stage 4 filters and annotates (no score changes) --> final results
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: R6 Pipeline Refactor (40-55h)

> **F9 — REQUIRED DECOMPOSITION**: R6 (40-55h) is the single largest work item in the entire 8-sprint plan. Treat it as 5-8 sequential subtasks rather than one monolithic task to enable incremental dark-run verification and reduce integration risk. See tasks.md T002a-T002h for subtask breakdown.
>
> **Flag interaction risk**: By Sprint 5, 10+ feature flags have accumulated across Sprints 0-4. T002g (feature flag interaction testing) must verify all flags remain functional under PIPELINE_V2 before Phase B begins.

- [ ] Create checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")`
- [ ] (a) Design stage interfaces (input/output types for each stage) — WHY: Enforces Stage 4 immutability at the type level before any code migration begins
- [ ] (b) Implement Stage 1: Candidate Generation (5-channel parallel execution) — WHY: Establishes the clean entry boundary; channels must not communicate until Stage 2
- [ ] (c) Implement Stage 2: Fusion + Signal Integration (single scoring point) — WHY: Consolidating all scoring here prevents G2 recurrence; intent weights applied exactly once
- [ ] (d) Implement Stage 3: Rerank + Aggregate (cross-encoder, MMR, MPAB) — WHY: MPAB must remain post-RRF (Sprint 4 pipeline position constraint)
- [ ] (e) Implement Stage 4: Filter + Annotate (NO score changes — invariant) — WHY: Invariant guard catches any future Stage 4 score-modification attempts as build/runtime errors
- [ ] (f) Add feature flag `SPECKIT_PIPELINE_V2` (old pipeline active when OFF — backward compatible)
- [ ] (g) Verify feature flag interactions: all 10+ accumulated flags work under PIPELINE_V2
- [ ] (h) Verify 0 ordering differences on full eval corpus (GATE — Phase B blocked until this passes)
- [ ] Verify all 158+ existing tests pass
- [ ] Verify intent weights applied ONCE in Stage 2

- [ ] Record p95 simple query latency baseline on eval corpus (R12 prerequisite — UT-7 R3) [1-2h]

### Phase B: Search + Spec-Kit (28-41h) — after Phase A passes
- [ ] R9: Implement spec folder pre-filter [5-8h]
- [ ] R12: Implement query expansion with R15 mutual exclusion, behind `SPECKIT_EMBEDDING_EXPANSION` flag [10-15h]
- [ ] S2: Implement template anchor optimization [5-8h]
- [ ] S3: Implement validation signals as retrieval metadata [4-6h]
- [ ] TM-05: Add memory auto-surface hooks at tool dispatch and session compaction lifecycle points in `hooks/memory-surface.ts` — per-point token budget of 4000 max; config/logic change in Spec-Kit integration layer [4-6h]

### Phase C: Verification
- [ ] Verify R9 cross-folder identical results
- [ ] Verify R12+R15 mutual exclusion (R12 suppressed when R15="simple")
- [ ] Verify R12 no simple query latency degradation
- [ ] Sprint 5 exit gate verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Regression | R6 full corpus ordering comparison | Vitest + eval infra | 1-2 tests |
| Unit | R6 stage boundaries and interfaces | Vitest | 4-6 tests |
| Unit | R6 Stage 4 invariant (score immutability) | Vitest | 2-3 tests |
| Unit | R9 pre-filter behavior | Vitest | 2-3 tests |
| Unit | R12 expansion + R15 suppression | Vitest | 2-3 tests |
| Unit | S2 anchor metadata, S3 validation metadata | Vitest | 2-3 tests |
| Unit | TM-05 dual-scope injection (tool dispatch hook, compaction hook, token budget enforcement, no regression) | Vitest | 2-4 tests |
| Unit | PI-B1 tree thinning (merge thresholds, memory thresholds, content preservation, pre-pipeline boundary, R9 interaction) | Vitest | 3-5 tests |
| Unit | PI-B2 progressive validation (detect level, auto-fix with diff logging, suggest level, report level, dry-run mode, exit code compat, no caller regression) | Vitest | 5-8 tests |

**Total**: 30-40 new tests (1000-1500 LOC)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 4 exit gate | Internal | Yellow | Cannot begin — feedback loop must be verified |
| Checkpoint infrastructure | Internal | Green | Required before R6 work begins |
| R15 (Sprint 3) | Internal | Green | R12 depends on R15 classification for mutual exclusion |
| Eval infrastructure (R13) | Internal | Green | Required for ordering comparison |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Ordering regressions in R6 dark-run; Stage 4 invariant violations; test failures
- **Procedure**: Restore from checkpoint; revert R6; re-run tests. Phase B items are incremental and independently revertible.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (R6 Pipeline) ──[0 ordering diff GATE]──► Phase B (R9, R12, S2, S3) ──► Phase C (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase A (R6) | Sprint 4 exit gate, checkpoint | Phase B, Phase C |
| Phase B (R9, R12, S2, S3) | Phase A passes 0-diff gate | Phase C |
| Phase C (Verify) | Phase A, Phase B | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase A: R6 Pipeline Refactor | High | 40-55h |
| Phase B: R9 Pre-filter | Low-Medium | 5-8h |
| Phase B: R12 Query Expansion | Medium | 10-15h |
| Phase B: S2 Template Anchors | Low-Medium | 5-8h |
| Phase B: S3 Validation Metadata | Low | 4-6h |
| Phase B: TM-05 Auto-Surface Hooks | Low-Medium | 4-6h |
| Phase C: Verification | Low | included |
| **Subtotal (Core)** | | **68-98h** |
| PI-B1: Tree Thinning | Low | 10-14h |
| PI-B2: Progressive Validation | Medium | 16-24h |
| **Grand Total (incl. PageIndex)** | | **94-136h** |

> **Phase B parallelism note**: Phase B tasks (R9, R12, S2, S3, TM-05) are marked `[P]` (parallelizable) in tasks.md. The 28-43h effort estimate is sequential; wall-clock time may be significantly less if tasks are executed in parallel.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:pageindex-phases -->
## PageIndex Tasks

### PI-B1: Tree Thinning for Spec Folder Consolidation (10-14h)
- [ ] Implement bottom-up merge logic in `generate-context.js` for files under 200 tokens (merge summary into parent)
- [ ] Implement summary-as-content path for files under 500 tokens (no separate summary pass)
- [ ] Apply memory-specific thresholds: 300 tokens for thinning trigger, 100 tokens where text is the summary
- [ ] Wire thinning into spec folder context loading step (before Stage 1 candidate generation)
- [ ] Verify token reduction for spec folders with many small files — no content loss
- [ ] Verify Stage 4 invariant unaffected (thinning is pre-pipeline)
- [ ] Verify R9 spec folder pre-filter interaction — thinning does not alter folder identity
- **Effort**: 10-14h | **Risk**: Low

### PI-B2: Progressive Validation for Spec Documents (16-24h)
- [ ] Implement Detect level: identify all violations (preserves existing validate.sh behavior)
- [ ] Implement Auto-fix level: missing dates, heading level normalization, whitespace normalization — each fix logged with before/after diff
- [ ] Implement Suggest level: non-automatable issues presented with guided fix options
- [ ] Implement Report level: structured output with before/after diffs; exit 0/1/2 compatible with existing usage
- [ ] Add dry-run mode: show what would be auto-fixed without applying changes
- [ ] Verify auto-fix log captures all before/after diffs (primary mitigation for silent corruption)
- [ ] Verify exit code compatibility: exit 0 = pass, exit 1 = warnings, exit 2 = errors
- **Effort**: 16-24h | **Risk**: Medium | **Mitigation**: Mandatory before/after diff logging for all auto-fixes
<!-- /ANCHOR:pageindex-phases -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created: `pre-pipeline-refactor`
- [ ] Feature flags configured and defaulting to OFF
- [ ] Full eval corpus available for regression comparison
- [ ] All 158+ existing tests green before starting

### Rollback Procedure
1. Disable `SPECKIT_PIPELINE_V2` and `SPECKIT_EMBEDDING_EXPANSION` flags
2. Restore from `pre-pipeline-refactor checkpoint if needed
3. Re-run full test suite to verify restoration
4. Phase B items (R9, R12, S2, S3) revert independently — no checkpoint needed

### Rollback Risk: HIGH
- R6 is a major refactor — full checkpoint restore may be needed (8-12h)
- Phase B items are incremental and independently revertible (1-2h each)

### R6 Off-Ramp
If ordering regressions cannot be resolved, retain current pipeline and implement R9, R12, S2, S3 as incremental patches to the existing code. This avoids the architectural invariant but preserves the retrieval improvements.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no schema changes in Sprint 5
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN — Phase 6 of 8
- Core + L2 addendums (Phase deps, Effort, Enhanced rollback)
- Sprint 5: Pipeline Refactor
-->

---

## 016-indexing-and-graph

Source: 016-indexing-and-graph/plan.md`

---
title: "Implementation Plan: Sprint 6 — Indexing and Graph"
description: "Graph centrality, community detection, N3-lite consolidation, anchor-aware thinning, encoding-intent capture, auto entity extraction, and spec folder hierarchy."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify | v2.2"
trigger_phrases:
  - "sprint 6 plan"
  - "indexing and graph plan"
  - "consolidation plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Sprint 6 — Indexing and Graph

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

This plan implements Sprint 6 — graph deepening and indexing optimization, **split into two sequential sub-sprints** following UT-8 review:

- **Sprint 6a — Practical Improvements (33-51h, LOW risk)**: R7 (anchor-aware thinning), R16 (encoding-intent), S4 (hierarchy), T001d (weight_history), N3-lite (consolidation). Delivers value at any graph scale — no graph-density dependency.
- **Sprint 6b — Graph Sophistication (37-53h heuristic, GATED)**: N2 (centrality/community detection), R10 (auto entity extraction). Entry gated on feasibility spike completion and graph density evidence.

Sprint 7 depends on Sprint 6a (not full Sprint 6). Sprint 6b executes only if the feasibility spike demonstrates sufficient graph density for centrality algorithms to add value.

> **ESTIMATION WARNING — SPRINT TOTAL**: Sprint 6a (33-51h) assumes lightweight heuristic implementations for N3-lite. Sprint 6b (37-53h heuristic, 80-150h production) is gated on feasibility spike. If production-quality ML-adjacent implementations are required for N2c and R10, the Sprint 6b range expands significantly. Confirm quality requirements before Sprint 6b entry.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
**Sprint 6a:**
- [ ] Sprint 5 pipeline refactor complete and exit gate passed
- [ ] Evaluation infrastructure operational (from Sprint 0)
- [ ] Checkpoint created before sprint start

**Sprint 6b (additional gates — do NOT block Sprint 6a):**
- [ ] Edge density measured (determines R10 gating)
- [ ] Algorithm feasibility spike completed (see note below)

> **REQUIRED PREREQUISITE FOR SPRINT 6b — Algorithm Feasibility Spike (8-16h)**: Conduct during Sprint 4-5 to validate N2c and R10 approaches on actual data before committing to Sprint 6b. This spike MUST determine: (a) whether Louvain is appropriate at current graph density, or whether connected components suffices; (b) whether rule-based entity extraction meets the <20% FP threshold on a representative sample. **Sprint 6b cannot begin without this spike completed.** Sprint 6a may proceed independently — it has no dependency on the feasibility spike.

### Definition of Done
- [ ] Sprint 6 exit gate passed — all requirements verified
- [ ] 14-22 new tests added and passing
- [ ] All existing tests still passing
- [ ] Active feature flag count <=6
- [ ] All health dashboard targets checked
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two sequential sub-sprints: Sprint 6a (practical, no graph-scale dependency) → Sprint 6b (graph sophistication, gated on feasibility spike)

### Key Components
- **Consolidation module** (Sprint 6a): N3-lite — weekly contradiction scan (~40 LOC), Hebbian edge strengthening (~20 LOC), staleness detection (~15 LOC)
- **Weight audit** (Sprint 6a): T001d weight_history logging for Hebbian rollback
- **Indexing pipeline** (Sprint 6a): R7 anchor-aware chunk thinning, R16 encoding-intent metadata capture
- **Spec-kit retrieval** (Sprint 6a): S4 spec folder hierarchy traversal for structured retrieval
- **Graph analysis module** (Sprint 6b, GATED): Centrality algorithms (degree-based), community detection, channel attribution scoring
- **Entity extraction module** (Sprint 6b, GATED): R10 auto entity extraction with density gating and `created_by='auto'` tagging

### Data Flow
1. **Sprint 6a**: T001d weight_history → N3-lite consolidation (weekly batch) | R7 anchor-aware thinning → R16 intent capture → S4 hierarchy traversal
2. **Sprint 6b (GATED)**: N2 centrality/community → graph scoring enhancement | R10 entity extraction (if density gating met)
3. **Exit**: Sprint 6a exit gate → Sprint 7 unblocked; Sprint 6b exit gate → optional additional graph value

### N3-lite Implementation Details
1. **Contradiction scan** (weekly): Find memory pairs with similarity >0.85, check for conflicting conclusions (~40 LOC)
   > **ESTIMATION WARNING**: ~40 LOC assumes heuristic approach (cosine similarity + keyword conflict check). Semantic accuracy >80% requires NLI model integration — effort 3-5x higher.
2. **Hebbian strengthening**: +0.05 per validation cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1 (~20 LOC)
3. **Staleness detection** (weekly): Flag edges unfetched for 90+ days (~15 LOC)
4. **Edge growth bounds**: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5, all auto-edges track `created_by`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sprint 6a: Practical Improvements (R7, R16, S4, T001d, N3-lite) — 33-51h

- [ ] T001d: weight_history audit tracking — log weight changes for N3-lite Hebbian modifications (2-3h)
  - Dependency justification: REQUIRED before any N3-lite Hebbian cycle runs. Enables rollback independent of edge creation.
- [ ] R7: Implement anchor-aware chunk thinning (10-15h)
  - Dependency justification: requires indexing pipeline from Sprint 5 refactor; thinning logic reads anchor metadata added in earlier sprints.
- [ ] R16: Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag (5-8h)
  - Dependency justification: extends index-time metadata; no blocking prerequisites beyond Sprint 5.
- [ ] S4: Implement spec folder hierarchy as retrieval structure (6-10h)
  - Dependency justification: requires spec folder metadata available from Sprint 0 indexing.
- [ ] N3-lite: Implement contradiction scan + Hebbian strengthening + staleness detection with edge caps (10-15h) {T001d}
  - N3-lite decomposed into T002a-T002e (see tasks.md) — each independently testable/deferrable.

### Sprint 6b: Graph Sophistication (N2, R10) — 37-53h heuristic (GATED)

> **Sprint 6b Entry Gates (ALL REQUIRED):**
> 1. Feasibility spike completed (8-16h)
> 2. OQ-S6-001 resolved (edge density documented)
> 3. OQ-S6-002 resolved (RESOLVED — T001a Graph Momentum/temporal degree delta + T001b causal depth signal selected as Sprint 6 baseline; Katz/PageRank/betweenness/eigenvector deferred pending Sprint 6b feasibility spike evidence; see spec.md OQ-S6-002)
> 4. REQ-S6-004 revisited (10% mandate removed or density-conditioned if graph is thin)

> **ESTIMATION WARNING — N2c**: Louvain/label propagation community detection on SQLite is research-grade. N2c listed at 12-15h; production quality requires 40-80h. Recommend evaluating connected-components heuristic first.
> **ESTIMATION WARNING — R10**: Entity extraction at <20% FP rate is an ML challenge. 12-18h assumes rule-based heuristics; ML-based accuracy requires 30-50h.

- [ ] N2 items 4-6: Implement graph centrality + community detection (25-35h)
  - N2a (Graph Momentum): temporal degree delta over 7-day window. Reference: sliding window degree tracking, no external library needed.
  - N2b (Causal Depth Signal): BFS/DFS max-depth traversal normalized by graph diameter. Reference: standard graph traversal.
  - N2c (Community Detection): start with connected components (BFS, ~20 LOC); only escalate to Louvain if connected-components provides insufficient separation. Louvain reference: `igraph` Python binding or `communities` npm package if available; expect SQLite adjacency-list export as input.
- [ ] R10: Implement auto entity extraction behind `SPECKIT_AUTO_ENTITIES` flag — gated on density <1.0 (12-18h)
  - Dependency justification: density gate requires Sprint 1 graph signal to be measured. Approach: rule-based noun-phrase extraction first (spaCy or `compromise` npm package); escalate to ML only if FP >20%.

### R10 Gating
- Only implement if Sprint 1 exit showed edge density <1.0 edges/node
- If density >=1.0, skip R10 and document decision

### Sprint Sequencing
- Sprint 6a and Sprint 6b are **sequential** — Sprint 6b cannot start until Sprint 6a exit gate passes AND Sprint 6b entry gates are satisfied
- Sprint 7 depends on Sprint 6a exit gate (not Sprint 6b)
- Sprint 6b may be deferred entirely if feasibility spike shows insufficient graph density
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | T001d weight_history logging — verify before/after values, timestamps, and edge IDs recorded on weight change | Vitest | 1 test |
| Unit | T001d weight_history rollback — verify weights can be restored from history entries | Vitest | 1 test |
| Unit | R7 recall verification, anchor-aware thinning logic | Vitest | 2-3 tests |
| Unit | R10 entity extraction, FP rate, density gating | Vitest | 2-3 tests |
| Unit | N2 centrality computation, community detection | Vitest | 2-3 tests |
| Unit | N3-lite contradiction scan, Hebbian bounds/caps, staleness, 30-day decay verification | Vitest | 4-5 tests |
| Unit | S4 hierarchy traversal | Vitest | 1-2 tests |
| Integration | N2 attribution in end-to-end retrieval | Vitest | 1-2 tests |
| Integration | R7 + R16 combined indexing pipeline | Vitest | 1-2 tests |

**Total**: 14-22 new tests, estimated 400-550 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 5 pipeline refactor | Internal | Green (assumed) | Blocks all Sprint 6 work |
| Evaluation infrastructure (Sprint 0) | Internal | Green (assumed) | Cannot verify metrics |
| Edge density measurement (Sprint 1) | Internal | Green (assumed) | Cannot determine R10 gating |
| better-sqlite3 | Internal | Green | Required for graph operations |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N3-lite edge mutations cause data corruption, R10 FP rate exceeds threshold, or flag count exceeds 6
- **Procedure**: Disable feature flags (`SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`), selectively remove auto-created edges via `created_by='auto'` tag, restore from pre-sprint checkpoint
- **Estimated time**: 12-20h (HIGH rollback difficulty due to edge mutations)
- **Difficulty**: HIGH — edge deletions from N3-lite are destructive; R10 auto-entities tagged with `created_by='auto'` for selective removal
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Sprint 6a (Practical) ──────────────────────────┐
  T001d weight_history (2-3h)                   │
  R7 (10-15h) ─┐                               │
  R16 (5-8h) ──┤── parallelizable              ├──► Sprint 6a Exit Gate ──► Sprint 7
  S4 (6-10h) ──┘                               │
  N3-lite (10-15h) {T001d}                      │
                                                 │
Sprint 6b (Graph, GATED) ──────────────────────  │
  [GATE: feasibility spike + OQ-S6-001/002]     │
  N2 centrality/community (25-35h)              ├──► Sprint 6b Exit Gate
  R10 entity extraction (12-18h)                │
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Sprint 6a | Sprint 5 exit gate | Sprint 6a exit gate |
| Sprint 6a Exit Gate | All Sprint 6a tasks | Sprint 7, Sprint 6b entry |
| Sprint 6b | Sprint 6a exit gate + feasibility spike + OQ-S6-001/002 resolved | Sprint 6b exit gate |
| Sprint 6b Exit Gate | All Sprint 6b tasks | None (optional additional value) |

**Note**: Sprint 6a and Sprint 6b are **sequential**. Items within Sprint 6a (R7, R16, S4) are parallelizable. Sprint 7 depends only on Sprint 6a exit gate.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

### Sprint 6a Effort

| Component | Complexity | Estimated Effort | Production-Quality Risk |
|-----------|------------|------------------|------------------------|
| T001d: weight_history | Low | 2-3h | Low risk |
| R7: Anchor-aware thinning | Medium | 10-15h | Low risk |
| R16: Encoding-intent | Low | 5-8h | Low risk |
| S4: Spec folder hierarchy | Low-Medium | 6-10h | Low risk |
| N3-lite: Consolidation | Medium | 10-15h | Contradiction: 3-5x if semantic NLI |
| **Sprint 6a Total** | | **33-51h** | |

### Sprint 6b Effort (GATED)

| Component | Complexity | Estimated Effort | Production-Quality Risk |
|-----------|------------|------------------|------------------------|
| N2 (items 4-6): Centrality + community | High | 25-35h | N2c: up to 80h if Louvain required |
| R10: Entity extraction (gated) | Medium-High | 12-18h | 30-50h if ML-based NER |
| **Sprint 6b Total (heuristic)** | | **37-53h** | |
| **Sprint 6b Total (production)** | | **80-150h** | If N2c + R10 require ML |

**Note**: Checkpoint recommended before sprint start due to HIGH rollback difficulty. Sprint 6a may proceed immediately. Sprint 6b requires feasibility spike and quality tier confirmation (heuristic vs. production) before entry.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created before sprint start
- [ ] Edge density measured (R10 gating decision)
- [ ] Feature flags configured: `SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`
- [ ] All existing tests verified passing before changes
- [ ] Current feature flag count documented (must be <=6 post-sprint)

### Rollback Procedure
1. **Immediate**: Disable feature flags — `SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`
2. **Selective cleanup**: Remove auto-created edges via `created_by='auto'` query
3. **Selective cleanup**: Remove auto-extracted entities via `created_by='auto'` query
4. **Full rollback**: Restore from pre-sprint checkpoint if selective cleanup insufficient
5. **Verify rollback**: Run full test suite + eval metrics comparison

### Data Reversal
- **Has data migrations?** Yes — N3-lite modifies edge strengths; R10 creates new entity nodes/edges
- **Reversal procedure**: `created_by` provenance field enables selective removal of all auto-created/modified edges and entities. Full checkpoint restore available as fallback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References

Builds on PageIndex integration from Sprints 2-3 (PI-A1 folder scoring, PI-A2 fallback chain).

- **PI-A1 (Sprint 2 — DocScore aggregation)**: Consider folder-level scoring as a pre-filter before graph traversal in Sprint 6b. Folder scores established in Sprint 2 can narrow the graph candidate set, reducing centrality computation overhead.
- **PI-A2 (Sprint 3 — Fallback chain)**: Graph queries returning empty results (low-centrality or unpopulated community clusters) should route into the Sprint 3 fallback chain rather than returning empty-handed. Coordinate with Sprint 6b N2 implementation to emit a fallback signal when graph channel returns no results.

Research evidence: See research documents `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder.
<!-- /ANCHOR:pageindex-xrefs -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../000-feature-overview/plan.md

---

<!--
LEVEL 2 PLAN — Phase 7 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 6: Graph deepening + indexing optimization
- Split into Sprint 6a (33-51h, LOW risk) + Sprint 6b (37-53h, GATED on feasibility spike)
- UT-8 amendments: feasibility spike promoted to REQUIRED, phases restructured as sequential sub-sprints
- HIGH rollback difficulty — checkpoint recommended
-->

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

---

## 017-long-horizon

Source: 017-long-horizon/plan.md`

---
title: "Implementation Plan: Sprint 7 — Long Horizon"
description: "Memory summaries, smarter content generation, cross-document entity linking, full reporting with ablation studies, and R5 INT8 quantization evaluation."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2
trigger_phrases:
  - "sprint 7 plan"
  - "long horizon plan"
  - "R5 evaluation plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Sprint 7 — Long Horizon

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

This plan implements Sprint 7 — the final sprint addressing scale-dependent features and evaluation completion. All items are parallelizable with no internal dependencies: R8 memory summaries (gated on >5K memories), S1 smarter content generation, S5 cross-document entity linking, R13-S3 full reporting + ablation studies, and R5 INT8 quantization evaluation.

**Conditional Effort Scenarios:**

| Scenario | Scope | Effort |
|----------|-------|--------|
| Minimum viable (current scale) | R13-S3 + T005a + T005 + DEF-014 | 16-22h |
| Realistic (without R8) | All items except R8 | 33-48h |
| Full (R8 + S5 gates met) | All items | 48-68h |

> **GATING AND OPTIONALITY NOTE**: Sprint 7 is entirely P2/P3 priority and gated on >5K active memories with embeddings (current system estimate: <2K). All items are optional and should only be pursued if Sprint 0-6 metrics demonstrate clear need. R8 (PageIndex integration) is particularly conditional — the tree-navigation approach must be validated against the 500ms p95 latency hard limit before any R8 implementation begins. S5 (cross-document entity linking) is similarly gated — activates only if >1K active memories with embeddings OR >50 verified entities; below threshold, document as skipped. Do not plan Sprint 7 capacity unless scale thresholds are confirmed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sprint 6a graph deepening complete and exit gate passed (depends on S6a only, not S6b)
- [ ] Evaluation infrastructure fully operational (Sprint 0 + Sprint 4 enhancements)
- [ ] Memory count confirmed: `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'` — R8 activates only if result >5K
- [ ] Search latency and embedding dimensions measured for R5 gating decisions
- [ ] S5 scale gate measured: active memory count (>1K threshold) and verified entity count (>50 threshold) — S5 activates only if either threshold met
- [ ] All prior sprint feature flags inventoried for sunset audit

### Definition of Done
- [ ] All Sprint 7 requirements verified
- [ ] R13-S3 full reporting operational with ablation framework
- [ ] R5 decision documented with measured activation criteria
- [ ] Program completion: all health dashboard targets reviewed
- [ ] Final feature flag audit: sunset all sprint-specific flags
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Independent parallel items — no internal dependencies

### Key Components
- **Summary generation module** (R8): New module for memory summary generation with pre-filter integration into search pipeline. Gated on >5K memories.
- **Content generation handlers** (S1): Enhanced markdown-to-memory content conversion with improved quality heuristics
- **Entity linking module** (S5): Cross-document entity resolution and linking, coordinates with R10 auto-extracted entities from Sprint 6
- **Eval infrastructure** (R13-S3): Full reporting dashboard + ablation study framework — enables per-channel and per-sprint attribution
- **R5 evaluation** (decision only): Measure activation criteria (memory count, latency, dimensions) — implement INT8 ONLY if criteria met

### Data Flow
1. **R8**: Memory index → summary generation → pre-filter integration → reduced candidate set for search
2. **S1**: Raw markdown → improved content extraction → higher-quality memory content
3. **S5**: Entity extraction (R10) → cross-document entity resolution → entity link graph
4. **R13-S3**: Eval DB → full reporting dashboard → ablation study framework → per-component attribution
5. **R5**: Metrics measurement → activation criteria check → decision documentation

### R5 INT8 Quantization Details
- **Activation criteria**: >10K memories OR >50ms search latency OR >1536 embedding dimensions
- **Implementation constraint**: Use custom quantized BLOB — NOT sqlite-vec's `vec_quantize_i8`
- **Calibration**: Preserve Spec 140's KL-divergence calibration note
- **Recall risk**: 5.32% recall loss documented — acceptable only if activation criteria met
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

All items are parallelizable — no dependencies between them.

### R8: Memory Summary Generation (gated on >5K active memories with embeddings) — 15-20h
> **Prerequisite**: Confirm scale gate before any implementation. Run `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`. If result <5K, document skip decision and do not proceed.
> **Risk note**: PageIndex tree-navigation must be validated against 500ms p95 latency limit before integration. Measure latency impact on a representative corpus before enabling `SPECKIT_MEMORY_SUMMARIES`.
- [ ] Confirm scale gate (memory count query above)
- [ ] Design summary generation algorithm (extractive summarization or TF-IDF key-sentence extraction)
- [ ] Implement summary generation module
- [ ] Validate pre-filter latency: p95 must remain <500ms
- [ ] Integrate pre-filter into search pipeline (only if latency constraint met)
- [ ] Gate: Skip if <5K memories — document decision with query result

### S1: Smarter Content Generation — 8-12h
- [ ] Analyze current markdown-to-content conversion limitations
- [ ] Implement improved content extraction heuristics
- [ ] Verify quality improvement via manual review

### S5: Cross-Document Entity Linking (gated on >1K active memories OR >50 verified entities) — 8-12h
> **Prerequisite**: Confirm scale gate before any implementation. Measure active memory count (`SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`) and verified entity count. If neither threshold met (>1K memories OR >50 entities), document skip decision and do not proceed.
> **Feature flag**: `SPECKIT_ENTITY_LINKING` — all entity linking behavior gated behind this flag for rollback capability.
- [ ] Confirm scale gate (memory count + entity count queries above)
- [ ] Design entity resolution strategy (coordinates with R10 output)
- [ ] Implement cross-document entity matching behind `SPECKIT_ENTITY_LINKING` flag
- [ ] Create entity link graph connections
- [ ] Gate: Skip if thresholds not met — document decision with query results

### R13-S3: Full Reporting + Ablation Studies — 12-16h
- [ ] Implement full reporting dashboard
- [ ] Build ablation study framework (per-channel, per-sprint attribution)
- [ ] Integrate with existing eval infrastructure

### R5: INT8 Quantization Evaluation — 2h
- [ ] Measure current memory count, search latency, embedding dimensions
- [ ] Evaluate against activation criteria (>10K memories OR >50ms latency OR >1536 dimensions)
- [ ] Document decision with rationale (even if criteria NOT met — document the measurements)
- [ ] If criteria met: implement using custom quantized BLOB (not `vec_quantize_i8`); preserve original float vectors before quantization

### Final Feature Flag Sunset — included in R13-S3 or standalone
> **Flag sunset prerequisite**: Before program completion, inventory all feature flags from Sprints 0-7. Retire or consolidate flags that are no longer needed. Document survivors with justification. Target: zero sprint-specific temporary flags at program completion.
- [ ] Inventory all active flags across Sprints 0-7
- [ ] Retire or consolidate flags with no ongoing purpose
- [ ] Document final flag list with justification for each survivor
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | R8 summary generation, gating logic | Vitest | 2-3 tests |
| Unit | S1 content extraction quality | Vitest | 1-2 tests |
| Unit | S5 entity matching, linking logic | Vitest | 2-3 tests |
| Unit | R13-S3 reporting, ablation framework | Vitest | 2-3 tests |
| Unit | R5 activation criteria evaluation | Vitest | 1-2 tests |
| Integration | R8 pre-filter in search pipeline | Vitest | 1-2 tests |
| Integration | R8 skip-path: verify no summary generation when <5K memories | Vitest | 1 test |
| Integration | R8 latency benchmark: p95 remains <500ms with pre-filter | Vitest | 1 test |
| Integration | S1 content generation in memory pipeline end-to-end | Vitest | 1-2 tests |
| Integration | S5 cross-document entity linking end-to-end (if scale gate met) | Vitest | 1-2 tests |
| Integration | R13-S3 full reporting end-to-end | Vitest | 1-2 tests |

**Total**: Sprint 7 testing per item (unit + integration)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 6a graph deepening (S6a only, not S6b) | Internal | Green (assumed) | Blocks Sprint 7 start |
| Evaluation infrastructure (Sprint 0/4) | Internal | Green (assumed) | R13-S3 cannot proceed |
| R10 auto entity extraction (Sprint 6) | Internal | Green (assumed) | S5 linking limited to manual entities |
| better-sqlite3 | Internal | Green | Required for all DB operations |
| sqlite-vec | Internal | Green | Required for R5 evaluation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: R5 INT8 causes unacceptable recall loss, R8 overhead excessive, or quality regressions detected
- **Procedure**: Each item is independent — disable relevant feature flag and revert individual changes
- **Estimated time**: MEDIUM — each item can be individually reverted (2-4h per item)
- **Difficulty**: MEDIUM — items are independent; no cross-cutting dependencies
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
R8 (15-20h) ──────┐
S1 (8-12h) ───────┤
S5 (8-12h) ───────┼──► Program Completion Gate
R13-S3 (12-16h) ──┤
R5 eval (2h) ─────┤
T-PI-S7 (2-4h) ───┘
  (all parallelizable)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| R8 (Memory Summaries) | Sprint 6a exit gate | Program completion |
| S1 (Content Generation) | Sprint 6a exit gate | Program completion |
| S5 (Entity Linking) | Sprint 6a exit gate, R10 (Sprint 6) | Program completion |
| R13-S3 (Full Reporting) | Sprint 6a exit gate, Eval infra | Program completion |
| R5 (INT8 Evaluation) | Sprint 6a exit gate | Program completion |
| T-PI-S7 (PageIndex Review) | Sprint 6a exit gate | Program completion |

**Note**: All items are independent and can execute in parallel. S5 is additionally gated on >1K active memories OR >50 verified entities.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| R8 (Memory Summaries) | Medium | 15-20h |
| S1 (Content Generation) | Low-Medium | 8-12h |
| S5 (Entity Linking) | Low-Medium | 8-12h |
| R13-S3 (Full Reporting) | Medium | 12-16h |
| R5 (INT8 Evaluation) | Low | 2h |
| T-PI-S7 (PageIndex Review) | Low | 2-4h |
| DEF-014 (structuralFreshness) | Low | 1-2h |
| **Total** | | **48-68h** |

> **Effort reconciliation**: Parent spec lists 45-62h (core items only, excluding T-PI-S7 and DEF-014). This child total of 48-68h includes T-PI-S7 (2-4h) and DEF-014 (1-2h) which are cross-reference and deferred-item tasks not counted in the parent's per-sprint table.

**Conditional Effort Scenarios** (see summary for details):

| Scenario | Scope | Effort |
|----------|-------|--------|
| Minimum viable (current scale) | R13-S3 + T005a + T005 + DEF-014 | 16-22h |
| Realistic (without R8) | All items except R8 | 33-48h |
| Full (R8 + S5 gates met) | All items | 48-68h |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing tests verified passing before changes
- [ ] Feature flags configured: `SPECKIT_MEMORY_SUMMARIES` (R8), `SPECKIT_ENTITY_LINKING` (S5)
- [ ] Gating criteria measured: memory count (R8), latency/dimensions (R5)
- [ ] Prior sprint feature flags inventoried for sunset

### Rollback Procedure
1. **Immediate**: Disable `SPECKIT_MEMORY_SUMMARIES` flag if R8 causes issues
2. **Immediate**: Disable `SPECKIT_ENTITY_LINKING` flag if S5 causes issues
3. **R5 rollback**: Remove INT8 quantization, restore original embeddings (if implemented)
4. **Individual item revert**: Each item is independent — `git revert` per feature
5. **Verify rollback**: Run full test suite + eval metrics comparison

### Data Reversal
- **Has data migrations?** Potentially — R8 creates summary data; R5 may quantize embeddings
- **Reversal procedure**: R8 summaries can be deleted without impact. R5 INT8 requires re-embedding from original vectors (preserve originals before quantization).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References

Builds on PageIndex integration from Sprints 0, 5 (PI-A5 quality verification, PI-B1 tree thinning).

- **PI-A5 (Sprint 0 — Verify-fix-verify)**: Long-horizon quality monitoring (particularly R13-S3 full reporting and the ablation framework) should incorporate the verify-fix-verify pattern. At scale, the R13-S3 reporting layer provides the "verify" phase; incorporating automated re-verification after fix cycles closes the loop for ongoing memory quality maintenance.
- **PI-B1 (Sprint 5 — Tree thinning)**: R8 memory summaries (gated on >5K memories) and the R13-S3 ablation framework both involve traversing large accumulated spec folders. The tree thinning pattern from Sprint 5 should inform how the summary generation module and the reporting dashboard scope their traversal to avoid loading unbounded context trees.

Research evidence: See research documents `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder.
<!-- /ANCHOR:pageindex-xrefs -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../000-feature-overview/plan.md

---

<!--
LEVEL 2 PLAN — Phase 8 of 8 (FINAL)
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 7: Long horizon — scale-dependent optimizations + eval completion
- All items parallelizable — MEDIUM rollback difficulty
- R5 INT8: custom quantized BLOB, NOT vec_quantize_i8
-->

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

---

## 018-deferred-features

Source: 018-deferred-features/plan.md`

---
title: "Implementation Plan: Sprint 8 - Deferred Features"
description: "Plan deferred-feature execution with dependency gates, verification checkpoints, and rollback controls."
# SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child-header | v2.2
trigger_phrases:
  - "sprint 8 plan"
  - "deferred implementation"
  - "phase execution"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Sprint 8 - Deferred Features

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown specification artifacts |
| **Framework** | system-spec-kit phase workflow |
| **Storage** | Git-tracked spec documents |
| **Testing** | `validate.sh --recursive` |

### Overview
This phase turns deferred backlog items into executable, bounded tasks. The plan prioritizes safety: dependency checks first, implementation sequencing second, validation and rollback readiness last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Deferred backlog scope identified
- [x] Parent-phase references available
- [x] Validation command path confirmed

### Definition of Done
- [ ] Deferred tasks are synchronized with requirements
- [ ] Validation exits with code 0 or 1
- [ ] Remaining warnings are documented with rationale
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phase child planning with dependency-gated execution.

### Key Components
- **Spec Document**: Defines deferred scope and acceptance outcomes.
- **Plan Document**: Defines execution order, dependencies, and controls.
- **Tasks Document**: Tracks completion status and verification flow.

### Data Flow
Deferred backlog inputs are transformed into requirements, then phased tasks, then validated outputs captured in sprint verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Intake and Mapping
- [ ] Confirm deferred candidates and in-scope boundaries
- [ ] Map every deferred item to a task ID

### Phase 2: Execution and Verification
- [ ] Execute deferred tasks in dependency order
- [ ] Validate each completed task against acceptance criteria

### Phase 3: Exit and Handoff
- [ ] Confirm unresolved items are explicitly deferred
- [ ] Publish status and handoff to successor phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural Validation | Required files, anchors, headers | `validate.sh --recursive` |
| Link Integrity | Parent/predecessor/successor references | Validator phase-links checks |
| Manual Review | Scope and requirement alignment | Spec review against tasks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 7 outputs (`008`) | Internal | Required | Deferred tasks cannot be scoped accurately |
| Successor remediation phase (`006`) | Internal | Required | Handoff and sequencing become inconsistent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation exit code 2 after updates.
- **Procedure**: Revert sprint-8 doc edits, restore last passing revision, and re-apply changes incrementally.
<!-- /ANCHOR:rollback -->

---

## 019-extra-features

Source: 019-extra-features/plan.md

# Implementation Plan: Sprint 9 — Extra Features

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP SDK (stdio transport) |
| **Storage** | SQLite + sqlite-vec + FTS5 |
| **Testing** | eval_run_ablation (9 metrics), manual MCP tool calls |
| **New Dependencies** | zod, chokidar, node-llama-cpp (P1-5 only) |

### Overview
This plan implements 7 active items (3 P0, 4 P1) from the 016 definitive synthesis in 4 phases. Each phase is independently deployable and testable. All changes are additive (no breaking changes) and feature-flagged. The existing evaluation framework provides regression safety.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (eval framework, sqlite-vec, FTS5)
- [x] Research complete (16 documents, triple-verified)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] `eval_run_ablation` shows zero regressions
- [ ] All new features behind feature flags
- [ ] Spec/plan/tasks/checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP server with handler → service → storage separation.

### Key Components
- **Tool Schema Layer** (tool-schemas.ts): Zod validation at entry point
- **Handler Layer** (handlers/*.ts): Request processing, response envelope formatting
- **Service Layer** (lib/search/*.ts, lib/ops/*.ts): Business logic, job queue, file watcher
- **Storage Layer** (lib/storage/*.ts): SQLite persistence for jobs, indexes

### Data Flow

```
LLM Agent → MCP Tool Call → Zod Validation → Handler → Service → Storage
                                ↓                         ↓
                          Reject invalid           Async Job Queue
                                                        ↓
                                              File Watcher → Re-index
```

### New Feature Flags

| Flag | Default | Controls |
|------|---------|----------|
| `SPECKIT_STRICT_SCHEMAS` | `true` | Zod `.strict()` vs `.passthrough()` |
| `SPECKIT_RESPONSE_TRACE` | `false` | Include trace in response envelope |
| `SPECKIT_CONTEXT_HEADERS` | `true` | Contextual tree injection |
| `SPECKIT_FILE_WATCHER` | `false` | Real-time filesystem watching |
| `SPECKIT_DYNAMIC_INIT` | `true` | Dynamic server instructions |
| `RERANKER_LOCAL` | `false` | Local GGUF reranker (existing flag) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hardening & Ergonomics (Est. 1-2 weeks)

All items independent — can be parallelized.

#### P0-1: Strict Zod Schema Validation

**Current state**: `tool-schemas.ts` (lines 1-396) defines 24 tools across 7 layers (L1-L7) using plain object descriptions. No runtime validation. Parameters are trusted as-is by handlers.

**Implementation steps:**
1. Add `zod` dependency: `npm install zod`
2. Audit all 24 tool definitions in `tool-schemas.ts` (lines 19-358). Document exact parameter types per tool:
   - L1: `memory_context` — 10 params (input, mode enum, intent enum, specFolder, limit, sessionId, enableDedup, includeContent, tokenUsage, anchors)
   - L2: `memory_search` — 25+ params (query/concepts, specFolder, limit, tier, contextType, useDecay, mode, rerank, intent, etc.)
   - L2: `memory_match_triggers` — 5 params (prompt, limit, session_id, turnNumber, include_cognitive)
   - L2: `memory_save` — 5 params (filePath, force, dryRun, skipPreflight, asyncEmbedding)
   - L3-L7: remaining 20 tools with 2-10 params each
3. Create Zod schemas per tool. Example for `memory_search`:
   ```typescript
   const MemorySearchInput = z.object({
     query: z.string().min(2).max(1000).optional(),
     concepts: z.array(z.string()).optional(),
     specFolder: z.string().optional(),
     limit: z.number().int().min(1).max(50).default(10),
     sessionId: z.string().uuid().optional(),
     mode: z.enum(["auto", "semantic", "keyword", "hybrid"]).default("auto"),
     includeContent: z.boolean().default(false),
     rerank: z.boolean().optional(),
     intent: z.enum(["general", "recall", "debug", "research", "synthesis", "evaluate", "resume"]).optional(),
     // ... remaining 15+ params
   }).strict(); // or .passthrough() based on flag
   ```
4. Add schema selection logic gated on `SPECKIT_STRICT_SCHEMAS`:
   ```typescript
   const getSchema = (base: z.ZodObject<any>) =>
     process.env.SPECKIT_STRICT_SCHEMAS !== 'false' ? base.strict() : base.passthrough();
   ```
5. Wrap all handler entry points in `schema.parse(rawInput)` with try/catch returning actionable Zod error messages
6. Test matrix: for each of the 24 tools, verify (a) valid params pass, (b) unknown params rejected in strict mode, (c) unknown params accepted in passthrough mode

**Key files**: `mcp_server/tool-schemas.ts`, `mcp_server/handlers/index.ts` (tool dispatch), all 29 handler files in `handlers/`

#### P0-2: Provenance-Rich Response Envelopes

**Current state**: `formatSearchResults()` at `formatters/search-results.ts:130` returns `FormattedSearchResult` with basic fields (id, specFolder, filePath, title, similarity). Internal `PipelineRow` has 10+ score fields (`rrfScore`, `intentAdjustedScore`, `stage2Score`, `attentionScore`, `quality_score`) that are DROPPED before the response reaches the caller.

**Implementation steps:**
1. Audit current response shape at `formatters/search-results.ts:57-78` — document which PipelineRow fields survive vs. are dropped
2. Define new `MemoryResultEnvelope` interface extending current shape:
   ```typescript
   interface MemoryResultEnvelope extends FormattedSearchResult {
     scores?: {
       semantic: number | null;   // From PipelineRow.similarity (0-100 → 0-1)
       lexical: number | null;    // From FTS5 or BM25 channel score
       fusion: number | null;     // From PipelineRow.rrfScore
       intentAdjusted: number | null; // From PipelineRow.intentAdjustedScore
       composite: number | null;  // From resolveEffectiveScore() chain
       rerank: number | null;     // From Stage 3 cross-encoder (null if disabled)
       attention: number | null;  // From PipelineRow.attentionScore
     };
     source?: {
       file: string;              // From PipelineRow.file_path
       anchorIds: string[];       // Extracted from content anchors
       anchorTypes: string[];     // From S2 semantic anchor typing
       lastModified: string;      // File mtime
       memoryState: string;       // From PipelineRow.memoryState
     };
     trace?: {
       channelsUsed: string[];    // Which of the 5 channels returned results
       pipelineStages: string[];  // Which stages were executed
       fallbackTier: number | null; // From 3-tier fallback chain
       queryComplexity: string;   // From R15 complexity router
       expansionTerms: string[];  // From R12 multi-query expansion
       budgetTruncated: boolean;  // From truncateToBudget() at line 934
       scoreResolution: string;   // Which score in the chain was used
     };
   }
   ```
3. Modify `formatSearchResults()` to accept an `includeTrace: boolean` option and populate new fields from the PipelineRow data already available
4. Modify `hybrid-search.ts` Stage 4 exit (lines 934-945) to preserve trace metadata through to the result set. Currently `_s4shadow` is attached as a non-enumerable property — make trace data explicit.
5. Add `includeTrace` parameter to `memory_search` Zod schema (P0-1 dependency)
6. Default `includeTrace: false` — when false, omit `scores`, `source`, `trace` objects entirely (backward compatible)
7. Test: compare `memory_search` output with and without `includeTrace`, verify scores match internal PipelineRow values

**Key files**: `formatters/search-results.ts` (main), `lib/search/hybrid-search.ts` (Stage 4), `lib/search/pipeline/types.ts` (PipelineRow), `handlers/memory-search.ts` (parameter threading)

#### P1-6: Dynamic Server Instructions

**Current state**: `context-server.ts` initialization (lines 511-550) performs SQLite version check, embedding readiness, session manager init, and legacy `SPECKIT_EAGER_WARMUP`. No dynamic instruction injection.

**Implementation steps:**
1. Add `buildServerInstructions()` async function in `context-server.ts`:
   ```typescript
   async function buildServerInstructions(): Promise<string> {
     if (process.env.SPECKIT_DYNAMIC_INIT === 'false') return '';
     const stats = await getMemoryStats(); // Reuse existing memory_stats handler
     const lines = [
       `Memory system: ${stats.totalMemories} memories across ${stats.specFolders} spec folders.`,
       `Active: ${stats.activeCount} | Stale: ${stats.staleCount} | Archived: ${stats.archivedCount}`,
       stats.staleCount > 10 ? `⚠ ${stats.staleCount} stale memories — consider memory_index_scan.` : '',
       `Search channels: vector, FTS5, BM25, graph, degree (5-channel hybrid pipeline).`,
       `Key tools: memory_context (orchestrated retrieval), memory_search (direct search), memory_save (index file).`,
       `Resume support: use memory_context with mode="resume" to recover prior session state.`,
     ];
     return lines.filter(Boolean).join(' ');
   }
   ```
2. Call after existing init sequence completes (after line 550)
3. Inject via MCP SDK: `server.setInstructions(await buildServerInstructions())`
4. Gate behind `SPECKIT_DYNAMIC_INIT` (default: `true`)
5. Test: start server, intercept MCP handshake, verify instructions payload

**Key file**: `mcp_server/context-server.ts` (lines 511-560 area)

### Phase 2: Operational Reliability (Est. 2-3 weeks)

P0-3 depends on Phase 1 schemas. P1-4 depends on P0-2 envelope format. P1-7 is independent.

#### P0-3: Async Ingestion Job Lifecycle

**Current state**: `memory-save.ts` (line 1142) accepts `asyncEmbedding` param. When true, saves the memory immediately with `embedding_status='pending'` and schedules a `setImmediate()` call to `retryManager.retryEmbedding()` (lines 1106-1115). This is single-file async. No multi-file job queue, no progress tracking, no status polling.

**Implementation steps:**
1. Create `lib/ops/job-queue.ts` (~200 LOC):
   ```typescript
   interface IngestJob {
     id: string;           // `job_${nanoid(12)}`
     state: 'queued' | 'parsing' | 'embedding' | 'indexing' | 'complete' | 'failed' | 'cancelled';
     specFolder?: string;
     paths: string[];
     filesTotal: number;
     filesProcessed: number;
     errors: Array<{ file: string; error: string }>;
     createdAt: string;
     updatedAt: string;
   }
   ```
2. SQLite persistence: create `ingest_jobs` table alongside existing DB. On server restart, scan for incomplete jobs and reset to `queued`.
3. State machine transitions with validation (no backward transitions except reset-on-restart).
4. Sequential processing within queue: one file at a time to avoid SQLite write contention. Reuse existing `indexMemoryFile()` from `memory-save.ts` (line 1238 path).
5. Create `memory_ingest_start` handler:
   - Input: `{ paths: string[], specFolder?: string }` (validated via Zod)
   - Creates job record, enqueues, returns `{ jobId, state: 'queued', filesTotal }` in <100ms
   - Actual processing starts asynchronously via `setImmediate()`
6. Create `memory_ingest_status` handler:
   - Input: `{ jobId: string }`
   - Returns full job state including `progress`, `filesProcessed`, `filesTotal`, `errors`, `state`
7. Create `memory_ingest_cancel` handler:
   - Input: `{ jobId: string }`
   - Sets `state: 'cancelled'`. Processing loop checks state before each file.
8. Register new tools in `handlers/index.ts` and `tool-schemas.ts`
9. Test: create spec folder with 100+ `.md` files, call `memory_ingest_start`, poll `memory_ingest_status` every 5s, verify progress updates and final `complete` state.

**Key files**: `lib/ops/job-queue.ts` (new), `handlers/memory-save.ts` (reuse `indexMemoryFile`), `handlers/index.ts` (registration), `tool-schemas.ts` (schemas)

#### P1-4: Contextual Tree Injection

**Current state**: PI-B3 cached one-sentence descriptions per spec folder exist and are used for internal routing in `memory_context`. S4 hierarchy parsing is operational. The hierarchy data is NOT injected into returned content.

**Implementation steps:**
1. Create `injectContextualTree()` function in `lib/search/hybrid-search.ts` or a new `lib/search/context-enrichment.ts`:
   ```typescript
   function injectContextualTree(row: PipelineRow, descCache: Map<string, string>): PipelineRow {
     if (!row.file_path || !row.content) return row;
     const specFolder = extractSpecFolder(row.file_path); // e.g., "022-hybrid-rag-fusion/015-pipeline-refactor"
     if (!specFolder) return row;
     const parts = specFolder.split('/').slice(-2); // Last 2 segments
     const desc = descCache.get(specFolder);
     const header = desc
       ? `[${parts.join(' > ')} — ${desc.slice(0, 60)}]`
       : `[${parts.join(' > ')}]`;
     if (header.length <= 100) {
       row.content = `${header}\n${row.content}`;
     }
     return row;
   }
   ```
2. Insert call into Stage 4 output, AFTER token budget truncation (line 945), BEFORE final return
3. Gate behind `SPECKIT_CONTEXT_HEADERS` (default: `true`)
4. Cap header at 100 characters total (enforced in function)
5. Skip injection when `content` is null (e.g., `includeContent: false` mode)
6. Test: `memory_search` for a known spec folder memory, verify header format

**Key files**: `lib/search/hybrid-search.ts` (insertion point at ~line 945), PI-B3 description cache (existing)

#### P1-7: Real-Time Filesystem Watching

**Current state**: Index relies on pull-based `memory_index_scan` which does incremental indexing via mtime+SHA-256 content hash (TM-02). No push-based watching.

**Implementation steps:**
1. Add `chokidar` dependency: `npm install chokidar`
2. Create `lib/ops/file-watcher.ts` (~150 LOC):
   ```typescript
   import chokidar from 'chokidar';
   import { createHash } from 'crypto';

   interface WatcherConfig {
     specDirs: string[];       // Directories to watch
     debounceMs: number;       // Default: 2000
     maxRetries: number;       // Default: 3
     reindexFn: (path: string) => Promise<void>;
   }

   export function startFileWatcher(config: WatcherConfig): chokidar.FSWatcher {
     const pending = new Map<string, NodeJS.Timeout>();
     const hashCache = new Map<string, string>(); // path → SHA-256

     const watcher = chokidar.watch(config.specDirs, {
       ignored: /(^|[\/\\])\../, // Ignore dotfiles
       persistent: true,
       ignoreInitial: true,
       awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
     });

     watcher.on('change', (filePath: string) => {
       if (!filePath.endsWith('.md')) return;
       if (pending.has(filePath)) clearTimeout(pending.get(filePath)!);
       pending.set(filePath, setTimeout(async () => {
         pending.delete(filePath);
         // Content-hash dedup (TM-02 pattern)
         const content = await fs.readFile(filePath, 'utf-8');
         const hash = createHash('sha256').update(content).digest('hex');
         if (hashCache.get(filePath) === hash) return; // Unchanged
         hashCache.set(filePath, hash);
         // Retry with exponential backoff
         await retryWithBackoff(() => config.reindexFn(filePath), {
           maxRetries: config.maxRetries,
           baseDelayMs: 1000,
         });
       }, config.debounceMs));
     });

     return watcher;
   }
   ```
3. Initialize watcher in `context-server.ts` after DB is ready, gated behind `SPECKIT_FILE_WATCHER`
4. Wire `reindexFn` to existing `indexMemoryFile()` from `memory-save.ts`
5. Enforce WAL mode in SQLite connection (check existing pragma settings)
6. Register `watcher.close()` in server shutdown handler to prevent process leaks
7. Test: start server with watcher enabled, save a `.md` file, verify re-index within 5s via `memory_search`

**Key files**: `lib/ops/file-watcher.ts` (new), `context-server.ts` (init), `handlers/memory-save.ts` (reuse `indexMemoryFile`)

### Phase 3: Retrieval Excellence (Est. 2-4 weeks)

Depends on Phase 1 test infrastructure (eval framework verification).

#### P1-5: Local GGUF Reranker

**Current state**: Stage 3 reranking is gated behind `SPECKIT_CROSS_ENCODER` (default ON). Current implementation supports Cohere and Voyage remote APIs. `RERANKER_LOCAL` flag exists but has no implementation path for node-native GGUF models. The reranking pipeline slot is at approximately lines 850-900 of `hybrid-search.ts`.

**Implementation steps:**
1. Add dependency: `npm install node-llama-cpp` (native Node.js bindings for llama.cpp)
2. Create `lib/search/local-reranker.ts` (~200 LOC):
   ```typescript
   import { getLlama, LlamaModel, LlamaContext } from 'node-llama-cpp';
   import os from 'os';
   import fs from 'fs/promises';

   const MODEL_PATH = process.env.SPECKIT_RERANKER_MODEL
     || path.join(__dirname, '../../../models/bge-reranker-v2-m3.Q4_K_M.gguf');
   const MIN_FREE_MEM_MB = 4096;
   let cachedModel: LlamaModel | null = null;

   export async function canUseLocalReranker(): Promise<boolean> {
     if (process.env.RERANKER_LOCAL !== 'true') return false;
     const freeMem = os.freemem() / (1024 * 1024);
     if (freeMem < MIN_FREE_MEM_MB) {
       console.warn(`[local-reranker] Insufficient memory: ${Math.round(freeMem)}MB < ${MIN_FREE_MEM_MB}MB`);
       return false;
     }
     try { await fs.access(MODEL_PATH); return true; }
     catch { console.warn(`[local-reranker] Model not found: ${MODEL_PATH}`); return false; }
   }

   export async function rerankLocal(
     query: string,
     candidates: PipelineRow[],
     topK: number = 20
   ): Promise<PipelineRow[]> {
     if (!(await canUseLocalReranker())) return candidates;
     const startTime = Date.now();
     try {
       if (!cachedModel) {
         const llama = await getLlama();
         cachedModel = await llama.loadModel({ modelPath: MODEL_PATH });
       }
       const ctx = await cachedModel.createContext();
       // Score each candidate against query using cross-encoder pattern
       for (const c of candidates.slice(0, topK)) {
         const input = `query: ${query} document: ${(c.content || '').slice(0, 512)}`;
         const embedding = await ctx.encode(input);
         c.rerankScore = embedding[0]; // Cross-encoder similarity score
       }
       const elapsed = Date.now() - startTime;
       console.log(`[local-reranker] Reranked ${Math.min(candidates.length, topK)} candidates in ${elapsed}ms`);
       return candidates.sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0));
     } catch (err) {
       console.warn(`[local-reranker] Failed, falling back to RRF: ${err}`);
       return candidates; // Graceful fallback
     }
   }
   ```
3. Integrate into Stage 3 slot in `hybrid-search.ts`: call `rerankLocal()` when `RERANKER_LOCAL=true`, before existing Cohere/Voyage path
4. Model cache: keep loaded model in module-level variable to avoid reload per query. Dispose on server shutdown.
5. Performance target: <500ms for top-20 candidates with Q4_K_M quantization (~350MB model)
6. Test: run `eval_run_ablation` with `RERANKER_LOCAL=true` vs default remote reranking. Document MRR@5, precision@5 delta.

**Key files**: `lib/search/local-reranker.ts` (new), `lib/search/hybrid-search.ts` (Stage 3 integration), `package.json` (dependency)

**Hardware requirement**: macOS ARM64 (Apple Silicon) with ≥16GB unified memory recommended. Falls back gracefully on lower-memory systems.

### Phase 4: Innovation (Deferred — demand-driven)

| Item | Trigger to Start | Estimated Effort |
|------|-----------------|-----------------|
| P2-8: Daemon mode | MCP SDK standardizes HTTP transport | L (2-3 weeks) |
| P2-9: Storage adapters | Corpus > 100K memories or multi-node needed | M-L (1-2 weeks) |
| P2-10: Namespaces | Multi-tenant deployment demand | S-M (3-5 days) |
| P2-11: ANCHOR graph nodes | 2-day spike shows promise | S-M (3-5 days) |
| P2-12: AST sections | Spec docs regularly exceed 1000 lines | M (5-7 days) |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | All search channels post-change | `eval_run_ablation` (9 metrics) |
| Schema validation | All 20+ MCP tools | Zod parse with valid + invalid inputs |
| Integration | Async job lifecycle | Start job → poll status → verify completion |
| Integration | File watcher | Save file → verify re-index within 5s |
| Performance | Schema overhead | Measure tool call latency delta (<5ms) |
| Performance | GGUF reranking | Measure reranking latency (<500ms for 20 candidates) |
| Manual | Response envelope | Inspect `memory_search` output with `includeTrace: true` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Eval framework (ablation, 9 metrics) | Internal | Green | Cannot verify regressions |
| sqlite-vec + FTS5 | Internal | Green | Core search broken |
| zod | External (npm) | Green | Well-maintained, widely used |
| chokidar | External (npm) | Green | Standard file watcher |
| node-llama-cpp | External (npm) | Yellow | P1-5 only, needs hardware test |
| PI-B3 description cache | Internal | Green | Contextual trees need it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any eval metric regresses by >5% or SQLITE_BUSY errors in production
- **Procedure**: Disable relevant feature flag(s), no code revert needed
- **Data**: No schema migrations — all changes are runtime behavior behind flags
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Hardening) ──────────────────────┐
  ├── P0-1: Zod schemas (independent)     │
  ├── P0-2: Response envelopes (indep.)   ├──► Phase 2 (Operations)
  └── P1-6: Dynamic init (independent)    │     ├── P0-3: Async jobs (needs P0-1)
                                          │     ├── P1-4: Context trees (needs P0-2)
                                          │     └── P1-7: File watcher (independent)
                                          │
                                          └──► Phase 3 (Retrieval)
                                                └── P1-5: GGUF reranker (needs eval baseline)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Hardening | Med | 1-2 weeks |
| Phase 2: Operations | Med-High | 2-3 weeks |
| Phase 3: Retrieval | High | 2-4 weeks |
| Phase 4: Innovation | — | Deferred |
| **Total (P0+P1)** | | **5-9 weeks** |

---

## L3: CRITICAL PATH

1. **P0-1: Zod schemas** — 2-3 days — CRITICAL (blocks P0-3 schema reuse)
2. **P0-2: Response envelopes** — 4-5 days — CRITICAL (blocks P1-4 format)
3. **P0-3: Async ingestion** — 5-7 days — CRITICAL (unblocks bulk indexing)
4. **P1-5: GGUF reranker** — 5-8 days — LONG POLE (hardware dependency)

**Total Critical Path**: ~16-23 days (Phases 1-2)

**Parallel Opportunities**:
- P0-1, P0-2, P1-6 all independent within Phase 1
- P1-4 and P1-7 can run in parallel within Phase 2

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 Complete | All tools have Zod schemas, envelopes work, dynamic init active | End of week 2 |
| M2 | Phase 2 Complete | Async jobs operational, file watcher running, context trees injected | End of week 5 |
| M3 | Phase 3 Complete | Local GGUF reranker tested and benchmarked | End of week 9 |
| M4 | All P0+P1 Done | Zero eval regressions, all feature flags documented | End of week 9 |

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: tool-schemas.ts (Zod schemas)
**Duration**: ~2-3 days
**Agent**: Primary

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Agent A | Response envelopes | handlers/*.ts, hybrid-search.ts |
| Agent B | Dynamic init | context-server.ts |
| Agent C | File watcher | lib/ops/file-watcher.ts |

**Duration**: ~5-7 days (parallel)

### Tier 3: Integration
**Agent**: Primary
**Task**: Async job queue (builds on schemas), contextual trees (builds on envelopes)
**Duration**: ~7-10 days

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Files | Status |
|----|------|-------|--------|
| W-A | Schema Hardening | tool-schemas.ts, handlers/*.ts | Phase 1 |
| W-B | Response Surface | handlers/memory-search.ts, hybrid-search.ts | Phase 1-2 |
| W-C | Operational Tooling | lib/ops/job-queue.ts, lib/ops/file-watcher.ts | Phase 2 |
| W-D | Retrieval Enhancement | lib/search/local-reranker.ts | Phase 3 |

### File Ownership Rules
- tool-schemas.ts owned by W-A
- handlers/*.ts shared between W-A and W-B (W-A for input, W-B for output)
- lib/ops/*.ts owned by W-C
- lib/search/local-reranker.ts owned by W-D

## AI Execution Protocol

### Pre-Task Checklist
- Confirm scope lock for this phase folder before edits.
- Confirm validator command and target path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute fixes in warning-category order and re-validate after each pass. |
| TASK-SCOPE | Do not modify files outside this phase folder unless explicitly required by parent-link checks. |

### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path and validator evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, attempted remediation, and next safe action before proceeding.
