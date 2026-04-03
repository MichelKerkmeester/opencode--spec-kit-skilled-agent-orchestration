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
- Spec path: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/`
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

**Relation inference** is similarly explicit. Facts are extracted as entity-to-entity relationships, embedded, and then deduplicated against candidate edges between the **same entity pair**. That constraint is important: it prevents semantically similar but structurally unrelated facts from collapsing together. The paper also notes that the same fact can be extracted multiple times across different entities to approximate hyper-edge behavior for multi-entity facts. ([paper](https://arxiv.org/html/2501.13956))

**Temporal edges** are a core differentiator, not a side feature. Zep uses a bi-temporal model: transaction-time fields for when the system created/expired a fact, and validity-time fields for when the fact became true or ceased to be true in the world. The ingestion `reference_time` is used to resolve relative dates like “two weeks ago” or “next Thursday.” When a new fact contradicts an overlapping older one, Graphiti invalidates the old edge by setting its `invalid_at` to the newer fact’s `valid_at`, preserving history instead of overwriting it. ([paper](https://arxiv.org/html/2501.13956), [Adding Episodes](https://help.getzep.com/graphiti/core-concepts/adding-episodes), [Graphiti overview](https://help.getzep.com/graphiti/getting-started/overview))

**Community construction** is also documented concretely. Zep uses a **label propagation** approach rather than Leiden for community detection, specifically because label propagation is easier to extend incrementally as new data arrives. New nodes inherit the plurality community of neighboring nodes, summaries are updated, and the system periodically refreshes communities to correct drift from the dynamic heuristic. Community names are generated from summaries and embedded for later search. ([paper](https://arxiv.org/html/2501.13956))

#### Traversal Strategy

Zep’s retrieval pipeline is explicitly split into **search → rerank → construct**. Search finds candidate semantic edges, entity nodes, and community nodes; reranking improves precision; construction turns the selected graph artifacts into a prompt-ready context string containing facts with date ranges and entity/community summaries. This is a more structured retrieval pipeline than “embed query, pull nearest chunks.” ([paper](https://arxiv.org/html/2501.13956))

At search time, Zep combines **three retrieval modes**:

- **cosine semantic search**
- **BM25 full-text search**
- **breadth-first search (BFS)** over the graph

The paper says these operate over different textual fields depending on graph object type: `fact` for edges, entity `name` for nodes, and community `name` for communities. BFS is used to expand around initial hits and can also accept seed nodes directly, including recent episodes. ([paper](https://arxiv.org/html/2501.13956))

That means Zep’s traversal is not pure graph walking and not pure vector retrieval; it is **hybrid retrieval with graph expansion**. Graphiti’s public docs simplify this as “semantic + BM25” for the default `search()` call, but the lower-level `_search()` exposes recipes over **edges, nodes, and communities** with multiple reranking strategies. ([Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching), [Quick Start](https://help.getzep.com/graphiti/getting-started/quick-start), [paper](https://arxiv.org/html/2501.13956))

On **community detection/querying**, the important part is that communities are not just offline analytics. They are retrieval objects. The paper says community nodes store summaries, and community names are embedded for cosine search. Graphiti’s `_search()` recipes also include community-focused search configs (`COMMUNITY_HYBRID_SEARCH_*`). ([paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

On **path scoring**, I did **not** find evidence of a sophisticated learned path-ranking algorithm in the official docs or paper. The closest documented mechanisms are:

- BFS neighborhood expansion
- **node-distance reranking** from a focal/center node
- **episode-mentions reranking** (promoting frequently mentioned entities/facts)
- **RRF**, **MMR**, and **cross-encoder** reranking

So the retrieval logic is graph-aware, but it is better described as **candidate expansion + reranking**, not as full path-optimization over weighted multi-hop explanations. ([paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching), [SDK graph search](https://help.getzep.com/sdk-reference/graph/search))

A subtle but useful design pattern is the **center-node / focal-node reranker**. Graphiti’s docs show a broad hybrid retrieval followed by reranking based on proximity to a chosen node. In the Jane example, this pulls in “Jane is allergic to wool” for a shoe question because the graph knows that Jane-centered facts are likely relevant. That is a transferable pattern for any causal memory graph. ([Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching), [Quick Start](https://help.getzep.com/graphiti/getting-started/quick-start))

#### UX Transparency

Zep is somewhat mixed here.

On one hand, the docs explicitly say developers **do not need to interact directly with Graphiti or understand its underlying implementation**. That tells you the managed product is designed to abstract graph mechanics away. For ordinary app developers, this is a convenience feature; for researchers, it means some graph internals are intentionally hidden. ([Graph overview](https://help.getzep.com/graph-overview), [Understanding the Graph](https://help.getzep.com/v2/understanding-the-graph))

On the other hand, the API is reasonably transparent at the object level. The `/api/v2/graph/search` response returns:

- `edges`, `nodes`, and `episodes`
- `score` and `relevance`
- temporal fields like `valid_at`, `invalid_at`, `expired_at`
- provenance hints like `episodes` on an edge
- `source_node_uuid` and `target_node_uuid`

That is enough for an application to expose “why this memory came back” if it wants to. ([SDK graph search](https://help.getzep.com/sdk-reference/graph/search))

For **provenance tracking**, the story is stronger. Episodes are raw source records; semantic artifacts trace back to episodes; and the paper says Graphiti maintains bidirectional indices between episodes and derived semantic edges/entities. The search API also returns edge-linked episode IDs, and the read APIs let you fetch edges, nodes, and episodes directly by UUID or by user/group graph. ([paper](https://arxiv.org/html/2501.13956), [Adding Episodes](https://help.getzep.com/graphiti/core-concepts/adding-episodes), [Reading the Graph](https://help.getzep.com/v2/reading-data-from-the-graph), [SDK graph search](https://help.getzep.com/sdk-reference/graph/search))

For **edge visibility**, yes: edges are first-class in the API. But for **community visibility**, the managed Zep API appears less transparent than Graphiti OSS. The managed search response schema exposes edges/nodes/episodes, while Graphiti’s lower-level `_search()` docs clearly discuss communities and community search recipes. So community-level signals seem more available in the open-source engine than in the managed surface. ([SDK graph search](https://help.getzep.com/sdk-reference/graph/search), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

For **dashboard/debug visibility**, Graphiti’s official README says Zep provides a dashboard with graph visualization, debug logs, and API logs. I did **not** independently verify the exact UI behavior beyond that official README text, so I would treat this as credible but lightly verified product-surface evidence. ([Graphiti README](https://raw.githubusercontent.com/getzep/graphiti/main/README.md))

#### Automatic Utilization

This is where Zep is strongest as a **product**, not just a graph library.

Zep’s managed product automatically builds the graph from user interactions and business data, invalidates outdated facts, and exposes a **single context call** that returns prompt-ready memory. The product page shows `thread.get_user_context(...)`, and the benchmark blog says Zep was queried with the test question unaltered and returned a `Context` field that was injected into the prompt. That is clear evidence of **automatic context assembly**, not merely a storage backend. ([Agent Memory product page](https://www.getzep.com/product/agent-memory/), [State of the Art Agent Memory blog](https://blog.getzep.com/state-of-the-art-agent-memory/))

For **trigger-free co-activation**, Zep appears to support it **partially and structurally**, not via a separate trigger engine. The mechanism is the retrieval stack itself: hybrid lexical/semantic search finds seeds, BFS expands local neighborhoods, community search can pull in cluster summaries, and rerankers promote graph-near or frequently mentioned items. The Jane wool-allergy example is exactly this pattern: the system surfaces a related memory that is not a direct phrase match because graph proximity makes it relevant. ([Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching), [paper](https://arxiv.org/html/2501.13956))

Zep also has a documented **episode-mentions reranker**, which favors entities/facts mentioned frequently in a conversation, and the paper explicitly mentions seeding BFS from recent episodes to pull in recently active entities/relations. That is a strong transferable idea for session-aware graph recall. ([paper](https://arxiv.org/html/2501.13956))

For **memory decay via graph position**, I did **not** find a documented equivalent to “forget things farther from the active graph frontier” or a centrality-based decay model. The closest mechanisms are:

- temporal invalidation (`invalid_at`)
- node-distance reranking
- episode-mentions frequency reranking

So I would say Zep uses **relevance shaping**, not explicit graph-topology-based decay. ([paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

For **relevance scoring**, the API returns `score` and `relevance`, and the search stack includes RRF, MMR, node distance, episode mentions, and cross-encoder reranking. That is much richer than a single similarity score. ([SDK graph search](https://help.getzep.com/sdk-reference/graph/search), [paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

#### Key Innovations

What makes Zep meaningfully different from vector-only memory stores is not “it has a graph,” but **how the graph changes retrieval behavior**.

First, it keeps **facts as temporal edges with validity windows**, so new information invalidates old information without deleting it. Vector stores usually overwrite summaries or bury stale facts in embedding space; Zep preserves state transitions. ([paper](https://arxiv.org/html/2501.13956), [Graphiti overview](https://help.getzep.com/graphiti/getting-started/overview))

Second, it keeps **raw episodes + resolved semantic graph + communities** at the same time. That gives it provenance, searchable abstractions, and graph expansion targets in one system. Simpler memory stores generally keep only chunks plus metadata. ([paper](https://arxiv.org/html/2501.13956), [Adding Episodes](https://help.getzep.com/graphiti/core-concepts/adding-episodes))

Third, it is designed for **incremental updates without batch recomputation**, which is important for living memory rather than static corpora. ([Welcome](https://help.getzep.com/graphiti/getting-started/welcome), [Graphiti README](https://raw.githubusercontent.com/getzep/graphiti/main/README.md))

Fourth, retrieval is **multi-object and hybrid**: facts, entities, communities; lexical, semantic, BFS; then multiple rerankers. That is a retrieval architecture, not just an index. ([paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

Finally, Zep turns the graph into a **managed context layer**: automatic ingestion, automatic invalidation, automatic prompt-ready context assembly. Graphiti alone is a graph engine; Zep productizes it into an always-on memory subsystem. ([Agent Memory product page](https://www.getzep.com/product/agent-memory/), [Graphiti README](https://raw.githubusercontent.com/getzep/graphiti/main/README.md))

#### Applicability to Spec Kit Memory

Your current diagnosis—**structurally healthy graph, strong edge coverage, but poor retrieval utilization and low user visibility**—is exactly the kind of gap Zep is designed to close.

The biggest transferable improvements would be:

1. **Add a Zep-style episode/provenance layer, not just causal edges.**  
   Keep raw source artifacts as first-class nodes and connect derived memories/edges back to them. That gives you citation-grade provenance, lets retrieval return “why this came back,” and makes graph results inspectable instead of opaque. Zep treats episodes as the non-lossy substrate under semantic memory. ([paper](https://arxiv.org/html/2501.13956), [Adding Episodes](https://help.getzep.com/graphiti/core-concepts/adding-episodes))

2. **Create searchable text surfaces for every graph tier.**  
   Your retrieval gap on `"Semantic Search"` strongly suggests the graph may be structurally rich but textually thin. Zep indexes:
   - edge `fact` text
   - node names/summaries
   - community names/summaries  
   Spec Kit should synthesize natural-language edge/fact strings and node/community summaries from causal data, then search those—not just raw memory bodies or relation labels. ([paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

3. **Add a community layer above causal edges.**  
   With 3,854 causal edges and ~80% coverage, you likely have enough density to cluster. Zep’s community summaries are especially relevant for conceptual queries like `"Semantic Search"` that may not appear verbatim in individual memories. A cluster summary can bridge the lexical gap even when no single edge matches directly. ([paper](https://arxiv.org/html/2501.13956))

4. **Use hybrid retrieval before concluding “0 results.”**  
   Zep does not rely on one channel. For Spec Kit, a robust cascade would be:
   - BM25 over fact strings / summaries
   - vector search over the same
   - BFS expansion from initial hits
   - fallback to community search
   - reranking over the merged set  
   A graph that is healthy but underused often fails because traversal only happens *after* a hit, and no hit occurs. Zep avoids that by indexing multiple graph objects and merging channels early. ([paper](https://arxiv.org/html/2501.13956), [Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching))

5. **Introduce focal-node / causal-distance reranking.**  
   Once you have any plausible seed, rerank by causal distance from the most likely focal memory or recent working-memory anchor. This is one of Zep’s most transferable ideas because it turns a graph from “extra metadata” into a relevance engine. Your current graph already has edge strength and relation types, so you can implement this without redesigning the schema. ([Searching the Graph](https://help.getzep.com/graphiti/working-with-data/searching), [paper](https://arxiv.org/html/2501.13956))

6. **Add session-aware co-activation.**  
   Zep uses recent episodes and mention frequency to bias retrieval toward currently active graph regions. Spec Kit could do the same by seeding BFS from:
   - recent search hits
   - memories touched in the current session
   - high-attention nodes from working memory  
   That would directly address “graph exists but isn’t helping right now.” ([paper](https://arxiv.org/html/2501.13956))

7. **Expose graph evidence in the user-facing response.**  
   Zep’s API returns `score`, `relevance`, provenance episode IDs, and temporal fields. Spec Kit should expose at least:
   - why a memory was returned
   - which causal path connected it
   - source memory/provenance
   - confidence / reranker contribution  
   That solves your “invisible to users” problem without requiring a full graph UI. ([SDK graph search](https://help.getzep.com/sdk-reference/graph/search))

8. **Use temporal/version semantics where contradictions matter.**  
   If Spec Kit has supersession, plan changes, or corrected decisions, Zep’s invalidate-don’t-delete model is worth copying. It improves retrieval quality because stale edges stop competing as if they are still current. ([paper](https://arxiv.org/html/2501.13956))

If I had to prioritize for Spec Kit, I would do this in order:

**(a)** synthesize edge/node/community search text,  
**(b)** add hybrid retrieval + BFS expansion,  
**(c)** add focal-node reranking,  
**(d)** expose provenance/path explanations.

That sequence attacks the exact failure mode you described: **good graph, weak retrieval, zero user-visible graph value**.

#### Confidence Notes

- **Primary-source-backed claims:** Construction, retrieval, provenance, and managed-context claims are backed by the cited Zep/Graphiti paper, official docs, README, and SDK/API references in this section.
- **Training-knowledge-only or synthesis claims:** Comparative judgments such as “Zep is strongest as a product” and the transfer recommendations for Spec Kit are synthesis, not direct vendor claims.
- **Thin or unavailable documentation:** Managed-dashboard/debug UX and managed-community visibility are thinner in public docs than the OSS Graphiti surfaces, so those claims remain lighter-verified than the core retrieval and data-model claims.

### 4.2 Mem0


#### Construction Strategy

Mem0’s graph layer is **write-time automatic**: when graph memory is enabled, a normal `add()` call triggers both vector-memory processing and graph-memory processing in parallel; the graph branch extracts entities, infers relations, checks for contradictory prior edges, soft-invalidates stale relations, and then merges/adds nodes and edges. In the current Python SDK, `Memory.add()` runs `_add_to_vector_store` and `_add_to_graph` concurrently with a `ThreadPoolExecutor`, and returns both standard memory results and graph `relations` when graph is enabled. ([GitHub README](https://github.com/mem0ai/mem0); [main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py))

At the **entity-extraction stage**, Mem0 uses LLM tool-calling to extract entities plus entity types from raw text. The current implementation explicitly maps self-references like “I/me/my” to the active `user_id`, then normalizes entities to lowercase with spaces converted to underscores. That normalization matters because it reduces alias drift at graph-ingest time. ([Graph-memory docs](https://docs.mem0.ai/open-source/features/graph-memory); [DeepWiki: entity extraction](https://deepwiki.com/mem0ai/mem0/4.3-entity-and-relationship-extraction); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

At the **relation-inference stage**, Mem0 runs a second LLM tool call over the extracted entities and the source text to produce directional triples like `source --relationship--> destination`. The live prompt in `mem0/graphs/utils.py` tells the model to use **consistent, general, timeless** relationship names and to extract **only explicitly stated** information. That is an important implementation detail: the paper’s description of Mem0^g says the relationship generator uses linguistic/contextual reasoning and can leverage implicit information, but the public OSS prompt is more conservative. I would treat “implicit relation inference” as a research/paper description, not a guaranteed property of the current OSS runtime. ([graphs/utils.py](https://github.com/mem0ai/mem0/blob/main/mem0/graphs/utils.py); [DeepWiki: entity extraction](https://deepwiki.com/mem0ai/mem0/4.3-entity-and-relationship-extraction); [Mem0 paper](https://arxiv.org/html/2504.19413v1))

Mem0’s **graph update pipeline** is more than append-only ingestion. On each graph write, it:

1. extracts entities,
2. extracts relation triples,
3. searches the existing graph for semantically similar nodes,
4. asks the LLM which old relations should be deleted as contradictory/outdated,
5. soft-invalidates those edges,
6. merges existing or new nodes,
7. creates/updates the final relationship with timestamps and mention counts.  
This pipeline is visible in `MemoryGraph.add()`, `_search_graph_db()`, `_get_delete_entities_from_search_output()`, `_delete_entities()`, and `_add_entities()`. Notably, deletions are **soft**: Mem0 marks relations `valid=false` with `invalidated_at` instead of physically removing them. ([graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py); [DeepWiki: graph overview](https://deepwiki.com/mem0ai/mem0/4.1-graph-memory-overview))

On **memory types**, Mem0’s public product/docs frame memory as a layered system:

- conversation memory,
- session memory,
- user memory,
- organizational memory,  

and cognitively as:

- short-term memory,
- long-term factual memory,
- episodic memory,
- semantic memory.  

The docs explicitly say Mem0 stores layers separately and merges them at query time, prioritizing user memories ahead of session notes and raw history. ([Memory types docs](https://docs.mem0.ai/core-concepts/memory-types); [README](https://github.com/mem0ai/mem0))

However, there is an important caveat for a technical comparison: in the current SDK, I do **not** see separate first-class API types for “semantic” vs “episodic” memories. The public code explicitly special-cases only `procedural_memory`; general memories are described in docstrings as creating short-term plus long-term semantic/episodic memories by default, but those categories are not exposed as separate runtime `memory_type` values in the visible add-path logic. So the layered/cognitive taxonomy is real in docs and product framing, but the public OSS API surface looks much flatter. ([Memory types docs](https://docs.mem0.ai/core-concepts/memory-types); [main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py))

At the **research-paper level**, base Mem0 uses a two-phase “extraction + update” architecture for long-term memory generally. It extracts salient candidate facts from a prompt built from a conversation summary, recent messages, and the latest message pair, then compares each candidate against similar existing memories and chooses `ADD`, `UPDATE`, `DELETE`, or `NOOP`. Mem0^g extends that foundation by storing memory as a directed labeled graph with typed entity nodes, labeled edges, embeddings on nodes, and timestamps/metadata for graph updates. ([Mem0 paper](https://arxiv.org/html/2504.19413v1))

#### Traversal Strategy

Mem0’s graph query path is **not** a generic graph algorithm like BFS, personalized PageRank, or learned path search. In the current implementation it is closer to a **query-to-entity matching pipeline plus 1-hop neighborhood expansion**:

1. extract entities from the search query,
2. embed each extracted entity,
3. find graph nodes whose embeddings exceed a cosine-similarity threshold,
4. fetch incoming and outgoing relationships for those matched nodes,
5. rerank returned triples with BM25,
6. return the top relations.  

That is the practical traversal strategy implemented today. ([DeepWiki: graph search](https://deepwiki.com/mem0ai/mem0/4.4-graph-search-and-retrieval); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

The **matching stage** uses vector similarity over graph nodes, not exact node-name lookup. The default threshold is 0.7 if not configured otherwise. In `_search_graph_db()`, Mem0 computes an embedding for each query entity and runs a Cypher query that scores candidate nodes with cosine similarity, then pulls both outgoing and incoming edges via a `UNION` clause. This gives the graph layer some lexical robustness while still staying anchored to explicit graph nodes. ([DeepWiki: graph overview](https://deepwiki.com/mem0ai/mem0/4.1-graph-memory-overview); [DeepWiki: graph search](https://deepwiki.com/mem0ai/mem0/4.4-graph-search-and-retrieval); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

The **relevance-scoring stack** is hybrid but asymmetric:

- vector memory search handles semantic retrieval of memory texts,
- graph memory independently returns relation triples,
- BM25 reranks graph triples,
- but graph scores do **not** reorder the main vector hits.  

Both the open-source/platform docs and the code make this clear: vector search returns top semantic matches, and graph relations are returned **alongside** those results “to provide additional context—they do not reorder the vector hits.” The main `search()` method runs vector and graph retrieval concurrently and returns `results` plus `relations` when graph is enabled. ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory); [Open-source graph docs](https://docs.mem0.ai/open-source/features/graph-memory); [main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py))

That means Mem0’s current retrieval strategy is best described as **parallel hybrid retrieval with side-channel graph augmentation**, not deep graph-native ranking. The cookbook examples show multi-hop reasoning benefits (“Who is Emma’s teammate’s manager?”), but the public implementation appears to surface the necessary 1-hop relations and relies on the application/LLM to synthesize the answer, rather than executing an explicit multi-hop path search in the graph engine itself. ([Vector-vs-graph cookbook](https://docs.mem0.ai/cookbooks/essentials/choosing-memory-architecture-vector-vs-graph); [DeepWiki: graph search](https://deepwiki.com/mem0ai/mem0/4.4-graph-search-and-retrieval))

#### UX Transparency

Mem0 is **partially transparent** about graph memory, but more at the API/product level than as a graph-native debugging experience.

For **user-facing inspection**, the platform docs say Mem0 Platform offers **dashboard visibility**, while OSS users are expected to inspect memory through CLI, logs, or a custom UI. I found public documentation for a dashboard/memory-management surface, but I did **not** find public evidence of a dedicated graph-edge/path inspector comparable to a full graph console. So “memory inspector” exists in the broader sense, but graph-specific introspection appears limited in public materials. ([Add-memory docs](https://docs.mem0.ai/core-concepts/memory-operations/add); [README](https://github.com/mem0ai/mem0))

For **API transparency**, Mem0 is better. When graph is enabled:

- `add()` can return `results` plus `relations`,
- `get_all()` returns `results` plus `relations`,
- `search()` returns semantic `results` plus graph `relations`.  

This is good because the graph signal is not hidden entirely inside the retrieval system; callers can inspect it as a separate channel. ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory); [main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py))

For **provenance/state tracking**, Mem0 has useful but limited primitives:

- memory items expose `created_at`, `updated_at`, IDs, and metadata,
- graph nodes/edges track timestamps and scope (`user_id`, `agent_id`, `run_id`),
- invalidated edges keep `invalidated_at` and `valid=false` rather than disappearing.  

That gives you temporal state and some operational lineage. But I did **not** find a first-class public provenance model saying “this edge came from utterance X and was returned because of path Y and score Z.” In other words, Mem0 has metadata and temporal bookkeeping, but not strong explanatory provenance in the public UX. ([main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

For **user-facing memory management**, Mem0’s story is strong at the memory-object level and weaker at the graph-object level. The platform and SDK expose add/search/get/list/delete flows, and the CLI supports terminal memory operations. But I did not find an equally rich public surface for directly browsing, editing, or approving graph relations as first-class user-managed objects. ([README](https://github.com/mem0ai/mem0); [Add-memory docs](https://docs.mem0.ai/core-concepts/memory-operations/add))

#### Automatic Utilization

Mem0’s biggest strength is **automatic write-time utilization**. Developers call a normal `add()` method, and Mem0 automatically extracts salient memory, performs update-vs-add-vs-delete reasoning, and optionally writes graph structure. That “managed memory layer” abstraction is the real product innovation: developers do not manually define entity schemas, edge upserts, or dedupe rules for each interaction. ([Add-memory docs](https://docs.mem0.ai/core-concepts/memory-operations/add); [Mem0 paper](https://arxiv.org/html/2504.19413v1))

Mem0 also uses memory for **automatic context enrichment** at query time by merging layers and, when graph is enabled, returning relation context next to semantic hits. The memory-types docs explicitly describe a layered retrieval policy: Mem0 pulls from all layers and ranks user memory first, then session notes, then raw history. That is a built-in personalization bias rather than a flat nearest-neighbor store. ([Memory types docs](https://docs.mem0.ai/core-concepts/memory-types); [README](https://github.com/mem0ai/mem0))

On **personalization**, Mem0 is clearly designed around scoped memories (`user_id`, session/session-like IDs, agent ID, org/shared memory). The README markets this as multi-level memory and adaptive personalization; the docs formalize it as conversation/session/user/org layers. That makes the graph useful as a personalization substrate, because relational facts can be scoped to a specific user/session/agent boundary instead of being globally pooled. ([README](https://github.com/mem0ai/mem0); [Memory types docs](https://docs.mem0.ai/core-concepts/memory-types))

On **memory injection without explicit triggers**, I would be careful. Mem0 automates extraction and consolidation, but the OSS usage pattern still usually has the application explicitly call `memory.search()` before prompting the LLM, then explicitly call `memory.add()` after the exchange. The README example does exactly that. So Mem0 is not “magically always-on prompt injection” in the OSS SDK; it is a managed memory service with very low-friction APIs. If the hosted platform offers more implicit orchestration, the public OSS examples do not make that the default story. ([README](https://github.com/mem0ai/mem0))

On **decay and consolidation**, Mem0 is stronger on consolidation than decay. Consolidation is explicit:

- candidate memories are compared to similar existing memories,
- the model chooses `ADD`, `UPDATE`, `DELETE`, or `NOOP`,
- graph contradictions are soft-invalidated.  

But I did **not** find evidence of a sophisticated built-in decay scheduler for graph memory. In fact, the graph docs frame stale-relationship pruning as a policy decision for the user/operator. So Mem0 supports temporal cleanup and invalidation, but not a clearly documented automatic forgetting model comparable to spaced repetition or activation decay. ([Mem0 paper](https://arxiv.org/html/2504.19413v1); [Open-source graph docs](https://docs.mem0.ai/open-source/features/graph-memory); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

#### Key Innovations

The main innovation is **not** “best graph algorithm wins.” It is the **managed memory layer** approach: Mem0 wraps extraction, consolidation, retrieval, scoping, and optional graph augmentation behind a minimal developer API. In practice, that means developers interact with `add()` and `search()` instead of wiring together summarization, fact extraction, dedupe, vector retrieval, graph extraction, and update rules themselves. ([README](https://github.com/mem0ai/mem0); [Add-memory docs](https://docs.mem0.ai/core-concepts/memory-operations/add); [Mem0 paper](https://arxiv.org/html/2504.19413v1))

Its second innovation is the **multi-level memory architecture**. Mem0 explicitly distinguishes conversation/session/user/org layers and maps them to short-term vs long-term memory. It also introduces a documented `procedural_memory` path in the SDK for agent-oriented procedural summaries, while the broader docs frame general memories as including factual, episodic, and semantic content. This is more cognitively structured than typical “single vector index” memory systems. ([Memory types docs](https://docs.mem0.ai/core-concepts/memory-types); [main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py))

Its third innovation is **hybrid vector + graph memory with low developer friction**. Graph writes can be toggled per request or enabled at the project level; graph retrieval can run beside vector retrieval; and the system supports selective use of graph for durable relational knowledge rather than forcing graph semantics onto every memory item. The cookbook explicitly recommends using vector memory for simple facts and graph memory where relationships matter. ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory); [Vector-vs-graph cookbook](https://docs.mem0.ai/cookbooks/essentials/choosing-memory-architecture-vector-vs-graph))

From a DX perspective, Mem0 is unusually pragmatic:

- hosted platform or OSS,
- Python/TypeScript SDKs,
- CLI,
- dashboard visibility on platform,
- graph toggle instead of graph lock-in.  

That makes it easier to adopt than graph-heavy systems that require the developer to commit to graph-native modeling from day one. ([README](https://github.com/mem0ai/mem0); [Add-memory docs](https://docs.mem0.ai/core-concepts/memory-operations/add))

The flip side is that graph memory remains **secondary** in the public product architecture. Mem0’s own docs say graph relations augment retrieval but do not reorder vector hits. So Mem0’s uniqueness is less “graph-first reasoning engine” and more “production-friendly memory middleware with optional graph augmentation.” ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory))

#### Applicability to Spec Kit Memory

Given your stated metrics — **3,854 causal edges, 79.92% coverage, dominant `supports`/`caused` relations, average strength 0.76, but zero retrieval for `memory_search("Semantic Search")`** — the bottleneck is probably **not graph construction quality**. It is **query-time graph utilization, concept normalization, and UX visibility**. Mem0 is useful here, but mostly as a pattern library.

**1. Add a dedicated query-to-graph bridge before or beside vector retrieval.**  
Mem0 does not wait for exact lexical overlap; it extracts entities from the query, embeds them, and matches them to graph nodes above a similarity threshold before retrieving adjacent relations. For Spec Kit, the equivalent would be: extract query concepts like `semantic_search`, `vector_search`, `retrieval`, `embedding_search`, map them to graph anchors/aliases, then traverse causal/support edges from those anchors. That would directly address your “zero vector hits despite healthy graph” failure mode. ([DeepWiki: graph search](https://deepwiki.com/mem0ai/mem0/4.4-graph-search-and-retrieval); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

**2. Always surface graph-side candidates even when the main semantic search is empty.**  
Mem0’s current retrieval model returns graph `relations` alongside semantic hits. For Spec Kit, I would adopt that pattern immediately: if `memory_search("Semantic Search")` yields zero main results, the response should still return `graph_hits`, `related_nodes`, and `supporting_paths`. Right now your graph is “structurally healthy but invisible”; Mem0’s side-channel response structure is a direct fix for invisibility. ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory); [main.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py))

**3. Add canonical concept normalization and aliasing.**  
Mem0 normalizes entity names (`"Machine Learning"` → `machine_learning`) and pushes the extractor toward stable, timeless relation names. In Spec Kit, I would apply the same idea to concepts and memory titles: canonicalize `semantic search`, `semantic_search`, `vector retrieval`, `embedding search`, `RAG retrieval`, etc., and attach alias tables or projected concept nodes. If your graph is strong but queries miss, alias fragmentation is a prime suspect. ([DeepWiki: entity extraction](https://deepwiki.com/mem0ai/mem0/4.3-entity-and-relationship-extraction); [graphs/utils.py](https://github.com/mem0ai/mem0/blob/main/mem0/graphs/utils.py))

**4. Introduce Mem0-style consolidation on ingest.**  
Mem0’s `ADD/UPDATE/DELETE/NOOP` memory-updater and graph soft-invalidation pipeline are useful models for preventing concept drift. In Spec Kit terms, new notes about the same retrieval subsystem should update/merge canonical concepts rather than fragment into parallel names. That would likely improve both graph quality and retrievability. ([Mem0 paper](https://arxiv.org/html/2504.19413v1); [graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

**5. Expose provenance and path explanations aggressively.**  
Mem0 only partially solves transparency; Spec Kit should go further. For every graph-assisted result, return:
- the anchor node matched from the query,
- the path used (`Semantic Search -> supports -> query expansion`, etc.),
- edge strengths/freshness,
- the originating memory IDs/files.  
Your own prompt says the graph is underutilized and invisible; this is a UX problem as much as a ranking problem. Mem0’s “relations alongside results” is a start, but Spec Kit should make path/provenance first-class. ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory); [Add-memory docs](https://docs.mem0.ai/core-concepts/memory-operations/add))

**6. Borrow Mem0’s hybrid retrieval idea, but do not copy its ranking boundary exactly.**  
This is the key comparative insight. Mem0’s current product behavior keeps graph results as an augmentation channel and explicitly says they do not reorder vector hits. That is fine for a general memory layer, but for Spec Kit it is probably **too conservative**. Because your main issue is graph underutilization, Spec Kit should use graph-derived candidates to **rescue zero-hit queries and participate in final ranking**, not just display side-channel relations. So: copy Mem0’s query-time graph retrieval, but go beyond Mem0 by fusing graph evidence into the main ranker. ([Platform graph docs](https://docs.mem0.ai/platform/features/graph-memory))

**7. Add layer-aware retrieval priorities.**  
Mem0’s layered retrieval policy — user first, then session, then raw history — is a useful reminder that not all memories should compete in one flat pool. For Spec Kit, the analogous move would be to explicitly rank HOT/WARM/critical/constitutional or current-spec memories above archival material when graph expansion fans out. That will make graph traversal less noisy. ([Memory types docs](https://docs.mem0.ai/core-concepts/memory-types))

**8. Use soft invalidation instead of destructive edge churn where temporal state matters.**  
Mem0’s graph deletes are really invalidations (`valid=false`, `invalidated_at`). If Spec Kit decisions or causal edges evolve over time, invalidation preserves history and enables “why did this change?” debugging while keeping active retrieval clean. ([graph_memory.py](https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py))

**Bottom line:** Mem0’s most transferable ideas for Spec Kit are **query-time concept extraction over graph nodes, graph-as-parallel-retrieval-channel, normalization/consolidation, and transparent surfaced relations**. But Mem0 also shows a limit: if graph stays auxiliary and non-ranking, a healthy graph can still remain underutilized. For your system, the right move is to adopt Mem0’s bridge patterns and then be **more graph-forward than Mem0 itself**.

#### Confidence Notes

- **Primary-source-backed claims:** Write-time graph construction, node normalization, relation extraction/update behavior, graph-side retrieval, and side-channel `relations` behavior are backed by the cited OSS docs, README, `main.py`, `graph_memory.py`, `graphs/utils.py`, DeepWiki references, and the Mem0 paper.
- **Training-knowledge-only or synthesis claims:** Comparative judgments about Mem0 being “pragmatic,” “graph-secondary,” or a limit case for Spec Kit are synthesis based on the cited sources rather than explicit Mem0 claims.
- **Thin or unavailable documentation:** Public material is thinner on hosted-platform graph UX, exact multi-hop reasoning behavior, explicit provenance/path explanation, and whether semantic vs episodic layers are distinct first-class runtime types in the OSS API.

### 4.3 GraphRAG


#### Construction Strategy

GraphRAG’s core idea is to turn unstructured documents into a **multi-level knowledge graph plus precomputed summaries**. In the default pipeline, documents are chunked into `TextUnit`s; an LLM then extracts **entities** and **relationships** from each chunk, merges duplicate entities/edges across chunks, and asks the LLM again to summarize the merged descriptions into one concise description per entity and per relationship.[^2][^3]

After graph extraction, GraphRAG runs **hierarchical Leiden community detection** over the entity/relationship graph. The result is not just one flat clustering, but a **strict hierarchy** of communities with `parent`, `children`, and `level` fields, so the same corpus can be represented at multiple abstraction levels.[^3][^4]

GraphRAG then performs **hierarchical community summarization**: each community gets an LLM-generated report with a title, summary, full report text, a salience rank, and a structured `findings` list. These community reports are first-class query artifacts, not just debugging outputs.[^3][^4]

GraphRAG also supports **claim extraction**, but this is an important nuance: it is **optional** and **off by default** in the standard pipeline because Microsoft notes it usually needs prompt tuning to be useful. When enabled, claims are emitted as `covariates` with fields like `description`, `status` (`TRUE`, `FALSE`, `SUSPECTED`), time bounds, `source_text`, and `text_unit_id`.[^3][^4]

So the construction pattern is: **LLM extraction -> graph consolidation -> Leiden hierarchy -> LLM community reports -> embeddings over text units, entity descriptions, and community reports**.[^2][^3]

#### Traversal Strategy

GraphRAG exposes three main traversal/query patterns.

**Local search** is **entity-centric**. It semantically matches the user query against entity descriptions, uses those entities as access points into the graph, and then expands to associated **text units, community reports, connected entities, relationships, and optional covariates/claims**. Those candidates are ranked and filtered into a single LLM context window for answer generation.[^5][^6]

**Global search** is **community-centric**. Instead of starting from specific entities, it starts from **community reports** at a chosen hierarchy level and runs a **map-reduce summarization** process across them. In the `map` phase, batches of community reports produce intermediate rated points; in the `reduce` phase, the most important points are aggregated into the final answer. This is how GraphRAG addresses dataset-wide questions like “What are the main themes?” that standard vector RAG handles poorly.[^2][^7]

**DRIFT search** sits between those two. Its documented flow is:
1. a **primer** step over the top-K semantically relevant community reports,
2. generation of an initial answer plus **follow-up questions**,
3. **local-search-based follow-up traversal** to refine those questions,
4. output as a **hierarchical question/answer structure** ranked by relevance.[^8][^13]

That makes DRIFT a **dynamic reasoning traversal**: it starts broad using community summaries, then descends toward local evidence. Microsoft explicitly positions it as combining global breadth with local specificity.[^8][^13]

A related Microsoft improvement, though more of an optimization than the original core mode, is **dynamic community selection** for global search: start at the root community, rate each report for relevance, prune irrelevant branches early, and only send relevant reports into the expensive map-reduce stage.[^12]

#### UX Transparency

GraphRAG is relatively strong on **traceability**, at least at the data model and prompt-contract level.

First, its output model stores explicit human-facing artifacts:
- **community reports** with `title`, `summary`, `full_content`, `findings`, and `rating_explanation`;
- **entity descriptions** as consolidated summaries;
- **claims/covariates** with `source_text` and `text_unit_id`;
- **text units** linked back to source documents.[^3][^4]

Second, GraphRAG’s answer prompts explicitly instruct the model to include **data references** such as:

`[Data: Reports (...); Entities (...); Relationships (...); Claims (...)]`

The local-search prompt requires supported points to carry record citations; the global-search reduce prompt says to preserve report references; the DRIFT prompts likewise require data references and emphasize source preservation.[^9][^10][^11]

Third, the schema includes a `human_readable_id` specifically so summaries and answers can print **visually cross-referenceable IDs** rather than opaque UUIDs.[^4]

So GraphRAG does expose **community reports, entity descriptions, claim provenance, and source attribution**. My caveat is that **frontend transparency still depends on the host application**. The official repo clearly provides the provenance-bearing data structures and prompt rules, but it is not itself a full end-user UI product.[^4][^9][^10][^11]

#### Automatic Utilization

GraphRAG uses the graph **proactively** in several ways.

The biggest one is **community-level pre-summarization**. Community reports are generated at indexing time, before any user question arrives. That means GraphRAG has already compressed the corpus into reusable, graph-shaped abstractions before retrieval begins.[^2][^3]

It also performs **graph-informed retrieval augmentation** automatically inside each search mode:
- local search automatically mixes graph artifacts and raw source text,
- global search automatically operates over community-report abstractions,
- DRIFT automatically uses community summaries to seed a broader search and then refines locally.[^5][^7][^8]

On **automatic context selection based on query type**, I want to be precise: **I did not find evidence in the official docs I reviewed of a built-in universal query router that automatically chooses local vs global vs DRIFT for arbitrary user questions**. The docs present these as separate query methods. In fact, Microsoft’s DRIFT blog describes a future direction involving a **query router**, which implies that a general automatic router is aspirational rather than a clearly documented default behavior today.[^6][^13]

So GraphRAG is very much **query-type-aware by design**, but not obviously **auto-routing by default** based on the sources I reviewed.[^6][^13]

#### Key Innovations

The most important GraphRAG innovation is that it treats **global questions as a graph summarization problem, not just a nearest-neighbor retrieval problem**. The paper’s central argument is that standard RAG fails on corpus-wide, thematic questions because those are really query-focused summarization tasks; GraphRAG solves this by building a graph index and pregenerating community summaries.[^2]

Its second major innovation is **hierarchical summarization**. Community detection plus community reports lets the system represent a corpus at multiple levels of abstraction, from high-level themes down to local clusters.[^3][^4]

Its third innovation is the **local vs global search paradigm**. GraphRAG does not force one retrieval mode onto every question. It distinguishes:
- **local/entity-level reasoning** for targeted questions,
- **global/community-level reasoning** for dataset-wide questions,
- **DRIFT** for questions needing both breadth and depth.[^5][^6][^7][^8]

A fourth, practical innovation is its emphasis on **grounded provenance-bearing outputs**: reports, entity descriptions, claims, text-unit links, and answer-level record references. That is more explicit than many RAG stacks, which often bury retrieval evidence behind the final prose.[^4][^9][^10][^11]

#### Applicability to Spec Kit Memory

Given your current state — **3,854 causal edges, 79.92% coverage, dominant `supports`/`caused` relations, average strength 0.76, but retrieval gaps such as `memory_search("Semantic Search") -> 0 results`** — GraphRAG’s strongest lesson is this:

**your problem is probably not graph scarcity; it is graph under-productization.**  
You already have structure. What GraphRAG adds is a way to convert structure into **retrieval artifacts, query modes, and user-visible evidence**.

Here are the GraphRAG ideas most worth borrowing:

1. **Add community detection plus community reports over the memory graph.**  
   Today your graph is structurally healthy but largely invisible. GraphRAG suggests clustering the memory graph into higher-order “topics” or “themes,” then generating **community summaries** with citations back to member memories/edges. That would give you an answerable abstraction layer for broad queries like “semantic search,” “ranking strategy,” or “session continuity,” even when literal retrieval misses the phrase.[^2][^3][^4]

2. **Introduce a true global-search mode for thematic questions.**  
   If a user asks a corpus-wide or architectural question, vector/keyword retrieval may not surface the right nodes. A GraphRAG-style global mode could search over **community summaries first**, then map-reduce the relevant ones into an answer. That is exactly the failure mode the GraphRAG paper targets.[^2][^7]

3. **Introduce a local-search mode that uses graph neighborhoods, not only text similarity.**  
   For targeted queries, start from matched memories/symbols and expand through `caused`/`supports` edges, related anchors, and nearby summaries, then pull raw memory text as evidence. That mirrors GraphRAG local search’s “entity as access point -> expand to relationships/reports/text units” pattern.[^5][^6]

4. **Use DRIFT-like traversal when retrieval initially fails.**  
   Your “Semantic Search -> 0 results” example is exactly where DRIFT-style behavior could help: start from community summaries, generate follow-up subqueries, then descend into the most promising causal neighborhoods. This is especially useful when user wording diverges from the vocabulary used in stored memories.[^8][^13]

5. **Make provenance visible in the answer, not just available in the backend.**  
   GraphRAG’s prompts explicitly force citation-bearing outputs. Spec Kit Memory should do the same with memory IDs, anchors, edge IDs, and maybe community IDs, so answers can say not just *what* was concluded, but *which memories/edges led there*.[^4][^9][^10][^11]

6. **Treat claim extraction as a pattern, not a schema to copy verbatim.**  
   GraphRAG’s default claim extraction is oriented toward fraud/malicious-behavior-style corpora and is optional/off by default.[^3][^4] For Spec Kit Memory, the analogue is probably not “claims” in the GraphRAG sense, but something like **decision/assertion/constraint/status-change extraction** from memories and specs.

7. **Consider dynamic community selection if you add many communities.**  
   If community reports become numerous, Microsoft’s dynamic global-search idea is directly relevant: use a cheap relevance-rating step to prune irrelevant branches before expensive synthesis.[^12]

**I’m uncertain about one direct transfer:** GraphRAG specifically uses **Hierarchical Leiden**, but your graph is a **typed causal/support graph**, not just an entity co-occurrence graph. The higher-level pattern — **cluster -> summarize -> search hierarchically** — is very likely portable, but the exact clustering algorithm may need to be relation-aware or weight-aware rather than copied blindly from GraphRAG.[^3][^4]

**Bottom line:** GraphRAG would not mainly help you by adding *more edges*. It would help by turning your existing graph into a **visible, summarized, query-routable layer** that can answer both local and global questions and explain itself while doing so.[^2][^3][^5][^7][^8]

#### Confidence Notes

- **Primary-source-backed claims:** Graph extraction, hierarchical Leiden clustering, community reports, local/global/DRIFT search behavior, and citation-bearing prompt behavior are backed by the cited paper, Microsoft docs, output schemas, and prompt templates.
- **Training-knowledge-only or synthesis claims:** Comparative judgments about what GraphRAG would help “most” with in Spec Kit are synthesis. The portability warning about typed causal graphs vs entity graphs is also an inference rather than a direct GraphRAG claim.
- **Thin or unavailable documentation:** I did not find strong evidence of a default automatic query router across local/global/DRIFT modes, and frontend UX expectations remain thin because the public repo is a framework rather than a polished end-user product.[^6][^13][^14]

---

[^1]: Microsoft GraphRAG README: https://github.com/microsoft/graphrag/blob/main/README.md  
[^2]: GraphRAG paper, “From Local to Global: A GraphRAG Approach to Query-Focused Summarization”: https://arxiv.org/abs/2404.16130  
[^3]: GraphRAG indexing dataflow: https://github.com/microsoft/graphrag/blob/main/docs/index/default_dataflow.md  
[^4]: GraphRAG output schemas: https://github.com/microsoft/graphrag/blob/main/docs/index/outputs.md  
[^5]: GraphRAG query overview: https://github.com/microsoft/graphrag/blob/main/docs/query/overview.md  
[^6]: GraphRAG local search docs: https://github.com/microsoft/graphrag/blob/main/docs/query/local_search.md  
[^7]: GraphRAG global search docs: https://microsoft.github.io/graphrag/query/global_search/  
[^8]: GraphRAG DRIFT search docs: https://github.com/microsoft/graphrag/blob/main/docs/query/drift_search.md  
[^9]: Local search prompt template: https://github.com/microsoft/graphrag/blob/main/packages/graphrag/graphrag/prompts/query/local_search_system_prompt.py  
[^10]: Global search reduce prompt template: https://github.com/microsoft/graphrag/blob/main/packages/graphrag/graphrag/prompts/query/global_search_reduce_system_prompt.py  
[^11]: DRIFT search prompt templates: https://github.com/microsoft/graphrag/blob/main/packages/graphrag/graphrag/prompts/query/drift_search_system_prompt.py  
[^12]: Microsoft Research blog, dynamic community selection for global search: https://www.microsoft.com/en-us/research/blog/graphrag-improving-global-search-via-dynamic-community-selection/  
[^13]: Microsoft Research blog, DRIFT search: https://www.microsoft.com/en-us/research/blog/introducing-drift-search-combining-global-and-local-search-methods-to-improve-quality-and-efficiency/  
[^14]: GraphRAG Responsible AI FAQ: https://github.com/microsoft/graphrag/blob/main/RAI_TRANSPARENCY.md

### 4.4 LightRAG


#### Construction Strategy

LightRAG builds its knowledge graph by chunking documents, then asking an LLM to extract normalized **entities** and **binary relationships** from each chunk. The extraction prompt explicitly asks for consistent entity naming, relationship keywords, undirected-edge handling unless direction is explicit, and duplicate avoidance. The repo also supports a follow-up “continue extraction” pass to recover missed or malformed entities/relations. (`lightrag/prompt.py:11-84`; `lightrag/operate.py:2886-2990`)

After extraction, LightRAG parses and sanitizes the results, rejects malformed records and self-loops, normalizes names/types, and then merges new facts into existing graph state. Existing nodes/edges are read back first; then new `source_id`s are merged, descriptions are deduplicated, and multiple descriptions can be summarized into a consolidated profile before graph and vector indexes are updated. In other words, the graph is not just appended to blindly; it is continuously reconciled. (`lightrag/operate.py:937`, `:1623`, `:1948`, `:2504`)

For ingestion, the current repo uses an enqueue/process pipeline. `apipeline_enqueue_documents` hashes or validates document IDs, filters duplicates, stores full docs separately, records per-doc status, and only then runs the indexing pipeline. Duplicate documents are explicitly detected and tracked rather than silently reprocessed. (`lightrag/lightrag.py:1438-1518`)

On **deduplication**, LightRAG operates at multiple levels:

- **Document-level**: duplicate docs are filtered by ID/content-hash before processing. (`lightrag/lightrag.py:1455-1498`)
- **Entity/edge-level**: entity names and relation pairs are normalized, existing graph records are fetched, and source IDs/descriptions are merged rather than creating parallel duplicates. (`lightrag/operate.py:1623`, `:1948`)
- **Description-level**: repeated descriptions are deduplicated before summarization/upsert. (`lightrag/operate.py:1737-1760`, `:2046-2063`)

For **incremental updates**, both the paper and the repo point the same way: new documents are integrated into the existing graph/vector stores without rebuilding the full index from scratch. The paper presents this as a core advantage over GraphRAG’s community-report regeneration; the repo’s insert pipeline and merge logic are consistent with that claim. I am confident this is a real design property, not just marketing. (Paper §3.1, §4.5; `lightrag/lightrag.py:1220-1280`, `:1438-1518`; `lightrag/operate.py:1623`, `:1948`)

#### Traversal Strategy

LightRAG exposes several query modes: `local`, `global`, `hybrid`, `naive`, `mix`, and `bypass`. In current code, `QueryParam.mode` defaults to `mix`, and the docstring says `mix` integrates knowledge-graph and vector retrieval. (`lightrag/base.py:85-165`)

Its core retrieval idea is the paper’s **dual-level retrieval paradigm**:

- **Low-level retrieval** targets specific entities and their attached facts.
- **High-level retrieval** targets broader themes and relation patterns.

The paper says LightRAG first extracts **local query keywords** and **global query keywords**, then matches local keywords to candidate entities and global keywords to relations, and finally expands with graph structure. (Paper §3.2)

On **graph traversal depth**, the clearest statement I found is in the paper: LightRAG augments retrieval with **one-hop neighboring nodes** around retrieved nodes/edges. That is a meaningful graph expansion, but it is still lightweight compared with deep community traversal. I am **not fully sure** the main query path in the current repo performs deeper multi-hop traversal during answer retrieval; what I could verify confidently is one-hop retrieval in the paper and separate graph exploration APIs/UI for broader graph inspection. (Paper §3.2; `lightrag/api/README.md:1-3`)

So the effective query stack is best described as **hybrid keyword + semantic + graph retrieval**:

1. LLM extracts local/global keywords.
2. Vector search hits entities/relations/chunks.
3. Graph structure expands those hits via nearby nodes/edges.
4. Retrieved graph facts plus text excerpts are assembled into prompt context. (Paper §3.2-3.3; `lightrag/base.py:85-165`; `lightrag/operate.py:3167`, `:4933`)

One nuance: the paper uses “hybrid mode” for combining low- and high-level retrieval, while the code/docs also use `mix` for KG + vector retrieval. I’m reasonably confident in that distinction, but the terminology is somewhat overloaded across paper vs repo.

#### UX Transparency

LightRAG is better than many graph-RAG systems at exposing retrieval artifacts, but it is not fully transparent in every dimension.

What it **does expose well**:

- **Retrieved context without generation** via `only_need_context=True`. (`lightrag/base.py:97`; `lightrag/operate.py:3202-3281`, `:5110-5121`)
- **The assembled prompt** via `only_need_prompt=True`, which is useful for debugging exactly what graph/text context is injected into the LLM. (`lightrag/base.py:100`; `lightrag/operate.py:3281`, `:5121`)
- **Source attribution / references** via `include_references`, plus helper logic that generates reference lists from retrieved chunks. (`lightrag/base.py:165`; `lightrag/operate.py:4155`, `:5058`; `lightrag/api/README.md:589-620`)
- **File-path provenance on ingest**, so sources can be traced back to original documents. (`README.md` “Citation Functionality”; `lightrag/lightrag.py:1438-1518`)

What it **partially exposes**:

- **Entity/relationship visibility**: the WebUI explicitly supports knowledge graph exploration and visualization, so users can inspect graph structure rather than treating it as a black box. (`README.md:91,119`; `lightrag/api/README.md:1-3`)
- **Query trace transparency**: I can verify context/prompt exposure and references, but I am **not fully sure** the core SDK exposes a rich step-by-step retrieval trace (for example, ranked entities, ranked relations, hop-by-hop expansion decisions) in the same way observability-first systems do. The repo mentions tracing integrations like Langfuse in later README news, but I did not inspect that implementation directly. (`README.md` news section)

So: LightRAG has **good practical transparency** for context, prompt, and citations, but only **partial algorithmic transparency** for the internal graph-ranking process.

#### Automatic Utilization

LightRAG uses the graph proactively once you query in a graph-enabled mode.

First, the system stores entities, relations, and chunks in separate vector stores and maintains a dedicated graph store. That means graph-aware retrieval is not a post-hoc add-on; it is part of the base architecture. (`lightrag/lightrag.py:661-736`; `README.md` storage section)

Second, the paper is explicit that retrieved information includes **entity names, relation descriptions, and original text excerpts**, and that this multi-source context is concatenated with the query before answer generation. That is automatic graph-context injection into the LLM prompt. (Paper §3.3)

Third, the current code makes this fairly automatic in practice because `QueryParam.mode` defaults to `mix`, which is documented as KG + vector retrieval. So unless the caller explicitly downgrades to `naive`/`bypass`, LightRAG tends to use graph-enhanced retrieval by default. (`lightrag/base.py:88-111`)

The part I would **not overclaim** is **adaptive retrieval mode selection**. The paper describes adaptation inside the retrieval process by extracting both local and global keywords. But the top-level mode (`local` vs `global` vs `hybrid` vs `mix`) still appears primarily **caller-controlled**, not automatically routed by a learned/query-classification policy in the current repo. So LightRAG is adaptive in the sense of “dual-keyword, graph-aware retrieval,” but not obviously adaptive in the sense of “the system autonomously chooses the best high-level mode per query.” (Paper §3.2; `lightrag/base.py:85-165`)

#### Key Innovations

The three most distinctive LightRAG ideas are:

1. **Lightweight graph-RAG design**  
   LightRAG avoids GraphRAG’s heavy community-report traversal. In the paper’s cost analysis, retrieval uses fewer than 100 tokens for keyword generation/retrieval and only one API call, versus large community-report overhead for GraphRAG. That “don’t build a giant secondary summarization layer unless necessary” choice is the main reason it feels lightweight. (Paper §4.5)

2. **Dual-level retrieval**  
   The low-level/high-level split is not cosmetic. It lets LightRAG answer both entity-specific questions and broader topic-sensemaking questions using one retrieval framework. The paper’s ablation section argues this dual-level design is why LightRAG balances depth and breadth better than low-only or high-only variants. (Paper §3.2, §4.3)

3. **Incremental update capability**  
   This is arguably the most practically important innovation. LightRAG is designed to merge new entities/relations into existing graph state instead of forcing a full rebuild. The paper frames this as a major efficiency win in dynamic environments; the repo’s enqueue/merge pipeline supports that claim. (Paper §3.1, §4.5; `lightrag/lightrag.py:1438-1518`; `lightrag/operate.py:1623`, `:1948`)

#### Applicability to Spec Kit Memory

Given your current state:

- `3,854` causal edges
- `79.92%` graph coverage
- dominant `supports` / `caused` relations
- average strength `0.76`
- but `memory_search("Semantic Search")` returns `0` results

…the problem does **not** look like “missing graph structure.” It looks like **graph structure exists but is not being used as a first-class retrieval surface**.

LightRAG suggests several concrete improvements:

1. **Index nodes and relations separately, not just memories/documents**  
   LightRAG keeps vector stores for **entities**, **relations**, and **chunks**. For Spec Kit Memory, that means you should not rely only on memory-document embeddings. Also index:
   - memory-node summaries
   - causal-edge summaries
   - relation-keyword strings
   - local neighborhood summaries  
   This would give “Semantic Search” another path besides raw document similarity. (`lightrag/lightrag.py:661-736`; `README.md` storage section)

2. **Adopt dual-level query decomposition**  
   A query like “Semantic Search” is too underspecified for pure document retrieval. LightRAG would split it into:
   - **low-level/local terms**: semantic, search, embedding, query
   - **high-level/global terms**: retrieval, ranking, graph search, recall gap  
   Then it would search both node-like and relation-like indexes. That is exactly the kind of query that benefits from LightRAG’s low/high split. (Paper §3.2)

3. **Use graph expansion as a retrieval primitive, not just a rerank boost**  
   Your graph already has strong `supports/caused` coverage. LightRAG’s one-hop expansion around matched entities/relations is a natural fit: once you hit one relevant memory or edge, pull its immediate causal/support neighborhood into context automatically. That should help close the “0 direct hits” gap by converting sparse first matches into a useful neighborhood. (Paper §3.2)

4. **Create merged semantic profiles for graph objects**  
   LightRAG continuously merges descriptions for recurring entities and relations. Spec Kit Memory could do the same for:
   - repeated concepts across memories
   - recurrent decision clusters
   - canonical support/causal chains  
   Right now, your graph may have good coverage but poor lexical/semantic addressability. Merged graph-object profiles would make the graph searchable in its own language rather than only via raw memory text. (`lightrag/operate.py:1623`, `:1948`)

5. **Add a zero-result fallback from memory search to graph-enhanced retrieval**  
   If `memory_search` returns 0, do not stop. Fall back automatically to:
   - relation-vector search
   - node-vector search
   - one-hop causal/support expansion
   - prompt assembly from graph context + source memories  
   That is very LightRAG-like, and it directly targets your failure mode.

6. **Expose a context-only debug mode for retrieval inspection**  
   LightRAG’s `only_need_context` / `only_need_prompt` pattern is useful here. Spec Kit Memory should expose:
   - matched nodes
   - matched edges
   - why they matched
   - which source memories were pulled in  
   That would make “why did Semantic Search return nothing?” diagnosable instead of opaque. (`lightrag/base.py:97-100`; `lightrag/operate.py:3202-3281`)

7. **Incrementally update graph retrieval artifacts on ingest**  
   When new memories arrive, update relation summaries, node summaries, and their vector indexes incrementally. Don’t wait for periodic rebuilds. LightRAG’s ingestion model suggests this is operationally tractable and valuable in dynamic corpora. (Paper §4.5; `lightrag/lightrag.py:1438-1518`)

#### Bottom line

LightRAG’s strongest lesson for Spec Kit Memory is this:

Your graph should not just be **evidence for reranking**. It should be a **searchable retrieval substrate**.

If you adopt LightRAG-style:
- dual-level keyword extraction,
- separate node/relation vector indexes,
- one-hop graph expansion,
- merged semantic profiles,
- and zero-result graph fallback,

you are much more likely to turn your existing `3,854` causal edges from passive structure into active recall.

#### Confidence Notes

- **Primary-source-backed claims:** Construction, deduplication, incremental updates, query modes, context/prompt exposure, and dual-level retrieval claims are backed by the cited LightRAG paper and repository code references in this section.
- **Training-knowledge-only or synthesis claims:** Comparative statements about what LightRAG “suggests” for Spec Kit are synthesis from the cited paper and code, not vendor-authored prescriptions.
- **Thin or unavailable documentation:** Public materials are thinner on exact multi-hop depth in the main answer path, the precise distinction between `hybrid` and `mix` terminology across paper vs repo, and rich step-by-step retrieval observability beyond context/prompt exposure.

#### Sources

- HKUDS/LightRAG GitHub repo: `README.md`
- HKUDS/LightRAG GitHub repo: `lightrag/base.py`
- HKUDS/LightRAG GitHub repo: `lightrag/prompt.py`
- HKUDS/LightRAG GitHub repo: `lightrag/operate.py`
- HKUDS/LightRAG GitHub repo: `lightrag/lightrag.py`
- HKUDS/LightRAG GitHub repo: `lightrag/api/README.md`
- LightRAG paper: **“LightRAG: Simple and Fast Retrieval-Augmented Generation”** (arXiv:2410.05779), especially §3.2, §3.3, §4.3, §4.5

### 4.5 Memoripy


#### Construction Strategy

Memoripy builds memory around individual interactions, not around pre-modeled entities or a separate graph database. Each interaction is stored with a UUID, `prompt`, `output`, embedding, timestamp, `access_count`, extracted `concepts`, and a `decay_factor`. Those records are appended to `short_term_memory`; `long_term_memory` is a second list used for promoted items. (`memoripy/memory_manager.py:56-69`, `memoripy/memory_store.py:12-24,26-55`)

Concept extraction is LLM-driven. The chat-model wrappers define an `extract_concepts()` method that prompts the model to return a JSON list of key concepts. So the semantic structure is partly learned from embeddings and partly imposed by model-generated concept tags. (`memoripy/implemented_models.py:57-83,85-111`)

Memoripy then builds two secondary structures:

- A concept graph, where all concepts in one interaction are connected bidirectionally and edge weights increase on repeated co-occurrence.
- A semantic cluster map, where interaction embeddings are grouped by KMeans and stored in `semantic_memory`. (`memoripy/memory_store.py:57-68,183-197`)

The short-term/long-term split is heuristic rather than architectural. The only promotion rule I found is: if an interaction’s `access_count` exceeds 10, it is copied into `long_term_memory`. (`memoripy/memory_store.py:70-75`)

One important caveat: the README and PyPI description say “hierarchical clustering,” but the current code uses a flat KMeans pass with `num_clusters = min(10, len(self.embeddings))`. I did **not** find a true hierarchical clustering algorithm or multi-level cluster tree in the repository I inspected. (`README.md:13-17`, `memoripy/memory_store.py:183-197`)

Another caveat: clustering is triggered during `initialize_memory()`, not automatically after every new interaction. So semantic clusters appear to be built at load time and may become stale during a long-running session unless the caller reinitializes or reclusters manually. (`memoripy/memory_manager.py:84-93`)

#### Traversal Strategy

Memoripy’s retrieval path is hybrid, but simpler than the README marketing language may suggest.

First, it embeds the query and extracts query concepts. Then it scans short-term memories and computes:

`adjusted_similarity = cosine_similarity * decay_factor * log1p(access_count)`

This means retrieval blends semantic similarity, recency/decay, and reinforcement from prior use. (`memoripy/memory_manager.py:95-98`, `memoripy/memory_store.py:77-105`)

After that, it runs spreading activation over the concept graph for two hops with a decay multiplier of `0.5`, and adds the resulting concept activation score onto the adjusted similarity. (`memoripy/memory_store.py:137-156,158-181`)

Then it performs cluster navigation:

- Compute centroid similarity for each cluster.
- Choose the **single** best cluster.
- Return up to 5 top interactions from that cluster by cosine similarity.
- Append them to the result list. (`memoripy/memory_store.py:200-235`)

So traversal is really a 3-part pipeline:

1. Embedding similarity over short-term memory.
2. Concept-graph spreading activation.
3. Best-cluster fallback from semantic clusters.

A few practical observations matter for comparison work:

- Memoripy initializes a FAISS index (`faiss.IndexFlatL2`) but the retrieval code I found does **not** call `index.search()`; it uses a Python-side cosine-similarity scan instead. So FAISS is present, but not meaningfully used in the main retrieval path. (`memoripy/memory_store.py:13-24,77-105`)
- Importance weighting is mostly approximated through `access_count` reinforcement and long-term promotion, not through an explicit importance model.
- Recency has real weight because time decay is exponential and applied directly into the score.
- Long-term memory storage exists, but I am **uncertain** whether long-term memory is actually searched in the current implementation; `retrieve()` operates on short-term embeddings plus semantic clusters built from those embeddings. I did not find a parallel retrieval path over `long_term_memory`. (`memoripy/memory_store.py:77-156,183-235`)

#### UX Transparency

Memoripy is transparent in a developer-facing way, not a product-facing way.

What it does expose:

- Raw memory history via storage backends such as `JSONStorage`, which persists `short_term_memory` and `long_term_memory` as inspectable JSON.
- `load_history()` returns the stored records directly.
- Console `print()` statements reveal when memories are loaded, saved, scored, reinforced, decayed, promoted, and injected into response generation. (`memoripy/json_storage.py:8-33`, `memoripy/in_memory_storage.py`, `memoripy/memory_manager.py:100-119`, `memoripy/memory_store.py:77-156`)

What it does **not** clearly expose:

- No dedicated memory inspection API beyond raw history access.
- No confidence score abstraction.
- No explicit explanation object for “why this memory was retrieved.”
- No user-facing lifecycle timeline or audit model.

There is an internal `total_score`, but that is attached ad hoc during retrieval rather than exposed as a stable scoring API. (`memoripy/memory_store.py:139-147`)

So UX transparency is partial: good enough for a Python developer debugging memory behavior, weak if you want first-class observability, explainability, or user-visible trust signals.

#### Automatic Utilization

Memoripy is “automatic” inside the application loop, but it is not an autonomous memory service.

If the integrator follows the intended flow, Memoripy will:

- Load recent interactions.
- Retrieve relevant prior interactions automatically for a new prompt.
- Inject both recent context and retrieved context into the next LLM call. (`memoripy/memory_manager.py:95-119`, `README.md` example)

It also updates memory state automatically during retrieval:

- Relevant memories get higher `access_count`.
- Their timestamps refresh.
- Their decay factors are increased.
- Non-relevant memories decay further.
- Highly accessed memories are promoted to long-term. (`memoripy/memory_store.py:94-136`)

However, the consolidation triggers are fairly narrow:

- Promotion to long-term is only based on `access_count > 10`.
- Clustering happens at initialization, not continuously.
- Decay is updated during retrieval, not via a background scheduler. (`memoripy/memory_store.py:70-75,85-105,128-136,183-197`; `memoripy/memory_manager.py:84-93`)

So its automatic utilization is best described as **library-managed prompt enrichment plus retrieval-time consolidation**, not always-on autonomous memory maintenance.

#### Key Innovations

Memoripy’s most interesting contribution is not algorithmic novelty; it is packaging.

Its strongest idea is a **lightweight Python-library memory layer** that can be embedded directly into an app without requiring a separate vector DB, graph service, or orchestration stack. It supports local/in-memory JSON persistence and multiple model providers, which makes it easy to prototype. (`setup.py:3-71`, `README.md`, `memoripy/json_storage.py:8-33`)

Its second useful idea is the combination of three simple mechanisms in one place:

- Reinforcement/decay,
- LLM-extracted concepts plus concept graph,
- Semantic clustering over interaction embeddings. (`README.md:7-17`, `memoripy/memory_store.py:57-68,77-156,183-235`, `memoripy/implemented_models.py:57-111`)

Its third notable trait is consolidation by **usage pressure** rather than explicit user curation: repeated successful recalls gradually strengthen memories and eventually promote them. (`memoripy/memory_store.py:70-75,94-136`)

That said, I would not overstate its uniqueness. Many of the underlying ideas are familiar. What Memoripy does well is combine them in a compact, hackable library.

#### Applicability to Spec Kit Memory

Given your state — `3,854` causal edges, `79.92%` coverage, strong `supports/caused` structure, but a retrieval gap where `memory_search("Semantic Search")` returns `0` — the most useful Memoripy-inspired ideas are **query expansion and consolidation**, not its exact storage design.

What seems most transferable:

**1. Query-time concept extraction + graph expansion**

Memoripy extracts concepts from the query and then spreads activation over a concept graph. For Spec Kit Memory, a similar layer could sit on top of `memory_search`:

- Extract concepts from the query phrase “Semantic Search”.
- Expand through aliases, related terms, and causal/support neighborhoods.
- Retry retrieval against expanded concepts and adjacent nodes.

This could help when exact wording misses memories that discuss the same topic under different terms.

**2. Cluster-level fallback retrieval**

If primary search returns zero, fall back to cluster retrieval:

- Search nearest cluster centroids or neighborhood summaries first.
- Then search within the best few clusters.

This is especially useful when the query is semantically right but the index lacks lexical overlap.

**3. Consolidated summary memories for dense neighborhoods**

Memoripy’s “long-term” idea suggests a Spec Kit analogue: synthesize high-signal cluster summaries or causal-neighborhood summaries for dense topics like semantic search, ranking, adaptive retrieval, or graph context. That would reduce fragmentation and create larger retrieval targets.

**4. Reinforcement from successful access**

Spec Kit already has richer structure than Memoripy, but Memoripy’s reinforcement heuristic is still useful as a ranking signal. If certain memories repeatedly help answer search-related queries, that usage data should strengthen future retrieval.

What I would **not** copy directly:

- The current long-term-memory implementation, which appears underutilized in retrieval.
- Flat KMeans as the main consolidation strategy.
- Retrieve-time-only decay.
- LLM concept extraction without strong observability, because that adds cost and variance.

In short: the best Memoripy-inspired improvement for your retrieval gap is a **graph-expanded, concept-aware fallback path** plus **cluster/neighborhood summaries**. Memoripy is weakest where Spec Kit is already strongest: explicit structure and traceability. Spec Kit should borrow its query broadening and consolidation instincts, not its full architecture.

#### Confidence Notes

- **Primary-source-backed claims:** The interaction store, concept extraction, concept graph, reinforcement/decay scoring, cluster fallback, and promotion logic claims are backed by the cited public repository code and PyPI materials.
- **Training-knowledge-only or synthesis claims:** The transfer recommendations for Spec Kit are synthesis. I did not rely on uncited external literature for system-specific claims.
- **Thin or unavailable documentation:** Memoripy has the thinnest documentation in the survey: no paper or formal whitepaper was found, clustering/long-term retrieval behavior is only inferable from code, and some README claims are broader than what I could verify in the implementation.

#### Sources

- GitHub repo: `caspianmoon/memoripy` — README and source code
- PyPI docs: `https://pypi.org/project/memoripy/`
- Key code files inspected: `memoripy/memory_store.py`, `memoripy/memory_manager.py`, `memoripy/implemented_models.py`, `memoripy/json_storage.py`, `setup.py`

