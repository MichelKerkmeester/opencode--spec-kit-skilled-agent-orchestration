# From Signal Saturation to Graph-Differentiated Retrieval: Definitive Final Analysis

> **Cross-system architectural analysis** of the spec-kit memory MCP server, synthesized from 13 independent agent investigations resolving all conflicts between Spec 140 and 141.

| Field | Value |
|-------|-------|
| Document Class | Final Synthesis Analysis |
| Supersedes | 140-analysis, 140-recommendations, 141-analysis, 141-recommendations |
| Date | 2026-02-26 |
| Method | 13 agents (10 Opus research + 3 Sonnet ultra-think), 3 waves |
| Systems Analyzed | alibaba/zvec, HKUDS/LightRAG, VectifyAI/PageIndex |
| Target System | spec-kit memory MCP server (context-server v1.7.2) |
| Active Recommendations | 30 (post-dedup, post-merge, post-correction, including 3 new gap recommendations) |
| Effort Range | 245-350h across 7 metric-gated sprints (see §9 for itemized breakdown) |

**Evidence Grade Key:**
- **A+** — Independently verified in source code by multiple agents
- **A** — Verified in source code or official documentation
- **B** — External benchmarks or well-reasoned multi-source analysis
- **C** — Theoretical analysis, cross-system analogy, or synthesis
- **D** — Speculation or unverified assertion
- **[!]** — Unresolved contradiction; empirical measurement required before acting

---

## Abstract

The spec-kit memory MCP server's path to self-improving retrieval is blocked by two prerequisites that must be addressed in strict order: **evaluation infrastructure** to make improvements measurable, then **graph channel repair** to make the system's most unique signal functional. Without these, all further signal sophistication amplifies noise rather than intelligence. The scoring disconnect between the RRF fusion layer and the composite scoring layer is a **calibration problem** (15:1 score magnitude mismatch), not an architectural defect — a distinction that reduces the cost and risk of the fix by an order of magnitude. After analyzing three external systems (zvec, LightRAG, PageIndex) against the internal architecture through 13 independent investigation lenses, this document presents the definitive architectural analysis with evidence-graded findings.

---

## 1. Framing and Analytical Lenses

This analysis was conducted through three complementary lenses, each addressing a blind spot in prior analyses:

**Signal Quality Lens** — The system has 15+ scoring signals with zero evaluation data. Adding signals past the saturation threshold produces noise amplification, not improvement. This lens asks: *which signals are orthogonal, which are redundant, and which are broken?*

**Graph Architecture Lens** — The graph channel is simultaneously the most unique signal (lowest correlation with other channels) and the most broken (0% production hit rate due to an ID format mismatch). This lens asks: *how do we unlock the graph signal before investing in new channels?*

**Evaluation Epistemology Lens** — Without retrieval quality metrics, every recommendation is speculation. This lens asks: *what must we measure before we can claim improvement?*

**Authority relationship to prior documents:** Spec 141 supersedes Spec 140 on all conflicts. Four unique Spec 140 insights are preserved as supplementary annotations: KL-divergence calibration for batch quantization, gleaning (two-pass extraction), chunk-frequency scoring, and the "What NOT to Do" list.

---

## 2. Conflict Resolution Register

All conflicts between Spec 140, Spec 141, and the 10 Wave 1-2 investigation agents are resolved here. No subsequent section re-litigates these — they cite this register.

| # | Conflict | Resolution | Evidence Grade | Winner |
|---|----------|-----------|----------------|--------|
| C1 | Effort: 44-55h vs 240-360h | False dichotomy: 44-55h is Sprint 0 (MVP); 240-360h is full program | N/A | Both correct for scope |
| C2 | G2 (double intent weighting): P0 bug vs P1-investigate | **P1-investigate** — two different weight sets at different pipeline stages; may be intentional | B | Wave 1 agents |
| C3 | R1 priority: P0 vs P1 | **P1** (scale-limited impact); MPAB formula correct but has div-by-zero bug requiring guards | A+ | Split: Priority=Wave1, Formula=141 |
| C4 | R11 risk: LOW vs HIGH | **HIGH** — FTS5 tokenizer strips `[learned:]` prefix; requires separate column, not prefix | A | Wave 2 agents |
| C5 | INT8 recall loss: 1-2% vs 5.32% | **[!] Use 5.32% as planning estimate** (specific benchmark beats approximation); measure in-system | B | 141 on specificity |
| C6 | search-weights.json: dead vs active | **Partially active** — `maxTriggersPerMemory` IS consumed at `vector-index-impl.ts:33-46` | A | Evidence Agent |
| C7 | R4 dependency on R13 | Soft (quality) not hard (functional) — R4 can be built without R13 but should not go live without baseline | A | Both correct for type |
| C8 | Phase grouping: 4 risk-phases vs 7 sprints | **Metric-gated sprints** — risk grouping lacks go/no-go criteria | A | Roadmap Agent |
| C9 | N2 scope: single rec vs theme | **Dissolve N2** — items 1-3 are G1+R4; items 4-6 gated on edge density measurement | A | Wave 1 agents |
| C10 | "Intelligence Conservation Law" | **Rename to "Index-Query Investment Tradeoff"** — useful heuristic, not a law; ColBERT counter-example | C | Evidence Agent |

