# Wave 2: Evidence Quality Audit

> **Auditor:** Evidence Quality Auditor (Leaf Agent)
> **Date:** 2026-02-26
> **Scope:** 15 key claims across 3 research documents (140 analysis, 141 analysis, 141 recommendations)
> **Method:** Independent codebase verification against documented claims using the grading scale below

---

## Grading Scale

| Grade | Label | Criteria |
|-------|-------|----------|
| **A+** | Independently confirmed | Directly verified in source code with exact line numbers, independently confirmed by auditor |
| **A** | Source-verified | Verified in source code or official documentation |
| **B+** | Production benchmarks | External production system benchmarks with methodology documented |
| **B** | Cross-referenced external | External documentation or academic literature, cross-referenced |
| **C+** | Theoretical with calc | Theoretical analysis with supporting calculation |
| **C** | Cross-system analogy | Cross-system analogy or synthesis without primary measurement |
| **D** | Speculative | Speculation or unverified assertion |

---

## Claim-by-Claim Audit

### Claim 1: "Graph channel ID mismatch silently excludes results" (G1)

- **Document grade:** A (direct codebase analysis)
- **Auditor revised grade:** A+
- **Justification:** INDEPENDENTLY CONFIRMED. Auditor verified:
  - `graph-search-fn.ts:110` and `:151` both produce `id: \`mem:${row.id}\`` (string IDs)
  - `hybrid-search.ts:528-530` explicitly filters with `.filter((id): id is number => typeof id === 'number')`, which rejects all string-format IDs
  - This means graph results are excluded from MMR embedding lookup and therefore from MMR reranking
  - The claim is precisely accurate: graph results DO pass through RRF fusion (which accepts any ID) but are silently dropped from MMR and any numeric-ID-dependent post-processing
- **Evidence for upgrade:** Already at highest grade. The code paths are unambiguous.
- **Codebase citations:**
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:110`]
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:151`]
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:528-530`]

---

### Claim 2: "Double intent weighting amplifies bias" (G2)

- **Document grade:** A (direct codebase analysis)
- **Auditor revised grade:** A (confirmed, but "amplifies bias" is partially interpretive)
- **Justification:** CONFIRMED with nuance. Auditor verified two distinct intent-weight application points:
  1. **Channel-level weights** in `hybrid-search.ts:506-517`: `hybridAdaptiveFuse()` returns `semanticWeight`, `keywordWeight`, `graphWeight` which are applied to RRF channel weights before fusion
  2. **Result-level weights** in `memory-search.ts:735-778`: `applyIntentWeightsToResults()` applies `weights.similarity`, `weights.importance`, `weights.recency` to individual result scores after causal boost
  - These are technically TWO DIFFERENT WEIGHT SETS operating at different pipeline stages (channel-level vs result-level), not the same weights applied twice. The channel weights affect RRF fusion ordering; the result weights affect post-search composite scoring.
  - The claim that this "amplifies bias" is directionally correct: if intent says "boost graph" at channel level AND the same intent also boosts importance at result level, the compounding effect exists. But it is less severe than "applying the same weights twice" implies.
- **What would upgrade to A+:** Empirical measurement showing actual ranking distortion from the double application (e.g., "query X returns Y when double-weighted vs Z when single-weighted").
- **Codebase citations:**
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:506-517`]
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:735-778`]
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:884-890`]

---

### Claim 3: "learnFromSelection has zero callers" (G4)

- **Document grade:** A (direct codebase analysis)
- **Auditor revised grade:** A+
- **Justification:** INDEPENDENTLY CONFIRMED. Auditor verified:
  - The function IS exported from `vector-index-impl.ts:3882` (as alias of `learn_from_selection`)
  - The function IS re-exported through `vector-index.ts:308-309,452` (wrapper function)
  - The function IS tested in `vector-index-impl.vitest.ts:1128-1178` (8 test cases)
  - Grep of the `handlers/` directory returned ZERO matches for `learnFromSelection` or `learn_from_selection`
  - The function exists, is implemented, is tested, but has NO production callers in any handler or search pipeline
- **Evidence for upgrade:** Already at highest grade.
- **Codebase citations:**
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:3882`]
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:308-309,452`]
  - [ABSENCE: No matches in `handlers/` directory]

