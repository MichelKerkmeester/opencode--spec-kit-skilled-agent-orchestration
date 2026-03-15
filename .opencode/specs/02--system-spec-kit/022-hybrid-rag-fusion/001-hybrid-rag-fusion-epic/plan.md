---
title: "Consolidated plan"
---
# Consolidated plan
<!-- SPECKIT_TEMPLATE_SOURCE: consolidated-epic-merge | v1 -->

Consolidated from the following source docs:
- sources/000-feature-overview/plan.md
- sources/002-hybrid-rag-fusion/plan.md
- sources/006-hybrid-rag-fusion-logic-improvements/plan.md

<!-- AUDIT-2026-03-08: Historical folder name mapping for consolidated source references below.
  Pre-consolidation name         → Current folder
  002-hybrid-rag-fusion          → 002-indexing-normalization
  003-index-tier-anomalies       → 002-indexing-normalization
  004-frontmatter-indexing       → 002-indexing-normalization
  006-hybrid-rag-fusion-logic-improvements → content merged into this epic (001-hybrid-rag-fusion-epic)
-->

## Source: 000-feature-overview

---
title: "Implementation Plan: Hybrid RAG Fusion Refinement"
description: "8 metric-gated sprints transforming the spec-kit memory MCP server from a 3-channel system with dormant graph to a 5-channel graph-differentiated, feedback-aware retrieval engine."
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
trigger_phrases:
  - "hybrid rag plan"
  - "sprint implementation"
  - "metric-gated sprints"
  - "retrieval refinement plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP Server (spec-kit memory context-server v1.7.2) |
| **Storage** | SQLite (primary) + sqlite-vec + FTS5 + new `speckit-eval.db` |
| **Testing** | Vitest (158+ existing tests) |

### Overview

This plan implements 43 recommendations across 8 metric-gated sprints (348-523h for S0-S6, 393-585h including S7), transforming the spec-kit memory MCP server's retrieval pipeline. Three non-negotiable principles govern execution: (1) **Evaluation First** — R13 gates all downstream signal improvements; (2) **Density Before Deepening** — edge creation precedes graph traversal sophistication; (3) **Calibration Before Surgery** — score normalization before pipeline refactoring.

### Design Principles

1. **Subsystem coherence** — Maximum 2 subsystems per sprint (minimizes context-switching)
2. **Measure-then-enable** — Build behind flags, measure via R13, then enable
3. **True dependencies only** — Soft dependencies do not block building, only enabling
4. **Go/no-go gates** — Data-driven criteria between sprints, not time-based
5. **Build vs enable separation** — All scoring changes built behind feature flags, enabled by data
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Research synthesis complete (142-FINAL analysis + recommendations)
- [ ] BM25 contingency documented with decision matrix
- [ ] All P0 bug fixes identified with verified code locations
- [ ] Feature flag governance rules established

### Definition of Done (Per Sprint)
- [ ] Sprint exit gate metrics met
- [ ] All new tests pass + all existing tests pass (158+ at S0, growing each sprint)
- [ ] Dark-run comparison shows no regressions (for scoring changes)
- [ ] Feature flag count remains <= 6 operative limit (<=8 absolute ceiling per NFR-O01)
- [ ] tasks.md updated with completion status

### Gate Metric Evaluation Protocol

All sprint exit gates follow this 4-step evaluation procedure:

1. **Run benchmark:** Execute full eval suite against Sprint 0 ground truth corpus (100+ queries minimum). Record all metrics defined in gate criteria.
2. **Compare thresholds:** For each gate criterion, compare measured value against threshold. Boolean criteria must be TRUE; numeric criteria must meet or exceed threshold.
3. **Record snapshots:** Persist metric snapshots to `speckit-eval.db` with timestamp, sprint ID, and pass/fail status for each criterion. Snapshots are immutable audit records.
4. **Gate decision:** ALL criteria must pass for gate approval. Any single failure blocks the gate. Failed criteria must be remediated and re-evaluated (full suite re-run required, no cherry-picking).

**Default corpus:** Sprint 0 ground truth (T003), minimum 100 queries covering all intent types. Corpus may be extended but never reduced across sprints.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Multi-channel hybrid retrieval with staged pipeline processing

### Key Components

- **Candidate Generation (5 channels)**: Vector similarity, FTS5 full-text, BM25 keyword, graph traversal, typed-degree scoring
- **Fusion Layer**: RRF (current) with RSF alternative (R14/N1) — intent-weighted channel combination
- **Reranking**: Cross-encoder reranking + MMR diversity enforcement + MPAB chunk aggregation
- **Post-Processing**: State filtering, session dedup, constitutional guarantee, channel attribution
- **Evaluation Infrastructure**: Separate SQLite DB (`speckit-eval.db`) with 5-table schema for metrics, ground truth, and channel attribution
- **Scoring**: Composite scoring (6 factors: importance, temporal, structural freshness, co-activation, state, cognitive) calibrated to [0,1]

### Data Flow

```
Query → Intent Classification → Complexity Routing (R15)
  → Candidate Generation (5 channels)
    → Fusion (RRF/RSF with intent weights)
      → Rerank (cross-encoder + MMR + MPAB)
        → Filter + Annotate (state, session, constitutional)
          → Results + Channel Attribution
                    ↓
          Eval Logging (R13) → Metrics
```

### Architectural Invariant: Dual Scoring Is Calibration, Not Architecture

The dual scoring systems (RRF ~[0, 0.07] and composite ~[0, 1]) correctly measure orthogonal dimensions:
- **System A (RRF)**: Query-dependent relevance — how well does this memory match THIS query?
- **System B (Composite)**: Query-independent value — how important is this memory in general?

The ~15:1 magnitude mismatch is a calibration problem (normalize both to [0,1]), not an architectural defect requiring pipeline surgery. This distinction reduces cost and risk by 10x. See research/3 - analysis-hybrid-rag-fusion-architecture §5.

### Stage 4 Invariant

After pipeline refactor (R6), Stage 4 NEVER changes scores or ordering. Stages 1-3 handle ALL score computation. Stage 4 is exclusively filtering and formatting. This prevents recurrence of the double-weighting anti-pattern. See research/6 - combined-recommendations-gap-analysis §3, Sprint 5.

### Save Pipeline Architecture (TM Pattern Integration)

The memory_save handler now includes a multi-stage validation pipeline, inspired by true-mem's false-positive defense:

```
Stage 1: Content hash check (TM-02) — O(1), cheapest first
Stage 2: Quality scoring (TM-04) — O(1), metadata analysis
Stage 3: Embedding generation — O(1), API call (existing)
Stage 4: Semantic dedup (TM-04 Layer 3) — O(n), requires embedding
Stage 5: Reconsolidation (TM-06) — O(n), requires embedding
Stage 6: Insert — O(log n), final write
```

Stages 1-2 run BEFORE embedding generation (zero-cost rejection). Stages 4-5 run AFTER embedding generation but BEFORE database insert. This aligns with R6's pipeline refactor by adding pre-insert validation stages.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sprint 0: Epistemological Foundation [BLOCKING]

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 0.1 | **G1:** Fix graph channel ID format | 3-5 | Graph | — |
| 0.2 | **G3:** Fix chunk collapse dedup | 2-4 | Search handlers | — |
| 0.3 | **R17:** Fan-effect divisor | 1-2 | Graph/co-activation | — |
| 0.4 | **R13-S1:** Eval DB + logging hooks + pipeline instrumentation | 20-28 | Evaluation (new) | `SPECKIT_EVAL_LOGGING` |
| 0.5 | **G-NEW-1:** BM25-only baseline measurement | 4-6 | Evaluation | — |
| 0.6 | **TM-02:** Content-hash fast-path dedup in memory_save pipeline (SHA256 O(1) check before embedding) | 2-3 | Memory quality | — |
| 0.7 | **G-NEW-2 Pre-Analysis:** Lightweight agent consumption pattern survey — "What query patterns do AI agents actually use? What results do they select? What do they ignore?" Informs ground truth query design (T007). Position BEFORE ground truth generation. Full G-NEW-2 (8-12h) remains in Sprint 1. | 3-4 | Evaluation | — |
| | **Total** | **56-89h** | | |

**Exit Gate:**
- [ ] Graph hit rate > 0% (G1 verified)
- [ ] No duplicate chunk rows in default search mode (G3 verified)
- [ ] Baseline MRR@5, NDCG@10, Recall@20 computed for at least 100 queries (50 minimum for initial baseline; >=100 required for BM25 contingency decision with statistical significance)
- [ ] BM25-only baseline MRR@5 recorded
- [ ] Ground truth corpus includes >=15 manually curated queries with >=5 queries per intent type (graph relationship, temporal, cross-document, hard negative) and >=3 query complexity tiers (simple, moderate, complex). This is a HARD gate — corpus diversity prevents evaluation bias (see R-011 in spec.md §10).

**Partial Advancement:** G1+G3+R17 and R13-S1+G-NEW-1 are independent tracks. Sprint 1 (R4) MAY begin in parallel with R13-S1 completion — R4 can be *built and unit-tested* without eval infrastructure but MUST NOT be *enabled* until R13-S1 metrics are available.

**R13-S1 Logging Specification:** Asynchronous fire-and-forget logging hooks in `memory_search`, `memory_context`, and `memory_match_triggers` handlers. Minimum logged fields: query text, intent classification, per-channel results, final ranking, latency_ms, timestamp.

**If gate fails:** Do not proceed. Escalate as infrastructure crisis.

**BM25 Contingency Decision (Sprint 0 Exit):**

| BM25 vs Hybrid MRR@5 | Action | Roadmap Impact |
|----------------------|--------|----------------|
| >= 80% of hybrid | PAUSE multi-channel optimization | Sprints 3-7 deferred |
| 50-80% of hybrid | PROCEED; rationalize to 3 channels (drop channel with lowest Exclusive Contribution Rate per R13 channel attribution on 100-query eval set) | Scope may reduce |
| < 50% of hybrid | PROCEED with full roadmap | No change |

---

