---
title: "Tasks: Sprint 0 — Measurement Foundation"
description: "Task breakdown for Sprint 0: graph ID fix, chunk collapse, eval infrastructure, BM25 baseline"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "sprint 0 tasks"
  - "measurement foundation tasks"
  - "eval infrastructure tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Sprint 0 — Measurement Foundation

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 0: Pre-Foundation

- [x] T000a [P] Record pre-Sprint-0 performance baseline — current p95 search latency, memory count, existing system behavior snapshot [1-2h] — Baseline
- [x] T000b [P] Establish feature flag governance rules — document 6-flag max, 90-day lifespan, naming convention, monthly sunset audit process, and INCONCLUSIVE state (extend measurement window by max 14 days, one extension per flag, mandatory hard-deadline decision date) [1-2h] — NFR-O01/O02/O03
  - B8 signal ceiling: max 12 active scoring signals until R13 automated eval; escape clause requires R13 evidence of orthogonal value
- [x] T000c [P] Audit `search-weights.json` — verify `maxTriggersPerMemory` status, smart ranking section behavior [1-2h] — OQ-003
- [x] T000d [P] Curate diverse ground truth query set — manually create ≥15 natural-language queries covering: graph relationship queries ("what decisions led to X?"), temporal queries ("what was discussed last week?"), cross-document queries ("how does A relate to B?"), and hard negatives; minimum ≥5 per intent type, ≥3 complexity tiers (simple factual, moderate relational, complex multi-hop) [2-3h] — G-NEW-1/G-NEW-3
  - Acceptance: query set JSON with `intent_type`, `complexity_tier`, `expected_result_ids` fields per query
  - Feeds into T007 synthetic ground truth generation and T008 BM25 baseline

---

## Phase 1: Bug Fixes (Track 1)

- [x] T001 [P] Fix graph channel ID format — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151) [3-5h] — G1 (REQ-S0-001)
  - Acceptance: Graph hit rate > 0% in retrieval telemetry; parseInt or regex extraction verified at both locations
  - Implementation hint: Search for `mem:${` in `graph-search-fn.ts`; replace with numeric extraction `parseInt(edgeId)` or equivalent
  - Verify: Unit test with known edge IDs confirming numeric output
- [x] T002 [P] Fix chunk collapse conditional — dedup on ALL code paths including `includeContent=false` (`memory-search.ts`) [2-4h] — G3 (REQ-S0-002)
  - Acceptance: No duplicate chunk rows in default search mode; tested via both `includeContent` paths
  - Implementation hint: Bug is at the call site (~line 1002 in `memory-search.ts`), not the function definition (~line 303). The conditional gating skips dedup when `includeContent=false`.
  - Verify: Query returning parent+chunk memories shows no duplicates regardless of `includeContent` flag
- [x] T003 [P] Add fan-effect divisor to co-activation scoring (`co-activation.ts`) [1-2h] — R17 (REQ-S0-005)
  - Acceptance: Hub domination reduced; co-activation result diversity improved
  - Implementation hint: Apply divisor `1 / sqrt(neighbor_count)` or similar to reduce score contribution from highly-connected nodes
  - Verify: No division by zero; output capped to prevent negative scores
- [x] T054 [P] Add SHA256 content-hash fast-path dedup in `memory-save.ts` — compute hash BEFORE embedding generation; O(1) lookup rejects exact duplicates within same `spec_folder`; no false positives on distinct content [2-3h] — TM-02 (REQ-S0-006) _(Note: T054 numbering is a cross-reference to parent spec task TM-02; kept for traceability)_
  - Acceptance: Exact duplicate saves rejected without embedding generation; distinct content passes
  - Implementation hint: Use Node.js `crypto.createHash('sha256')` on file content; store hash in `memory_index` table; check before embedding API call
  - Verify: Re-save identical content → skip; modify 1 character → proceed to embed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Eval Infrastructure (Track 2)