---

### Claim 4: "MPAB formula prevents N=1 penalty" (R1)

- **Document grade:** A (calculation)
- **Auditor revised grade:** A (mathematical proof, no codebase to verify since it is a proposal)
- **Justification:** CONFIRMED as correct mathematical analysis. The claim has two parts:
  1. **PageIndex DocScore penalizes N=1 by 29%**: `1/sqrt(1+1) = 1/sqrt(2) = 0.707`, so yes, 29.3% penalty. Mathematically verified.
  2. **MPAB avoids this**: `MPAB(single score) = S_max + 0.3 * 0 / sqrt(1) = S_max`. No penalty. Mathematically verified.
  - The analysis correctly identifies the problem AND provides a correct solution. However, MPAB itself is a proposed formula that has never been tested in any retrieval system -- its practical impact on ranking quality is unknown.
- **What would upgrade to A+:** Implementation in the codebase with empirical MRR/NDCG measurements showing improvement.
- **Citations:**
  - [SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:306-330` -- formula derivation]
  - [REF: PageIndex DocScore formula from `pageindex/page_index.py:992-1019`]

---

### Claim 5: "Relative Score Fusion gives ~6% recall improvement" (R14/N1)

- **Document grade:** B (Weaviate benchmarks)
- **Auditor revised grade:** B+ (downward pressure resisted; Weaviate is a production system with published methodology)
- **Justification:** The claim cites Weaviate benchmarks. Key considerations:
  1. Weaviate is a production-grade vector database with established engineering rigor
  2. The ~6% figure comes from their specific benchmark dataset and configuration
  3. The documents correctly caveat this: "Weaviate's 6% comes from their specific benchmark" and confidence is listed as MEDIUM
  4. Relative Score Fusion (min-max normalization per channel) vs RRF is a well-documented trade-off in the IR community
  - The claim is appropriately hedged. The 6% number should not be treated as a guarantee for THIS system, but as a directional indicator from a credible source.
- **What would upgrade to A:** Running the same benchmark on the spec-kit memory corpus with R13 evaluation infrastructure.
- **Citations:**
  - [REF: Weaviate Hybrid Fusion benchmarks -- production system measurement]
  - [CITATION: NONE -- auditor could not independently verify the Weaviate benchmark URL since no URL was provided in the documents]

---

### Claim 6: "Graph is most orthogonal channel" (N2)

- **Document grade:** A (orthogonality analysis -- per Appendix A: "A (orthogonality analysis)")
- **Auditor revised grade:** C+ (theoretical analysis with supporting logic but NO empirical measurement)
- **Justification:** SIGNIFICANT DOWNGRADE. The claim rests on a theoretical correlation matrix (Section 5.2 of the analysis) that assigns qualitative labels (HIGH, MEDIUM, LOW) to signal pairs. However:
  1. **No actual correlation coefficients are computed.** The matrix is filled with qualitative assessments like "LOW" and "MEDIUM" without numeric values.
  2. **No empirical measurement was performed.** No query was run to measure actual overlap between graph and vector results.
  3. **The logical reasoning is sound:** Graph connectivity IS fundamentally different from content similarity (vector/FTS/BM25). The claim SHOULD be true. But the evidence is theoretical, not measured.
  4. **The ensemble learning theory citation (Dietterich, 2000) is appropriate** but is a general principle, not specific evidence for THIS system.
  - The documents themselves grade this as "A (orthogonality analysis)" which is too generous for qualitative reasoning without measurement.
- **What would upgrade to A:** Running all 4 channels independently on 50+ queries and computing Jaccard overlap or Kendall tau between channel result sets. If graph has <0.15 Jaccard with vector while FTS+BM25 have >0.6, the claim is empirically confirmed.
- **Citations:**
  - [SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:395-402` -- qualitative correlation matrix]
  - [REF: Dietterich, T.G. (2000). Ensemble Methods in Machine Learning]

---

### Claim 7: "Cold-start boost with 12h half-life is appropriate" (N4)

