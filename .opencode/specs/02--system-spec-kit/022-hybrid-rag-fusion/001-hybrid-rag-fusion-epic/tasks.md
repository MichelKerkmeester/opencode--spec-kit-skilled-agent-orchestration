# Consolidated tasks
<!-- SPECKIT_TEMPLATE_SOURCE: consolidated-epic-merge | v1 -->

Consolidated from the following source docs:
- sources/000-feature-overview/tasks.md
- sources/002-hybrid-rag-fusion/tasks.md
- sources/006-hybrid-rag-fusion-logic-improvements/tasks.md

<!-- AUDIT-2026-03-08: Historical folder name mapping for consolidated source references below.
  Pre-consolidation name         → Current folder
  002-hybrid-rag-fusion          → 002-indexing-normalization
  003-index-tier-anomalies       → 002-indexing-normalization
  004-frontmatter-indexing       → 002-indexing-normalization
  006-hybrid-rag-fusion-logic-improvements → content merged into this epic (001-hybrid-rag-fusion-epic)
-->

## Source: 000-feature-overview

---
title: "Tasks: Hybrid RAG Fusion Refinement"
description: "100+ tasks across 8 metric-gated sprints (355-536h S0-S6, 400-598h S0-S7; +52-80h test-writing effort = 407-616h S0-S6, 452-678h S0-S7) organized by workstream with sprint gate verification tasks, feature flag sunset reviews, and ground truth diversification."
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "hybrid rag tasks"
  - "sprint tasks"
  - "retrieval refinement tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
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
| `[GATE]` | Sprint exit gate verification |

**Task Format**: `T### [W-X] Description (subsystem) [effort] {deps} — REC-ID`

**Workstream Tags**: W-A (Quick Wins + Scoring), W-B (Graph), W-C (Measurement + Feedback), W-D (Pipeline + Spec-Kit), W-E (Eval Infrastructure), W-G (Graph Research), W-I (Integration Testing), W-Q (Quality Validation)

> **Note:** GATE and GATE-PRE tasks intentionally omit workstream tags as they are cross-cutting verification activities.

**NFR-O01 flag budget (canonical wording):** target <=6 active flags at each sprint gate, hard ceiling <=8 at all times (historical S4-S5 peak = 7).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:sprint-0 -->
## Sprint 0: Epistemological Foundation [56-89h]
> *Effort note: +8-15h optional for full corpus labeling per T008b*

> **Goal**: Establish that retrieval is measurable. BLOCKING — nothing proceeds without exit gate.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 006-measurement-foundation -->

- [x] T000a [W-C] Record pre-Sprint-0 performance baseline — current p95 search latency, memory count, existing system behavior snapshot [1-2h] {} — Baseline
- [x] T000b [W-A] Establish feature flag governance rules — document NFR-O01 flag budget (target <=6 active flags per gate, hard ceiling <=8), 90-day lifespan, naming convention, monthly sunset audit process, and INCONCLUSIVE state (extend measurement window by max 14 days, one extension per flag, mandatory hard-deadline decision date) [1-2h] {} — NFR-O01/O02/O03
  - B8 signal ceiling: max 12 active scoring signals until R13 automated eval; escape clause requires R13 evidence of orthogonal value
- [x] T000c [W-C] Audit `search-weights.json` — verify `maxTriggersPerMemory` status, smart ranking section behavior [1-2h] {} — OQ-003
- [x] T001 [W-B] Fix graph channel ID format — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151) [3-5h] {} — G1
  - File: `src/tools/search/graph-search-fn.ts` lines 110, 151
  - Acceptance: `channelAttribution.graph` returns numeric memory IDs; graph channel hit rate >0% in eval queries
- [x] T002 [W-A] Fix chunk collapse conditional — dedup on all code paths (`memory-search.ts`) [2-4h] {} — G3
  - File: `src/tools/search/memory-search.ts`
  - Acceptance: no duplicate chunk rows appear in any search result; verified by unit test with multi-chunk memory
- [x] T003 [W-A] Add fan-effect divisor to co-activation scoring (`co-activation.ts`) [1-2h] {} — R17
  - File: `src/tools/search/co-activation.ts`
  - Acceptance: hub memories (degree >10) show reduced co-activation boost; divisor formula = `1 / sqrt(degree)`
- [x] T004 [W-C] Create `speckit-eval.db` with 5-table schema (eval_queries, eval_channel_results, eval_final_results, eval_ground_truth, eval_metric_snapshots) [8-10h] {} — R13-S1
  - Sub-steps: (a) schema design with foreign keys and indexes [2h], (b) migration script with rollback [2h], (c) connection pool separate from primary DB [2h], (d) seed data insertion helpers [2h]
  - Set `PRAGMA foreign_keys = ON` (following main DB pattern at `vector-index-impl.ts:1181`)
  - File: new `src/eval/speckit-eval-schema.ts`
  - Acceptance: eval DB created, schema validated, zero impact on primary `speckit.db` read/write paths
- [x] T004a [W-E] Schema version table for eval DB — add `schema_version` table to speckit-eval.db following main DB pattern [1-2h] {T004} — R13-S1
  - Pattern reference: `vector-index-impl.ts:1106-1131`
  - Include migration logic matching SCHEMA_VERSION constant approach
- [x] T004b [W-C] Implement R13 observer effect mitigation — search p95 health check with eval logging on/off [2-4h] {T004} — D4/REQ-036
  - Acceptance: p95 latency increase ≤10% with eval logging enabled vs disabled; health check script runnable on demand
- [x] T005 [W-C] Add logging hooks to `memory_search`, `memory_context`, `memory_match_triggers` handlers [6-8h] {T004} — R13-S1
  - Files: `src/tools/search/memory-search.ts`, `src/tools/context/memory-context.ts`, `src/tools/triggers/memory-match-triggers.ts`
  - Acceptance: all three handlers log query, channel scores, and final result IDs to `speckit-eval.db`
- [x] T006 [W-C] Implement core metric computation: MRR@5, NDCG@10, Recall@20, Hit Rate@1 + 5 diagnostic metrics + full-context ceiling (A2) + quality proxy formula (B7/REQ-035) [14-21h] {T004} — R13-S1
  - Sub-steps: (a) core 4 metrics [6h], (b) 5 diagnostic metrics (Inversion Rate, Constitutional Surfacing Rate, Importance-Weighted Recall, Cold-Start Detection Rate, Intent-Weighted NDCG) [4h], (c) A2 full-context ceiling [2h], (d) B7 quality proxy formula [2h], (e) metric snapshot persistence [2h]
  - Acceptance: all metrics computable from `speckit-eval.db` data; metric snapshot stored after each eval run
- [x] T000d [W-C] Curate diverse ground truth query set — manually create ≥15 natural-language queries covering: graph relationship queries ("what decisions led to X?"), temporal queries ("what was discussed last week?"), cross-document queries ("how does A relate to B?"), and hard negatives; minimum ≥5 per intent type, ≥3 complexity tiers (simple factual, moderate relational, complex multi-hop) [2-3h] {} — G-NEW-1/G-NEW-3
  - Acceptance: query set JSON with `intent_type`, `complexity_tier`, `expected_result_ids` fields per query
  - Feeds into T007 synthetic ground truth generation and T008 BM25 baseline
- [x] T000e [W-C] G-NEW-2 pre-analysis: Agent consumption pattern survey — lightweight analysis of how AI agents currently consume memory search results: What query patterns do agents use? What results do they select vs ignore? What retrieval failures are common? Document findings in scratch/agent-consumption-survey.md [3-4h] {} — G-NEW-2
  - Findings feed into ground truth design (T007) and R13 eval query design (T004-T006)
  - Full G-NEW-2 analysis (8-12h) remains in Sprint 1 (T012); this is scoping pre-work only
- [x] T000g [W-E] Latency baseline recording — record latency baselines in R13 eval logging framework [2-3h] {T001, T003} — Baseline
  - Measure: p50/p95/p99 for search, save, health endpoints
  - Output: baseline_latency.json committed to eval/ directory
- [x] T007 [W-C] Generate synthetic ground truth from trigger phrases (Phase A) — expand ground truth corpus using T000d manual queries as seed set [2-4h] {T004, T000d} — G-NEW-1/G-NEW-3
- [x] T008 [W-C] Run BM25-only baseline measurement and record results [4-6h] {T006, T007} — G-NEW-1
- [x] T008b [W-C] **Eval-the-eval validation** — hand-calculate MRR@5 for 5 randomly selected queries, compare to R13 computed values; verify match within ±0.01; investigate any discrepancy before using R13 output for roadmap decisions [2-3h] {T006, T007} — REQ-052
  - Acceptance: hand-calculated MRR@5 matches R13 output for all 5 queries; discrepancies documented and resolved
  - Rationale: R13 becomes the decision engine for all subsequent sprints — verifying its output correctness is mandatory before trusting its metrics for the BM25 contingency decision
  - **Effort note**: CHK-S0F3 (p<0.05 on >=100 diverse queries) requires manual relevance labeling not included in the T008b estimate (2-3h). Expect an additional 8-15h for curating, labeling, and validating the full 100+ query corpus with verified relevance judgments.
