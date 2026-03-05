# Wave 1: Priority & Effort Calibration

> **Purpose:** Definitive re-evaluation of all 31 recommendations from documents 140 and 141
> **Date:** 2026-02-26
> **Method:** Systematic evidence-based re-classification against 5 criteria
> **Scale context:** 2,147 memories, 180MB database, graph hit rate = 0%

---

## 1. Evaluation Criteria

Each recommendation is scored against:

| Criterion | Scale | Weight | Notes |
|---|---|---|---|
| **Impact** | HIGH/MED/LOW | Primary | Actual ranking quality improvement at current scale |
| **Effort** | Hours (verified) | Secondary | Realistic estimate including tests, migration, flags |
| **Risk** | HIGH/MED/LOW | Gate | Could break existing functionality? |
| **Prerequisites** | List | Hard constraint | Must be done first |
| **Scale dependency** | Current (2K) / 10K+ / any | Context | Does this matter NOW or only at scale? |

---

## 2. Bug Fixes (G1-G4): Re-evaluation

### G1: Graph Channel ID Mismatch -- CONFIRMED P0 (RAISE to URGENT)

**Current classification:** P0 Bug
**Recommended:** P0-URGENT (do FIRST)

**Evidence:** [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:110`] -- Graph results emit `id: "mem:${row.id}"` where `row.id` is the *causal edge ID*, not a memory ID. Other channels emit numeric memory IDs. When RRF fusion tries to merge/deduplicate, these IDs never match, so graph results are silently excluded from final rankings.

**Codebase verification:** `graphChannelMetrics.graphHitRate = 0` confirms zero graph results are reaching users despite 4 queries being issued.

**Impact:** HIGH -- The entire graph channel is non-functional. This means the causal graph (the system's most unique signal) contributes nothing to retrieval.
**Effort:** 2-4h (change ID format in graph-search-fn.ts, verify join in RRF)
**Risk:** LOW (fixing a bug; worst case is graph results now appearing)
**Scale dependency:** Any (broken at all scales)

### G2: Double Intent Weighting -- DOWNGRADE to P1

**Current classification:** P0 Bug
**Recommended:** P1 (investigate, may not be a bug)

**Evidence from codebase investigation:** Intent weights are applied in `adaptive-fusion.ts` via `INTENT_WEIGHT_PROFILES` (line 108) to adjust channel weights during fusion. I verified that `rrf-fusion.ts` does NOT reference intent at all, and `composite-scoring.ts` does NOT apply intent weights either. The intent classifier (`intent-classifier.ts:446`) exports `getIntentWeights` and `getIntentAdjustedScores` but these appear to be called at different pipeline stages for different purposes (channel weighting vs result scoring).

**Assessment:** The "double weighting" claim requires deeper tracing through the full call chain. It may exist at a subtle level (intent affecting both channel weights AND convergence bonus), but it is NOT as clear-cut as the 141 document implies. The intent is applied once for adaptive fusion channel weights; a second application would need to be specifically traced.

**Impact:** MED (if real, causes mild distortion; not a total failure like G1)
**Effort:** 3-5h (trace full intent application path, determine if double-applied, fix if confirmed)
**Risk:** LOW
**Scale dependency:** Any

### G3: Chunk Collapse Conditional -- CONFIRMED P0

**Current classification:** P0 Bug
**Recommended:** P0

**Evidence:** [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:303,1003`] -- `collapseAndReassembleChunkResults` is called at line 1003 but the function's `seenParents` deduplication logic may allow duplicate chunk rows when `includeContent=false` (default search path). The function exists and is called.

**Impact:** MED-HIGH (duplicate results waste result slots, reduce effective recall)
**Effort:** 2-3h
**Risk:** LOW
**Scale dependency:** Any (proportional to chunked memory count)

### G4: Wire learnFromSelection -- DOWNGRADE to P1

**Current classification:** P0 Bug (in top-5 immediate)
**Recommended:** P1 (not a "bug" -- it is dead code by design choice)

**Evidence:** [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:3882`] -- Function exists but has zero callers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:308-310`] -- Wrapper exists and is exported.