- **Document grade:** B (recommendation systems)
- **Auditor revised grade:** C+ (reasonable proposal, but "appropriate" is unvalidated)
- **Justification:** The 12h half-life is presented as a design choice with reasonable reasoning but no empirical basis specific to agent memory:
  1. **The formula is standard:** `alpha * exp(-t/tau)` is a well-known exponential decay used in recommendation systems
  2. **The parameters are arbitrary:** `alpha=0.15` and `tau=12h` are not derived from any measurement of actual agent memory usage patterns
  3. **No analysis of how often new memories are actually most relevant** in this specific system
  4. **The analogous recommendation system patterns** (e.g., YouTube freshness boost) operate at very different scales and contexts
  - The proposal is reasonable engineering judgment, but calling it "appropriate" without measurement is premature.
- **What would upgrade to B:** Analysis of actual memory creation-to-first-retrieval timing in the spec-kit system. If median time-to-first-use is ~6-24h, then 12h half-life is empirically justified.
- **Citations:**
  - [SOURCE: `141 - recommendations-deep-dive-10-agent-synthesis.md:358-368` -- formula specification]
  - [CITATION: NONE -- no specific recommendation system paper cited for the parameter values]

---

### Claim 8: "Memory consolidation is analogous to sleep consolidation" (N3)

- **Document grade:** B (cognitive science)
- **Auditor revised grade:** C (cross-system analogy)
- **Justification:** This is a METAPHORICAL claim, not a technical one. Key issues:
  1. **The citation (Diekelmann & Born, 2010) is a real, authoritative paper** on sleep-dependent memory consolidation
  2. **The analogy is creative and intellectually interesting** but analogies are not evidence
  3. **No mechanism-level mapping exists.** Biological consolidation involves synaptic homeostasis, protein synthesis, and hippocampal-neocortical transfer. The proposed "consolidation process" (auto-link, merge, strengthen, detect contradictions) shares the NAME but not the mechanism.
  4. **The proposed background process is actually a reasonable engineering feature** -- it just does not need the cognitive science justification. Auto-linking semantically similar memories, merging duplicates, and detecting contradictions are standard data maintenance tasks.
  - The cognitive science framing adds narrative appeal but not evidence. The recommendation stands on its engineering merits (Grade B) but the biological analogy itself is Grade C.