- [x] T004 Create `speckit-eval.db` with 5-table schema: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth`, `eval_metric_snapshots` [8-10h] — R13-S1 (REQ-S0-003)
- [x] T004b Implement R13 observer effect mitigation — health check measuring search p95 with eval logging on vs off; trigger if >10% increase [2-4h] {T004} — D4 (REQ-S0-003)
- [x] T005 Add logging hooks to search, context, and trigger handlers [6-8h] {T004} — R13-S1 (REQ-S0-003)
- [x] T006 Implement core metric computation: MRR@5, NDCG@10, Recall@20, Hit Rate@1 + 5 diagnostic metrics + ceiling/proxy metrics [14-21h] {T004} — R13-S1 (REQ-S0-003)
  - [x] T006a Inversion Rate — count pairwise ranking inversions vs ground truth [1h]
  - [x] T006b Constitutional Surfacing Rate — % of queries where constitutional memories appear in top-K [1h]
  - [x] T006c Importance-Weighted Recall — Recall@20 with tier weighting (constitutional=3x, critical=2x, important=1.5x) [1-2h]
  - [x] T006d Cold-Start Detection Rate — % of queries where memories <48h old surface when relevant [1h]
  - [x] T006e Intent-Weighted NDCG — NDCG@10 with intent-type-specific relevance weights [2-3h]
  - [x] T006-checkpoint [GATE] Intermediate validation — verify T006a–T006e produce expected output on a fixed test case with known ground truth values (e.g., query with known relevant memories at known ranks → compute expected MRR@5, verify match within ±0.01); resolve discrepancies before T006f/T006g [1h]
  - [x] T006f Full-Context Ceiling Evaluation — send ALL memory titles/summaries to LLM, record MRR@5 as theoretical ceiling metric; interpret via 2x2 matrix with BM25 baseline [4-6h]
  - [x] T006g Quality Proxy Formula — implement automated regression metric: qualityProxy = avgRelevance*0.40 + topResult*0.25 + countSaturation*0.20 + latencyPenalty*0.15 [4-6h]
<!-- /ANCHOR:phase-2 -->

---

## Phase 2b: Agent Consumption Pre-Analysis

- [x] T007b [P] G-NEW-2 pre-analysis: Lightweight agent consumption pattern survey — analyze how AI agents currently consume memory search results (query patterns, selection behavior, ignored results). Examine recent agent query logs, CLAUDE.md routing patterns, and skill definitions. Document top 5-10 consumption patterns. Findings feed into ground truth query design (T007). [3-4h] — G-NEW-2 pre-analysis
  - Acceptance: Pattern report produced with >=5 identified consumption patterns
  - Implementation hint: Check `memory_search` call sites in `.opencode/skill/` and `.claude/agents/` for query construction patterns
  - Fallback: If no agent logs available, enumerate patterns manually from CLAUDE.md and skill advisor routing logic

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Baseline

- [x] T007 Generate synthetic ground truth from trigger phrases — minimum 100 query-relevance pairs (50 minimum for initial baseline metrics, >=100 required for BM25 contingency decision per REQ-S0-004) with DIVERSITY REQUIREMENT: >=5 queries per intent type (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision), >=3 query complexity tiers (simple single-concept, moderate multi-concept, complex cross-document). Include >=30 manually curated natural-language queries NOT derived from trigger phrases (per REQ-S0-004 hard gate, raised per REC-10). Incorporate G-NEW-2 pre-analysis findings into query design. [2-4h] {T004, T007b} — G-NEW-1 / G-NEW-3 (REQ-S0-004)
  - Acceptance: 100+ queries with intent type and complexity tier tags; diversity thresholds met; >=30 queries MUST be manually curated natural-language queries NOT derived from trigger phrases (per REQ-S0-004 hard gate); document manual vs synthetic query split in query distribution table
  - Include >=3 hard negative queries (queries that should return NO relevant results)
  - Sub-steps for >10h total baseline track:
    1. Generate intent-typed query templates from trigger phrases
    2. Add complexity-tier variations (simple/moderate/complex)
    3. Add hard negatives and cross-document queries
    4. Validate diversity thresholds before proceeding to T008
- [x] T013 Hand-calculate MRR@5 for 5 randomly selected queries — compare hand-calculated values to R13 computed values (tolerance ±0.01); resolve ALL discrepancies before proceeding to T008 [2-3h] {T006, T007} — REQ-S0-007 (eval-the-eval validation)
  - Acceptance: Hand-calculated MRR@5 matches R13 output within ±0.01 for all 5 queries; discrepancies documented and resolved
  - Implementation hint: Select 5 queries randomly from ground truth corpus; for each query, manually rank relevant memories and compute MRR@5 = (1/5) * Σ(1/rank_i); compare to `eval_metric_snapshots` table
  - Verify: Discrepancy log produced; all 5 queries within tolerance
- [x] T008 Run BM25-only baseline measurement and record MRR@5 [4-6h] {T006, T007, T013} — G-NEW-1 (REQ-S0-004)
  - Acceptance: BM25 MRR@5 recorded; contingency decision matrix evaluated (>=80% PAUSE, 50-80% rationalize, <50% PROCEED)
  - Implementation hint: Use FTS5-only path in `memory-search.ts`; disable vector, graph, and trigger channels via flags
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Verification

- [x] T-FS0 Feature flag sunset review at Sprint 0 exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T008} — NFR-O01/O02/O03
- [x] T009 [GATE] Sprint 0 exit gate verification [0h] {T000a, T000b, T000c, T000d, T001, T002, T003, T004, T005, T006, T007, T007b, T008, T013, T054, T-FS0}
  - [x] Graph hit rate > 0%
  - [x] No duplicate chunk rows in default search
  - [x] Baseline metrics for 100+ queries computed and stored
  - [x] Ground truth diversity: >=5 queries per intent type, >=3 query complexity tiers (HARD gate)
  - [x] BM25 baseline MRR@5 recorded
  - [x] BM25 contingency decision made and documented
  - [x] Active feature flag count <=6 verified at sprint exit
  - [x] G-NEW-2 pre-analysis pattern report produced

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T000a-T000d, T001-T009, T007b, T013, and T054 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Sprint 0 exit gate (T009) passed
- [x] 20-30 new tests added and passing
- [x] 158+ existing tests still passing
- [x] BM25 contingency decision recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T000a | T000a | Pre-Sprint-0 performance baseline |
| T000b | T000b | Feature flag governance rules |
| T000c | T000c | Audit search-weights.json |
| T000d | T000d | Curate diverse ground truth query set |
| T001 | T001 | Fix graph channel ID format (G1) |
| T002 | T002 | Fix chunk collapse conditional (G3) |
| T003 | T003 | Fan-effect divisor for co-activation (R17) |
| T054 | T054 | SHA256 content-hash dedup (TM-02) |
| T004 | T004 | Create speckit-eval.db (R13-S1) |
| T004b | T004b | R13 observer effect mitigation (D4) |
| T005 | T005 | Logging hooks for search handlers (R13-S1) |
| T006 | T006 | Core metric computation (R13-S1) |
| T007b | T000e | G-NEW-2 agent consumption pre-analysis |
| T007 | T007 | Synthetic ground truth generation (G-NEW-1) |
| T013 | T008b | Eval-the-eval validation |
| T008 | T008 | BM25-only baseline measurement |
| T-FS0 | T-FS0 | Feature flag sunset review (Sprint 0 exit) |
| T009 | T009 | Sprint 0 exit gate verification |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 1 of 8
- 10 tasks across 4 phases (PI-A5 deferred to Sprint 1 per REC-09)
- Track 1 (Bug Fixes): T001-T003 parallelizable
- Track 2 (Eval): T004-T008, T013 sequential
- T009: Sprint exit gate
-->