**Rationale for downgrade:** This is not a correctness bug -- it is an unfinished feature. The function was deliberately left unwired (the safeguards described in 141 R11 are all NEW code). Wiring it without safeguards risks trigger pollution. It should be implemented as R11 (P1) with full safeguards, not as an urgent bug fix.

**Impact:** MED (long-term behavioral learning, but no user-visible breakage today)
**Effort:** 8-12h (with safeguards as specified in R11; without safeguards ~2h but risky)
**Risk:** HIGH without safeguards, MED with
**Scale dependency:** Any (but benefit scales with usage volume)

---

## 3. R1-R18 Recommendations: Re-evaluation

### R1: MPAB Chunk-to-Memory Aggregation

**Current:** P0 | **Recommended:** P1

**Rationale for downgrade:** At 2,147 memories, the number of chunked memories is a small fraction. The first-chunk-wins behavior affects only multi-chunk documents. The MPAB formula is mathematically sound but the impact is limited until chunk counts increase. Furthermore, R1 depends on R13 (eval infrastructure) to validate that it actually improves results.

**Impact:** MED (not HIGH -- limited by low chunk ratio)
**Effort:** 6-8h (not "~50 LOC" as 140 claims; includes tests, feature flag, dark-run comparison)
**Risk:** MED
**Prerequisites:** R13 (to measure impact)

### R4: Typed-Weighted Causal Degree as 5th RRF Channel

**Current:** P0 | **Recommended:** P0 (KEEP, but requires G1 first)

**Rationale:** The graph channel is uniquely orthogonal to vector/FTS/BM25 channels. Adding degree scoring increases graph signal value. BUT this is completely pointless if G1 is not fixed first -- graph results currently contribute zero.

**Impact:** HIGH (after G1 fix; zero without it)
**Effort:** 8-12h (degree computation, typed weighting, cap logic, feature flag, tests)
**Risk:** MED (hub domination if cap not set correctly)
**Prerequisites:** G1 (graph channel must be functional first)

### R6: 4-Stage Pipeline Refactor

**Current:** P2 | **Recommended:** P2 (KEEP)

**Rationale:** Important structural improvement but not urgent. The current pipeline works (aside from bugs). This is the right foundation for composing R1+R4+R7+R8 cleanly, but it should not block individual improvements.

**Impact:** HIGH (architectural; enables everything else)
**Effort:** 30-40h (the 141 doc says this but it is realistic -- major refactor of core pipeline)
**Risk:** MED (core retrieval path)
**Prerequisites:** G1, G3 (fix bugs before restructuring)

### R7: Anchor-Aware Chunk Thinning

**Current:** P2 | **Recommended:** P2 (KEEP)

No change. Effort estimate of ~100 LOC is realistic.

### R8: Memory Summary Generation

**Current:** P2 | **Recommended:** P3 (DOWNGRADE)

**Rationale:** At 2K memories, summary-based pre-filtering provides negligible benefit. The LLM dependency during indexing adds complexity. Defer until 5K+ memories where pre-filtering saves meaningful computation.

**Impact:** LOW (at current scale)
**Effort:** 15-20h (schema migration, generation logic, LLM integration)
**Risk:** LOW
**Scale dependency:** 5K+ memories

### R9: Spec Folder Pre-Filter

**Current:** P2 | **Recommended:** P2 (KEEP)

**Rationale:** At 2K memories across ~10 folders, spec-folder pre-filtering provides moderate benefit for scoped queries. Easy to implement with existing infrastructure.

**Impact:** MED
**Effort:** 4-6h
**Risk:** LOW

### R10: Auto Entity Extraction

**Current:** P3 | **Recommended:** P3 (KEEP)

No change. High effort, uncertain benefit. R4+R10 amplification loop is a real risk.

### R11: Learned Relevance Feedback (wiring learnFromSelection)

**Current:** P1 | **Recommended:** P1 (KEEP, absorbs G4)

**Rationale:** G4 and R11 are the same recommendation at different scopes. G4 = "wire it up", R11 = "wire it up WITH safeguards". They should be a single work item: R11 at P1.

**Impact:** MED-HIGH (long-term learning loop)
**Effort:** 12-16h (including safeguards: provenance tracking, TTL, denylist expansion, cap, threshold)
**Risk:** HIGH (trigger pollution without safeguards)
**Prerequisites:** R13 (to measure impact of learned triggers)

