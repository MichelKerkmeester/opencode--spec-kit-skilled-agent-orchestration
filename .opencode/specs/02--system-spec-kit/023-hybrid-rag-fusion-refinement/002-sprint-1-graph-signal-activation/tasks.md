---
title: "Tasks: Sprint 1 — Graph Signal Activation"
description: "Task breakdown for Sprint 1: typed-weighted degree as 5th RRF channel, edge density, agent UX"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "sprint 1 tasks"
  - "graph signal tasks"
  - "R4 tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Sprint 1 — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[GATE]` | Sprint exit gate |

**Task Format**: `T### [P?] Description (file path) [effort] {dependencies} — Requirement`

### Task Naming Clarification

| Task ID | Independent Task | Phase | Rationale for Suffix |
|---------|-----------------|-------|----------------------|
| **T003a** | A7: Co-activation boost strength (REQ-S1-004) | Phase 3 | Placed in Phase 3 alongside T003 (both measurement/graph-related). Independent of T003 — not a sub-task. Suffix "a" denotes same-phase sibling, not parent-child. |
| **T005a** | TM-08: Signal vocabulary expansion (REQ-S1-005) | Phase 4 | Placed in Phase 4 alongside T004 (both agent UX/signal-related). Independent of T005 (dark-run). Suffix "a" denotes thematic grouping, not parent-child. |

> **Note**: T003a and T005a are fully independent tasks with their own requirements (REQ-S1-004, REQ-S1-005). The "a" suffix indicates co-location within the same phase for scheduling purposes, not a dependency on T003 or T005 respectively.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Degree Computation

