# Wave 1: Architecture Coherence Evaluation

> **Evaluator:** @research (Architecture Coherence Evaluator mission)
> **Date:** 2026-02-26
> **Inputs:** 141-analysis-deep-dive-10-agent-synthesis.md, 141-recommendations-deep-dive-10-agent-synthesis.md
> **Scope:** Assess whether the 31 recommendations form a coherent architectural vision or a collection of disconnected improvements

---

## 1. Architectural Vision Assessment

### 1.1 Do the 31 Recommendations Converge Toward a Target Architecture?

**Verdict: YES, with caveats.** The recommendations converge toward a recognizable target, but the convergence is uneven. Roughly three clusters emerge:

| Cluster | Recommendations | Theme | Coherence |
|---|---|---|---|
| **A: Fix-What-You-Have** | G1-G4, R11, N2 | Activate dormant capabilities, fix silent failures | TIGHT -- these are preconditions for everything else |
| **B: Measure-Then-Improve** | R13, R14/N1, R15, R18 | Evaluation infrastructure + efficiency | TIGHT -- clear dependency chain, each enables the next |
| **C: Cognitive-Inspired Features** | N3, N4, R16, R17, N5 | Sleep consolidation, encoding specificity, fan-effect | LOOSE -- individually justified by cognitive science analogies but weakly coupled to each other |

The problem is that Clusters A and B form a coherent "engineering maturity" arc (fix bugs, measure, optimize), while Cluster C is a "research agenda" that could go in many directions. The recommendations document presents them as a single linear roadmap, but architecturally they are two different programs of work that happen to operate on the same codebase.

### 1.2 What IS the Target Architecture?

Reconstructing from the recommendations, the implicit target is:

```
TARGET: A 5-channel fusion pipeline with graph-first differentiation,
        self-calibrating weights via feedback loops, and background
        consolidation for relationship enrichment.
```

This is a defensible target. It is NOT, however, clearly stated anywhere in the documents. The closest statement is the "Generation 5: Self-improving" framing in the roadmap (Section 11.2), but that framing obscures the actual technical target behind a generational numbering scheme that implies inevitability.

### 1.3 "Generation 5: Self-Improving" -- Real Direction or Marketing Language?

**Assessment: 60% real, 40% marketing.**

The "real" part: The system genuinely has dormant feedback loops (`learnFromSelection` with zero callers, `memory_validate` disconnected from scoring, `computeStructuralFreshness` unreachable). Activating these creates a legitimate feedback-driven system. The consolidation proposal (N3) adds a genuine new architectural capability. These are real self-improvement mechanisms.

The "marketing" part: The generational framing (Gen 2 through Gen 5) implies a clean evolutionary sequence, but the actual dependency graph shows something messier. "Generation 5" requires:
- Consolidation process that has never been tested in any comparable system (MEDIUM confidence)
- Learned weights that depend on feedback data that does not yet exist
- Auto entity extraction with an acknowledged 20%+ false positive rate ceiling

Calling this "self-improving" is aspirational. A more honest framing would be **"feedback-aware"** -- the system can incorporate signals from usage, but "self-improving" implies closed-loop optimization that requires evaluation infrastructure (R13) working reliably for weeks before you can even measure whether improvement is occurring.

**Recommendation:** Replace the generational taxonomy with a capabilities-based framing:
- **Tier 1 (current):** Multi-signal retrieval with static configuration
- **Tier 2 (Phase 1-2):** Graph-differentiated retrieval with feedback capture
- **Tier 3 (Phase 3-4):** Feedback-responsive retrieval with background enrichment

This is less exciting but more honest about what each phase actually delivers.

---

## 2. Pipeline Refactor (R6) Analysis

### 2.1 The 4-Stage Pipeline: Candidate -> Fusion -> Rerank -> Boost