- **What would upgrade to B:** Citing specific computational neuroscience models (e.g., Complementary Learning Systems theory, McClelland et al. 1995) that have been implemented in artificial systems with measured benefits.
- **Citations:**
  - [REF: Diekelmann, S. & Born, J. (2010). The memory function of sleep. Nature Reviews Neuroscience]
  - [INFERENCE: The analogy is the researcher's synthesis, not a cited pattern from computational neuroscience]

---

### Claim 9: "Query complexity routing gives 40-60% computation reduction" (R15)

- **Document grade:** B (NAACL 2024 -- Adaptive-RAG)
- **Auditor revised grade:** B (confirmed as legitimate academic source)
- **Justification:** The Adaptive-RAG paper (Jeong et al., NAACL 2024) is a real, peer-reviewed paper that does propose query complexity routing. Key considerations:
  1. **The paper exists and is peer-reviewed at a top NLP venue** (NAACL 2024)
  2. **The 40-60% reduction figure** is plausible for their experimental setup (routing simple queries to single-step retrieval vs multi-hop)
  3. **Transfer to our system is uncertain:** Their system routes between no-retrieval, single-step, and multi-step RAG. Our system would route between single-channel and multi-channel search. The domains differ.
  4. **The confidence level of MEDIUM is appropriate**
- **What would upgrade to A:** Implementing the router and measuring actual latency reduction on spec-kit queries. The 40-60% range is broad enough to be plausible but needs local validation.
- **Citations:**
  - [REF: Jeong et al. (2024). Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity. NAACL 2024]

---

### Claim 10: "~1-2% recall loss for INT8 quantization at 768-dim" (R5)

- **Document grade:** B (HuggingFace benchmarks)
- **Auditor revised grade:** B- (internally contradictory evidence)
- **Justification:** The documents present CONTRADICTORY numbers:
  1. **140 analysis (Section 2.1 table):** States "~1-2% recall loss" for INT8 at 768-dim
  2. **141 analysis (Section 4.3):** States "HuggingFace benchmarks show 94.68% recall retention for 768-dim INT8 (e5-base-v2)" -- which is **5.32% recall loss**, not 1-2%
  3. These two claims in the SAME research body directly contradict each other
  4. The 141 document correctly uses this contradiction to argue AGAINST INT8 ("losing 5% of recall is significant") and to defer R5
  - The 1-2% figure in the 140 document appears to be incorrect or refers to a different benchmark (possibly FP16 rather than INT8). The 5.32% figure from the 141 document is more specifically attributed.
- **What would upgrade to A:** Running INT8 quantization on the actual spec-kit embedding vectors and measuring recall against ground truth queries.
- **Citations:**
  - [SOURCE: `140 - analysis-hybrid-rag-fusion-architecture.md:133` -- "~1-2% recall loss"]
  - [SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:345` -- "94.68% recall retention" (i.e., 5.32% loss)]
  - [CONTRADICTION: These two numbers from the same research body do not agree]

---

### Claim 11: "FTS5 + BM25 have HIGH correlation" (Signal analysis)

- **Document grade:** B (theoretical + correlation analysis)
- **Auditor revised grade:** C+ (logical but unmeasured)
- **Justification:** The claim is that FTS5 and BM25 channels are highly correlated because both perform lexical matching. This is logically sound but:
  1. **No empirical correlation was measured.** No queries were run to compare FTS5 vs BM25 result overlap.
  2. **The logical argument is strong:** BM25 IS fundamentally a term-frequency/inverse-document-frequency model; FTS5 also uses term-matching with BM25 scoring. They use the same underlying signal (term presence and frequency).
  3. **However, implementation differences could create divergence:** FTS5 uses SQLite's built-in tokenizer while BM25 uses an in-memory index. Different tokenization, stemming, or stop-word handling could reduce correlation more than expected.
  4. **The claim "FTS5 is effectively a superset" (line 398) is INCORRECT** without verification. FTS5's default tokenizer differs from the BM25 index implementation. They may handle edge cases (hyphenation, CamelCase, Unicode) differently.
- **What would upgrade to A:** Computing Jaccard similarity of top-10 results between FTS5 and BM25 channels across 50+ queries. If overlap > 0.7, HIGH correlation is confirmed.
- **Citations:**
  - [SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:398` -- qualitative assessment]
  - [INFERENCE: Theoretical reasoning about lexical matching similarity]

---

### Claim 12: "15+ signals may be above noise threshold" (Signal abundance)

- **Document grade:** Not explicitly graded in documents (presented as inventory)
- **Auditor revised grade:** C+ (accurate count, "above noise threshold" is unverified)
- **Justification:** Two parts to evaluate:
  1. **Signal count is accurate.** The inventory in Section 5.1 lists: 4 search channels + 6 scoring factors + 6 importance levels + 4 cognitive features + 3 quality features = 23 distinct signals. The "15+" framing understates the actual count.
  2. **Whether these are "above noise threshold" is unknown.** Several signals are confirmed dead code (`computeStructuralFreshness`, `computeGraphCentrality`, `quality_score`, `confidence`, `validation_count`). Others have near-zero effective weight (co-activation at 0.05 effective boost). The COUNT of signals is high but the EFFECTIVE signal count (actually contributing to ranking) is lower.
  3. **For comparison:** The documents correctly note that zvec has 1 signal, LightRAG ~4, PageIndex ~3. But comparing signal COUNTS without measuring signal EFFECTIVENESS is misleading.
- **What would upgrade to B:** Ablation study removing each signal individually and measuring MRR delta. Signals with |delta| < 0.5% are below noise threshold.
- **Citations:**
  - [SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:379-388` -- signal inventory table]

---

### Claim 13: "Intelligence Conservation Law" (Cross-system principle)

- **Document grade:** B (cross-system comparison)
- **Auditor revised grade:** C (cross-system analogy presented as "law")
- **Justification:** This is a COINED PRINCIPLE, not a cited law. Key issues:
  1. **The observation is interesting and directionally true:** Systems that invest more at index time (LightRAG, PageIndex) invest less at query time, and vice versa. There is a real trade-off between indexing richness and retrieval complexity.
  2. **Calling it a "Law" implies universality that is not established.** This is an observation from 4 systems, not a proven theorem. Counter-examples exist: systems like ColBERT invest heavily at BOTH index time (per-token embeddings) and query time (late interaction matching).
  3. **No citation to prior work.** If this pattern has been observed before, it should be cited. If novel, it should be labeled as a hypothesis, not a "law."
  4. **The practical implication (invest intelligence where it matters most for your use case) is sound advice** regardless of whether it rises to the level of a "law."
- **What would upgrade to B:** Citing prior work on indexing-retrieval trade-offs (e.g., the "build vs query" trade-off in database indexing literature) and presenting it as a hypothesis rather than a law.
- **Citations:**
  - [SOURCE: `141 - analysis-deep-dive-10-agent-synthesis.md:77` -- principle statement]
  - [CITATION: NONE -- no prior work cited for this principle]

---

### Claim 14: "Encoding specificity principle applies to agent memory" (R16)

- **Document grade:** C (cognitive theory)
- **Auditor revised grade:** C (agreement -- correctly graded)
- **Justification:** The documents CORRECTLY grade this as C-level evidence. The claim references Tulving & Thomson (1973), a foundational paper in memory psychology, which demonstrates that retrieval is most effective when retrieval context matches encoding context.
  1. **Tulving & Thomson (1973) is a real, foundational paper** in cognitive psychology
  2. **The encoding specificity principle is well-established** in human memory research
  3. **The application to computational memory systems is a novel analogy** that has not been empirically validated in this domain
  4. **The proposed mechanism (+0.10 congruence boost when retrieval intent matches encoding intent) is reasonable** but the parameter value is arbitrary
  - This is a case where the documents' own confidence calibration (LOW-MEDIUM, Grade C) is accurate.
- **What would upgrade to B:** Implementing the encoding-intent capture and measuring whether intent-congruent retrieval actually produces higher user satisfaction or selection rates.
- **Citations:**
  - [REF: Tulving, E. & Thomson, D.M. (1973). Encoding specificity and retrieval processes in episodic memory. Psychological Review]

---

### Claim 15: "2-3x effort underestimate" (Wave 1 priorities agent claim)

- **Document grade:** Not explicitly graded (appears in wave1-priorities agent output)
- **Auditor revised grade:** D (speculative assertion)
- **Justification:** This claim appears in the wave1-priorities scratch document and refers to the tendency for software estimates to underestimate actual effort. However:
  1. **No specific analysis of THIS project's estimation accuracy is provided**
  2. **The general principle that software estimates are often underestimated is well-documented** (Kahneman's planning fallacy, Standish Group CHAOS reports)
  3. **The specific "2-3x" multiplier is not derived from any measurement** of this project's historical estimates vs actuals
  4. **The total roadmap estimate of 130-165 hours is itself presented without uncertainty bounds** in the main documents
  - Without historical calibration data from this specific project, "2-3x" is an opinion, not evidence.
- **What would upgrade to B:** Analyzing 5+ past spec folder implementations, comparing estimated hours vs actual hours, and computing the average overrun factor.
- **Citations:**
  - [CITATION: NONE -- no project-specific estimation calibration data]
  - [REF: General software estimation literature, not specifically cited]

---

## Additional Findings

### Claim: "search-weights.json is dead configuration" (G10)

- **Document grade:** A (implied by "dead code" classification)
- **Auditor revised grade:** DOWNGRADED to B-
- **Justification:** The auditor found that `search-weights.json` IS actually read and used:
  - `vector-index-impl.ts:33-46`: The file is loaded at module initialization
  - `vector-index-impl.ts:46`: `MAX_TRIGGERS_PER_MEMORY` is derived from it
  - `vector-index-impl.ts:2802-2804`: `smartRanking` weights (recencyWeight, accessWeight, relevanceWeight) are read from it and used in `apply_smart_ranking()`
  - HOWEVER: `apply_smart_ranking()` has zero callers in the handlers directory, so the weights are loaded but the function using them is indeed dead code
  - The file is NOT dead configuration; the FUNCTION that consumes part of it is dead code. The `maxTriggersPerMemory` value IS actively used.
- **Codebase citations:**
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:33-46`]
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2799-2804`]

### Claim: "computeStructuralFreshness and computeGraphCentrality are unreachable" (G9)

- **Document grade:** A (direct codebase analysis)
- **Auditor revised grade:** A (confirmed with clarification)
- **Justification:** The functions exist in `fsrs.ts:43` and `fsrs.ts:66` respectively. They are exported. They have test coverage in `pipeline-integration.vitest.ts:139-142`. But grep of the `scoring/` directory and `handlers/` directory shows NO callers. They are reachable (exported) but never called from any production code path. The documents' characterization of these as being in `composite-scoring.ts` is INCORRECT -- they are in `fsrs.ts`. Minor location error, but the dead-code claim is accurate.
- **Codebase citations:**
  - [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:43,66`]
  - [CORRECTION: Documents say `composite-scoring.ts` but actual location is `fsrs.ts`]