- [x] T054 [W-A] Implement content-hash fast-path dedup in memory_save handler — SHA256 check before embedding generation, reject exact duplicates in same spec_folder [2-3h] {} — TM-02/REQ-039
- [x] T-FS0 [W-A] Feature flag sunset review at Sprint 0 exit — review all active feature flags; flags from completed work with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding to Sprint 1 [0.5-1h] {T008} — NFR-O01/O02/O03
- [x] T009 [GATE] Sprint 0 exit gate verification: graph hit rate >0%, chunk dedup verified, baseline metrics for 50+ queries, BM25 baseline recorded, BM25 contingency decision (requires statistical significance p<0.05 on >=100 diverse queries), eval-the-eval validation passed (T008b), ground truth diversity verified (≥15 manual queries, ≥5/intent, ≥3 tiers), latency baselines recorded, NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T000a-T008, T008b, T000d, T000e, T000g, T004a, T054, T-FS0}
<!-- /ANCHOR:sprint-0 -->

---

<!-- ANCHOR:sprint-1 -->
## Sprint 1: Graph Signal Activation [43-62h]
> *Effort note: includes PI-A5 12-16h and PI-A3 4-6h deferred from S0*

> **Goal**: Make graph the system's differentiating signal.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 011-graph-signal-activation -->

- [x] T010 [W-B] Implement typed-weighted degree as 5th RRF channel with edge type weights, MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50 behind `SPECKIT_DEGREE_BOOST` flag [12-16h] {T009} — R4
  - T010a [P] Increase co-activation boost strength from 0.1x to 0.25-0.3x [2-4h] {T003} — A7/REQ-032
- [x] T011 [W-C] Measure edge density from R13 data (edges/node metric) [2-3h] {T009} — R4 dependency check
- [x] T012 [W-C] Agent-as-consumer UX analysis + consumption instrumentation [8-12h] {T009} — G-NEW-2
- [x] T055 [P] [W-A] Expand importance signal vocabulary in trigger-matcher.ts — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") [2-4h] {T009} — TM-08/REQ-045

> **Review Note (REF-057):** Consider moving G-NEW-2 pre-analysis to Sprint 0 to inform R13 eval design. Currently in Sprint 1 — evaluate during Sprint 0 planning.

- [x] T013 [W-B] Enable R4 if dark-run passes hub domination and MRR@5 criteria [0h] {T010, T011} — R4
- [x] T-FS1 [W-A] Feature flag sunset review at Sprint 1 exit — review all active feature flags; flags from completed sprints with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding to Sprint 2 [0.5-1h] {T013} — NFR-O01/O02/O03
- [x] T014 [GATE] Sprint 1 exit gate verification: R4 MRR@5 delta >+2%, edge density measured, no single memory >60% presence, G-NEW-2 instrumentation active, NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T010-T013, PI-A5, PI-A3, T-FS1}
<!-- /ANCHOR:sprint-1 -->

---

<!-- ANCHOR:sprint-2 -->
## Sprint 2: Scoring Calibration + Operational Efficiency [28-43h]

> **Goal**: Resolve dual scoring magnitude mismatch; enable zero-cost re-indexing.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 012-scoring-calibration -->

- [x] T015 [P] [W-A] Implement embedding cache (`embedding_cache` table) for instant rebuild [8-12h] {T009} — R18
- [x] T016 [P] [W-A] Implement cold-start boost with exponential decay (12h half-life) behind `SPECKIT_NOVELTY_BOOST` flag [3-5h] {T009} — N4
- [x] T017 [W-A] Investigate double intent weighting (G2) — determine if intentional design [4-6h] {T009} — G2
- [x] T018 [W-A] Implement score normalization (both RRF and composite to [0,1] scale) [4-6h] {T017} — Score calibration
- [x] T019 [W-C] Verify dark-run results for N4 and score normalization via R13 [included] {T016, T018}
- [x] T020a [P] [W-A] Investigate RRF K-value sensitivity — grid search K ∈ {20, 40, 60, 80, 100} [2-3h] {T009} — FUT-5
- [x] T056 [P] [W-A] Implement interference scoring signal — add interference_score column, compute at index time (count similar memories in spec_folder), apply as -0.08 weight in composite scoring behind `SPECKIT_INTERFERENCE_SCORE` flag [4-6h] {T009} — TM-01/REQ-040
- [x] T057 [P] [W-A] Implement classification-based decay policies — modify fsrs-scheduler.ts to apply decay multipliers by context_type (decisions: no decay, research: 2x stability) and importance_tier (critical: no decay, temporary: 0.5x stability) [3-5h] {T009} — TM-03/REQ-041
- [x] T-FS2 [W-A] Feature flag sunset review at Sprint 2 exit — review all active feature flags; flags from completed sprints with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding to Sprint 3 [0.5-1h] {T019} — NFR-O01/O02/O03
- [x] T020 [GATE] Sprint 2 exit gate verification: cache hit >90%, N4 dark-run: new memories (<48h) appear in top-10 when query-relevant without displacing memories ranked ≥5 in baseline, G2 resolved, score distributions normalized, NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T015-T019, T020a, T056, T057, PI-A1, T-FS2}
<!-- /ANCHOR:sprint-2 -->

---

<!-- ANCHOR:sprint-3 -->
## Sprint 3: Query Intelligence + Fusion Alternatives [34-53h]

> **Goal**: Add query routing and evaluate fusion alternatives.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 013-query-intelligence -->

- [x] T021 [P] [W-D] Implement query complexity router (3-tier: simple/moderate/complex, min 2 channels) behind `SPECKIT_COMPLEXITY_ROUTER` flag [10-16h] {T020} — R15
- [x] T022 [P] [W-D] Implement Relative Score Fusion parallel to RRF (all 3 fusion variants) behind `SPECKIT_RSF_FUSION` flag [10-14h] {T020} — R14/N1
- [x] T023 [W-D] Implement channel minimum-representation constraint (post-fusion, quality floor 0.2) behind `SPECKIT_CHANNEL_MIN_REP` flag [6-10h] {T020} — R2
- [x] T024 [W-C] Run shadow comparison: R14/N1 vs RRF on 100+ queries, compute Kendall tau [included] {T022}
- [x] T025a [W-B] Implement confidence-based result truncation — adaptive top-K cutoff [5-8h] {T021} — R15 extension
- [x] T025b [P] [W-B] Implement dynamic token budget allocation by complexity tier [3-5h] {T021} — FUT-7
- [x] T-FS3 [W-A] Feature flag sunset review at Sprint 3 exit — review all active feature flags; flags from completed sprints with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding to Sprint 4 [0.5-1h] {T024} — NFR-O01/O02/O03
- [x] T025-GATE [GATE] Sprint 3 exit gate verification: R15 p95 <30ms simple, RSF Kendall tau computed, R2 precision within 5%, NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T021-T024, T025a, T025b, PI-B3, T-FS3}

**OFF-RAMP: After T025-GATE, evaluate "good enough" thresholds (MRR@5 >= 0.7, constitutional surfacing >= 95%, cold-start detection >= 90%). If all met, Sprints 4-7 are optional.**
<!-- /ANCHOR:sprint-3 -->

---

<!-- ANCHOR:sprint-4 -->
## Sprint 4: Feedback Loop + Chunk Aggregation [73-111h]

> **Goal**: Close the feedback loop; aggregate chunk scores safely.
> **Prerequisite**: R13 must have completed at least 2 full eval cycles.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 014-feedback-and-quality -->
> **Effort note**: Header total (73-111h) includes sub-task effort not individually listed in root (e.g., T026a, T027c, T027d, T028a) and T-IP-S4 integration testing. Sprint 4 child plan estimates 64-97h. See child tasks.md for authoritative detailed breakdown.

- [ ] T025c [GATE-PRE] Create checkpoint: `memory_checkpoint_create("pre-r11-feedback")` [0h] {T025-GATE} — Safety gate
- [ ] T026 [P] [W-A] Implement MPAB chunk-to-memory aggregation with N=0/N=1 guards behind `SPECKIT_DOCSCORE_AGGREGATION` flag [8-12h] {T025-GATE} — R1
  - T026a Preserve chunk ordering within documents during reassembly [2-4h] — B2/REQ-034