### Sprint 1: Graph Signal Activation

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 1.1 | **R4:** Typed-weighted degree as 5th RRF channel | 12-16 | Graph | `SPECKIT_DEGREE_BOOST` |
| 1.2 | Edge density measurement | 2-3 | Evaluation | — |
| 1.3 | **G-NEW-2:** Agent-as-consumer UX analysis | 8-12 | Evaluation | — |
| 1.4 | **TM-08:** Importance signal vocabulary expansion (add CORRECTION + PREFERENCE signals to trigger extraction) | 2-4 | Memory quality | — |
| 1.5 | Enable R4 if dark-run passes | 0 | — | — |
| | **Total** | **26-39h** | | |

#### PageIndex Integration

| ID | Item | Hours | Subsystem | Flag |
|----|------|-------|-----------|------|
| PI-A3 | **Pre-Flight Token Budget Validation** — validate `SUM(token_count)` against budget limit before result assembly; truncate candidate list early | 4-6 | Pipeline / result assembly | — |
| PI-A5 | **Verify-Fix-Verify for Memory Quality** — bounded quality loop (verify → auto-fix → re-verify → warn-flag; never silent drop) | 12-16 | Memory quality | `SPECKIT_VERIFY_FIX_VERIFY` |
| | **Sprint 1 PageIndex subtotal** | **+16-22h** | | |

**Exit Gate:**
- [ ] R4 dark-run: no single memory appears in >60% of results
- [ ] R4 MRR@5 delta > +2% absolute (or +5% relative) vs Sprint 0 baseline
- [ ] Edge density measured: if < 0.5 edges/node, escalate R10 priority
- [ ] G-NEW-2: Agent consumption instrumentation active

**If gate fails:** Graph too sparse. Prioritize R10 for edge density.

---

### Sprint 2: Scoring Calibration + Operational Efficiency

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 2.1 | **R18:** Embedding cache for instant rebuild | 8-12 | Indexing | — |
| 2.2 | **N4:** Cold-start boost with exponential decay | 3-5 | Scoring | `SPECKIT_NOVELTY_BOOST` |
| 2.3 | **G2:** Investigate double intent weighting | 4-6 | Fusion | — |
| 2.4 | Score normalization (both systems to [0,1]) | 4-6 | Scoring | — |
| 2.5 | **TM-01:** Interference scoring signal — negative weight for competing memories in same spec_folder | 4-6 | Scoring | `SPECKIT_INTERFERENCE_SCORE` |
| 2.6 | **TM-03:** Classification-based decay policies — FSRS multipliers by context_type/importance_tier | 3-5 | Scoring | — |
| | **Total** | **28-43h** | | |

#### PageIndex Integration

| ID | Item | Hours | Subsystem | Flag |
|----|------|-------|-----------|------|
| PI-A1 | **Folder-Level Relevance Scoring via DocScore Aggregation** — `FolderScore = (1/sqrt(M+1)) * SUM(MemoryScore(m))`; discounts over-represented folders in result set | 4-8 | Scoring / fusion | `SPECKIT_FOLDER_SCORE` |
| | **Sprint 2 PageIndex subtotal** | **+4-8h** | | |

**Exit Gate:**
- [ ] R18 cache hit rate > 90% on re-index of unchanged content
- [ ] N4 dark-run: new memories (<=30 days old) appear in top-10 for >=1 relevant query without reducing Recall@20 for existing memories by more than 2% absolute
- [ ] G2 resolved: fixed or documented as intentional
- [ ] Score distributions normalized to comparable ranges

**R6 Escalation Condition:** If Sprint 2 score normalization does not resolve the ~15:1 magnitude mismatch to within 3:1, escalate R6 from P2 to P1 and add to Sprint 5 as mandatory.

---

### Sprint 3: Query Intelligence + Fusion Alternatives

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 3.1 | **R15:** Query complexity router | 10-16 | Pipeline | `SPECKIT_COMPLEXITY_ROUTER` |
| 3.2 | **R14/N1:** Relative Score Fusion parallel to RRF | 10-14 | Fusion | `SPECKIT_RSF_FUSION` |
| 3.3 | **R2:** Channel minimum-representation constraint | 6-10 | Fusion | `SPECKIT_CHANNEL_MIN_REP` |
| 3.4 | **REQ-047 (R15-ext):** Confidence-based truncation | 5-8 | Pipeline | `SPECKIT_CONFIDENCE_TRUNCATION` |
| 3.5 | **REQ-048 (FUT-7):** Dynamic token budget | 3-5 | Pipeline | `SPECKIT_DYNAMIC_TOKEN_BUDGET` |
| | **Total** | **42-66h** | | |

#### PageIndex Integration

| ID | Item | Hours | Subsystem | Flag |
|----|------|-------|-----------|------|
| PI-A2 | **Search Strategy Degradation with Fallback Chain** [DEFERRED] — 3-tier fallback deferred from Sprint 3. Re-evaluate after Sprint 3 using measured frequency data. See UT review R1. | ~~12-16~~ | Search handlers / pipeline | `SPECKIT_SEARCH_FALLBACK` |
| PI-B3 | **Description-Based Spec Folder Discovery** — generate and cache 1-sentence `folder_description` per spec folder at index time; use for pre-search folder routing | 4-8 | Spec-Kit logic / indexing | — |
| | **Sprint 3 PageIndex subtotal** | **+16-24h** | | |

**Exit Gate:**
- [ ] R15 p95 latency for simple queries < 30ms
- [ ] R14/N1 shadow comparison: minimum 100 queries, Kendall tau >= 0.8 (strong agreement between R14/N1 RSF and baseline fusion ordering)
- [ ] R2 dark-run: top-3 precision within 5% of baseline

**HARD SCOPE CAP (Sprint 2+3):** After Sprint 2+3 completion, evaluate "good enough" thresholds (MRR@5 >= 0.7, constitutional surfacing >= 95%, cold-start detection >= 90%). Sprints 4-7 require a NEW spec approval based on demonstrated need from Sprint 0-3 metrics. Approval MUST include: (a) evidence that remaining work addresses measured deficiencies identified by R13 evaluation data, not hypothetical improvements; (b) updated effort estimates based on Sprint 0-3 actuals — original estimates are invalidated by actual velocity data; (c) updated ROI assessment comparing remaining investment (originally 253-370h for S4-S7) to demonstrated improvements from S0-S3. Without explicit approval, Sprints 4-7 do not proceed — this is a scope boundary, not a suggestion.

---

### CONTINGENT PHASE: Sprints 4-7 (requires new spec approval)

> **Scope boundary**: Sprints 4-7 are contingent on Sprint 3 off-ramp decision. They represent 323-531h of additional work that MUST NOT proceed without explicit approval based on Sprint 0-3 data. See HARD SCOPE CAP below and spec.md Phase Transition Rules.
>
> **Committed scope**: Sprints 0-3 (~135-169h core + PageIndex) — fixes all stated problems, establishes measurement, validates multi-channel vs BM25.
>
> **Contingent scope**: Sprints 4-7 (~323-531h) — only if Sprint 3 data proves necessity.
>
> **MVP alternative**: A minimal-viable approach addressing every stated problem (G1 fix, G3 fix, R13 eval, BM25 baseline, score normalization, basic query routing) could be achieved in ~61-88h at ~13% of the full budget.

### Sprint 4: Feedback Loop + Chunk Aggregation [CONTINGENT]

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 4.1 | **R1:** MPAB chunk-to-memory aggregation | 8-12 | Scoring | `SPECKIT_DOCSCORE_AGGREGATION` |
| 4.2 | **R11:** Learned relevance feedback (full safeguards) | 16-24 | Search handlers | `SPECKIT_LEARN_FROM_SELECTION` |
| 4.3 | **R13-S2:** Shadow scoring + channel attribution + ground truth Phase B | 15-20 | Evaluation | — |
| 4.4 | **TM-04:** Pre-storage quality gate (structural + content quality + semantic dedup validation) | 6-10 | Memory quality | `SPECKIT_SAVE_QUALITY_GATE` |
| 4.5 | **TM-06:** Reconsolidation-on-save (duplicate/conflict/complement auto-decision) | 6-10 | Memory quality | `SPECKIT_RECONSOLIDATION` |
| | **Total** | **72-109h** | | |

**Prerequisite:** R13 must have completed at least 2 full eval cycles. *An eval cycle is defined as: 100+ queries processed by R13 evaluation infrastructure AND 14+ calendar days of R13 logging (both conditions must be met). Two full cycles = minimum 200 queries AND 28+ calendar days. Synthetic fallback: replay 200 logged queries to simulate cycles in test environments.*

**Sprint 4 Split (MANDATORY):** Sprint 4 MUST be decomposed into two sub-phases for risk isolation. Sprint 4 touches 4 subsystems at 72-109h, violating the "max 2 subsystems per sprint" design principle (§1). The split isolates R11's CRITICAL FTS5 contamination risk:
- **S4a** (~31-45h): R1 (MPAB chunk-to-memory aggregation) + R13-S2 (shadow scoring + channel attribution + ground truth Phase B) + TM-04 (pre-storage quality gate). Lower-risk scoring and evaluation improvements that proceed immediately after Sprint 3 gate. TM-04 does not share R11's FTS5 contamination risk and does not require the 28-day R13 calendar window; delivering TM-04 early provides quality gate data to calibrate TM-06 reconsolidation thresholds.
- **S4b** (~41-64h): R11 (learned relevance feedback) + TM-06 (reconsolidation-on-save). R11 carries CRITICAL FTS5 contamination risk (MR1) and MUST NOT share a phase with other deliverables. S4b absorbs the R13 calendar dependency (see below). S4a MUST be verified complete before S4b begins. This allows S4a to deliver R13-S2 channel attribution data and TM-04 quality gate metrics earlier, informing TM-06 reconsolidation threshold calibration and the scope cap approval decision for S4b and beyond.

**Calendar Dependency (F10):** R11's prerequisite ("R13 must have completed at least 2 full eval cycles") translates to a minimum of 28 calendar days of eval logging before R11 can activate (2 cycles x 14 days each, assuming organic query volume does not reach 100 queries per cycle faster). This forced idle time is NOT reflected in effort estimates — the 16-24h R11 effort estimate covers development time only, not the waiting period. Plan accordingly: if S4a completes in ~3-4 weeks and R13 logging started at Sprint 0, the 28-day requirement may already be satisfied. If not, S4b start is delayed by the remaining calendar gap.

**Exit Gate:**
- [ ] R1 dark-run: MRR@5 within 2%; no regression for N=1 memories
- [ ] R11 shadow log: < 5% noise rate in learned triggers
- [ ] R13-S2 operational: full A/B comparison infrastructure running

