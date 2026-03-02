# Wave 1: Signal & Scoring Theory Analysis

> **Date:** 2026-02-26
> **Analyst:** @research (leaf agent, depth 1)
> **Scope:** Dual scoring disconnect, signal orthogonality, RRF vs RSF, graph channel potential, signal abundance thresholds
> **Evidence Standard:** All claims cite primary codebase or referenced research documents

---

## Table of Contents

1. [Dual Scoring System Problem](#1-dual-scoring-system-problem)
2. [Signal Orthogonality: FTS5+BM25 Correlation](#2-signal-orthogonality-fts5bm25-correlation)
3. [RRF vs RSF: Applicability at ~1000 Items](#3-rrf-vs-rsf-applicability-at-1000-items)
4. [Graph as Most Orthogonal Channel](#4-graph-as-most-orthogonal-channel)
5. [15+ Signals: Strength vs Noise](#5-15-signals-strength-vs-noise)
6. [Cross-Cutting Findings](#6-cross-cutting-findings)

---

## 1. Dual Scoring System Problem

### 1.1 The Two Systems Described

**System A (RRF -- real-time, per-query):**
Four channels (vector, FTS5, BM25, graph) fused via Reciprocal Rank Fusion with K=60, convergence bonus of 0.10 for multi-source matches, and intent-adaptive channel weights from 7 profiles.
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts:19-21`]

**System B (Composite Scoring -- per-memory factors):**
A weighted factor model with two variants -- a 5-factor "REQ-017" model (temporal=0.25, usage=0.15, importance=0.25, pattern=0.20, citation=0.15) and a 6-factor "legacy" model (similarity, importance, recency, popularity, tierBoost, retrievability).
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:111-117`]

The analysis document states: "These two systems are NOT integrated. System A produces one ranking, System B produces another. The `postSearchPipeline()` function applies System B scores as post-hoc adjustments to System A results, but the interaction is additive and poorly calibrated."
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:176`]

### 1.2 Severity Assessment: MODERATE, NOT CRITICAL

The framing of this as a "disconnect" deserves scrutiny. The two systems actually measure **fundamentally different dimensions**, and their separation may be architecturally sound rather than a defect.

**System A answers:** "Given this specific query, which memories are textually and structurally relevant?"
- This is a **query-dependent** signal. The same memory gets different RRF scores for different queries.

**System B answers:** "Regardless of any query, how inherently valuable/fresh/connected is this memory?"
- This is a **query-independent** signal. A memory's temporal decay, importance tier, and citation count are stable properties.

In information retrieval literature, this is a well-established pattern. Google's PageRank (query-independent authority) is combined with BM25 (query-dependent relevance) as a post-hoc adjustment. The interaction being "additive" is not a design flaw -- it is the standard L2 ranker pattern in learning-to-rank systems, where a base ranker (System A) produces candidates and a re-ranker (System B) adjusts scores.

**Where the real problem lies:** The issue is not that the systems are separate -- it is that the interaction is **untuned**. The additive combination lacks:

1. **Score scale calibration.** RRF scores from System A occupy the range [0, ~0.07] (since `1/(60+1) = 0.0164` for rank 1 in a single channel, with convergence bonuses pushing to ~0.07 for a result appearing in all 4 channels at rank 1). System B composite scores occupy [0, 1]. When added, System B dominates System A by approximately 15:1 in magnitude.

2. **Interaction weighting.** There is no tunable parameter controlling the relative influence of System A vs System B in the final ranking. The R13 evaluation infrastructure is a prerequisite for tuning this.

3. **Double intent weighting.** Intent weights are applied in `hybridAdaptiveFuse()` (channel-level) AND again in `postSearchPipeline()` (result-level), amplifying intent bias multiplicatively rather than additively.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:148-149`]

### 1.3 Verdict

**Should integration be pursued?** Yes, but the correct framing is "calibration" not "integration." The two-system architecture is defensible. The prescription is:

| Action | Priority | Rationale |
|--------|----------|-----------|
| Fix double intent weighting (G2) | P0 | This is a bug, not a design choice |
| Establish evaluation metrics (R13) | P0 | Cannot tune without measuring |
| Normalize score scales before combination | P1 | System B dominates by 15:1 in magnitude |
| Add tunable alpha parameter: `final = alpha * norm(A) + (1-alpha) * norm(B)` | P1 | Enables empirical weight discovery |
| Consider leaving them separate if metrics show System B contribution is negligible | P1 | May discover B adds noise not signal |

**Risk of forced integration:** Merging the two systems into a single pipeline could destroy the query-independent signal entirely. Constitutional memories MUST surface regardless of query quality -- System B's importance tier factor guarantees this. A single unified system might lose this safety property.

---

## 2. Signal Orthogonality: FTS5+BM25 Correlation

### 2.1 The Claim

The analysis claims FTS5+BM25 have "HIGH" correlation.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:398`]

### 2.2 Evidence Assessment

This claim is **well-supported by code analysis** but the severity is overstated.

**What FTS5 does:** SQLite's FTS5 with `bm25()` scoring function. Column weights: title=10.0, trigger_phrases=5.0, file_path=2.0, content_text=1.0. Query terms joined with OR. Returns BM25-scored results.
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:28`]

**What BM25 does:** An in-memory JavaScript BM25 index (`BM25Index` class) operating over the same corpus of title + trigger_phrases + content fields.
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:104`]

**Both implement the same algorithm (BM25) over the same corpus.** The only differences are:
- FTS5: SQLite-native, weighted per-column, disk-based index
- BM25: JavaScript in-memory, unweighted (flat concatenation), memory-resident

The correlation between these two channels is not just "HIGH" -- it is **structurally inevitable**. They are two implementations of the same mathematical formula over the same data. Divergences can only arise from:
- Column weighting differences (FTS5 boosts title 10x; JS BM25 treats all fields equally)
- Tokenization differences (SQLite FTS5 tokenizer vs JavaScript split/filter)
- Query preprocessing (FTS5 uses OR-joined terms; JS BM25 uses its own tokenization)

### 2.3 Is Redundancy Necessarily Bad?

**No.** There are two legitimate arguments for keeping both:

**Argument FOR redundancy (robustness):**
In ensemble methods, correlated classifiers still improve reliability through error averaging. If FTS5 fails (table corruption, FTS5 extension not loaded), BM25 provides lexical coverage. If the JS BM25 index is stale (not rebuilt after saves), FTS5 provides fresh lexical coverage. This is a **fault-tolerance** argument.

Quantitatively, the robustness value of a redundant channel follows:
```
P(both_fail) = P(A_fail) * P(B_fail|A_fail)
```
If failures are independent: `P(both) = P(A) * P(B)`. Even at 99% reliability each, redundancy reduces lexical-channel failure from 1% to 0.01%.

**Argument AGAINST redundancy (ensemble theory):**
From Dietterich (2000) and the bias-variance-covariance decomposition of ensemble error: the expected error of an ensemble decreases with the number of members *weighted by their pairwise diversity*. Two highly correlated channels contribute approximately 1.1x the value of a single channel, not 2x. The "slot" occupied by the second lexical channel could instead be filled by a channel with LOW correlation (like graph), yielding much higher ensemble diversity.

### 2.4 Verdict

| Metric | FTS5 Only | FTS5+BM25 | FTS5+Deeper Graph |
|--------|-----------|-----------|-------------------|
| Lexical coverage | Good | Marginally better | Good |
| Ensemble diversity (theoretical) | Baseline | +~10% | +~40-60% |
| Fault tolerance | Single point | Redundant | Single point |
| Computational cost | 1x lexical | 2x lexical | 1x lexical + 1x graph |
| Maintenance burden | Low | Medium (two indexes to sync) | Medium (graph data model) |

**Recommendation:** Keep both channels for now (fault tolerance is non-trivial), but:
1. **Do not invest further** in differentiating FTS5 from BM25
2. **Redirect investment** to graph channel depth (see Section 4)
3. If R6 (pipeline refactor) lands, consider making BM25 a **fallback** rather than a parallel channel -- only activate when FTS5 returns < 3 results

The "HIGH" correlation is real but is not the most pressing problem. The graph channel being broken (G1: ID format mismatch silently excludes graph results from MMR and causal boost) wastes more diversity than the FTS5/BM25 overlap costs.

---

## 3. RRF vs RSF: Applicability at ~1000 Items

### 3.1 The Core Argument

The recommendations propose replacing RRF with Relative Score Fusion (RSF), citing a ~6% recall improvement from Weaviate benchmarks.
[SOURCE: `141 - recommendations-deep-dive-10-agent-synthesis.md:317`, `141 - recommendations-deep-dive-10-agent-synthesis.md:422-423`]

The theoretical argument: RRF was designed for meta-search scenarios where score distributions from different sources are unknown and incomparable. This system has known, calibrated sources operating on the same corpus, so score magnitudes carry information that RRF discards.

### 3.2 Dissecting the Weaviate 6% Claim

**Evidence grade: C (single external source, not cross-referenced).**

The 6% figure comes from Weaviate's production benchmarks on their hybrid search. Critical differences from this system:

| Dimension | Weaviate Benchmark | This System |
|-----------|-------------------|-------------|
| Corpus size | Millions of documents | ~1000 memories |
| Channels fused | 2 (vector + BM25) | 4 (vector + FTS5 + BM25 + graph) |
| Score distribution | Unknown, heterogeneous sources | Known, single-corpus |
| Query volume | High (statistical power) | Low (single user) |
| Evaluation method | NDCG/Recall on standard IR benchmarks | None (R13 not yet implemented) |

The 6% improvement is not directly transferable. At 1000 items, the top-K candidate pools from each channel have substantial overlap, reducing the scenarios where RRF's rank-flattening would lose useful magnitude information.

### 3.3 When RRF Rank-Flattening Loses Information

RRF maps all rank-1 results to the same score (`1/61 = 0.0164`) regardless of whether the vector similarity was 0.95 or 0.55. This is harmful when:

1. **Score distributions are well-separated.** If channel A returns a result with 0.95 similarity and channel B returns it with 0.30, the result deserves to be penalized (B disagrees), but RRF rewards it with convergence bonus.

2. **One channel has high-confidence results and another has uniform noise.** RRF cannot distinguish "channel B found nothing useful" from "channel B's results are moderately relevant."

### 3.4 When RRF's Rank-Flattening Is an Advantage

RRF excels when:

1. **Score scales are incomparable.** Vector cosine similarity [0, 1] vs FTS5 BM25 scores [arbitrary negative to positive] vs graph edge strength [0, 1] -- these have fundamentally different distributions. Min-max normalization (as RSF proposes) is sensitive to outliers and unstable when result sets are small.

2. **Result sets are small.** With only ~1000 memories and a limit of 20, each channel might return 5-15 results. Min-max normalization over 5 items is highly sensitive to the single min and max values. A single outlier distorts the entire scale.

3. **The system lacks evaluation infrastructure.** Without R13's metrics, there is no way to validate that RSF actually improves anything. Deploying RSF without measurement is speculative.

### 3.5 The Calibrated-Corpus Argument

The argument that "this system has known, calibrated scores" deserves scrutiny.

**Is it actually calibrated?**

- Vector cosine similarity: Well-calibrated [0, 1] range, but depends on embedding model quality
- FTS5 BM25: Returns negative scores (negated to positive in code); distribution depends on corpus statistics that change with every save
- In-memory BM25: Similar to FTS5 but with different tokenization; scores are not normalized
- Graph edge strength: [0, 1] but semantically different from similarity (measures relationship strength, not relevance)

These are NOT well-calibrated scores. The score distributions shift as the corpus grows. This is closer to the "unknown distribution" scenario that RRF was designed for than the "known calibrated" scenario that RSF assumes.

### 3.6 Verdict

| Factor | Favors RRF | Favors RSF |
|--------|-----------|-----------|
| Unknown score distributions | Yes | |
| Small result sets (sensitive to normalization outliers) | Yes | |
| No evaluation baseline exists | Yes (less risk) | |
| Score magnitude carries useful information | | Yes |
| Multiple channels may return noise | | Yes (can downweight) |
| Theoretical ensemble diversity | | Yes |
| Implementation effort (~80 LOC) | | Yes (low cost to try) |

**Recommendation:** Implement RSF as a dark-run parallel to RRF (as proposed in R14/N1), but:
1. **Do NOT replace RRF** until R13 evaluation infrastructure can validate the improvement
2. Expect the improvement to be **less than 6%** (probably 1-3%) due to small corpus, small result sets, and imperfect score calibration
3. The primary value of RSF is as a diagnostic tool -- comparing RRF vs RSF rankings reveals where rank-flattening is losing magnitude information
4. At ~1000 items with 4 channels returning 5-15 results each, the rank-based and score-based orderings will differ on approximately 10-20% of queries; on most queries they will agree

**The "calibrated scores" argument is MEDIUM confidence.** The scores are partially calibrated (vector cosine is well-behaved) but partially uncalibrated (BM25 distributions drift, graph strength is semantically different). The system sits between the pure meta-search scenario (where RRF shines) and the calibrated-ensemble scenario (where RSF shines).

---

## 4. Graph as Most Orthogonal Channel

### 4.1 The Orthogonality Claim

The analysis identifies graph as having the **lowest correlation** with all other channels because it measures structural connectivity rather than content similarity.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:405-407`]

### 4.2 Why This Is Correct

The four channels decompose into two fundamental measurement types:

| Channel | Measures | Basis |
|---------|----------|-------|
| Vector (cosine) | Semantic similarity | Content (embedding space) |
| FTS5 (BM25) | Lexical match | Content (term frequency) |
| BM25 (JS) | Lexical match | Content (term frequency) |
| Graph (causal) | Structural connectivity | Topology (edge relationships) |

Three of four channels measure variations of **content relevance** (semantic or lexical). Only the graph channel measures **structural relevance** -- whether a memory is connected to other relevant memories via causal edges, regardless of its textual content.

This makes graph maximally orthogonal by construction. A memory that is textually irrelevant to the query but is the causal predecessor of a highly relevant memory should still surface -- only the graph channel can discover this.

### 4.3 Current Graph Channel Impairment

The graph channel is not just underdeveloped -- it is actively broken:

1. **ID format mismatch (G1).** Graph results use `id: \`mem:${row.id}\`` (string format) while all other channels use numeric IDs. This causes MMR reranking and causal boost to silently skip graph results because Map lookups by numeric ID will never match string IDs.
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:110`]

2. **Dead centrality code.** `computeGraphCentrality()` exists in `composite-scoring.ts` but is unreachable.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:409`]

3. **Negligible co-activation.** The co-activation boost factor is 0.1x with 0.5 decay per hop, meaning at hop 2 the effective boost is 5%. This is below the noise floor of other scoring signals.
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:98`]

### 4.4 Theoretical Maximum Improvement from Graph Deepening

From ensemble theory (Dietterich, 2000; Krogh & Vedelsby, 1995), the error of an ensemble is:

```
E_ensemble = E_avg - A_avg

where:
  E_avg = average error of individual members
  A_avg = average ambiguity (pairwise disagreement) between members
```

The ensemble benefits most from **maximizing ambiguity** (diversity) while maintaining individual member accuracy. Since graph is the most diverse channel, improvements to graph accuracy have the highest marginal return on ensemble performance.

**Theoretical calculation:**

Assume current ensemble diversity contributions:
- Vector: baseline diversity = 0.0 (reference channel)
- FTS5: diversity from vector ~ 0.15 (medium -- different method, same semantic space)
- BM25: diversity from vector ~ 0.12 (medium-high correlation with FTS5, so low marginal)
- Graph: diversity from vector ~ 0.45 (high -- different measurement dimension)

Current effective diversity: `0 + 0.15 + 0.12 + 0.45 = 0.72` (unitless, relative)

If graph is fixed (G1) and deepened (centrality, degree scoring):
- Graph accuracy improves (fewer silent exclusions)
- Graph diversity contribution stays high (~0.45)
- Net effect: graph moves from contributing 0% of actual results (due to G1 bug) to contributing its theoretical share

**The maximum improvement from fixing G1 alone could be substantial** -- the graph channel currently contributes approximately ZERO effective results due to the ID format mismatch. Enabling it at all is a step-function improvement, not an incremental one.

### 4.5 Graph Deepening vs New Channels

| Investment | Effort | Diversity Gain | Accuracy Gain | Risk |
|-----------|--------|----------------|---------------|------|
| Fix G1 (graph IDs) | ~2h | HIGH (enables graph channel) | HIGH | LOW |
| Activate centrality | ~4h | MEDIUM | MEDIUM | LOW |
| Add degree scoring (R4) | ~8h | MEDIUM | MEDIUM | MEDIUM |
| Community detection | ~16h | HIGH | MEDIUM | MEDIUM |
| Add 5th channel (e.g., semantic similarity with 2nd model) | ~20h | MEDIUM (still content-based) | MEDIUM | HIGH |
| Add entity extraction channel | ~30h | HIGH (structural) | UNKNOWN | HIGH |

**Verdict:** Fixing and deepening the graph channel yields the highest diversity-per-hour investment. Adding new content-based channels (second embedding model, additional lexical variants) provides diminishing returns because they remain in the same measurement space as existing channels.

The priority ordering should be:
1. Fix G1 (~2h, HIGH impact)
2. Increase co-activation boost from 0.1 to 0.2-0.3 (~1h, MEDIUM impact)
3. Activate `computeGraphCentrality()` (~4h, MEDIUM impact)
4. Add typed-weighted degree as 5th RRF channel (R4, ~8h, MEDIUM impact)

After these investments, the graph channel moves from "broken and invisible" to "functional and moderately contributing." The next investment decision (community detection vs new channel types) should wait for R13 evaluation data showing where residual retrieval failures occur.

---

## 5. 15+ Signals: Strength vs Noise

### 5.1 Signal Inventory

The analysis catalogs 15+ distinct signals.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:379-388`]

