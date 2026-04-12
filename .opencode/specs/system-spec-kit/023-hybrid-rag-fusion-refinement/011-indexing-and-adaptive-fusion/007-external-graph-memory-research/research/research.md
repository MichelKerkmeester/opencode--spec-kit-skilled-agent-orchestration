---
title: 'Research: External Graph Memory Systems Survey'
description: 'Comparative analysis of 7 external graph memory systems with ranked improvement backlog for Spec Kit Memory'
trigger_phrases:
  - 'external graph memory research'
  - 'graph memory survey results'
  - 'graph improvement backlog'
importance_tier: 'critical'
contextType: 'research'
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

## 1. Metadata

- Research ID: RESEARCH-007
- Spec path: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/`
- Status: Complete
- Date: 2026-04-01
- Researchers: GPT 5.4 via Copilot CLI

## 2. Executive Summary + Ranked Improvement Backlog

This survey compares seven external graph-memory systems—Zep, Mem0, GraphRAG, LightRAG, Memoripy, Cognee, and Graphiti—against Spec Kit Memory’s current state. Across the systems, the strongest recurring pattern is not “build a bigger graph,” but “turn graph structure into searchable, explainable, auto-utilized retrieval artifacts.” The external systems differ in sophistication, but they converge on several practical lessons: searchable graph text surfaces, hybrid retrieval, query-to-graph bridging, summaries/community abstractions, stronger provenance, and better user-facing explanations.

The main diagnosis is that Spec Kit Memory already appears structurally healthy, but its graph is under-productized at retrieval time. Several current flags and features already cover pieces of the needed surface—graph concept routing, causal boost, community detection, response trace, explainability, summaries, query surrogates, query reformulation, adaptive fusion, session state—but the external comparison suggests the next step is tighter integration and more visible graph-native behavior rather than isolated graph signals.

### Ranked Improvement Backlog

Dependency-ordered rather than pure impact ordering: build the graph retrieval artifacts first, then route queries through them, then surface the evidence cleanly, then maintain freshness and reinforcement.

| Rank | Phase | Improvement | Impact | Complexity | Why ranked here |
|---|---|---|---|---|---|
| 1 | Phase A (Build) | Community detection + summaries | H | M | GraphRAG and Zep show that higher-order summaries are the bridge from dense graph structure to concept-addressable retrieval. |
| 2 | Phase A (Build) | Searchable node/edge summaries | H | M | Zep, LightRAG, and Cognee all benefit when graph objects have natural-language retrieval surfaces instead of only raw memory text or relation labels. |
| 3 | Phase A (Build) | Entity dedup / alias consolidation | H | M | Mem0, Cognee, and Graphiti all suggest recall degrades quickly when equivalent concepts fragment across nodes and aliases. |
| 4 | Phase B (Retrieve) | Dual-level retrieval (local + thematic) | H | M | LightRAG and GraphRAG both show that underspecified queries need both local evidence access and higher-level thematic access. |
| 5 | Phase B (Retrieve) | Query expansion + fallback | H | M | Mem0, Cognee, and Memoripy all highlight the need to map user wording to graph anchors before declaring a miss. |
| 6 | Phase B (Retrieve) | Zero-result recovery for weak/empty searches | H | M | The known miss on `memory_search('Semantic Search')` indicates the current pipeline still needs a graph-assisted rescue path that can fire when primary retrieval returns nothing useful. |
| 7 | Phase C (Surface) | Provenance-bearing answers | H | M | Zep, Graphiti, and GraphRAG all show that graph outputs become trustworthy when the answer carries source lineage instead of only conclusions. |
| 8 | Phase C (Surface) | Graph evidence in payloads | H | L | Spec Kit already has response traces and explainability surfaces, so returning matched nodes, edges, and paths is relatively cheap and high value. |
| 9 | Phase C (Surface) | Confidence surfaces | M | L | Once graph rescue participates in retrieval, users and operators need calibrated visibility into confidence and fallback mode to trust or debug results. |
| 10 | Phase D (Maintain) | Temporal edges / currentness semantics | M | M | Graphiti and Zep show that changing truths and term drift need explicit currentness handling or stale graph facts keep competing in retrieval. |
| 11 | Phase D (Maintain) | Contradiction detection / invalidation | M | M | Graphiti and Mem0 both show that contradiction handling keeps historical state without letting outdated relations pollute active retrieval. |
| 12 | Phase D (Maintain) | Reinforcement from access and failure feedback | M | L | Cognee, Mem0, and Memoripy all point toward iterative strengthening of aliases, summaries, and neighborhoods that repeatedly resolve weak queries. |

### Synthesis Notes

- **Best external pattern for broad thematic questions:** GraphRAG-style community summaries + global mode.
- **Best external pattern for concept mismatch:** Mem0/Cognee-style query normalization and graph anchoring.
- **Best external pattern for low-cost operationalization:** LightRAG-style lightweight dual-level retrieval and incremental graph retrieval artifacts.
- **Best external pattern for provenance and changing truth:** Zep/Graphiti temporal + episode-backed design.
- **Best caution:** Do not leave graph as a non-ranking side channel if the problem is already graph underutilization.

## 3. Internal Baseline

Our system: 3,854 causal edges, 79.92% coverage, dominant supports (2,578) and caused (1,265), avg strength 0.76, 6 orphaned edges, memory_search('Semantic Search') returns 0 results

## 4. System Reviews

### 4.1 Zep


#### Construction Strategy

Zep’s graph memory is built on **Graphiti**, which models memory as a three-layer temporal graph: **episodes** (raw ingested events), **semantic entities/facts** (resolved nodes and edges derived from those events), and **communities** (higher-level clusters with summaries). That layering matters: Zep does not just embed raw text; it keeps the source event, extracts structured meaning from it, and then builds cluster-level abstractions above it. ([paper](https://arxiv.org/html/2501.13956), [Graphiti overview](https://help.getzep.com/graphiti/getting-started/overview), [Graph overview](https://help.getzep.com/graph-overview))

**Episode-based ingestion** is first-class. In Graphiti/Zep, an episode is a single ingestion event and is itself a node. Supported episode types are `text`, `message`, and `json`, and extracted nodes are linked back to the episode through `MENTIONS` edges. The docs explicitly position episodes as the provenance anchor and as the mechanism that enables point-in-time querying. Bulk ingestion exists (`add_episode_bulk`), but the docs note that bulk mode is mainly for empty graphs or cases where edge invalidation is not needed. ([Adding Episodes](https://help.getzep.com/graphiti/core-concepts/adding-episodes), [paper](https://arxiv.org/html/2501.13956))

**Automatic entity extraction** is more than a single-pass NER step. In the paper, Zep says entity extraction is done using the current message plus the last `n=4` messages for context; the speaker is automatically extracted as an entity; a reflection-style pass is used to improve coverage and reduce hallucinations; and an entity summary is generated to support later resolution and retrieval. After extraction, entity names are embedded (the paper says 1024-dimensional embeddings), candidate matches are gathered through both vector similarity and full-text search, and an LLM performs entity resolution/merge decisions before the graph is updated with fixed Cypher templates rather than LLM-generated queries. ([paper](https://arxiv.org/html/2501.13956))