#### Uncertainty note

I did **not** find an academic paper or formal whitepaper linked from the official repo or PyPI. If one exists outside those official sources, I missed it. I am also **uncertain** whether Memoripy has a more advanced clustering or long-term retrieval implementation outside the current public code I inspected.

### 4.6 Cognee


#### Construction Strategy

Cognee’s construction model is genuinely **pipeline-driven**, not just a thin wrapper over embeddings. The public `add → cognify → search` workflow is central: `add()` ingests raw inputs into datasets, and `cognify()` transforms them into graph + vector representations for downstream retrieval.[[README](https://github.com/topoteretes/cognee/blob/main/README.md)][[`add.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/add/add.py)][[`cognify.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py)]

On **automated knowledge graph construction from unstructured data**, Cognee is strong. `cognify()` explicitly documents and assembles a staged pipeline:

1. `classify_documents`
2. `extract_chunks_from_documents`
3. `extract_graph_from_data`
4. `summarize_text`
5. `add_data_points`
6. `extract_dlt_fk_edges`

That means Cognee does not rely only on pre-authored triples; it classifies documents, chunks them, uses an LLM to extract entities/relationships, produces summaries, and persists the resulting graph/data points.[[`cognify.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py)]

For the **entity and relation extraction pipeline**, the critical step is `extract_graph_from_data`, which is parameterized by a `graph_model` and optional `custom_prompt`. This is important: extraction is not a fixed black box. Developers can steer extraction using a custom Pydantic graph schema and prompt, which makes Cognee more structured than “embed everything and hope retrieval works.”[[`cognify.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py)]

On **ontology-guided structuring**, Cognee has real support rather than mere marketing language. `cognify()` can load ontology configuration from environment variables, and the ontology layer includes:

- `BaseOntologyResolver`
- `get_default_ontology_resolver()`
- `get_ontology_resolver_from_env()`
- `RDFLibOntologyResolver`

The default/custom resolver path supports RDF/OWL ontology files, fuzzy matching for entity normalization, lookup building for classes/individuals, and ontology subgraph extraction via `get_subgraph()`.[[`get_default_ontology_resolver.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/get_default_ontology_resolver.py)][[`base_ontology_resolver.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/base_ontology_resolver.py)][[`RDFLibOntologyResolver.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/rdf_xml/RDFLibOntologyResolver.py)][[`matching_strategies.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/matching_strategies.py)]

On **multi-source ingestion**, Cognee is broad. `add()` supports:

- raw text
- local file paths
- `file://` URLs
- web URLs
- S3 paths
- binary streams
- lists of mixed inputs
- DLT sources

Its docstring also claims support for PDFs, images, audio, code files, Office docs, CSV/JSON, and web extraction workflows.[[`add.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/add/add.py)][[Installation docs](https://docs.cognee.ai/getting-started/installation#environment-configuration)]

A notable extra is **temporal graph construction**. `temporal_cognify=True` swaps in a different pipeline for event/timestamp extraction and event-to-graph transformation. That makes Cognee more than a static entity graph builder.[[`cognify.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py)]

**Assessment:** Cognee’s construction layer is one of its clearest strengths. It combines unstructured ingestion, structured extraction, schema control, and ontology hooks in a way that is more ambitious than typical vector-first memory systems.

---

#### Traversal Strategy

Cognee’s traversal/query layer is also fairly rich. The public `search()` API supports many query modes, including:

- `GRAPH_COMPLETION`
- `RAG_COMPLETION`
- `CHUNKS`
- `SUMMARIES`
- `TRIPLET_COMPLETION`
- `GRAPH_SUMMARY_COMPLETION`
- `GRAPH_COMPLETION_COT`
- `GRAPH_COMPLETION_CONTEXT_EXTENSION`
- `CYPHER`
- `NATURAL_LANGUAGE`
- `TEMPORAL`
- `CHUNKS_LEXICAL`
- `FEELING_LUCKY`[[`SearchType.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/types/SearchType.py)][[`search.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py)]

That breadth matters because it shows Cognee is not limited to a single retrieval style. It offers **graph query patterns** ranging from graph-backed answer generation to direct Cypher, lexical chunk retrieval, temporal retrieval, and “lucky” auto-selection of query mode.[[`search.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py)][[`get_search_type_retriever_instance.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_search_type_retriever_instance.py)]

On **hybrid search (vector + graph + keyword)**, the evidence is good but slightly nuanced. Cognee clearly supports:

- semantic chunk retrieval (`CHUNKS`)
- lexical/keyword-style retrieval (`CHUNKS_LEXICAL`, Jaccard-based)
- graph/triplet retrieval (`GRAPH_COMPLETION`, `TRIPLET_COMPLETION`, etc.)
- LLM-selected routing (`FEELING_LUCKY`)

So, at the product level, Cognee is hybrid.[[`get_search_type_retriever_instance.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_search_type_retriever_instance.py)][[`select_search_type.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/select_search_type.py)]  
What I could **not** verify from the public code I reviewed is a single always-on fused ranker that simultaneously blends vector + graph + keyword into one score. The public architecture looks more like a **retriever family + router** than a monolithic fusion engine.

On **context assembly from graph paths**, Cognee has a well-defined retrieval pipeline. `get_retriever_output()` does three explicit stages:

1. `get_retrieved_objects`
2. `get_context_from_objects`
3. `get_completion_from_context`

That is good design for explainability and modularity: retrieved graph/chunk objects are first collected, then turned into context, then optionally passed to the LLM for completion.[[`get_retriever_output.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_retriever_output.py)]

On **relevance ranking**, the most interesting exposed knobs are:

- `top_k`
- `wide_search_top_k`
- `triplet_distance_penalty`
- `feedback_influence`
- `node_name` / `node_type` filters
- session-aware parameters

These suggest graph path expansion and path-cost-style ranking are important in graph retrieval, and that interaction history can influence ranking.[[`search.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py)][[`get_search_type_retriever_instance.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_search_type_retriever_instance.py)]

The paper also supports this view: Cognee is described as a **modular framework for end-to-end KG construction and retrieval**, and the authors explicitly study hyperparameters across chunking, graph construction, retrieval, and prompting on multi-hop QA tasks.[[Markovic et al., 2025](https://arxiv.org/abs/2505.24478)]

**Assessment:** Cognee’s traversal strategy is flexible and graph-aware. Its main advantage is not one magical query algorithm, but a broad retriever toolbox with graph-specific modes and tunable ranking behavior.

---

#### UX Transparency

This is the area where I would be most careful.

On **knowledge graph visualization**, I could verify that Cognee has a local UI entry point via `cognee-cli -ui` and a cloud/local API/docs surface.[[`README`](https://github.com/topoteretes/cognee/blob/main/README.md)][[API docs](https://docs.cognee.ai/api-reference/introduction)]  
However, I could **not** verify from the public materials I checked that Cognee ships a first-class, richly documented graph visualization experience comparable to Neo4j Bloom or dedicated graph explorers. The UI clearly exists; the exact graph-visualization depth is unclear.

On **provenance tracking**, Cognee has stronger evidence. It logs queries and results to a relational store, keeps searchable history, and includes OpenTelemetry-native tracing with semantic attributes for search type, query text, pipeline name, result count, DB activity, and LLM metadata.[[`log_query.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_query.py)][[`log_result.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_result.py)][[`get_history.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/get_history.py)][[`tracing.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/observability/tracing.py)][[`README`](https://github.com/topoteretes/cognee/blob/main/README.md)]

On **confidence indicators**, I could not verify any explicit per-result confidence score in the public API surface I reviewed. Search results expose `result_object`, `context`, `completion`, and dataset metadata, but not a confidence/probability field.[[`SearchResultPayload.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/models/SearchResultPayload.py)]  
So if your comparative rubric expects confidence bars or calibrated result confidence, I would score Cognee as **unclear / not publicly evidenced** here.

On **explainable retrieval results**, Cognee does better than many systems, but not perfectly. In verbose mode, search responses can return:

- `text_result`
- `context_result`
- `objects_result`

That means users/developers can inspect not just the final answer, but also supporting context and raw retrieved objects.[[`search.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/search.py)][[`get_retriever_output.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_retriever_output.py)]  
Still, I did **not** verify a polished “why this result was chosen” explanation layer with path-by-path justification.

**Assessment:** Cognee appears reasonably transparent for developers and operators, especially through tracing and verbose retrieval payloads. It is less clearly strong, based on public evidence, on end-user graph visualization and explicit confidence UX.

---

#### Automatic Utilization

Cognee does use the graph proactively, especially at retrieval time.

For **automatic context enrichment for LLM calls**, this is built into its main search path. `GRAPH_COMPLETION` is the default search type, and the retriever pipeline explicitly turns retrieved graph objects into context before generating a completion.[[`search.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py)][[`get_retriever_output.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_retriever_output.py)]

For **graph-informed prompt augmentation**, Cognee exposes several graph-specific completion modes:

- `GRAPH_COMPLETION`
- `GRAPH_SUMMARY_COMPLETION`
- `GRAPH_COMPLETION_COT`
- `GRAPH_COMPLETION_CONTEXT_EXTENSION`
- `TEMPORAL`

These modes imply that prompts are not just fed vector chunks; they are shaped by retrieved graph structures, summaries, or expanded graph context.[[`SearchType.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/types/SearchType.py)][[`get_search_type_retriever_instance.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_search_type_retriever_instance.py)]

For **continuous learning from interactions**, the evidence is partial but real:

- retrieved objects update node access timestamps
- queries/results are logged
- `feedback_influence` is exposed as a ranking parameter
- README claims “learn from feedback” and “continuously learns”[[`get_retriever_output.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_retriever_output.py)][[`search.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py)][[`README`](https://github.com/topoteretes/cognee/blob/main/README.md)]

What I could **not** verify is a robust, documented online learning loop that automatically rewrites graph structure from every interaction. The public evidence supports **interaction logging and ranking influence**, but not necessarily full autonomous graph evolution from feedback alone.

**Assessment:** Cognee definitely uses the graph proactively during retrieval/answering. Its “continuous learning” claim is plausible, but I would describe the publicly verified implementation as **interaction-aware and feedback-capable**, not fully proven self-restructuring memory.

---

#### Key Innovations

What makes Cognee stand out is the combination of three things:

1. **Automated graph construction as a first-class primitive**  
   Many “memory” systems are fundamentally vector stores with some metadata. Cognee instead treats knowledge graph construction as a core pipeline (`cognify()`), with chunking, entity extraction, relation extraction, summarization, and graph/vector persistence all built in.[[`cognify.py`](https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py)]

2. **Practical ontology support**  
   The RDF/OWL resolver, fuzzy matching, and ontology subgraph attachment make Cognee more suitable for domains where terminology normalization matters. This is especially valuable in enterprise or scientific memory, where aliases and controlled vocabularies matter.[[`get_default_ontology_resolver.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/get_default_ontology_resolver.py)][[`RDFLibOntologyResolver.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/rdf_xml/RDFLibOntologyResolver.py)]

3. **Developer-friendly API surface**  
   Cognee is unusually accessible for something this graph-heavy:
   - Python: `add()`, `cognify()`, `search()`
   - CLI: `cognee-cli add|cognify|search|-ui`
   - HTTP API / Swagger
   - configurable graph models
   - background processing
   - support for multiple providers and backends[[`README`](https://github.com/topoteretes/cognee/blob/main/README.md)][[API docs](https://docs.cognee.ai/api-reference/introduction)][[Installation docs](https://docs.cognee.ai/getting-started/installation#environment-configuration)]

A fourth, more subtle innovation is **retrieval mode diversity**. The presence of graph completion, graph summary completion, CoT/context-extension variants, temporal retrieval, lexical fallback, and natural-language-to-search-type routing suggests Cognee is trying to optimize the **interface between KGs and LLMs**, not just the graph itself. That aligns with the framing of the 2025 paper.[[Markovic et al., 2025](https://arxiv.org/abs/2505.24478)]

---

#### Applicability to Spec Kit Memory

Your numbers suggest the core problem is **not graph sparsity**:

- 3,854 causal edges
- 79.92% coverage
- dominant `supports` / `caused`
- average strength `0.76`

That is a reasonably populated causal graph. If `memory_search("Semantic Search")` returns 0 results, the problem looks more like a **retrieval-interface gap** than a graph-construction gap.

Cognee suggests several improvements that could help:

**1. Add a cognify-style extraction layer over memory artifacts.**  
Right now, Spec Kit Memory may have strong causal edges but weak semantic entry points. A Cognee-like pass could extract:

- entities (`Semantic Search`, `hybrid retrieval`, `embedding`, `reranking`, `CocoIndex`)
- typed relations
- summaries
- chunk nodes
- triplets

That would create more retrieval surfaces than causal edges alone.

**2. Add ontology/alias grounding.**  
This is probably the highest-value import. “Semantic Search” might not exist as an exact memory title even though the system contains closely related concepts like `vector search`, `hybrid RAG`, `retrieval`, `embedding search`, `CocoIndex`, or `memory_search`. Cognee’s ontology resolver pattern would help normalize those terms and bridge vocabulary mismatch.[[`RDFLibOntologyResolver.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/rdf_xml/RDFLibOntologyResolver.py)]

**3. Add true hybrid retrieval fallback.**  
If semantic search fails, Spec Kit Memory should not stop. Cognee’s model suggests routing or fallback across:
- semantic/vector retrieval
- lexical retrieval
- summary retrieval
- graph/triplet retrieval
- LLM-selected mode (`FEELING_LUCKY`-style)

In your case, a zero-hit semantic query should automatically fall back to lexical aliases, summary nodes, or graph expansion rather than returning nothing.[[`SearchType.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/types/SearchType.py)][[`select_search_type.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/select_search_type.py)]

**4. Use graph-path expansion from seed hits.**  
Cognee exposes `wide_search_top_k` and `triplet_distance_penalty`, which implies a staged retrieval pattern: get seeds, expand through graph, penalize distant paths, assemble context. Spec Kit Memory could do similar: even if the literal node “Semantic Search” is absent, nearby nodes found by lexical/embedding search could expand through `supports/caused/derived_from` paths to retrieve relevant memories.

**5. Log query/result history and incorporate feedback.**  
Cognee logs queries/results and exposes `feedback_influence`. Spec Kit Memory could use the same pattern to learn which memories are selected after zero-hit or weak-hit cases, then promote aliases, summaries, or graph neighborhoods accordingly.[[`log_query.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_query.py)][[`log_result.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_result.py)][[`get_history.py`](https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/get_history.py)]

**6. Expose retrieval internals for debugging.**  
Cognee’s `result_object + context + completion` split is very useful. Spec Kit Memory would benefit from a debug view that shows:
- query normalization
- matched aliases/ontology terms
- initial seeds
- expanded graph paths
- reranking reasons
- final context bundle

That would make retrieval gaps diagnosable.

**7. Add summary nodes as bridge objects.**  
One likely reason a concept query fails is that raw memories are too specific. Cognee explicitly generates summaries during construction. Spec Kit Memory could generate synthetic “topic summary” nodes for clusters like `Semantic Search`, `Hybrid Search`, `Causal Graph Retrieval`, etc. Those bridge nodes can improve recall dramatically.

**My bottom-line recommendation:**  
The most useful Cognee-inspired improvements for Spec Kit Memory are **ontology grounding, multi-mode retrieval fallback, graph-path context assembly, and summary-node generation**. Given your graph coverage, I would prioritize those over simply adding more causal edges.

#### Confidence Notes

- **Primary-source-backed claims:** Pipeline construction, ontology support, search-type diversity, retriever stages, logging/tracing, and verbose retrieval payload behavior are backed by the cited README, docs, API code, ontology modules, observability modules, and paper.
- **Training-knowledge-only or synthesis claims:** Comparative judgments about which Cognee patterns are highest value for Spec Kit are synthesis rather than direct Cognee claims.
- **Thin or unavailable documentation:** Public evidence is thinner on the depth of graph visualization in the UI, whether there is a single fused ranker versus a routed retriever family, explicit confidence UX, and how far “continuous learning” goes beyond logging plus ranking influence.

---

#### Sources

- Cognee GitHub repo README: https://github.com/topoteretes/cognee/blob/main/README.md
- `add()` API: https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/add/add.py
- `cognify()` API: https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py
- Search API: https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py
- Search types: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/types/SearchType.py
- Retriever factory: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_search_type_retriever_instance.py
- Retriever output pipeline: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_retriever_output.py
- Search result payload: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/models/SearchResultPayload.py
- Ontology resolver entry points: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/get_default_ontology_resolver.py
- Base ontology interface: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/base_ontology_resolver.py
- RDF/OWL ontology resolver: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/rdf_xml/RDFLibOntologyResolver.py
- Matching strategy: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/matching_strategies.py
- Observability/tracing: https://github.com/topoteretes/cognee/blob/main/cognee/modules/observability/tracing.py
- Observe wrapper: https://github.com/topoteretes/cognee/blob/main/cognee/modules/observability/get_observe.py
- Query/result logging: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_query.py and https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_result.py
- Search history: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/get_history.py
- API docs: https://docs.cognee.ai/api-reference/introduction
- Installation/config docs: https://docs.cognee.ai/getting-started/installation#environment-configuration
- Paper: Markovic et al., “Optimizing the Interface Between Knowledge Graphs and LLMs for Complex Reasoning” (2025), https://arxiv.org/abs/2505.24478

### 4.7 Graphiti


#### Construction Strategy

Graphiti builds a **temporal context graph** around three first-class objects: **entities**, **facts/relationships**, and **episodes**. In the OSS model, `EpisodicNode` stores raw ingested content plus a `valid_at` timestamp and links to referenced entity edges, while `EntityNode` stores the canonical entity plus evolving summaries/attributes.[^1][^2] This is important: Graphiti does not treat source text as disposable extraction input; it keeps episodes as provenance-bearing graph nodes.[^3]

Graphiti’s edge model is explicitly temporal. `EntityEdge` stores `valid_at`, `invalid_at`, `expired_at`, and `reference_time`, alongside the fact text and a list of episode IDs that reference the edge.[^4] In practice, this means Graphiti can represent “what was true then” separately from “what is true now,” instead of overwriting prior facts.[^5]

Ingestion is **incremental and episode-based**. `Graphiti.add_episode(...)` retrieves prior episodes for context, creates or reuses the episode node, extracts nodes, resolves/deduplicates nodes, extracts/resolves edges, invalidates contradicted edges, and then persists the updated graph.[^6] The README explicitly positions this as real-time graph evolution without full recomputation.[^5]

Entity deduplication is a **hybrid pipeline**, not LLM-only. The node resolver first does semantic candidate retrieval, then deterministic resolution (exact normalized-name matching and fuzzy MinHash/LSH similarity), and only escalates unresolved cases to an LLM-based dedupe prompt.[^7][^8] The prompt is given previous messages, the current message, the new entity, the entity type description, and existing candidate entities, and is instructed not to fabricate or collapse merely similar entities.[^9] This is more conservative than a pure “LLM decides” approach.

Contradiction resolution is similarly explicit. The edge dedupe prompt asks for both `duplicate_facts` and `contradicted_facts`, and the runtime then invalidates older contradictory edges by setting `edge.invalid_at = resolved_edge.valid_at` and `edge.expired_at = utc_now()` when the temporal windows overlap in the invalidating direction.[^10][^11] So contradictions are not deleted; they become **historically bounded**.

**Bottom line:** Graphiti’s construction strategy is “episodes first, facts second, summaries third.” That is a strong design choice for evolving knowledge.

#### Traversal Strategy

Graphiti’s retrieval is genuinely **hybrid**. The main `search(...)` orchestration runs edge, node, episode, and community searches in parallel, with configurable combinations of **BM25**, **cosine similarity**, and **graph traversal/BFS**.[^12] The predefined recipes confirm this: for example, `COMBINED_HYBRID_SEARCH_CROSS_ENCODER` uses BM25 + cosine similarity + BFS for edges/nodes, BM25 for episodes, and BM25 + cosine similarity for communities.[^13]

Edge reranking is a major part of the design. Graphiti supports multiple rerankers:
- **RRF** (reciprocal rank fusion),
- **MMR**,
- **cross-encoder reranking**,
- **node-distance reranking** relative to a supplied center node,
- **episode-mentions reranking**.[^13][^14]

The reranking pipeline is explicit in `search.py`: candidate result sets are merged, then reranked according to the configured method, with scores returned alongside results in `SearchResults`.[^14][^15]

Graphiti is also **community-aware**, but in the OSS engine this mostly means communities are another retrievable scope: `search(...)` includes a `community_search(...)` branch, recipes can query communities with BM25/cosine similarity, and `SearchResults` has `communities` plus `community_reranker_scores`.[^12][^13][^15] I did **not** find evidence that communities drive every graph walk automatically; rather, they are searchable graph summaries/clusters that can be included in retrieval.

Temporal filtering is first-class. `SearchFilters` supports constraints on `valid_at`, `invalid_at`, `created_at`, and `expired_at`, so users/agents can ask for only currently valid facts or historically bounded slices.[^16] This is one of the strongest parts of Graphiti’s query model.

On “center-node expansion”: Graphiti supports graph-aware reranking around a supplied `center_node_uuid`; the quickstart describes using the top search result’s source node UUID to rerank additional results based on graph distance.[^17] In code, the `node_distance_reranker` computes path-based proximity from the center node and turns that into scores.[^18] That is not the same as unconstrained graph expansion everywhere; it is a **seeded, graph-aware relevance boost**.

#### UX Transparency

Graphiti’s OSS transparency story is **API-level transparency more than product UI transparency**.

The strongest signal is **edge provenance**. Each `EntityEdge` stores a list of episode IDs that reference it (`episodes: list[str]`), and the README emphasizes that every entity/relationship traces back to episodes as the raw ingested ground truth.[^4][^3] There is also an API path to pull nodes and edges by episode (`get_nodes_and_edges_by_episode`), which supports provenance inspection programmatically.[^19]

Temporal metadata is also clearly exposed. Search results carry raw edge objects with `valid_at`/`invalid_at`; the quickstart explicitly tells developers to inspect “Valid at/invalid at” in edge search results; and the helper `search_results_to_context_string(...)` includes `fact`, `valid_at`, and `invalid_at` in the LLM-ready context payload.[^17][^20]

Entity-resolution transparency is more mixed. Internally, Graphiti does keep resolution traces such as `uuid_map` and `duplicate_pairs` during node resolution.[^7] That means the engine *can* explain what it matched and why at the pipeline level. However, I did **not** find evidence that the OSS framework exposes a polished, first-class “resolution audit trail” to end users out of the box. By contrast, the README says **Zep** has dashboard/debug tooling, while **Graphiti** expects you to “build your own tools.”[^21]

For **fact verification**, Graphiti’s model is provenance-plus-temporality rather than a separate verifier subsystem. A developer can inspect:
- the fact edge,
- its `valid_at`/`invalid_at`,
- the episode IDs that support it,
- and the original episode content returned in search results/context helpers.[^4][^20]

That is useful for verification, but I am **uncertain** whether to call this a full verification workflow in the UX sense; in OSS Graphiti it looks more like **verifiable evidence exposure** than a dedicated fact-check UI.[^21]

#### Automatic Utilization

Graphiti includes clear hooks for **automatic graph use inside agent workflows**.

The most direct evidence is `search_results_to_context_string(...)`, which reformats retrieved **facts, entities, episodes, and communities** into a structured string intended to be passed directly to an LLM as context.[^20] So Graphiti does not just retrieve graph objects; it includes a built-in path for injecting them into agent prompts.

Relevance scoring is automatic and configurable. Search executes multiple retrieval channels in parallel and returns reranker scores (`edge_reranker_scores`, `node_reranker_scores`, etc.).[^12][^15] Depending on configuration, relevance can come from fused lexical/semantic ranks (RRF), diversity-aware reranking (MMR), cross-encoder ranking, node-distance, or episode-mention signals.[^13][^14] In other words, Graphiti’s relevance layer is not hardcoded to one retrieval philosophy.

Contradiction invalidation is also automatic during ingestion. When a new fact contradicts an older valid fact, the older edge is not removed; it is marked invalid by temporal bounds (`invalid_at`, `expired_at`).[^10][^11] This is one of Graphiti’s most important “automatic utilization” behaviors, because it keeps retrieval from surfacing stale facts as currently true.

On **temporal decay**, I need to be explicit: **I could not find an explicit age-based decay scoring function** in the OSS search stack. What I *did* find is:
- temporal filtering over `valid_at` / `invalid_at` / `expired_at`, and
- prompt/context injection that tells the downstream LLM how to interpret those windows.[^16][^20]

So Graphiti clearly uses temporal metadata, but I would not claim it implements a separate “recency decay” ranker unless stronger evidence appears.

#### Key Innovations

The most distinctive Graphiti innovation is its **temporal-first design**. Many graph-memory systems store timestamps as annotations; Graphiti bakes temporal validity into the core edge model and contradiction lifecycle.[^4][^5] That gives it a stronger answer to “what changed?” than conventional graph-RAG systems.

A second innovation is **episode-based ingestion**. Episodes are not merely logs; they are the provenance backbone of the graph. Every derived fact can be traced back to one or more episodes, and ingestion uses previous episodes as context during extraction/resolution.[^3][^6][^9] This makes Graphiti feel closer to a continuously maintained memory substrate than to a document-index-plus-graph veneer.

A third innovation is **contradiction-aware maintenance**. The system explicitly asks the LLM to separate duplicates from contradictions and then converts contradictions into bounded historical state rather than destructive overwrite.[^10][^11] That is stronger than naive “latest mention wins.”

The fourth innovation is that Graphiti combines **hybrid retrieval with graph-native reranking** rather than treating graph traversal as a post-processing trick. BM25, vector search, BFS, node-distance reranking, and episode-mention reranking are all native search concepts.[^12][^13][^14]

How it differs from **Zep’s managed service** is also clear in the README:
- **Graphiti** = OSS temporal context graph engine.
- **Zep** = managed context graph infrastructure with governance, user/thread management, production retrieval, dashboards/debug logs, SDKs, enterprise features, and scale/perf guarantees.[^21]

So Graphiti is the engine; Zep is the operational product built around that engine.

#### Applicability to Spec Kit Memory

Your current state is interesting: **3,854 causal edges**, **79.92% coverage**, dominant `supports/caused` relations, average strength **0.76**—but retrieval for `memory_search("Semantic Search")` returns **0 results**. That suggests the graph is not the main problem; **retrieval alignment is**.

Graphiti suggests several improvements that could help:

#### 1. Add episode/provenance-backed retrieval alongside abstract memories
Graphiti does not rely only on canonical facts; it also retrieves **episodes** and uses them as source evidence.[^12][^20] If Spec Kit Memory mostly indexes normalized memories plus causal edges, a retrieval miss may happen when the query language matches neither the canonical memory title nor the causal neighborhood. Adding “episode-like” raw provenance retrieval could catch terms such as “Semantic Search” even when the canonical node/edge labels differ.

**Likely benefit:** Better recall on user phrasing mismatch.

#### 2. Separate duplicate detection from contradiction handling
Graphiti explicitly distinguishes:
- duplicate facts,
- contradictory facts,
- still-valid historical facts.[^10][^11]

If Spec Kit Memory mainly stores support/causal relations but not temporal invalidation, older terms and newer terms may compete implicitly or get flattened. A Graphiti-style invalidation model could preserve lineage while still surfacing the currently authoritative terminology.

**Likely benefit:** Better “current truth” retrieval without deleting history.

#### 3. Introduce hybrid retrieval over memories + edges + provenance
Your gap (“Semantic Search” -> 0 results) sounds like a classic case where one retrieval mode fails. Graphiti mitigates this with BM25 + vector + graph traversal + reranking.[^12][^13] If Spec Kit Memory is over-indexed on semantic/vector retrieval or graph relations but under-indexed on lexical aliases, BM25 and RRF-style fusion could materially improve first-pass recall.

**Likely benefit:** Better robustness to exact-term vs conceptual-term mismatch.

#### 4. Use seeded graph reranking instead of only broad neighborhood recall
Graphiti’s center-node / node-distance reranking lets it privilege facts near a relevant anchor node.[^17][^18] In Spec Kit Memory, once a likely “semantic search subsystem” node is found, reranking adjacent causal/support edges by graph distance or edge strength could help assemble the right packet even if the initial query is sparse.

**Likely benefit:** Better precision after first recall.

#### 5. Expose temporal/currentness in retrieval scoring
Even though I did not find explicit decay scoring in Graphiti, its retrieval model consistently respects `valid_at` / `invalid_at` and injects that metadata into downstream context.[^16][^20] If Spec Kit Memory returns nothing for a term that historically existed or changed names, a temporal-aware alias/history layer could prevent silent misses.

**Likely benefit:** Reduced retrieval failure from terminology drift.

#### 6. Preserve and query resolution traces / alias maps
Graphiti’s node resolver keeps `uuid_map` and duplicate pairing state internally.[^7] Spec Kit Memory likely needs a stronger alias-resolution surface: e.g. “semantic search,” “CocoIndex,” “hybrid retrieval,” “memory search,” “vector search,” “code search” may live in separate semantic neighborhoods. A Graphiti-style resolution pass could consolidate those into retrievable equivalence neighborhoods.

**Likely benefit:** Better entity/query normalization before retrieval.

#### Overall Assessment

Graphiti is strongest where memory systems usually struggle: **change over time, provenance, and hybrid retrieval composition**. Its biggest transferable ideas for Spec Kit Memory are:

- treat raw source episodes as retrievable evidence, not just preprocessing input;
- make contradictions invalidate old facts temporally instead of flattening them;
- use multi-channel retrieval (lexical + semantic + graph) by default;
- add stronger alias/entity resolution traces;
- and rerank around graph anchors once partial recall succeeds.

If your graph already has high structural coverage but query recall is poor, Graphiti’s lesson is straightforward: **more edges are not enough; you need better ingestion provenance, alias resolution, and hybrid retrieval fusion**.

#### Confidence Notes

- **Primary-source-backed claims:** Temporal graph objects, contradiction invalidation, episode-backed provenance, hybrid search, reranker types, filters, and context-string generation are backed by the cited OSS README and code references in this section.
- **Training-knowledge-only or synthesis claims:** Comparative statements about what is most transferable to Spec Kit and the broader “engine vs product” framing are synthesis from the cited materials rather than explicit Graphiti claims.
- **Thin or unavailable documentation:** Public OSS docs are thinner on polished resolution-audit UX, full verification workflow surfaces, and any explicit age-based decay ranker beyond temporal filtering and context exposure.

---

[^1]: `getzep/graphiti`, `graphiti_core/nodes.py:315-325`
[^2]: `getzep/graphiti`, `graphiti_core/nodes.py:492-499`
[^3]: `getzep/graphiti`, `README.md:75-82`
[^4]: `getzep/graphiti`, `graphiti_core/edges.py:263-285`
[^5]: `getzep/graphiti`, `README.md:123-135`
[^6]: `getzep/graphiti`, `graphiti_core/graphiti.py:916-1158`
[^7]: `getzep/graphiti`, `graphiti_core/utils/maintenance/node_operations.py:490-570`
[^8]: `getzep/graphiti`, `graphiti_core/utils/maintenance/dedup_helpers.py:220-279`
[^9]: `getzep/graphiti`, `graphiti_core/prompts/dedupe_nodes.py:53-90`
[^10]: `getzep/graphiti`, `graphiti_core/prompts/dedupe_edges.py:24-32,43-70`
[^11]: `getzep/graphiti`, `graphiti_core/utils/maintenance/edge_operations.py:457-492`
[^12]: `getzep/graphiti`, `graphiti_core/search/search.py:98-240`
[^13]: `getzep/graphiti`, `graphiti_core/search/search_config_recipes.py:33-140`
[^14]: `getzep/graphiti`, `graphiti_core/search/search.py:355-430`
[^15]: `getzep/graphiti`, `graphiti_core/search/search_config.py:121-129`
[^16]: `getzep/graphiti`, `graphiti_core/search/search_filters.py:55-67,120-209`
[^17]: `getzep/graphiti`, `examples/quickstart/README.md`
[^18]: `getzep/graphiti`, `graphiti_core/search/search_utils.py:1798-1857`
[^19]: `getzep/graphiti`, `graphiti_core/graphiti.py:1560-1572`
[^20]: `getzep/graphiti`, `graphiti_core/search/search_helpers.py:27-72`
[^21]: `getzep/graphiti`, `README.md:102-118`

## 5. Feature Flag Cross-Reference

This section maps the ranked improvements to currently documented Spec Kit feature flags or identifies gaps where no clean flag currently exists.

| Improvement | Existing flag(s) / feature(s) | Status |
|---|---|---|
| Graph-side rescue for empty/weak results | `SPECKIT_SEARCH_FALLBACK`, `SPECKIT_EMPTY_RESULT_RECOVERY_V1`, `SPECKIT_GRAPH_UNIFIED`, `SPECKIT_GRAPH_SIGNALS`, `SPECKIT_GRAPH_WALK_ROLLOUT` | Partial |
| Searchable node/edge/community/topic text surfaces | `SPECKIT_MEMORY_SUMMARIES`, `SPECKIT_QUERY_SURROGATES` | Partial |
| Query-to-graph alias routing / ontology grounding | `SPECKIT_GRAPH_CONCEPT_ROUTING`, `SPECKIT_QUERY_SURROGATES`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENTITY_LINKING` | Partial |
| Community/topic summary retrieval | `SPECKIT_COMMUNITY_DETECTION`, `SPECKIT_GRAPH_CALIBRATION_PROFILE` | Partial |
| Graph evidence in answer UX | `SPECKIT_RESPONSE_TRACE`, `SPECKIT_RESULT_EXPLAIN_V1`, `SPECKIT_RESULT_CONFIDENCE_V1`, `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`, `SPECKIT_RESPONSE_PROFILE_V1` | Present |
| Fuse graph evidence into final ranker | `SPECKIT_ADAPTIVE_FUSION`, `SPECKIT_RRF`, `SPECKIT_MMR`, `SPECKIT_CROSS_ENCODER`, `SPECKIT_LEARNED_STAGE2_COMBINER`, `SPECKIT_MEMORY_ADAPTIVE_RANKING` | Partial |
| Session-aware graph co-activation | `SPECKIT_COACTIVATION`, `SPECKIT_SESSION_BOOST`, `SPECKIT_SESSION_RETRIEVAL_STATE_V1`, `SPECKIT_WORKING_MEMORY`, `SPECKIT_TYPED_TRAVERSAL` | Present |
| Incremental graph refresh / graph enrichment | `SPECKIT_GRAPH_REFRESH_MODE`, `SPECKIT_LLM_GRAPH_BACKFILL` | Present |
| Temporal/currentness-aware retrieval | `SPECKIT_TEMPORAL_CONTIGUITY`, `SPECKIT_EVENT_DECAY`, `SPECKIT_HYBRID_DECAY_POLICY` | Partial |
| Provenance-rich envelopes | `SPECKIT_RESPONSE_TRACE`, `15--retrieval-enhancements/08-provenance-rich-response-envelopes.md` | Present |
| Learned repair from failures / feedback | `SPECKIT_LEARN_FROM_SELECTION`, `SPECKIT_BATCH_LEARNED_FEEDBACK`, `SPECKIT_IMPLICIT_FEEDBACK_LOG`, `SPECKIT_SHADOW_FEEDBACK` | Present |
| Debug activation-flow view | `SPECKIT_RESPONSE_TRACE`, `SPECKIT_RESULT_EXPLAIN_V1`, `SPECKIT_EXTENDED_TELEMETRY` | Partial |
| Explicit episode/provenance substrate | No direct documented `SPECKIT_*` equivalent found | Gap |
| Ontology-backed normalization layer | No direct ontology-resolver flag found | Gap |
| Global/community search mode with map-reduce synthesis | No explicit GraphRAG-style global-mode flag found | Gap |
| DRIFT-style broad-then-local recovery traversal | No explicit DRIFT-style mode found | Gap |

### Cross-Reference Interpretation

- Spec Kit already has a **surprisingly strong flag surface** for graph activation, explainability, ranking, fallback, and telemetry.  
- The biggest gaps are not “graph exists vs graph absent,” but:
  1. explicit **topic/community summary artifacts** as searchable first-class outputs,
  2. explicit **episode/provenance substrate** for derived graph facts,
  3. more **graph-native rescue behavior** on empty/weak result paths,
  4. stronger **ontology / alias normalization** beyond current concept routing.

## 6. UX Transparency Patterns

At least three reusable patterns emerge across the external systems.

### Pattern 1: Explain every graph-assisted result with anchor + path + provenance
- Show which node/concept was matched.
- Show which edge/path or community caused retrieval.
- Show the originating memory/source object(s).
- External inspiration: Zep API edge/node/episode returns; GraphRAG data references; Graphiti episode-backed facts; Mem0 relation side channel.

### Pattern 2: Distinguish summary layer from evidence layer
- Present a concise summary first.
- Let users expand to raw supporting graph objects and source memories.
- External inspiration: GraphRAG community reports + source references; LightRAG `only_need_context` / `only_need_prompt`; Cognee `text_result` + `context_result` + `objects_result`.

### Pattern 3: Make empty/weak-result states diagnostic, not silent
- If no main result exists, return graph candidates, nearby topics, alternative query terms, and reason codes.
- External inspiration: Mem0 relation side channel; LightRAG context inspection; GraphRAG DRIFT-style recovery; Spec Kit’s own `SPECKIT_EMPTY_RESULT_RECOVERY_V1` makes this especially feasible.

### Pattern 4: Surface currentness and contradiction state
- Show whether a relation is current, historical, superseded, or uncertain.
- External inspiration: Zep/Graphiti `valid_at` / `invalid_at`; Mem0 soft invalidation.

## 7. Automatic Utilization Patterns

### Pattern 1: Graph-assisted zero-hit rescue
When lexical/vector retrieval underperforms, automatically try:
- concept alias routing,
- node/edge summary search,
- graph neighbor expansion,
- topic/community summary fallback,
- graph-informed reranking.

External inspiration: LightRAG hybrid + one-hop expansion, GraphRAG DRIFT, Mem0 graph side channel, Zep hybrid retrieval.

### Pattern 2: Session-aware co-activation
Bias retrieval toward currently active graph regions using:
- recent retrieval hits,
- working-memory anchors,
- recent episodes/interactions,
- repeated mention frequency.

External inspiration: Zep recent-episode seeding and mention reranking; Memoripy reinforcement/activation; Spec Kit already has co-activation/session state primitives.

### Pattern 3: Precompute retrieval artifacts at ingest time
Generate searchable bridge artifacts before queries arrive:
- summaries,
- topic/community reports,
- alias tables,
- node/edge fact strings,
- canonical concept profiles.

External inspiration: GraphRAG community reports, LightRAG merged profiles, Cognee summaries, Zep community summaries.

### Pattern 4: Learn from failures and selections
Track which fallback paths, graph paths, and aliases actually resolve weak queries, then promote them in future retrieval.
- External inspiration: Cognee feedback influence; Memoripy reinforcement; Mem0 consolidation patterns.

## 8. Gap Analysis

| External pattern | Current Spec Kit state | Priority | Why now |
|---|---|---|---|
| Hybrid lexical + semantic + graph retrieval | Present | P2 | Already exists, so the immediate problem is utilization quality rather than feature absence. |
| Query-time concept alias routing | Present | P1 | The `Semantic Search` miss suggests the current routing layer may exist but still not bridge user phrasing reliably. |
| Graph rescue when semantic search returns zero | Partial | P0 | This maps directly to the observed user-facing failure: `memory_search("Semantic Search")` still returns nothing. |
| Edge/node/community search as first-class retrieval objects | Partial | P0 | Retrieval cannot exploit graph structure consistently if only documents are first-class search targets. |
| Searchable node/edge summaries | Partial | P0 | The known gap looks like a text-surface problem as much as a graph-coverage problem. |
| Searchable community/topic summaries | Absent | P0 | Broad concept queries need bridge artifacts above single memories or edges to avoid zero-hit responses. |
| Graph community summaries as answer artifacts | Absent | P1 | Once summaries exist, surfacing them improves user understanding and makes graph retrieval visible. |
| Distinct global thematic search mode | Absent | P1 | Thematic and architectural questions are likely to remain under-served by local retrieval alone. |
| DRIFT-style broad-then-local recovery traversal | Absent | P1 | This is a strong recovery pattern for sparse or vocabulary-mismatched queries like `Semantic Search`. |
| Episode/provenance-backed raw evidence layer | Absent | P1 | Provenance becomes more important as graph-derived summaries and paths start to influence final answers. |
| Temporal invalidation / currentness on graph truth | Partial | P2 | Currentness matters, but it is less urgent than fixing the immediate recall failure for active users. |
| Focal-node / graph-distance reranking | Partial | P1 | Precision after first recall will matter once graph rescue begins surfacing larger candidate sets. |
| Session-aware co-activation / recent-region bias | Present | P2 | Helpful for quality, but not the first bottleneck when the system still misses obvious zero-result cases. |
| Graph evidence in answer payloads | Present | P1 | Visibility is needed as soon as graph retrieval starts rescuing results so users can trust what changed. |
| Confidence / explainability surfaces | Present | P1 | Confidence should surface alongside graph rescue to distinguish strong matches from fallback-based rescues. |
| Debug activation-flow trace | Partial | P0 | Diagnosis is blocked without seeing normalization, seed selection, expansion, and filter decisions on failed queries. |
| Ontology-backed alias normalization | Absent | P0 | Alias mismatch is a top candidate root cause for the `Semantic Search` family of misses. |
| Feedback-driven promotion of graph aliases / summaries | Partial | P1 | Once rescue paths exist, learned promotion is the cheapest way to keep repeated misses from recurring. |
| Incremental graph refresh and enrichment | Present | P2 | Important for long-term quality, but not the most likely immediate bottleneck for the current zero-hit case. |

### Diagnosis Gate for the `Semantic Search` Zero-Result Path

Before implementing any 3-step fix for the `Semantic Search` query family, first trace the existing retrieval pipeline end to end. The system already has empty-result recovery payloads, concept routing, query surrogates, and memory-summary search, so the diagnosis should determine whether the current failure is caused by filters, flag gating, alias mismatch, or genuinely missing graph artifacts. That diagnosis gate matters because the right fix differs by bottleneck: filter bugs need pipeline correction, flag gating needs runtime enablement, alias mismatch needs normalization or surrogate repair, and missing artifacts need new node/edge/community summary generation.

## 9. Sources

### Shared / External System URLs

- Zep Graphiti paper: https://arxiv.org/html/2501.13956
- Zep Graphiti overview: https://help.getzep.com/graphiti/getting-started/overview
- Zep graph overview: https://help.getzep.com/graph-overview
- Zep adding episodes: https://help.getzep.com/graphiti/core-concepts/adding-episodes
- Zep searching the graph: https://help.getzep.com/graphiti/working-with-data/searching
- Zep quick start: https://help.getzep.com/graphiti/getting-started/quick-start
- Zep SDK graph search: https://help.getzep.com/sdk-reference/graph/search
- Zep reading graph: https://help.getzep.com/v2/reading-data-from-the-graph
- Zep understanding the graph: https://help.getzep.com/v2/understanding-the-graph
- Zep Agent Memory product page: https://www.getzep.com/product/agent-memory/
- Zep State of the Art Agent Memory blog: https://blog.getzep.com/state-of-the-art-agent-memory/
- Graphiti README: https://raw.githubusercontent.com/getzep/graphiti/main/README.md

- Mem0 GitHub README: https://github.com/mem0ai/mem0
- Mem0 graph memory docs: https://docs.mem0.ai/open-source/features/graph-memory
- Mem0 platform graph docs: https://docs.mem0.ai/platform/features/graph-memory
- Mem0 memory types docs: https://docs.mem0.ai/core-concepts/memory-types
- Mem0 add-memory docs: https://docs.mem0.ai/core-concepts/memory-operations/add
- Mem0 vector-vs-graph cookbook: https://docs.mem0.ai/cookbooks/essentials/choosing-memory-architecture-vector-vs-graph
- Mem0 paper: https://arxiv.org/html/2504.19413v1
- Mem0 main.py: https://github.com/mem0ai/mem0/blob/main/mem0/memory/main.py
- Mem0 graph_memory.py: https://github.com/mem0ai/mem0/blob/main/mem0/memory/graph_memory.py
- Mem0 graphs/utils.py: https://github.com/mem0ai/mem0/blob/main/mem0/graphs/utils.py
- Mem0 DeepWiki graph overview: https://deepwiki.com/mem0ai/mem0/4.1-graph-memory-overview
- Mem0 DeepWiki entity extraction: https://deepwiki.com/mem0ai/mem0/4.3-entity-and-relationship-extraction
- Mem0 DeepWiki graph search: https://deepwiki.com/mem0ai/mem0/4.4-graph-search-and-retrieval

- Microsoft GraphRAG README: https://github.com/microsoft/graphrag/blob/main/README.md
- GraphRAG paper: https://arxiv.org/abs/2404.16130
- GraphRAG default dataflow: https://github.com/microsoft/graphrag/blob/main/docs/index/default_dataflow.md
- GraphRAG outputs: https://github.com/microsoft/graphrag/blob/main/docs/index/outputs.md
- GraphRAG query overview: https://github.com/microsoft/graphrag/blob/main/docs/query/overview.md
- GraphRAG local search docs: https://github.com/microsoft/graphrag/blob/main/docs/query/local_search.md
- GraphRAG global search docs: https://microsoft.github.io/graphrag/query/global_search/
- GraphRAG DRIFT search docs: https://github.com/microsoft/graphrag/blob/main/docs/query/drift_search.md
- Local search prompt template: https://github.com/microsoft/graphrag/blob/main/packages/graphrag/graphrag/prompts/query/local_search_system_prompt.py
- Global search reduce prompt template: https://github.com/microsoft/graphrag/blob/main/packages/graphrag/graphrag/prompts/query/global_search_reduce_system_prompt.py
- DRIFT prompt templates: https://github.com/microsoft/graphrag/blob/main/packages/graphrag/graphrag/prompts/query/drift_search_system_prompt.py
- Dynamic community selection blog: https://www.microsoft.com/en-us/research/blog/graphrag-improving-global-search-via-dynamic-community-selection/
- DRIFT blog: https://www.microsoft.com/en-us/research/blog/introducing-drift-search-combining-global-and-local-search-methods-to-improve-quality-and-efficiency/
- GraphRAG Responsible AI transparency: https://github.com/microsoft/graphrag/blob/main/RAI_TRANSPARENCY.md

- LightRAG GitHub repo: https://github.com/HKUDS/LightRAG
- LightRAG paper: https://arxiv.org/abs/2410.05779

- Memoripy GitHub repo: https://github.com/caspianmoon/memoripy
- Memoripy PyPI: https://pypi.org/project/memoripy/

- Cognee GitHub repo README: https://github.com/topoteretes/cognee/blob/main/README.md
- Cognee add API: https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/add/add.py
- Cognee cognify API: https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/cognify/cognify.py
- Cognee search API: https://github.com/topoteretes/cognee/blob/main/cognee/api/v1/search/search.py
- Cognee SearchType: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/types/SearchType.py
- Cognee retriever factory: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_search_type_retriever_instance.py
- Cognee retriever output: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/methods/get_retriever_output.py
- Cognee SearchResultPayload: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/models/SearchResultPayload.py
- Cognee ontology resolver entry: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/get_default_ontology_resolver.py
- Cognee ontology base: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/base_ontology_resolver.py
- Cognee RDF resolver: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/rdf_xml/RDFLibOntologyResolver.py
- Cognee matching strategies: https://github.com/topoteretes/cognee/blob/main/cognee/modules/ontology/matching_strategies.py
- Cognee observability tracing: https://github.com/topoteretes/cognee/blob/main/cognee/modules/observability/tracing.py
- Cognee observe wrapper: https://github.com/topoteretes/cognee/blob/main/cognee/modules/observability/get_observe.py
- Cognee log_query: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_query.py
- Cognee log_result: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/log_result.py
- Cognee history: https://github.com/topoteretes/cognee/blob/main/cognee/modules/search/operations/get_history.py
- Cognee API docs: https://docs.cognee.ai/api-reference/introduction
- Cognee installation docs: https://docs.cognee.ai/getting-started/installation#environment-configuration
- Cognee paper: https://arxiv.org/abs/2505.24478

- Graphiti GitHub repo: https://github.com/getzep/graphiti

### Feature Catalog / Spec Kit References

- Search Pipeline Features (SPECKIT_*): `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`
- Debug and Telemetry feature flags: `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md`
- Community detection: `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detection.md`
- Graph lifecycle refresh: `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/13-graph-lifecycle-refresh.md`
- LLM graph backfill: `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md`
- Graph calibration profiles: `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md`
- Typed traversal: `.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.md`
- Query intent router: `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md`
- Query expansion: `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md`
- Query surrogates: `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/09-index-time-query-surrogates.md`
- Graph concept routing: `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-graph-concept-routing.md`
- Result explainability: `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/14-result-explainability.md`
- Progressive disclosure: `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/16-progressive-disclosure.md`
- Retrieval session state: `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/17-retrieval-session-state.md`
- Empty result recovery: `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/18-empty-result-recovery.md`
- Result confidence: `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/19-result-confidence.md`
- Provenance-rich response envelopes: `.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md`
