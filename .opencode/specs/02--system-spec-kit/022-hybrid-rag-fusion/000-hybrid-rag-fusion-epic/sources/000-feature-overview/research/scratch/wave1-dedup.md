# Wave 1: Deduplication & Conflict Resolution -- 140 vs 141 Documents

> **Date:** 2026-02-26
> **Scope:** All 4 documents across 140 (analysis + recommendations) and 141 (analysis + recommendations)
> **Purpose:** Identify all overlaps, resolve conflicts, produce single master list

---

## 1. Overlap Analysis: Every Duplicate/Conflict Found

### 1.1 R14 (Fresh-Eyes Relative Score Fusion) vs N1 (Cross-System Relative Score Fusion)

**Source 140:** Not present (R14 and N1 are both 141-only)

**141-R14 version** (Section 6, Fresh-Eyes):
> Add an alternative fusion algorithm alongside RRF that normalizes actual similarity scores to [0, 1] per source, preserving score magnitude information. ~80 LOC. A/B testable.

**141-N1 version** (Section 4, Cross-System Synthesis):
> Replace RRF with Adaptive Relative Score Fusion. Formula: `normalized_score[i] = (raw_score[i] - min(c)) / (max(c) - min(c) + epsilon)`. Includes `w_c = f(intent, channel_reliability_history)`. ~6% recall improvement (Weaviate benchmarks).

**Conflict:** These are the SAME recommendation appearing twice in 141 with slightly different framing:
- R14 says "add alongside RRF" (conservative, A/B testable)
- N1 says "replace RRF" (aggressive)
- R14 gives effort estimate (~80 LOC); N1 gives theoretical basis (Weaviate benchmarks)
- Both reference the same Weaviate ~6% recall improvement claim

**Resolution -- MERGE into single R14/N1:**
- Use R14's conservative framing: "add alongside RRF, A/B testable"
- Use N1's formula (more precise: includes min-max normalization and intent-weighted channel weights)
- Use N1's intent-adaptive weight extension: `w_c = f(intent, channel_reliability_history)`
- Keep R14's effort estimate (~80 LOC)
- Confidence: MEDIUM (per both sources)
- 141-recommendations already acknowledges this: "R14/N1" appears as merged in feature flags and rollout order

**FINAL VERSION:**
> **R14/N1: Relative Score Fusion Mode [P1]** -- Add min-max normalized score fusion as an alternative fusion algorithm alongside RRF. Formula: `normalized_score[i] = (raw_score[i] - min(c)) / (max(c) - min(c) + epsilon)`, `final_score[i] = SUM(w_c * normalized_score_c[i]) + convergence_bonus`, where `w_c = f(intent, channel_reliability_history)`. A/B testable via dark-run. ~80 LOC. Estimated ~6% recall improvement (Weaviate benchmarks, requires local validation). Feature flag: `SPECKIT_RSF_FUSION`.

---

### 1.2 140-R1 (DocScore) vs 141-R1 (MPAB)

**140-R1 version** (140-recommendations, P0):
> DocScore Chunk-to-Memory Aggregation. Formula: `DocScore = (1/sqrt(N+1)) * SUM(ChunkScore)`. Insert BEFORE `collapseAndReassembleChunkResults()`. ~50 LOC. Code sketch included.

**141-R1 version** (141-recommendations, Section 2.1 + Section 3):
> MPAB (Max-Plus-Attenuated-Bonus) replaces DocScore. Formula: `MPAB(scores) = S_max + 0.3 * SUM(S_remaining) / sqrt(N)`. Insert AFTER RRF fusion, BEFORE state filtering. Feature flag: `SPECKIT_DOCSCORE_AGGREGATION`.

**Conflict:** The formula is fundamentally different:
- 140 formula penalizes N=1 memories by 29% (`1/sqrt(2) * score = 0.707 * score`)
- 141 formula preserves N=1 at full score (`MPAB = S_max` when N=1)
- 140 says insert BEFORE collapseAndReassembleChunkResults()
- 141 says insert AFTER RRF fusion, BEFORE state filtering (different pipeline position)
- 140's code sketch uses `similarity` field with grouping by `parent_id`
- 141 uses `max()` as default method with configurable `SPECKIT_DOCSCORE_METHOD`