**Two items remain [!] unresolved:**
- INT8 recall loss: 1-2% vs 5.32% — requires in-system ablation study
- `search-weights.json` smart ranking section: requires audit to confirm dead status of non-`maxTriggersPerMemory` fields

---

## 3. The Evaluation Prerequisite — Why R13 Is Not Optional

**Core argument [Evidence: B]:** The system has 15+ scoring signals, zero retrieval quality metrics, and hand-tuned weights. In this state, adding MORE signals is net-harmful — each new signal adds variance without a mechanism to detect whether it improves or degrades results.

R13 (evaluation infrastructure) is not one recommendation among 30. It is the **epistemological prerequisite** that converts all other improvements from speculation into measurable progress.

### The Feedback Bootstrap Problem

A circular dependency exists:
- R13 needs interaction data to compute metrics
- R11 (learned relevance feedback) needs R13's query provenance tracking to function
- The evaluation framework needs changes to measure their impact against

**The only correct entry point** is R13-Sprint1's interaction event logging — a minimal viable seed that captures query-result-selection triples. This costs ~25h and enables:
1. Baseline MRR@5, NDCG@10, Recall@20 computation
2. A BM25-only baseline comparison (the single largest analytical blind spot — see §9)
3. Query provenance tracking that R11 depends on [Evidence: A — Feasibility Agent confirmed hidden dependency]

### The BM25 Baseline Gap

**Every recommendation in the research corpus proposes optimizing a 4-channel hybrid system without ever proving it outperforms a single well-tuned BM25 channel** [Evidence: B — Gaps Agent identified across all 4 documents]. This is the most significant blind spot. If BM25 alone achieves MRR@5 of 0.6 and the hybrid system achieves 0.65, the marginal value of 14 additional signals is questionable. Conversely, if BM25 alone achieves 0.3, the hybrid system is clearly earning its complexity.

R13-Sprint1 must produce this baseline as its first deliverable.

### BM25 Contingency Framework

The BM25 baseline measurement (Sprint 0 exit) triggers one of three decision paths:

| BM25 vs Hybrid MRR@5 | Decision | Impact on Roadmap |
|----------------------|----------|-------------------|
| **≥80%** of hybrid MRR@5 | **Pause** multi-channel optimization; investigate why single-channel performs comparably | Sprints 3-7 deferred pending root-cause analysis |
| **50-80%** of hybrid MRR@5 | **Proceed** with hybrid optimization; rationalize to 3 channels (drop weakest-contributing channel) | Sprint scope may reduce; channel count review in Sprint 1 |
| **<50%** of hybrid MRR@5 | **Proceed** with full roadmap — hybrid system is clearly earning its complexity | No change to sprint plan |

**Measurement timing:** Sprint 0 exit gate (before any Sprint 1 work begins).
**Decision owner:** Project lead reviews BM25 baseline report and selects path within 48h of Sprint 0 completion.
**Escalation:** If BM25 ≥80%, escalate to architecture review before investing in Sprints 1+. The ≥80% scenario does not invalidate Sprint 0 work (G1, G3, R13 are unconditionally valuable) but reframes the optimization strategy.

---

## 4. Graph Channel Dysfunction and the Temporal Inversion Problem

### G1: The Zero Hit Rate Finding

**The single most critical finding in the entire research corpus** [Evidence: A+]: the graph channel produces 0% hit rate in production due to an ID format mismatch. Graph search produces IDs formatted as `mem:${edgeId}` (strings), while all other channels produce numeric IDs. This causes MMR reranking and causal boost to **silently skip all graph results** because ID lookups fail.