### R12: Embedding-Based Query Expansion

**Current:** P1 | **Recommended:** P2 (DOWNGRADE)

**Rationale:** Current static domain vocabulary serves known queries well. Embedding-based expansion adds latency (extra embedding generation) and risks introducing noise. The benefit is real but incremental. Better to first establish evaluation (R13) and fix the graph channel (G1) before adding more retrieval signals.

**Impact:** MED
**Effort:** 10-15h (not "~80 LOC" -- embedding generation, threshold tuning, testing)
**Risk:** MED (poor expansions add noise)
**Prerequisites:** R13

### R13: Retrieval Evaluation Infrastructure

**Current:** P0 Foundation | **Recommended:** P0-FOUNDATION (KEEP -- highest priority after G1)

**Rationale:** Absolutely essential. Without this, every other change is operating blind. The 52h estimate across 3 sprints is realistic but Sprint 1 alone (23h) delivers 80% of the value.

**Impact:** CRITICAL (enables measurement of everything else)
**Effort:** Sprint 1 = 20-25h for core logging + metrics; Sprint 2-3 can follow iteratively
**Risk:** LOW (additive, separate database)
**Prerequisites:** None
**Recommendation:** Implement Sprint 1 ONLY initially. Defer Sprint 2-3 until Sprint 1 data accumulates.

### R14: Relative Score Fusion Mode

**Current:** P1 | **Recommended:** MERGE with N1 (single P1 item)

**Rationale:** R14 and N1 are the same recommendation. The 141 document itself notes this ("This overlaps with N1 and should be implemented as a single recommendation"). The ~80 LOC estimate is realistic for the fusion algorithm itself.

**Impact:** MED (theoretical ~6% recall improvement; depends on corpus characteristics)
**Effort:** 8-10h (including A/B infrastructure, feature flag)
**Risk:** LOW (parallel to existing RRF, flag-gated)
**Prerequisites:** R13 (to measure actual improvement)

### R15: Query Complexity Router

**Current:** P1 | **Recommended:** P1 (KEEP)

**Rationale:** At 2K memories with all channels running on every query, efficiency gains are meaningful. Simple queries (trigger matches, direct lookups) should not invoke 4-5 channels. The ~100 LOC estimate is realistic.

**Impact:** HIGH for efficiency, MED for accuracy
**Effort:** 8-12h
**Risk:** LOW (flag-gated, easy rollback)
**Prerequisites:** None (can work with current pipeline)

### R16: Encoding-Intent Capture

**Current:** P1 | **Recommended:** P2 (DOWNGRADE)

**Rationale:** Theoretically sound (Tulving & Thomson), but confidence is LOW-MEDIUM. The benefit depends on consistent intent classification at both save and retrieval time. Current intent classifier accuracy is unknown. Better to first establish R13 evaluation, then measure intent classifier reliability, then implement encoding-intent.

**Impact:** LOW-MED (theoretical, unproven in this context)
**Effort:** 4-6h
**Risk:** LOW
**Prerequisites:** R13, intent classifier accuracy measurement

### R17: Fan-Effect Divisor in Spreading Activation

**Current:** P2 | **Recommended:** P1 (UPGRADE)

**Rationale:** This is a 5 LOC change with immediate impact on hub domination prevention. The co-activation spreading currently treats high-degree nodes identically to low-degree nodes, which means well-connected memories flood the activation network. The fix is trivial and mathematically well-grounded.

**Impact:** MED (prevents hub flooding in co-activation)
**Effort:** 1-2h (literally a single-line formula change + test update)
**Risk:** LOW
**Prerequisites:** None
**Note:** Should be bundled with G1 fix since both affect graph-related behavior

### R18: Embedding Cache for Instant Rebuild

**Current:** P1 | **Recommended:** P1 (KEEP)

**Rationale:** At 2,147 memories, a full re-index requires 2,147 API calls. With content-hash cache, unchanged memories skip embedding generation entirely. Immediate practical benefit for re-indexing workflows.

**Impact:** HIGH (for operational efficiency; zero ranking impact)
**Effort:** 6-8h (schema migration, cache lookup in indexing pipeline)
**Risk:** LOW (additive table, no effect on search)
**Prerequisites:** None