**Resolution -- 141 WINS (corrects 140):**
- The N=1 penalty is a verified mathematical flaw in 140's formula
- ~90% of memories are unchunked, so the penalty would be systemic
- 141's MPAB formula is mathematically superior (no penalty for N=1, diminishing returns for many chunks)
- 141's pipeline position (after RRF, before state filtering) is better because chunk-level scores from ALL channels are fused first
- 140's code sketch should be discarded; new code sketch needed for MPAB

**Unique value from 140 to preserve:**
- The `_chunkHits: scores.length` metadata annotation (useful for debugging/telemetry)
- The observation that existing collapsing logic acts as a safety net after aggregation
- The specific file location: `handlers/memory-search.ts:303`

**FINAL VERSION:**
> **R1: MPAB Chunk-to-Memory Aggregation [P0]** -- Replace first-chunk-wins with MPAB: `S_max + 0.3 * SUM(S_remaining) / sqrt(N)`. Properties: N=1 passes unpenalized, N=2 gets modest bonus, N=10+ has diminishing returns. Insert AFTER RRF fusion, BEFORE state filtering. Preserve `_chunkHits` metadata for telemetry. Feature flag: `SPECKIT_DOCSCORE_AGGREGATION`, method configurable via `SPECKIT_DOCSCORE_METHOD=max|avg|weighted_avg`. Risk: MEDIUM (regression if formula wrong). Mitigation: dark-run comparison mandatory.

---

### 1.3 140-R4 (log(1+degree) boost) vs 141-R4 (typed-weighted 5th channel)

**140-R4 version** (140-recommendations, P0):
> Causal-Degree Ranking Boost. Formula: `degreeBoost = Math.log(1 + getCausalDegree(memoryId)) * CAUSAL_DEGREE_WEIGHT`. Apply as multiplicative boost: `finalScore = baseCompositeScore * (1 + degreeBoost)`. Weight: 0.05. Code sketch with batch SQL query included.

**141-R4 version** (141-recommendations, Section 2.2 + Section 3):
> Typed-Weighted Causal Degree as 5th RRF Channel. NOT a multiplicative boost. Feeds into RRF as a ranked list. Formula: `typed_degree(node) = SUM(weight_t * count_t)`, `degreeScore = log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`. Edge type weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5. Cap: `SPECKIT_DEGREE_BOOST_CAP=0.15`.

**Conflict:** Fundamental architectural disagreement:
- 140: Multiplicative boost on composite score (simple, 0.05 weight)
- 141: Separate RRF channel (more principled, type-weighted)
- 140 attributes the `log(1+degree)` formula to LightRAG
- 141 corrects: LightRAG uses raw integer degree as sort key for edges, NOT log(1+degree). The `log(1+degree)` formula is from Microsoft GraphRAG
- 140 uses uniform edge counting; 141 uses typed weights per edge type

**Resolution -- 141 WINS (corrects 140):**
- 141's correction about LightRAG's actual behavior is Grade A evidence (exhaustive codebase grep)
- A 5th RRF channel is architecturally cleaner than a post-hoc multiplicative boost
- Typed edge weights are more expressive (a `caused` edge IS more significant than a `supports` edge)
- The cap at 0.15 prevents hub domination

**Unique value from 140 to preserve:**
- The batch SQL query pattern for fetching degrees of multiple memories at once
- The simplicity argument: if 5th-channel approach proves too complex, the multiplicative boost is a valid fallback