---

### Sprint 5: Pipeline Refactor + Spec-Kit Logic

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 5.1 | Checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` | — | — | — |
| 5.2a | **R6-Stage1:** Extract candidate generation into isolated stage (5 channels) | 8-12 | Pipeline | `SPECKIT_PIPELINE_V2` |
| 5.2b | **R6-Stage2:** Fusion logic with intent weighting applied exactly once | 8-12 | Pipeline | `SPECKIT_PIPELINE_V2` |
| 5.2c | **R6-Stage3:** Cross-encoder reranking with score normalization | 8-12 | Pipeline | `SPECKIT_PIPELINE_V2` |
| 5.2d | **R6-Stage4:** Result filtering/truncation with "no score changes" invariant (assertion-enforced) | 8-12 | Pipeline | `SPECKIT_PIPELINE_V2` |
| 5.2e | **R6-Integration:** Full corpus regression testing against current pipeline | 5-8 | Pipeline | `SPECKIT_PIPELINE_V2` |
| 5.3 | **R9:** Spec folder pre-filter | 5-8 | Pipeline | — |
| 5.4 | **R12:** Embedding-based query expansion | 10-15 | Search handlers | `SPECKIT_EMBEDDING_EXPANSION` |
| 5.5 | **S2:** Template anchor optimization | 5-8 | Spec-Kit logic | — |
| 5.6 | **S3:** Validation signals as retrieval metadata | 4-6 | Spec-Kit logic | — |
| 5.7 | **TM-05:** Dual-scope injection strategy — memory auto-surface at lifecycle hooks | 4-6 | Memory quality/Spec-Kit | — |
| | **Total** | **68-98h** | | |

#### PageIndex Integration

| ID | Item | Hours | Subsystem | Flag |
|----|------|-------|-----------|------|
| PI-A4 | **Constitutional Memory as Expert Knowledge Injection** — inject constitutional memories as system-level context (domain knowledge directives) before ranked results; separate display slot | 8-12 | Search handlers / post-processing | `SPECKIT_CONSTITUTIONAL_INJECT` |
| PI-B1 | **Tree Thinning for Spec Folder Consolidation** — bottom-up merge of small child spec files into parent when `token_count(child) < MIN_CHILD_TOKENS` AND combined size is within budget | 10-14 | Spec-Kit logic | — |
| PI-B2 | **Progressive Validation for Spec Documents** — 4-level fix pipeline: schema check → anchor integrity → cross-reference validation → semantic consistency; each level gates the next | 16-24 | Spec-Kit logic / validation | `SPECKIT_PROGRESSIVE_VALIDATION` |
| | **Sprint 5 PageIndex subtotal** | **+34-50h** | | |

**Internal Phasing:**
- **Phase A (Pipeline):** R6 pipeline refactor — checkpoint before start; exit gate: 0 ordering differences in positions 1-5 AND weighted rank correlation >0.995 for full result set (relaxed from strict "0 ordering differences" which is fragile for floating-point arithmetic)
- **Phase B (Search + Spec-Kit):** R9, R12, S2, S3 (24-37h) — Phase A must pass "0 ordering differences" before Phase B begins

**Exit Gate:**
- [ ] R6 dark-run: 0 ordering differences in positions 1-5 AND weighted rank correlation >0.995 on full eval corpus
- [ ] All existing tests pass (158+ at S0, growing each sprint)
- [ ] R9 cross-folder queries produce identical results
- [ ] R12 simple query p95 latency <= 35ms (within 5ms of Sprint 3 baseline)

---

### Sprint 6a: Practical Improvements

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 6a.1 | **R7:** Anchor-aware chunk thinning | 10-15 | Indexing | — |
| 6a.2 | **R16:** Encoding-intent capture | 5-8 | Indexing/scoring | `SPECKIT_ENCODING_INTENT` |
| 6a.3 | **N3-lite:** Contradiction scan + Hebbian strengthening | 9-14 | Background/graph | `SPECKIT_CONSOLIDATION` |
| 6a.4 | **S4:** Spec folder hierarchy as retrieval structure | 6-10 | Spec-Kit logic | — |
| 6a.5 | **MR10 mitigation:** weight_history audit tracking (HARD GATE for N3-lite) | 2-3 | Graph | — |
| | **Sprint 6a Total** | **33-51h** | | |

### Sprint 6b: Graph Sophistication (GATED)

> **Entry gates**: Feasibility spike completed, OQ-S6-001 resolved, OQ-S6-002 resolved (RESOLVED — temporal degree delta (N2a) and causal depth signal (N2b) selected; Katz/PageRank/betweenness/eigenvector deferred; see S6 child spec OQ-S6-002), REQ-S6-004 density-conditioned

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 6b.1 | **N2 (4-6):** Graph centrality + community detection | 25-35 | Graph | — |
| 6b.2 | **R10:** Auto entity extraction (gated on density) | 12-18 | Graph/indexing | `SPECKIT_AUTO_ENTITIES` |
| | **Sprint 6b Total** | **37-53h** | | |

| | **Sprint 6 Combined Total** | **70-104h** | | |

**Phasing:** Sprint 6a executes first (sequential). Sprint 6b is GATED on feasibility spike and Sprint 6a exit gate. Sprint 7 depends on Sprint 6a only (not 6b).

**Exit Gate:**
- [ ] R7 Recall@20 within 10% of baseline
- [ ] R10 false positive rate < 20%
- [ ] N2 graph channel attribution > 10%
- [ ] N3-lite detects at least 1 known contradiction
- [ ] Feature flag count <= 6 operative limit (<=8 absolute ceiling per NFR-O01)

---

### Sprint 7: Long Horizon (As Needed)

| # | Item | Hours | Subsystem | Flag |
|---|------|-------|-----------|------|
| 7.1 | **R8:** Memory summaries (only if > 5K memories) | 15-20 | Indexing | `SPECKIT_MEMORY_SUMMARIES` |
| 7.2 | **S1:** Smarter memory content generation | 8-12 | Spec-Kit logic | — |
| 7.3 | **S5:** Cross-document entity linking | 8-12 | Graph/indexing | — |
| 7.4 | **R13-S3:** Full reporting + ablation studies | 12-16 | Evaluation | — |
| 7.5 | Evaluate R5 (INT8 quantization) need | 2 | Decision gate | — |
| | **Total** | **45-62h** | | |

**Exit Gate (Sprint 7):**
- [ ] R8 summary pre-filtering verified (if activated): summary quality >=80% relevance
- [ ] S1 content generation matches template schema >=95% (automated validation)
- [ ] S5 entity links established with >=90% precision on test set
- [ ] R13-S3 evaluation dashboard operational with historical trend visualization
- [ ] R5 activation decision documented with evidence
- [ ] Final feature flag sunset audit: all flags resolved (graduated or removed)
- [ ] If gate fails: Document blockers. S7 items are "as needed" — partial completion acceptable with documented rationale.

**Rollback (Sprint 7):**
- S7 rollback: Disable R8 summary pre-filter flag, revert S1 template changes, remove S5 entity links (non-destructive: links are additive), archive R13-S3 dashboard. Estimated: 6-10h. Difficulty: LOW-MEDIUM.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Sprint | New Tests | Test Focus | Est. Test LOC |
|--------|-----------|------------|---------------|
| S0 | 8-12 | G1 numeric IDs, G3 chunk dedup, R17 bounds, R13-S1 schema/hooks/metrics, G-NEW-1 BM25 path | 200-300 |
| S1 | 6-10 | R4 degree SQL, normalization, cache invalidation, constitutional exclusion; G-NEW-2 hooks | 250-400 |
| S2 | 8-12 | R18 cache hit/miss/eviction/model invalidation; N4 decay curve; G2 weight count; normalization | 200-350 |
| S3 | 10-14 | R15 classification accuracy (10+ queries/tier), 2-channel min; R14/N1 all 3 variants; R2 floor | 350-500 |
| S4 | 10-15 | R1 MPAB N=0/1/2/10, metadata; R11 column isolation/TTL/denylist/cap/eligibility; R13-S2 | 400-550 |
| S5 | 15-20 | R6 full corpus regression, stage boundaries, Stage 4 invariant; R9/R12/S2/S3 | 500-700 |
| S6 | 12-18 | R7 recall; R10 false positives; N2 attribution; N3-lite bounds/contradiction; S4 hierarchy | 350-500 |
| S7 | 8-12 | R8 summary pre-filter/skip-path; S1 template schema validation; S5 entity link integrity; R13-S3 dashboard operational; R5 decision documented | 200-300 |
| **Total** | **~138-193 new tests (see tasks.md T-TEST-S0 through T-TEST-S7 for per-sprint breakdown)** | Approximately doubling the 158+ existing suite | **2450-3600** |

**Flag interaction testing (5 levels):** See research/6 - combined-recommendations-gap-analysis §10.2 item 5.
- Level 1 (unit): Each flag in isolation — 24 tests, ~5 min
- Level 2 (pair): Documented interaction pairs — 12 pairs x 2 states, ~10 min
- Level 3 (group): Group A combinations — 256 tests, ~45 min
- Level 4 (cross-group): A x B critical paths — ~50 selected, ~2 hours
- Level 5 (phase): End state per sprint — manual validation, ~1 day each
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite 3.35.0+ (DROP COLUMN support) | Internal | Green | S4 rollback requires manual column handling |
| sqlite-vec extension | Internal | Green | Vector search already operational |
| FTS5 extension | Internal | Green | Full-text search already operational |
| Vitest test framework | Internal | Green | 158+ existing tests |
| BM25 channel | Internal | Green | Already operational (used in G-NEW-1) |

**All dependencies are internal.** No external services, APIs, or packages are required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Sprint | Difficulty | Method | Time |
|--------|-----------|--------|------|
| S0 | LOW | Revert 3 functions; delete eval DB | 1-2h |
| S1 | LOW | Disable `SPECKIT_DEGREE_BOOST`; revert R4 | 1-2h |
| S2 | LOW | Drop cache table; disable `SPECKIT_NOVELTY_BOOST` | 2-3h |
| S3 | MEDIUM | Disable 3 flags together (R15+R2+R14/N1 interact) | 3-5h |
| S4 | MEDIUM-HIGH | Disable R11 flag; clear learned_triggers; disable TM-04/TM-06 flags; R1 independent | 5-7h |
| S5 | HIGH | Restore from checkpoint (5.1); revert R6; re-run tests | 8-12h |
| S6 | HIGH | Edge deletions from N3-lite destructive; use `created_by` provenance | 12-20h |
| S7 | LOW-MED | Disable R8 flag, revert S1 templates, remove S5 entity links, archive R13-S3 dashboard | 6-10h |

**Sprint 2 Rollback — Additional Considerations:**
- The `interference_score` column added during S2 calibration MUST be retained during rollback (column deletion is destructive and irreversible in SQLite)
- Set all `interference_score` values to NULL during rollback to indicate uncalibrated state
- Quality degradation note: Rolling back S2 calibration may cause 5-15% MRR regression due to reverting to uncalibrated composite weights. Monitor for 48h post-rollback.

**Key insight:** Always create `memory_checkpoint_create()` before Sprint 4 (R11 mutations), Sprint 5 (pipeline refactor), and Sprint 6 (graph mutations).

### Cumulative Latency Budget Tracker (Cross-Cutting)

Each sprint exit gate MUST include a cumulative latency check. Track the running total of dark-run overhead across sprints to ensure it stays within the 500ms p95 hard limit:

| Sprint | Sprint Overhead | Cumulative Max | Remaining Budget |
|--------|----------------|----------------|-----------------|
| S0 | +5ms (eval logging) | 5ms | 495ms |
| S1 | +10ms (degree) | 15ms | 485ms |
| S2 | +2ms (cache) | 17ms | 483ms |
| S3 | +50ms (router+RSF) | 67ms | 433ms |
| S4 | +15ms (feedback) | 82ms | 418ms |
| S5 | +100ms (pipeline) | 182ms | 318ms |
| S6 | est. +50ms (graph) | 232ms | 268ms |
| S7 | +15ms (est.) | R8 summary lookup, S5 entity resolution | 247ms | 253ms |

**Rule:** If cumulative overhead exceeds 300ms, disable prior sprint dark-runs before starting new ones.

> **Latency Baselines:** All latency comparisons reference baselines recorded by R13 eval logging framework (T000g, Sprint 0). Baselines cover p50/p95/p99 for search, save, and health endpoints under standardized conditions.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
                              ┌──► Sprint 1 (Graph Signal) ──┐
Sprint 0 (Foundation) ───────┤   [build-gate: R4 during S0]  ├──► Sprint 3 (Query Intel)
         │                    └──► Sprint 2 (Calibration) ───┘          │
         │ BM25 contingency       [S1 ∥ S2: no hard dep]               │ HARD SCOPE CAP
         │ decision at exit        S2 has SOFT dep on S1               ▼
         ▼                        (score normalization can     ═══════════════════════
    If BM25 >= 80%:                retroactively incorporate   CONTINGENT PHASE (S4-S7)
    PAUSE S3-S7                    R4 degree scores)           Requires new spec approval
                                                               ═══════════════════════
    If sparse (S1 exit):                                       Sprint 4 (Feedback) [4a/4b split]
    escalate R10                                                       │ requires R13 2 cycles
                                                                       ▼
                                                                 Sprint 5 (Pipeline)
                                                                       │ checkpoint before
                                                                       ▼
                                                                 Sprint 6 (Graph Deep)
                                                                  [Phase A ∥ Phase B]
                                                                       │
                                                                       ▼
                                                                 Sprint 7 (Long Horizon)
```