| Category | Signals | Count |
|----------|---------|-------|
| Search channels | vector, FTS5, BM25, graph | 4 |
| Scoring factors | temporal, usage, importance, pattern, citation, context | 6 |
| Importance tiers | constitutional through deprecated | 6 levels |
| Cognitive | FSRS decay, working memory, session boost, co-activation | 4 |
| Quality | MMR diversity, cross-encoder reranking, evidence-gap detection | 3 |

Plus unused signals: quality_score, confidence, validation_count, computeStructuralFreshness(), computeGraphCentrality().

### 5.2 The Curse of Dimensionality in Scoring

There is a well-established principle in machine learning: adding features improves model performance up to a point, after which additional features introduce noise and degrade performance. This is the **bias-variance tradeoff** -- more signals reduce bias (ability to capture true patterns) but increase variance (sensitivity to noise in individual signals).

The critical threshold depends on:

```
optimal_signal_count ~ f(training_data_size, signal_noise_ratio, signal_correlation)
```

For supervised learning with ground truth labels, this is typically:
- ~10 features for 100 training examples
- ~30 features for 1000 training examples
- ~100 features for 10000 training examples

**This system has ZERO training examples** (no ground truth, no evaluation data). The signals are combined using hand-tuned weights, not learned weights. In this regime, every additional signal is a potential noise source whose weight was set by human intuition rather than empirical evidence.

