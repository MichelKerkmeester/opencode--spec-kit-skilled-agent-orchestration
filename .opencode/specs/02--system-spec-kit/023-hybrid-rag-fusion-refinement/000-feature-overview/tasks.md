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
> **Child folder**: `001-sprint-0-measurement-foundation/`

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
- [x] T000e [W-C] G-NEW-2 pre-analysis: Agent consumption pattern survey — lightweight analysis of how AI agents currently consume memory search results: What query patterns do agents use? What results do they select vs ignore? What retrieval failures are common? Document findings in `scratch/agent-consumption-survey.md` [3-4h] {} — G-NEW-2
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
> **Child folder**: `002-sprint-1-graph-signal-activation/`

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
> **Child folder**: `003-sprint-2-scoring-calibration/`

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
> **Child folder**: `004-sprint-3-query-intelligence/`

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
> **Child folder**: `005-sprint-4-feedback-and-quality/`
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
> **Child folder**: `006-sprint-5-pipeline-refactor/`

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
> **Child folder**: `007-sprint-6-indexing-and-graph/`

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
> **Child folder**: `007-sprint-6-indexing-and-graph/`
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
> **Child folder**: `008-sprint-7-long-horizon/`
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
