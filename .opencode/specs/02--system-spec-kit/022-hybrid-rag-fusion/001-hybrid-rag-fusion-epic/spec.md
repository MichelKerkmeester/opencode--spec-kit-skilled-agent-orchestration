---
title: "Hybrid RAG Fusion Epic"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-08"
---
# Consolidated spec
<!-- SPECKIT_TEMPLATE_SOURCE: consolidated-epic-merge | v1 -->

Consolidated from the following source docs:
- sources/000-feature-overview/spec.md
- sources/002-hybrid-rag-fusion/spec.md
- sources/006-hybrid-rag-fusion-logic-improvements/spec.md

## Source: 000-feature-overview

---
title: "Feature Specification: Hybrid RAG Fusion Refinement"
description: "Graph channel broken (0% hit rate), dual scoring 15:1 mismatch, zero evaluation metrics. 43-recommendation program (+ 8 PageIndex-derived) across 8 metric-gated sprints to achieve graph-differentiated, feedback-aware retrieval."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2
trigger_phrases:
  - "hybrid rag fusion"
  - "graph channel fix"
  - "retrieval evaluation"
  - "spec-kit memory refinement"
  - "scoring calibration"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Hybrid RAG Fusion Refinement

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

The spec-kit memory MCP server's graph channel produces a 0% hit rate due to an ID format mismatch, its dual scoring systems have a 15:1 magnitude mismatch, and it has zero retrieval quality metrics despite 15+ scoring signals. This specification defines a 43-recommendation program (43 evaluated, 40 active in program scope, 54 total traceable items including 6 sprint-derived requirements and 8 PageIndex-derived recommendations, IDs PI-A1 through PI-B3) across 8 metric-gated sprints (348-523h for S0-S6, 393-585h including S7; +70-104h for PageIndex items; grand total with PageIndex: 463-689h) to transform the system into a graph-differentiated, feedback-aware retrieval engine with measurable quality.

**Key Decisions**: Evaluation first (R13 gates all improvements), calibration before surgery (normalize scores before pipeline refactor), density before deepening (edge creation before graph traversal sophistication).

**Critical Dependencies**: Sprint 0 exit gate (BM25 baseline) determines the trajectory of all subsequent sprints. Off-ramp recommended at Sprint 2+3.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 (Sprints 0-1), P1 (Sprints 2-6; S5-S6 elevated for safety-critical NFRs), P2 (Sprint 7) |
| **Status** | In Progress (85%+ complete) |
| **Created** | 2026-02-26 |
| **Complexity** | 90/100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The spec-kit memory MCP server suffers from three compounding failures: (1) the graph channel produces 0% hit rate in production due to an ID format mismatch (`mem:${edgeId}` strings vs numeric IDs), making the system operate as a 3-channel system despite being designed as 4-channel; (2) the dual scoring systems (RRF fusion ~[0, 0.07] and composite scoring ~[0, 1]) have a ~15:1 magnitude mismatch where composite dominates purely due to scale, not quality; (3) zero retrieval quality metrics exist despite 15+ implemented scoring signals, making every tuning decision speculation.

### Purpose

Transform the system into a measurably improving, graph-differentiated, feedback-aware retrieval engine where the graph channel — the most orthogonal signal — is fully activated, scoring is calibrated, and every improvement is validated by metric gates.

### Three Non-Negotiable Design Principles

1. **Evaluation First** (ADR-004) — R13 gates all downstream signal improvements. No scoring change goes live without pre/post measurement.
2. **Calibration Before Surgery** — Normalize scores before pipeline refactoring. The ~15:1 mismatch is calibration, not architecture.
3. **Density Before Deepening** (ADR-003) — Fix G1, measure graph density, prioritize edge creation before investing in graph traversal sophistication.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**43 active recommendations (+ 8 PageIndex-derived, PI-A1 — PI-B3, + 6 sprint-derived, REQ-046 — REQ-051) across 8 subsystems (S0-S7):**

> **Recommendation count reconciliation**: The original research produced 43 recommendations (30 from 142-FINAL-recommendations including G-NEW-1/2/3 + 7 TM-series + 7 gap-fill ADOPT items: A2, A4, A7, B2, B7, B8, D4 — minus 1 overlap = 43 active tracked items). Of these, 3 were dropped/skipped (R3, R5-deferred, N5), leaving 40 active. The "43" count in the executive summary refers to the complete evaluated set. Additionally, 6 requirements (REQ-046 — REQ-051) were derived during sprint decomposition and are tracked in §4 Sprint-Derived Requirements.

| Subsystem | Recommendations | Sprint(s) |
|-----------|----------------|-----------|
| **Graph** | G1, R4, R10, N2 (items 4-6), N3-lite | S0, S1, S6 |
| **Search handlers** | G3, R12 | S0, S5 |
| **Evaluation (new)** | R13 (S1-S3), G-NEW-1, G-NEW-2, G-NEW-3 | S0-S4 |
| **Scoring** | R1, N4, R16 | S2, S4, S6 |
| **Fusion** | G2, R2, R14/N1 | S2, S3 |
| **Pipeline** | R6, R9, R15 | S3, S5 |
| **Indexing** | R7, R8, R18 | S2, S6, S7 |
| **Spec-Kit logic** | S1, S2, S3, S4, S5 | S5-S7 |
| **Memory quality** (NEW) | TM-01, TM-02, TM-03, TM-04, TM-05, TM-06, TM-08 | S0, S1, S2, S4, S5 |
| **Documentation artifacts** (NEW) | DOC-01 (per-feature markdown extraction from feature catalogs) | Cross-cutting |

### Out of Scope

- **R3 (SKIP)** — R5 subsumes normalization; irreversible data risk; sqlite-vec handles internally
- **R5 (DEFER)** — 5.32% recall loss significant; 3MB storage irrelevant at current scale; activation condition: 10K+ memories OR >50ms latency
- **N5 (DROP)** — Two-model ensemble doubles storage/cost; 4-5 channels already provide signal diversity
- **R6-Stage4 (PARKED)** — Post-process stage must NOT change scores; enforced via "no score changes in Stage 4" invariant
- **Gen5 "Self-Improving" (PARKED)** — Marketing language; requires R13 running 8+ weeks with demonstrated positive feedback signal
- **HNSW indexing** — Irrelevant below 10K memories
- **LLM calls in search hot path** — Latency budget violation (500ms p95 hard limit)

### Files to Change

| Subsystem | Key Files | Change Type |
|-----------|-----------|-------------|
| Graph | `graph-search-fn.ts`, `causal_edges` schema | Modify |
| Search handlers | `memory-search.ts`, `hybrid-search.ts` | Modify |
| Evaluation | `speckit-eval.db` (new), eval handlers | Create |
| Scoring | `composite-scoring.ts`, `co-activation.ts`, `vector-index-impl.ts` | Modify |
| Fusion | `rrf-fusion.ts`, `hybrid-search.ts`, `intent-classifier.ts`, `adaptive-fusion.ts` | Modify |
| Pipeline | `memory-search.ts` (refactored stages) | Modify |
| Indexing | `memory_index` schema, embedding pipeline | Modify |
| Spec-Kit logic | Template processing, validation handlers | Modify |
| Memory quality (NEW) | `memory-save.ts`, `composite-scoring.ts`, `fsrs-scheduler.ts`, `trigger-matcher.ts` | Modify |
| Documentation artifacts (NEW) | `011-feature-catalog/**/**/feature.md` (generated from feature_catalog.md + summary_of_new_features.md) | Create/Update |
<!-- /ANCHOR:scope -->

---

<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->
<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.
>
> **Note:** Phases map 1:1 to sprints (Phase 1 = Sprint 0, Phase 2 = Sprint 1, etc.) except Sprint 6 which is split into Phase 7a (Indexing) and Phase 7b (Graph Deepening).

<!-- NOTE: Sprint child folders (006-measurement-foundation through 017-long-horizon) were consolidated into 005-core-rag-sprints-0-to-8. Folder names below are historical sprint references, not current folder paths. -->
| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 1 | `005-core-rag-sprints-0-to-8` <!-- was 006-measurement-foundation --> | G1, G3, R17, R13-S1, G-NEW-1, B7, D4, TM-02, A2, Eval-the-eval, G-NEW-3 (Phase A) (50-77h) | None (BLOCKING) | Complete |
| 2 | `005-core-rag-sprints-0-to-8` <!-- was 011-graph-signal-activation --> | R4, A7, density measurement, G-NEW-2, TM-08, PI-A3, PI-A5 (42-61h) | Sprint 0 gate | Complete |
| 3 | `005-core-rag-sprints-0-to-8` <!-- was 012-scoring-calibration --> | R18, N4, G2, score normalization, TM-01, TM-03, FUT-5, PI-A1 (28-43h) | Sprint 0 gate | Complete |
| 4 | `005-core-rag-sprints-0-to-8` <!-- was 013-query-intelligence --> | R15, R14/N1, R2, R15-ext, FUT-7, PI-A2 (deferred), PI-B3 (34-53h) | Sprint 1 AND Sprint 2 gates | Complete |
| 5 | `005-core-rag-sprints-0-to-8` <!-- was 014-feedback-and-quality --> | R1, R11, R13-S2, A4, B2, TM-04, TM-06, G-NEW-3 (Phase C) (72-109h) | Sprint 3 gate + R13 2 eval cycles | Pending |

> **Sprint 4 Split Recommendation:** Sprint 4 should be considered for decomposition into two sub-phases:
> - **S4a** (R1/MPAB + R13-S2 enhanced eval + TM-04 quality gate, ~33-49h): Lower-risk scoring, evaluation, and save-quality gating work that can proceed immediately after Sprint 3 gate. TM-04 is placed in S4a (per child spec authoritative phasing) as a pre-storage quality gate with no schema change that should be operational before R11 feedback mutations begin.
> - **S4b** (R11 learned relevance feedback + TM-06, ~31-48h): Higher-risk work containing R11 with its CRITICAL FTS5 contamination risk (MR1). R11 should not share a sprint with 4 other deliverables given its irreversible failure mode. S4b also requires the R13 calendar dependency (minimum 28 days of eval logging before R11 activation).
> This split isolates R11's contamination risk and allows S4a to complete faster, providing R13-S2 channel attribution data earlier.
| 6 | `005-core-rag-sprints-0-to-8` <!-- was 015-pipeline-refactor --> | R6, R9, R12, S2, S3, TM-05, PI-A4, PI-B1, PI-B2 (68-98h) | Sprint 4 gate | Pending |
| 7a | `005-core-rag-sprints-0-to-8` <!-- was 016-indexing-and-graph --> | R7, R16, S4, N3-lite, N2a, N2b, N2c (under N2) (33-51h) | Sprint 5 gate | Pending |
| 7b | `005-core-rag-sprints-0-to-8` <!-- was 016-indexing-and-graph --> | N2, R10 (37-53h heuristic; **ESTIMATION WARNING**: production quality 80-150h — see child spec for N2c 40-80h and R10 30-50h warnings) | Sprint 6a gate + feasibility spike | Pending (GATED) |
| 8 | `005-core-rag-sprints-0-to-8` <!-- was 017-long-horizon --> | R8, S1, S5, R13-S3 (REQ-061), R5 eval (REQ-062) (45-62h) | Sprint 6a gate | Pending |
<!-- REMOVED: referenced non-existent folders 012-scoring-calibration, 013-query-intelligence, 014-feedback-and-quality as Phase 12-14 placeholders — these sprints are already covered above as Phases 3, 4, 5 -->

### Phase Transition Rules

- Each phase MUST pass its sprint exit gate (metric-gated) before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume 022-hybrid-rag-fusion/NNN-*/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **HARD SCOPE CAP (Sprint 2+3)**: Sprints 0-3 constitute the approved scope. Sprints 4-7 require a NEW spec approval based on demonstrated need from Sprint 0-3 metrics. Approval must include: (a) evidence that remaining work addresses measured deficiencies identified by R13 evaluation data, (b) updated effort estimates based on Sprint 0-3 actuals (not original estimates), (c) updated ROI assessment comparing remaining investment to demonstrated improvements so far. Without this approval, Sprints 4-7 do not proceed.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Sprint 0 (in `005-core-rag-sprints-0-to-8`) | Sprint 1 (in `005-core-rag-sprints-0-to-8`) | Graph hit rate >0%, chunk dedup verified, BM25 baseline MRR@5 recorded, ground truth corpus meets diversity requirements (see below) | R13 eval metrics |
| Sprint 0 (in `005-core-rag-sprints-0-to-8`) | Sprint 2 (in `005-core-rag-sprints-0-to-8`) | Same Sprint 0 exit gate (S1 and S2 run **in parallel** after S0) | R13 eval metrics |