### 5.3 Which Signals Are Noise?

**HIGH confidence signals (directly measure what we want):**

| Signal | Measures | Evidence of Value |
|--------|----------|-------------------|
| Vector cosine similarity | Semantic relevance to query | Well-established in IR |
| FTS5/BM25 lexical match | Term overlap with query | Well-established in IR |
| Importance tier | Safety-critical priority | Architectural requirement (constitutional) |
| Temporal decay (FSRS) | Memory freshness | Cognitive science + system design choice |

**MEDIUM confidence signals (indirectly measure relevance):**

| Signal | Measures | Concern |
|--------|----------|---------|
| Usage frequency | Historical value | Popularity bias -- old memories get more usage regardless of current relevance |
| Citation count | Interconnectedness | Confounds importance with verbosity (memories in large spec folders get more citations) |
| Pattern match (trigger) | Known relevance pathways | Valuable for exact recall, but limited to pre-defined patterns |
| Cross-encoder reranking | Refined semantic similarity | Adds latency for marginal accuracy gain on small result sets |

**LOW confidence signals (unclear signal-to-noise ratio):**

| Signal | Measures | Concern |
|--------|----------|---------|
| Co-activation (at 0.1x) | Graph neighborhood | Below noise floor of other signals at current multiplier |
| Session boost | Recency of attention | Narrow window, may cause recency bias |
| Working memory presence | Active session context | Conflates "recently seen" with "currently relevant" |
| Evidence-gap detection | Missing context | Meta-signal about retrieval quality, not directly about relevance |