```
Stage 1: CANDIDATE GENERATION
  - Vector, FTS5, BM25, Graph, Degree (5 channels)

Stage 2: FUSION
  - RRF or Relative Score Fusion
  - Convergence bonus, intent-adaptive weights

Stage 3: RERANK
  - Cross-encoder reranking
  - MMR diversity
  - MPAB chunk-to-memory aggregation

Stage 4: POST-PROCESS
  - Composite scoring adjustment
  - Causal boost (2-hop)
  - Co-activation spreading
  - State filtering + session dedup
  - Evidence gap detection
```

### 2.2 Does This Correctly Separate Concerns?

**Mostly yes, with one significant misplacement.** The separation between Candidate Generation, Fusion, and Rerank is clean -- each stage operates on a clearly different abstraction level (per-channel scores, fused scores, reranked scores). This is the standard information retrieval pipeline pattern and it is well-understood.

**The problem is Stage 4 (POST-PROCESS).** It conflates three fundamentally different operations:

| Operation | Nature | Should Be |
|---|---|---|
| Composite scoring adjustment | Score modification | Stage 3 (Rerank) -- it changes relative ordering |
| Causal boost (2-hop) | Score modification | Stage 2 (Fusion) or Stage 3 -- it adds a signal |
| Co-activation spreading | Score modification | Stage 2 (Fusion) -- it is a signal source |
| State filtering + session dedup | Result filtering | Stage 4 (correct placement) |
| Evidence gap detection | Diagnostic/metadata | Stage 4 (correct placement) |

Putting score-modifying operations (composite scoring, causal boost, co-activation) AFTER reranking means the reranker's carefully computed ordering can be arbitrarily disrupted by post-hoc score adjustments. This is the same architectural problem the analysis identified (double intent weighting, G2) manifesting at the pipeline level.

**Corrected pipeline:**

```
Stage 1: CANDIDATE GENERATION (unchanged)
Stage 2: FUSION + SIGNAL INTEGRATION
  - RRF/RSF core fusion
  - Causal boost as 5th/6th channel input (not post-hoc)
  - Co-activation as signal input (not post-hoc)
  - Composite scoring factors integrated into fusion weights
Stage 3: RERANK + AGGREGATE
  - Cross-encoder reranking
  - MMR diversity
  - MPAB chunk-to-memory aggregation
Stage 4: FILTER + ANNOTATE (no score changes)
  - State filtering + session dedup
  - Evidence gap detection
  - Constitutional tier guarantee check
```

The key principle: **Stage 4 should NEVER change scores or ordering.** It should only remove items (filtering) or add metadata (annotation). If a signal affects ranking, it belongs in Stage 2 or 3.

### 2.3 Ordering Dependencies and Fragility

The current proposal has three fragile ordering dependencies:

**Fragility 1: MPAB placement.** R1 (MPAB) is placed in Stage 3 (Rerank), but the analysis says it should run "AFTER RRF fusion but BEFORE state filtering." If chunk collapse happens after cross-encoder reranking, the reranker has wasted computation scoring chunks that will be collapsed. If it happens before, chunk-level signals are lost before reranking.

**Resolution:** MPAB should run at the BOUNDARY of Stage 2 and Stage 3 -- after fusion (which operates on chunks), but before reranking (which should operate on memories). This is a well-defined position but the 4-stage model does not naturally express boundaries.

**Fragility 2: Intent weight application.** Intent weights currently apply in both Stage 2 (adaptive fusion) and Stage 4 (composite scoring). The recommendation to fix G2 removes double-application, but the pipeline refactor does not specify WHERE the single application lives. If a future change re-introduces intent adjustment in a different stage, the double-weighting bug returns.

**Resolution:** Intent weights should be a Stage 2 concern ONLY. They affect channel fusion weights. Once fusion produces a unified score, intent should not re-enter.

**Fragility 3: Causal boost timing.** Causal boost in Stage 4 means it can override MMR diversity decisions from Stage 3. A memory pushed out by MMR for diversity could be pulled back in by causal boost, defeating the diversity purpose.

**Resolution:** As noted above, causal boost should be a fusion-time signal (Stage 2), not a post-process adjustment.