- [x] T027 [W-C] Implement learned relevance feedback with separate `learned_triggers` column and all 10 safeguards behind `SPECKIT_LEARN_FROM_SELECTION` flag [16-24h] {T025-GATE, T026, T028, R13 2-cycle prerequisite} — R11 — completed in Sprint 4 child
  - Sub-steps: (a) schema migration for `learned_triggers` column [2h], (b) selection tracking pipeline [4h], (c) trigger extraction from selections [4h], (d) 10 safeguards implementation: (1) Denylist 100+ common terms, (2) Rate cap 3 promotions per 8-hour window, (3) TTL 30-day decay for promoted terms, (4) FTS5 isolation (promoted terms in separate column), (5) Noise floor: top-3 candidate threshold, (6) Rollback mechanism for promoted terms, (7) Provenance/audit log for all promotions, (8) Shadow period: 1 week before activation, (9) Eligibility: 72h minimum observation before promotion, (10) Sprint gate review of promotion metrics [8h], (e) shadow logging before activation [2h]
  - Prerequisite check: verify R13 has ≥2 complete eval cycles AND ≥200 query-selection pairs before enabling mutations
  - T027c Implement memory importance auto-promotion (threshold-based tier promotion on validation count) [5-8h]
  - T027d Activate negative feedback confidence signal (demotion multiplier, floor=0.3) [4-6h] — A4/REQ-033
- [x] T027a [W-C] Implement G-NEW-3 Phase B: implicit feedback collection from user selections for ground truth [4-6h] {T025-GATE, R13 2-cycle prerequisite} — G-NEW-3 — completed in Sprint 4 child
- [ ] T027b [W-C] Implement G-NEW-3 Phase C: LLM-judge ground truth generation — minimum 200 query-selection pairs before R11 activation [4-6h] {T027a} — G-NEW-3
- [ ] T028 [W-C] Implement R13-S2: shadow scoring + channel attribution + ground truth Phase B [15-20h] {T025-GATE} — R13-S2
  - T028a Implement Exclusive Contribution Rate metric per channel [2-3h]
- [ ] T058 [W-A] Implement pre-storage quality gate in memory_save handler — structural validation + content quality scoring (title, triggers, length, anchors, metadata, signal density) + semantic near-duplicate detection (>0.92 similarity = reject) behind `SPECKIT_SAVE_QUALITY_GATE` flag [6-10h] {T025-GATE} — TM-04/REQ-042
- [ ] T059 [W-A] Implement reconsolidation-on-save pipeline — after embedding generation, check top-3 similar memories: >=0.88 = merge (increment frequency), 0.75-0.88 = replace (add supersedes edge), <0.75 = store new; behind `SPECKIT_RECONSOLIDATION` flag with mandatory checkpoint [6-10h] {T025-GATE, T026, T028} — TM-06/REQ-043
- [ ] T029 [W-C] Verify R1 dark-run (MRR@5 within 2%, N=1 no regression) [included] {T026}
- [ ] T030 [W-C] Analyze R11 shadow log (noise rate < 5%) [included] {T027}
- [ ] T-IP-S4 [W-Q] Intent-pattern integration testing — validate intent-pattern scoring interaction [1-2h] {T026} — Integration
  - Sprint: S4 | Priority: Medium
  - Depends on: T026 (intent-aware retrieval)
- [ ] T-FS4 [W-A] Feature flag sunset review at Sprint 4 exit — review all active feature flags; flags from completed sprints with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding to Sprint 5 [0.5-1h] {T030} — NFR-O01/O02/O03
- [ ] T031 [GATE] Sprint 4 exit gate verification: R1 within 2%, R11 noise <5%, R13-S2 operational, Sprint 4a (R1+R13-S2+TM-04) verified BEFORE Sprint 4b (R11+TM-06), NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T026-T030, T058, T059, T-IP-S4, T-FS4}
<!-- /ANCHOR:sprint-4 -->

---

<!-- ANCHOR:sprint-5 -->
## Sprint 5: Pipeline Refactor + Spec-Kit Logic [68-98h]

> **Goal**: Modernize pipeline architecture; add spec-kit retrieval optimizations.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 015-pipeline-refactor -->