**S1-S2 Parallelization Rationale:** Sprint 2's scope (R18 embedding cache, N4 cold-start boost, G2 investigation, score normalization, TM-01/TM-03) has ZERO technical dependency on Sprint 1 (R4 degree channel, edge density measurement, G-NEW-2). Both depend only on Sprint 0's outputs: functional graph channel (G1), eval infrastructure (R13-S1), and BM25 baseline. S1 works on the graph subsystem while S2 works on scoring/indexing — non-overlapping file sets. Running S1 and S2 in parallel saves an estimated 3-5 weeks on the critical path (26-43h of work that no longer gates subsequent sprints). Sprint 3 requires BOTH S1 and S2 exit gates before starting, as it depends on calibrated scores (S2) and graph signal data (S1).

### Build-Gate vs Enable-Gate Classification

> Not all dependencies are equal. A **build-gate** means the code can be written and unit-tested independently. An **enable-gate** means the feature MUST NOT be activated in production without the dependency. This distinction unlocks parallelization.

| Sprint | Depends On | Gate Type | Blocks | WHY (dependency rationale) |
|--------|------------|-----------|--------|---------------------------|
| S0 | None | — | S1, S2 (both via exit gate) | S0 establishes eval infrastructure and fixes blocking bugs — epistemological prerequisite |
| S1 | S0 exit gate | **Build**: R4 can be built/unit-tested during S0. **Enable**: R4 activation requires S0 exit gate (R13 metrics available) | S3 (jointly with S2) | S1 needs functional graph (G1 from S0) to measure and activate R4 degree channel |
| S2 | S0 exit gate | **Build**: R18/N4/G2 can be built independently. **Enable**: score normalization requires S0 eval baseline | S3 (jointly with S1) | S2 needs eval baseline (R13-S1 from S0) to validate score normalization; no hard dependency on S1's graph work |
| S3 | S1 AND S2 exit gates | **Enable-only**: S3 features require calibrated scores (S2) AND graph signal data (S1) | S4 (+ HARD SCOPE CAP) | S3 needs calibrated scores (S2) and graph signal (S1) for query routing and fusion alternatives |
| S4 | S3 exit gate + R13 2 cycles + NEW spec approval | **Enable-only**: R11 requires 28 calendar days of R13 data | S5 | S4 requires accumulated eval data for feedback loop; new approval required per scope cap |
| S5 | S4 exit gate | **Enable-only**: R6 requires stable scoring from S4 | S6 | S5 pipeline refactor needs stable scoring from S4; checkpoint required before R6 |
| S6a | S5 exit gate | **Build/Enable**: Sprint 6a (R7, R16, S4, N3-lite, T001d) needs stable pipeline from S5 | S7, S6b | S6a delivers practical improvements at any graph scale; Sprint 7 depends on S6a only |
| S6b | S6a exit gate + feasibility spike + OQ-S6-001/002 resolved | **GATED**: N2 centrality/community + R10 entity extraction require graph density evidence | None (optional) | S6b graph sophistication is gated — may be deferred if graph is too sparse |
| S7 | S6a exit gate | **Enable-only**: S7 needs Sprint 6a stack stable (not full S6) | None | S7 long-horizon features need practical improvements from S6a stable |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Sprint | Complexity | Estimated Effort |
|--------|------------|------------------|
| Sprint 0: Epistemological Foundation | High (blocking) | 56-89h |
| Sprint 1: Graph Signal Activation | Medium | 42-61h (includes PI-A3 4-6h + PI-A5 12-16h deferred from S0) |
| Sprint 2: Scoring Calibration | Medium | 28-43h |
| Sprint 3: Query Intelligence | Medium-High | 42-66h (includes REQ-047 5-8h + REQ-048 3-5h) |
| Sprint 4: Feedback Loop | High | 72-109h |
| Sprint 5: Pipeline Refactor | Very High | 68-98h (R6 decomposed: 37-56h across 5 sub-tasks + 24-37h Phase B) |
| Sprint 6a: Graph Deepening (Practical) | Medium-High | 33-51h |
| Sprint 6b: Graph Deepening (Sophistication, GATED) | Very High | 37-53h (heuristic) / 80-150h (production) |
| Sprint 7: Long Horizon | Medium | 45-62h |
| **Total (S0-S6a)** | | **311-470h** |
| **Total (S0-S6a+S6b heuristic)** | | **348-523h** |
| **Total (S0-S7, S6b heuristic)** | | **393-585h** |
| **PageIndex additions (PI-A1 — PI-B3, across S0-S5)** | Low-Medium | **+70-104h** |
| **Grand Total with PageIndex (S0-S7, S6b heuristic)** | | **463-689h** |

**Resource Planning:**
- Solo developer (~15h/week): 20-30 weeks (S0-S6) — reduced from 23-34 weeks by S1/S2 parallelization saving 3-5 weeks
- Dual developers: 8-12 weeks (independent tracks A-G assigned; S1/S2 parallelization is the primary acceleration)
- Critical path: G1→R4→R13-S1→R14/N1→R6 = ~90-125h sequential regardless of parallelism
- **Note on Sprint 0 total:** Sprint 0 effort is 56-89h (actual from tasks.md; includes G-NEW-2 pre-analysis, 3-4h). This lightweight survey informs ground truth generation quality and pays for itself by preventing evaluation corpus bias.
- **Note on CHK-S0F3 validation effort:** The p<0.05 statistical significance requirement on >=100 diverse queries (CHK-S0F3) requires manual relevance labeling not included in T008 (4-6h) or T008b (2-3h) effort estimates. Expect an additional 8-15h for this validation work. Total Sprint 0 effort with this addition: ~64-104h.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `memory_checkpoint_create()` before Sprint 4, 5, and 6
- [ ] Feature flags configured for all scoring changes
- [ ] R13 eval logging active before any dark-run

### Rollback Procedure
1. Disable relevant feature flag(s) — immediate effect
2. If schema changes: restore from backup or clear new columns
3. Verify rollback via full existing test suite + R13 eval metrics
4. Update tasks.md with rollback status

### Schema Changes Inventory

| Sprint | Change | Rollback Method |
|--------|--------|-----------------|
| S0 | `CREATE DATABASE speckit-eval.db` (5 tables) | Delete file |
| S2 | `CREATE TABLE embedding_cache` | `DROP TABLE embedding_cache` |
| S2 | `ALTER TABLE memory_index ADD COLUMN interference_score REAL DEFAULT 0` | Set column to 0 (neutral) |
| S4 | `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'` | `DROP COLUMN` (SQLite 3.35.0+) |