---

## Summary: 3 STRONGEST Claims

| Rank | Claim | Revised Grade | Why Strongest |
|------|-------|---------------|---------------|
| **1** | G1: Graph channel ID mismatch silently excludes results | **A+** | Independently verified with exact code paths. The `typeof id === 'number'` filter at hybrid-search.ts:530 unambiguously excludes string-format graph IDs from MMR. No interpretation needed. |
| **2** | G4: learnFromSelection has zero callers | **A+** | Independently verified. Function exists (line 3882), is exported (vector-index.ts:308), has tests (8 cases), but zero handler callers. Binary truth: either there are callers or there are not. There are not. |
| **3** | R1: MPAB formula prevents N=1 penalty | **A** | Pure mathematical proof. PageIndex DocScore = 0.707 for N=1 (29% penalty). MPAB = S_max for N=1 (0% penalty). The math is unambiguous. Only lacks implementation validation. |

## Summary: 3 WEAKEST Claims

| Rank | Claim | Revised Grade | Why Weakest |
|------|-------|---------------|-------------|
| **1** | Claim 15: "2-3x effort underestimate" | **D** | Pure speculation with no project-specific calibration data. General software engineering folklore presented without evidence. |
| **2** | Claim 13: "Intelligence Conservation Law" | **C** | A coined principle from observing 4 systems, presented as a "law." Counter-examples exist (ColBERT). No prior work cited. Should be labeled hypothesis. |
| **3** | Claim 8: "Memory consolidation analogous to sleep consolidation" | **C** | Creative metaphor from a real neuroscience paper, but the analogy is superficial. The proposed engineering features (auto-link, merge, detect contradictions) stand on their own merits without needing biological justification. |