**Phase A (Pipeline): R6 — 40-55h**
- [x] T032 [W-D] Create checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` [0h] {T031} — completed in Sprint 5 child
- [x] T033 [W-D] Implement 4-stage pipeline refactor (Candidate → Fusion → Rerank → Filter) with Stage 4 "no score changes" invariant behind `SPECKIT_PIPELINE_V2` flag [40-55h] {T032} — R6 — completed in Sprint 5 child
  - Sub-steps: (a) Stage 1 Candidate Generation — extract candidate retrieval from existing code into isolated stage [10h], (b) Stage 2 Fusion — RRF/RSF fusion logic with intent weighting applied exactly once [10h], (c) Stage 3 Rerank — cross-encoder reranking with score normalization [10h], (d) Stage 4 Filter — result filtering/truncation with "no score changes" invariant enforced via assertion [10h], (e) integration testing against full eval corpus [5h]
  - Acceptance: 0 ordering differences vs current pipeline on eval corpus; Stage 4 assertion prevents score modification
- [x] T034 [W-C] Verify R6 dark-run: 0 ordering differences on full eval corpus [included] {T033} — completed in Sprint 5 child
- [x] T035 Verify all 158+ existing tests pass with PIPELINE_V2 enabled [included] {T033} — completed in Sprint 5 child

**Phase B (Search + Spec-Kit): 24-37h — Phase A must pass before starting**
- [x] T036 [P] [W-D] Implement spec folder pre-filter [5-8h] {T035} — R9 — completed in Sprint 5 child
- [x] T037 [P] [W-D] Implement embedding-based query expansion (suppressed when R15="simple") behind `SPECKIT_EMBEDDING_EXPANSION` flag [10-15h] {T035} — R12 — completed in Sprint 5 child
- [x] T038 [P] [W-D] Implement template anchor optimization [5-8h] {T035} — S2 — completed in Sprint 5 child
- [x] T039 [P] [W-D] Implement validation signals as retrieval metadata [4-6h] {T035} — S3 — completed in Sprint 5 child
- [x] T060 [P] [W-D] Implement dual-scope injection strategy — add memory auto-surface hooks at tool dispatch and compaction lifecycle points, with per-point token budgets [4-6h] {T035} — TM-05/REQ-044 — completed in Sprint 5 child
- [x] T-FS5 [W-A] Feature flag sunset review at Sprint 5 exit — review all active feature flags; flags from completed sprints with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding to Sprint 6 [0.5-1h] {T039} — NFR-O01/O02/O03 — completed in Sprint 5 child
- [x] T040 [GATE] Sprint 5 exit gate verification: R6 0 differences, 158+ tests pass, R9 cross-folder equivalent, R12 no latency degradation, NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T033-T039, PI-A4, PI-B1, PI-B2, T-FS5} — completed in Sprint 5 child
<!-- /ANCHOR:sprint-5 -->

---

<!-- ANCHOR:sprint-6 -->
## Sprint 6a: Practical Improvements [36-57h]

> **Goal**: Deliver practical retrieval quality improvements at any graph scale.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 016-indexing-and-graph -->

- [x] T040a [GATE-PRE] Create checkpoint: `memory_checkpoint_create("pre-graph-mutations")` [0h] {T040} — Safety gate — completed in Sprint 6 child
- [x] T041d [W-B] **MR10 mitigation: weight_history audit tracking** — add `weight_history` column or log weight changes to eval DB for N3-lite Hebbian modifications; enables rollback of weight changes independent of edge creation [2-3h] {T040} — MR10 — completed in Sprint 6 child
  - Acceptance: all N3-lite weight modifications logged with before/after values, timestamps, and affected edge IDs; rollback script can restore weights from history
  - Rationale: promoted from risk mitigation to required task — HARD GATE before any T042 sub-task
- [x] T043 [P] [W-D] Implement anchor-aware chunk thinning [10-15h] {T040} — R7 — completed in Sprint 6 child
- [x] T044 [P] [W-D] Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag [5-8h] {T040} — R16 — completed in Sprint 6 child
- [x] T046 [P] [W-D] Implement spec folder hierarchy as retrieval structure [6-10h] {T040} — S4 — completed in Sprint 6 child
- [x] T042 [W-B] Implement N3-lite: contradiction scan + Hebbian strengthening with edge caps [9-14h] {T040, T041d} [HARD GATE — T041d MUST be complete before any T042 sub-task] — N3-lite — completed in Sprint 6 child
  - T042a Contradiction scan (cosine >0.85 + keyword negation) [3-4h]
  - T042b Hebbian edge strengthening (+0.05/cycle, caps) [2-3h]
  - T042c Staleness detection (90-day unfetched edges) [1-2h]
  - T042d Edge bounds enforcement (MAX_EDGES=20, auto cap 0.5) [1-2h]
  - T042e Contradiction cluster surfacing — surface all cluster members [2-3h]
- [ ] T-IP-S6 [W-I] Cross-index consistency validation — verify FTS5 and vector index consistency after re-indexing [1-2h] {T036} — Integration
  - Sprint: S6a | Priority: Medium
  - Depends on: T036 (index optimization)
- [ ] T-PI-S6 [W-I] PageIndex integration testing — end-to-end testing of PageIndex-derived scoring in production pipeline [2-4h] {PI-A1, PI-A4, PI-A5} — Integration
  - Sprint: S6a | Priority: Medium
  - Depends on: PI-A1, PI-A4, PI-A5
- [x] T-FS6a [W-A] Feature flag sunset review at Sprint 6a exit — review all active feature flags; flags from completed sprints with positive metrics: permanently enable and remove flag check; flags with negative/neutral metrics: remove entirely; flags with inconclusive metrics: extend measurement window by max 14 days (one extension per flag, mandatory hard-deadline decision date); enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) before proceeding [0.5-1h] {T042, T043, T044, T046} — NFR-O01/O02/O03 — completed in Sprint 6 child
- [x] T047a [GATE] Sprint 6a exit gate verification: R7 Recall@20 within 10%, R16 functional, S4 hierarchy functional, N3-lite contradiction detection, weight_history verified, NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T041d, T042-T044, T046, T-IP-S6, T-PI-S6, T-FS6a} — completed in Sprint 6 child

## Sprint 6b: Graph Sophistication [45-69h] (GATED)

> **Goal**: Deepen graph with centrality/community detection and entity extraction. GATED on feasibility spike.
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 016-indexing-and-graph -->
> **Entry gates**: Feasibility spike completed, OQ-S6-001 resolved, OQ-S6-002 resolved, REQ-S6-004 revisited

- [ ] T-S6B-GATE [GATE-PRE] Sprint 6b entry gate — feasibility spike completed, OQ-S6-001/002 resolved, REQ-S6-004 density-conditioned [0h] {T047a}
- [ ] T041 [W-B] Implement graph centrality + community detection (N2 items 4-6) [25-35h] {T-S6B-GATE, (soft: T-S6-SPIKE)} — N2
  - Soft dependency on T-S6-SPIKE: can build independently, incorporate spike findings if available (breaks T-S6-SPIKE <-> T041 cycle)
  - T041a N2a: Graph Momentum (temporal degree delta) [8-12h]
  - T041b N2b: Causal Depth Signal (max-depth path normalization) [5-8h]
  - T041c N2c: Community Detection (label propagation/Louvain) [12-15h]
- [ ] T045 [P] [W-B] Implement auto entity extraction (gated: only if density < 1.0) behind `SPECKIT_AUTO_ENTITIES` flag [12-18h] {T-S6B-GATE} — R10
- [ ] T-S6-SPIKE [W-G] Graph algorithm spike — research spike: evaluate graph traversal algorithms for causal chain optimization [8-16h] {T041} — Research
  - Sprint: S6b | Priority: High
  - Time-boxed investigation; output is recommendation document
  - Depends on: T041 (graph deepening baseline)
- [ ] T-FS6b [W-A] Feature flag sunset review at Sprint 6b exit — enforce NFR-O01 flag budget (target <=6 active, hard ceiling <=8) [0.5-1h] {T041, T045, T-S6-SPIKE} — NFR-O01/O02/O03
- [ ] T047b [GATE] Sprint 6b exit gate verification: N2 attribution >10% or density-conditional deferral, R10 FP <20% (if implemented), NFR-O01 flag budget met (target <=6 active; hard ceiling <=8) [0h] {T-S6B-GATE, T041, T045, T-S6-SPIKE, T-FS6b}
<!-- /ANCHOR:sprint-6 -->

---

<!-- ANCHOR:sprint-7 -->
## Sprint 7: Long Horizon [16-68h conditional]

> **Goal**: Address scale-dependent features and complete evaluation infrastructure.
> **Priority**: P1-P3 (conditional — P0/P1/P2/P3 items per child spec; all gated on scale thresholds)
> **Child folder**: `005-core-rag-sprints-0-to-8` <!-- was 017-long-horizon -->
> **Effort note**: 3 scenarios per child plan — minimal (16-22h), moderate (33-48h), full (48-68h). Root header uses conditional range.

- [x] T048 [P] [W-D] Implement memory summary generation (only if >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag [15-20h] {T047a} — R8 — completed in Sprint 7 child (SKIPPED — scale gate not met, 2411/5000)
- [x] T049 [P] [W-D] Implement smarter memory content generation [8-12h] {T047a} — S1 — completed in Sprint 7 child
- [x] T050 [P] [W-B] Implement cross-document entity linking [8-12h] {T047a} — S5 — completed in Sprint 7 child (SKIPPED — no entity infrastructure, Sprint 6b deferred)
- [x] T051 [W-C] Implement R13-S3: full reporting + ablation studies [12-16h] {T047a} — R13-S3 — completed in Sprint 7 child
- [x] T052 [W-C] Evaluate R5 (INT8 quantization) need based on memory count and latency [1-2h] {T047a} — R5 decision — completed in Sprint 7 child (NO-GO, all thresholds below activation)
- [x] T-FS7 [W-D] Sprint 7 feature flag sunset: Final audit of all remaining flags, graduate permanent features, remove flag code for completed features [2-4h] {T048-T052} — completed in Sprint 7 child (61 flags inventoried; 27 GRADUATE, 9 REMOVE, 3 KEEP)
- [x] T053 [GATE] Sprint 7 exit gate verification: R8 summary pre-filtering verified (if activated), S1 content generation matches template schema >=95% automated validation, S5 entity links verified, R13-S3 dashboard operational, R5 activation decision documented, final feature flag sunset audit completed [0h] {T048-T052, T-FS7, (soft: T-TEST-S7)} — completed in Sprint 7 child
  - Soft dependency on T-TEST-S7: gate can proceed with test results available, tests can finalize after gate (breaks T-TEST-S7 <-> T053 cycle)
<!-- /ANCHOR:sprint-7 -->

---

<!-- ANCHOR:pageindex-tasks -->
## PageIndex-Derived Tasks (PI-A1 — PI-B3)

> **Source**: PageIndex research analysis (research documents 9-analysis, 9-recommendations, 10-analysis, 10-recommendations). These 8 tasks augment the existing sprint plan with validated retrieval improvements derived from PageIndex and TrueMem source code review.
>
> **Dependencies**: PI-A2 and PI-A5 require Sprint 0 evaluation framework (T004–T008) to be operational before dark-run validation can proceed.

**Task Format**: `PI-XX [W-X] Description (subsystem) [effort] {deps} — Sprint N`

---

### Sprint 1 Tasks (Graph Signal Activation)

- [x] PI-A5 [W-A] Implement verify-fix-verify memory quality loop — after memory_save, run quality check; if below threshold, auto-fix (regenerate triggers, normalize title) and re-verify; max 2 retries before rejection [12-16h] {T009} — Sprint 1 (deferred from S0 per REC-09)
  - Validation cycle: save → quality_score → fix (if < 0.6) → re-score → reject (if still < 0.6 after 2 retries)
  - Risk: Medium — quality thresholds must be calibrated against Sprint 0 eval data before activation
  - **Sprint assignment note**: Root spec assigns to S0. If deferred from S0, Sprint 1 child spec MUST include PI-A5 as a formal task (REQ-057)

### Sprint 1 Tasks (Graph Signal Activation)

- [x] PI-A3 [W-D] Implement pre-flight token budget validation in result assembly — compute projected token cost of top-K results before returning; truncate to budget if over-limit; surface `token_budget_used` in response metadata [4-6h] {T009} — Sprint 1
  - Enforcement point: post-fusion, pre-return in `memory_context` and `memory_search` handlers
  - Risk: Low — read-only truncation with no scoring impact

### Sprint 2 Tasks (Scoring Calibration)

- [x] PI-A1 [W-A] Implement DocScore folder-level aggregation — group chunk results by spec_folder, aggregate scores using (1/sqrt(M+1)) * SUM(MemoryScore(m)) damped-sum formula, surface folder-level score alongside memory-level scores in result metadata [4-8h] {(soft: T020)} — Sprint 2
  - Soft dependency on T020: can build independently, enable after T020 gate passes (breaks PI-A1 <-> T020 cycle)
  - Enables folder-aware ranking and cross-folder diversity enforcement
  - Risk: Low — additive metadata field; does not alter existing ranking unless explicitly weighted

### Sprint 3 Tasks (Query Intelligence)

- [ ] ~~PI-A2~~ [W-D] **DEFERRED** — Three-tier search strategy degradation/fallback chain deferred from Sprint 3. Re-evaluate after Sprint 3 using measured frequency data. See UT review R1. [12-16h] {T025-GATE, T004}
- [x] PI-B3 [W-D] Implement description-based spec folder discovery — generate and cache natural-language descriptions for each spec folder in `descriptions.json`; use description embeddings for folder pre-selection before memory search [4-8h] {T025-GATE} — Sprint 3
  - Cache invalidated on new memory save to spec folder; re-generated lazily on next query
  - Risk: Low — read-only pre-filter layer; falls back to existing folder matching on cache miss

### Sprint 4 Tasks (Feedback Loop)

- [x] PI-A4 [W-A] Reformat constitutional memories as retrieval directives — add `retrieval_directive` metadata field to constitutional-tier memories; format as explicit instruction prefixes ("Always surface when:", "Prioritize when:") for LLM consumption [8-12h] {T031} — Sprint 5 (deferred from Sprint 4 per REC-07) — completed in Sprint 5 child
  - Directive extraction: parse existing constitutional memory content to identify rule patterns
  - Risk: Low-Medium — content transformation only; no scoring logic changes

### Sprint 5 Tasks (Pipeline Refactor + Spec-Kit Logic)

- [x] PI-B1 [W-D] Implement tree thinning pass in spec folder context loading — before injecting spec folder hierarchy into context, prune low-value nodes: collapse single-child branches, drop nodes below 300-token content threshold, summarize leaf nodes below 100 tokens [10-14h] {T040} — Sprint 5 — completed in Sprint 5 child
  - Thresholds: collapse if content < 300 tokens; summarize if content < 100 tokens; preserve all anchored nodes regardless of size
  - Risk: Low — thinning is non-destructive; original tree retained in memory
- [x] PI-B2 [W-D] Implement progressive validation for spec documents — 4-level validation pipeline: Level 1 (detect structural issues), Level 2 (auto-fix safe violations), Level 3 (suggest fixes for complex issues), Level 4 (report unresolvable issues with remediation guidance) [16-24h] {T040} — Sprint 5 — completed in Sprint 5 child
  - Auto-fix scope (Level 2): missing anchors, malformed frontmatter, broken cross-references
  - Suggest scope (Level 3): title mismatches, description staleness, orphaned sections
  - Risk: Medium — Level 2 auto-fix mutates files; requires checkpoint before activation
<!-- /ANCHOR:pageindex-tasks -->

---

<!-- ANCHOR:test-tasks -->
## Test-Writing Tasks (Per Sprint)

> **Source**: plan.md §5 Testing Strategy. Each sprint MUST have dedicated test-writing effort. These tasks formalize the ~138-193 new tests across the program (sum: 8-12 + 18-25 + 18-26 + 22-28 + 22-32 + 30-40 + 12-18 + 8-12).

- [x] T-TEST-S0 [W-C] Write Sprint 0 tests — G1 numeric ID validation, G3 chunk dedup, R17 fan-effect bounds, R13-S1 schema/hooks/metrics, G-NEW-1 BM25 path, T054 SHA256 dedup, T004b observer effect, T006 diagnostic metrics, ground truth diversity validation [8-12 tests, 4-6h] {T009}
- [x] T-TEST-S1 [W-C] Write Sprint 1 tests — R4 degree SQL/normalization/cache/constitutional exclusion, A7 co-activation boost, G-NEW-2 instrumentation hooks, TM-08 CORRECTION/PREFERENCE signals, PI-A3 token budget, feature flag behaviors [18-25 tests, 6-10h] {T014}
- [x] T-TEST-S2 [W-C] Write Sprint 2 tests — R18 cache hit/miss/eviction/model invalidation, N4 decay curve, G2 weight count, normalization, FUT-5 K-value, TM-01 interference scoring, TM-03 classification decay, PI-A1 folder scoring [18-26 tests, 6-10h] {T020}
- [x] T-TEST-S3 [W-C] Write Sprint 3 tests — R15 classification accuracy (10+ queries/tier), 2-channel min, R14/N1 all 3 variants, R2 floor, R15 fallback, R15+R2 interaction, confidence truncation, dynamic token budget, PI-B3 folder discovery [22-28 tests, 8-12h] {T025-GATE}
- [ ] T-TEST-S4 [W-C] Write Sprint 4 tests — R1 MPAB N=0/1/2/10, R11 column isolation/TTL/denylist/cap/eligibility, R13-S2, TM-04 quality gate, TM-06 reconsolidation, B2 chunk ordering, A4 negative feedback [22-32 tests, 8-12h] {T031}
- [ ] T-TEST-S5 [W-C] Write Sprint 5 tests — R6 full corpus regression, stage boundaries, Stage 4 invariant, R9/R12/S2/S3, TM-05 dual-scope injection, PI-B1 tree thinning, PI-B2 progressive validation [30-40 tests, 10-14h] {T040}
- [ ] T-TEST-S6 [W-C] Write Sprint 6 tests — R7 recall, R10 false positives, N2 attribution, N3-lite bounds/contradiction, S4 hierarchy, T041d weight_history logging/rollback, N3-lite decay verification [12-18 tests, 6-10h] {T047a}
- [ ] T-TEST-S7 [W-C] Write Sprint 7 tests — R8 summary pre-filter/skip-path, S1 template schema validation, S5 entity link integrity, R13-S3 dashboard, R5 decision documentation, latency benchmarks [8-12 tests, 4-6h] {T053}
<!-- /ANCHOR:test-tasks -->

---

<!-- ANCHOR:cross-cutting-tasks -->
## Cross-Cutting Tasks

- [ ] T-DOC-OPS [W-D] Operator guide maintenance — maintain operator documentation for each sprint's changes [1-2h/sprint] {} — Ops
  - Sprint: Cross-cutting (all sprints) | Priority: Low
  - Update: configuration guide, troubleshooting playbook, migration notes
  - Cadence: Update at each sprint gate review
- [x] T061 [W-D] Execute DOC-01 feature-catalog decomposition — generate feature.md for every numbered feature folder in `011-feature-catalog/` using canonical sections from feature_catalog.md and optional enrichments from summary_of_new_features.md [6-10h] {} — DOC-01 (completed 2026-03-04)
  - Tooling: cli-gemini workflow with `gemini-3.1-pro-preview` + deterministic local mapping/validation pass
  - Output contract: each artifact includes title, canonical documentation, new/updated context, and source metadata
- [x] T061a [W-D] Resolve numbering drift in feature catalog folders to preserve strict `##/###` order mapping [0.5-1h] {T061} — DOC-01 (completed 2026-03-04)
  - Applied correction: `16-tooling-and-scripts` 02/03 folder swap (`architecture-boundary-enforcement` and `progressive-validation-for-spec-documents`)