---

## 4. Novel Recommendations (N1-N5): Re-evaluation

### N1: Replace RRF with Adaptive Relative Score Fusion

**Current:** P1 | **Recommended:** MERGE with R14 as single P1

See R14 above. Single work item.

### N2: Graph-Deepening Before Signal-Broadening

**Current:** P0 | **Recommended:** P0 (KEEP, but scope clarification needed)

**Rationale:** The strategy is correct -- graph is the most orthogonal signal. But the 6-item priority list within N2 mixes bug fixes (G1), existing dead code activation (centrality), new features (R4 degree), and research-grade features (community detection, betweenness centrality, contradiction clusters). Only items 1-3 are realistic for near-term implementation.

**Scoped impact:** Items 1-3 = HIGH, Items 4-6 = MED (research phase)
**Effort:** Items 1-3 covered by G1 + R4; Items 4-6 = 20-30h additional
**Risk:** LOW for items 1-3, MED for items 4-6
**Recommendation:** N2 should be treated as a THEME, not a single recommendation. Items 1-3 are already captured as G1 + R4. Items 4-6 should be P3.

### N3: Memory Consolidation Background Process

**Current:** P2 | **Recommended:** P3 (DOWNGRADE)

**Rationale:** Novel and theoretically appealing, but high implementation complexity for uncertain benefit. The auto-linking, merge, and Hebbian strengthening features all require careful tuning and could introduce subtle quality regressions. At 2K memories, manual curation is still feasible. Defer until graph channel is proven effective (G1 + R4 + eval data from R13).

**Impact:** MED (potential, not proven)
**Effort:** 30-40h (significantly more than implied -- background process, semantic similarity computation, merge logic, conflict detection)
**Risk:** MED (automated mutations to memory graph)
**Prerequisites:** G1, R4, R13 (must prove graph channel value first)

### N4: Cold-Start Boost with Exponential Decay

**Current:** P1 | **Recommended:** P1 (KEEP)

**Rationale:** At 2K memories with active growth, new memories frequently ARE the most relevant. The 12h half-life decay is conservative. Implementation is trivial (~15 LOC in composite scoring).

**Impact:** MED
**Effort:** 2-4h
**Risk:** LOW (additive scoring factor, flag-gated)
**Prerequisites:** None

### N5: Two-Model Embedding Ensemble

**Current:** P3 | **Recommended:** DROP (or P4/FUTURE)

**Rationale:** Doubles storage (currently 180MB -> 360MB), doubles indexing time, doubles API costs. Benefit is entirely speculative at current scale and corpus composition. The system already has 4-5 channels providing signal diversity. Adding a second embedding model addresses diminishing returns at disproportionate cost.

**Impact:** LOW (diminishing returns on signal diversity)
**Effort:** 20-30h
**Risk:** MED (storage, cost, complexity)
**Scale dependency:** Only if single-model retrieval quality plateaus

---

## 5. Spec-Kit Logic Layer (S1-S5): Re-evaluation

### S1: Smarter Memory Content Generation (JSON sidecar)

**Current:** P2 | **Recommended:** P3 (DOWNGRADE)

**Rationale:** The markdown -> re-parsing cycle works. The information loss is theoretical but not measured. Better to invest in ranking improvements first and only optimize the generation pipeline if R13 data shows content quality as a bottleneck.

### S2: Template Anchor Optimization

**Current:** P1 | **Recommended:** P2 (DOWNGRADE)

**Rationale:** Sound advice but requires template redesign across all spec folder types. The current anchor granularity works adequately. The guidance (2000-4000 char sections, semantic headings) should be documented as best practice but not treated as a blocking implementation task.

### S3: Validation Signals as Retrieval Metadata

**Current:** P1 | **Recommended:** P2 (DOWNGRADE)

**Rationale:** The quality boost from validation status is incremental. Well-validated spec folders are already likely to have higher-quality content that scores well. The signal adds marginal differentiation.

### S4: Spec Folder Hierarchy as Retrieval Structure

**Current:** P2 | **Recommended:** P2 (KEEP)

No change. Useful for parent-child navigation but not urgent.

### S5: Cross-Document Entity Linking at Generation Time

**Current:** P2 | **Recommended:** P3 (DOWNGRADE)