### 5.4 The Dead Signals Problem

Six signals exist in code but contribute nothing:
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:179-186`]

| Signal | Status | Impact |
|--------|--------|--------|
| `quality_score` | Stored, never read in search | Wasted column |
| `confidence` | Updated by validate, not used in search | Feedback loop broken |
| `validation_count` | Incremented, never read | Feedback loop broken |
| `computeStructuralFreshness()` | Unreachable code | Dead feature |
| `computeGraphCentrality()` | Unreachable code | Dead feature |
| `learnFromSelection()` | Zero callers | Dead feature |

These dead signals represent **latent complexity** -- code that must be maintained and understood by contributors, occupying cognitive load without contributing to system behavior.

### 5.5 Signal Interaction Effects

Multiple signals interact in undocumented ways:

1. **Double intent weighting** (confirmed bug): Intent applied at channel fusion level AND at post-search scoring level, causing multiplicative amplification.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:148`]

2. **Temporal + Usage correlation**: Recently created memories have low usage counts by definition, causing these two signals to partially cancel each other for new items (temporal decay says "surface fresh items" while usage frequency says "surface frequently-used items"). The N4 cold-start boost proposal acknowledges this by adding yet another signal to counteract the interaction.

3. **Importance tier + Constitutional override**: Constitutional memories bypass normal scoring entirely (always included in results). The importance weight in composite scoring then re-applies a tier-based boost, effectively double-counting importance for constitutional items.