- [x] T001 Implement typed-weighted degree computation — SQL query against `causal_edges` + TypeScript normalization (`graph-search-fn.ts`) [8-10h] — R4 (REQ-S1-001)
  - Formula: `typed_degree(node) = SUM(weight_t * count_t)`
  - Normalized: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`
  - Edge type weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5
  - MAX_TYPED_DEGREE=15 (computed global with fallback)
  - MAX_TOTAL_DEGREE=50 cap
  - DEGREE_BOOST_CAP=0.15
  - Constitutional memory exclusion
  - Acceptance: Degree SQL returns correct scores for known test graph; normalization output in [0, 0.15] range; constitutional memories return 0
  - Implementation hint: SQL should GROUP BY source_id/target_id and JOIN on `relation` type for weight lookup. Use `SELECT source_id, SUM(CASE relation WHEN 'caused' THEN 1.0 ... END * strength) FROM causal_edges GROUP BY source_id` pattern.
  - Sub-steps:
    1. Write degree computation SQL query (2-3h)
    2. Add TypeScript normalization + capping wrapper (2-3h)
    3. Implement degree cache with mutation-triggered invalidation (2-3h)
    4. Add constitutional memory exclusion filter (1h)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: RRF Integration

- [x] T002 Integrate degree as 5th RRF channel behind `SPECKIT_DEGREE_BOOST` feature flag (`rrf-fusion.ts`, `hybrid-search.ts`) [4-6h] {T001} — R4 (REQ-S1-001)
  - Acceptance: 5-channel RRF fusion produces rankings; flag=false yields identical results to 4-channel; flag=true shows degree influence in results
  - Implementation hint: In `rrf-fusion.ts`, add degree scores as 5th array in the channel list; in `hybrid-search.ts`, wire degree computation call into the search pipeline gated by `process.env.SPECKIT_DEGREE_BOOST`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Measurement

- [x] T003 [P] Measure edge density (edges/node) from `causal_edges` data; document R10 escalation decision if density < 0.5 [2-3h] — Edge density (REQ-S1-002)
  - Acceptance: Density ratio computed; if < 0.5, R10 escalation documented with timeline recommendation
  - Implementation hint: `SELECT CAST(COUNT(*) AS REAL) / (SELECT COUNT(DISTINCT id) FROM memory_index) FROM causal_edges`
- [x] T003a [P] Increase co-activation boost strength — raise base multiplier from 0.1x to 0.25-0.3x (configurable coefficient); dark-run verifiable [2-4h] {T001} — A7 (REQ-S1-004)
  - Acceptance: Graph channel effective contribution >=15% at hop 2 (up from ~5%); dark-run verified
  - Implementation hint: Modify co-activation multiplier constant in `co-activation.ts`; make configurable via `SPECKIT_COACTIVATION_STRENGTH` env var
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Agent UX + Signal Vocabulary

- [x] T004 [P] Agent-as-consumer UX analysis + consumption instrumentation — log consumption patterns, generate initial report [8-12h] — G-NEW-2 (REQ-S1-003)
  - Acceptance: Consumption patterns logged with query text, result count, selected IDs, ignored IDs; pattern report generated
  - Sub-steps:
    1. Add instrumentation hooks to `memory_search`, `memory_context`, `memory_match_triggers` responses (3-4h)
    2. Design consumption log schema (query, results returned, results used by agent) (1-2h)
    3. Collect initial data and analyze patterns (2-3h)
    4. Generate pattern report with >=5 identified consumption categories (2-3h)
- [x] T005a [P] Expand importance signal vocabulary in `trigger-matcher.ts` — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") from true-mem's 8-category vocabulary [2-4h] — TM-08 (REQ-S1-005)
<!-- /ANCHOR:phase-4 -->

---

## Phase 5: Dark-Run and Verification

- [x] T005 Enable R4 in dark-run mode — three-measurement sequence: (a) Sprint 0 baseline MRR@5, (b) R4-only with A7 at 0.1x, (c) R4+A7 with A7 at 0.25-0.3x; verify MRR@5 delta >+2% and no single memory >60% presence [included] {T002, T003, T003a, T004, T005a} — R4 (REQ-S1-001)
  - WHY sequential: R4 and A7 are both graph-derived signals; dual activation conflates attribution. Sequential passes add one extra eval run but provide clean causal data for rollback decisions.
- [x] T-FS1 Feature flag sunset review at Sprint 1 exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T005} — NFR-O01/O02/O03
- [x] T006 [GATE] Sprint 1 exit gate verification [0h] {T001, T002, T003, T003a, T004, T005, T005a, T-FS1}
  - [x] R4 MRR@5 delta >+2% absolute
  - [x] No single memory >60% of dark-run results
  - [x] Edge density measured; R10 escalation decision documented
  - [x] G-NEW-2 instrumentation active

---

## Phase 6: PI-A3 — Pre-Flight Token Budget Validation

- [x] T007 [P] Implement pre-flight token budget validation — estimate total tokens across candidate result set before response assembly; truncate to highest-scoring candidates if total exceeds configured budget; handle `includeContent=true` single-result overflow with summary fallback; log all overflow events (query_id, candidate_count, total_tokens, budget_limit, truncated_to_count) to eval infrastructure (`hybrid-search.ts` or result assembler) [4-6h] — PI-A3
  - Truncation strategy: greedy highest-scoring first (never round-robin)
  - Single-result budget overflow: return summary, not raw truncated content
  - Overflow log extends R-004 baseline scoring benchmark dataset

---

## Phase 7: PI-A5 — Verify-Fix-Verify Memory Quality Loop (Deferred from Sprint 0)

> **Source**: REQ-057 (PI-A5). Deferred from Sprint 0 per Ultra-Think Review REC-09.

- [x] T008 [P] [W-A] Implement verify-fix-verify memory quality loop — compute quality score post-save; auto-fix if <0.6; reject after 2 retries; log quality metrics to eval infrastructure [12-16h] — PI-A5/REQ-057
  - Quality score computation: composite of trigger phrase coverage, anchor format, token budget, content coherence
  - Auto-fix strategies: re-extract triggers, normalize anchors, trim content to budget
  - Rejection logging: track rejection rate per spec folder for drift monitoring

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T008 (including T003a and T005a) marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Sprint 1 exit gate (T006) passed
- [x] 18-25 new tests added and passing
- [x] 158+ existing tests still passing
- [x] Feature flag `SPECKIT_DEGREE_BOOST` enabled (or decision to keep disabled documented)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T001 | T010 | Typed-weighted degree computation (R4) |
| T002 | T010 | Integrate degree as 5th RRF channel (R4) |
| T003 | T011 | Measure edge density |
| T003a | T010a | Co-activation boost strength (A7) |
| T004 | T012 | Agent-as-consumer UX analysis (G-NEW-2) |
| T005a | T055 | Signal vocabulary expansion (TM-08) |
| T005 | T013 | Enable R4 dark-run verification |
| T-FS1 | T-FS1 | Feature flag sunset review (Sprint 1 exit) |
| T006 | T014 | Sprint 1 exit gate verification |
| T007 | PI-A3 | Pre-flight token budget validation (PI-A3) |
| T008 | PI-A5 | Verify-fix-verify memory quality loop (PI-A5) |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
- **Predecessor Tasks**: See `../001-sprint-0-measurement-foundation/tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 2 of 8
- 11 tasks across 7 phases
- Phase 1: Degree computation (T001)
- Phase 2: RRF integration (T002)
- Phase 3: Measurement — edge density + co-activation (T003, T003a)
- Phase 4: Agent UX + signal vocabulary (T004, T005a)
- Phase 5: Dark-run verification + feature flag sunset + exit gate (T005, T-FS1, T006)
- Phase 6: PI-A3 token budget validation (T007)
- Phase 7: PI-A5 verify-fix-verify memory quality loop (T008)
-->