**FINAL VERSION:**
> **R4: Typed-Weighted Causal Degree as 5th RRF Channel [P0]** -- Add degree-based scoring as 5th channel in RRF. Formula: `typed_degree(node) = SUM(weight_t * count_t)`, normalized: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)`. Edge weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5. Use batch SQL for performance. Cap: `SPECKIT_DEGREE_BOOST_CAP=0.15`. Exclude constitutional-tier from degree boost. Feature flag: `SPECKIT_DEGREE_BOOST`. Fallback: if 5th-channel integration too complex, multiplicative boost on composite score is acceptable interim.

---

### 1.4 R3 (SKIP) -- Confirm Removal

**140-R3** (140-recommendations, P3):
> Pre-Normalize Embeddings at Insert Time. Effort: ~30 LOC + schema migration. Downgraded from original -- sqlite-vec handles normalization internally. Pre-normalization only helps if sqlite-vec adds inner product mode. Status: DEFERRED.

**141-R3** (141-recommendations, Section 2.3):
> SKIP R3 entirely. R5 (INT8 quantization) subsumes normalization. Irreversible data risk (overwrites raw embeddings). Conflicts with R5's quantization flow.

**Conflict:** 140 says "DEFERRED (P3)", 141 says "SKIP entirely"

**Resolution -- 141 WINS:**
- 140 already acknowledged this was low value
- 141 adds a new argument: irreversible data risk (overwriting raw embeddings) that 140 missed
- 141 also notes R5 subsumes the normalization step, making R3 redundant
- There is no scenario where R3 alone is worth implementing

**FINAL VERSION:**
> **R3: Pre-Normalize Embeddings [SKIP]** -- REMOVED from roadmap. R5 subsumes normalization as a step. Irreversible data risk with no independent benefit. sqlite-vec handles normalization internally.

---

### 1.5 R5 (DEFER) -- Confirm Deferral

**140-R5** (140-recommendations, P2):
> INT8 Per-Record Quantization. Scale threshold: ROI becomes positive at 10K+ memories. Includes detailed code sketch. ~200 LOC + schema migration. Dual-store migration path.

**141-R5** (141-recommendations, Section 2.4):
> DEFER R5. At current scale (~hundreds of memories, 3MB vector data), savings are irrelevant. sqlite-vec INT8 is fundamentally incompatible with per-record quantization. ~5% accuracy loss at 768-dim is unacceptable for agent memory.

**Conflict:** 140 says P2 (implement when ready), 141 says DEFER (don't implement yet)

**Resolution -- 141 WINS with 140's code preserved:**
- 141 provides stronger arguments for deferral (incompatibility with sqlite-vec INT8, actual accuracy loss numbers)
- However, 140's detailed code sketch and dual-store migration path are valuable WHEN the deferral threshold is met
- Both agree on the threshold: 10K+ memories

**FINAL VERSION:**
> **R5: INT8 Quantization [DEFERRED]** -- Do NOT implement yet. sqlite-vec built-in INT8 is incompatible with per-record quantization; ~5% recall loss at 768-dim is significant for agent memory; current scale (~3MB) makes savings irrelevant. Reconsider when: 10K+ memories OR >50ms search latency OR 1536+ embedding dims. When implementing, use custom quantized BLOB column (NOT sqlite-vec's vec_quantize_i8). Preserve 140's code sketch and dual-store migration path for that future milestone.

---

### 1.6 R11 (learnFromSelection) -- 140 vs 141 Versions

**140-R11** (140-recommendations, P1):
> Activate Learned Relevance Feedback. The function exists at `vector-index-impl.ts:3882` but is never called. Two options: wire via memory_validate handler or memory_search handler. ~20 LOC. Risk: Low.

**141-R11** (141-recommendations, Section 2.5 + Section 3):
> Wire up with safeguards. Function at `vector-index-impl.ts:2872` (corrected line number). Requires: provenance tracking (`[learned]` prefix), 30-day TTL, expanded denylist (25 -> 100+ words), cap (max 3 terms/selection, max 8 learned triggers/memory), threshold (only learn when NOT in top 3). Risk: HIGH.

**Conflict:**
- Line number discrepancy: 140 says `:3882`, 141 says `:2872`
- Risk assessment: 140 says LOW, 141 says HIGH
- 140 proposes simple activation (~20 LOC); 141 requires safeguards (~60-80 LOC)
- 141 adds 5 specific safeguard requirements not in 140

**Resolution -- 141 WINS (more thorough):**
- 141's line number likely more accurate (from deeper investigation with 10 agents)
- 141's HIGH risk assessment is correct -- trigger pollution is a real data mutation risk
- 141's safeguards (provenance, TTL, denylist, cap, threshold) are essential, not optional
- 140's casual "~20 LOC, low risk" underestimates the complexity

**FINAL VERSION:**
> **R11: Learned Relevance Feedback with Safeguards [P1]** -- Wire up existing `learnFromSelection()` with mandatory safeguards: (1) provenance tracking via `[learned:term]` prefix, (2) 30-day TTL if not reinforced, (3) denylist expansion to 100+ stop words, (4) cap: max 3 terms/selection, max 8 learned triggers/memory, (5) threshold: only learn when NOT in top 3 results. Shadow-log for 1 week before enabling mutations. Feature flag: `SPECKIT_LEARN_FROM_SELECTION`. Risk: HIGH (data mutation). Mitigation: provenance enables bulk cleanup.

---

### 1.7 R2 (Channel Diversity) -- Both Versions

**140-R2** (140-recommendations, P1):
> Channel Minimum-Representation Constraint. Post-fusion enforcement using existing `sources[]` attribution. ~60 LOC. Code sketch with `enforceChannelDiversity()` function included. Confidence: MEDIUM.

**141-R2** (141-recommendations, Section 3):
> Same core idea. Adds constraints: minimum=1 (not higher), only when channel returned results, apply AFTER quality threshold filtering, quality floor: min_similarity >= 0.2. Feature flag: `SPECKIT_CHANNEL_MIN_REP`.

**Conflict:** Minor -- 141 refines 140's version with specific constraints

**Resolution -- MERGE (141 constraints + 140 code sketch):**
- 140's code sketch is useful implementation guidance
- 141's constraints are essential guardrails
- Both agree on MEDIUM confidence and P1 priority

**FINAL VERSION:**
> **R2: Channel Minimum-Representation Constraint [P1]** -- Post-fusion enforcement using `sources[]` attribution. Constraints: minimum=1 per active channel, only when channel returned results, apply AFTER quality threshold (`min_quality_score`), quality floor `min_similarity >= 0.2`. ~60 LOC. Feature flag: `SPECKIT_CHANNEL_MIN_REP`. Risk: MEDIUM. Confidence: MEDIUM (requires empirical validation via R13).

---

### 1.8 R6 (Pipeline Refactor) -- Both Versions

**140-R6** (140-recommendations, P2):
> 4-Stage Query Pipeline Refactor. Stages: Search (parallel) -> Score & Aggregate -> Truncate & Filter -> Build Context. ~400 LOC refactor. References incorporating R1, R2, R4.

**141-R6** (141-recommendations, Section 3):
> Same concept, renamed stages: Candidate Generation -> Fusion -> Rerank -> Post-Process. Adds R14/N1 (RSF), MPAB aggregation into Rerank stage. R6 now has 5 channels (adds degree). Risk downgraded from MEDIUM to LOW.

**Conflict:** Stage naming and composition differ

**Resolution -- 141 WINS (more refined):**
- 141's stage names (Candidate -> Fusion -> Rerank -> Post-Process) are more standard
- 141 correctly places MPAB in Rerank stage (not Score & Aggregate as 140 suggested)
- 141 includes degree as 5th channel in Candidate stage
- 141 downgrades risk to LOW (refactoring, no data change) which is more accurate

**FINAL VERSION:**
> **R6: 4-Stage Pipeline Refactor [P2]** -- Stage 1: Candidate Generation (5 channels: vector, FTS5, BM25, graph, degree). Stage 2: Fusion (RRF or RSF, convergence bonus, intent-adaptive weights). Stage 3: Rerank (cross-encoder, MMR diversity, MPAB aggregation). Stage 4: Post-Process (composite scoring, causal boost, co-activation, state filtering, session dedup, evidence gap detection). Risk: LOW (refactoring). Mitigation: all 158 tests must pass, dark-run must produce identical output.

---

### 1.9 R13 (Evaluation Infrastructure) -- Both Versions

**140-R13** (140-recommendations, P1):
> Retrieval Evaluation Infrastructure. Log query-result-selection triples, build offline evaluation script (MRR@10, Recall@5, NDCG), ~150 LOC + ~30 LOC logging hooks. Listed as "NEW -- Prerequisite".

**141-R13** (141-recommendations, Section 7, full detailed spec):
> Comprehensive evaluation framework. 4 primary metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1). 5 agent-memory-specific metrics. Separate SQLite DB (speckit-eval.db). 5-table schema. Ground truth construction in 3 phases. Shadow scoring with Kendall tau thresholds. 52h total effort across 3 sprints. Promoted to P0 (FOUNDATION).

**Conflict:**
- Priority: 140 says P1, 141 says P0 (FOUNDATION)
- Metrics: 140 uses MRR@10, 141 uses MRR@5 (different K)
- Scope: 140 is a sketch (~180 LOC), 141 is a full specification (52h, 5 tables, 3 sprints)

**Resolution -- 141 WINS (vastly more detailed):**
- 141's P0 priority is correct -- it IS a foundation for validating all other changes
- 141's MRR@5 is more appropriate than 140's MRR@10 (agent attention drops after position 5)
- 141's full schema and phased ground truth construction are production-ready
- 140's brief sketch is subsumed entirely by 141's detailed spec

**FINAL VERSION:**
> **R13: Retrieval Evaluation Infrastructure [P0 -- FOUNDATION]** -- Separate SQLite DB (speckit-eval.db), 5-table schema (eval_queries, eval_channel_results, eval_final_results, eval_ground_truth, eval_metric_snapshots). Primary metrics: MRR@5, NDCG@10, Recall@20, Hit Rate@1. Agent-memory-specific: Constitutional Surfacing Rate, Importance-Weighted Recall, Cold-Start Detection Rate, Intent-Weighted NDCG, Channel Attribution Score. Ground truth: Phase A synthetic (immediate), Phase B implicit (2-4 weeks), Phase C LLM-judge (6-8 weeks). Shadow scoring with Kendall tau decision criteria. 52h across 3 sprints.

---

### 1.10 R7, R8, R9, R10, R12 -- Minor Refinements

These recommendations exist in both 140 and 141 with only minor refinements. 141 adds feature flags, specific thresholds, and guardrails.

| Rec | 140 Version | 141 Additions | Winner |
|-----|-------------|---------------|--------|
| **R7** (Chunk Thinning) | Bottom-up merge, ~100 LOC | Anchor preservation rule, similarity threshold 0.3, min 2 chunks/parent, checkpoint before thinning | 141 (more guardrails) |
| **R8** (Summaries) | Summary column, <200 tokens = IS summary, ~150 LOC | Max tokens configurable (`SPECKIT_SUMMARY_MAX_TOKENS=200`), flag: `SPECKIT_MEMORY_SUMMARIES` | 141 (adds flag) |
| **R9** (Folder Pre-Filter) | One-sentence description per folder, ~80 LOC | Confidence threshold 0.8, cross-folder bypass, flag: `SPECKIT_SPEC_PREFILTER` | 141 (adds constraints) |
| **R10** (Auto Entities) | Regex/NLP extraction, strength 0.3, ~200-500 LOC | Auto-edges marked `source='auto'`, strength 0.5, weighted at 50% in R4, min confidence 0.7 | 141 (better integration) |
| **R12** (Query Expansion) | Embedding-based expansion, ~80 LOC | Max 3 variants, original weighted 2x, only when <5 results, <300ms budget | 141 (adds constraints) |

**Resolution:** For all 5, 141's versions supersede 140's with additional guardrails/constraints while preserving the core approach.

---

## 2. Unique Content in 140 NOT Carried to 141

### 2.1 140-Analysis Section 7 (Key Learnings)

| 140 Learning | In 141? | Assessment |
|---|---|---|
| **7.1 Entropy-Calibrated Quantization** (KL divergence for batch re-indexing) | PARTIAL -- 141-analysis 4.3 covers zvec quantization but not KL divergence insight for batch vs streaming | **PRESERVE** -- The insight that batch re-index could use global calibration while single insert uses per-record is valuable for the R5 deferral note |
| **7.2 Gleaning for Completeness** (LightRAG's second-pass "did we miss anything?") | NO -- Not mentioned in 141 | **PRESERVE** -- Relevant to R10 (auto entity extraction). Two-pass approach would reduce false negatives |
| **7.3 Description-First Cross-Document Search** | YES -- Covered by R9 (Spec Folder Pre-Filter) | Already captured |
| **7.4 Quantized Distance Without Decode** | PARTIAL -- 141 mentions but dismisses due to JS integer/float parity | Already captured (in 141's deferral rationale) |
| **7.5 Weighted Chunk Selection** (frequency of chunk reference as relevance signal) | NO -- Not mentioned in 141 | **PRESERVE** -- The idea that chunks referenced by multiple causal edges should score higher is novel and distinct from MPAB |

**Action:** Two learnings should be preserved in the master document as supplementary notes:
1. KL divergence calibration for batch re-indexing (attach to R5 deferral)
2. Chunk frequency scoring via causal edge references (attach to R4 or as future investigation)
3. Gleaning two-pass pattern (attach to R10)

### 2.2 140-Recommendations Code Sketches vs 141 Versions

| Rec | 140 Code Sketch | 141 Code Sketch | Better? |
|-----|-----------------|-----------------|---------|
| **R1** | `aggregateChunkScoresToParent()` -- full TypeScript function (~35 LOC) | MPAB formula only (pseudocode, ~5 LOC) | **140 sketch is better structured** but uses wrong formula. Rewrite with 140's structure + 141's MPAB formula |
| **R4** | `getCausalDegree()` + batch SQL (~25 LOC) | `computeDegreeScore()` with typed weights (~10 LOC) | **Both valuable.** Merge: 141's typed weights + 140's batch SQL pattern |
| **R5** | `quantizeRecord()` full TypeScript (~30 LOC) | Pseudocode algorithm steps (~10 LOC) | **140 sketch is production-closer** (preserve for when R5 is un-deferred) |
| **R11** | Two option sketches (validate handler vs search handler) | Safeguard list only, no code | **140 has code, 141 has requirements.** Both needed |
| **R2** | `enforceChannelDiversity()` full function (~25 LOC) | Constraint list only, no code | **140 sketch is useful** implementation reference |

### 2.3 140-Analysis Section 4 (Integration Mechanisms Diagram)

The ASCII diagram showing how PageIndex/zvec/LightRAG patterns map to Indexing Pipeline vs Retrieval Pipeline vs Existing Pipeline is NOT reproduced in 141.

**Assessment:** The diagram is useful for understanding WHERE each recommendation operates in the architecture. However, 141's pipeline code map (Section 3.1) is more detailed and accurate.

**Resolution:** The 140 diagram's key insight -- that zvec operates at embedding/storage layer, LightRAG at fusion/ranking layer, and PageIndex at indexing/scoring layer -- is captured implicitly in 141's architecture analysis. No explicit preservation needed, but the layered integration concept should inform implementation ordering.

---

## 3. Items Unique to 141 (No 140 Equivalent)

These recommendations exist ONLY in 141 and have no overlap with 140:

| ID | Name | Category | Priority |
|---|---|---|---|
| **G1** | Graph channel ID format mismatch fix | Bug Fix | P0 |
| **G2** | Double intent weighting fix | Bug Fix | P0 |
| **G3** | Chunk collapse conditional fix | Bug Fix | P0 |
| **G4** | Wire learnFromSelection (overlaps R11 but is the bug-fix component) | Bug Fix | P0 |
| **N2** | Graph-Deepening Before Signal-Broadening | Novel | P0 |
| **N3** | Memory Consolidation Background Process | Novel | P2 |
| **N4** | Cold-Start Boost with Exponential Decay | Novel | P1 |
| **N5** | Two-Model Embedding Ensemble | Novel | P3 |
| **R14** | Relative Score Fusion Mode (merged with N1) | Novel | P1 |
| **R15** | Query Complexity Router | Novel | P1 |
| **R16** | Encoding-Intent Capture | Novel | P1 |
| **R17** | Fan-Effect Divisor in Spreading Activation | Novel | P2 |
| **R18** | Embedding Cache for Instant Rebuild | Novel | P1 |
| **S1** | Smarter Memory Content Generation | Spec-Kit | P2 |
| **S2** | Template Anchor Optimization for Chunking | Spec-Kit | P1 |
| **S3** | Validation Signals as Retrieval Metadata | Spec-Kit | P1 |
| **S4** | Spec Folder Hierarchy as Retrieval Structure | Spec-Kit | P2 |
| **S5** | Cross-Document Entity Linking at Generation Time | Spec-Kit | P2 |

---

## 4. MASTER LIST

### 4.1 Complete Recommendation Registry

| ID | Name | Source | Status | Final Priority | Notes |
|---|---|---|---|---|---|
| **G1** | Graph channel ID format mismatch | 141-only | ACTIVE | **P0-BUG** | Graph results silently excluded from MMR/causal boost |
| **G2** | Double intent weighting | 141-only | ACTIVE | **P0-BUG** | Intent bias amplified, distorts rankings |
| **G3** | Chunk collapse conditional | 141-only | ACTIVE | **P0-BUG** | Default path returns duplicate chunk rows |
| **G4** | Wire learnFromSelection | 141-only (bug component of R11) | ACTIVE | **P0-BUG** | Feedback loop completely disconnected |
| **R1** | MPAB Chunk-to-Memory Aggregation | MERGED (140+141) | ACTIVE | **P0** | 141 formula replaces 140 DocScore; 140's code structure + 141's MPAB formula |
| **R2** | Channel Minimum-Representation | MERGED (140+141) | ACTIVE | **P1** | 141 constraints + 140 code sketch |
| **R3** | Pre-Normalize Embeddings | 140, overridden by 141 | **SKIP** | -- | Removed. R5 subsumes. Irreversible data risk |
| **R4** | Typed-Weighted Degree as 5th RRF Channel | MERGED (140+141) | ACTIVE | **P0** | 141 architecture (5th channel) replaces 140 (multiplicative boost); 140's batch SQL preserved |
| **R5** | INT8 Quantization | MERGED (140+141) | **DEFERRED** | -- | 141 deferral rationale + 140 code sketch preserved for future |
| **R6** | 4-Stage Pipeline Refactor | MERGED (140+141) | ACTIVE | **P2** | 141 stage names + 140 architectural vision |
| **R7** | Anchor-Aware Chunk Thinning | MERGED (140+141) | ACTIVE | **P2** | 141 guardrails + 140 core approach |
| **R8** | Memory Summary Generation | MERGED (140+141) | ACTIVE | **P2** | 141 adds feature flag + config |
| **R9** | Spec Folder Pre-Filter | MERGED (140+141) | ACTIVE | **P2** | 141 adds confidence threshold + cross-folder bypass |
| **R10** | Auto Entity Extraction | MERGED (140+141) | ACTIVE | **P3** | 141 strength/integration improvements; add 140's gleaning pattern |
| **R11** | Learned Relevance Feedback | MERGED (140+141) | ACTIVE | **P1** | 141 safeguards replace 140's simple activation |
| **R12** | Embedding-Based Query Expansion | MERGED (140+141) | ACTIVE | **P1** | 141 adds constraints (max 3, 2x weighting, <5 trigger) |
| **R13** | Retrieval Evaluation Infrastructure | MERGED (140+141) | ACTIVE | **P0** | 141 full spec supersedes 140 sketch; promoted P1->P0 |
| **R14/N1** | Relative Score Fusion Mode | MERGED (141 R14 + 141 N1) | ACTIVE | **P1** | Deduplicated: R14 framing + N1 formula |
| **R15** | Query Complexity Router | 141-only | ACTIVE | **P1** | Adaptive-RAG inspired; 40-60% efficiency gain |
| **R16** | Encoding-Intent Capture | 141-only | ACTIVE | **P1** | Cognitive science basis (Tulving & Thomson) |
| **R17** | Fan-Effect Divisor in Spreading Activation | 141-only | ACTIVE | **P2** | ~5 LOC change |
| **R18** | Embedding Cache for Instant Rebuild | 141-only | ACTIVE | **P1** | Zero-cost re-indexing on hash match |
| **N2** | Graph-Deepening Before Signal-Broadening | 141-only | ACTIVE | **P0** | Most orthogonal, least developed channel |
| **N3** | Memory Consolidation Background Process | 141-only | ACTIVE | **P2** | Cognitive science: sleep consolidation analog |
| **N4** | Cold-Start Boost with Exponential Decay | 141-only | ACTIVE | **P1** | 12h half-life novelty boost |
| **N5** | Two-Model Embedding Ensemble | 141-only | ACTIVE | **P3** | Low-medium confidence, high cost |
| **S1** | Smarter Memory Content Generation | 141-only | ACTIVE | **P2** | JSON sidecar for richer indexing |
| **S2** | Template Anchor Optimization | 141-only | ACTIVE | **P1** | Retrieval-optimal anchor granularity |
| **S3** | Validation Signals as Retrieval Metadata | 141-only | ACTIVE | **P1** | validate.sh exit 0 -> quality boost |
| **S4** | Spec Folder Hierarchy as Retrieval Structure | 141-only | ACTIVE | **P2** | Tree-structured folder indexing |
| **S5** | Cross-Document Entity Linking | 141-only | ACTIVE | **P2** | Graph enrichment at generation time |

### 4.2 Status Summary

| Status | Count | Items |
|---|---|---|
| **ACTIVE** | 27 | G1-G4, R1, R2, R4, R6-R13, R14/N1, R15-R18, N2-N5, S1-S5 |
| **SKIP** | 1 | R3 |
| **DEFERRED** | 1 | R5 |
| **Total** | 29 | (31 original - 2 merged: R14+N1, minus 0 net because merge creates 1 from 2) |

### 4.3 Priority Distribution

| Priority | Count | Items |
|---|---|---|
| **P0-BUG** | 4 | G1, G2, G3, G4 |
| **P0** | 4 | R1, R4, R13, N2 |
| **P1** | 10 | R2, R11, R12, R14/N1, R15, R16, R18, N4, S2, S3 |
| **P2** | 8 | R6, R7, R8, R9, R17, N3, S1, S4, S5 |
| **P3** | 3 | R10, N5 |
| **SKIP/DEFER** | 2 | R3, R5 |
| **Total active** | **27** | |

---

## 5. Supplementary Notes (Unique 140 Insights to Preserve)

### 5.1 Attach to R5 (Deferred): KL Divergence for Batch Calibration

From 140-analysis Section 7.1: zvec uses NVIDIA's TensorRT INT8 calibration -- building a histogram of vector values and finding optimal clipping threshold via KL divergence minimization. For `memory_index_scan` (batch re-index), computing optimal quantization parameters across the full corpus yields better compression quality than per-record quantization.

### 5.2 Attach to R10: Gleaning Two-Pass Pattern

From 140-analysis Section 7.2: LightRAG's entity extraction includes a "gleaning" pass -- a second LLM call asking "did we miss anything?" For auto-generating causal links, a two-pass approach (extract, then verify completeness) reduces false negatives.

### 5.3 Future Investigation: Chunk Frequency via Causal Edge References

From 140-analysis Section 7.5: Chunks referenced by multiple causal edges or trigger phrases could be scored higher than chunks referenced only once. This is distinct from MPAB (which aggregates chunk similarity scores) -- it measures how many OTHER memories point to a given chunk.

### 5.4 140's "What NOT to Do" List (Carry Forward)

From 140-recommendations, these negative guidelines remain valid and should be preserved:
1. Do NOT apply round-robin interleaving after RRF
2. Do NOT replace sqlite-vec's cosine with custom inner product
3. Do NOT add HNSW indexing yet (< 10K memories)
4. Do NOT add LLM calls to the search hot path
5. Do NOT remove any existing search channels
6. Do NOT adopt PageIndex's vectorless approach
7. Do NOT claim percentage improvements without baseline metrics (R13)

---

## 6. Cross-Reference: 141-Analysis Unique Findings Not in Recommendations

The 141-analysis document contains several findings that are NOT explicitly captured as recommendations:

| Finding | Location | Status |
|---|---|---|
| FTS5 + BM25 HIGH correlation (signal redundancy) | 141-analysis 5.2 | Noted in N2 rationale but no recommendation to merge/eliminate channels |
| `search-weights.json` dead config | 141-analysis 3.2 | Not a formal recommendation; should be a cleanup task |
| `computeStructuralFreshness()` unreachable | 141-analysis 3.2 | Partially addressed by N2 (activate dead code) |
| `computeGraphCentrality()` unreachable | 141-analysis 3.2 | Explicitly listed in N2 priority list |
| Co-activation boost nearly invisible (0.1x) | 141-analysis 3.2 | Addressed by R17 (fan-effect divisor) but not the amplification issue |
| Spec folder stored as flat string | 141-analysis 3.4 | Captured as S4 |
| Architectural boundary coupling | 141-analysis 3.4 | Not a recommendation; architectural concern |

**Recommendation:** Create a lightweight cleanup task for dead code/config removal (search-weights.json, unreachable functions) separate from the feature recommendations.

---

## 7. Final Count

| Category | Count |
|---|---|
| Total unique recommendations after dedup | **29** |
| Active recommendations | **27** |
| Skipped | **1** (R3) |
| Deferred | **1** (R5) |
| Bug fixes (subset of active) | **4** (G1-G4) |
| Merged items | **3** (R14+N1 merged; each of R1, R4, R11 etc. are "merged" content from 140+141 but kept as single IDs) |
| 140-unique insights preserved as supplementary | **4** |