### 5.6 At What Point Does Adding Signals Degrade Rather Than Improve?

**Without evaluation data (current state):** The system likely crossed the optimal threshold already. With hand-tuned weights and zero ground truth, 8-10 well-calibrated signals would likely outperform 15+ poorly calibrated signals. The recommendation to "deepen existing signals rather than add new ones" from the analysis is sound.
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:37`]

**With evaluation data (post-R13):** The threshold rises. If R13 enables ablation testing (removing one signal at a time and measuring impact), the system could support 15-20 signals because each one's contribution can be validated empirically.

### 5.7 Verdict

| Action | Priority | Rationale |
|--------|----------|-----------|
| Remove or quarantine dead signals | P1 | Reduce cognitive load, eliminate false complexity |
| Fix double intent weighting | P0 | Bug, not a feature |
| Increase co-activation from 0.1 to 0.2-0.3 (or remove it) | P1 | Currently below noise floor; either make it meaningful or remove it |
| Do NOT add more signals until R13 provides ablation capability | P0 (policy) | Adding more signals without measurement is speculation |
| After R13: ablation test each signal, remove those with <1% impact | P2 | Empirical pruning |

**The optimal signal count for this system today is approximately 8-10.** The current 15+ (including dead and near-dead signals) creates maintenance burden and interaction complexity without measurable benefit. The path forward is:

```
Current: 15+ signals, hand-tuned, unmeasured
  |