- [x] T061b [W-D] Coverage verification for DOC-01 artifact generation [0.5h] {T061, T061a} — DOC-01 (completed 2026-03-04)
  - Verification result: canonical features=141, feature.md written=141, missing target folders=0, extra folders without feature.md=0
<!-- /ANCHOR:cross-cutting-tasks -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All sprint exit gates S0-S3 (T009, T014, T020, T025-GATE) PASSED; S5-S7 gates (T040, T047a, T053) PASSED — completed in Sprint 5/6/7 children; S4 gate (T031) pending; T047b pending if Sprint 6b executed
- [ ] No `[B]` blocked tasks remaining
- [x] NFR-O01 flag budget met (target <=6 active per gate; hard ceiling <=8) (verified through S0-S3 sunset reviews; S5-S7 sunset reviews completed in children)
- [ ] R13 cumulative health dashboard meets targets (MRR@5 +10-15%, graph hit >20%, channel diversity >3.0)
- [ ] All 158+ original tests + ~138-193 new tests passing

**Minimum viable completion**: [x] T025-GATE (Sprint 3 gate) passed — see off-ramp criteria
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research (Recommendations)**: See `research/6 - combined-recommendations-gap-analysis.md`
- **Research (true-mem Analysis)**: See `research/10 - deep-analysis-true-mem-source-code.md`
- **Research (true-mem Recommendations)**: See `research/10 - recommendations-true-mem-patterns.md`
- **Research (PageIndex Analysis)**: See `research/9 - analysis-pageindex-systems-architecture.md`
- **Research (PageIndex Recommendations)**: See `research/9 - recommendations-pageindex-patterns-for-speckit.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3+ TASKS
- 100+ core tasks across 8 metric-gated sprints + 8 PageIndex-derived tasks (PI-A1 — PI-B3)
- Workstream tags (W-A through W-I)
- Sprint gate tasks (T009, T014, T020, T025-GATE, T031, T040, T047a, T047b, T053)
- Feature flag sunset tasks (T-FS0 through T-FS7) at each sprint boundary
- Ground truth diversification (T000d) and agent consumption pre-analysis (T000e) in Sprint 0
- Off-ramp marker after Sprint 3
- PageIndex tasks: PI-A5 (S1, deferred from S0), PI-A3 (S1), PI-A1 (S2), PI-A2+PI-B3 (S3), PI-A4 (S5, deferred from S4), PI-B1+PI-B2 (S5)
-->

## Source: 002-hybrid-rag-fusion

---
title: "Tasks: 138-hybrid-rag-fusion [002-hybrid-rag-fusion/tasks]"
description: "Target File: lib/search/hybrid-search.ts"
trigger_phrases:
  - "tasks"
  - "138"
  - "hybrid"
  - "rag"
  - "fusion"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Tasks: 138-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR: tasks-phase-0-138 -->
## Phase 0: Activate Assets
**Target File:** `lib/search/hybrid-search.ts`
- [x] **Refactor `hybridSearchEnhanced()`:** Replace hardcoded `[1.0, 0.8, 0.6]` weights with an invocation of `hybridAdaptiveFuse(intent)`.
- [x] **Activate Graph Routing:** Modify `hybridSearchEnhanced()` configuration object to default `useGraph: true`, mapping the causal relationships directly into the RRF fusion array.
- [x] **Activate Co-Activation:** In `hybridSearchEnhanced()`, inject `await spreadActivation(top5_ids)` after the RRF fusion step and before final metadata formatting.
- [x] **Implement Adaptive Fallback:** Wrap the primary `Promise.all` scatter block.
  ```typescript
  let results = await executeScatter(query, { min_similarity: 0.3 });
  if (results.length === 0) {
      results = await executeScatter(query, { min_similarity: 0.17 });
      metadata.fallbackRetry = true;
  }
  ```
<!-- /ANCHOR: tasks-phase-0-138 -->

<!-- ANCHOR: tasks-phase-1-138 -->
## Phase 1: Diversity and Confidence (TRM/MMR)
**Target Files:** `lib/search/mmr-reranker.ts` (NEW), `lib/search/evidence-gap-detector.ts` (NEW)
- [x] **MMR Algorithm Calculation:** Implement `applyMMR(candidates, lambda, limit)` utilizing a pairwise cosine similarity matrix on the returned `sqlite-vec` embeddings.
  ```typescript
  // Core MMR calculation loop snippet
  const sim = computeCosine(candidate.embedding, selectedMemory.embedding);
  const mmrScore = (lambda * candidate.score) - ((1 - lambda) * maxSimToSelected);
  ```
- [x] **Intent-Mapped Lambdas:** Create a configuration map where `intent="understand"` sets MMR `lambda=0.5` (high diversity), and `intent="fix_bug"` sets `lambda=0.85` (high relevance). *(Wired: `INTENT_LAMBDA_MAP` in intent-classifier.ts, consumed by hybrid-search.ts MMR call)*
- [x] **TRM Confidence Check:** Write `detectEvidenceGap(rrfScores: number[])` that calculates the Mean and Standard Deviation of the array. If `(topScore - mean) / stdDev < 1.5`, return `{ gapDetected: true }`.
- [x] **Warning Injection:** Modify the MCP markdown formatter in `memory-search.ts` to forcefuly prepend `> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.` if TRM returns true.
<!-- /ANCHOR: tasks-phase-1-138 -->

<!-- ANCHOR: tasks-phase-2-138 -->
## Phase 2: Graph & Weights
**Target Files:** `lib/search/sqlite-fts.ts`, `lib/search/causal-edges.ts`
- [x] **FTS5 SQL Upgrade:** Rewrite the standard `WHERE ... MATCH ?` SQL statement to use the native weighted `bm25()` ranker to elevate `title` matches 10x. *(Wired: ftsSearch() in hybrid-search.ts now delegates to fts5Bm25Search() from sqlite-fts.ts)*
  ```sql
  -- Target SQL Implementation
  SELECT m.id, m.title, bm25(memory_fts, 10.0, 5.0, 1.0, 2.0) AS fts_score
  FROM memory_fts
  JOIN memories m ON m.id = memory_fts.rowid
  WHERE memory_fts MATCH ?
  ORDER BY fts_score LIMIT ?;
  ```
- [x] **Graph Weights CTE:** Update `causal-edges.ts` SQL CTE. Add a multiplier directly into the accumulator:
  ```sql
  -- Add to the recursive CTE accumulator
  (cte.score * CASE WHEN relation = 'supersedes' THEN 1.5 
                    WHEN relation = 'contradicts' THEN 0.8 
                    ELSE 1.0 END * edgeStrength) AS new_score
  ```
<!-- /ANCHOR: tasks-phase-2-138 -->

<!-- ANCHOR: tasks-phase-3-138 -->
## Phase 3: Multi-Query (RAG Fusion)
**Target File:** `lib/search/query-expander.ts` (NEW), `handlers/memory-search.ts`
- [x] **Synonym Utility:** Build `expandQuery(query: string)` that splits compound terms using standard Regex (`/(\b\w+\b)/g`) and checks against a static JSON `DOMAIN_VOCABULARY_MAP`.
- [x] **Scatter-Gather Execution:** In the MCP handler for `mode="deep"`, execute:
  ```typescript
  const variants = expandQuery(originalPrompt); // returns max 3
  const nestedResults = await Promise.all(variants.map(v => executeScatter(v)));
  const flattened = nestedResults.flat();
  // Pass flattened array into Reciprocal Rank Fusion
  ```
- [x] **Cross-Variant RRF:** Modify `rrf-fusion.ts` to accept multi-dimensional arrays, grouping identical memory IDs across variants and applying the `+0.10` convergence bonus.
<!-- /ANCHOR: tasks-phase-3-138 -->

<!-- ANCHOR: tasks-phase-4-138 -->
## Phase 4: Indexing Quality & Cognitive Layer
**Target Files:** `scripts/lib/structure-aware-chunker.ts` (NEW), `lib/manage/pagerank.ts` (NEW), `lib/search/intent-classifier.ts`
- [x] **AST Parsing:** Integrate `remark` + `remark-gfm` syntax tree parsing during the `generate-context.js` ingest phase. Ensure any node of type `code` or `table` bypasses text splitting.
- [x] **Batch PageRank:** Write batch PageRank SQL logic to execute iteratively (10 iterations) during `memory_manage` runs, storing the float value in `memory_index.pagerank_score`.
- [x] **Embedding Centroids:** Refactor `intent-classifier.ts` to compute 7 centroid embeddings during initialization. Replace regex checks with `Math.max(...centroids.map(c => dotProduct(c, queryEmb)))`. *(Completed 2026-02-21 using deterministic centroid embeddings with exported `INTENT_CENTROIDS`, `dotProduct`, and `calculateCentroidScore`.)*
- [x] **Tier Decay Modulation:** Update `fsrs.ts` decay math: `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`.
- [x] **Read-Time Prediction Error:** Pipe the retrieved context payload through `prediction-error-gate.ts` just before MMR to flag read-time contradictions.
<!-- /ANCHOR: tasks-phase-4-138 -->

<!-- ANCHOR: tasks-phase-5-138 -->
## Phase 5: Test Coverage
**Target Directory:** `mcp_server/tests/`

### Phase 0 Tests (Update Existing)
- [x] **Update `adaptive-fusion.vitest.ts`:** Add tests for intent-weighted RRF activation via `hybridAdaptiveFuse(intent)`. Verify weight vectors change per intent type (e.g., `find_spec` heavily weights FTS5, `explore` balances evenly).
- [x] **Update `hybrid-search.vitest.ts`:** Add tests for `useGraph: true` default routing. Verify causal edges are included in the scatter-gather `Promise.all` array as a primary source. *(Done: A1 added "C138-P0: useGraph:true Default Routing" suite with 5 tests)*
- [x] **Update `co-activation.vitest.ts`:** Add pipeline integration test verifying `spreadActivation(top5_ids)` runs post-RRF and enriches results with temporal neighbors. *(Done: co-activation.vitest.ts exists with 20 tests including C138 pipeline integration suite)*
- [x] **Create `adaptive-fallback.vitest.ts` (NEW):** Test two-pass fallback: verify 0-result at `min_similarity=0.3` triggers retry at `0.17`, verify `metadata.fallbackRetry=true` flag, verify non-zero results skip retry. *(Done: file exists, tests passing)*

### Phase 1 Tests (New Files)
- [x] **Create `mmr-reranker.vitest.ts` (NEW):** Test `applyMMR(candidates, lambda, limit)` — verify identical candidates are deduplicated, verify lambda=0.5 maximizes diversity, verify lambda=0.85 preserves relevance order, verify N=20 hardcap, verify O(N²) completes in <2ms for N=20, verify output limit is respected.
- [x] **Create `evidence-gap-detector.vitest.ts` (NEW):** Test `detectEvidenceGap(rrfScores)` — verify Z-score < 1.5 returns `gapDetected: true`, verify well-distributed scores return `gapDetected: false`, verify edge cases (single score, all identical scores, empty array).
- [x] **Update `intent-classifier.vitest.ts`:** Add tests for intent-to-lambda mapping configuration (`understand`→0.5, `fix_bug`→0.85, etc.).
- [x] **Update `handler-memory-search.vitest.ts`:** Add test verifying `[EVIDENCE GAP DETECTED]` warning is prepended to markdown payload when TRM flags low confidence. *(Done: handler-memory-search.vitest.ts exists with 10 tests including C138 evidence gap warning tests)*

### Phase 2 Tests (Update Existing)
- [x] **Update `bm25-index.vitest.ts`:** Add tests for weighted `bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)` SQL. Verify title match (10x) outranks body match. Verify `trigger_phrases` match (5x) outranks generic content (2x).
- [x] **Update `causal-edges.vitest.ts` or `causal-edges-unit.vitest.ts`:** Add tests for relationship weight multipliers in recursive CTE: `supersedes`=1.5x, `contradicts`=0.8x, `caused`=1.3x. Verify `supersedes` chain outranks `caused` chain. *(Done: causal-edges-unit.vitest.ts + causal-boost.vitest.ts exist with multiplier tests)*

### Phase 3 Tests (New + Update)
- [x] **Create `query-expander.vitest.ts` (NEW):** Test `expandQuery(query)` — verify compound terms are split, verify synonym map lookups work, verify max 3 variants returned, verify original query is always included, verify unknown terms return only original.
- [x] **Update `unit-rrf-fusion.vitest.ts`:** Add tests for multi-dimensional array input (cross-variant RRF). Verify identical memory IDs across variants receive `+0.10` convergence bonus. Verify single-variant input behaves identically to current behavior. *(Done: A3 added 6 cross-variant RRF tests)*
- [x] **Update `hybrid-search.vitest.ts`:** Add test for `mode="deep"` scatter-gather execution verifying `Promise.all` parallelism with expanded query variants. *(Done: hybrid-search.vitest.ts updated with scatter-gather tests)*

### Phase 4 Tests (New + Update)
- [x] **Create `structure-aware-chunker.vitest.ts` (NEW):** Test AST-based chunking — verify markdown tables are never split mid-row, verify code blocks are kept atomic, verify headings stay with their content, verify chunk size limits are respected. *(Done: structure-aware-chunker.vitest.ts exists with 9 tests T1-T9)*
- [x] **Create `pagerank.vitest.ts` (NEW):** Test batch PageRank — verify 10 iterations converge, verify `pagerank_score` is written to `memory_index`, verify no `SQLITE_BUSY` errors during batch execution, verify isolated nodes get minimum score. *(Done: pagerank.vitest.ts exists with 10 tests T1-T10)*
- [x] **Update `intent-classifier.vitest.ts`:** Add tests for centroid-based classification replacing regex. Verify 7 centroid embeddings are computed at init. Verify `dotProduct` distance correctly classifies all 7 intent types. *(Completed: `C138-T0`, `C138-T0b`, `C138-T0c`; targeted run `vitest tests/intent-classifier.vitest.ts` = 54/54 passing.)*
- [x] **Update `fsrs-scheduler.vitest.ts`:** Add tests for tier decay modulation: verify Constitutional tier uses `TIER_MULTIPLIER=0.1` (minimal decay), verify Scratch tier uses `3.0` (rapid decay). Verify formula: `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`. *(Done: fsrs-scheduler.vitest.ts exists with tier decay tests)*
- [x] **Update `prediction-error-gate.vitest.ts`:** Add read-time contradiction test: verify contradicting Constitutional+Scratch memories trigger explicit flag in response payload. *(Done: prediction-error-gate.vitest.ts exists with 49 tests including C138 read-time contradiction flagging suite)*

### Integration Tests
- [x] **Create `integration-138-pipeline.vitest.ts` (NEW):** End-to-end pipeline test covering the full `hybridSearchEnhanced()` flow: intent classification → scatter (vector + FTS5 + graph) → adaptive RRF fusion → co-activation → TRM check → MMR pruning → markdown serialization. Verify total latency < 120ms. Verify output respects 2000-token budget.
- [x] **Update `integration-search-pipeline.vitest.ts`:** Add regression guards ensuring the new pipeline doesn't break existing search behavior when feature flags are `false`. *(Done: integration-search-pipeline.vitest.ts + graph-regression-flag-off.vitest.ts 18 regression tests)*
<!-- /ANCHOR: tasks-phase-5-138 -->

## Consolidation Tasks (2026-02-22)

- [x] Merge command-alignment outcomes into supplemental/command-alignment-summary.md
- [x] Merge non-skill-graph outcomes into supplemental/non-skill-graph-consolidation-summary.md
- [x] Add supplemental-index.md and link consolidated evidence
- [x] Confirm this folder remains the only active RAG lifecycle set

## Source: 006-hybrid-rag-fusion-logic-improvements

---
title: "Tasks: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/tasks.md]"
description: "Task format uses task id, priority tag, optional parallel marker, description, and file path with measurable acceptance and dependency mapping."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "hybrid rag"
  - "fusion improvements"
  - "cross-system hardening"
  - "bug prevention"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
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
| `[P0]`/`[P1]`/`[P2]` | Priority |

**Task Format**: `T### [priority] [P optional] Description (file path)`
<!-- /ANCHOR:notation -->