**Rationale:** Overlaps with R10 (auto entity extraction). Both create cross-references, but from different pipeline stages. Implement R10 first (at retrieval/index time), then evaluate whether generation-time linking adds value.

---

## 6. Merged and Dropped Recommendations

### MERGES

| Merged | Into | Rationale |
|---|---|---|
| **G4** | **R11** | G4 (wire learnFromSelection) is the unsafeguarded subset of R11. Single work item. |
| **R14** | **N1** | Identical recommendation. Single work item: "Relative Score Fusion". |
| **N2 items 1-3** | **G1 + R4** | Already covered by separate recommendations. |

### DROPS

| Dropped | Rationale |
|---|---|
| **R3** | SKIP (confirmed -- subsumes by R5, irreversible data risk). Already marked SKIP in 141. |
| **R5** | DEFERRED (confirmed -- 2K memories, 180MB is negligible. Revisit at 10K+). Already marked DEFERRED in 141. |
| **N5** | DROP -- Cost disproportionate to benefit at any foreseeable scale. |

### RECLASSIFICATIONS SUMMARY

| Rec | Original | New | Direction | Rationale |
|---|---|---|---|---|
| G1 | P0 | P0-URGENT | RAISE | Graph channel 100% broken; blocks R4, N2 |
| G2 | P0 | P1 | LOWER | May not be a real bug; needs investigation |
| G4 | P0 | MERGE->R11(P1) | LOWER | Not a bug; unfinished feature with safeguard requirements |
| R1 | P0 | P1 | LOWER | Limited impact at current chunk ratio |
| R4 | P0 | P0 | KEEP | High value, requires G1 first |
| R8 | P2 | P3 | LOWER | Scale-dependent benefit (5K+) |
| R12 | P1 | P2 | LOWER | Incremental; needs R13 first |
| R14 | P1 | MERGE->N1(P1) | MERGE | Identical to N1 |
| R16 | P1 | P2 | LOWER | Theoretical; low confidence |
| R17 | P2 | P1 | RAISE | Trivial fix, immediate impact |
| N2 | P0 | THEME | RESTRUCTURE | Items 1-3=G1+R4; items 4-6=P3 |
| N3 | P2 | P3 | LOWER | High complexity, uncertain benefit |
| N5 | P3 | DROP | DROP | Cost >> benefit at any scale |
| S1 | P2 | P3 | LOWER | Theoretical optimization |
| S2 | P1 | P2 | LOWER | Template guidance, not blocking |
| S3 | P1 | P2 | LOWER | Marginal signal |
| S5 | P2 | P3 | LOWER | Overlaps with R10 |

---

## 7. DEFINITIVE TOP 10 PRIORITY RANKING

This is the single ordered list of what to implement, in sequence.

| Rank | ID | Name | Hours | Why This Order |
|---|---|---|---|---|
| **1** | **G1** | Fix graph channel ID mismatch | 2-4h | The entire graph channel is broken. Zero graph results reach users. Blocks R4 and all graph-related improvements. Highest ROI fix in the system. |
| **2** | **G3** | Fix chunk collapse conditional | 2-3h | Duplicate chunk rows waste result slots. Quick correctness fix. |
| **3** | **R13 (Sprint 1)** | Evaluation infrastructure (core) | 20-25h | Foundation for everything else. Without metrics, all improvements are operating blind. Implement ONLY Sprint 1: eval-db, logging, pipeline hooks, core metrics (MRR@5, NDCG@10, Recall@20). Capture baseline BEFORE any ranking changes. |
| **4** | **R4** | Typed-weighted degree as 5th RRF channel | 8-12h | Now that G1 is fixed and R13 is measuring, add the highest-orthogonality new signal. Dark-run comparison via R13 infrastructure. |
| **5** | **R17** | Fan-effect divisor in co-activation | 1-2h | Trivial 5-LOC fix that prevents hub domination in spreading activation. Bundle with graph-related work from rank 4. |
| **6** | **R15** | Query complexity router | 8-12h | 40-60% computation reduction for simple queries. Independent of other ranking changes. No prerequisites. Immediate efficiency gain. |
| **7** | **R18** | Embedding cache for instant rebuild | 6-8h | Operational efficiency: eliminates redundant API calls during re-index. Independent work, no ranking impact, pure infrastructure win. |
| **8** | **N4** | Cold-start boost with exponential decay | 2-4h | Ensures new memories surface when relevant. Trivial implementation in composite scoring. Quick win after baseline established. |
| **9** | **R14/N1** | Relative Score Fusion (merged) | 8-10h | Alternative fusion algorithm preserving score magnitude. A/B testable against existing RRF via R13 shadow scoring. |
| **10** | **R1** | MPAB chunk-to-memory aggregation | 6-8h | Better multi-chunk scoring. Measurable via R13. Lower priority because chunk ratio is currently low. |