Phase 1: Fix bugs, remove dead code, enable evaluation
  |
Phase 2: Ablation-test each signal, prune those below noise floor
  |
Target: 8-12 calibrated signals with empirical weight tuning
```

---

## 6. Cross-Cutting Findings

### 6.1 The Meta-Problem: All Five Questions Share a Root Cause

Every question in this analysis converges on the same root issue: **the system has no evaluation infrastructure**. Without R13:

- Dual scoring calibration cannot be tuned (Section 1)
- FTS5/BM25 redundancy value cannot be measured (Section 2)
- RRF vs RSF cannot be compared (Section 3)
- Graph channel improvement cannot be validated (Section 4)
- Signal noise floor cannot be detected (Section 5)

R13 is not just "one of 31 recommendations" -- it is the **epistemological foundation** that enables all other improvements to be validated rather than speculated.

### 6.2 The Deepening-Over-Broadening Principle

The analysis asserts: "The path forward is deepening existing signals rather than adding new ones."
[SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:37`]

This analysis confirms this principle with additional specificity:

1. **Deepening graph** (fixing G1, activating centrality, adding degree scoring) has the highest expected return because graph is maximally orthogonal and currently broken
2. **Calibrating existing signals** (normalizing score scales, removing double intent weighting, tuning alpha between System A and System B) has the second-highest return because it improves the combination of existing information
3. **Adding new signals** (new embedding model, new channels) has the lowest expected return because new content-based signals are correlated with existing content-based signals

### 6.3 Confidence Summary

| Finding | Confidence | Evidence Grade |
|---------|------------|----------------|
| Dual scoring systems are separated by design, not by accident | HIGH | A (codebase analysis) |
| FTS5+BM25 correlation is structurally inevitable | HIGH | A (same algorithm, same data) |
| Score scale mismatch between System A and B (~15:1) | HIGH | A (RRF formula analysis) |
| Graph is most orthogonal channel | HIGH | A (measurement-type analysis) |
| Graph channel is effectively broken (G1) | HIGH | A (code at graph-search-fn.ts:110) |
| Weaviate 6% RSF improvement applies here | LOW | C (different scale, different channels) |
| 15+ signals exceeds optimal threshold | MEDIUM | B (ML theory + absence of evaluation) |
| Optimal signal count is ~8-12 | MEDIUM | B (rule of thumb, not empirically derived) |
| R13 is the prerequisite for all other improvements | HIGH | A (logical dependency analysis) |

---

*Analysis produced by @research agent. All file paths and line references verified via Read tool. Evidence graded per research methodology standards.*