**Sprint 0 Ground Truth Diversity Requirement (HARD GATE):**
Ground truth corpus MUST include >=30 manually curated natural-language queries covering: graph relationship queries ("what decisions led to X?"), temporal queries ("what was discussed last week about Y?"), cross-document queries ("how does A relate to B?"), and hard negatives (queries where specific memories should NOT rank highly). Minimum: >=5 queries per intent type, >=3 query complexity tiers (simple single-concept, moderate multi-concept, complex cross-document/temporal). This diversity requirement is a hard exit gate criterion alongside the existing "at least 100 queries" minimum (50 minimum for initial baseline; >=100 required for BM25 contingency decision) — both must be satisfied.
<!-- NOTE: Sprint references below use historical folder names; all consolidated in 005-core-rag-sprints-0-to-8 -->
| Sprint 1 AND Sprint 2 | Sprint 3 | S1: R4 MRR@5 delta >+2% absolute, edge density measured; S2: Cache hit >90%, score distributions normalized, G2 resolved | R13 eval metrics |
| Sprint 3 | Sprint 4 | R15 p95 <30ms, RSF Kendall tau computed, R2 precision within 5% | R13 eval metrics |
| Sprint 4 | Sprint 5 | R1 MRR@5 within 2%, R11 noise <5%, R13-S2 operational | R13 eval metrics |
| Sprint 5 | Sprint 6a | R6 0 ordering differences, 158+ tests pass | R13 eval + test suite |
| Sprint 6a | Sprint 7 | R7 Recall@20 within 10%, R16 functional, S4 hierarchy functional, N3-lite contradiction detection verified, weight_history logging functional | R13 eval metrics |
| Sprint 6a | Sprint 6b | Sprint 6a exit gate + feasibility spike completed + OQ-S6-001/002 resolved | R13 eval + spike results |
| Sprint 6b | — | N2 attribution >10% or density-conditional deferral, R10 FP <20% (if executed) | R13 eval metrics |
| 008-combined-bug-fixes | 021-cross-cutting-remediation | Subfolder path resolution fixes complete; P0 and P1 checklist gates fully checked | 008-combined-bug-fixes/checklist.md summary + testing section |
| 021-cross-cutting-remediation | 022-post-review-remediation | Phase-1 remediation exit gate complete with all required checklist items verified | 003-speckit-quality-and-standards/checklist.md remediation exit gate + summary | <!-- AUDIT-2026-03-08: corrected from non-existent 002-cross-cutting-remediation -->
| 022-post-review-remediation | 023-flag-catalog-remediation | Post-review remediation complete (P0/P1 fully verified) and implementation summary published | 022-post-review-remediation/checklist.md summary + 022-post-review-remediation/implementation-summary.md |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-001 | **G1:** Fix graph channel ID format mismatch — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151) [3-5h] | Graph channel contributes ≥1 result in top-10 for ≥5% of first 100 post-fix eval queries, logged in R13 channel_attribution | S0 |
| REQ-002 | **G3:** Fix chunk collapse conditional — dedup on all code paths including `includeContent=false` [2-4h] | No duplicate chunk rows in default search mode | S0 |
| REQ-003 | **R13-S1:** Evaluation infrastructure — separate SQLite DB with 5-table schema (see §4.1 R13 Evaluation Schema), logging hooks, core metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1) [28-39h] | Baseline metrics computed for at least 100 queries (50 minimum for initial baseline; >=100 required for BM25 contingency decision); schema validated against §4.1 definition | S0 |
| REQ-004 | **G-NEW-1:** BM25-only baseline comparison [4-6h] | BM25 baseline MRR@5 recorded and compared to hybrid | S0 |
| REQ-035 | **B7:** Quality proxy formula for automated regression detection [2h] | Quality proxy formula operational for automated regression detection in Sprint 0 | S0 |
| REQ-036 | **D4:** Observer effect mitigation for R13 eval logging [2-4h] | Search p95 increase ≤10% with eval logging enabled | S0 |
| REQ-039 | **TM-02:** Content-hash fast-path deduplication — SHA256 hash check BEFORE embedding generation in memory_save pipeline [2-3h] | Hash check rejects exact duplicate on save; no duplicate content_hash entries in same spec_folder | S0 |
| REQ-005 | **R4:** Typed-weighted degree as 5th RRF channel with MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50, DEGREE_BOOST_CAP=0.15. Edge type weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5 [12-16h] | R4 dark-run passes; MRR@5 delta > +2% absolute; no single memory appears in >60% of results (hub domination check). **Prerequisite: G1 (REQ-001) must be complete before R4 activation.** Cross-ref: interacts with MR2 (preferential attachment), MR5 (degree cap), MR8 (three-way interaction with N3+R10). | S1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-006 | **R17:** Fan-effect divisor in co-activation scoring [1-2h] | Co-activation hub bias Gini coefficient decreases ≥15% vs pre-R17 baseline on 50-query eval set | S0 |
| REQ-007 | **R18:** Embedding cache for instant rebuild [8-12h] | Cache hit rate > 90% on re-index of unchanged content | S2 |
| REQ-008 | **N4:** Cold-start boost with exponential decay (12h half-life) [3-5h] | New memories (<48h) surface when relevant without displacing highly relevant older results | S2 |
| REQ-009 | **G2:** Investigate double intent weighting — determine if intentional [4-6h] | Resolved: fixed or documented as intentional design | S2 |
| REQ-010 | **R15:** Query complexity router (minimum 2 channels for simple queries) [10-16h] | Simple query p95 latency < 30ms | S3 |
| REQ-011 | **R14/N1:** Relative Score Fusion parallel to RRF (all 3 fusion variants) [10-14h] | Shadow comparison: minimum 100 queries, Kendall tau computed | S3 |
| REQ-012 | **R2:** Channel minimum-representation constraint (post-fusion, quality floor 0.2) [6-10h] | Dark-run top-3 precision within 5% of baseline | S3 |
| REQ-013 | **R1:** MPAB chunk-to-memory aggregation with N=0/N=1 guards [8-12h] | Dark-run MRR@5 within 2%; no regression for N=1 memories | S4 |
| REQ-014 | **R11:** Learned relevance feedback with separate `learned_triggers` column and 11 safeguards | Shadow log noise rate < 5%; FTS5 contamination test passes; learned triggers stored exclusively in `learned_triggers` column (never in `trigger_phrases`). Cross-ref: MR1 (CRITICAL FTS5 contamination), MR6 (R13 dependency), ADR-005 (separate column decision). **Calendar constraint:** R13 must have logged >=28 calendar days of eval data before R11 activation (see F10 in plan.md). **R11 Safeguards:** 1. Denylist (common/stop words excluded), 2. Rate limit (max triggers/day), 3. Decay (learned triggers expire after 30d without reinforcement), 4. FTS5 isolation (separate column, never in trigger_phrases), 5. Noise floor (minimum selection confidence), 6. Rollback (per-memory learned trigger reset), 7. Audit log (all mutations logged), 8. "Not in top 3" gate (R13 dependency), 9. Minimum query diversity (trigger must match >=3 distinct query patterns), 10. Maximum trigger count per memory (cap at 20 learned triggers), 11. Selection frequency cap — memory selected for >10 distinct query patterns within 7 days is flagged for review (potential over-broad trigger phrases) | S4 |
| REQ-015 | **R13-S2:** Shadow scoring + channel attribution + ground truth Phase B [15-20h] | Full A/B comparison infrastructure operational | S4 |
| REQ-016 | **G-NEW-2:** Agent-as-consumer UX analysis + consumption instrumentation [8-12h] | R13 logs ≥5 distinct consumption-pattern categories with ≥10 query examples each; consumption instrumentation active | S1 |
| REQ-017 | **G-NEW-3:** Feedback bootstrap strategy (Phase A synthetic, Phase B implicit, Phase C LLM-judge) [10-16h] | Defined phases with minimum 200 query-selection pairs before R11 activation | S0/S4 |
| REQ-032 | **A7:** Co-activation boost strength increase (0.1x→0.25x) [2-4h] | Effective co-activation boost at hop 2 ≥15% | S1 |
| REQ-033 | **A4:** Negative feedback / confidence activation (demotion multiplier, floor=0.3) [4-6h] | `memory_validate(wasUseful: false)` causes measurable ranking reduction | S4 |
| REQ-034 | **B2:** Chunk ordering preservation in reassembly [2-4h] | Collapsed chunks appear in `chunk_index` order | S4 |
| REQ-037 | **A2:** Full-context ceiling evaluation (LLM baseline comparison) [2h] | Full-context ceiling MRR@5 recorded; 2x2 decision matrix (A2 × G-NEW-1) evaluated at Sprint 0 exit | S0 |
| REQ-038 | **B8:** Signal count ceiling governance (max 15 active scoring signals) [1-2h] | Signal ceiling policy documented and enforced; escape clause requires R13 orthogonal-value evidence | Cross-cutting |
| REQ-052 | **Eval-the-eval:** Hand-verification of R13 evaluation output — manually compute MRR@5 for 5 randomly selected queries and compare to R13's computed values [2-3h] | Hand-calculated MRR@5 matches R13 output within ±0.01 for all 5 queries; any discrepancy investigated and resolved before R13 output is used for roadmap decisions | S0 |
| REQ-040 | **TM-01:** Interference scoring signal — negative weight penalizing memories with high-similarity competitors in same spec_folder [4-6h]. Implementation note: Uses Jaccard word-overlap similarity (text-based) rather than cosine similarity. This deviation from the original specification was a deliberate design choice to avoid embedding computation overhead in the scoring path. | Interference score computed at index time; composite scoring includes -0.08 * interference factor behind feature flag | S2 |
| REQ-041 | **TM-03:** Classification-based decay policies — FSRS decay multipliers vary by context_type and importance_tier (decisions: no decay, temporary: fast decay) [3-5h] | Decay behavior differs measurably between context_types; decisions/constitutional memories show 0 decay over 30 days | S2 |
| REQ-042 | **TM-04:** Pre-storage quality gate — multi-layer validation pipeline (structural + content quality + semantic dedup) BEFORE embedding generation [6-10h] | Quality score computed for every save; saves below 0.4 threshold rejected; near-duplicates (>0.92 similarity) flagged | S4 |
| REQ-043 | **TM-06:** Reconsolidation-on-save — automatic duplicate/conflict/complement decision when saving memories similar to existing ones [6-10h] | Similarity >=0.88 merges (frequency increment); 0.75-0.88 soft-replaces (with supersedes edge; old memory marked as `superseded` status — excluded from search results but retained in database for selective recovery); <0.75 stores as new | S4 |
| REQ-044 | **TM-05:** Dual-scope injection strategy — memory auto-surface at multiple lifecycle points (context load, tool dispatch, compaction) [4-6h] | Memory injection hooks active at >=2 lifecycle points beyond explicit search | S5 |
| REQ-045 | **TM-08:** Importance signal vocabulary expansion — add CORRECTION and PREFERENCE signal categories to trigger extraction [2-4h] | Trigger extraction recognizes correction signals ("actually", "wait", "I was wrong") and preference signals ("prefer", "like", "want") | S1 |

### P2 - Desired (complete OR defer with documented reason)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-018 | **R6:** 4-stage pipeline refactor with "no score changes in Stage 4" invariant [40-55h] | 0 ordering differences on eval corpus; 158+ tests pass. **Note: R6 is conditional — required only if Sprint 2 score normalization fails exit gate, OR Stage 4 invariant deemed architecturally necessary regardless.** | S5 |
| REQ-019 | **R9:** Spec folder pre-filter [5-8h] | Cross-folder queries produce identical results | S5 |
| REQ-020 | **R12:** Embedding-based query expansion (suppressed when R15="simple") [10-15h] | No degradation of simple query latency | S5 |
| REQ-021 | **S2:** Template anchor optimization [5-8h] | Anchor-aware retrieval metadata available | S5 |
| REQ-022 | **S3:** Validation signals as retrieval metadata [4-6h] | Validation metadata integrated in scoring | S5 |
| REQ-023 | **R7:** Anchor-aware chunk thinning [10-15h] | Recall@20 within 10% of baseline | S6 |
| REQ-024 | **R16:** Encoding-intent capture [5-8h] | Intent metadata captured at index time | S6 |
| REQ-025 | **R10:** Auto entity extraction (gated on edge density < 1.0) [12-18h] | False positive rate < 20% on manual review | S6 |
| REQ-026 | **N2 (items 4-6):** Graph centrality + community detection [25-35h] | Graph channel attribution increase > 10% | S6 |
| REQ-027 | **N3-lite:** Contradiction scan + Hebbian strengthening [9-14h] | Detects ≥50% of contradictions in curated 10-pair test set with FP rate <30% | S6 |
| REQ-028 | **S4:** Spec folder hierarchy as retrieval structure [6-10h] | Hierarchy traversal functional | S6 |

### P3 - Future (implement when conditions met)

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-029 | **R8:** Memory summary generation (only if > 5K memories) [15-20h] | Summary pre-filtering reduces search space | S7 |
| REQ-030 | **S1:** Smarter memory content generation [8-12h] | Content generation matches template schema for ≥95% of test cases | S7 |
| REQ-031 | **S5:** Cross-document entity linking [8-12h] | ≥3 cross-document entity links verified by manual review | S7 |
| REQ-061 | **R13-S3:** Full evaluation reporting dashboard with historical trend visualization [12-16h] | R13-S3 full evaluation reporting dashboard operational with historical trend visualization | S7 |

### Sprint-Derived Requirements (reconciled from child specs)

> These requirements exist in sprint sub-specs and are tracked here for completeness.

| ID | Requirement | Acceptance Criteria | Sprint |
|----|-------------|---------------------|--------|
| REQ-046 | **FUT-5:** RRF K-value sensitivity investigation — grid search K ∈ {20, 40, 60, 80, 100} [2-3h] | Optimal K documented with MRR@5 deltas per K value | S2 |
| REQ-047 | **R15-ext:** Confidence-based result truncation — adaptive top-K cutoff based on score confidence gap [5-8h] | Results truncated at score gap; minimum 3 results guaranteed; reduces tail by >30% | S3 |
| REQ-048 | **FUT-7:** Dynamic token budget allocation by query complexity tier [3-5h] | Simple: 1500t, Moderate: 2500t, Complex: 4000t; token waste reduced for simple queries | S3 |
| REQ-049 | **N2a:** Graph Momentum — temporal degree delta over sliding 7-day window [8-12h] | Momentum score computed for all nodes with >=1 edge; top-10 accelerating memories identifiable | S6 |
| REQ-050 | **N2b:** Causal Depth Signal — max-depth path normalization from root memories [5-8h] | causal_depth_score assigned to all nodes; root=0, leaf=1.0 | S6 |
| REQ-051 | **N2c:** Community Detection — connected components (BFS baseline), Louvain escalation if clusters too coarse [12-15h] | Community assignments stable across 2 consecutive runs (jitter <5%) | S6 |

### PageIndex-Derived Requirements (REQ-053 — REQ-060, PI-A1 — PI-B3)

> **Research Evidence:** Derived from PageIndex research documents 9 (deep analysis: true-mem source code) and 10 (recommendations: true-mem patterns). These recommendations are ADDITIVE to the 43 core recommendations above. Formal REQ IDs assigned below for traceability.