---

## Prior-Work Carry-Forward

| Prior Spec | Required Carry-Forward in 006 | Expansion in 006 Tasks |
|------------|-------------------------------|-------------------------|
| `002-hybrid-rag-fusion` | Preserve tri-hybrid + MMR/TRM baseline | Extend with graph-contract calibration and cognitive weighting controls |
| `003-index-tier-anomalies` | Keep canonical path and tier precedence as hard invariants | Add parser/index automation and storage-ledger reliability gates |
| `004-frontmatter-indexing` | Keep normalized frontmatter + idempotent reindex | Add CRUD re-embed metadata consistency and docs/schema governance checks |
| `008-combined-bug-fixes` | Keep low-confidence routing safeguards and archive exclusion behavior | Extend to session-learning quality/performance and runbook automation |

## Subsystem-to-Task Coverage

| Scoped Subsystem Area | Task Coverage |
|-----------------------|---------------|
| Retrieval/fusion pipeline | T005, T008, T020 |
| Graph/causal contracts + relation scoring | T006 |
| Cognitive/attention-decay + FSRS ranking | T007 |
| Session manager + session-learning quality/performance | T009, T010 |
| Memory CRUD + metadata re-embedding consistency | T011 |
| Parser/indexing invariants + index health automation | T012, T014 |
| Storage reliability + mutation ledger consistency | T013, T021 |
| Telemetry/trace schema governance + docs drift prevention | T015, T016 |
| Deferred/skipped-path test hardening | T019 |
| Automation loops + operational self-healing runbooks | T017, T018, T021 |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Cross-System Audit and Continuity Lock