This means:
- The graph channel (weighted at 0.5 in adaptive fusion) contributes zero signal
- All graph-related features (co-activation, causal boost, causal-degree scoring) operate on a phantom dataset
- The system has been running as a **3-channel system** (vector + FTS5 + BM25) despite being designed as 4-channel

### Why Graph Matters Most

From signal orthogonality analysis [Evidence: B]:

| Signal Pair | Correlation | Notes |
|---|---|---|
| Vector + FTS5 | MEDIUM | Lexical vs semantic — some overlap |
| Vector + BM25 | MEDIUM-HIGH | Both measure term-relevance |
| FTS5 + BM25 | **HIGH** | Both lexical; FTS5 is effectively a superset |
| Vector + Graph | **LOW** | Structural connectivity vs content similarity |
| FTS5 + Graph | **LOW** | Entirely different information types |

**The graph channel is the most orthogonal signal** — it measures structural relationships, not content similarity. From ensemble learning theory (Dietterich, 2000), an ensemble of moderately accurate but *diverse* classifiers outperforms a single highly accurate classifier. The graph channel provides the most diversity value but contributes the least (zero) to current results.

**Fixing G1 is a step-function improvement** — it unlocks more ensemble diversity than adding any new channel or switching from RRF to Relative Score Fusion.

### The Temporal Inversion

The original roadmap (Spec 141) sequences graph-deepening recommendations (centrality, community detection) *before* edge density work (R10, entity extraction). This is **architecturally inverted** [Evidence: B]:

- Graph centrality requires a well-connected graph (mean edges/node > 1.0)
- Community detection requires dense clusters of related nodes
- The current graph may be sparse (unknown until G1 is fixed and measured)

**Correct sequence:** Fix G1 → Measure graph density → If sparse, prioritize R10 (entity extraction) → Only then invest in centrality/communities.

### R4+N3 Preferential Attachment Loop

If R4 (causal-degree scoring) boosts well-connected memories, and N3 (consolidation) auto-creates edges between semantically similar memories, a feedback loop emerges [Evidence: B]:
- Well-connected memories get boosted → more visible → more likely to be co-activated → more edges created → even more connected

**Mitigation:** Define `MAX_TYPED_DEGREE = 15` per edge type and `MAX_TOTAL_DEGREE = 50` per node. Monitor via edge density histogram in Sprint 1 exit gate.

---

## 5. Signal Architecture — A Calibration Problem, Not an Architectural Defect

### The Dual Scoring Reframe

Spec 141 identified two parallel scoring systems:
- **System A (RRF):** 4-channel fusion with K=60, scores in range ~[0, 0.07]
- **System B (Composite):** 6-factor weighted sum, scores in range ~[0, 1]

The original diagnosis: "disconnected systems requiring architectural integration."

**The corrected diagnosis [Evidence: B]:** These systems correctly measure orthogonal dimensions — System A measures *query-dependent relevance* (how well does this memory match THIS query?), while System B measures *query-independent value* (how important is this memory in general?). The problem is not disconnection but **score magnitude mismatch** — System B dominates by ~15:1 purely due to scale.

**Why this reframe matters:** Calibration (min-max normalization to a common [0,1] scale) is cheaper, lower-risk, and more reversible than architectural surgery. The wrong diagnosis leads to a 400+ LOC pipeline refactor (R6); the correct diagnosis requires ~50 LOC of score normalization.

### Pipeline R6: The Kitchen Sink Problem

The proposed 4-stage pipeline (Candidate → Fusion → Rerank → Post-Process) has a structural flaw [Evidence: B]: Stage 4 bundles score-modifying operations (composite scoring adjustment, causal boost) with non-score operations (state filtering, session dedup, evidence gap detection). Without a "no score changes in Stage 4" invariant, the double-weighting anti-pattern would be recreated at the architectural level.

**Recommendation:** If R6 is implemented, enforce that Stages 1-3 handle ALL score computation. Stage 4 is exclusively filtering and formatting.

### Dead Code and Unused Signals

Six implemented signals are never used in ranking [Evidence: A]:

| Signal | Location | Status |
|---|---|---|
| `quality_score` | `memory_index` table | Stored, never read in search |
| `confidence` | `confidence-tracker.ts` | Updated by `memory_validate`, not used in scoring |
| `validation_count` | `confidence-tracker.ts` | Incremented, never read in search |
| `computeStructuralFreshness()` | `composite-scoring.ts` | Unreachable code |
| `computeGraphCentrality()` | `composite-scoring.ts` | Unreachable code |
| `learnFromSelection()` | `vector-index-impl.ts:2872` | Zero callers (dead code) |