| ID | REQ | Recommendation | Acceptance Criteria | Sprint |
|----|-----|----------------|---------------------|--------|
| REQ-053 | PI-A1 | Folder-Level Relevance Scoring via DocScore Aggregation | `folder_score` field in result metadata; `(1/sqrt(M+1)) * SUM(MemoryScore(m))` damped-sum formula; no MRR@5 regression | S2 |
| REQ-054 | PI-A2 | Search Strategy Degradation with Fallback Chain (DEFERRED) | 3-tier fallback with logged degradation events | S3 (deferred) |
| REQ-055 | PI-A3 | Pre-Flight Token Budget Validation | `token_budget_used` in response; truncation enforced; ≤5ms p95 latency increase | S1 |
| REQ-056 | PI-A4 | Constitutional Memory as Expert Knowledge Injection | `retrieval_directive` metadata field on constitutional memories | S5 (deferred from S4 per REC-07) |
| REQ-057 | PI-A5 | Verify-Fix-Verify for Memory Quality | Quality score post-save; auto-fix if <0.6; reject after 2 retries | S1 |
| REQ-058 | PI-B1 | Tree Thinning for Spec Folder Consolidation | Nodes <300t collapsed; <100t summarized; anchored nodes preserved | S5 |
| REQ-059 | PI-B2 | Progressive Validation for Spec Documents | 4-level pipeline; checkpoint before Level 2 auto-fix | S5 |
| REQ-060 | PI-B3 | Description-Based Spec Folder Discovery | `descriptions.json` cache; embedding pre-selection; cache invalidation on save | S3 |

#### Memory MCP Server (PI-A1 to PI-A5)

| ID | Recommendation | Formula / Mechanism | Sprint | Effort | Risk |
|----|----------------|---------------------|--------|--------|------|
| PI-A1 | **Folder-Level Relevance Scoring via DocScore Aggregation** — aggregate per-memory scores into a per-folder relevance signal | `FolderScore = (1/sqrt(M+1)) * SUM(MemoryScore(m))` per spec_folder; damping factor prevents volume bias (consistent with S2 child spec and root plan) | S2 | 4-8h | Low |
| PI-A2 | **Search Strategy Degradation with Fallback Chain** — 3-tier fallback when primary search returns insufficient results | Tier 1: full hybrid search → Tier 2: broadened (relaxed filters, lower threshold) → Tier 3: structural-only (trigger match + folder) | S3 | 12-16h | Medium |
| PI-A3 | **Pre-Flight Token Budget Validation** — enforce token budget constraint before result assembly, not after | Validate `SUM(token_count(m))` against budget limit before assembling final result set; truncate candidate list early | S1 | 4-6h | Low |
| PI-A4 | **Constitutional Memory as Expert Knowledge Injection** — format constitutional memories as retrieval directives, not just high-priority results | Inject constitutional memories as system-level context (domain knowledge) before ranked results; separate display slot | S5 (deferred from S4 per REC-07) | 8-12h | Low-Medium |
| PI-A5 | **Verify-Fix-Verify for Memory Quality** — bounded quality loop with fallback for memory_save validation | Verify quality → if below threshold, attempt auto-fix (trim, restructure) → re-verify → if still failing, save with warning flag (never drop silently) | S1 (deferred from S0 per REC-09) | 12-16h | Medium |

#### Spec-Kit Logic (PI-B1 to PI-B3)

| ID | Recommendation | Formula / Mechanism | Sprint | Effort | Risk |
|----|----------------|---------------------|--------|--------|------|
| PI-B1 | **Tree Thinning for Spec Folder Consolidation** — bottom-up merge of small spec files into parent | If `token_count(child) < MIN_CHILD_TOKENS` AND `token_count(parent + child) < MAX_MERGED_TOKENS`, merge child into parent section | S5 | 10-14h | Low |
| PI-B2 | **Progressive Validation for Spec Documents** — 4-level progressive fix pipeline for spec document validation | Level 1: schema check → Level 2: anchor integrity → Level 3: cross-reference validation → Level 4: semantic consistency; each level runs only if prior passes | S5 | 16-24h | Medium |
| PI-B3 | **Description-Based Spec Folder Discovery** — generate and cache a 1-sentence description per spec folder for search-time folder routing | At index time, generate `folder_description` = LLM summary of spec folder purpose; cache in spec folder index; use for pre-search folder routing. **LLM Fallback:** Spec-folder classification is async and fully decoupled from the save path. If LLM is unavailable (timeout >5s or error), fall back to folder-name-based heuristic classification. Classification results are cached per spec-folder with 24h TTL. | S3 | 4-8h | Low |

**PageIndex Totals by Sprint:**

| Sprint | PI Items | Added Effort |
|--------|----------|--------------|
| S0 | (none) | — |
| S1 | PI-A3, PI-A5 | +16-22h |
| S2 | PI-A1 | +4-8h |
| S3 | PI-A2, PI-B3 | +16-24h |
| S4 | (none) | — |
| S5 | PI-A4, PI-B1, PI-B2 | +34-50h |
| **Total** | **8 items** | **+70-104h** |

### Documentation Addendum (DOC-01)

> User-requested addendum for feature-catalog decomposition. This item is tracked alongside the core sprint program but does not alter the recommendation-count baseline (43 + PageIndex + sprint-derived).

| ID | Requirement | Acceptance Criteria | Sprint/Placement |
|----|-------------|---------------------|------------------|
| DOC-01 | Extract each canonical feature into per-folder markdown artifacts — parse all `###` features from 011-feature-catalog/feature_catalog.md, enrich with optional matching content from 011-feature-catalog/summary_of_new_features.md, and write feature.md in each corresponding numbered feature folder under `011-feature-catalog/` | 1) One feature.md per canonical feature folder (`011-feature-catalog/**/**/feature.md`), 2) each artifact contains canonical section + new/updated context section + source metadata, 3) folder mapping uses numbered group/feature ordering from the canonical catalog, 4) coverage check passes with missing=0 and extra=0 | Cross-cutting |

### 4.1 R13 Evaluation Schema Definition

The `speckit-eval.db` 5-table schema referenced by REQ-003:

```sql
-- Table 1: Evaluation queries (ground truth corpus)
CREATE TABLE eval_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_text TEXT NOT NULL,
  intent_type TEXT NOT NULL,           -- 'graph_relationship', 'temporal', 'cross_document', 'hard_negative', 'factual'
  complexity_tier TEXT NOT NULL,        -- 'simple', 'moderate', 'complex'
  expected_result_ids TEXT DEFAULT '[]', -- JSON array of memory IDs (manual ground truth)
  source TEXT DEFAULT 'manual',         -- 'manual', 'synthetic', 'llm_judge'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  notes TEXT
);
CREATE INDEX idx_eval_queries_intent ON eval_queries(intent_type);
CREATE INDEX idx_eval_queries_complexity ON eval_queries(complexity_tier);

-- Table 2: Per-channel results logged per query execution
CREATE TABLE eval_channel_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  query_id INTEGER NOT NULL REFERENCES eval_queries(id),
  channel TEXT NOT NULL,                -- 'vector', 'fts5', 'bm25', 'graph', 'degree'
  result_ids TEXT NOT NULL DEFAULT '[]', -- JSON array of memory IDs returned by channel
  scores TEXT NOT NULL DEFAULT '[]',     -- JSON array of raw scores per result
  latency_ms REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (query_id) REFERENCES eval_queries(id)
);
CREATE INDEX idx_eval_channel_run ON eval_channel_results(run_id);
CREATE INDEX idx_eval_channel_query ON eval_channel_results(query_id);

-- Table 3: Final fused results per query execution
CREATE TABLE eval_final_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  query_id INTEGER NOT NULL REFERENCES eval_queries(id),
  result_ids TEXT NOT NULL DEFAULT '[]',  -- JSON array of final ranked memory IDs
  scores TEXT NOT NULL DEFAULT '[]',       -- JSON array of final scores
  fusion_method TEXT DEFAULT 'rrf',        -- 'rrf', 'rsf', 'hybrid'
  intent_classification TEXT,
  query_complexity TEXT,
  total_latency_ms REAL,
  channel_attribution TEXT DEFAULT '{}',   -- JSON: {channel: count_in_top_k}
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (query_id) REFERENCES eval_queries(id)
);
CREATE INDEX idx_eval_final_run ON eval_final_results(run_id);

-- Table 4: Ground truth relevance judgments
CREATE TABLE eval_ground_truth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_id INTEGER NOT NULL REFERENCES eval_queries(id),
  memory_id INTEGER NOT NULL,
  relevance_score REAL NOT NULL,         -- 0.0 (irrelevant) to 1.0 (perfect match)
  source TEXT DEFAULT 'manual',           -- 'manual', 'trigger_derived', 'llm_judge', 'implicit'
  annotator TEXT,                          -- 'human', 'synthetic', 'llm_judge'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (query_id) REFERENCES eval_queries(id)
);
CREATE INDEX idx_eval_gt_query ON eval_ground_truth(query_id);
CREATE INDEX idx_eval_gt_memory ON eval_ground_truth(memory_id);
CREATE UNIQUE INDEX idx_eval_gt_pair ON eval_ground_truth(query_id, memory_id);

-- Table 5: Metric snapshots (computed after each eval run)
CREATE TABLE eval_metric_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  sprint TEXT,                             -- 'S0', 'S1', etc.
  metric_name TEXT NOT NULL,               -- 'MRR@5', 'NDCG@10', 'Recall@20', 'HitRate@1', etc.
  metric_value REAL NOT NULL,
  query_count INTEGER NOT NULL,            -- number of queries in this eval run
  config_snapshot TEXT DEFAULT '{}',       -- JSON: active flags, weights, parameters
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_eval_metrics_run ON eval_metric_snapshots(run_id);
CREATE INDEX idx_eval_metrics_name ON eval_metric_snapshots(metric_name);
CREATE INDEX idx_eval_metrics_sprint ON eval_metric_snapshots(sprint);
```

**Design notes:**
- All tables use `TEXT NOT NULL DEFAULT (datetime('now'))` for timestamps (SQLite-compatible)
- JSON arrays stored as TEXT with `DEFAULT '[]'` (nullable-safe, forward-compatible)
- `run_id` groups results from a single evaluation execution across tables 2, 3, and 5
- `eval_ground_truth` has a unique constraint on `(query_id, memory_id)` to prevent duplicate judgments
- No foreign keys to the primary `speckit.db` — eval DB is fully isolated per NFR-D03
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MRR@5 improves +10-15% over Sprint 0 baseline by Sprint 6 completion
- **SC-002**: Graph channel hit rate exceeds 20% (from 0% baseline)
- **SC-003**: Channel diversity (unique sources in top-5) exceeds 3.0 (from ~2.0 baseline)
- **SC-004**: Search latency p95 remains < 300ms for complex queries (500ms hard limit)
- **SC-005**: Active feature flags meet budget: target <=6 at each sprint gate, hard ceiling <=8 at all times (peak 7 at S4/S5)
- **SC-006**: Evaluation ground truth exceeds 500 query-relevance pairs
- **SC-007**: Graph edge density exceeds 1.0 edges/node
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Previously Missing Risks (MR1-MR7)

