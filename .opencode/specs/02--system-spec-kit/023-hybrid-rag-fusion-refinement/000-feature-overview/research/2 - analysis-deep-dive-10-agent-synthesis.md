# 141 - Deep-Dive Analysis: 10-Agent Synthesis

> **Supersedes:** `140 - analysis-hybrid-rag-fusion-architecture.md` (original analysis)
> **Date:** 2026-02-26
> **Method:** 10 parallel Opus sub-agents with distinct investigation missions
> **Scope:** spec-kit Memory MCP Server + spec-kit Logic Layer + 3 external systems (zvec, LightRAG, PageIndex)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Cross-System Paradigm Comparison](#2-cross-system-paradigm-comparison)
3. [Internal Architecture Deep-Dive](#3-internal-architecture-deep-dive)
4. [External Pattern Corrections](#4-external-pattern-corrections)
5. [Signal Orthogonality Analysis](#5-signal-orthogonality-analysis)
6. [Emergent Anti-Patterns](#6-emergent-anti-patterns)
7. [Memory-Specific Challenges](#7-memory-specific-challenges)
8. [Architectural Gaps Inventory](#8-architectural-gaps-inventory)
9. [Evidence Quality Summary](#9-evidence-quality-summary)

---

## 1. Executive Summary

This analysis represents a complete re-investigation of the hybrid RAG fusion architecture using 10 specialized Opus sub-agents, each conducting independent deep-dive research into the codebase and external systems. The findings contain **6 significant corrections** to the original analysis:

| # | Original Claim | Corrected Finding | Impact |
|---|---|---|---|
| 1 | LightRAG uses `log(1 + degree)` for ranking | LightRAG uses **raw integer degree as a sort key** for edges only, not entities | R4 formula must change |
| 2 | PageIndex DocScore works for all document sizes | DocScore **penalizes N=1 memories by 29%** via `1/sqrt(N+1)` | R1 requires MPAB replacement formula |
| 3 | Single unified scoring pipeline | **Two parallel, disconnected scoring systems** exist (6-factor legacy + 5-factor REQ-017) | Integration is prerequisite |
| 4 | Chunk collapsing normalizes all results | Chunk collapsing **only runs when `includeContent=true`** | Default path has no parent dedup |
| 5 | INT8 quantization is a quick win | sqlite-vec INT8 is **fundamentally incompatible** with per-record quantization; scale doesn't warrant it | R5 should be deferred |
| 6 | Spec-kit and Memory MCP are cleanly separated | `memory-indexer.ts` has a **compile-time import** into MCP server internals | Boundary is blurred |

**Key architectural insight:** The system already has the scaffolding for Generation 5 retrieval (self-improving, feedback-driven) but hasn't activated what it has. The path forward is **deepening existing signals** rather than adding new ones.

---

## 2. Cross-System Paradigm Comparison

### 2.1 The Two-Dimensional Retrieval Space

Each analyzed system embodies a distinct retrieval philosophy, positioned on two axes: (a) where intelligence resides (index-time vs query-time) and (b) what the primary information carrier is.

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

| Dimension | zvec | LightRAG | PageIndex | spec-kit Memory |
|---|---|---|---|---|
| **Primary carrier** | Vectors (quantized) | Vectors + Knowledge Graph | LLM reasoning over trees | 4-channel composite |
| **Intelligence locus** | Query-time (fast math) | Index-time (LLM extraction) + Query-time (dual retrieval) | Both (tree construction + LLM reasoning) | Both (embedding gen + multi-stage scoring) |
| **What it sacrifices** | Semantic understanding | Latency, cost | Latency, cost | Depth in any single signal |
| **What it optimizes** | Throughput, latency | Relationship-aware recall | Reasoning-based precision | Breadth of signal coverage |
| **Failure mode** | Semantic near-misses | Entity extraction errors cascade | LLM reasoning hallucination | Signal noise from shallow channels |
| **Scale ceiling** | Millions | Thousands | Hundreds | Thousands |
| **Temporal awareness** | None | None | None | FSRS v4 + working memory |
| **Safety model** | None | None | None | Constitutional tier + 6-tier importance |

### 2.2 Emergent Principles

**Principle 1: Intelligence Conservation Law.** Every retrieval system must invest intelligence *somewhere*. The total "intelligence budget" is roughly constant -- what varies is where it is spent. Systems investing heavily at index time (LightRAG, PageIndex) have richer representations but higher indexing costs. Systems investing at query time have faster indexing but more complex retrieval pipelines.

**Principle 2: Representation Determines the Ceiling.** zvec can never discover relationships it didn't encode as vector proximity. LightRAG can never discover entities its extraction missed. Our system can never surface results that none of its four channels detected. The representation created at index time sets an absolute ceiling on retrieval quality.

**Principle 3: Signal Redundancy Risk.** Our system has HIGH correlation between FTS5 and BM25 channels. The graph channel (lowest correlation with other channels) is the least developed. The system would benefit more from deepening graph features than maintaining two overlapping lexical channels.

### 2.3 The Indexing-Retrieval Tradeoff

```
INDEXING COST (per item)
    |
    |  PageIndex ($0.01-0.10)     LightRAG ($0.001-0.01)
    |
    |            spec-kit Memory ($0.0001-0.001)
    |
    |  zvec (~$0, quantization only)
    |________________________________________ RETRIEVAL COST (per query)
       zvec         spec-kit     LightRAG    PageIndex
       (sub-ms)     (50-120ms)   (100-500ms) (1-10s)
```

**Where should agent memory aim?** The optimal point is NOT cheapest retrieval or deepest indexing. It is the point that maximizes **recall at the importance boundary** -- reliably surfacing the single most important memory for a given context, even at the cost of missing less-important items. This differs fundamentally from document retrieval because:

1. **Importance asymmetry:** Missing a constitutional safety rule is catastrophic (not just a minor quality issue)
2. **Session context:** Same query in different sessions may need different results
3. **Tight token budget:** 500-2000 tokens per tool means Recall@3-5 matters far more than Recall@100

---

## 3. Internal Architecture Deep-Dive

### 3.1 Search Pipeline Code Map

**Agent 4** produced a complete function-level map of the search pipeline across 12 files:

```
ENTRY POINTS
├── memory_search handler (memory-search.ts:1526 lines)
│   ├── postSearchPipeline() [lines 790-1043] — orchestrates all post-search processing
│   └── collapseAndReassembleChunkResults() [lines 303-462] — chunk→parent dedup
│
├── memory_context handler (memory-context.ts:616 lines)
│   └── Routes to memory_search with mode-specific config
│
SEARCH CORE
├── hybridSearchEnhanced() [hybrid-search.ts:411-618]
│   ├── Channel 1: Vector search via sqlite-vec
│   ├── Channel 2: FTS5 full-text search
│   ├── Channel 3: BM25 index search
│   └── Channel 4: Graph search via causal_edges JOIN
│
├── fuseResultsMulti() [rrf-fusion.ts:49-145]
│   └── RRF with K=60, CONVERGENCE_BONUS=0.10
│
├── hybridAdaptiveFuse() [adaptive-fusion.ts:289-365]
│   └── Intent-aware weight profiles for 7 intent types
│
POST-SEARCH PIPELINE
├── Cross-encoder reranking [cross-encoder.ts:134 lines]
├── MMR diversity [mmr-reranker.ts:134 lines, lambda=0.5-0.85]
├── Causal boost [causal-boost.ts:301 lines, 2-hop BFS]
├── Composite scoring [composite-scoring.ts:593 lines]
├── Co-activation spreading [co-activation.ts]
├── Evidence gap detection [evidence-gap-detector.ts]
└── State filtering + session dedup
```

**Critical findings:**

1. **`learnFromSelection()` has NO caller** -- The function exists at `vector-index-impl.ts:2872` but is never invoked anywhere in the codebase. It is dead code.

2. **Double intent weighting** -- Intent weights are applied twice: once in `hybridAdaptiveFuse()` (channel-level weights) and again in `postSearchPipeline()` (result-level scoring). This amplifies intent bias.

3. **Graph channel ID format mismatch** -- Graph search produces IDs formatted as `mem:${edgeId}` (strings), while all other channels produce numeric IDs. This causes MMR and causal boost to **skip graph results** silently because the ID lookup fails.

4. **Chunk collapse at END of pipeline** -- `collapseAndReassembleChunkResults()` runs after ALL scoring stages. This means chunk-level scores from vector/FTS/BM25 are computed and fused, only to be collapsed later. Wasted computation AND potential information loss.

### 3.2 Dual Scoring Systems

**Agent 5** discovered two parallel, disconnected scoring systems:

**System A: Hybrid Search RRF (real-time, per-query)**
```
4 channels → RRF fusion (K=60) → convergence bonus → adaptive weights → result set
```
Located in: `rrf-fusion.ts`, `adaptive-fusion.ts`, `hybrid-search.ts`

**System B: Composite Factor-Based (batch-style, per-memory)**
```
6 factors → weighted sum → composite score
  - temporalDecay (FSRS v4): 30%
  - usageFrequency (access count log): 20%
  - importance (tier-based): 20%
  - patternMatch (trigger similarity): 15%
  - contextRelevance (query similarity): 10%
  - citationCount: 5%
```
Located in: `composite-scoring.ts`

**These two systems are NOT integrated.** System A produces one ranking, System B produces another. The `postSearchPipeline()` function applies System B scores as post-hoc adjustments to System A results, but the interaction is additive and poorly calibrated.

**Unused signals inventory:**
| Signal | Code Location | Status |
|---|---|---|
| `quality_score` | `memory_index` table | Stored but never used in ranking |
| `confidence` | `confidence-tracker.ts` | Updated by `memory_validate` but not used in search scoring |
| `validation_count` | `confidence-tracker.ts` | Incremented but never read in search path |
| `computeStructuralFreshness()` | `composite-scoring.ts` | Function exists but is unreachable |
| `computeGraphCentrality()` | `composite-scoring.ts` | Function exists but is unreachable |
| `learnFromSelection()` | `vector-index-impl.ts:2872` | Function exists but has zero callers |

**Intent-aware weight profiles** (7 types):
| Intent | Semantic | Keyword | Recency | Graph |
|---|---|---|---|---|
| `add_feature` | 0.35 | 0.25 | 0.25 | 0.15 |
| `fix_bug` | 0.30 | 0.30 | 0.25 | 0.15 |
| `refactor` | 0.35 | 0.20 | 0.20 | 0.25 |
| `security_audit` | 0.25 | 0.30 | 0.15 | 0.30 |
| `understand` | 0.40 | 0.25 | 0.15 | 0.20 |
| `find_spec` | 0.30 | 0.35 | 0.20 | 0.15 |
| `find_decision` | 0.25 | 0.20 | 0.15 | 0.40 |

**Co-activation boost** is nearly invisible at `0.1x` multiplier with `maxHops: 2` and `decayPerHop: 0.5`. Effective boost at hop 2 = `0.1 * 0.5 = 0.05` (5% boost).

**Dead configuration:** `search-weights.json` exists but the values are not read by any search code path.

### 3.3 Chunk Lifecycle & Data Model

**Agent 6** investigated how chunks and parent memories coexist:

**Key finding: Chunks and parents share the SAME `memory_index` table.** Differentiation is via:
- `parent_id`: NULL for parent records, non-NULL for chunks
- `chunk_index`: NULL for parents, 0-N for chunks
- Parent records have `embedding_status = 'partial'` (NO embedding of their own)

**Chunk collapsing behavior:**

| Condition | Behavior |
|---|---|
| `includeContent=true` | `collapseAndReassembleChunkResults()` runs, merges chunk scores → parent |
| `includeContent=false` (default) | Raw chunk rows returned WITHOUT parent deduplication |
| `includeChunks=false` | Only parent rows (no chunks) returned via SQL filter |

**Critical data losses during collapsing:**
1. Per-chunk source attribution is lost (which channel found which chunk)
2. Chunk-level similarity scores are averaged, losing outlier information
3. Original chunk ordering within a document is not preserved in the collapsed result
4. The `max()` of chunk scores would be more appropriate than `avg()` for ranking (a document with one highly relevant chunk is more useful than a document with uniformly mediocre chunks)

**Anchor-aware chunking thresholds:**
```typescript
const CHUNKING_THRESHOLD = 50_000;  // chars before chunking triggers
const TARGET_CHUNK_CHARS = 4_000;   // ideal chunk size
const MAX_CHUNK_CHARS = 12_000;     // hard upper limit
```

### 3.4 Architectural Boundary: Spec-Kit vs Memory MCP

**Agent 10** mapped the boundary between the two subsystems:

```
+=====================================================================+
|                     SPEC-KIT LOGIC LAYER                            |
|   (scripts/, templates/, references/, SKILL.md)                     |
|   Owns: spec folder creation, template engine, validation,         |
|         session data extraction (12 extractors), topic extraction,  |
|         quality scoring, template rendering, file writing           |
+=====================================================================+
                                |
              BOUNDARY INTERFACE (compile-time import)
              memory-indexer.ts → @spec-kit/mcp-server/lib/search/vector-index
                                |
+=====================================================================+
|                     MEMORY MCP SERVER                               |
|   (mcp_server/ — @spec-kit/mcp-server v1.7.2)                     |
|   Owns: vector storage, embedding gen, 4-channel hybrid search,    |
|         RRF fusion, chunking, cognitive features (FSRS, attention,  |
|         co-activation, working memory), importance tiers, causal    |
|         graph, session dedup, checkpoints, mutation ledger, MCP     |
|         protocol (25 tools, 7 layers), telemetry                   |
+=====================================================================+
```

**Primary coupling point:** `memory-indexer.ts` directly imports `vectorIndex.indexMemory()` from the MCP server's internal module. This is a compile-time import, NOT via MCP protocol. They also share the same SQLite database file.

**Improvement classification of the 13 original recommendations:**

| Type | Count | Recommendations |
|---|---|---|
| Pure MCP server | 8 | R3, R4, R6, R7, R8, R9, R12, R13 |
| Cross-boundary | 4 | R1, R2, R5, R10, R11 |
| Pure spec-kit logic | 1 | Template anchor optimization |

---

## 4. External Pattern Corrections

### 4.1 LightRAG: Degree Ranking Debunked

**Agent 2** conducted an exhaustive grep of the LightRAG codebase.

**Original claim:** LightRAG uses `log(1 + degree)` as a multiplicative boost in fusion scoring.

**Corrected finding:** LightRAG does NOT use `log(1 + degree)` anywhere. This formula appears in the **Microsoft GraphRAG** paper, not LightRAG. Exhaustive search confirmed:

- Degree is used ONLY as a **sort key for edge ranking** (not entity ranking)
- It is a **secondary signal** for token budget allocation, not a fusion signal
- The actual code sorts edges by `degree_int DESC` as a simple integer sort
- Entity ranking does NOT use degree at all

**Impact on recommendations:**
- R4 (degree-based ranking boost) should add degree as a **5th RRF channel** rather than a multiplicative boost
- The boost formula should use typed-weighted degree computation for the 6 causal edge types:

```
typed_degree(node) = SUM(weight_t * count_t for each edge_type t)

Proposed weights per edge type:
  caused       = 1.0
  derived_from = 0.9
  enabled      = 0.8
  contradicts  = 0.7
  supersedes   = 0.6
  supports     = 0.5
```

### 4.2 PageIndex: DocScore N=1 Penalty

**Agent 3** analyzed PageIndex's DocScore aggregation formula in detail.

**Original formula:** `DocScore = (1/sqrt(N+1)) * SUM(ChunkScore_i)`

**Problem for our system:** For a single-chunk memory (N=1):
```
DocScore = 1/sqrt(2) * ChunkScore = 0.707 * ChunkScore
```
This is a **29% penalty** on unchunked memories. Since ~90% of memories in our system are unchunked, this would cause systematic ranking degradation.

**Proposed replacement -- MPAB (Max-Plus-Attenuated-Bonus):**
```
MPAB(scores) = S_max + beta * SUM(S_remaining) / sqrt(N)

where:
  S_max = max(chunk_scores)
  S_remaining = all chunk scores except the max
  beta = 0.3 (attenuation factor)
  N = number of chunks
```

**Properties of MPAB:**
- N=1: `MPAB = S_max` (no penalty, single-chunk memories scored at their raw value)
- N=2: `MPAB = S_max + 0.3 * S_2 / sqrt(2)` (modest bonus for multi-chunk agreement)
- N=10: `MPAB = S_max + 0.3 * SUM(9) / sqrt(10)` (diminishing returns on many chunks)

**Placement in pipeline:** Aggregation should happen AFTER RRF fusion but BEFORE state filtering. This ensures chunk-level scores from all channels are fused before aggregation.

### 4.3 zvec: Quantization Assessment

**Agent 1** conducted a thorough feasibility analysis of porting zvec's INT8 quantization.

**Primary recommendation: Do NOT implement INT8 quantization yet.**

**Rationale:**

1. **Scale does not warrant it.** The system has hundreds to low thousands of memories. sqlite-vec brute-force FP32 cosine over 1,000 vectors of 768 dimensions completes in under 5ms.

2. **sqlite-vec INT8 is fundamentally incompatible with per-record quantization.** sqlite-vec's built-in `vec_quantize_i8` uses a FIXED range [-1.0, 1.0] with uniform scaling. For pre-normalized embeddings (L2 norm = 1), individual dimensions typically range from -0.3 to 0.3, meaning **most of the INT8 range is wasted**.

3. **Accuracy tradeoff is non-trivial at 768 dimensions.** HuggingFace benchmarks show 94.68% recall retention for 768-dim INT8 (e5-base-v2). For a memory system where retrieval accuracy directly impacts agent behavior, losing 5% of recall is significant.

4. **Storage savings are irrelevant at current scale.** 1,000 memories * 3,072 bytes = ~3MB FP32. Quantized: ~788KB. The 2.2MB savings is negligible.

**When to reconsider:**
- Memory count exceeds 10,000+ vectors
- Search latency exceeds 50ms
- Embedding dimension increases to 1536+
- Offline/edge deployment with tight memory constraints

**If/when implementing, prefer Option A:** Custom quantized column with JS-side distance computation. Full control over per-record quantization, TypeScript Int8Array arithmetic is performant enough for <50K vectors, uses algebraic shortcut (integer dot product + metadata correction).

**Per-record INT8 algorithm (zvec pattern):**
```
Step 1: Compute L2 norm, normalize vector
Step 2: Find per-record min/max of normalized values
Step 3: scale = 254.0 / (max - min), bias = -min * scale - 127.0
Step 4: q[i] = clamp(round(v[i] * scale + bias), -127, 127)
Step 5: Store metadata: [invScale, offset, qsum, qsqsum, norm] (20 bytes)
```

**Storage comparison:**
| Dimension | FP32 | INT8 + metadata | Reduction |
|---|---|---|---|
| 768 | 3,072 bytes | 788 bytes | 3.9x |
| 1024 | 4,096 bytes | 1,044 bytes | 3.9x |
| 1536 | 6,144 bytes | 1,556 bytes | 3.9x |

---

## 5. Signal Orthogonality Analysis

### 5.1 Current Signal Inventory

The system has approximately **15+ distinct signals** contributing to final ranking:

| Category | Signals | Count |
|---|---|---|
| Search channels | vector, FTS5, BM25, graph | 4 |
| Scoring factors | temporal, usage, importance, pattern, citation, context | 6 |
| Importance tiers | constitutional through deprecated | 6 levels |
| Cognitive | FSRS decay, working memory, session boost, co-activation | 4 |
| Quality | MMR diversity, cross-encoder reranking, evidence-gap detection | 3 |

For comparison: zvec has 1 signal, LightRAG has ~4, PageIndex has ~3.

### 5.2 Signal Correlation Matrix

| Signal Pair | Correlation | Rationale |
|---|---|---|
| Vector + FTS5 | MEDIUM | Both measure query-document similarity; FTS is lexical, vector is semantic |
| Vector + BM25 | MEDIUM-HIGH | BM25 is also term-relevance; overlaps substantially with FTS5 |
| Vector + Graph | **LOW** | Graph connectivity is structural, not content-based |
| FTS5 + BM25 | **HIGH** | Both are lexical matching; FTS5 is effectively a superset |
| Temporal + Importance | LOW | Orthogonal dimensions (when vs what-tier) |
| Usage + Temporal | MEDIUM | Recently-used items tend to be recently-created |
| Working Memory + Temporal | MEDIUM | Session context correlates with recency |

### 5.3 Key Insight: Graph is Most Orthogonal, Least Developed

The graph channel has the **lowest correlation** with all other channels (it measures structural connectivity, not content similarity) but is the **least developed** feature:

- Only BFS traversal (no degree ranking, no community detection, no betweenness centrality)
- Co-activation boost is nearly invisible (0.1x multiplier)
- `computeGraphCentrality()` exists but is unreachable
- Graph channel IDs use string format mismatched with numeric IDs elsewhere

**From ensemble learning theory:** An ensemble of moderately accurate but diverse classifiers outperforms a single highly accurate classifier (Dietterich, 2000). The graph channel provides the most diversity value but contributes the least to current results.

---

## 6. Emergent Anti-Patterns

### 6.1 Anti-Patterns Found Across ALL Four Systems

**Anti-Pattern 1: Static Fusion Weights**
All four systems use fixed or manually-tuned parameters. None learn optimal fusion weights from user feedback. This is a solved problem in ML (LambdaMART, RankNet), but all lack the feedback infrastructure.

**Anti-Pattern 2: Embedding Model Agnosticism**
All vector-using systems treat the embedding model as a black box. None measure embedding quality, fine-tune on their corpus, or detect distribution collapse. Our system supports multiple providers but uses only one at a time.

**Anti-Pattern 3: No Calibration or Self-Diagnosis**
None can answer: "How well am I performing right now?" No online quality estimation, distribution monitoring, channel health monitoring, or confidence calibration.

**Anti-Pattern 4: Cold-Start Blindness**
A freshly indexed memory has zero usage history, zero causal edges, zero validation feedback, zero working memory presence. New memories are systematically disadvantaged despite potentially being the most relevant.

**Anti-Pattern 5: No Negative Feedback Loop**
All systems learn from positive signals but none learn from negative signals. Our `memory_validate(wasUseful: false)` decreases confidence, but the effect on retrieval ranking is indirect and weak.

### 6.2 Anti-Patterns Specific to Our System

| Anti-Pattern | Evidence | Location |
|---|---|---|
| Double intent weighting | Intent applied in adaptive fusion AND post-search pipeline | `adaptive-fusion.ts` + `memory-search.ts` |
| Dead code accumulation | 3 unused functions, 1 unused config file | `vector-index-impl.ts`, `composite-scoring.ts`, `search-weights.json` |
| Score system fragmentation | Two parallel scoring systems producing independent rankings | `rrf-fusion.ts` vs `composite-scoring.ts` |
| Conditional chunk collapse | Default search path returns raw chunks without dedup | `memory-search.ts:303-462` |
| Graph channel isolation | ID format mismatch silently excludes graph results from post-processing | `graph-search-fn.ts` vs `mmr-reranker.ts` |

---

## 7. Memory-Specific Challenges

These requirements are unique to agent memory and NOT addressed by any external system:

### 7.1 Importance Asymmetry (Safety-Critical)

Document retrieval treats all results equally. In agent memory, failing to surface a constitutional safety rule is **catastrophically worse** than missing a normal memory. The system must guarantee constitutional memories surface with 100% reliability when relevant.

Current mitigation: Constitutional tier always included in results. This is a genuine architectural advantage that should be deepened, not diluted.

### 7.2 Three-Memory-System Model

From cognitive science, biological memory has three systems that our implementation maps to:

| System | Biological Analog | Implementation | Gap |
|---|---|---|---|
| Working Memory | Phonological loop | Working memory with attention decay | GOOD -- Miller's Law, event-based decay |
| Episodic Memory | Hippocampal encoding | FSRS temporal decay | PARTIAL -- models forgetting but not episodic associations |
| Semantic Memory | Neocortical consolidation | Importance tiers, constitutional | PARTIAL -- tiers model importance but not consolidation |

**Missing mechanism: Memory Consolidation.** In neuroscience, sleep-dependent consolidation reorganizes memories (Diekelmann & Born, 2010). A background "consolidation" process could:
1. Auto-create causal links between semantically similar unlinked memories
2. Merge near-duplicate memories
3. Strengthen edges traversed during retrieval (Hebbian: "neurons that fire together wire together")
4. Detect and flag contradiction clusters

### 7.3 Task-Context Sensitivity

Document retrieval operates query-by-query. Agent memory operates in a **task context** where the sequence of queries matters. If the agent retrieved "database schema" and now asks about "migration," the system should boost database-related migration memories.

Current state: Working memory and session dedup partially address this, but the connection is weak. Session state does not inform retrieval ranking beyond dedup and a session-boost flag.

### 7.4 Write-Read Temporal Coupling

Agents may save a memory and immediately need to retrieve it. This creates a consistency requirement that prevents adopting async indexing patterns (like LightRAG's async LLM extraction or PageIndex's offline tree construction).

### 7.5 Contradiction Management

When an agent memory system stores contradictory memories ("use approach A" vs "do NOT use approach A"), it must either surface both with explicit contradiction flagging, surface only the most recent, or surface only the most validated. Our `contradicts` causal edge type and prediction-error-gate partially address this. None of the external systems have ANY mechanism for this.

---

## 8. Architectural Gaps Inventory

Consolidated from all 10 agents:

### 8.1 Critical Gaps (Affect Correctness)

| # | Gap | Agent | Location | Impact |
|---|---|---|---|---|
| G1 | Graph channel ID format mismatch | 4 | `graph-search-fn.ts` | Graph results silently excluded from MMR/causal boost |
| G2 | Double intent weighting | 4 | `adaptive-fusion.ts` + `memory-search.ts` | Intent bias amplified, distorts rankings |
| G3 | Chunk collapse conditional on `includeContent` | 6 | `memory-search.ts:303-462` | Default path returns duplicate chunk rows |
| G4 | `learnFromSelection()` has zero callers | 4 | `vector-index-impl.ts:2872` | Feedback loop is completely disconnected |

### 8.2 Significant Gaps (Affect Quality)

| # | Gap | Agent | Location | Impact |
|---|---|---|---|---|
| G5 | Two parallel scoring systems not integrated | 5 | `rrf-fusion.ts` vs `composite-scoring.ts` | Inconsistent ranking signals |
| G6 | Unused quality signals (quality_score, confidence, validation_count) | 5 | `memory_index` table, `confidence-tracker.ts` | Available data not used in ranking |
| G7 | Co-activation nearly invisible (0.1x) | 5 | `co-activation.ts` | Graph neighborhood signals too weak |
| G8 | No evaluation metrics whatsoever | 9 | N/A | Cannot measure improvement |
| G9 | Dead code: `computeStructuralFreshness()`, `computeGraphCentrality()` | 5 | `composite-scoring.ts` | Wasted potential |
| G10 | Dead config: `search-weights.json` | 5 | config directory | Misleading configuration |

### 8.3 Architectural Gaps (Affect Maintainability)

| # | Gap | Agent | Location | Impact |
|---|---|---|---|---|
| G11 | Compile-time coupling between spec-kit scripts and MCP server internals | 10 | `memory-indexer.ts` | Prevents independent versioning |
| G12 | No formal interface contract between spec-kit and MCP server | 10 | Boundary layer | Tight coupling, fragile |
| G13 | Spec folder hierarchy stored as flat string | 10 | `memory_index.spec_folder` | Cannot do tree-based retrieval |
| G14 | Validation results not fed back to MCP server | 10 | `validate.sh` | Quality signal lost |

---

## 9. Evidence Quality Summary

| Finding | Grade | Source | Agent |
|---|---|---|---|
| LightRAG degree ranking correction | A | Exhaustive codebase grep | 2 |
| PageIndex DocScore N=1 penalty | A | Formula analysis + calculation | 3 |
| Internal pipeline code map | A | Direct codebase analysis | 4 |
| Dual scoring systems | A | Direct codebase analysis | 5 |
| Chunk lifecycle conditional collapse | A | Direct codebase analysis | 6 |
| zvec quantization formulas | B | GitHub source code | 1 |
| sqlite-vec INT8 compatibility | A | API docs + source code | 1 |
| Cross-system paradigm comparison | B | Architecture synthesis | 7 |
| Signal orthogonality estimates | B | Theoretical + correlation analysis | 7 |
| Intelligence Conservation Law | B | Cross-system comparison | 7 |
| Cognitive science memory model | B | Literature references | 7 |
| Architectural boundary map | A | Direct codebase analysis | 10 |
| INT8 accuracy at 768-dim | B | HuggingFace benchmarks | 1 |
| Risk assessment for 13 recommendations | A | Direct codebase + test inventory | 8 |
| Evaluation framework design | A | Direct codebase + IR literature | 9 |

**Evidence grading scale:**
- **A**: Direct codebase investigation with verified source references
- **B**: External documentation, GitHub sources, or theoretical analysis with cross-references
- **C**: Synthesis or inference without primary source verification

---

## Appendix: Key File References

| File | Lines | Purpose |
|---|---|---|
| `handlers/memory-search.ts` | 1526 | Main search handler, chunk collapse, postSearchPipeline |
| `handlers/memory-context.ts` | 616 | L1 orchestration wrapper |
| `lib/search/hybrid-search.ts` | 688 | 4-channel search engine |
| `lib/search/rrf-fusion.ts` | 362 | RRF with K=60 |
| `lib/search/adaptive-fusion.ts` | 377 | Intent-aware weight profiles |
| `lib/search/vector-index-impl.ts` | 3922+ | Core vector implementation, learnFromSelection |
| `lib/scoring/composite-scoring.ts` | 593 | Dual 5-factor/6-factor scoring |
| `lib/search/mmr-reranker.ts` | 134 | MMR diversity |
| `lib/storage/causal-edges.ts` | 471 | Causal graph with 6 edge types |
| `lib/search/causal-boost.ts` | 301 | 2-hop graph walk |
| `lib/search/graph-search-fn.ts` | 200 | Graph search channel |
| `lib/search/query-expander.ts` | 89 | Domain vocabulary map |
| `lib/chunking/anchor-chunker.ts` | 253 | Anchor-aware chunking |
| `lib/telemetry/retrieval-telemetry.ts` | - | Latency + quality proxy |
| `lib/cache/cognitive/rollout-policy.ts` | 59 | Feature flag infrastructure |
| `lib/search/search-flags.ts` | 38 | Search feature gates |
| `lib/scoring/confidence-tracker.ts` | - | Validation feedback tracking |
| `scripts/core/memory-indexer.ts` | - | Spec-kit → MCP boundary crossing |
| `scripts/core/topic-extractor.ts` | - | Weighted bigram topic extraction |