### Migration Protocol (11 Rules)
1. Backup before migration
2. Nullable with defaults on all new columns
3. Forward-compatible reads (handle column not existing)
4. Separate database preference for new subsystems
5. Migration ordering: S0 eval independent, S2 cache independent, S4 depends on S0 eval operational
6. No destructive migrations (never DROP COLUMN in forward path)
7. Atomic execution — failure = full rollback
8. Version tracking via `schema_version` table or pragma
9. Eval DB (`speckit-eval.db`) backed up before every sprint gate review
10. Eval DB automatic backup after every 100 eval cycles (prevents data loss during long sprints)
11. **Data backfill**: When adding computed columns (e.g., `interference_score`, `learned_triggers`), define whether existing rows need retroactive computation. Default: new columns use DEFAULT value until explicitly backfilled. Backfill tasks MUST be included in sprint effort estimates.

**Concurrency & Multi-Session Safety:**
- All database writes MUST use WAL (Write-Ahead Logging) mode: `PRAGMA journal_mode=WAL`
- R11 learned trigger writes: Use INSERT OR REPLACE within a transaction
- TM-06 reconsolidation: Acquire per-spec-folder advisory lock before similarity check to prevent concurrent merge race conditions
- R13 eval logging: Use separate database connection with WAL mode
- N3-lite edge modifications: Wrap in SAVEPOINT for atomic rollback on failure
- General rule: Any multi-step write operation spanning an async boundary (e.g., embedding generation await) MUST re-validate state after the await before committing
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
                     G1 (Fix graph IDs) ──── URGENT, UNBLOCKS GRAPH
                      │
                      ▼
                     R4 (Degree channel) ──── can build before R13
                      │
                      ▼
              R13-S1 (Eval Sprint 1) ──── ENABLE R4 based on data
             /    │    \       \
            ▼     ▼     ▼       ▼
          R1    R14/N1  R11    R15 (all measurable via R13)
                                │
                                ▼
                          R12 (suppressed when R15 = "simple")

  INDEPENDENT TRACKS (no cross-dependencies):

  Track A (Quick wins):       G3, R17, N4, R18
  Track B (Graph):            G1 → R4 → N2(4-6)
  Track C (Measurement):      R13-S1 → R13-S2 → R13-S3
  Track D (Scoring tweaks):   R1, R14/N1, R2, R16
  Track E (Pipeline/Index):   R6, R7, R8, R9 (all independent of each other)
  Track F (Feedback loop):    R11 (needs R13 data accumulation, not R13 code)
  Track G (Advanced):         R10 (gated on density), N3, S1-S5
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| G1 (graph ID fix) | None | Functional graph channel | R4, all graph work |
| R4 (degree channel) | G1 | 5th RRF channel | N2, graph deepening |
| R13-S1 (eval core) | None | Metrics, BM25 baseline | R4 enable, R11, R14/N1 |
| R6 (pipeline refactor) | R13-S1 (for measurement) | Staged pipeline | Sprint 6 work |
| R11 (learned feedback) | R13-S1 (query provenance) | Feedback loop | N/A |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **G1** (Fix graph IDs) — 3-5h — CRITICAL
2. **R4** (Typed-degree channel) — 12-16h — CRITICAL
3. **R13-S1** (Eval infrastructure) — 20-28h — CRITICAL
4. **R14/N1** (Relative Score Fusion) — 10-14h — CRITICAL
5. **R6** (Pipeline refactor) — 40-55h — CONDITIONAL (included only if Sprint 2 normalization gate fails OR Stage 4 invariant deemed mandatory)

**Total Critical Path**: 90-125h (reduced from ~120-165h by S1/S2 parallelization)

**WHY each item is on the critical path:**
1. **G1** — All graph work is blocked until ID format mismatch is fixed; zero-cost fix with maximum unblocking value.
2. **R4** — The degree channel is the primary mechanism for graph differentiation; must be built (and dark-run validated) before graph investment decisions.
3. **R13-S1** — Epistemological prerequisite: without measurement infrastructure, every tuning decision is speculation. Gates all "enable" decisions.
4. **R14/N1** — RSF comparison determines whether RRF fusion should be replaced, augmented, or kept; informs S5 pipeline architecture.
5. **R6** — Conditional: only on critical path if S2 normalization fails. If triggered, R6 is the highest-effort single item (40-55h).

**Parallel Opportunities**:
- Track A (G3, R17, N4, R18) runs entirely in parallel with critical path — these are independent quick wins with no cross-dependencies
- Track C (R13 phases) can begin during Sprint 0 alongside bug fixes — R13-S1 is both a critical path item AND the measurement foundation for all tracks
- Track D (scoring tweaks) parallelizes with Track B (graph work) — non-overlapping file sets
- Sprint 1 and Sprint 2 run in parallel after Sprint 0 (non-overlapping subsystems: graph vs scoring/indexing)
- Sprint 6 Phase A and Phase B run in parallel (non-overlapping subsystems)

**Phase Boundary Risk Notes:**
- **S0→S1/S2 transition:** BM25 contingency decision is the primary risk. If BM25 >= 80%, only S1 proceeds (graph-focused); S2-S7 are paused for architecture review.
- **S1+S2→S3 transition:** Both exit gates must pass. If S1 reveals sparse graph (density < 0.5), R10 priority escalates and may need to be pulled into S3 scope.
- **S3→S4 transition (SCOPE CAP):** Requires new spec approval. This is the highest-risk transition because it gates 60%+ of remaining effort. Plan for a 1-2 week approval cycle.
- **S4→S5 transition:** Checkpoint creation is mandatory before S5 begins. R6 pipeline refactor is the highest-risk single item; failure requires full rollback to checkpoint.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Sprint 0 Complete | Graph functional, eval baseline recorded, BM25 compared | S0 exit |
| M1 | Sprint 0+1 Complete | 5-channel hybrid operational with measurable graph signal | S1 exit |
| **M2** | **Sprint 2+3 Complete (Recommended Stop)** | **Calibrated scoring, cold-start, query routing, RSF evaluated** | **S3 exit** |
| M3 | Sprint 4+5 Complete | Feedback loop closed, pipeline refactored | S5 exit |
| M4 | Sprint 6+7 Complete | Graph deepened, long-horizon features, full optimization | S7 exit |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Calibration, Not Architecture

**Status**: Accepted

**Context**: The dual scoring systems (RRF ~[0, 0.07] and composite ~[0, 1]) were diagnosed as "disconnected systems requiring architectural integration."

**Decision**: Treat as a calibration problem (normalize both to [0,1] scale), not an architectural defect requiring pipeline surgery.

**Consequences**:
- ~50 LOC score normalization vs 400+ LOC pipeline refactor
- Lower risk, more reversible
- R6 pipeline refactor is conditional: required only if (a) Sprint 2 score normalization fails exit gate, OR (b) the Stage 4 invariant ('no score changes in Stage 4') is deemed architecturally necessary regardless of calibration success. R6 is optional relative to the calibration fix.

**Alternatives Rejected**:
- Full pipeline merge: 10x cost increase, higher regression risk

### ADR-002: Metric-Gated Sprints Over Risk Phases

**Status**: Accepted

**Context**: Original roadmap proposed 4 risk-grouped phases. Each phase mixed 3-4 subsystems.

**Decision**: Use 8 metric-gated sprints with max 2 subsystems each and data-driven go/no-go gates.

**Consequences**:
- Reduced context-switching (subsystem coherence)
- Built-in off-ramps at every sprint boundary
- Each sprint independently verifiable

**Alternatives Rejected**:
- 4 risk-grouped phases: lacked go/no-go criteria; 3-4 subsystem context switches per phase

### ADR-003: Density Before Deepening

**Status**: Accepted

**Context**: Original roadmap sequenced graph traversal sophistication (centrality, communities) before edge density work.

**Decision**: Fix G1 → Measure graph density → If sparse, prioritize R10 → Only then invest in centrality/communities.

**Consequences**:
- Prevents investment in sophistication over a sparse graph
- R10 priority dynamically determined by density measurement
- N2 items 4-6 deferred to Sprint 6 (gated on density > 1.0)

### ADR-004: Evaluation First

**Status**: Accepted

**Context**: System has 15+ scoring signals with zero retrieval quality metrics.

**Decision**: R13 (evaluation infrastructure) is the epistemological prerequisite. No scoring change goes live without pre/post measurement.

**Consequences**:
- Sprint 0 is blocking — nothing proceeds without eval capability
- Every recommendation becomes testable
- BM25 baseline reveals whether hybrid system earns its complexity

### ADR-005: Separate learned_triggers Column

**Status**: Accepted

**Context**: R11's `[learned:]` prefix is stripped by FTS5 tokenizer, causing irreversible contamination of lexical search.

**Decision**: Store learned triggers in a separate `learned_triggers` column (not indexed by FTS5), not appended to `trigger_phrases`.

**Consequences**:
- Eliminates FTS5 contamination risk entirely
- Separate TTL, weight, and cleanup logic
- Requires schema migration (S4) but reversible

**Alternatives Rejected**:
- Prefix-based marking in trigger_phrases: FTS5 strips brackets, contamination irreversible

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Sprint**: S0
**Duration**: 45-70h
**Agent**: Primary (sequential — blocking prerequisites)
**Rationale**: G1, G3, R17 are bug fixes requiring careful verification. R13-S1 establishes measurement infrastructure. No parallelization within Sprint 0.

### Tier 2: Parallel Execution
| Track | Focus | Sprints | Items |
|-------|-------|---------|-------|
| Track A | Quick wins + Scoring | S0-S2 | G3, R17, N4, R18 |
| Track B | Graph | S0-S6 | G1 → R4 → N2(4-6) |
| Track C | Measurement + Feedback | S0-S7 | R13-S1 → R13-S2 → R13-S3 |
| Track D | Pipeline + Advanced | S3-S6 | R15, R6, R7, R8, R9 |

**Sync Points**: Sprint exit gates serve as sync points between tracks.

### Tier 3: Integration
**Agent**: Primary
**Task**: Sprint exit gate verification, off-ramp decisions, BM25 contingency
**Trigger**: After each sprint completion, before next sprint begins
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Sprints | Status |
|----|------|-------|---------|--------|
| W-A | Quick Wins + Scoring | Primary | S0-S2 | Pending |
| W-B | Graph Activation + Deepening | Primary | S0-S1, S6 | Pending |
| W-C | Measurement + Feedback | Primary | S0-S4, S7 | Pending |
| W-D | Pipeline + Spec-Kit | Primary | S3, S5-S6 | Pending |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Sprint 0 exit gate | All workstreams | BM25 contingency decision |
| SYNC-002 | Sprint 1 exit gate | W-B, W-C | Edge density assessment |
| SYNC-003 | Sprint 3 exit gate | All workstreams | Off-ramp decision |
| SYNC-004 | Sprint 5 exit gate | W-D | Pipeline V2 go/no-go |

