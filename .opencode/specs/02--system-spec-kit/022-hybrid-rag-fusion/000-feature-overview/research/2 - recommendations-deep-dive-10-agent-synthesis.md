# 141 - Recommendations: Deep-Dive 10-Agent Synthesis

> **Supersedes:** `140 - recommendations-hybrid-rag-fusion-refinement.md` (original 13 recommendations)
> **Date:** 2026-02-26
> **Method:** 10 parallel Opus sub-agents with distinct investigation missions
> **Scope:** spec-kit Memory MCP Server + spec-kit Logic Layer

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Critical Corrections to Original Recommendations](#2-critical-corrections)
3. [Revised Recommendation Set (R1-R13)](#3-revised-recommendations)
4. [Novel Recommendations from Cross-System Synthesis (N1-N5)](#4-novel-cross-system)
5. [Spec-Kit Logic Layer Recommendations (S1-S5)](#5-spec-kit-logic)
6. [Novel Recommendations from Fresh-Eyes Analysis (R14-R18)](#6-fresh-eyes-recommendations)
7. [Evaluation Framework Design (R13 Detailed)](#7-evaluation-framework)
8. [Risk Matrix & Dependency Graph](#8-risk-matrix)
9. [Feature Flag Strategy](#9-feature-flags)
10. [Safe Rollout Order](#10-rollout-order)
11. [Implementation Roadmap](#11-roadmap)

---

## 1. Executive Summary

This document presents **31 total recommendations** synthesized from 10 independent Opus sub-agent investigations:

| Category | Count | Source |
|---|---|---|
| Revised original recommendations (R1-R13) | 13 | Corrections + enhancements to original analysis |
| Novel cross-system recommendations (N1-N5) | 5 | Agent 7: Architecture synthesis |
| Spec-kit logic layer recommendations (S1-S5) | 5 | Agent 10: Boundary analysis |
| Fresh-eyes novel recommendations (R14-R18) | 5 | Agent 11: Overlooked patterns |
| Bug fixes (architectural gaps G1-G4) | 4 | Agents 4, 5, 6 |

**Top 5 highest-impact actions (immediate):**

1. **Fix graph channel ID mismatch (G1)** -- Graph results are silently excluded from post-processing
2. **Fix double intent weighting (G2)** -- Intent bias is amplified, distorting rankings
3. **Wire up `learnFromSelection()` (G4)** -- Feedback loop is completely disconnected
4. **Implement R13: Evaluation infrastructure** -- Foundation for ALL other improvements
5. **Fix chunk collapse conditional (G3)** -- Default search returns duplicate chunk rows

**Top 5 highest-impact recommendations (planned):**

1. **N2: Graph-Deepening Before Signal-Broadening** -- Most orthogonal, least developed channel
2. **N3: Memory Consolidation Background Process** -- Novel cognitive-science-based reorganization
3. **R14: Relative Score Fusion** -- ~6% recall improvement by preserving score magnitude
4. **R15: Query Complexity Router** -- 40-60% computation reduction for simple queries
5. **R18: Embedding Cache for Instant Rebuild** -- Zero-cost re-indexing

---

## 2. Critical Corrections to Original Recommendations

### 2.1 R1: DocScore → MPAB Formula (Agent 3 Correction)

**Original:** Use PageIndex DocScore formula `1/sqrt(N+1) * SUM(ChunkScore)`

**Problem:** This formula penalizes N=1 memories by 29%. Since ~90% of memories are unchunked, this would cause systematic ranking degradation.

**Correction:** Replace with MPAB (Max-Plus-Attenuated-Bonus):
```
MPAB(scores) = S_max + 0.3 * SUM(S_remaining) / sqrt(N)

N=1: MPAB = S_max                    (no penalty)
N=2: MPAB = S_max + 0.21 * S_2       (modest bonus)
N=5: MPAB = S_max + 0.13 * SUM(4)    (diminishing returns)
```

### 2.2 R4: Degree as 5th RRF Channel (Agent 2 Correction)

**Original:** Use `log(1 + degree) * weight` as multiplicative boost

**Problem:** LightRAG does NOT use `log(1 + degree)`. Exhaustive grep confirmed this formula appears in Microsoft GraphRAG, not LightRAG. Degree is used only as a secondary sort key for edges.

**Correction:** Add degree as a **5th RRF channel** rather than a multiplicative boost. Use typed-weighted degree computation:
```
typed_degree(node) = SUM(weight_t * count_t)

Edge type weights:
  caused=1.0, derived_from=0.9, enabled=0.8,
  contradicts=0.7, supersedes=0.6, supports=0.5

Degree score = log(1 + typed_degree) / log(1 + max_typed_degree)
```

### 2.3 R3: Pre-Normalize → SKIP (Agent 1 Correction)

**Original:** Pre-normalize embeddings at insert time for faster cosine computation

**Correction:** **SKIP R3 entirely.** R5 (INT8 quantization) subsumes normalization as a step. Implementing R3 alone has irreversible data risk (overwrites raw embeddings) and conflicts with R5's quantization flow.

### 2.4 R5: INT8 Quantization → DEFER (Agent 1 Assessment)

**Original:** Implement zvec-style INT8 quantization for storage reduction

**Correction:** **DEFER R5.** At current scale (~hundreds of memories, 3MB of vector data), the 2.2MB savings is irrelevant. sqlite-vec's built-in INT8 is incompatible with per-record quantization. Accuracy loss of ~5% at 768-dim is unacceptable for agent memory.

**Reconsider when:** Memory count exceeds 10,000+ OR search latency exceeds 50ms OR embedding dimension increases to 1536+.

### 2.5 R11: learnFromSelection → Wire Up + Safeguards (Agent 4/8 Correction)

**Original:** Activate the existing `learnFromSelection()` function

**Correction:** The function exists but has **zero callers** (dead code). Wiring it up requires:
1. Provenance tracking: Tag learned triggers with `[learned]` prefix
2. TTL: Learned triggers expire after 30 days if not reinforced
3. Denylist expansion: Current stop_words is only 25 words
4. Cap: `MAX_TRIGGERS_PER_MEMORY` = 8 for learned (2 reserved), 10 for manual
5. Threshold: Only learn when memory was NOT in top 3 results

---

## 3. Revised Recommendation Set (R1-R13)

### R1: MPAB Chunk-to-Memory Aggregation [P0]

**What:** Replace first-chunk-wins with MPAB aggregation: `S_max + 0.3 * SUM(S_remaining) / sqrt(N)`

**Where:** New function in `memory-search.ts`, inserted AFTER RRF fusion, BEFORE state filtering

**Key change from original:** Uses max-based aggregation (not average) to prevent multi-chunk documents with mixed relevance from being penalized. N=1 memories pass through unpenalized.

**Risk:** MEDIUM (regression if aggregation function wrong). **Mitigation:** Feature flag `SPECKIT_DOCSCORE_AGGREGATION`, dark-run comparison mandatory. Use `max()` as default method, configurable via `SPECKIT_DOCSCORE_METHOD`.

### R2: Channel Minimum-Representation Constraint [P1]

**What:** Ensure at least 1 result from each active channel in top-K

**Where:** Post-fusion injection in `hybrid-search.ts`

**Key constraints:**
- Minimum = 1 (not higher)
- Only apply when channel returned results (don't synthesize)
- Apply AFTER quality threshold filtering (`min_quality_score`)
- Quality floor: forced results must meet `min_similarity >= 0.2`

**Risk:** MEDIUM (could force low-quality results). **Mitigation:** Feature flag `SPECKIT_CHANNEL_MIN_REP`.

### R3: Pre-Normalize Embeddings [SKIP]

**Status:** REMOVED from roadmap. R5 subsumes normalization. Irreversible data risk with no benefit independent of quantization.

### R4: Typed-Weighted Causal Degree as 5th RRF Channel [P0]

**What:** Add degree-based scoring as a 5th channel in RRF fusion, using typed edge weights

**Where:** New function in `causal-boost.ts` or new file `degree-scoring.ts`, integrated into `hybridSearchEnhanced()`

**Formula:**
```typescript
function computeDegreeScore(memoryId: number): number {
  const edges = getCausalEdges(memoryId);
  const weights = { caused: 1.0, derived_from: 0.9, enabled: 0.8,
                    contradicts: 0.7, supersedes: 0.6, supports: 0.5 };
  const typedDegree = edges.reduce((sum, e) => sum + (weights[e.relation] || 0.5), 0);
  return Math.log(1 + typedDegree) / Math.log(1 + MAX_TYPED_DEGREE);
}
```

**Key change from original:** NOT a multiplicative boost. Feeds into RRF as a ranked list alongside vector/FTS/BM25/graph channels.

**Risk:** MEDIUM (hub domination). **Mitigation:** Cap at `SPECKIT_DEGREE_BOOST_CAP=0.15`. Exclude constitutional-tier from degree boost (they already get tier boost). Monitor "top-5 unique memory ID diversity".

### R5: INT8 Quantization [DEFERRED]

**Status:** DEFERRED until scale warrants it (10K+ memories).

**If/when implementing:** Use Option A (custom quantized BLOB column with JS-side distance computation). Do NOT use sqlite-vec's built-in `vec_quantize_i8` (incompatible with per-record quantization).

### R6: 4-Stage Pipeline Refactor [P2]

**What:** Refactor the search pipeline into explicit stages: Candidate → Fusion → Rerank → Boost

**Where:** `hybrid-search.ts` restructuring

**Stages:**
```
Stage 1: CANDIDATE GENERATION
  - Vector search, FTS5, BM25, Graph, Degree (5 channels)
  - Each channel returns scored candidates independently

Stage 2: FUSION
  - RRF or Relative Score Fusion (configurable)
  - Convergence bonus for multi-source results
  - Intent-adaptive channel weights

Stage 3: RERANK
  - Cross-encoder reranking (if enabled)
  - MMR diversity reranking
  - MPAB chunk-to-memory aggregation

Stage 4: POST-PROCESS
  - Composite scoring adjustment
  - Causal boost (2-hop)
  - Co-activation spreading
  - State filtering + session dedup
  - Evidence gap detection
```

**Key benefit:** Makes the pipeline testable per-stage and enables safe composition of R1+R4+R7+R8.

**Risk:** LOW (refactoring, no data change). **Mitigation:** All 158 existing tests must pass. Dark-run must produce identical output to current pipeline.

### R7: Anchor-Aware Chunk Thinning [P2]

**What:** Remove low-similarity chunks while preserving anchor-tagged sections

**Where:** `anchor-chunker.ts` or new `chunk-thinning.ts`

**Rules:**
- Anchor-tagged chunks are NEVER thinned
- Chunks with similarity < `SPECKIT_THIN_THRESHOLD=0.3` to their parent summary are candidates
- Always keep at least 2 chunks per parent

**Risk:** MEDIUM (data deletion, recall loss). **Mitigation:** Checkpoint before thinning. Track thinned chunks for potential restoration. Verify Recall@20 within 10% of baseline.

### R8: Memory Summary Generation [P2]

**What:** Generate short summaries for memories, stored alongside content

**Where:** New column `summary TEXT` in `memory_index`, populated at save time

**Schema:**
```sql
ALTER TABLE memory_index ADD COLUMN summary TEXT;
```

**Max tokens:** `SPECKIT_SUMMARY_MAX_TOKENS=200`

**Risk:** LOW (additive feature). **Mitigation:** Drop column to rollback.

### R9: Spec Folder Pre-Filter [P2]

**What:** When query context implies a specific spec folder, pre-filter candidates before search

**Where:** `hybrid-search.ts`, before channel queries

**Rules:**
- Only activate when confidence > `SPECKIT_PREFILTER_CONFIDENCE=0.8`
- Never exclude results when confidence is below threshold
- Cross-folder queries bypass pre-filter

**Risk:** LOW. **Mitigation:** Feature flag toggle.

### R10: Auto Entity Extraction [P3]

**What:** Automatically extract entities (function names, file paths, concepts) at save time, create causal edges

**Where:** New `entity-extractor.ts` module, integrated into save handler

**Rules:**
- Auto-extracted edges marked with `source='auto'` and `strength=0.5` (vs 1.0 for manual)
- R4's degree calculation weights auto-edges at 50% of manual edges
- `SPECKIT_ENTITY_MIN_CONFIDENCE=0.7` threshold

**Risk:** LOW-MEDIUM (noise from false positive edges). **Mitigation:** Feature flag, lower strength weight.

### R11: Learned Relevance Feedback [P1]

**What:** Wire up the existing `learnFromSelection()` function with safeguards

**Where:** `vector-index-impl.ts:2872` (existing function) + new caller in search handler

**Safeguards:**
1. Tag learned triggers: `[learned:deploy]` prefix for identification
2. TTL: 30-day expiry if not reinforced
3. Denylist: Expand stop_words from 25 to 100+ (add domain-generic terms)
4. Cap: Max 3 terms per selection, max 8 learned triggers per memory
5. Threshold: Only learn when selected memory was NOT in top 3
6. Block learning terms already in `DOMAIN_VOCABULARY_MAP`

**Risk:** HIGH (trigger pollution, data mutation). **Mitigation:** Provenance tracking enables bulk cleanup. Shadow-log for 1 week before enabling mutations.

### R12: Embedding-Based Query Expansion [P1]

**What:** Generate variant queries for broader recall

**Where:** `query-expander.ts` enhancement

**Rules:**
- Max 3 variants (`SPECKIT_EXPANSION_VARIANTS=3`)
- Original query weighted 2x vs expansion results
- Only expand when original returns < 5 results
- Total embedding cost < 300ms

**Risk:** MEDIUM (poor expansions add noise). **Mitigation:** Feature flag `SPECKIT_EMBEDDING_EXPANSION`. Monitor "expansion contamination rate" (% of top-10 from expansions only).

### R13: Retrieval Evaluation Infrastructure [P0 -- FOUNDATION]

**What:** Comprehensive metrics, logging, ground truth, and shadow scoring framework

**See:** [Section 7: Evaluation Framework Design](#7-evaluation-framework) for full specification

---

## 4. Novel Recommendations from Cross-System Synthesis (N1-N5)

### N1: Replace RRF with Adaptive Relative Score Fusion [P1]

**Rationale:** Cross-system comparison reveals that our system operates on a known, calibrated corpus (unlike meta-search scenarios where RRF was designed). Relative Score Fusion preserves score magnitude, which the multi-factor pipeline can exploit.

**Formula:**
```
For each channel c:
  normalized_score[i] = (raw_score[i] - min(c)) / (max(c) - min(c) + epsilon)

final_score[i] = SUM(w_c * normalized_score_c[i]) + convergence_bonus
where w_c = f(intent, channel_reliability_history)
```

**Implementation:** Parallel to existing RRF in `rrf-fusion.ts`. A/B testable via dark-run mode.

**Estimated impact:** ~6% recall improvement (Weaviate benchmarks). Requires R13 evaluation infrastructure to validate.

**Confidence:** MEDIUM. Strong theoretical argument, but Weaviate's 6% comes from their specific benchmark.

### N2: Graph-Deepening Before Signal-Broadening [P0]

**Rationale:** The graph channel is the most unique signal (lowest correlation with other channels) but the least developed. Investing in graph features yields higher ensemble diversity improvement per unit of effort than adding new channels.

**Investments in priority order:**
1. Fix graph channel ID format mismatch (G1) -- prerequisite
2. Integrate `computeGraphCentrality()` (currently dead code)
3. Add typed-weighted degree scoring (R4)
4. Add community detection (Leiden algorithm) for cluster-based scoping
5. Add betweenness centrality for bridge-node identification
6. Add contradiction cluster detection (surface entire `contradicts` clusters)

**Novel graph signals not used by ANY analyzed system:**
- **Graph Momentum:** Track degree change over time (trending nodes)
- **Causal Depth:** DAG depth from root cause = foundational vs derived decision
- **Contradiction Clusters:** Surface ALL members of a disagreement cluster, not just one

**Confidence:** HIGH. Supported by ensemble learning theory.

### N3: Memory Consolidation Background Process [P2]

**Rationale:** Cognitive science analysis reveals a missing mechanism in ALL four systems: periodic reorganization (analogous to sleep consolidation).

**What it does (during idle time):**
1. Auto-create causal links between semantically similar unlinked memories
2. Merge near-duplicate memories
3. Strengthen edges traversed during retrieval (Hebbian: "fire together → wire together")
4. Detect and flag contradiction clusters

**Implementation:** Background process triggered during idle periods or on schedule (daily). Uses existing `memory_search` to find semantically similar pairs, existing `memory_causal_link` to create relationships.

**Confidence:** MEDIUM. Novel proposal, cognitive science basis is strong but implementation complexity is high.

### N4: Cold-Start Boost with Exponential Decay [P1]

**Rationale:** ALL systems penalize new items through missing signals. For agent memory, new items are often the most contextually relevant.

**Formula:**
```
novelty_boost = alpha * exp(-elapsed_hours / tau)
where alpha = 0.15, tau = 12 hours (half-life)
```

At creation: +15% boost. After 12h: +7.5%. After 24h: +3.75%. After 48h: ~1% (negligible).

**Where:** Add to composite scoring factors in `composite-scoring.ts`.

**Confidence:** MEDIUM. Well-established in recommendation systems, novel in memory retrieval.

### N5: Two-Model Embedding Ensemble [P3]

**Rationale:** Using two embedding models simultaneously as separate vector channels in the fusion pipeline increases signal diversity at the most orthogonal dimension.

**Example:** General-purpose (HuggingFace 768d) + code-focused (Voyage Code 1024d) as two separate vector channels in RRF.

**Trade-off:** Storage doubles, indexing time doubles. Benefit depends on actual model divergence for our corpus.

**Confidence:** LOW-MEDIUM. Theoretical benefit clear, practical benefit unknown.

---

## 5. Spec-Kit Logic Layer Recommendations (S1-S5)

### S1: Smarter Memory Content Generation [P2]

**What:** Emit structured JSON sidecar alongside markdown memory files. The MCP server reads the sidecar for richer indexing without re-parsing markdown.

**Benefit:** Eliminates information loss during markdown rendering → re-parsing cycle.

### S2: Template Anchor Optimization for Chunking [P1]

**What:** Design templates with retrieval-optimal anchor granularity (~2000-4000 char sections corresponding to semantically coherent units).

**Guidelines:**
- Anchor sections target 2000-4000 chars (optimal for embedding)
- Section headings contain semantically rich keywords (not just "Context")
- Decision sections front-load decision text (first 200 chars most influential for embeddings)
- Trigger phrases in frontmatter cover synonyms and abbreviations

### S3: Validation Signals as Retrieval Metadata [P1]

**What:** When `validate.sh` passes cleanly (exit 0), write `validation_status` metadata that the MCP server indexes. Well-validated spec folders get a quality boost.

### S4: Spec Folder Hierarchy as Retrieval Structure [P2]

**What:** Index parent-child folder relationships explicitly. Currently stored as flat `spec_folder` string.

**Enables:** "Show all children of spec 003" or "find parent context for this memory." Maps to PageIndex's tree-structured indexing.

### S5: Cross-Document Entity Linking at Generation Time [P2]

**What:** At generation time, scan existing indexed memories for overlapping entities/topics. Emit cross-reference metadata that the MCP server uses for graph-based retrieval.

---

## 6. Novel Recommendations from Fresh-Eyes Analysis (R14-R18)

### R14: Relative Score Fusion Mode [P1]

**What:** Add an alternative fusion algorithm alongside RRF that normalizes actual similarity scores to [0, 1] per source, preserving score magnitude information.

**Why:** Current RRF treats rank 1 with 95% similarity identically to rank 1 with 55% similarity. Weaviate measured ~6% recall improvement with Relative Score Fusion.

**Effort:** ~80 LOC. Parallel to existing `rrf-fusion.ts`. A/B testable via existing dark-run infrastructure.

**Note:** This overlaps with N1 and should be implemented as a single recommendation.

### R15: Query Complexity Router [P1]

**What:** Lightweight complexity classifier that routes queries to appropriate retrieval depth:
- **Simple** ("what is the spec folder for memory?"): Single-channel vector, limit=3
- **Moderate** ("how does hybrid search work?"): Full 4-channel, limit=10
- **Complex** ("compare RRF vs score fusion trade-offs"): Multi-query expansion, limit=20

**Why:** The current system applies the same retrieval strategy regardless of complexity. Adaptive-RAG paper (NAACL 2024) demonstrates significant efficiency gains.

**Impact:** HIGH for efficiency (40-60% reduction for simple queries), MEDIUM for accuracy (complex queries get deeper retrieval).

**Effort:** ~100 LOC. Reuses intent classifier infrastructure.

### R16: Encoding-Intent Capture [P1]

**What:** Capture session intent at save time, store as `encoding_intent`. Apply congruence boost (+0.10) when retrieval intent matches encoding intent.

**Why:** Context-dependent memory research (Tulving & Thomson, 1973) shows retrieval is most effective when retrieval cues match encoding context.

**Effort:** LOW. One column addition + ~15 LOC in scoring pipeline.

### R17: Fan-Effect Divisor in Spreading Activation [P2]

**What:** Divide activation energy by `sqrt(neighborCount)` to prevent high-degree hub nodes from flooding the network.

**Current code (co-activation.ts):**
```typescript
const decayedScore = current.score * CO_ACTIVATION_CONFIG.decayPerHop * (rel.similarity / 100);
```

**Proposed:**
```typescript
const fanDivisor = Math.sqrt(neighborMap.size);
const decayedScore = (current.score * decayPerHop * (rel.similarity / 100)) / fanDivisor;
```

**Effort:** ~5 LOC. Single line change + test update.

### R18: Embedding Cache for Instant Rebuild [P1]

**What:** Cache generated embeddings alongside `content_hash` in a lightweight table. When `memory_index_scan` finds matching hash, skip embedding generation.

**Why:** Full re-index of 500 memories requires 500 API calls. With cache: zero.

**Schema:**
```sql
CREATE TABLE embedding_cache (
  content_hash TEXT NOT NULL,
  model_id TEXT NOT NULL,
  embedding BLOB NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (content_hash, model_id)
);
```

**Effort:** ~50 LOC in indexing pipeline + schema migration.

**Inspired by:** LightRAG's `_get_cached_extraction_results()` and `rebuild_knowledge_from_chunks()`.

---

## 7. Evaluation Framework Design (R13 Detailed)

### 7.1 Current Telemetry Gap

The system has latency telemetry and an uncalibrated quality proxy score (`computeQualityProxy()` with arbitrary weights). It has **zero retrieval quality metrics** -- no MRR, NDCG, Recall, or Hit Rate measurements.

Two implicit feedback signals exist but are disconnected:
- `memory_validate(wasUseful)` -- tracks usefulness but NOT which query led to it
- `learnFromSelection()` -- has zero callers (dead code)

### 7.2 Primary Metrics

| Metric | K | Rationale |
|---|---|---|
| **MRR@5** | 5 | First relevant result position matters most for agent memory. Agent attention drops off after position 5. |
| **NDCG@10** | 10 | Graded relevance (0-3) captures nuance. Matches common `limit` parameter. |
| **Recall@20** | 20 | Coverage metric. Matches `DEFAULT_LIMIT = 20`. |
| **Hit Rate@1** | 1 | "Did the best answer land at position 1?" |

**Agent-memory-specific metrics:**
- **Constitutional Surfacing Rate:** % of queries where relevant constitutional memories appear in top-3
- **Importance-Weighted Recall:** Recall weighted by memory importance tier
- **Cold-Start Detection Rate:** % of new memories (< 48h) that appear in results when relevant
- **Intent-Weighted NDCG:** `IW-NDCG = SUM(intent_confidence * NDCG) / SUM(intent_confidence)`
- **Channel Attribution Score:** Per-channel contribution rate and exclusive rate

### 7.3 Storage: Separate SQLite Database

Use a separate `speckit-eval.db` to avoid WAL contention with the main memory database. Estimated storage: ~9MB for 90 days of logging.

**Schema (5 tables):**

```sql
-- Query-level log
CREATE TABLE eval_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_id TEXT NOT NULL UNIQUE,
  timestamp TEXT NOT NULL,
  session_id TEXT,
  tool_name TEXT NOT NULL,
  query_text TEXT NOT NULL,
  query_intent TEXT,
  intent_confidence REAL,
  total_latency_ms REAL,
  result_count INTEGER,
  quality_proxy_score REAL,
  selected_memory_id INTEGER,    -- filled asynchronously
  selection_rank INTEGER,        -- filled asynchronously
  was_useful INTEGER             -- filled asynchronously
);

-- Per-channel results
CREATE TABLE eval_channel_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_log_id TEXT NOT NULL REFERENCES eval_queries(log_id),
  channel TEXT NOT NULL,
  result_count INTEGER,
  latency_ms REAL,
  result_ids TEXT,               -- JSON array
  result_scores TEXT             -- JSON array
);

-- Final ranked results
CREATE TABLE eval_final_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_log_id TEXT NOT NULL REFERENCES eval_queries(log_id),
  memory_id INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  score REAL NOT NULL,
  sources TEXT,                  -- JSON array
  convergence_bonus REAL DEFAULT 0
);

-- Ground truth annotations
CREATE TABLE eval_ground_truth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_text TEXT NOT NULL,
  memory_id INTEGER NOT NULL,
  relevance_grade INTEGER NOT NULL,  -- 0-3
  annotation_source TEXT NOT NULL,    -- synthetic, implicit, llm-judge, manual
  annotated_at TEXT NOT NULL,
  expires_at TEXT,
  UNIQUE(query_text, memory_id)
);

-- Metric snapshots
CREATE TABLE eval_metric_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  computed_at TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  query_count INTEGER NOT NULL,
  mrr_at_5 REAL,
  ndcg_at_10 REAL,
  recall_at_20 REAL,
  hit_rate_at_1 REAL,
  per_intent_metrics TEXT,       -- JSON
  channel_attribution TEXT,      -- JSON
  pipeline_config_hash TEXT
);
```

### 7.4 Ground Truth Construction

**Phase A (Immediate):** Synthetic from trigger phrases (~100-150 pairs)
**Phase B (2-4 weeks):** Implicit from `learnFromSelection` + `memory_validate` with full query context
**Phase C (6-8 weeks):** LLM-as-judge annotation on logged query-result pairs

**Statistical significance:** 30-50 queries for directional (70%), 100-200 for moderate (90%), 300+ for strong (95%).

### 7.5 Shadow Scoring (A/B Alternative)

Since there's a single user (no traffic splitting), use shadow scoring:
- Run both control and treatment pipelines on every query
- Return control results to user
- Log both result sets, compare offline

**Existing foundation:** `computeDarkRunDiff()` in `adaptive-fusion.ts:245-271` already compares two pipeline variants.

**Decision criteria:**
- Kendall tau > 0.85 AND Jaccard overlap > 0.80: Safe to deploy
- Kendall tau 0.60-0.85: Deploy with monitoring
- Kendall tau < 0.60: Manual review required

### 7.6 Implementation Effort

| Sprint | Items | Hours | Deliverable |
|---|---|---|---|
| Sprint 1 (Week 1-2) | eval-db, eval-logger, pipeline hooks, core metrics | 23h | Live logging + metric computation |
| Sprint 2 (Week 3-4) | ground truth gen, shadow scoring, channel attribution | 15h | Full evaluation framework |
| Sprint 3 (Week 5-6) | reporting, offline eval runner, ablation tests | 14h | Automation + polish |
| **Total** | | **52h** | |

---

## 8. Risk Matrix & Dependency Graph

### 8.1 Dependency Graph

```
                              R13 (Eval Infra) ◄── FOUNDATION
                             / | \  \    \
                            /  |  \  \    \
                           v   v   v  v    v
                         R2  R12 R11 R1   R4
                         |    |   |   |    |
                         |    |   |   v    |
                         |    |   | R6 ◄───┘
                         |    v   |   |
                         |  R9*  | R7 ◄── R8
                         |       |
                         v       v
                        R5 ◄──► R3  (CONFLICT → R3 SKIPPED)
                                |
                                v
                              R10*

Legend:  ──► "must precede"   ◄──► "conflicts with"   * low-coupling
```

### 8.2 Risk Matrix

| Rec | Data Loss | Regression | Perf Impact | Schema Change | Rollback | Test Coverage |
|-----|-----------|-----------|-------------|---------------|----------|---------------|
| **R1** | LOW | MEDIUM | LOW | NONE | EASY (flag) | LOW |
| **R2** | NONE | MEDIUM | LOW | NONE | EASY (flag) | LOW |
| **R3** | ~~HIGH~~ | - | - | - | - | SKIPPED |
| **R4** | NONE | MEDIUM | LOW | NONE | EASY (flag) | MEDIUM |
| **R5** | ~~HIGH~~ | - | - | - | - | DEFERRED |
| **R6** | NONE | LOW | LOW | NONE | MEDIUM | MEDIUM |
| **R7** | MEDIUM | MEDIUM | POSITIVE | NONE | MEDIUM | LOW |
| **R8** | NONE | LOW | LOW | YES (column) | EASY | NONE |
| **R9** | NONE | LOW | POSITIVE | NONE | EASY (flag) | LOW |
| **R10** | NONE | LOW | MEDIUM | NONE | EASY | NONE |
| **R11** | MEDIUM | **HIGH** | LOW | NONE | **HARD** | MEDIUM |
| **R12** | NONE | MEDIUM | MEDIUM | NONE | EASY (flag) | LOW |
| **R13** | NONE | NONE | LOW-MED | YES (tables) | EASY | MEDIUM |
| **R14** | NONE | LOW | LOW | NONE | EASY (flag) | LOW |
| **R15** | NONE | LOW | POSITIVE | NONE | EASY (flag) | LOW |
| **R16** | NONE | LOW | LOW | YES (column) | EASY | LOW |
| **R17** | NONE | LOW | LOW | NONE | EASY | LOW |
| **R18** | NONE | NONE | POSITIVE | YES (table) | EASY | LOW |
| **N1** | NONE | LOW | LOW | NONE | EASY (flag) | LOW |
| **N2** | NONE | LOW | LOW | NONE | EASY | MEDIUM |
| **N3** | NONE | LOW | MEDIUM | NONE | EASY (flag) | NONE |
| **N4** | NONE | LOW | LOW | NONE | EASY | LOW |
| **N5** | NONE | LOW | HIGH | YES (table) | MEDIUM | NONE |

### 8.3 Interaction Effects (Key Pairs)

| Pair | Effect | Risk | Notes |
|---|---|---|---|
| R1 + R4 | Additive boost | LOW | Both boost different dimensions |
| R1 + R7 | Ordering-dependent | MEDIUM | Thin BEFORE aggregate (R6 enforces) |
| R4 + R10 | Amplification loop | **HIGH** | Auto-edges need 50% strength weight |
| R11 + R12 | Circular reinforcement | MEDIUM | Block learning vocabulary map terms |
| R6 + ALL | Structural prerequisite | LOW | Pipeline makes all combinations safer |
| R13 + ALL | Passive observation | NONE | Logging doesn't affect ranking |

### 8.4 Worst-Case Scenarios

**R1 (MPAB):** Multi-chunk document has 5 chunks, 2 highly relevant (0.9) and 3 noise (0.1). `max()` aggregation returns 0.9 (correct). `avg()` would return 0.42 (incorrect). Using `max()` as default prevents this.

**R4 (Degree Boost):** Constitutional memory with 50 causal edges dominates all results. **Mitigation:** Cap at 0.15, normalize by `log(1 + degree)`, exclude constitutional tier from degree boost.

**R11 (learnFromSelection):** User searches "deploy", selects migration memory. System adds "deploy" as trigger, now migration surfaces for all deployment queries. **Mitigation:** Provenance tracking (`[learned]` prefix), 30-day TTL, denylist, threshold (only learn for non-top-3 selections).

---

## 9. Feature Flag Strategy

### 9.1 Existing Flags (Already in Codebase)

| Flag | Used By | Default |
|---|---|---|
| `SPECKIT_CAUSAL_BOOST` | `causal-boost.ts` | ON |
| `SPECKIT_ADAPTIVE_FUSION` | `adaptive-fusion.ts` | ON |
| `SPECKIT_MMR` | `search-flags.ts` | ON |
| `SPECKIT_MULTI_QUERY` | `search-flags.ts` | ON |
| `SPECKIT_CROSS_ENCODER` | `search-flags.ts` | ON |
| `SPECKIT_EXTENDED_TELEMETRY` | `retrieval-telemetry.ts` | ON |
| `SPECKIT_ROLLOUT_PERCENT` | `rollout-policy.ts` | 100 |

### 9.2 New Flags Required

| Recommendation | Flag | Default | Knobs |
|---|---|---|---|
| R1 | `SPECKIT_DOCSCORE_AGGREGATION` | `false` | `SPECKIT_DOCSCORE_METHOD=max\|avg\|weighted_avg` |
| R2 | `SPECKIT_CHANNEL_MIN_REP` | `false` | `SPECKIT_CHANNEL_MIN_COUNT=1` |
| R4 | `SPECKIT_DEGREE_BOOST` | `false` | `SPECKIT_DEGREE_BOOST_CAP=0.15` |
| R6 | `SPECKIT_PIPELINE_V2` | `false` | - |
| R7 | `SPECKIT_CHUNK_THINNING` | `false` | `SPECKIT_THIN_THRESHOLD=0.3` |
| R8 | `SPECKIT_MEMORY_SUMMARIES` | `false` | `SPECKIT_SUMMARY_MAX_TOKENS=200` |
| R9 | `SPECKIT_SPEC_PREFILTER` | `false` | `SPECKIT_PREFILTER_CONFIDENCE=0.8` |
| R10 | `SPECKIT_AUTO_ENTITIES` | `false` | `SPECKIT_ENTITY_MIN_CONFIDENCE=0.7` |
| R11 | `SPECKIT_LEARN_FROM_SELECTION` | `false` | `SPECKIT_LEARN_MAX_TERMS=3` |
| R12 | `SPECKIT_EMBEDDING_EXPANSION` | `false` | `SPECKIT_EXPANSION_VARIANTS=3` |
| R13 | `SPECKIT_EVAL_LOGGING` | `true` | `SPECKIT_EVAL_SAMPLE_RATE=0.1` |
| R14/N1 | `SPECKIT_RSF_FUSION` | `false` | - |
| R15 | `SPECKIT_COMPLEXITY_ROUTER` | `false` | - |
| R16 | `SPECKIT_ENCODING_INTENT` | `false` | - |
| N3 | `SPECKIT_CONSOLIDATION` | `false` | `SPECKIT_CONSOLIDATION_INTERVAL_HOURS=24` |
| N4 | `SPECKIT_NOVELTY_BOOST` | `false` | `SPECKIT_NOVELTY_ALPHA=0.15`, `SPECKIT_NOVELTY_TAU=12` |

---

## 10. Safe Rollout Order

### Phase 0: Bug Fixes + Foundation (Week 1-2)

**Goal:** Fix correctness issues and establish measurement capability.

| Step | Action | Go/No-Go |
|---|---|---|
| 0.1 | **Fix G1:** Graph channel ID format mismatch | Graph results appear in MMR/causal boost |
| 0.2 | **Fix G2:** Remove double intent weighting | Single intent weight application verified |
| 0.3 | **Fix G3:** Chunk collapse for `includeContent=false` | Parent dedup works in all modes |
| 0.4 | **Wire G4:** Connect `learnFromSelection()` with safeguards | Function callable from search handler |
| 0.5 | **R13 Sprint 1:** Eval DB, logging, pipeline hooks, core metrics | Baseline MRR@5, NDCG@10, Recall@20 captured |

### Phase 1: Low-Risk Scoring (Week 3-4)

**Goal:** Improve ranking quality with fully reversible, flag-gated changes.

| Step | Action | Go/No-Go |
|---|---|---|
| 1.1 | **R1:** MPAB aggregation (dark-run) | MRR@10 improves or stays within 2% |
| 1.2 | **R4:** Degree as 5th channel (dark-run) | No single memory in >60% of results |
| 1.3 | **N4:** Cold-start boost | New memories appear in results within 24h |
| 1.4 | **R16:** Encoding-intent capture | Intent stored on save, congruence boost applied |
| 1.5 | Enable R1 + R4 if dark-run passes | Eval metrics improve >= 3% MRR@10 |

### Phase 2: Query & Feedback (Week 5-6)

**Goal:** Improve retrieval diversity and relevance feedback.

| Step | Action | Go/No-Go |
|---|---|---|
| 2.1 | **R2:** Channel minimum-representation | Top-3 precision within 5% |
| 2.2 | **R11:** learnFromSelection with safeguards | Shadow-log 1 week, verify no noise |
| 2.3 | **R12:** Embedding query expansion | Recall@20 improves >= 5% |
| 2.4 | **R14/N1:** Relative Score Fusion (dark-run) | Kendall tau comparison vs RRF |
| 2.5 | **R15:** Query complexity router | Simple query latency < 30ms |
| 2.6 | **R18:** Embedding cache | Re-index requires 0 API calls on hash match |

### Phase 3: Infrastructure & Pipeline (Week 7-9)

**Goal:** Refactor pipeline, optimize storage, add graph depth.

| Step | Action | Go/No-Go |
|---|---|---|
| 3.1 | Checkpoint: `memory_checkpoint_create("pre-phase3")` | Verified |
| 3.2 | **R6:** 4-stage pipeline refactor (dark-run) | 0 ordering differences on eval corpus |
| 3.3 | **N2:** Graph deepening (centrality, communities) | Graph channel attribution increases |
| 3.4 | **R8:** Memory summaries | Summary column populated |
| 3.5 | **R7:** Anchor-aware chunk thinning | Recall@20 within 10% |
| 3.6 | **R9:** Spec folder pre-filter | Cross-folder queries unaffected |
| 3.7 | **R17:** Fan-effect divisor in co-activation | Hub dominance reduced |

### Phase 4: Advanced (Week 10-12)

**Goal:** Longer-horizon improvements.

| Step | Action | Go/No-Go |
|---|---|---|
| 4.1 | **S1-S5:** Spec-kit logic layer improvements | Template + validation enhancements |
| 4.2 | **N3:** Memory consolidation background process | Auto-created links are useful |
| 4.3 | **R10:** Auto entity extraction | False positive rate < 20% |
| 4.4 | **R13 Sprint 3:** Full reporting + ablation automation | Weekly reports generated |
| 4.5 | Evaluate: Is R5 (quantization) warranted now? | Decision based on scale metrics |

---

## 11. Implementation Roadmap

### 11.1 Effort Estimates

| Priority | Recommendations | Est. Hours | Dependencies |
|---|---|---|---|
| **P0 Bugs** | G1, G2, G3, G4 | 8-12h | None |
| **P0 Foundation** | R13 (Sprint 1) | 23h | None |
| **P0 Core** | R1, R4, N2 | 16-20h | R13 |
| **P1 Scoring** | R2, R11, R12, R14/N1, R15, R16, R18, N4 | 30-40h | R13 |
| **P2 Pipeline** | R6, R7, R8, R9, R17, S2, S3, N3 | 30-40h | P1 |
| **P3 Advanced** | R10, S1, S4, S5, N5 | 20-30h | P2 |
| **DEFERRED** | R3 (SKIP), R5 (scale-dependent) | 0h | Scale trigger |

**Total estimated effort:** ~130-165 hours across 12 weeks

### 11.2 The Evolution Path

```
Generation 2 (current):  Multi-signal fusion (vector + keyword + RRF)
                          ↓
Generation 3 (Phase 1-2): Graph-augmented + feedback-driven
                          ↓
Generation 4 (Phase 3):   Pipeline-structured + complexity-aware
                          ↓
Generation 5 (Phase 4):   Self-improving (consolidation + learned weights)
```

Our system is uniquely positioned to reach Generation 5 because it already has:
- Feedback mechanism (`memory_validate`, `learnFromSelection`)
- Temporal modeling (FSRS, working memory)
- Self-diagnosis (TRM evidence-gap detection)
- Causal reasoning (6-relation-type graph)
- Safety guarantees (constitutional tier)

The path from current state to Generation 5 requires activating what the system already has, not building from scratch.

---

## Appendix A: Confidence Calibration

| Recommendation | Confidence | Evidence Grade | Basis |
|---|---|---|---|
| G1-G4 Bug fixes | HIGH | A (codebase) | Direct code analysis |
| R1 MPAB formula | HIGH | A (calculation) | Formula analysis + N=1 penalty proof |
| R4 Degree channel | HIGH | A (LightRAG grep) | Exhaustive codebase search |
| R13 Eval framework | HIGH | A (codebase + IR lit) | Industry standard metrics |
| N1 Relative Score Fusion | MEDIUM | B (Weaviate benchmarks) | External production system |
| N2 Graph deepening | HIGH | A (orthogonality analysis) | Ensemble learning theory |
| N3 Consolidation | MEDIUM | B (cognitive science) | Cross-domain analogy |
| N4 Cold-start boost | MEDIUM | B (recommendation systems) | Established pattern, novel context |
| R14 RSF mode | MEDIUM | B (Weaviate) | ~6% improvement claim |
| R15 Complexity router | MEDIUM | B (NAACL 2024) | Academic paper |
| R16 Encoding intent | LOW-MEDIUM | C (cognitive theory) | Theoretical, not benchmarked |
| R17 Fan effect | LOW-MEDIUM | C (cognitive theory) | Classical theory |
| R18 Embedding cache | HIGH | A+B (LightRAG + codebase) | Verified pattern |
| N5 Two-model ensemble | LOW-MEDIUM | C (theoretical) | Ensemble theory, no measurement |

## Appendix B: Failure Mode Mitigations

| Failure Mode | Detection | Mitigation | Recovery |
|---|---|---|---|
| Keyword blindness | Term match bonus drowned by RRF | Increase bonus to 0.15-0.20 | Feature flag |
| Popularity bias | access_count feedback loop | Logarithmic saturation cap | Scoring adjustment |
| Cold start | New memories never surface | N4: Novelty boost (12h half-life) | Feature flag |
| Context drift | Old memories match semantically | Periodic validity audit | `deprecated` tier |
| Fusion channel collapse | <2 channels contribute | Health metric + warning trace | Fallback strategy |
| Hub domination | Single memory in >50% results | R4 cap + R17 fan effect | Feature flag |
| Trigger pollution | Learned triggers add noise | Provenance tracking + TTL | Bulk cleanup |