- [x] T001 [P0] Build ten-subsystem contract map across retrieval, graph, cognitive, session, CRUD, parser/index, storage, telemetry, tests, and operations (`spec.md`, audit artifacts)
- [x] T002 [P0] Capture baseline fixture corpus and metrics (latency, quality, misroute, stale-embed backlog, recovery timing) (`mcp_server/tests/*`, benchmark scripts) [EVIDENCE: scratch/w6-baseline-metrics-sweep.md]
- [x] T003 [P0] Create ranked seam-risk register with owner and mitigation for each subsystem (`spec.md`, `plan.md`, `decision-record.md`)
- [x] T004 [P1] Validate continuity assumptions from `002/002/004/003` and map to 006 requirement IDs (`spec.md`, `plan.md`, `tasks.md`)
- [x] T025 [P0] Lock relation-score adjudication corpus policy (shared vs domain-specific corpus) with approved fixture governance (`spec.md`, `decision-record.md`, ranking fixtures)
- [x] T026 [P0] Lock cognitive-weight policy scope (global bounds vs intent-scoped bounds) and rollout defaults (`spec.md`, `decision-record.md`, scoring fixtures)
- [x] T027 [P1] Lock self-healing auto-remediation policy (auto-apply vs operator acknowledgement by failure class) with escalation guardrails (`plan.md`, `checklist.md`, runbook artifacts) [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md runbook drill entries]
<!-- /ANCHOR:phase-1 -->