### File Ownership Rules
- Each recommendation targets specific subsystem files
- Cross-subsystem changes (R11 touching Search + Evaluation) require sprint-level coordination
- Conflicts resolved at sprint exit gate reviews
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Sprint**: Status update in tasks.md + exit gate verification
- **Per Sprint**: R13 metrics dashboard review
- **At Off-Ramp (S3)**: "Good enough" threshold evaluation
- **Blockers**: Immediate escalation to Project Lead

### Escalation Path
1. Sprint gate failure → Investigate root cause; attempt 1 fix cycle → If persistent, escalate
2. BM25 contingency (>= 80%) → Architecture review before Sprint 1+
3. R6 ordering regression → Revert to checkpoint; evaluate off-ramp
4. Feature flag count > 6 operative / > 8 absolute ceiling (NFR-O01) → Mandatory sunset audit

**Flag Graduation Process:** A flag graduates from feature flag to permanent code when: (1) Sprint exit gate passes with flag enabled, (2) Dark-run comparison shows no regression for >=2 consecutive eval cycles, (3) Flag has been in `enable` state for >=14 days without incident. Graduation action: Remove flag check from code, keep the enabled behavior as default. Flag cleanup tasks are tracked as T-FS{N} sunset tasks per sprint.
<!-- /ANCHOR:communication -->

---

## PageIndex Research Integration

> **Source:** Research documents 9 (deep-analysis-true-mem-source-code) and 10 (recommendations-true-mem-patterns). These 8 recommendations are derived from PageIndex analysis and are ADDITIVE to the 43 core recommendations.

### 3-Phase Migration Pathway

| Phase | Weeks | PI Items | Theme | Effort |
|-------|-------|----------|-------|--------|
| **Phase 1: Quick Wins** | 1-2 | PI-A1, PI-A3, PI-B3 | Low-risk, immediate value; no eval framework required | ~12-22h |
| **Phase 2: Requires Eval** | 3-4 (after S0) | PI-A2, PI-A4 | Depend on R13 eval infrastructure and interaction data | ~20-28h |
| **Phase 3: Deeper Changes** | 5-8 | PI-B1, PI-A5, PI-B2 | Structural changes to spec-kit logic and memory quality loop | ~38-54h |

### Phase 1: Quick Wins (Weeks 1-2, ~12-22h)

Implement before or during Sprint 0-1. No dependency on R13 eval framework.

- **PI-A1** (S2, 4-8h) — Folder-level relevance scoring discounts over-represented folders; low-risk, additive signal
- **PI-A3** (S1, 4-6h) — Pre-flight token budget validation prevents result truncation surprises; O(1) guard
- **PI-B3** (S3, 4-8h) — Spec folder description cache enables faster folder routing at search time

### Phase 2: Requires Eval Framework (Weeks 3-4, after Sprint 0, ~20-28h)

Implement after R13-S1 is operational (Sprint 0 exit gate passed).

- **PI-A2** (S3, 12-16h) — Search fallback chain degrades gracefully; needs R13 to measure recall improvement per tier
- **PI-A4** (S5, 8-12h) — Constitutional injection as expert knowledge; needs R13 channel attribution to verify no displacement of ranked results (deferred from S4 to S5)

### Phase 3: Deeper Changes (Weeks 5-8, ~38-54h)

Implement during or after Sprint 4-5. These require more invasive changes.

- **PI-B1** (S5, 10-14h) — Tree thinning requires spec folder index and merge logic; impacts spec-kit write path
- **PI-A5** (S1, 12-16h) — Verify-Fix-Verify loop replaces simple quality gate; bounded iteration prevents infinite loops (deferred from S0 to S1)
- **PI-B2** (S5, 16-24h) — Progressive 4-level validation pipeline; most complex; requires complete validation infrastructure

### Integration Notes

- **PI-A5 sprint placement**: Deferred from S0 to **S1** in the sprint table (authoritative placement). PI-A5 is S1 scope alongside PI-A3. The Phase 3 listing in the migration pathway reflects implementation complexity, not sprint assignment
- **Feature flag count**: PI-A2 (`SPECKIT_SEARCH_FALLBACK`), PI-A4 (`SPECKIT_CONSTITUTIONAL_INJECT`), PI-B2 (`SPECKIT_PROGRESSIVE_VALIDATION`), PI-A5 (`SPECKIT_VERIFY_FIX_VERIFY`), PI-A1 (`SPECKIT_FOLDER_SCORE`) = 5 additional flags; must be managed within the 6-flag operative limit (8-flag absolute ceiling per NFR-O01)
- **PI-B3 LLM dependency**: `folder_description` generation requires an LLM call at index time; cache aggressively and only regenerate on spec folder content change

## Documentation Addendum Plan (DOC-01)

### Objective
- Generate one per-feature artifact file (feature.md) inside every numbered feature folder under `011-feature-catalog/`, using canonical content from feature_catalog.md plus optional enrichment from summary_of_new_features.md.

### Execution Strategy
1. Parse canonical inventory from 011-feature-catalog/feature_catalog.md (`##` group + `###` feature hierarchy).
2. Normalize feature titles with trailing ticket-parenthetical stripping (only when parenthetical includes digits) for folder mapping parity.
3. Resolve each feature to its numbered target folder (`NN-group/NN-feature`), then write feature.md with:
   - H1 feature title
   - canonical documentation section
   - new/updated context section
   - source metadata block
4. Run coverage validation:
   - canonical features count == feature folders count
   - each feature folder contains feature.md
   - missing target folders = 0 and extra unmapped folders = 0

### Tooling Note
- Use `cli-gemini` workflow with `gemini-3.1-pro-preview` for request alignment and generation support; keep deterministic local validation as the source of truth for final mapping correctness.

<!--
LEVEL 3+ PLAN
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
- 8 metric-gated sprints with ADRs
-->

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

## Source: 002-hybrid-rag-fusion

---
title: "Plan: 138-hybrid-rag-fusion [002-hybrid-rag-fusion/plan]"
description: "This Level 3+ architectural upgrade involves modifying the core retrieval engine (hybrid-search.ts, rrf-fusion.ts) which dictates the performance of the entire system. Consequen..."
trigger_phrases:
  - "plan"
  - "138"
  - "hybrid"
  - "rag"
  - "fusion"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Plan: 138-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR: plan-approach-138 -->
## 1. Execution Approach
This Level 3+ architectural upgrade involves modifying the core retrieval engine (`hybrid-search.ts`, `rrf-fusion.ts`) which dictates the performance of the entire system. Consequently, the upgrade is structured in highly granular, non-breaking deployment phases. 

The strategy utilizes **"Dark Launching"** via Feature Flags (e.g., `SPECKIT_MMR=false` by default during initial commits). This approach allows developers to introduce new computational overhead gradually, verifying that latency remains within the 120ms ceiling for `mode="auto"` (per spec.md Section 3.2) via the `memory_stats` health checks before making the new algorithms the default.
<!-- /ANCHOR: plan-approach-138 -->

<!-- ANCHOR: plan-phases-138 -->
## 2. Phased Rollout and Architecture Blueprint

### Phase 0: Quick Wins (Activate Existing Assets)
*   **Objective:** Eliminate integration fragmentation. Connect already-tested, fully functional modules into the primary execution path.
*   **Key Actions:** 
    *   Set `useGraph: true` to elevate causal relationships from post-retrieval multipliers to primary retrieval sources.
    *   Un-flag `adaptive-fusion.ts` to allow dynamic RRF weighting based on the detected intent.
    *   Inject `co-activation.ts` BFS spreading algorithm.
    *   Implement 0-result two-pass adaptive fallbacks. If `similarity=0.3` returns 0 rows, instantly re-execute the scatter query at `0.17`.

### Phase 1: Diversity and Confidence (The Core Upgrade)
*   **Objective:** Maximize the 2000-token LLM payload budget while eliminating "silent failure" hallucinations.
*   **Key Actions:** 
    *   Write the `applyMMR()` algorithm. This requires computing O(N²) pairwise cosine similarities for the top-20 RRF candidates to select the 5 most diverse chunks.
    *   Calculate Z-scores (Mean, StdDev) on RRF ranks to build the Transparent Reasoning Module (TRM). If Z-score < 1.5 or the absolute top score is < 0.015, inject `[EVIDENCE GAP DETECTED]` warnings into the MCP markdown string.

### Phase 2: Graph Intelligence & Field Weights
*   **Objective:** Apply mathematical precision to exact-match text and graph edge paths natively in SQLite.
*   **Key Actions:** 
    *   Upgrade the SQLite FTS5 query in `memory_search` to use `bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)`. This violently scales the importance of `title` matches (10x) and `trigger_phrases` (5x) over generic content matches (2x) without any JS parsing latency.
    *   Update `causal-edges.ts` recursive CTEs to add relationship weight multipliers (`supersedes`=1.5x, `contradicts`=0.8x, `caused`=1.3x) directly in the SQL engine to ensure the Graph channel produces highly ranked nodes.

### Phase 3: Multi-Query Retrieval
*   **Objective:** Overcome vocabulary mismatch and prompt fragility for analytical searches (RAG Fusion).
*   **Key Actions:** 
    *   Introduce rule-based, template synonym expansion exclusively for `mode="deep"`. 
    *   If a user asks "Fix login error", internally expand to `["fix authentication bug", "login failure handler"]` and execute all 3 variants (original + 2 derived) in a `Promise.all` scatter-gather block.

### Phase 4: Indexing Quality & Authority Extraction
*   **Objective:** Improve chunk integrity and pre-compute foundational value.
*   **Key Actions:** 
    *   Replace naive sliding-window text chunkers with AST-based `remark-gfm` atomic block parsing during `generate-context.js` ingest. Ensure codeblocks are never split.
    *   Inject an asynchronous PageRank calculation into `memory_manage` batch jobs to pre-calculate graph authority, storing it in `memory_index`.
    *   Auto-extract `derived_from` entities via fast regex during `memory_save` to densify the graph.