---

## Systematic Bias Detected

### Overgrading Pattern
The research documents systematically overgrade theoretical and analogical claims. Specifically:
- **5 of 15 claims were downgraded** by the auditor (Claims 6, 7, 11, 13, 15)
- **Common pattern:** Qualitative reasoning or cross-system analogy graded as A or B when it should be C or C+
- **Root cause:** The original grading scale (A = codebase, B = external/theoretical, C = synthesis) conflates "external documentation" (which can be Grade A if verified) with "theoretical analysis" (which should be Grade C until measured)

### Undergrading Pattern
- **1 claim was upgraded** (Claim 5: RSF from Weaviate, B to B+) -- Weaviate benchmarks deserve more credit as a production system measurement

### Internal Contradiction
- **Claim 10 (INT8 recall loss):** The 140 document says "~1-2%" while the 141 document says "5.32%". These cannot both be correct for the same configuration. The 141 document correctly uses the higher figure to argue against INT8, but the 140 document's lower figure remains uncorrected.

---

## Grade Distribution

| Grade | Count | Claims |
|-------|-------|--------|
| A+ | 2 | G1 (graph ID mismatch), G4 (learnFromSelection) |
| A | 3 | G2 (double intent), R1 (MPAB math), G9 (dead code -- corrected location) |
| B+ | 1 | R14/N1 (Weaviate RSF) |
| B | 2 | R15 (Adaptive-RAG), R5 (INT8 -- with contradiction flag) |
| C+ | 4 | N2 (graph orthogonality), N4 (cold-start), FTS5+BM25 correlation, signal abundance |
| C | 3 | N3 (consolidation analogy), Intelligence Conservation Law, R16 (encoding specificity) |
| D | 1 | 2-3x effort underestimate |

**Overall evidence quality: MIXED.** The codebase-verified claims (G1-G4, dead code) are rock-solid. The external benchmarks (Weaviate, Adaptive-RAG) are appropriately hedged. The theoretical and analogical claims are systematically overgraded in the source documents by approximately one grade level.