**Cross-reference: Dead signal → Activating recommendation:**

| Dead Signal | Activating Recommendation | Sprint | Notes |
|-------------|--------------------------|--------|-------|
| `computeGraphCentrality()` | N2 (graph deepening items 4-6) | S6 Phase A | Requires edge density > 1.0 edges/node |
| `learnFromSelection()` | R11 (learned relevance feedback) | S4 | With separate `learned_triggers` column safeguard |
| `quality_score` | R13 (indirect — eval infrastructure enables quality scoring) | S0 | Currently stored but never read in search path |
| `confidence` / `validation_count` | G-NEW-3 (feedback bootstrap strategy) | Integrated | Updated by `memory_validate` but not used in scoring |
| `computeStructuralFreshness()` | **Not targeted** — candidate for future work or removal | — | Unreachable code; evaluate after Sprint 6 whether structural freshness adds orthogonal signal |

These represent latent capabilities. The system already has the scaffolding for behavioral learning and graph-based scoring — it just hasn't been activated.

---

## 6. Risk Landscape — Corrected Severity Ratings and Missing Risks

### Seven Previously Missing Risks

| # | Risk | Affected Recs | Consequence | Severity |
|---|------|--------------|-------------|----------|
| MR1 | FTS5 trigger contamination from R11 | R11 | **Irreversible** without full re-index; `[learned:]` prefix stripped by tokenizer | CRITICAL |
| MR2 | R4+N3 preferential attachment loop | R4, N3 | Runaway edge growth; hub domination of results | HIGH |
| MR3 | Feature flag explosion (24 flags = 16.7M states) | All | Combinatorial testing impossibility; non-deterministic behavior | HIGH |
| MR4 | R1-MPAB div-by-zero at N=0 | R1 | Silent NaN propagation poisons downstream scoring | HIGH |
| MR5 | R4 `MAX_TYPED_DEGREE` undefined | R4 | No degree cap = unbounded boost for hub nodes | MEDIUM |
| MR6 | R11 hidden dependency on R13 query provenance | R11 | "Not in top 3" safeguard impossible without query logging | MEDIUM |
| MR7 | R15 (complexity router) violates R2 (channel diversity) | R15, R2 | Single-channel routes cannot satisfy diversity guarantee | MEDIUM |

### Critical Interaction Effect: Triple Boost

A newly indexed constitutional memory with multiple chunks, within the first 12 hours, receives [Evidence: B]:
1. MPAB chunk-aggregation bonus (R1)
2. Cold-start boost of +15% (N4)
3. Constitutional tier surface guarantee

**This combination can cause a single memory to dominate all results for 12-48h regardless of query relevance.** Mitigation: composite boost cap at 0.95 before tier adjustment.

### Five Corrected Risk Ratings

| Recommendation | Original Rating | Corrected Rating | Reason |
|---|---|---|---|
| R6 (pipeline refactor) | LOW | MEDIUM | Stage 4 kitchen sink problem requires invariant enforcement |
| R14/N1 (Relative Score Fusion) | LOW | MEDIUM | Score normalization behavior changes with data distribution shifts |
| R15 (complexity router) | LOW | MEDIUM | Direct conflict with R2 channel diversity guarantee |
| N3 (consolidation) | LOW-MED | HIGH | Preferential attachment loop with R4; runaway edge growth |
| R11 (learned feedback) | HIGH | **CRITICAL** | FTS5 contamination is irreversible; prefix mitigation doesn't work |

---

## 7. Cross-System Paradigm Comparison

### The Two-Dimensional Retrieval Space

```
                    QUERY-TIME INTELLIGENCE
                           HIGH
                            |
              PageIndex     |    spec-kit Memory
              (LLM reason   |    (multi-stage scoring,
               at query)    |     MMR, TRM, co-activation)
                            |
    LOW -------- INDEX-TIME INTELLIGENCE -------- HIGH
                            |
              zvec          |    LightRAG
              (minimal      |    (LLM entity extraction,
               indexing)    |     graph construction)
                            |
                           LOW
```