### Phase 5: Test Coverage (Accompanies Each Phase)
*   **Objective:** Ensure every new feature and every modified module has corresponding vitest coverage. Tests are written alongside implementation, not deferred.
*   **Strategy:**
    *   **New modules** (mmr-reranker, evidence-gap-detector, query-expander, structure-aware-chunker, pagerank) each get a dedicated `*.vitest.ts` file.
    *   **Modified modules** (adaptive-fusion, hybrid-search, co-activation, bm25-index, causal-edges, rrf-fusion, intent-classifier, fsrs-scheduler, prediction-error-gate) get new `describe()` blocks appended to their existing test files.
    *   **Integration:** One end-to-end pipeline test (`integration-138-pipeline.vitest.ts`) validates the complete scatter→fuse→MMR→TRM flow under the 120ms latency ceiling.
    *   **Regression:** Feature flag `false` tests ensure the existing pipeline is unaffected by new code paths.
*   **Coverage Targets:** Unit 80%, Integration 70% for all new/modified modules.
<!-- /ANCHOR: plan-phases-138 -->

<!-- ANCHOR: plan-rollout-138 -->
## 3. Rollout and Rollback Strategy (Runbook)

### Step 1: Commit Phase (Dark Launch)
1. Merge PRs with all feature flags explicitly set to `false` in the deployment environment.
   * `SPECKIT_MMR: false`
   * `SPECKIT_TRM: false`
   * `SPECKIT_MULTI_QUERY: false`
2. Run unit tests (`npm run test:search`) to ensure the baseline static-weight pipeline remains uncorrupted.

### Step 2: Canary/Monitor Phase
1. Enable `SPECKIT_MMR: true` locally.
2. Force `mode="deep"` for 24 hours. 
3. Monitor `memory_stats` payload sizes. Ensure the payload character count is reduced by at least 15% (proving redundancy was eliminated).
4. Profile the Node.js event loop during MMR execution using `console.time('MMR_O(N^2)')`. Ensure the timer remains under `10ms` for N=20 candidates.

### Step 3: Default Phase
1. Flip `SPECKIT_MMR` and `SPECKIT_TRM` to `true` in the production environment.
2. Push cache invalidation signal: Force `bypassCache=true` on the MCP client's next startup to wipe the old static-weight cache entries.

### Step 4: Emergency Rollback
If `memory_stats` latency exceeds 150ms average for `mode="auto"`, or if LLMs complain about missing context:
1. Revert environment variables instantly:
   ```bash
   export SPECKIT_MMR=false
   export SPECKIT_TRM=false
   export SPECKIT_MULTI_QUERY=false
   ```
2. Restart the MCP server. Zero database/schema changes are required, ensuring instant, safe rollbacks.
<!-- /ANCHOR: plan-rollout-138 -->

<!-- ANCHOR: plan-risks-138 -->
## 4. Risk Matrix & Mitigation

| Risk ID | Description | Severity | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R01** | MMR O(N²) calculation blocks the single-threaded Node.js event loop. | High | Low | Hardcap MMR input candidates to N=20 maximum via `.slice(0, 20)` before applying the algorithm. 20² = 400 iterations, taking <2ms. |
| **R02** | Multi-Query generates bizarre variants, destroying relevance. | Medium | Medium | Limit server-side expansion to predefined template rules (e.g., synonym maps, term decomposition) rather than unconstrained generation. |
| **R03** | FTS5 weights (`bm25`) cause non-vector results to overwhelm RRF. | High | Low | Apply a specific multiplier to the FTS5 rank in `adaptive-fusion.ts` to ensure it only dominates if the user's intent is `find_spec` or `find_decision`. |
| **R04** | "LLM-in-MCP Paradox" causes API timeouts. | Critical | Zero | Completely banned. No LLM calls will be made from within the MCP server during read-time retrieval. |
<!-- /ANCHOR: plan-risks-138 -->

---

## Technical Context

- Stack: TypeScript + SQLite + vitest.
- Primary files: `hybrid-search.ts`, `intent-classifier.ts`, `mmr-reranker.ts`.
- Constraints: no schema migration, bounded latency, backward-compatible contracts.

## Implementation

1. Enable dormant graph/adaptive fusion paths.
2. Add centroid intent scoring internals.
3. Add/adjust tests for centroid behavior.
4. Re-run targeted suite and update phase docs.

## Testing Strategy

- Run `vitest` for `intent-classifier.vitest.ts`.
- Verify no regressions in scoring boundaries and type contracts.

## Dependencies

- Existing SGQS/graph channel code from sibling phases.
- Existing toolchain (`node`, `npm`, `vitest`).

## Rollback

- Restore prior scoring blend in `intent-classifier.ts` if regressions appear.
- Keep additive exports backward compatible to minimize rollback scope.

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scoped files and validation commands before edits.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Validate context before modification and verify after changes |
| TASK-SCOPE | Restrict edits to declared phase files |

### Status Reporting Format
- STATE: current checkpoint
- ACTIONS: files/commands run
- RESULT: pass/fail and next action

### Blocked Task Protocol
1. Mark BLOCKED with evidence.
2. Attempt one bounded workaround.
3. Escalate with options if unresolved.

## Consolidation Addendum (2026-02-22)

- This lifecycle plan remains the single canonical plan for the active RAG track.
- Command-alignment consolidation evidence is tracked in supplemental/command-alignment-summary.md.
- Non-skill-graph consolidation evidence is tracked in supplemental/non-skill-graph-consolidation-summary.md.
- Cross-document pointers are indexed in supplemental-index.md.

## Source: 006-hybrid-rag-fusion-logic-improvements

---
title: "Implementation Plan: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/plan.md]"
description: "This plan executes audit-first hardening across retrieval, ranking, session/state integrity, telemetry governance, and self-healing operations with explicit traceability to expanded requirements."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "hybrid rag fusion"
  - "cross-system hardening"
  - "automation interconnection"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js), Markdown spec tooling |
| **Framework** | system-spec-kit MCP server + command scripts |
| **Storage** | SQLite + markdown-based spec and memory artifacts |
| **Testing** | Vitest, script-level functional tests, spec validation scripts |

### Overview
This plan now covers all risk-bearing systems discovered in research, not only retrieval/fusion internals. Delivery runs in five phases: cross-system audit, ranking/channel hardening, state-integrity hardening, telemetry/operations governance, and verification/sign-off closure. The plan preserves architecture decisions from `002` and converts fragile seams from `003`, `004`, and `005` into measured controls and release gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented for ten subsystems
- [x] Success criteria and thresholds measurable
- [x] Dependencies identified with continuity from `002` to `005`
- [x] Requirement -> phase -> task traceability map established

### Definition of Done
- [x] All P0 acceptance criteria met
- [x] P1 items complete or explicitly deferred with approval
- [x] Regression, recovery, and telemetry gates passing
- [x] Latency/reliability budgets verified
- [x] Governance docs synchronized (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-first, contract-driven hardening with release-gated invariants and self-healing operations.

### Key Components
- **Cross-System Audit Orchestrator**: maps subsystem contracts, captures baselines, and ranks seam risks.
- **Ranking and Contract Guardrails**: retrieval/fusion determinism, graph relation contract checks, and cognitive modifier bounds.
- **Session/State Integrity Layer**: session manager quality controls, session-learning hygiene, CRUD re-embedding consistency, parser/index invariants, and storage recovery checks.
- **Telemetry Governance Layer**: trace schema registry, payload validation, and docs drift enforcement.
- **Prevention and Operations Layer**: deferred/skipped-path test hardening and self-healing runbooks.

### Data Flow
1. Capture baseline metrics and continuity constraints for all ten subsystem areas.
2. Apply ranking/channel hardening (fusion, graph, cognitive) with deterministic contracts.
3. Apply session/state-integrity controls (routing quality, learning hygiene, CRUD re-embed, parser/index health, storage recovery).
4. Govern diagnostics through telemetry schema validation and docs drift checks.
5. Run prevention, recovery, and operational self-heal drills before sign-off.
<!-- /ANCHOR:architecture -->

---

## 3.5 CARRY-FORWARD IMPLEMENTATION NOTES (002/003/004/005)

| Prior Spec | Carry-Forward Asset | 006 Usage |
|------------|---------------------|-----------|
| `002-hybrid-rag-fusion` | Tri-hybrid retrieval + MMR/TRM pipeline | Baseline for retrieval/fusion determinism and channel governance |
| `003-index-tier-anomalies` | Canonical path dedup + tier precedence | Elevated to parser/index + storage integrity gates |
| `004-frontmatter-indexing` | Frontmatter normalization + idempotent reindex | Enforced as parser/index invariant and metadata consistency precondition |
| `007-combined-bug-fixes` | Confidence-aware folder/session detection | Extended into session manager and session-learning quality/performance controls |

| Expanded Area | Primary Continuity Source | Implementation Note |
|---------------|---------------------------|---------------------|
| Graph/causal relation scoring | `002` | Contract tests and relation score calibration are now mandatory release-gated checks |
| Cognitive decay + FSRS ranking | `002` + `005` | Confidence/ranking alignment requires bounded cognitive weighting and ablation checks |
| CRUD re-embed consistency | `003` + `004` | Canonical metadata and index consistency now include mutation-to-embedding SLA controls |
| Storage recovery + mutation ledger | `003` | Index integrity now extends to transactional recovery parity and replay consistency |
| Telemetry/docs drift governance | `004` + `005` | Diagnostic schema changes require matching docs updates and gate validation |

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Cross-System Audit and Continuity Lock
- [x] Build subsystem contract map for all ten scoped areas.
- [x] Capture baseline fixtures, latency/reliability metrics, and deferred/skipped-path inventory.
- [x] Produce risk register and continuity mapping from `002/003/004/005` to 006 controls.
- [x] Lock decision gates `T025`/`T026`/`T027` (relation corpus policy, cognitive-weight scope, self-healing auto-remediation policy) before Phase 2 execution.

### Phase 2: Ranking and Channel Contract Hardening
- [x] Harden retrieval/fusion determinism, graph relation scoring contracts, and cognitive ranking bounds.
- [x] Align low-confidence policy across retrieval and session routing behavior.
- [x] Emit ranked-channel diagnostics and confidence rationale in debug metadata.

### Phase 3: Session and State Integrity Hardening
- [x] Improve session manager/session-learning quality and performance.
- [x] Enforce CRUD re-embedding consistency SLAs.
- [x] Enforce parser/index invariants and index-health automation.
- [x] Add storage recovery and mutation-ledger parity checks.

### Phase 4: Telemetry Governance and Operational Automation
- [x] Implement trace schema registry and validation gates.
- [x] Add docs drift prevention checks tied to telemetry and runbook contracts.
- [x] Build self-healing checks and operational runbooks for known failure classes.

### Phase 5: Verification Hardening and Governance Closure
- [x] Convert deferred/skipped-path tests into active coverage or approved deferrals.
- [x] Run full performance/reliability/recovery verification suite.
- [x] Finalize evidence, ADR updates, checklist closure, and sign-offs.

### Requirement-to-Phase Mapping

| Requirement IDs | Phase |
|-----------------|-------|
| REQ-001, REQ-015 | Phase 1 |
| REQ-002, REQ-003, REQ-004, REQ-014 | Phase 2 |
| REQ-005, REQ-006, REQ-007, REQ-008 | Phase 3 |
| REQ-009, REQ-011, REQ-017 | Phase 4 |
| REQ-010, REQ-012, REQ-013, REQ-016, REQ-018 | Phase 5 |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | fusion bounds, relation scoring, cognitive weighting, session confidence math | Vitest |
| Integration | retrieval + session + CRUD + parser/index + telemetry contracts | Vitest + script harness |
| Regression | known failures and deferred/skipped paths from `002`/`003`/`004`/`005` | functional suites + fixture replay |
| Recovery | transaction interruption, ledger replay, index repair | script harness + deterministic replay fixtures |
| Performance | retrieval/session latency budgets, automation overhead, health loop runtime | benchmark scripts + CI metrics |
| Operational | runbook drills for index drift, session ambiguity, ledger mismatch, telemetry drift | command-line runbooks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline fixtures for retrieval/session/storage/telemetry paths | Internal | Green | Hardening cannot be validated against real behavior |
| Parser/index normalization guarantees from `003` and `004` | Internal | Green | State-integrity controls can produce false positives |
| Session confidence hooks from `005` | Internal | Green | Routing/retrieval policy alignment is incomplete |
| Mutation ledger + transaction recovery hooks | Internal | Yellow | Storage reliability criteria cannot be proven |
| CI support for schema-gate and self-healing verification | Internal | Yellow | Prevention controls cannot be release-enforced |

Status criteria:
- `Green`: validated in the current branch with passing evidence available.
- `Yellow`: dependency is identified, but one or more validation artifacts are still pending.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sustained latency regression, elevated session misroute rate, re-embedding backlog growth, recovery replay mismatch, or telemetry-schema gate failures.
- **Procedure**: roll back by phase in reverse critical-path order while preserving audit baselines and replay fixtures; restore previous thresholds/contracts; rerun critical regression + recovery suites before reattempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit + Continuity)
  ├──► Phase 2 (Ranking/Channel Hardening)
  └──► Phase 3 (Session/State Integrity)

