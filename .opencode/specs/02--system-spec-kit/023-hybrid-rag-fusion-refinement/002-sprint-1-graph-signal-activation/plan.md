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
- **Feature flag**: `SPECKIT_DEGREE_BOOST` — disabled by default; dark-run comparison before enabling.
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
- [ ] Feature flag `SPECKIT_DEGREE_BOOST` configured and defaults to disabled
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
- **Parent Plan**: See `../plan.md`
- **Predecessor Plan**: See `../001-sprint-0-measurement-foundation/plan.md`

---

<!--
LEVEL 2 PLAN — Phase 2 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 1: Graph signal activation via R4 typed-degree 5th channel
- Feature flag gated with dark-run verification
-->