**Overall fragility assessment: MEDIUM.** The pipeline refactor is a significant improvement over the current unstructured pipeline, but the Stage 4 "kitchen sink" pattern will create ordering bugs unless the "no score changes in Stage 4" principle is enforced as an architectural invariant.

---

## 3. Graph-Deepening (N2) Analysis

### 3.1 The Claim: "Most Orthogonal, Least Developed"

**This claim is well-supported.** The evidence is Grade A (Section 5.2 of the analysis):

- FTS5 + BM25 correlation: HIGH (both are lexical matching)
- Vector + Graph correlation: LOW (structural vs content-based)
- Graph channel has the least code (200 lines for `graph-search-fn.ts`) vs vector (3922+ lines for `vector-index-impl.ts`)
- Two existing graph functions (`computeGraphCentrality`, `computeStructuralFreshness`) are unreachable dead code
- Graph channel ID format mismatch (G1) means graph results are silently excluded from post-processing

The ensemble learning argument (Dietterich, 2000) is correctly applied: adding a diverse weak learner improves ensemble performance more than strengthening an already-strong learner. This is the strongest theoretical foundation in the entire recommendations set.

### 3.2 Sparse Edge Dependency Risk

**This is the critical question.** The N2 investment thesis assumes graph features (centrality, communities, contradiction clusters) become valuable. But these features require a sufficiently connected graph.

**Current state of causal edges (inferred from the analysis):**
- 6 edge types: caused, enabled, supersedes, contradicts, derived_from, supports
- No statistics on edge density are provided in either document
- The `memory_causal_stats` tool exists but was not called in the research
- Co-activation boost is "nearly invisible" at 0.1x, suggesting edges are sparse enough that the current graph features have minimal impact

**What happens at different edge densities:**

| Edge Density | Centrality Value | Community Detection | Contradiction Clusters | Degree Channel |
|---|---|---|---|---|
| <0.5 edges/node | Meaningless (all nodes similar) | Cannot form communities | Cannot detect contradictions | Near-zero signal (most scores = 0) |
| 0.5-2.0 edges/node | Weak differentiation | Possible but noisy | Rare, high value when found | Modest signal |
| 2.0-5.0 edges/node | Useful differentiation | Reliable communities | Meaningful clusters emerge | Strong signal |
| 5.0+ edges/node | Hub-vs-leaf well defined | Rich community structure | Full contradiction maps | Dominant signal (needs capping) |

**Risk assessment:** If current edge density is below 0.5 edges/node (which the "nearly invisible" co-activation boost suggests), then investing in centrality and community detection is premature -- the algorithms will produce meaningless results on a near-empty graph.

**The critical dependency chain that the recommendations understate:**

```
R10 (Auto Entity Extraction)
  |
  v
Edge Density Increases
  |
  v
N2 (Graph Features) Become Meaningful
  |
  v
R4 (Degree Channel) Produces Non-Zero Signals
```

R10 is rated P3 (Phase 4, Week 10-12), but N2 is rated P0 (Phase 0-1). This is an inversion. Graph-deepening (N2) without edge enrichment (R10 or N3) is building an elaborate query engine for a database with no data.

**Mitigation strategy (if investing in N2 early):**

1. **Gate N2 investments on edge density.** Measure edges/node before implementing centrality. If < 1.0, defer centrality and communities.
2. **Prioritize contradiction clusters regardless of density.** Even 5 contradiction edges in the entire graph are high-value -- surfacing contradictions is safety-critical, not a density-dependent feature.
3. **Pull R10 forward to P1.** If auto entity extraction can achieve even 0.5 edges/node average, graph features become immediately useful.
4. **Accept that degree as 5th RRF channel (R4) will be near-zero for most queries initially.** This is acceptable because RRF handles absent channels gracefully (the channel simply does not contribute to the fused score). But it means R4's impact will be minimal until edge density increases.

### 3.3 What the Analysis Gets Right About Graph