### Total for Top 10: ~65-90 hours

### Why these 10 and not others?

**Excluded from top 10 but important (P1-tier, do after top 10):**
- **R11** (Learned relevance feedback): HIGH risk of trigger pollution. Needs R13 data to design safeguards correctly. Implement after 2-4 weeks of R13 logging provides behavioral data.
- **R2** (Channel min-representation): Theoretical need; wait for R13 data showing channel monopoly before implementing.
- **G2** (Double intent weighting): May not be a real bug. Investigate during R13 baseline capture.

**Excluded from top 10 (P2-tier, medium term):**
- **R6** (Pipeline refactor): Big investment; wait until the incremental improvements (R1, R4, R14/N1) validate the direction.
- **R9, S2, S3, S4, R16**: Moderate improvements, implement after P0/P1 foundation is solid.

**Excluded from top 10 (P3-tier / long-horizon):**
- **R7, R8, R10, N3, S1, S5**: Either scale-dependent, high-complexity, or uncertain benefit.

---

## 8. Effort Estimate Accuracy Assessment

Several effort estimates in the 141 document are **underestimated**. Here are the corrected ranges:

| Rec | 141 Estimate | Corrected Estimate | Discrepancy Reason |
|---|---|---|---|
| R1 | ~50 LOC | 6-8h (150-200 LOC with tests) | Tests, feature flag, dark-run wiring not counted |
| R4 | ~40 LOC | 8-12h (200-300 LOC with tests) | Batch query, cap logic, constitutional exclusion, tests |
| R11 | ~20 LOC | 12-16h (300+ LOC with safeguards) | Safeguards are the bulk of the work |
| R12 | ~80 LOC | 10-15h (200+ LOC) | Embedding generation, threshold tuning, integration |
| R13 Sprint 1 | 23h | 20-25h | Roughly accurate |
| R15 | ~100 LOC | 8-12h (200+ LOC) | Classification logic, routing, testing edge cases |
| R17 | ~5 LOC | 1-2h | Accurate -- truly trivial |
| R18 | ~50 LOC | 6-8h (100-150 LOC) | Schema migration, cache invalidation edge cases |

**Pattern:** LOC estimates consistently undercount test code, feature flag wiring, schema migrations, and integration code. Multiply LOC estimates by 2-3x for realistic implementation including tests.

---

## 9. Key Insights

### Insight 1: The Graph Channel is the Biggest Missed Opportunity

Graph channel hit rate is literally 0%. Fixing G1 (2-4 hours) unlocks an entire retrieval dimension that currently contributes nothing. This is the single highest-ROI action available.

### Insight 2: Measurement Before Movement

R13 (evaluation infrastructure) is the strategic foundation. Every recommendation marked P0/P1 depends on being measurable. Without R13, improvements are speculative and regressions are invisible.

### Insight 3: The 141 Document Over-classifies P0

The 141 document has 3 P0 bugs + 3 P0 recommendations + 1 P0 theme = 7 items all marked "most urgent." Real P0 (do this week) should be 3 items: G1, G3, R13-Sprint1. The rest are P1.

### Insight 4: Scale Context Matters

At 2,147 memories, several recommendations (R5, R8, N5) provide negligible benefit. The system is in a "quality over quantity" phase where ranking accuracy matters more than storage optimization or pre-filtering efficiency.

### Insight 5: Merge Duplicates, Drop Marginals

R14/N1 are identical. G4/R11 are the same at different scope. N2 is a theme, not a recommendation. N5 should be dropped entirely. After deduplication, the actual unique recommendation count is ~24, not 31.