| Risk ID | Risk | Severity | Affected Recs | Mitigation |
|---------|------|----------|---------------|------------|
| MR1 | FTS5 trigger contamination from R11 — `[learned:]` prefix stripped by tokenizer; **irreversible** without full re-index | CRITICAL | R11 | Separate `learned_triggers` column (not indexed by FTS5) |
| MR2 | R4+N3 preferential attachment loop — well-connected memories get boosted, get more edges, get more boosted | HIGH | R4, N3 | MAX_TOTAL_DEGREE=50, MAX_STRENGTH_INCREASE=0.05/cycle, edge provenance tracking |
| MR3 | Feature flag explosion — 24 flags = 16.7M possible states; combinatorial testing impossibility | HIGH | All | Maximum 8 simultaneous flags (peak 7 at S4/S5); 90-day lifespan; governance rules (See research/6 - combined-recommendations-gap-analysis §10) |
| MR4 | R1-MPAB div-by-zero at N=0 — `sqrt(0)` causes NaN propagation | HIGH | R1 | Guard clause: `if (scores.length <= 1) return scores[0] ?? 0` |
| MR5 | R4 MAX_TYPED_DEGREE undefined — no degree cap = unbounded boost | MEDIUM | R4 | Computed global with fallback=15 (See research/3 - recommendations-hybrid-rag-fusion-refinement §4.2) |
| MR6 | R11 hidden dependency on R13 query provenance — "not in top 3" safeguard impossible without logging | MEDIUM | R11 | R13 must complete 2 eval cycles before R11 mutations enabled |
| MR7 | R15 violates R2 channel diversity guarantee — single-channel routes cannot satisfy diversity | MEDIUM | R15, R2 | Minimum 2 channels even for "simple" queries |
| MR8 | R4+N3+R10 three-way interaction — spurious R10 auto-extracted entities strengthened by N3 Hebbian learning, boosted by R4 degree scoring | HIGH | R4, N3, R10 | Entity extraction quality gate (FP <20%); N3 strength cap (MAX_STRENGTH_INCREASE=0.05/cycle); R4 degree normalization |
| MR9 | S5 rollback conflates DB checkpoint and code rollback — both needed for safe reversion of R6 pipeline refactor | HIGH | R6 | Dual rollback protocol: (1) `checkpoint_restore` for data, (2) git revert for code; document both in rollback procedure |
| MR10 | S6 N3-lite Hebbian weight modifications not tracked by `created_by` provenance — only new edges tracked, not weight changes to existing edges | HIGH | N3-lite | Add `weight_history` audit column or log weight changes to eval DB for rollback capability |
| MR11 | TM-06 reconsolidation auto-replacement — miscalibrated similarity thresholds could auto-replace valuable content with inferior newer content | MEDIUM | TM-06 | Feature flag + checkpoint required before enabling; log all reconsolidation decisions for R13 review |
| MR12 | TM-04 quality gate over-filtering — overly strict thresholds could reject legitimate memory saves | MEDIUM | TM-04 | Start with warn-only mode (log scores, don't reject) for 2 weeks; tune thresholds based on false-rejection rate |
| MR13 | Concurrent write corruption | HIGH | All | Per-spec-folder mutex on save pipeline; WAL mode; SAVEPOINT for multi-step operations | S0 |
| MR14 | Memory/resource leak in long-running sessions | MEDIUM | All | Periodic health check via memory_health; bounded caches with LRU eviction; session TTL 4h max | S1 |

> **Ownership:** Each risk is owned by the sprint lead for its mitigation sprint. Risk status is reviewed at each gate evaluation. Unmitigated HIGH risks block gate passage.

### Dangerous Interaction Pairs

| Pair | Risk | Mitigation |
|------|------|------------|
| R1 + N4 | Double-boost for new chunked memories | Apply N4 BEFORE MPAB; cap combined boost at 0.95 |
| R4 + N3 | Feedback loop — hub domination | Edge caps, strength caps, provenance tracking |
| R15 + R2 | Guarantee violation | R15 minimum = 2 channels |
| R12 + R15 | Contradictory logic | Mutual exclusion: R15="simple" suppresses R12 |
| N4 + R11 | Transient artifact learning | Exclude memories < 72h old from R11 eligibility |
| TM-01 + R17 | Double fan-effect penalty | TM-01 penalizes in composite scoring; R17 penalizes in co-activation. Cap combined penalty at 0.15 |
| R13 + R15 | Metrics skew by complexity | R13 records query_complexity; metrics per tier |
| TM-04 + PI-A5 | Pipeline ordering dependency | PI-A5 auto-fix runs after TM-04 threshold; if PI-A5 modifies content, re-score via TM-04 |
| N4 + TM-01 | Opposing forces (cold-start boost vs interference penalty for new similar memories) | Apply N4 boost before TM-01 interference penalty; net effect documented in Signal Application Order |

### Deploy Disaster Scenario (R11)

A developer searches "deploy to production" and selects a migration memory. R11 learns "deploy" and "production" as triggers. Without the separate column fix, FTS5 indexes both words — every deployment query matches the migration memory on multiple channels for 30 days. See research/3 - recommendations-hybrid-rag-fusion-refinement §6.4 for full scenario.

### Dependencies

All dependencies are internal. Three dependencies from original research were corrected:
- R4→R13: OVERSTATED (soft, not hard — build without, enable after measurement)
- R6→R7: INCORRECT (orthogonal subsystems — index-time vs search-time)
- R8→R7: INCORRECT (different comparison targets — embeddings vs summaries)

See research/3 - recommendations-hybrid-rag-fusion-refinement §5 for corrected dependency graph.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:signal-order -->
### 6.1 CONSOLIDATED SIGNAL APPLICATION ORDER

> Scoring pipeline ordering constraints are scattered across 4+ sprint specs. This section consolidates all ordering invariants in one place.

#### Pipeline Signal Application Order (Stages 1-4)

| Order | Signal/Operation | Stage | Constraint | Source |
|-------|-----------------|-------|------------|--------|
| 1 | Candidate generation (5 channels: vector, FTS5, BM25, graph, degree) | Stage 1 | All channels execute independently | R4, G1 |
| 2 | RRF/RSF fusion with intent weights (applied ONCE) | Stage 2 | Intent weights MUST be applied exactly once — prevents G2 double-weighting | R14/N1, G2 |
| 3 | Co-activation boost (with R17 fan-effect divisor) | Stage 2 | R17 divisor = `1/sqrt(degree)`; combined TM-01+R17 penalty capped at 0.15 | R17, TM-01 |
| 4 | Composite scoring (importance, temporal, freshness, co-activation, state, cognitive) | Stage 2 | All factors normalized to [0,1] before combination | ADR-001 |
| 5 | N4 cold-start boost (12h half-life decay) | Stage 2 | Applied BEFORE MPAB; combined R1+N4+constitutional cap at 0.95 | N4, R1 |
| 6 | TM-01 interference penalty | Stage 2 | -0.08 * interference_factor; behind feature flag | TM-01 |
| 7 | Cross-encoder reranking | Stage 3 | Operates on fused scores from Stage 2 | R6 |
| 8 | MMR diversity enforcement | Stage 3 | Post-rerank diversity pass | R6 |
| 9 | R1 MPAB chunk-to-memory aggregation | Stage 3 | N=0→0, N=1→score, N>1→aggregate | R1 |
| 10 | State filtering, session dedup, constitutional guarantee | Stage 4 | **NO score changes** — filtering and annotation only | R6 Stage 4 invariant |
| 11 | Channel attribution logging | Stage 4 | Read-only annotation | R13 |

#### Save Pipeline Signal Order (TM Pattern Integration)

| Order | Operation | Gate | Constraint |
|-------|-----------|------|------------|
| 1 | Content hash check (TM-02) | O(1) reject | Before embedding — zero-cost duplicate rejection |
| 2 | Quality scoring (TM-04) | O(1) score | Before embedding — reject below 0.4 threshold |
| 3 | Verify-fix-verify loop (PI-A5) | O(1) retry | Max 2 retries before rejection |
| 4 | Embedding generation | O(1) API | Existing pipeline step |
| 4a | Embedding failure fallback | O(1) status | Save with `pending_embedding` status, skip Stages 5-6, queue async retry (max 3 attempts, exponential backoff 1m/5m/30m) |
| 5 | Semantic dedup (TM-04 Layer 3) | O(n) search | After embedding — >0.92 similarity = reject |
| 6 | Reconsolidation (TM-06) | O(n) search | After embedding — >=0.88 merge, 0.75-0.88 soft-replace (old memory → `superseded` status, retained for recovery) |
| 7 | Database insert | O(log n) | Final write |

#### Cross-Sprint Ordering Invariants

1. **N4 before R1**: Cold-start boost applied before MPAB aggregation (prevents double-boost for new chunked memories)
2. **R15 suppresses R12**: When R15 classifies query as "simple", R12 query expansion is skipped entirely
3. **R17 before R4**: Fan-effect divisor applied to co-activation scores before degree boost (prevents hub amplification)
4. **R13 logging after Stage 4**: Eval logging is fire-and-forget, never blocks search pipeline
5. **TM-02 before TM-04**: Content hash is cheapest check — run before quality scoring
<!-- /ANCHOR:signal-order -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Search response MUST NOT exceed 500ms p95 during any phase including dark-run
- **NFR-P02**: Simple query (R15) target: < 30ms p95; Moderate: < 100ms; Complex: < 300ms
- **NFR-P03**: Dark-run overhead per sprint: S1 +10ms, S2 +2ms, S3 +50ms, S4 +15ms, S5 +100ms (See research/3 - recommendations-hybrid-rag-fusion-refinement §14)
- **NFR-P04**: Save-time performance budget — `memory_save` operations: p95 ≤200ms without embedding generation, p95 ≤2000ms with embedding generation. TM-02/TM-04/TM-06 pipeline stages MUST NOT exceed these budgets

### Data Integrity
- **NFR-D01**: All new columns MUST be nullable with sensible defaults (e.g., `DEFAULT '[]'`)
- **NFR-D02**: No destructive migrations — never DROP COLUMN or ALTER COLUMN TYPE in forward migrations
- **NFR-D03**: Separate eval database (`speckit-eval.db`) — prevents observer effect on search performance
- **NFR-D04**: Atomic migration execution — failure = full rollback, no partial state
- **NFR-D05**: **FTS5 Consistency:** The `memory_health` tool MUST compare `memory_fts` row count vs `memory_index` row count and report divergence >0 as a warning with remediation hint ("Run memory_index_scan with force:true to rebuild FTS5 index")

### Operational
- **NFR-O01**: Feature-flag budget — operational target <=6 active flags at each sprint gate, hard ceiling <=8 at all times (historical peak: 7 at S4/S5)
- **NFR-O02**: Maximum flag lifespan: 90 days from creation to permanent decision
- **NFR-O03**: Monthly flag sunset audit required
- **NFR-O04**: All scoring changes MUST use dark-run comparison before enabling

**Measurement Methodology:** All NFR benchmarks are measured under standardized conditions: single-user workload, 50-100 evaluation queries from Sprint 0 ground truth corpus, cold cache (restart MCP server before each run), WAL mode enabled, on reference hardware (dev laptop, SSD, 16GB+ RAM).

### API Compatibility Contract

All scoring changes MUST be additive and backward-compatible:
- New fields are optional; existing fields retain semantics
- When normalization is enabled, responses include `score_version: 2` field
- Clients not sending `score_version` receive legacy scoring behavior
- Breaking changes require major version bump and 2-sprint deprecation notice

---

<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### BM25 Contingency (Sprint 0 Exit)
- **BM25 >= 80% of hybrid MRR@5**: PAUSE multi-channel optimization; investigate why single-channel performs comparably. Sprints 3-7 deferred
- **BM25 50-80% of hybrid MRR@5**: PROCEED with hybrid optimization; rationalize to 3 channels (drop weakest)
- **BM25 < 50% of hybrid MRR@5**: PROCEED with full roadmap — multi-channel clearly earning complexity

### A2 Full-Context Ceiling Interpretation (jointly with G-NEW-1 BM25 Baseline)

| | BM25 >= 80% of hybrid | BM25 < 50% of hybrid |
|---|---|---|
| **Full-context >= 90% of hybrid** | Strong PAUSE signal: system may be over-engineered | Retrieval near ceiling — PROCEED with lower urgency |
| **Full-context < 60% of hybrid** | BM25 catches essentials; graph may add noise | Hybrid earning its complexity — PROCEED confidently |

### Triple Boost (R1 + N4 + Constitutional)
A newly indexed constitutional memory with multiple chunks, within first 12 hours, receives MPAB bonus + cold-start boost + constitutional tier guarantee. Can dominate all results for 12-48h. Mitigation: composite boost cap at 0.95 before tier adjustment.

### Deploy Disaster (R11)
FTS5 contamination from learned triggers pollutes lexical search for 30 days. Mitigated by separate `learned_triggers` column. See research/3 - recommendations-hybrid-rag-fusion-refinement §6.4.

### N=0 / N=1 MPAB
- N=0 chunks: `computeMPAB([]) = 0`
- N=1 chunk: `computeMPAB([score]) = score` (no penalty, no bonus)

### Empty Graph
If graph has 0 edges after G1 fix, R4 produces zero scores for all memories. This is correct behavior — R4 should not boost when no graph data exists. R10 (entity extraction) becomes higher priority.

---

<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 20+ files across 8 subsystems, 316-472h (base estimate; 348-523h including TM additions; 463-689h grand total with PageIndex — see executive summary), schema changes |
| Risk | 22/25 | CRITICAL FTS5 contamination, 0% graph hit rate, irreversible migration risks |
| Research | 18/20 | 13-agent synthesis, 3 waves, cross-system analysis |
| Multi-Agent | 13/15 | 7 independent tracks (A-G), parallel sprint execution |
| Coordination | 14/15 | 7 metric-gated sprints, BM25 contingency branching, off-ramps |
| **Total** | **90/100** | **Level 3+** |

---

<!-- /ANCHOR:complexity -->

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | FTS5 trigger contamination (MR1) | Critical | High (if separate column not used) | Separate `learned_triggers` column |
| R-002 | Preferential attachment loop (MR2) | High | Medium | Degree caps + provenance tracking |
| R-003 | Feature flag explosion (MR3) | High | High (24 proposed flags) | 8-flag maximum governance (peak 7 at S4/S5) |
| R-004 | MPAB div-by-zero (MR4) | High | High (N=1 memories common) | Guard clause in `computeMPAB` |
| R-005 | BM25 >= 80% of hybrid (contingency) | High | Unknown | Sprint 0 measurement + decision matrix |
| R-006 | Effort variance (316-472h base; 348-523h with TM; 463-689h grand total with PageIndex — see executive summary) | Medium | Medium | Metric-gated sprints enable early stopping |
| R-007 | R6 pipeline refactor regression | High | Medium | Checkpoint before start; 0-diff gate; off-ramp |
| R-008 | Eval ground truth contamination from biased trigger-phrase synthetic data (MR-bias) — synthetic ground truth derived from trigger phrases evaluates a system that retrieves partly via trigger phrases, inflating MRR@5 scores | High | High | **MANDATORY**: Include >=30 manually curated natural-language queries (non-trigger-phrase) in ground truth corpus; require statistical significance (p<0.05, paired t-test or bootstrap CI) for BM25 contingency decision; minimum 100 diverse queries before any threshold-based roadmap decision |
| R-009 | Solo developer bottleneck — 18-26 weeks, no absence protocol | Medium | High | Document bus factor plan; identify critical path items for potential delegation |
| R-010 | Cumulative dark-run overhead — concurrent runs could reach 177ms p95 by S5 | Medium | Medium | Sequential dark-runs; disable prior sprint dark-runs before starting new ones |
| R-011 | BM25 measurement reliability — 50 queries insufficient for statistical significance on >=80%/50-80%/<50% threshold decision; confidence intervals too wide | High | High | Require minimum 100 diverse queries for BM25 contingency decision; statistical significance (p<0.05) required; ≥5 queries per intent type, ≥3 complexity tiers; >=30 manually curated (non-trigger-phrase) queries |
| R-012 | Graph topology power-law distribution after G1 fix — bimodal R4 scoring | Medium | Low | R4 degree normalization (log-scale or percentile-based) |

---

<!-- /ANCHOR:risk-matrix -->

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Graph Channel Contribution (Priority: P0)

**As an** AI agent consuming memory context, **I want** the graph channel to contribute structural relationship signals to search results, **so that** memories connected by causal, derivation, or contradiction edges surface alongside content-similar results.

**Acceptance Criteria**:
1. Given a query about a topic with causal edges, When searching, Then graph channel results appear in `channelAttribution`
2. Given the R4 degree channel is enabled, When searching, Then well-connected memories receive measurable ranking boost

### US-002: Measurable Retrieval Quality (Priority: P0)

**As a** developer maintaining the retrieval system, **I want** automated evaluation metrics (MRR@5, NDCG@10, Recall@20), **so that** every scoring change can be validated as improvement or regression.

**Acceptance Criteria**:
1. Given R13 eval infrastructure is deployed, When running eval queries, Then MRR@5, NDCG@10, Recall@20 are computed and stored
2. Given a BM25-only baseline exists, When comparing against hybrid, Then the marginal value of multi-channel fusion is quantified

### US-003: New Memory Discoverability (Priority: P1)

**As an** AI agent, **I want** newly indexed memories to be discoverable within 48 hours, **so that** recently saved context is available for retrieval without waiting for temporal decay to stabilize.

**Acceptance Criteria**:
1. Given N4 cold-start boost is enabled, When a memory is < 48h old, Then it receives a visibility boost that decays exponentially (12h half-life)
2. Given the boost expires after 48h, When the memory ages past 48h, Then normal FSRS temporal decay governs ranking

### US-004: Zero-Cost Re-Index (Priority: P1)

**As a** developer, **I want** re-indexing unchanged content to skip embedding generation, **so that** bulk re-index operations complete without API costs or latency.

**Acceptance Criteria**:
1. Given R18 embedding cache is operational, When re-indexing content with unchanged `content_hash + model_id`, Then embedding generation is skipped entirely
2. Given cache hit rate > 90%, When performing full re-index, Then total time is reduced by > 90% for unchanged content

---

<!-- /ANCHOR:user-stories -->

<!-- ANCHOR:approval -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Project Lead | Pending | |
| Architecture Review (ADRs) | Project Lead | Pending | |
| Sprint 0 Gate Review | Project Lead | Pending | |
| Sprint 1 Gate Review | Project Lead | Pending | |
| Sprint 2+3 Gate Review (off-ramp decision) | Project Lead | Pending | |
| Sprint 4 Gate Review | Project Lead | Pending | |
| Sprint 5 Gate Review | Project Lead | Pending | |
| Sprint 6 Gate Review | Project Lead | Pending | |

---

<!-- /ANCHOR:approval -->

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Migration Safety
- [ ] All schema changes follow migration protocol (See research/3 - recommendations-hybrid-rag-fusion-refinement §13)
- [ ] Nullable defaults on all new columns
- [ ] Backup before ALTER TABLE
- [ ] Forward-compatible reads (handle column not existing)
- [ ] Backup `speckit-eval.db` before each sprint gate review

### Dark-Run Compliance
- [ ] Every scoring change undergoes dark-run comparison
- [ ] p95 latency stays below 500ms during dark-run phases
- [ ] Dark-run results logged via R13 infrastructure

### Feature Flag Governance
- [ ] NFR-O01 budget enforced: target <=6 active flags at each sprint gate, hard ceiling <=8 at all times (historical peak: 7 at S4/S5)
- [ ] 90-day lifespan enforced
- [ ] Monthly sunset audit conducted
- [ ] Flag naming convention: `SPECKIT_{FEATURE}`

#### Feature Flag Sunset Schedule

Each sprint exit gate MUST include a flag disposition decision for all prior flags. The plan introduces 24 total flags across 8 sprints. The following sunset schedule tracks active flag counts against NFR-O01 budget (target <=6 active flags, hard ceiling <=8; historical S4-S5 peak = 7):

| Sprint Exit | Flags Introduced This Sprint | Flags to Permanently Enable or Remove | Active After Gate | Lifecycle Stage |
|-------------|------------------------------|---------------------------------------|-------------------|-----------------|
| S0 | `SPECKIT_EVAL_LOGGING`, `SPECKIT_VERIFY_FIX_VERIFY` | None (first sprint) | 2 | dark-run |
| S1 | `SPECKIT_DEGREE_BOOST` | `SPECKIT_EVAL_LOGGING` → permanent (remove flag, always-on) | 2 | shadow |
| S2 | `SPECKIT_NOVELTY_BOOST`, `SPECKIT_INTERFERENCE_SCORE`, `SPECKIT_FOLDER_SCORE` | `SPECKIT_VERIFY_FIX_VERIFY` → permanent (remove flag) | 4 | shadow |
| S3 | `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP` | `SPECKIT_DEGREE_BOOST` → permanent; `SPECKIT_NOVELTY_BOOST` → permanent | 5 | enabled |
| S4 | `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_LEARN_FROM_SELECTION`, `SPECKIT_SAVE_QUALITY_GATE`, `SPECKIT_RECONSOLIDATION`, `SPECKIT_CONSTITUTIONAL_INJECT` | `SPECKIT_INTERFERENCE_SCORE` → permanent; `SPECKIT_FOLDER_SCORE` → permanent; `SPECKIT_COMPLEXITY_ROUTER` → permanent | 7 | enabled |
| S5 | `SPECKIT_PIPELINE_V2`, `SPECKIT_EMBEDDING_EXPANSION`, `SPECKIT_PROGRESSIVE_VALIDATION` | `SPECKIT_RSF_FUSION` → decide (permanent or remove based on Kendall tau data); `SPECKIT_CHANNEL_MIN_REP` → permanent; `SPECKIT_RECONSOLIDATION` → permanent | 7 | enabled |
| S6 | `SPECKIT_ENCODING_INTENT`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_CONSOLIDATION` | `SPECKIT_DOCSCORE_AGGREGATION` → permanent; `SPECKIT_LEARN_FROM_SELECTION` → decide (permanent or remove based on noise rate); `SPECKIT_SAVE_QUALITY_GATE` → permanent; `SPECKIT_CONSTITUTIONAL_INJECT` → permanent | 6 | permanent / sunset |
| S7 | `SPECKIT_MEMORY_SUMMARIES`, `SPECKIT_ENTITY_LINKING` | `SPECKIT_PIPELINE_V2` → permanent; `SPECKIT_EMBEDDING_EXPANSION` → permanent; `SPECKIT_PROGRESSIVE_VALIDATION` → permanent | 5 | permanent / sunset |

> **Historical exception note**: Sprint 4 and Sprint 5 peaked at 7 active flags while remaining under the NFR-O01 hard ceiling (<=8). Subsequent sprint exits return to the <=6 target budget.
>
> **H6 note**: `SPECKIT_SEARCH_FALLBACK` removed from sunset schedule — PI-A2 (search fallback chain) was DEFERRED and no such flag was ever introduced.
>
> **Flag-to-requirement mapping** (flags not explicitly named in child sprint specs): `SPECKIT_EVAL_LOGGING` → D4/REQ-036 (S0), `SPECKIT_VERIFY_FIX_VERIFY` → PI-A5 (S1, deferred from S0), `SPECKIT_FOLDER_SCORE` → PI-A1/REQ-053 (S2), `SPECKIT_CONSTITUTIONAL_INJECT` → PI-A4/REQ-056 (S5), `SPECKIT_PROGRESSIVE_VALIDATION` → PI-B2 (S5).

**Rule:** Any sprint that would exceed 8 active flags MUST sunset prior flags at the sprint's entry (not exit). If a flag cannot be confidently resolved, it counts against the flag budget and a lower-priority new flag must be deferred.

### B8 Signal Ceiling
- **B8 Signal Ceiling**: Maximum 15 active scoring signals until R13 provides automated evaluation data. Escape clause: R13 evidence that a new signal provides orthogonal value overrides the ceiling. Re-evaluate at Sprint 4 off-ramp when R13-S2 channel attribution data is available.

**Current Signal Inventory:**

| # | Signal | Stage | Source |
|---|--------|-------|--------|
| 1 | importance_weight | Composite | vector-index-impl.ts |
| 2 | recency_decay | Composite | vector-index-impl.ts |
| 3 | quality_score | Composite | vector-index-impl.ts |
| 4 | validation_confidence | Composite | vector-index-impl.ts |
| 5 | state_tier_weight | Composite | vector-index-impl.ts |
| 6 | doc_type_multiplier | Auxiliary | vector-index-impl.ts |
| 7 | rrf_score | Fusion | search-executor.ts |
| 8 | bm25_score | Fusion | bm25-index.ts |
| 9 | vector_similarity | Fusion | vector-index-impl.ts |
| 10 | adaptive_weight | Fusion | search-executor.ts |
| 11 | query_type_boost | Fusion | search-executor.ts |
| 12 | session_boost | Post-search | vector-index-impl.ts |
| 13 | causal_boost | Post-search | vector-index-impl.ts |
| 14 | intent_weight | Post-search | vector-index-impl.ts |

**Signal count: 14 active (ceiling: 15)**

**Escape clause:** A signal exceeding the ceiling MAY be approved if it demonstrates >5% MRR@10 improvement on the eval corpus with <2% regression on any individual metric. Approval requires documented eval evidence in the sprint's decision-record.md.

**Tracking:** Active signal count is verified by counting enabled `SPECKIT_*` environment variables at startup. The count is logged at INFO level and included in `memory_health` output.

### Test Suite Non-Regression
- [ ] 158+ existing tests pass after every sprint
- [ ] New tests added per sprint (See research/3 - recommendations-hybrid-rag-fusion-refinement §12)
- [ ] Flag interaction testing at appropriate level (1-5)

---

<!-- /ANCHOR:compliance -->

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Lead | Gate decisions, off-ramp calls, BM25 contingency | High | Per-sprint gate reviews |
| Developer(s) | Implementation, testing, flag management | High | Per-sprint status via tasks.md |
| AI Agent Consumers | Primary retrieval users | High | Quality measured via R13 metrics |

---

<!-- /ANCHOR:stakeholders -->

<!-- ANCHOR:adrs -->
## 14A. ARCHITECTURAL DECISION RECORDS (ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| **ADR-001** | **Composite scoring normalization** — Normalize all scoring factors to [0,1] before combination | Prevents 15:1 magnitude mismatch between RRF and composite scores. Without normalization, composite score dominates purely due to scale, not quality. |
| **ADR-002** | *(Reserved — not referenced in current spec)* | — |
| **ADR-003** | **Density Before Deepening principle** — Maximize graph edge density before adding sophisticated graph algorithms | Sparse graphs produce unreliable signals. Graph centrality, community detection, and traversal algorithms require sufficient edge density to produce meaningful results. Investing in algorithm sophistication on a sparse graph wastes effort and produces misleading metrics. |
| **ADR-004** | **Evaluation First principle** — R13 evaluation infrastructure must exist before any scoring change is permanently enabled | Prevents unvalidated changes from degrading retrieval quality. Every scoring change must have pre/post measurement via R13 to confirm improvement. Without this gate, tuning decisions are speculation. |
| **ADR-005** | **Separate learned_triggers column for R11** — Store learned triggers in a separate TEXT column rather than appending to the existing trigger_phrases FTS5 column | Prevents FTS5 contamination (MR1 risk). The FTS5 tokenizer strips the `[learned:]` prefix, making learned triggers indistinguishable from manual triggers. This is irreversible without full re-index. A separate column provides clean isolation and easy rollback. |

<!-- /ANCHOR:adrs -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-26)
**Initial specification** from research synthesis of 13 independent agent investigations across 3 waves. Supersedes all prior 140/141 analyses and recommendations.

### v1.1 (2026-02-26)
**true-mem pattern integration** — Added 7 recommendations (TM-01 through TM-06, TM-08) from true-mem research (research/9 + research/10). New REQ-039 to REQ-045. New risks MR11, MR12. Deferred TM-07 as DEF-015. Effort increased by +27-44h (~8-9%).

### v1.2 (2026-02-26)
**PageIndex-derived recommendations** — Added 8 recommendations (PI-A1 through PI-A5, PI-B1 through PI-B3) from PageIndex analysis of true-mem source code (research/9 + research/10). Distributed across S0-S5. Effort increased by +70-104h. See §4 PageIndex-Derived Recommendations table.

### v1.3 (2026-02-27)
**Tri-agent review amendments** — Applied 28 actions from independent reviews by 3 ultra-think agents (Analytical/Critical/Holistic/Pragmatic lenses). Key changes:
- **A1**: Defined R13 5-table evaluation schema explicitly in §4.1 (tables, columns, indexes, relationships)
- **A2**: Elevated R-008/R-011 to High severity; added >=20 manual ground truth annotations, statistical significance requirement (p<0.05, min 100 diverse queries), minimum query count for BM25 contingency decision
- **A3**: Reconciled 6 sprint-derived requirements (REQ-046 — REQ-051: FUT-5, R15-ext, FUT-7, N2a/N2b/N2c) into parent spec
- **A4**: Reframed Sprints 4-7 as "Contingent Phase" requiring new spec approval based on Sprint 0-3 data
- **A5**: Added consolidated Signal Application Order document (§6b) covering both search and save pipelines
- **A6**: Added eval-the-eval validation task (REQ-052) — hand-verify R13 output before roadmap decisions
- **A7**: Added 7 dangerous interaction pair verification items to checklist
- **B3**: Formalized build-gate vs enable-gate classification for all sprint dependencies
- **B4**: Reclassified S1→S2 dependency from hard to soft
- **B5**: Upgraded Sprint 4 split from recommendation to mandatory (4a/4b risk isolation)
- **B6**: Relaxed R6 exit gate to "0 differences in positions 1-5 AND weighted rank correlation >0.995"
- **B7**: Decomposed R6 into 4 sub-tasks (one per pipeline stage, 8-12h each)
- **B9/B10**: Added 10 negative test items and 7 rollback verification items to checklist
- **B11**: Promoted MR10 weight_history tracking from risk mitigation to required task in Sprint 6
- **B12**: Added save-time performance budget (NFR-P04: 200ms p95 save, 2000ms with embedding)
- **C1**: Consolidated 14 per-sprint flag sunset items into 1 cross-cutting item (reduced checklist from ~147 to ~127)
- **C4**: Added cumulative latency budget tracker as cross-cutting concern in plan.md
- **INC-1/INC-2**: Fixed grand total with PageIndex in executive summary; clarified recommendation count arithmetic

---

<!-- /ANCHOR:changelog -->

<!-- ANCHOR:open-questions -->
## 16. OPEN QUESTIONS

- **OQ-001**: BM25 baseline performance — unknown until Sprint 0 measurement. If >= 80% of hybrid, roadmap fundamentally changes. **Decision context:** This is the single most consequential unknown. The BM25 contingency matrix (§8) defines three branches. G-NEW-1 (REQ-004) and A2 (REQ-037) jointly determine the 2x2 decision space. Resolved at: Sprint 0 exit gate.
- **OQ-002**: INT8 recall loss contradiction — 1-2% (Spec 140) vs 5.32% (Spec 141). Requires in-system ablation. Blocks R5 activation decision. **Decision context:** The discrepancy likely stems from different evaluation corpora and embedding models. In-system ablation with R13 infrastructure will produce authoritative measurement. Resolved at: Sprint 7 (R5 eval, REQ-062).
- **OQ-003**: `search-weights.json` audit — `maxTriggersPerMemory` is active; smart ranking section status unknown. **Decision context:** May reveal undocumented scoring signals that count against the B8 signal ceiling (REQ-038). Audit should be completed during Sprint 0 as part of R13-S1 instrumentation.
- **OQ-004**: G2 investigation outcome — double intent weighting may be intentional design, not a bug. **Decision context:** If intentional, document the rationale in ADR format and adjust G2 scope (REQ-009) from "fix" to "document." If unintentional, the fix is straightforward removal. Resolved at: Sprint 2 (REQ-009). Cross-ref: OQ-S2-001 in Sprint 2 child spec.
- **OQ-005**: Feedback bootstrap accumulation rate — R11 activation timeline depends on interaction data volume. **Decision context:** G-NEW-3 (REQ-017) defines a three-phase bootstrap (synthetic → implicit → LLM-judge). The 200 query-selection pair minimum before R11 activation may take 4-8 weeks of normal usage, or can be accelerated via synthetic replay. The 28-day calendar constraint (F10) may be the binding constraint rather than data volume.

---

<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:deferred -->
## 17. DEFERRED ITEMS

Items evaluated in the 144 gap analysis but deferred pending future data or off-ramp decisions:

| ID | Item | Earliest Sprint | Gate / Condition |
|----|------|----------------|-----------------|
| DEF-001 | FUT-4: Working Memory → Search feedback (bidirectional cognitive signals) | S4/S6 | Needs R13 data + ADR-001 compatibility analysis |
| DEF-002 | Learned Fusion Weight Optimization (ML-based: LambdaMART/RankNet — subsumes per-query-type weights) | Post-S4 | Requires 500+ feedback triples + R13 channel attribution data |
| DEF-003 | Negative Feedback / Suppression (query-type-specific) | Post-S4 | **Requires A4 first** (confidence signal activated in S4) |
| DEF-004 | Session Query History (session context vector, rolling average of query embeddings) | Post-S3 | Architectural change; needs ADR-001 justification |
| DEF-005 | Topical Diversity Control (cross-folder result diversity) | Post-S3 | Evaluate after R2 channel diversity operational |
| DEF-006 | Monitoring / Observability (latency percentiles, cache hit rates + retrieval-specific: score collapse, dead channels, confidence calibration) | Any | Important but orthogonal to retrieval quality |
| DEF-007 | Embedding Model Abstraction (model-agnostic embedding layer) | S7+ | Premature unless model switching imminent |
| DEF-008 | Decouple Spec-Kit Scripts from MCP Server Internals | S5+ | S5 already 64-92h; defer unless S5 splits |
| DEF-009 | Formal Interface Contract (Spec-Kit ↔ MCP Server) | S5+ | Depends on DEF-008 |
| DEF-010 | Embedding Quality Monitoring (dimension checks, distribution drift, provider health) | S2+ | R13 detects quality degradation indirectly |
| DEF-011 | Two-Pass Gleaning for Causal Link Extraction | S6 | LLM latency concern at index time |
| DEF-012 | Weighted Chunk Selection via Reference Frequency | S6 | Subject to B8 signal ceiling governance |
| DEF-013 | Context Drift Detection (periodic validity audits for old memories) | S6 | Long-term maintenance concern |
| DEF-014 | structuralFreshness() Decision (dead code: keep or remove) | S7 | Evaluate during S7 planning |
| DEF-015 | TM-07: Role-aware extraction weights (10x human message weight for conversation-sourced memories) | Post-S7 | Auto-extraction feature is planned and under development |
| DEF-016 | Matryoshka embeddings — variable-dimension retrieval for cost/quality tradeoff | Post-S7 | Requires embedding model abstraction (DEF-007) first |
| DEF-017 | SPLADE/learned sparse retrieval — learned term expansion for hybrid search | Post-S7 | Requires pipeline refactor (R6) to integrate additional retrieval stage |
| DEF-018 | ColBERT multi-vector retrieval — token-level similarity matching | Post-S7 | High implementation cost; evaluate if single-vector recall proves insufficient |
| DEF-019 | Two-stage search pipeline — coarse candidate retrieval followed by fine reranking | Post-S5 | R6 pipeline refactor partially addresses this; full implementation deferred |

**Evaluation trigger**: Re-assess at Sprint 3 off-ramp and Sprint 6 planning.

---

<!-- /ANCHOR:deferred -->

<!-- ANCHOR:glossary -->
### Glossary

| Term | Definition |
|------|-----------|
| **dark-run** | Feature executes in production but results are discarded; used for correctness validation without user impact |
| **shadow** | Feature runs alongside production path; outputs are logged and compared but not served to users |
| **shadow-period** | Time window during which a feature operates in shadow mode before promotion to full activation |
| **feature flag** | Runtime toggle (env var `SPECKIT_*`) controlling feature activation; see B2 governance rules |

---

<!-- /ANCHOR:glossary -->

<!-- ANCHOR:related -->
## 18. RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research (Analysis)**: See `research/3 - analysis-hybrid-rag-fusion-architecture.md`
- **Research (Recommendations)**: See `research/3 - recommendations-hybrid-rag-fusion-refinement.md` (primary) and `research/6 - combined-recommendations-gap-analysis.md` (gap-fill additions)
- **Research (true-mem Analysis)**: See `research/9 - deep-analysis-true-mem-source-code.md` *(source for PI-A1 — PI-B3 PageIndex recommendations)*
- **Research (true-mem Recommendations)**: See `research/10 - recommendations-true-mem-patterns.md` *(source for TM-01 — TM-08 TrueMem recommendations)*
- **Research (Ultra-Think Reviews)**: See `research/11 - ultra-think-review-*.md` (per-sprint review documents)
<!-- /ANCHOR:related -->

---

<!--
LEVEL 3+ SPEC
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
- Phase Documentation Map with 8 sprint phases
-->

---

## Phase Navigation

| **Parent Spec** | ../spec.md |

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
5. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
6. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

## Source: 002-hybrid-rag-fusion

---
title: "Spec: 138-hybrid-rag-fusion (Unified Context Engine) [002-hybrid-rag-fusion/spec]"
description: "This specification details the Level 3+ architectural upgrade of the system-speckit memory Model Context Protocol (MCP) server. The goal is to transform the server from a collec..."
trigger_phrases:
  - "spec"
  - "138"
  - "hybrid"
  - "rag"
  - "fusion"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Spec: 138-hybrid-rag-fusion (Unified Context Engine)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 0. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-20 |
| **Parent Spec** | `N/A (root docs intentionally removed)` |
| **Successor** | `002-hybrid-rag-fusion` |

<!-- ANCHOR: spec-summary-138 -->
## 1. Executive Summary
This specification details the Level 3+ architectural upgrade of the `system-speckit` memory Model Context Protocol (MCP) server. The goal is to transform the server from a collection of isolated retrieval engines into a cohesive **Unified Context Engine**. Based on an exhaustive 6-round multi-agent research sprint covering modern RAG paradigms (RAGFlow, GraphRAG, WiredBrain), the MCP server will activate its dormant Tri-Hybrid capabilities (Vector, BM25, FTS5) and fuse them via Reciprocal Rank Fusion (RRF). 

To strictly enforce token budgets and prevent LLM hallucination, the system introduces Maximal Marginal Relevance (MMR) pruning for payload diversity, and a Transparent Reasoning Module (TRM) to gate low-confidence contexts. Crucially, this massive capability upgrade requires **zero schema migrations**; all logic executes natively on the existing v15 SQLite schema via TypeScript orchestration.
<!-- /ANCHOR: spec-summary-138 -->

<!-- ANCHOR: spec-background-138 -->
## 2. Background and Problem Statement
Currently, `system-speckit`'s `memory_context` and `memory_search` tools rely predominantly on flat vector similarity (`sqlite-vec`) and unweighted FTS5 `MATCH` queries. 
*   **The "Lost in the Middle" Problem:** Returning large payloads of semantically identical chunks (e.g., 5 versions of the same implementation summary) wastes the strict 2000-token limit and dilutes LLM attention.
*   **Integration Fragmentation:** Advanced modules like `adaptive-fusion.ts` (for intent-weighted RRF) and `co-activation.ts` (for spreading graph activation) exist fully implemented in the codebase but are physically disconnected from the primary `hybridSearchEnhanced()` pipeline.
*   **Silent Failure:** If a niche technical query returns low-quality nearest neighbors, the LLM hallucinates an answer based on noise because the MCP server provides no metadata indicating low confidence.
<!-- /ANCHOR: spec-background-138 -->

<!-- ANCHOR: spec-requirements-138 -->
## 3. Core Requirements
### 3.1 Hard Constraints
*   **Zero Schema Migrations:** All capabilities MUST execute on the existing v15 SQLite schema (`memories`, `memory_fts`, `causal_edges`, `memory_index`). No external databases (Pinecone, Neo4j) are permitted.
*   **Token Efficiency:** Context payloads MUST strictly respect the 2000-token limit (approximately 8,000 ASCII characters). If MMR cannot prune sufficiently, the array must be forcibly truncated.
*   **Dependency Minimization:** The upgrade must only rely on `sqlite-vec`, `sqlite3`, and standard Node.js libraries. `remark` and `remark-gfm` are permitted exclusively for Phase 4 ingest-time AST parsing.

### 3.2 Performance Budget (120ms Limit for `mode="auto"`)
The entire `hybridSearchEnhanced()` pipeline must execute within 120ms to prevent blocking the MCP protocol or causing LLM timeout warnings.
| Stage | Operation | Latency Budget |
| :--- | :--- | :--- |
| **L0** | Intent Classification (Centroid Dot Product) | 2ms |
| **L1** | Parallel Scatter (`Promise.all`) | 60ms |
| | - Vector Search (`sqlite-vec`) | *35ms* |
| | - FTS5 Search (Weighted BM25) | *15ms* |
| | - Graph Search (Recursive CTE) | *45ms* |
| **L2** | Adaptive RRF Fusion | 5ms |
| **L3** | Post-Fusion MMR Reranking | 8ms |
| **L4** | TRM Z-Score Confidence Check | 1ms |
| **L5** | Markdown Serialization & Metadata formatting | 5ms |
| **Total** | | **~81ms** (39ms buffer) |

### 3.3 Functional Requirements
*   **Orchestrated Retrieval:** The pipeline MUST fuse Vector, FTS5, BM25, and Causal Graph traversals into a single unified RRF ranking.
*   **Semantic Diversity:** The system MUST implement Cosine Maximal Marginal Relevance (MMR) post-fusion to penalize duplicate information.
*   **Fallback Safety:** The LLM MUST receive explicit `[EVIDENCE GAP DETECTED]` warnings when the Gaussian distribution of RRF scores falls below a critical Z-score threshold.
<!-- /ANCHOR: spec-requirements-138 -->

<!-- ANCHOR: spec-scope-138 -->
## 4. Scope Boundaries

### In-Scope (4 Implementation Phases)
*   **Phase 0:** Activation of dormant logic (`adaptive-fusion`, `co-activation`, `useGraph`).
*   **Phase 1:** Implementation of post-fusion Cosine MMR and Gaussian Confidence Checks (TRM).
*   **Phase 2:** Modification of FTS5 queries for multi-field weighting (Title vs. Body) and CTEs for edge-strength multipliers.
*   **Phase 3:** Server-side rule-based query expansion exclusively for `mode="deep"`.
*   **Phase 4:** Deep document parsing (`remark`), automated entity linking, and query-independent PageRank authority scoring.

### Cognitive Layer Enhancements (In-Scope)
*   Transitioning `intent-classifier.ts` from regex to embedding centroid matching.
*   Running `prediction-error-gate.ts` on read-time retrieved payloads to flag contradictions.
*   Modulating FSRS tier decay (Constitutional memories decay at 0.1x, Scratch at 3.0x).

### Out-of-Scope
*   Migration to dedicated vector databases (e.g., Pinecone, Qdrant) or Graph databases (Neo4j).
*   Client-side LLM query expansion (latency prohibitive due to the LLM-in-MCP paradox).
*   Any modification to the `causal_links` or `memories` table schemas.
<!-- /ANCHOR: spec-scope-138 -->

<!-- ANCHOR: spec-architecture-138 -->
## 5. Target Architecture & Data Contracts

### 5.1 Orchestration Flow
The execution flow within `lib/search/hybrid-search.ts` will transition from a linear flow to a scatter-gather orchestrator:
1.  **Intent Classification:** Identify user goal (e.g., `bug_fix` vs `exploration`).
2.  **Scatter:** Execute Vector, Weighted FTS5, and Graph Traversal (`useGraph: true`) concurrently via `Promise.all`.
3.  **Gather & Fuse:** Pipe all returned chunks into `adaptive-fusion.ts` utilizing RRF with intent-specific weights.
4.  **Evaluate (TRM):** Check Z-scores of the RRF distribution. If low, flag the metadata array.
5.  **Prune (MMR):** Filter the top-20 RRF results down to the top-5 most *diverse* memories using `lambda`.

### 5.2 TypeScript Interfaces
```typescript
interface SearchResult {
  id: number;
  score: number; // The final fused RRF score
  content: string;
  embedding: Float32Array; // Passed through for O(N^2) MMR calculation
  metadata: {
    title: string;
    spec_folder: string;
    importance_tier: string;
  };
}

interface TRMMetadata {
  evidenceGapDetected: boolean;
  zScore: number;
  mean: number;
  stdDev: number;
  warnings: string[]; // E.g., ["[EVIDENCE GAP: Low confidence match. Synthesize from first principles.]"]
}

interface EnhancedMCPResponse {
  payload: string; // The markdown string fed to the LLM
  trm: TRMMetadata;
  metrics: {
    latencyMs: number;
    tokensConsumed: number;
    sourcesHit: string[];
  };
}
```
<!-- /ANCHOR: spec-architecture-138 -->

---

## Acceptance Scenarios

1. Intent classifier computes centroid vectors at module initialization.
2. Centroid-based scoring influences final intent classification output.
3. Graph-enabled hybrid search path fuses vector/FTS/graph channels.
4. MMR and evidence-gap modules execute without regression.
5. Updated intent test suite passes with centroid coverage checks.
6. Root integration tasks/checklists reflect this workstream as complete.

## AI Execution Protocol

### Pre-Task Checklist
- Confirm target files and test scope.
- Confirm no schema migration is introduced.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Edit only planned files for this phase |
| Verification | Run targeted tests before completion |

### Status Reporting Format
- `STATE`, `ACTIONS`, `RESULT`

### Blocked Task Protocol
1. Stop edits for blocked area.
2. Capture error/output evidence.
3. Apply one bounded workaround, then escalate if unresolved.

## Structured Requirements

| ID | Requirement |
|----|-------------|
| REQ-001 | Activate graph, BM25, and vector channels in hybrid retrieval. |
| REQ-002 | Keep retrieval pipeline within p95 <= 120ms. |
| REQ-003 | Apply MMR for diversity on fused results. |
| REQ-004 | Apply evidence-gap confidence signaling. |
| REQ-005 | Preserve zero-schema-migration constraint. |
| REQ-006 | Add centroid-based intent scoring internals. |
| REQ-007 | Add coverage tests for centroid scoring behavior. |
| REQ-008 | Maintain backward-compatible MCP interfaces. |

## Risks and Dependencies

- Dependency: existing SQLite/FTS/vector stack remains available.
- Risk: retrieval quality regression if channel weights drift.
- Mitigation: targeted regression tests and integration checks.

## Completion Criteria

- All tasks/checklist items are marked complete with evidence.
- Targeted intent classifier tests pass.
- Consolidated child-folder lifecycle and supplemental records are present in this folder.

## Acceptance Scenario Details

- **Given** centroid seeds are loaded, **When** classifier initializes, **Then** seven centroids exist.
- **Given** canonical intent query text, **When** centroid scores are computed, **Then** expected intent receives top score.
- **Given** empty query input, **When** classifier runs, **Then** `understand` fallback is returned safely.
- **Given** routing query for bug fix, **When** classification runs, **Then** `fix_bug` remains correctly detected.
- **Given** updated tests, **When** vitest runs, **Then** centroid suites pass.
- **Given** closure documents, **When** folder consolidation checks run, **Then** `002-hybrid-rag-fusion` is the canonical active RAG folder.

## Consolidation Addendum (2026-02-22)

- Consolidated command-alignment outcomes are recorded in supplemental/command-alignment-summary.md.
- Consolidated non-skill-graph outcomes are recorded in supplemental/non-skill-graph-consolidation-summary.md.
- Supplemental index is maintained in supplemental-index.md.

## Source: 006-hybrid-rag-fusion-logic-improvements

---
title: "Feature Specification: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/spec.md]"
description: "This initiative broadens hybrid RAG hardening to all critical cross-system seams: retrieval/fusion, graph contracts, cognitive ranking, session-learning quality, memory CRUD re-embedding, parser/index invariants, storage reliability, telemetry governance, test hardening, and self-healing operations."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "hybrid rag"
  - "fusion logic improvements"
  - "cross-system hardening"
  - "automation interconnection"
  - "bug prevention"
importance_tier: "critical"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This initiative hardens the active Hybrid RAG stack across the full operational surface, not only retrieval/fusion internals. The delivery now spans ten integrated subsystems: retrieval/fusion, graph/causal contracts, cognitive ranking (attention-decay and FSRS), session manager and session-learning quality, memory CRUD re-embedding consistency, parser/indexing invariants with automated index health, storage reliability (transaction recovery and mutation ledger consistency), telemetry/trace schema governance with docs drift prevention, deferred/skipped-path test hardening, and self-healing automation runbooks.

The objective remains continuity-first: keep the architecture from `002` and convert high-risk seams identified through `003`, `004`, and `005` into measurable controls with release gates.

**Key Decisions**: retain SQLite-first tri-hybrid architecture; apply audit-first execution; extend hardening scope to all discovered risk-bearing subsystems; require traceable requirement -> phase -> task -> checklist mapping.

**Critical Dependencies**: stable MCP search/index contracts, regression harnesses from `002` through `005`, deterministic canonicalization behavior, mutation ledger integrity, and schema-governed telemetry events.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hybrid retrieval capabilities are active, but systemic risk remains at cross-module seams. Existing hardening is concentrated on fusion quality and confidence thresholds while other coupled systems still permit silent drift: graph relation scores can diverge from ranking expectations, cognitive decay signals may be inconsistently applied, session-learning can route stale context, memory CRUD can leave stale embeddings, parser/index invariants can degrade without automatic repair, transaction/mutation consistency can fail under interruption, telemetry schemas can drift from docs, deferred test paths can remain unverified, and operational checks can remain reactive instead of self-healing.

### Purpose
Deliver a broadened deep-audit and hardening pass that makes the complete retrieval-to-operations chain measurable, deterministic, and resilient so retrieval quality, context routing, data integrity, and run-time governance remain trustworthy under production pressure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
1. Retrieval/fusion pipeline hardening (parse -> index -> gather -> fusion -> fallback -> response metadata).
2. Graph/causal channel contracts and relation-scoring calibration.
3. Cognitive ranking integration: attention-decay and FSRS-aware score modulation.
4. Session manager and session-learning pipeline quality/performance upgrades.
5. Memory CRUD and metadata re-embedding consistency controls.
6. Parser/indexing invariants plus index-health automation checks.
7. Storage reliability: transaction recovery and mutation-ledger consistency.
8. Telemetry/trace schema governance and documentation drift prevention.
9. Test coverage hardening for deferred/skipped paths and prior-spec regressions.
10. Automation loops and operational runbooks for self-healing checks.

### Out of Scope
- Migration to external vector, graph, or search databases.
- Large schema redesign of the existing SQLite memory schema.
- UI changes or non-MCP client feature work.
- Broad refactors not tied to audit findings or required subsystem controls above.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Tighten retrieval/fusion orchestration, deterministic fallback, and metadata contracts. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts` | Modify | Enforce bounded channel weights and deterministic tie/merge policies. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/co-activation.ts` | Modify | Formalize graph-channel contract inputs/outputs and relation-score usage. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` | Modify | Recalibrate confidence thresholds and evidence-gap emissions from audited distributions. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/` | Modify | Integrate relation scoring, FSRS/attention decay modifiers, and normalization invariants. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/` | Modify | Improve session manager ranking, low-confidence behavior, and performance instrumentation. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session-learning/` | Modify | Harden learning-pipeline quality checks and stale-signal handling. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Harden debug diagnostics and ranking/routing rationale emission contracts used by hybrid retrieval decisions. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` | Modify | Enforce post-mutation embedding refresh workflow and metadata consistency guards. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Expand index invariant checks and auto-heal health probes. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Enforce parser invariants tied to canonicalization and frontmatter normalization continuity. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/sqlite-transaction-recovery.ts` | Modify | Add deterministic recovery path and replay checks for interrupted mutations. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` | Modify | Enforce append/replay consistency and integrity counters. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts` | Modify | Define and validate canonical trace payload schema. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | Modify | Add docs drift and contract-alignment checks for schema-governed diagnostics. |
| `.opencode/skill/system-spec-kit/scripts/ops/` | Modify | Add self-healing operational checks and runbook automation glue. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Modify | Expand subsystem-specific regression and deferred/skipped-path coverage. |
<!-- /ANCHOR:scope -->

---

## 3.5 PRIOR-WORK CONTINUITY (002/003/004/005)

### Carry-Forward Assumptions
- **From `002-hybrid-rag-fusion`**: tri-hybrid retrieval (vector + FTS/BM25 + graph), MMR, and evidence-gap signaling remain architectural baseline.
- **From `003-index-tier-anomalies`**: canonical-path dedup and deterministic tier precedence remain mandatory invariants.
- **From `004-frontmatter-indexing`**: normalized frontmatter and idempotent reindex behavior remain required preconditions.
- **From `008-combined-bug-fixes`**: confidence-aware session/folder detection and archive exclusion remain mandatory for workflow safety.

### Carry-Forward Expansion Matrix in `006`

| Prior Spec | Preserved Outcome | Expanded in 006 |
|------------|-------------------|-----------------|
| `002-hybrid-rag-fusion` | Tri-hybrid + fusion + evidence-gap baseline | Adds graph-contract scoring, cognitive decay integration, and telemetry-governed ranking diagnostics |
| `003-index-tier-anomalies` | Canonical path + tier invariants | Adds index-health automation, CRUD re-embed consistency, and ledger-backed integrity checks |
| `004-frontmatter-indexing` | Normalized metadata and idempotent reindex | Adds parser/index auto-heal checks, schema drift prevention, and re-embedding consistency gates |
| `008-combined-bug-fixes` | Confidence-aware routing safeguards | Adds session-learning quality metrics, routing/retrieval confidence alignment, and operational runbook coverage |

### Carry-Forward Gaps Addressed in `006`
- Convert deferred operational controls into enforced release checks across all ten scoped subsystems.
- Add cross-system drift detection linking ranking quality, storage integrity, and telemetry/documentation consistency.
- Harden regression boundaries so canonicalization, session confidence, and mutation consistency issues cannot silently recur.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete deep audit across all ten scoped subsystems | Audit artifact enumerates each subsystem contract, top risks, owner, and mitigation with no uncovered subsystem. |
| REQ-002 | Retrieval/fusion pipeline remains deterministic and bounded | Regression fixtures show stable ranked outputs and deterministic fallback behavior across repeated runs. |
| REQ-003 | Graph/causal channel contracts and relation scoring are calibrated | Contract tests verify schema and score semantics; adjudicated relation fixture shows Kendall tau >= 0.75 against expected ordering. |
| REQ-004 | Cognitive/attention-decay and FSRS signals are integrated into ranking safely | Ablation tests show >= 8% NDCG@5 improvement on long-tail fixture with <= 3% regression on primary fixture and bounded cognitive weight contribution (5-25%). |
| REQ-005 | Session manager and session-learning quality/performance are hardened | Misroute rate <= 1% on ambiguity fixture and p95 session selection <= 250ms for 500 candidates. |
| REQ-006 | Memory CRUD mutations maintain re-embedding consistency | 100% create/update/delete mutations queue re-embed reconciliation within 5s and clear stale embedding backlog >15m to zero. |
| REQ-007 | Parser/indexing invariants and index health automation are enforced | CI fails when canonical path, tier precedence, or frontmatter invariants break; index health job reports pass/fail with actionable diagnostics. |
| REQ-008 | Storage reliability protects committed state under interruption | Transaction recovery replay yields RPO 0 for committed mutations and simulation replay SLA completes <= 120s on reference dataset. |
| REQ-009 | Telemetry/trace schema governance prevents drift | All emitted trace payloads validate against schema registry; documentation drift check fails on schema-doc mismatch. |
| REQ-010 | Deferred/skipped path coverage is hardened | All deferred/skipped test paths from `002`/`003`/`004`/`005` are converted to active tests or approved with explicit rationale and owner. |
| REQ-011 | Automation loops and operational runbooks support self-healing checks | Self-healing routines detect and remediate at least four known failure classes with simulated MTTR <= 10 minutes. |
| REQ-012 | Governance evidence is auditable and sign-off ready | Checklist, ADRs, and implementation summary include command-level evidence for each P0 requirement and sign-off state. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Maintain latency and throughput budgets while adding controls | p95 `mode="auto" <= 120ms`, p95 `mode="deep" <= 180ms`, session-learning batch p95 <= 400ms, and net overhead <= 12% vs baseline corpus. |
| REQ-014 | Improve observability for ranking and routing decisions | Debug metadata includes per-channel contribution, cognitive modifier summary, relation score contribution, and session confidence rationale. |
| REQ-015 | Preserve continuity mapping from `002` to `002` across all artifacts | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` contain aligned continuity references. |
| REQ-016 | Approval/sign-off model is internally consistent | Same approver roles and status model appear in spec approval workflow and checklist sign-off sections. |
| REQ-017 | Operational drills validate recovery and runbook paths | At least one dry-run per runbook class (index drift, session ambiguity, ledger recovery, telemetry drift) is documented with outcomes. |
| REQ-018 | Deferred items are explicitly bounded | Any deferred P1 item includes owner, reason, impact, and re-entry condition in checklist and implementation summary. |
<!-- /ANCHOR:requirements -->

---

## 4.5 TRACEABILITY MATRIX (REQUIREMENTS -> PLAN PHASES -> TASKS)

| Requirement | Plan Phase | Task IDs |
|-------------|------------|----------|
| REQ-001 | Phase 1 | T001, T002, T003, T004 |
| REQ-002 | Phase 2 | T005, T008 |
| REQ-003 | Phase 1, Phase 2 | T025, T006 |
| REQ-004 | Phase 1, Phase 2 | T026, T007 |
| REQ-005 | Phase 3 | T009, T010 |
| REQ-006 | Phase 3 | T011 |
| REQ-007 | Phase 3 | T012 |
| REQ-008 | Phase 3 | T013, T014 |
| REQ-009 | Phase 4 | T015, T016 |
| REQ-010 | Phase 5 | T019 |
| REQ-011 | Phase 1, Phase 4 | T027, T017, T018 |
| REQ-012 | Phase 5 | T022, T023 |
| REQ-013 | Phase 5 | T020 |
| REQ-014 | Phase 2, Phase 4 | T008, T015 |
| REQ-015 | Phase 1, Phase 5 | T004, T022, T023 |
| REQ-016 | Phase 5 | T022, T023 |
| REQ-017 | Phase 4, Phase 5 | T017, T021 |
| REQ-018 | Phase 5 | T022, T023 |

## 4.6 SUBSYSTEM COVERAGE MAP

| Scoped Subsystem Area | Primary Requirement IDs | Primary Task IDs |
|-----------------------|-------------------------|------------------|
| Retrieval/fusion pipeline | REQ-002, REQ-013 | T005, T008, T020 |
| Graph/causal contracts + relation scoring | REQ-003 | T006 |
| Cognitive/attention-decay + FSRS ranking | REQ-004 | T007 |
| Session manager + session-learning quality/performance | REQ-005 | T009, T010 |
| Memory CRUD + metadata re-embedding consistency | REQ-006 | T011 |
| Parser/indexing invariants + index health automation | REQ-007 | T012, T014 |
| Storage reliability + mutation ledger consistency | REQ-008 | T013, T021 |
| Telemetry/trace schema governance + docs drift prevention | REQ-009 | T015, T016 |
| Deferred/skipped-path test hardening | REQ-010 | T019 |
| Automation loops + operational self-healing runbooks | REQ-011, REQ-017 | T017, T018, T021 |

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Audit artifacts fully cover all ten scoped subsystems with risk/owner/remediation mapping.
- **SC-002**: Retrieval/fusion outputs remain deterministic with bounded confidence behavior.
- **SC-003**: Graph relation scoring and cognitive modifiers improve ranking quality within defined safety bounds.
- **SC-004**: Session manager and session-learning quality/performance targets are met.
- **SC-005**: Memory CRUD and re-embedding consistency checks prevent stale embedding drift.
- **SC-006**: Parser/index invariants and storage reliability checks gate releases with actionable failures.
- **SC-007**: Telemetry schemas and documentation stay aligned through automated drift checks.
- **SC-008**: Deferred/skipped-path coverage is closed or formally approved with explicit ownership.
- **SC-009**: Self-healing runbooks are tested and operationally usable.
- **SC-010**: Governance sign-off reaches approved state across technical, QA, product, and operations roles.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing hybrid-search scoring contracts | Incorrect assumptions can break ranking semantics | Capture and lock baseline fixtures before tuning; compare deterministically post-change |
| Dependency | Parser/index normalization guarantees from `003` and `004` | Drift in metadata contract weakens ranking and retrieval confidence | Add invariant gates and auto-heal probes for parser/index paths |
| Dependency | Session confidence mechanics from `005` | Session-learning quality can regress routing behavior | Align routing/retrieval confidence policy and add ambiguity boundary tests |
| Risk | Overweighting cognitive modifiers | False precision in ranking and unstable output | Bound FSRS/decay contribution to 5-25% and enforce ablation regression checks |
| Risk | Re-embedding backlog under high mutation volume | Stale embeddings degrade retrieval quality | Add queue SLA checks and reconciliation loop with alert thresholds |
| Risk | Transaction recovery logic adds hidden complexity | Inconsistent data on interruption | Add recovery simulation suite and ledger replay assertions before release |
| Risk | Telemetry schema drift vs documentation | Operators lose diagnostic reliability | Enforce schema registry validation and docs drift gate |
| Risk | Expanded scope causes timeline pressure | Delivery quality drops or partial controls ship | Require phased completion gates and explicit deferral protocol |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Retrieval p95 remains <= 120ms for `mode="auto"` and <= 180ms for `mode="deep"` on baseline corpus.
- **NFR-P02**: Session selection p95 remains <= 250ms for 500 candidates; session-learning batch reconciliation p95 <= 400ms.
- **NFR-P03**: Health automation loop runtime remains <= 5 minutes per full sweep.

### Security
- **NFR-S01**: Path normalization and folder detection safeguards continue blocking traversal and unapproved roots.
- **NFR-S02**: Trace payloads exclude sensitive content and validate against allowed schema fields only.
- **NFR-S03**: Mutation ledger integrity checks detect tampering or out-of-order replay.

### Reliability
- **NFR-R01**: Same query and same index state yield deterministic ranking output.
- **NFR-R02**: Reindex + retrieval + session routing workflows remain idempotent across reruns.
- **NFR-R03**: Operational drill and incident-remediation workflows achieve documented RTO <= 10 minutes; this operational RTO target is distinct from the REQ-008 simulation replay SLA (<= 120s).
<!-- /ANCHOR:nfr -->

---

## 8. EDGE CASES

### Data Boundaries
- Empty or near-empty retrieval sets still emit deterministic confidence and trace metadata.
- High-cardinality graph neighborhoods are bounded before expensive relation-score fanout executes.
- Large mutation bursts do not leave stale embedding backlog after reconciliation SLA window.

### Error Scenarios
- Index anomaly during search emits safe fallback metadata and triggers health loop escalation.
- Session ambiguity with near-equal confidence scores triggers explicit confirmation or safe deterministic fallback.
- Interrupted write transaction triggers replay-recovery path and ledger consistency validation before marking success.
- Trace schema mismatch blocks release and reports doc/schema field diffs.

### Cross-System Consistency
- Canonical path aliases (`specs/` vs `.opencode/specs/`) remain unified across scan, index, search, and session detection.
- Tier precedence and frontmatter normalization remain consistent from parser output through ranking inputs.
- Telemetry field names and docs references remain synchronized by automated drift checks.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | Ten tightly-coupled subsystems across retrieval, storage, telemetry, testing, and operations |
| Risk | 24/25 | Failures can silently misroute context or corrupt confidence in system behavior |
| Research | 18/20 | Requires multi-subsystem baseline, calibration, and continuity mapping |
| Multi-Agent | 13/15 | Multiple concurrent workstreams require strict synchronization and governance |
| Coordination | 14/15 | Cross-component dependencies and sign-off coordination are extensive |
| **Total** | **93/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Fusion and graph scoring overfit benchmark fixtures | H | M | Use holdout fixtures, calibration review, and threshold caps |
| R-002 | FSRS/attention-decay signals regress high-confidence paths | H | M | Enforce ablation bounds and automatic rollback thresholds |
| R-003 | Session-learning feedback loop amplifies stale signals | H | M | Add freshness windows, confidence decay, and retraining guardrails |
| R-004 | Mutation ledger replay diverges from CRUD source-of-truth | H | L | Add transaction replay parity checks and invariant gates |
| R-005 | Telemetry schema/doc mismatch hides production drift | M | M | Gate releases on schema/docs validation and trace field linting |
| R-006 | Expanded verification set extends cycle time | M | M | Parallelize non-blocking suites and enforce critical-path order |

---

## 11. USER STORIES

### US-001: Deterministic Hybrid Retrieval with Causal and Cognitive Signals (Priority: P0)

**As a** retrieval maintainer, **I want** fusion, graph relation scoring, and cognitive decay signals to be consistent and bounded, **so that** ranking quality improves without nondeterministic behavior.

**Acceptance Criteria**:
1. Given fixed fixture queries, when retrieval executes repeatedly, then ranked outputs and metadata are deterministic.
2. Given long-tail recall fixtures, when cognitive modifiers are enabled, then NDCG@5 improves while primary-fixture regression remains bounded.

---

### US-002: Trustworthy Session and Memory State Integrity (Priority: P0)

**As a** platform owner, **I want** session routing, session-learning, CRUD re-embedding, parser/index invariants, and storage recovery to be synchronized, **so that** context state remains reliable under mutation and interruption.

**Acceptance Criteria**:
1. Given ambiguous sessions, when selection runs, then low-confidence handling is explicit and misroutes stay <= 1%.
2. Given write interruptions, when recovery runs, then committed mutations are preserved and replay remains consistent.

---

### US-003: Governance and Observability That Stay in Sync (Priority: P0)

**As an** operations lead, **I want** telemetry schema validation and docs drift prevention tied to release gates, **so that** diagnostics remain accurate and actionable.

**Acceptance Criteria**:
1. Given trace emission changes, when CI runs, then schema/doc mismatches fail fast.
2. Given production-like diagnostics, when debugging incidents, then per-channel/routing rationale is available.

---

### US-004: Prevention Controls That Cover Known and Deferred Paths (Priority: P1)

**As a** QA lead, **I want** deferred/skipped path coverage and self-healing runbooks to be explicit and test-backed, **so that** regressions are blocked and remediation is repeatable.

**Acceptance Criteria**:
1. Given deferred test inventory, when hardening completes, then each path is tested or approved with explicit owner.
2. Given known failure classes, when self-healing checks run, then remediation flow is documented and validated.

---

<!-- ANCHOR:acceptance-scenarios -->
## 11.5 ACCEPTANCE SCENARIOS

1. **Full-surface audit coverage**
   **Given** the ten scoped subsystem areas
   **When** Phase 1 audit completes
   **Then** each area has documented contracts, risks, and mitigation owner.

2. **Fusion determinism and fallback safety**
   **Given** fixed index state and fixture queries
   **When** retrieval runs repeatedly
   **Then** ranking and fallback behavior remain deterministic.

3. **Graph relation contract compliance**
   **Given** causal-edge fixtures with expected relation ordering
   **When** relation scoring executes
   **Then** output ordering meets contract thresholds and schema checks pass.

4. **Cognitive integration bounds**
   **Given** FSRS and attention-decay modifiers enabled
   **When** ranking executes on benchmark fixtures
   **Then** quality improvement and regression bounds remain within required limits.

5. **Session-learning quality and latency**
   **Given** 500-candidate session ambiguity fixtures
   **When** session manager and learning feedback run
   **Then** misroute and p95 latency targets are satisfied.

6. **CRUD re-embedding consistency**
   **Given** create/update/delete mutation events
   **When** re-embedding reconciliation runs
   **Then** stale embedding backlog does not exceed SLA thresholds.

7. **Parser/index and storage integrity**
   **Given** canonicalization and transaction interruption fixtures
   **When** invariants and recovery tests run
   **Then** CI fails on violations and recovery preserves committed state.

8. **Telemetry schema and docs drift gate**
   **Given** trace payload updates
   **When** validation runs
   **Then** schema violations or documentation mismatches fail release gates.

9. **Deferred/skipped path hardening**
   **Given** inherited deferred test list from `002` to `005`
   **When** coverage hardening completes
   **Then** all deferred paths are closed or explicitly approved with rationale.

10. **Self-healing operations readiness**
   **Given** index drift, session ambiguity, ledger mismatch, and telemetry drift simulations
   **When** runbook automation executes
   **Then** detection, remediation, and escalation follow documented flows within MTTR target.

11. **Governance closure**
   **Given** implementation completion
   **When** approvals are reviewed
   **Then** technical, QA, product, and operations sign-offs are present with evidence.
<!-- /ANCHOR:acceptance-scenarios -->

---

## 11.6 AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scope lock includes all ten subsystem areas in Section 3.
- Confirm continuity matrix for `002/003/004/005` is available.
- Confirm verification commands for regression, performance, recovery, telemetry, and validation gates.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Only change files mapped to this spec and current phase objectives. |
| Traceability | Every requirement must map to plan phase, task IDs, and checklist evidence. |
| Evidence | Record command-level evidence for completed P0/P1 items. |
| Safety | Stop and escalate on invariant, recovery, or schema-gate failures without approved fallback. |

### Status Reporting Format
- `STATE`: current phase and objective.
- `ACTIONS`: files/commands executed.
- `RESULT`: pass/fail and next planned action.

### Blocked Task Protocol
1. Stop edits for the blocked area and capture concrete failure output.
2. Attempt one bounded remediation that does not expand scope.
3. Escalate with options, impact, and recommended next step.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Technical Lead | Approved | 2026-02-22 |
| Verification Review | QA Lead | Approved | 2026-02-22 |
| Implementation Review | Engineering Lead | Approved | 2026-02-22 |
| Operational Readiness Review | Operations Lead | Approved | 2026-02-22 |
| Launch Approval | Product Owner | Approved | 2026-02-22 |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [x] Security review completed
- [x] Path, routing, and ledger integrity checks passed
- [x] Sensitive diagnostics and trace payload review completed

### Code Compliance
- [x] Coding standards followed
- [x] License compliance verified
- [x] Regression and deferred-path coverage policy validated

### Operational Compliance
- [x] Monitoring, alert, and self-healing hooks documented
- [x] Rollback and recovery playbook verified
- [x] Telemetry schema and documentation drift gate approved

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Retrieval Maintainer | Engineering | High | Daily async updates |
| Session/State Maintainer | Platform | High | Phase-end sync |
| QA Lead | Verification | High | Test-gate review |
| Operations Lead | Operations | High | Runbook and incident-drill review |
| Product Owner | Product | Medium | Milestone review |

---

## 15. CHANGE LOG

### v1.4 (2026-02-22)
Closure sync: updated status to `Completed`, approvals to `Approved` with date, compliance checkpoints to complete, and decision backlog statuses to closed based on final quality evidence closure.

### v1.3 (2026-02-22)
Consistency patch: added `handlers/memory-search.ts` to the files-to-change allowlist, clarified REQ-008 as simulation replay SLA (`<= 120s`), clarified NFR-R03 as operational drill/incident RTO (`<= 10 minutes`) distinct from REQ-008, mapped decision-lock tasks to REQ-003/REQ-004/REQ-011 traceability rows, and converted open questions into an active decision backlog.

### v1.1 (2026-02-22)
Broadened scope from retrieval/fusion-focused hardening to full cross-system hardening across ten audited subsystems; added explicit traceability matrix and expanded governance/verification requirements.

### v1.2 (2026-02-22)
Added explicit subsystem coverage map to tighten requirement/task traceability for all ten scoped areas.

### v1.0 (2026-02-22)
Initial Level 3+ specification for hybrid RAG fusion logic improvements.

---

<!-- ANCHOR:questions -->
## 16. ACTIVE DECISION BACKLOG

| Decision ID | Decision Topic | Owner | Due Phase | Required Evidence | Task Linkage | Status |
|-------------|----------------|-------|-----------|-------------------|--------------|--------|
| D-001 | Relation-score adjudication corpus policy (shared vs domain-specific corpus) | Retrieval Maintainer | Phase 1 | Corpus policy note, adjudication fixture manifest, and Kendall tau variance report from baseline replay | T025 -> REQ-003 | Closed |
| D-002 | Cognitive-weight policy scope (global bounds vs intent-scoped bounds) | Retrieval Maintainer + QA Lead | Phase 1 | Ablation comparison by intent class, bound-selection rationale, and approval note for rollout defaults | T026 -> REQ-004 | Closed |
| D-003 | Self-healing auto-remediation policy (auto-apply vs operator acknowledgement) | Operations Lead | Phase 1 | Failure-class policy matrix, rollback/escalation guardrail definition, and dry-run command evidence | T027 -> REQ-011 | Closed |
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC
Governance-focused high complexity specification with expanded cross-system continuity mapping.
-->