Phase 2 outputs ─┐
                 ├──► Phase 4 (Telemetry/Ops Governance)
Phase 3 outputs ─┘
                          └──► Phase 5 (Verification + Sign-off)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 Audit | Prior-spec continuity mapping | Phases 2, 3, 4, 5 |
| Phase 2 Ranking/Channel | Phase 1 baselines | Phases 4, 5 |
| Phase 3 Session/State | Phase 1 baselines + Phase 2 confidence contracts | Phases 4, 5 |
| Phase 4 Telemetry/Ops | Phases 2 and 3 outputs | Phase 5 |
| Phase 5 Verification | Phases 2, 3, 4 complete | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Cross-System Audit | High | 1.5-2.5 days |
| Phase 2: Ranking/Channel Hardening | High | 2-3 days |
| Phase 3: Session/State Integrity | High | 2-3 days |
| Phase 4: Telemetry/Ops Governance | High | 1.5-2.5 days |
| Phase 5: Verification/Closure | Medium-High | 1-2 days |
| **Total** | | **8-13 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline audit fixtures archived for retrieval, session, and storage paths
- [x] Threshold and contract deltas documented with before/after metrics
- [x] Recovery replay artifacts captured and verifiable
- [x] Emergency gate override protocol documented with approver list

### Rollback Procedure
1. Disable newly introduced gates only when verified false positives are documented.
2. Revert phase-specific changes in reverse order (Phase 5 -> Phase 2).
3. Restore prior stable thresholds/contracts from archived baseline artifacts.
4. Re-run deterministic regression, recovery replay, and telemetry schema checks.
5. Record incident details and decision-record updates before redeployment.

### Data Reversal
- **Has data migrations?** No direct schema migrations expected
- **Reversal procedure**: restore previous index snapshots and mutation-ledger checkpoint, then replay validated transaction set to confirm parity
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────────────┐
│ A: Cross-System Baselines  │
└──────────────┬─────────────┘
               │
      ┌────────▼─────────┐
      │ B: Ranking Guard │
      │ (fusion/graph/cog)
      └───────┬──────────┘
              │
      ┌───────▼──────────┐
      │ C: Session/State │
      │ Integrity Layer  │
      └───────┬──────────┘
              │
      ┌───────▼──────────┐
      │ D: Telemetry/Ops │
      │ Governance Layer │
      └───────┬──────────┘
              │
      ┌───────▼──────────┐
      │ E: Verification  │
      │ and Sign-off     │
      └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| A Baselines | Prior-spec continuity mapping | Contract map + fixture corpus + risk register | B, C, D, E |
| B Ranking Guard | A | Deterministic fusion/graph/cognitive behavior | C, D, E |
| C Session/State | A + B | Session quality controls + CRUD/index/storage invariants | D, E |
| D Telemetry/Ops | B + C | Schema-gated diagnostics + self-healing runbooks | E |
| E Verification | B + C + D | Release-gate evidence and approvals | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Cross-system baselines and continuity lock complete** - 1.5 days - CRITICAL
2. **Ranking/channel hardening stabilized** - 2 days - CRITICAL
3. **Session/state integrity controls validated** - 2 days - CRITICAL
4. **Telemetry/ops governance checks operational** - 1.5 days - CRITICAL
5. **Verification/recovery/sign-off closure** - 1 day - CRITICAL

**Total Critical Path**: ~8 days

**Parallel Opportunities**:
- Telemetry schema authoring can start during Phase 3 once diagnostic contracts stabilize.
- Runbook drafting can proceed in parallel with verification fixture expansion.
- Documentation evidence updates can run concurrently with Phase 5 gate execution.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines Locked | Ten-subsystem audit and continuity matrix approved | End Phase 1 |
| M2 | Ranking Contracts Hardened | Fusion/graph/cognitive suites pass deterministic and quality bounds | End Phase 2 |
| M3 | State Integrity Hardened | Session/CRUD/index/storage gates pass with required thresholds | End Phase 3 |
| M4 | Governance and Ops Ready | Telemetry schema/docs drift checks and runbooks validated | End Phase 4 |
| M5 | Release Ready | Full verification evidence and sign-offs complete | End Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Broad cross-system hardening over retrieval-only tuning

**Status**: Accepted

**Context**: Research identified high-risk seams outside retrieval/fusion. Limiting work to ranking internals would leave unresolved state-integrity and operational failure modes.

**Decision**: Execute full ten-subsystem hardening with explicit requirement mapping and release gates.

**Consequences**:
- Positive: failure prevention is systemic rather than local.
- Negative: implementation complexity and verification scope increase.

**Alternatives Rejected**:
- Retrieval/fusion-only plan: rejected because it does not cover discovered systemic risks.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md` sections 1-5 + continuity and traceability mappings
**Duration**: one focused pass
**Agent**: Primary

### Tier 2: Controlled Parallel Preparation
| Agent | Focus | Files |
|-------|-------|-------|
| Primary (single-owner) | Plan + tasks synchronization | `plan.md`, `tasks.md` |
| Primary (single-owner) | Checklist + governance synchronization | `checklist.md`, `decision-record.md`, `implementation-summary.md` |

**Execution Rule**: Workflow runs in one LEAF execution context; no nested dispatch is used.

### Tier 3: Integration
**Agent**: Primary
**Task**: Validate requirement-to-task mapping, sign-off consistency, and gate readiness across all docs
**Duration**: final verification pass
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Ranking Contracts | Retrieval Maintainer | search/scoring modules + tests | Planned |
| W-B | Session and State Integrity | Platform Maintainer | session, CRUD, parser/index, storage modules + tests | Planned |
| W-C | Governance and Operations | QA + Operations | telemetry schema, runbooks, checklist, ADRs | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | M1 complete | W-A, W-B, W-C | Approved baselines and locked contract map |
| SYNC-002 | M2 complete | W-A, W-B | Confidence and ranking contract freeze |
| SYNC-003 | M3 complete | W-B, W-C | State-integrity and recovery evidence packet |
| SYNC-004 | M4 complete | W-A, W-B, W-C | Release-gate readiness packet |

### File Ownership Rules
- Each implementation file has one primary owner and one reviewer.
- Cross-workstream edits require sync checkpoint evidence.
- Unplanned scope additions require explicit deferral entry and approval.
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: status updates in `tasks.md` and blockers in `checklist.md`.
- **Per Phase**: milestone review with continuity and risk register updates.
- **Operational Drill**: runbook simulation summary at end of Phase 4.
- **Blockers**: immediate escalation with command-level evidence.

### Escalation Path
1. Technical blocker -> Engineering Lead
2. Verification failure -> QA Lead
3. Operational readiness blocker -> Operations Lead
4. Scope or timeline risk -> Product Owner
<!-- /ANCHOR:communication -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target files, tests, and subsystem focus for active phase.
- Confirm continuity constraints from `002/003/004/005` remain valid.
- Confirm no schema migration and no out-of-scope refactor.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Edit only planned files for the current phase. |
| Verification | Run mapped tests/checks before claiming completion. |
| Evidence | Record concrete command/file evidence for completed P0/P1 items. |

### Status Reporting Format
- `STATE`: current checkpoint.
- `ACTIONS`: files edited and commands executed.
- `RESULT`: pass/fail plus next action.

### Blocked Task Protocol
1. Stop edits for the blocked area and capture error evidence.
2. Attempt one bounded workaround that does not expand scope.
3. Escalate with impact and options if unresolved.

---

<!--
LEVEL 3+ PLAN
Audit-first cross-system hardening with governance and prevention controls.
-->