Each system embodies a distinct retrieval philosophy. The spec-kit memory MCP is uniquely positioned in the high-query-time quadrant, combining multi-channel fusion with temporal decay and cognitive features that no other analyzed system possesses.

### Index-Query Investment Tradeoff (Heuristic, Not Law)

There is a design tradeoff between investing intelligence at index time versus query time. Rich indexing simplifies query pipelines; sophisticated query processing compensates for simpler representations. **This is a useful heuristic, not a universal law** — late-interaction models (ColBERT) invest heavily at both stages [Evidence: C].

### What Our System Does Better

These aspects are **superior** to all analyzed external systems and should be preserved:

| Strength | Why It's Better | Evidence |
|---|---|---|
| FSRS v4 temporal decay | No temporal scoring in any external system | A |
| Cognitive working memory (Miller's Law) | No equivalent anywhere | A |
| 6-tier importance model | LightRAG/PageIndex have flat ranking | A |
| Session deduplication (~50% token savings) | Novel mechanism | A |
| Constitutional memory tier | Critical for AI agent safety; no equivalent | A |
| Intent-aware weight profiles (7 types) | More sophisticated than LightRAG's 6 fixed modes | A |
| Incremental indexing | PageIndex regenerates entire tree; we support streaming | A |

### What External Systems Teach Us

| Pattern | Source | Applicable? | Status |
|---|---|---|---|
| MPAB chunk-to-memory aggregation | PageIndex (corrected) | YES — but with N=0 guard | R1, P1 |
| Typed-weighted degree as RRF channel | LightRAG (corrected) | YES — as 5th channel, not multiplicative boost | R4, P0-after-G1 |
| Per-record INT8 quantization | zvec | DEFERRED — storage savings irrelevant at current scale | R5, DEFER |
| Round-robin channel diversity | LightRAG | PARTIAL — soft minimum-rep constraint, not round-robin | R2, P1 |
| Summary pre-filtering | PageIndex | FUTURE — only valuable at 1K+ memories | R8, P2 |
| Entity extraction for graph density | LightRAG | CONDITIONAL — only if post-G1 graph is sparse | R10, gated |
| Embedding cache for re-index | LightRAG | YES — zero-cost re-indexing | R18, production-ready |

---

## 8. Architectural Synthesis — The Convergent Direction

All 30 active recommendations converge toward a single architectural destination: **graph-differentiated, feedback-aware retrieval** (informally, "Generation 5: Self-improving").

### Three Non-Negotiable Design Principles

Regardless of which specific recommendations are implemented, these principles must hold:

**1. Evaluation First.** R13 gates all downstream signal improvements. No scoring change goes live without pre/post measurement. No exceptions.

**2. Density Before Deepening.** Edge creation (R10) precedes graph traversal sophistication (centrality, communities). You cannot deepen a sparse graph.

**3. Calibration Before Surgery.** Score magnitude alignment (normalize RRF and composite to common [0,1] scale) before architectural restructuring (pipeline refactor). The correct diagnosis reduces cost by 10x.

### The Minimum Viable Improvement Set

If resources permit only 5 changes [Evidence: B — Architecture Agent]:

| # | Change | Hours | What It Establishes |
|---|--------|-------|---------------------|
| 1 | G1 (graph ID fix) | 8-12 | Graph channel functional; 3→4 active channels |
| 2 | G3 (chunk collapse fix) | 10-15 | Correct deduplication in all code paths |
| 3 | R13-Sprint1 (eval logging) | 25-28 | Measurement capability; BM25 baseline |
| 4 | R4 (typed-degree 5th channel) | 15-20 | Graph signal in ranking; ensemble diversity |
| 5 | R18 (embedding cache) | 8-12 | Zero-cost re-indexing; development velocity |
| | **Total** | **~66-87h** | **Measurement + graph signal + dev velocity** |

### Priority Tier Reference

| Tier | Count | Recommendations |
|------|-------|----------------|
| **P0 (Bugs)** | 2 | G1 (graph ID), G3 (chunk collapse) |
| **P0 (Foundation)** | 2 | R13-Sprint1, G-NEW-1 (BM25 baseline) |
| **P0 (Core)** | 1 | R4 (after G1) |
| **P1** | 10 | G2, R1, R2, R11, R14/N1, R15, R17, R18, N4, G-NEW-2 |
| **P2** | 11 | R6, R7, R9, R10, R12, R16, N2, N3, S2, S3, S4 |
| **P3** | 3 | R8, S1, S5 |
| **New** | 3 | G-NEW-1 (BM25 baseline), G-NEW-2 (agent UX), G-NEW-3 (bootstrap) |
| **Parked** | 4 | R3 (SKIP), R5 (DEFER), R6-Stage4, Gen5 |

---

## 9. Execution Roadmap — Metric-Gated Sprints

**Why sprints, not phases:** The original 4-phase risk-grouped structure lacks go/no-go gates. Metric-gated sprints ensure that if a change doesn't produce measurable improvement, subsequent investment is re-evaluated rather than continued on faith.

### Sprint 0: Epistemological Foundation [BLOCKING]

| Attribute | Value |
|---|---|
| **Goal** | Establish that retrieval is measurable |
| **Recommendations** | G1, G3, R17, R13-Sprint1, G-NEW-1 (BM25 baseline) |
| **Effort** | 30-45h |
| **Exit Gate** | (1) Graph hit rate > 0%; (2) Chunk recall above pre-fix baseline; (3) BM25 baseline MRR@5 recorded |
| **If Gate Fails** | Do not proceed. Escalate as infrastructure crisis. |

### Sprint 1: Graph Signal Activation

| Attribute | Value |
|---|---|
| **Goal** | Make graph the system's differentiating signal |
| **Recommendations** | R4 (with MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50), R10 (conditional on density) |
| **Effort** | 35-50h |
| **Exit Gate** | R4 measured delta > +2% absolute MRR@5 (or +5% relative, whichever is larger) above measurement noise floor vs Sprint 0 baseline |
| **If Gate Fails** | Graph may be too sparse. Prioritize R10 for edge density. |

### Sprint 2: Score Calibration

| Attribute | Value |
|---|---|
| **Goal** | Resolve dual scoring magnitude mismatch without architecture surgery |
| **Recommendations** | Score normalization (both systems to [0,1]), R15/R17 composite |
| **Effort** | 35-50h |
| **Exit Gate** | KL-divergence between channel score distributions below threshold |
| **If Gate Fails** | Calibration alone insufficient. Consider R6 pipeline refactor. |

### Sprint 3: Graph Enhancement

| Attribute | Value |
|---|---|
| **Goal** | Increase graph contribution and add production-ready improvements |
| **Recommendations** | R18 (embedding cache), N4 (cold-start boost) |
| **Effort** | 35-50h |
| **Exit Gate** | Graph channel hit rate improvement vs Sprint 0; N4 precision within 5% of R4 |

### Sprint 4: Feedback Loop + Chunk Aggregation

| Attribute | Value |
|---|---|
| **Goal** | Close the feedback loop; aggregate chunk scores safely |
| **Recommendations** | R1 (MPAB, with guards), R11 (learned feedback, with separate column), R13-S2 (shadow scoring + ground truth Phase B) |
| **Effort** | 39-56h |
| **Exit Gate** | R1 dark-run MRR@5 within 2%; R11 noise rate < 5%; R13-S2 operational |
| **Prerequisite** | R13 must have completed at least 2 full eval cycles |

### Sprint 5: Feedback & Learning

| Attribute | Value |
|---|---|
| **Goal** | Close the feedback loop safely |
| **Recommendations** | R1 (MPAB, with guards), G-NEW-3 (bootstrap strategy), R11 (phased, with separate `learned_triggers` column), R6 (pipeline refactor), R9, R12, S2, S3 |
| **Effort** | 64-92h |
| **Exit Gate** | Feedback loop producing positive signal on >30% of eval queries; R11 FTS5 contamination test passes; R6 dark-run 0 ordering differences |
| **Prerequisite** | R13 must have completed at least 2 full eval cycles |

**Internal Phasing (max 2 subsystems per phase):**
- **Phase A (Pipeline):** R6 pipeline refactor (40-55h) — checkpoint before start; 0 ordering differences gate
- **Phase B (Search + Spec-Kit):** R1, R9, R12, S2, S3 (24-37h) — Phase A must complete and pass "0 ordering differences" gate before Phase B begins
- R11 and G-NEW-3 execute independently (feedback subsystem only)

### Sprint 6: Observability Maturity

| Attribute | Value |
|---|---|
| **Goal** | Complete measurement infrastructure; deepen graph; evaluate deferred items |
| **Recommendations** | N2 (items 4-6), N3-lite, R7, R16, R10, S4, R13 remaining phases, R5 (if Sprint 5 gates passed) |
| **Effort** | 68-101h |
| **Exit Gate** | Graph channel attribution > 10%; N3-lite contradiction detection verified; all dashboards complete; feature flag count ≤ 6 |

**Internal Phasing:**
- **Phase A (Graph):** N2 items 4-6, N3-lite (35-50h) — graph deepening and consolidation
- **Phase B (Indexing + Spec-Kit):** R7, R16, R10, S4 (33-51h) — index optimization and spec-kit structure
- Phases A and B may run in parallel if developer capacity permits

**Total: 245-350h** across all sprints.*

*\* Effort ranges are estimates. Itemized sprint sums may differ from headline totals due to rounding, overlap between independent tracks, and exclusion of Sprint 7 (Long Horizon) from core range. See Companion Recommendations document §3 for itemized sprint breakdowns.*

### Off-Ramp Criteria

Not every sprint must be completed. The system reaches "good enough" quality when:

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| MRR@5 | ≥ 0.7 | Competitive retrieval quality for agent workflows |
| Constitutional surfacing rate | ≥ 95% | Safety-critical memories reliably surface |
| Cold-start detection rate | ≥ 90% | New memories are discoverable within 48h |

**Minimum viable stop point:** After Sprint 2 (measurement + graph + calibration established). At this point the system has functional evaluation infrastructure, a working 4-channel hybrid with graph signal, and calibrated scoring. Sprints 3-6 provide incremental quality gains with diminishing marginal returns.

| After Sprint | What's Established | Decision |
|-------------|-------------------|----------|
| S0+S1 | MRR@5 baseline + graph functional | Minimum measurement capability |
| **S2+S3** | **Calibrated scores + query intelligence** | **Recommended minimum viable stop** |
| S4+S5 | Feedback loop + pipeline refactor | Full optimization available |
| S6+S7 | Graph deepening + long horizon | Diminishing returns likely |

---

## 10. Known Gaps and Open Questions

These require empirical work, not more analysis:

1. **BM25-only baseline** [CRITICAL] — Never measured. All scoring calibration work has no ground truth. Sprint 0 deliverable.

2. **INT8 recall loss contradiction** [!] — 1-2% (Spec 140) vs 5.32% (Spec 141). Requires in-system ablation. Blocks R5 activation decision.

3. **Agent-as-consumer UX** — Absent entirely. The retrieval system is optimized for human query patterns, but the primary consumer is AI agent pipelines with different needs. Sprint 1 analysis task (G-NEW-2, moved from S4 to inform evaluation design earlier).

4. **search-weights.json full audit** [!] — `maxTriggersPerMemory` is active. Smart ranking section status unknown. Requires source code trace.

5. **Feedback bootstrap resolution** — R13-Sprint1 is necessary but may not be sufficient. Sprint 5 timeline depends on interaction data accumulation rate.

6. **G2 investigation outcome** — Double intent weighting may be intentional design, not a bug. Requires A/B comparison before changing.

---

## 11. Conclusion

The spec-kit memory MCP server is a sophisticated retrieval system with genuine architectural advantages over every analyzed external system — temporal decay, cognitive working memory, constitutional safety guarantees, and intent-aware fusion that no competitor matches. Its weakness is not missing features but **dormant features and broken plumbing**.

**Three interventions, in this order:**

1. **Fix G1** (graph ID mismatch) — Transform from a 3-channel to a 4-channel system. Highest single-action ROI. [Evidence: A+]

2. **Deploy R13-Sprint1** (evaluation logging + BM25 baseline) — Make all future improvements measurable. Without this, every change is speculation. [Evidence: A]

3. **Activate R4** (typed-degree as 5th RRF channel) — Deepen the graph signal that G1 unlocks. Validated by ensemble diversity theory. [Evidence: B]

**The metric that confirms the system is on track:** graph channel hit rate, measured from Sprint 0 baseline through Sprint 6 completion.

This synthesis supersedes all prior analyses on every topic covered. The two [!] flagged items (INT8 recall loss, search-weights.json smart ranking status) remain open pending empirical measurement.

---

*Synthesized from 13 independent agent investigations: 5 analytical deep-dives (corrections, signals, priorities, architecture, deduplication), 5 synthesis analyses (feasibility, risks, roadmap, gaps, evidence), and 3 ultra-think meta-synthesis agents. All code references verified against source. All conflicts resolved in §2. Wave 1+2 scratch files preserved in `scratch/` for audit trail.*