The analysis correctly identifies that graph is the most DIFFERENTIATED signal. Even in a sparse graph, the memories that DO have edges are disproportionately important (they represent explicit decisions, causal chains, and relationships that someone took the time to create). A sparse graph with high-signal edges is more valuable than a dense graph with noisy edges.

This suggests the early N2 investment should focus on **making existing edges more useful** (fix G1, activate `computeGraphCentrality`, typed-weighted degree) rather than **creating new graph features** (community detection, betweenness centrality) that need density to function.

---

## 4. Consolidation (N3) Analysis

### 4.1 The "Sleep Consolidation" Analogy

The proposal draws from Diekelmann & Born (2010) on sleep-dependent memory consolidation:

1. Auto-create causal links between semantically similar unlinked memories
2. Merge near-duplicate memories
3. Strengthen edges traversed during retrieval (Hebbian learning)
4. Detect and flag contradiction clusters

### 4.2 Is This Over-Engineering?

**Verdict: The full proposal is over-engineering for current scale. A minimal version delivers 80% of the value at 20% of the complexity.**

The cognitive science analogy is seductive but misleading in one critical way: biological consolidation operates on millions of synaptic connections formed during waking hours, reorganizing them into efficient long-term representations. This system has hundreds of memories with (likely) sparse causal edges. The reorganization problem does not exist at this scale in the way the analogy implies.

**What IS genuinely valuable:**
- **Contradiction detection** (item 4): This is a safety-critical feature. Two memories saying opposite things about the same topic is a real problem regardless of scale.
- **Hebbian edge strengthening** (item 3): Edges traversed during successful retrieval should indeed be strengthened. This is the simplest feedback loop and has clear theoretical backing.

**What is premature:**
- **Auto-creating causal links** (item 1): At a few hundred memories, semantic similarity search will produce mostly noise. The threshold tuning required to avoid false links is a research project, not a feature.
- **Merging near-duplicates** (item 2): This is a destructive operation on a memory system. The consequences of an incorrect merge (losing a nuanced variant) are worse than the consequences of keeping duplicates (slightly noisy retrieval).

### 4.3 The Simplest Version That Delivers Value

```
MINIMAL CONSOLIDATION (N3-lite):
  1. Contradiction Scan (weekly)
     - For each memory pair with similarity > 0.85, check if intent/conclusions conflict
     - Flag conflicts with a new edge type or annotation
     - Surface contradiction clusters in memory_search results
     - Effort: ~40 LOC + 1 new scan function

  2. Hebbian Edge Strengthening (per-query, inline)
     - When a memory is retrieved AND validated as useful:
       increment strength on all causal edges traversed to reach it
     - Decay: edges not traversed in 30 days decay by 0.1
     - Effort: ~20 LOC in the validation handler

  3. Staleness Detection (weekly)
     - Memories not retrieved in 90 days: flag for review
     - Memories with confidence < 0.3: flag for review
     - Effort: ~15 LOC query
```

This version:
- Avoids all destructive operations (no merging, no auto-linking)
- Focuses on the two highest-value items (contradictions are safety-critical, Hebbian strengthening is the simplest feedback loop)
- Runs as a lightweight scan, not a background process
- Total effort: ~75 LOC vs the estimated 30-40 hours for full N3

**The full N3 should be gated on:** (a) R13 evaluation infrastructure proving that current retrieval quality is limited by edge sparsity (not by other factors), and (b) edge density reaching >1.0 edges/node (making auto-linking meaningful).

---

## 5. Integration Coherence: R1 + R4 + R6 + N2 + N3

### 5.1 Interaction Map

```
R1 (MPAB Aggregation) ----[neutral]---- R4 (Degree Channel)
        |                                      |
        |                                      |
   [depends-on]                           [depends-on]
        |                                      |
        v                                      v
R6 (Pipeline Refactor) <-----[enables]----- N2 (Graph Deepening)
        |                                      |
        |                                      |
   [structures]                           [feeds-into]
        |                                      |
        v                                      v
    Clean stages                          N3 (Consolidation)
```

### 5.2 Reinforcement Analysis