### Phase 1 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T001 | None | Contract map includes input/output invariants for all ten subsystem areas. |
| T002 | T001 | Baseline metrics are reproducible with command references and fixture versioning. |
| T003 | T001, T002 | Top risks are ranked by impact/likelihood and have named owner + mitigation path. |
| T004 | T001 | All inherited assumptions from `002`-`005` map to explicit controls in `006` artifacts. |
| T025 | T001, T002, T003 | Relation-score adjudication corpus policy is approved with fixture manifest and replay evidence. |
| T026 | T002, T003 | Cognitive-weight policy scope is approved with ablation evidence and rollout-bound definition. |
| T027 | T003 | Self-healing auto-remediation policy is approved with failure-class matrix and escalation/rollback guardrails. |

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Ranking and Channel Contract Hardening

- [x] T005 [P0] Implement bounded retrieval/fusion guardrails with deterministic tie and fallback behavior (`lib/search/adaptive-fusion.ts`, `lib/search/hybrid-search.ts`)
- [x] T006 [P0] Formalize graph/causal channel contracts and calibrate relation scoring (`lib/search/co-activation.ts`, `lib/scoring/*`, tests)
- [x] T007 [P0] Integrate cognitive/attention-decay and FSRS modifiers with bounded contribution (`lib/scoring/*`, `lib/search/*`)
- [x] T008 [P1] [P] Emit debug diagnostics for channel contributions, cognitive modifiers, and low-confidence rationale (`handlers/memory-search.ts`, telemetry interfaces)
<!-- /ANCHOR:phase-2 -->

### Phase 2 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T005 | T002, T003 | Deterministic regression fixtures pass with stable ranked outputs and fallback order. |
| T006 | T002, T003, T025 | Graph contract tests pass and relation ordering reaches Kendall tau >= 0.75 on adjudicated fixture. |
| T007 | T002, T005, T026 | NDCG@5 improves >= 8% on long-tail fixture with <= 3% regression on primary fixture and 5-25% cognitive weight bound. |
| T008 | T005, T006, T007 | Debug metadata includes ranked-channel/cognitive rationale without sensitive data leakage. |

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Session and State Integrity Hardening

- [x] T009 [P0] Improve session manager selection quality and latency with ambiguity handling (`lib/session/*`, folder/session selection handlers)
- [x] T010 [P0] Harden session-learning pipeline freshness, feedback hygiene, and performance instrumentation (`lib/session-learning/*`, tests)
- [x] T011 [P0] Enforce memory CRUD to re-embedding consistency workflow with backlog SLA guards (`handlers/memory-crud.ts`, embedding queue orchestration)
- [x] T012 [P0] Add parser/indexing invariant checks and index-health automation hooks (`lib/parsing/memory-parser.ts`, `handlers/memory-index.ts`)
- [x] T013 [P0] Implement transaction recovery and mutation-ledger consistency checks (`lib/storage/sqlite-transaction-recovery.ts`, `lib/storage/mutation-ledger.ts`)
- [x] T014 [P1] [P] Add auto-reconcile hooks for index/ledger divergence with bounded retry policy (`scripts/ops/*`, storage/index handlers)
<!-- /ANCHOR:phase-3 -->

### Phase 3 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T009 | T004, T008 | Session misroute rate <= 1% and p95 selection <= 250ms on 500-candidate fixture. |
| T010 | T004, T009 | Session-learning freshness checks prevent stale updates and batch p95 <= 400ms. |
| T011 | T004, T010 | 100% CRUD mutations trigger re-embed reconciliation; stale backlog >15m remains zero in validation run. |
| T012 | T004, T011 | CI fails on canonical path, tier precedence, or metadata invariant violations with actionable diagnostics. |
| T013 | T012 | Recovery replay preserves committed mutations (RPO 0) and completes <= 120s in simulation. |
| T014 | T012, T013 | Divergence auto-reconcile executes deterministic retry and escalates after bounded attempts. |

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Telemetry Governance and Operational Automation

- [x] T015 [P0] Define canonical telemetry/trace schema and enforce payload validation (`lib/telemetry/trace-schema.ts`, emitters, tests) [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md command 4]
- [x] T016 [P0] Implement documentation drift prevention checks for telemetry and operational contracts (`scripts/spec-folder/alignment-validator.ts`, docs validation hooks) [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md command 4]
- [x] T017 [P1] Draft and verify runbooks for index drift, session ambiguity, ledger mismatch, and telemetry drift (`plan.md`, `checklist.md`, ops docs) [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md commands 5-6]
- [x] T018 [P1] [P] Wire self-healing automation loops and operational checks into CI/scheduled runs (`scripts/ops/*`, CI config)
<!-- /ANCHOR:phase-4 -->

### Phase 4 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T015 | T008, T012 | All trace payloads validate against schema registry in tests and CI checks. |
| T016 | T015 | Schema/doc mismatch fails validation with field-level diffs and remediation hints. |
| T017 | T013, T016, T027 | Four runbook drill classes documented with trigger, command set, owner, and escalation path. |
| T018 | T014, T017, T027 | Self-healing checks detect/remediate four known failure classes with simulated MTTR <= 10 minutes. |

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification Hardening and Governance Closure

- [x] T019 [P0] Expand and close deferred/skipped-path tests from `002`/`003`/`004`/`005` lineage (`mcp_server/tests/*`, script tests) [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md commands 2-3]
- [x] T020 [P0] Run consolidated performance/reliability verification (retrieval, session, recovery, automation) against required thresholds [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md, scratch/w6-baseline-metrics-sweep.md]
- [x] T021 [P1] Execute failure-injection drills for recovery and self-healing paths and capture evidence (`scripts/ops/*`, verification artifacts) [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md commands 5-6]
- [x] T022 [P1] Synchronize checklist evidence and sign-off model across all Level 3+ docs (`checklist.md`, `spec.md`) [EVIDENCE: docs sync closure dated 2026-02-22]
- [x] T023 [P1] Finalize decision record and implementation summary with delivered subsystem evidence (`decision-record.md`, `implementation-summary.md`)
- [ ] T024 [P2] Save context snapshot after implementation completion (`memory/` via generate-context script) [DEFERRED: memory snapshot generation intentionally not executed in this closure pass because user scope is markdown-only updates in this folder; reclassified from completed to deferred per governance review]
- [x] T028 [P0] Execute global quality sweep across all implemented updates/new features and publish evidence in global-quality-sweep.md [EVIDENCE: global-quality-sweep.md EVT-001]
- [x] T029 [P0] Run global bug detection sweep and close all discovered P0/P1 defects; publish closure evidence in global-quality-sweep.md [EVIDENCE: global-quality-sweep.md EVT-002]
- [x] T030 [P1] Complete `sk-code--opencode` compliance audit for all changed/added code paths and capture findings in global-quality-sweep.md [EVIDENCE: global-quality-sweep.md EVT-003]
- [x] T031 [P1] Apply conditional standards update only if architecture mismatch is confirmed; document rationale/evidence in global-quality-sweep.md [EVIDENCE: global-quality-sweep.md EVT-004 (`N/A`, no mismatch detected)]
<!-- /ANCHOR:phase-5 -->

### Phase 5 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T019 | T015, T018 | Deferred/skipped inventory is closed or explicitly approved with owner and re-entry condition. |
| T020 | T005, T007, T009, T010, T013, T018 | Thresholds met: retrieval p95, session p95, recovery timing, and automation overhead budgets. |
| T021 | T017, T018 | Failure-injection drill results include pass/fail, remediation time, and follow-up action entries. |
| T022 | T019, T020 | All P0 checklist items complete; P1 items complete or approved deferred with rationale. |
| T023 | T022 | ADRs, implementation summary, and sign-off status are synchronized and evidence-backed. |
| T024 | T023 | Context snapshot saved with final status, blockers, and next-step handoff. |
| T028 | T019, T020, T021 | Global quality sweep executed across all implemented updates/new features with complete evidence entries in global-quality-sweep.md. |
| T029 | T028 | Bug detection sweep completed with unresolved defect counts `P0=0` and `P1=0`, evidence published in global-quality-sweep.md. |
| T030 | T028 | `sk-code--opencode` compliance audit covers all changed/added code paths with evidence and closure state captured in global-quality-sweep.md. |
| T031 | T030 | If architecture mismatch exists, standards update is documented with rationale and evidence; otherwise marked approved `N/A` with rationale in global-quality-sweep.md. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Decision-lock tasks `T025`, `T026`, and `T027` are closed before Phase 2 starts
- [x] Performance, recovery, and automation gates passed [EVIDENCE: scratch/final-quality-evidence-2026-02-22.md, scratch/w6-baseline-metrics-sweep.md]
- [x] `T028` and `T029` are closed with evidence in global-quality-sweep.md
- [x] `T030` and `T031` are closed, or `T031` is approved `N/A` with explicit rationale/evidence in global-quality-sweep.md
- [x] Governance approval workflow updated to approved state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Global Quality Sweep**: See global-quality-sweep.md
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS FILE
Actionable task breakdown with dependency and acceptance matrices across all scoped subsystems.
-->