**R1 + R4: REINFORCING (positive).** MPAB handles chunk-to-memory aggregation; degree handles graph-based scoring. They operate on different dimensions and feed into the same fusion pipeline. No conflict.

**R1 + R6: REINFORCING (positive).** R6 (pipeline refactor) creates the clean Stage 2/3 boundary where MPAB naturally lives. Without R6, MPAB placement is ambiguous. R6 makes R1 easier to implement correctly.

**R4 + N2: REINFORCING but SEQUENTIAL.** Degree as a channel (R4) is a specific instance of graph-deepening (N2). They should be implemented as a single work stream, not separately. The current plan has R4 at P0 and N2 at P0 but they are presented as separate recommendations. This creates unnecessary coordination overhead.

**N2 + N3: REINFORCING but TEMPORALLY GATED.** N3 (consolidation) enriches the graph that N2 exploits. But N3's value depends on N2 being implemented first (no point consolidating a graph that is not being queried effectively). N2 should precede N3 by at least one phase.

**R6 + everything: ENABLING.** The pipeline refactor makes all other changes safer by providing clear insertion points. This is correctly identified as a structural prerequisite.

### 5.3 Complex Interactions (Risk)

**R4 + N3 Amplification Loop (flagged in the recommendations):** N3 auto-creates edges, R4 uses edge count for scoring. Together they create a positive feedback loop: highly connected memories get more edges (from consolidation traversal), which increases their degree score (from R4), which makes them appear more often, which generates more traversal edges. This is the most dangerous interaction in the entire recommendation set.

**Mitigation already proposed:** R4 cap at 0.15, auto-edges at 50% strength. This is adequate IF the cap is enforced at the fusion level (Stage 2) and not just as a parameter that could be overridden.

**R1 + N2 Subtle Interaction:** If graph deepening (N2) introduces community-based scoping (Leiden algorithm), and MPAB (R1) aggregates chunks within memories, there is an unaddressed question: should community membership affect chunk aggregation? For example, if two chunks of the same memory belong to different communities, should they be aggregated or kept separate? This is not a current concern but will surface when both features mature.

### 5.4 Overall Integration Assessment

**The five recommendations reinforce each other more than they conflict.** The primary risk is the R4+N3 amplification loop, which has adequate mitigation. The secondary risk is implementation sequencing -- N2 and N3 are presented at the same priority level (P0 and P2 respectively) but N2 must precede N3.

**One missing integration:** None of the five recommendations address the dual scoring system problem (G5). R6 (pipeline refactor) restructures the flow but does not specify how System A (RRF) and System B (composite scoring) merge. If R6 is implemented without resolving this, the pipeline will have clean stages but two competing scoring systems running within those stages. This is the biggest architectural gap in the integration story.

---

## 6. Minimum Viable Improvement Set

### 6.1 Selection Criteria

The optimal 3-5 changes should:
1. Fix the most impactful correctness issues
2. Enable measurement of future improvements
3. Activate the most differentiated existing capability
4. Be independently valuable (not dependent on future work)
5. Be reversible (feature-flagged or additive)

### 6.2 The Recommended Set (5 changes)

| Priority | Change | Rationale | Effort | Risk |
|---|---|---|---|---|
| **1** | **G1+G2+G3 Bug Fixes** (bundled) | Fix silent failures that distort ALL current results. Graph results excluded from post-processing (G1), intent bias amplified (G2), default path returns duplicate chunks (G3). These are not improvements -- they are defect corrections. | 6-8h | LOW |
| **2** | **R13 Sprint 1: Evaluation Infrastructure** | Foundation for everything. Without metrics, all other changes are unmeasurable. The single most important architectural addition. | 20-23h | LOW |
| **3** | **G4 + R11-lite: Wire learnFromSelection** | Activate the existing feedback loop (the only one that connects retrieval to future retrieval). Implement with safeguards (provenance, TTL, denylist) but start in shadow-logging mode only. | 8-10h | MEDIUM |
| **4** | **R4: Degree as 5th RRF Channel** | Activates the most orthogonal signal dimension. Even with sparse edges, the memories that have edges are disproportionately important. Low risk because RRF handles absent channels gracefully. | 6-8h | LOW |
| **5** | **R18: Embedding Cache** | Pure infrastructure improvement with zero ranking risk. Eliminates the most expensive operation (embedding generation) on re-index. Makes all future experimentation faster. | 4-6h | NONE |

### 6.3 What This Set Delivers

```
BEFORE (current state):
- Graph results silently excluded
- Intent bias doubled
- Default search returns duplicate chunks
- No retrieval quality metrics
- Feedback loop disconnected
- Re-index requires full embedding regeneration

AFTER (5 changes):
- All channels participate correctly in fusion
- Single intent weight application
- Clean chunk deduplication in all modes
- MRR@5, NDCG@10, Recall@20 measured per query
- Feedback captured (shadow mode) for future weight optimization
- Degree signal adds graph-based differentiation
- Re-index is instant when content unchanged
```

Total effort: ~44-55 hours. This is approximately one-third of the full 130-165 hour roadmap but delivers the structural foundation that all subsequent improvements build on.

### 6.4 What This Set Explicitly Defers

- **R1 (MPAB):** Chunk aggregation is a quality improvement, but current chunk collapse issues (G3 fix) address the correctness problem first. MPAB can wait for evaluation data to prove it helps.
- **R6 (Pipeline Refactor):** Important for long-term maintainability but not required for the first 5 changes. The bug fixes and degree channel can be implemented in the current pipeline structure.
- **N2 (Graph Deepening beyond R4):** Centrality and community detection are premature without edge density data. R4 is the minimum graph investment.
- **N3 (Consolidation):** Deferred entirely. Even N3-lite should wait until R13 proves that graph sparsity is the bottleneck.
- **R14/N1 (Relative Score Fusion):** Theoretically promising but the claimed 6% improvement comes from a different system and corpus. Let R13 measure the actual baseline first.

### 6.5 Sequencing of the 5 Changes

```
Week 1-2:  G1+G2+G3 (bug fixes) + R13 Sprint 1 (eval DB + logging)
           [parallel: bugs are independent of eval infra]

Week 3:    R13 Sprint 1 completion (metrics computation from logs)
           GATE: Baseline MRR@5, NDCG@10, Recall@20 captured

Week 4:    G4+R11-lite (feedback wiring, shadow mode)
           R4 (degree channel, feature-flagged OFF)

Week 5:    R18 (embedding cache)
           R4 enabled (dark-run comparison against baseline)
           GATE: R4 dark-run shows no regression

Week 6:    R4 enabled in production
           R11-lite shadow logs analyzed
           GATE: Decide Phase 2 priorities based on 4 weeks of eval data
```

---

## 7. Summary Assessment

### 7.1 Architectural Coherence Score: 7/10

The 31 recommendations are more coherent than a random collection of improvements, but less coherent than a unified architectural redesign. The strongest coherence is in the "fix and measure" cluster (G1-G4, R13), which is correctly prioritized. The weakest coherence is in the cognitive-science-inspired features (N3, N4, R16, R17), which are individually interesting but collectively form a research agenda rather than an engineering plan.

### 7.2 Three Key Findings

1. **The pipeline refactor (R6) has a "kitchen sink" Stage 4 that mixes score-modifying and filtering operations.** This will recreate the double-weighting problem at the architectural level unless "no score changes in Stage 4" is enforced as an invariant.

2. **Graph-deepening (N2) investment is justified but temporally inverted with its dependency (R10 edge enrichment).** Advanced graph features require edge density that does not exist yet. The minimum viable graph investment is R4 (degree channel) plus G1 (ID format fix), not centrality or community detection.

3. **The "Generation 5: Self-Improving" framing overpromises relative to what the implementations deliver.** The system can become feedback-aware and graph-differentiated -- genuinely valuable improvements -- but calling this "self-improving" sets expectations that the feedback loops are closed and optimizing, which requires evaluation infrastructure running for weeks before it can even be assessed.
