# LightRAG Deep Technical Analysis

## 1. Metadata

| Field | Value |
|-------|-------|
| Research ID | RES-140-LIGHTRAG-001 |
| Status | Complete |
| Date | 2026-02-26 |
| Repository | https://github.com/HKUDS/LightRAG |
| Scope | Architecture, RAG pipeline, graph construction, dual-level retrieval, scoring |
| Relevance | Improving spec-kit memory MCP hybrid retrieval and causal graph traversal |

---

## 2. Executive Summary

LightRAG is a graph-augmented RAG framework that constructs a knowledge graph from documents via LLM-based entity/relationship extraction, then performs dual-level retrieval (local entity-centric + global relationship-centric) combined with vector chunk search. Its 4-stage query pipeline (Search -> Truncate -> Merge -> Build Context) and round-robin fusion of heterogeneous result sources offer directly applicable patterns for improving our memory MCP's retrieval quality. The most impactful findings for our system are: (1) keyword-decomposed dual-path search, (2) graph-degree-weighted ranking of relationships, (3) round-robin interleaving for multi-source result fusion, and (4) unified token budget management across context components.

---

## 3. Architecture Overview

### ASCII Architecture Diagram

```
                         LightRAG Architecture
                         =====================

  INDEXING PIPELINE                        QUERY PIPELINE
  ================                         ==============

  Document Input                           User Query
       |                                        |
       v                                        v
  +-----------+                         +----------------+
  | Chunking  |                         | Keyword Extract|
  | (token-   |                         | (LLM: hi/lo   |
  |  based)   |                         |  level split)  |
  +-----------+                         +----------------+
       |                                   |          |
       v                                   v          v
  +----------------+              +-----------+  +-----------+
  | Entity/Rel     |              | LOCAL     |  | GLOBAL    |
  | Extraction     |              | (entity   |  | (relation |
  | (LLM + gleaning|              |  VDB ->   |  |  VDB ->   |
  |  + merge)      |              |  graph    |  |  graph    |
  +----------------+              |  edges)   |  |  entities)|
       |       |                  +-----------+  +-----------+
       v       v                       |              |
  +--------+ +--------+               v              v
  | Entity | | Rel    |         +---------------------------+
  | VDB    | | VDB    |         | Round-Robin Merge         |
  +--------+ +--------+         | (entities + relations     |
       |       |                |  deduplicated)            |
       v       v                +---------------------------+
  +-----------------+                     |
  | Knowledge Graph |                     v
  | (NetworkX/      |          +--------------------+
  |  Neo4j/PG)      |         | Token Truncation    |
  +-----------------+         | (entity/rel budgets)|
       |                      +--------------------+
       v                                |
  +------------+                        v
  | Text Chunk |              +-------------------+
  | KV Store   |              | Chunk Merge       |
  +------------+              | (entity + rel +   |
       |                      |  vector chunks    |
       v                      |  round-robin)     |
  +------------+              +-------------------+
  | Chunk VDB  |                        |
  +------------+                        v
                              +-------------------+
                              | Context Build     |
                              | (KG + chunks +    |
                              |  references)      |
                              +-------------------+
                                        |
                                        v
                              +-------------------+
                              | LLM Generation    |
                              | (with caching)    |
                              +-------------------+
```

### Component Summary

| Component | Implementation | Purpose |
|-----------|---------------|---------|
| Entity VDB | NanoVectorDB/PG/Milvus/etc | Semantic search over entity descriptions |
| Relationship VDB | NanoVectorDB/PG/Milvus/etc | Semantic search over relationship keywords |
| Knowledge Graph | NetworkX/Neo4j/PostgreSQL | Store entities as nodes, relationships as edges with properties |
| Text Chunk KV Store | JSON/PG/MongoDB/Redis | Store raw text chunks with metadata |
| Chunk VDB | Same as entity VDB | Vector search over raw text chunks (for mix mode) |
| LLM Response Cache | JSON KV Store | Cache entity extraction and query responses |

[SOURCE: `lightrag/lightrag.py`:131-200, `lightrag/base.py`:1-50]

---

## 4. RAG Pipeline: Detailed Flow

### 4.1 Indexing Pipeline

The indexing pipeline transforms documents into a searchable knowledge graph plus vector indices:

**Step 1: Document Chunking**

```python
# [SOURCE: lightrag/operate.py:99-162]
def chunking_by_token_size(
    tokenizer: Tokenizer,
    content: str,
    split_by_character: str | None = None,
    split_by_character_only: bool = False,
    chunk_overlap_token_size: int = 100,
    chunk_token_size: int = 1200,
) -> list[dict[str, Any]]:
    tokens = tokenizer.encode(content)
    results: list[dict[str, Any]] = []
    # ... sliding window with overlap
    for index, start in enumerate(
        range(0, len(tokens), chunk_token_size - chunk_overlap_token_size)
    ):
        chunk_content = tokenizer.decode(tokens[start : start + chunk_token_size])
        results.append({
            "tokens": min(chunk_token_size, len(tokens) - start),
            "content": chunk_content.strip(),
            "chunk_order_index": index,
        })
    return results
```

- Default chunk size: 1200 tokens with 100 token overlap
- Supports character-based splitting (e.g., by paragraph) with fallback to token sliding window
- Each chunk tracked by `chunk_order_index` for provenance

**Relevance to our system: Medium** -- Our memory files are typically small (< 2000 tokens), so chunking is less critical. However, the overlap pattern could improve how we handle large memory files that get chunked.

**Step 2: Entity and Relationship Extraction**

```python
# [SOURCE: lightrag/operate.py:2781-2870]
async def extract_entities(chunks, global_config, ...):
    # For each chunk:
    # 1. Send to LLM with entity_extraction_system_prompt
    # 2. LLM returns structured entity/relation tuples
    # 3. Optional "gleaning" pass for missed entities
    # 4. Merge gleaning results (keep longer descriptions)

    final_result = await use_llm_func_with_cache(
        entity_extraction_user_prompt,
        use_llm_func,
        system_prompt=entity_extraction_system_prompt,
    )
    maybe_nodes, maybe_edges = await _process_extraction_result(
        final_result, chunk_key, timestamp, file_path, ...
    )
```

The extraction prompt (from `lightrag/prompt.py`) produces structured output:
- Entities: `entity<|#|>entity_name<|#|>entity_type<|#|>entity_description`
- Relations: `relation<|#|>source_entity<|#|>target_entity<|#|>relationship_keywords<|#|>relationship_description`

Key design decisions:
- Uses a delimiter-based format (`<|#|>`) rather than JSON for more reliable LLM output
- Entity types are configurable: `["Person","Organization","Location","Event","Concept",...]`
- "Gleaning" is a second LLM pass to catch missed entities (configurable via `entity_extract_max_gleaning`)
- When gleaning finds a duplicate entity, the longer description wins

**Relevance to our system: HIGH** -- This entity/relationship extraction pattern could auto-generate causal links between memories. Instead of requiring manual `memory_causal_link` calls, we could extract entities from memory content and auto-link memories that share entities.

**Step 3: Knowledge Graph Construction (Merge)**

```python
# [SOURCE: lightrag/operate.py:2411-2780]
async def merge_nodes_and_edges(chunk_results, ...):
    # Phase 1: Process all entities concurrently
    #   - Merge descriptions from multiple chunks using LLM summarization
    #   - Upsert to graph storage and entity VDB
    # Phase 2: Process all relationships concurrently
    #   - Merge edge descriptions, combine source_ids
    #   - Auto-create missing endpoint entities
    # Phase 3: Update full_entities and full_relations storage
```

The merge uses an LLM-based map-reduce approach for description summarization:

```python
# [SOURCE: lightrag/operate.py:165-297]
async def _handle_entity_relation_summary(
    description_type, entity_or_relation_name,
    description_list, separator, global_config, ...
):
    # If total tokens < summary_context_size and
    #    len(descriptions) < force_llm_summary_on_merge:
    #   -> Just concatenate (no LLM call)
    # If total tokens < summary_max_tokens:
    #   -> Summarize with LLM directly
    # Otherwise:
    #   -> Map-reduce: split into chunks, summarize each, recurse
```

**Relevance to our system: HIGH** -- The description merging pattern is directly applicable to our memory system. When multiple memories describe the same concept, we could use a similar summarization approach to create consolidated views, reducing redundancy while preserving information.

### 4.2 Query Pipeline (4-Stage Architecture)

```python
# [SOURCE: lightrag/operate.py:4086-4203]
async def _build_query_context(...) -> QueryContextResult | None:
    # Stage 1: Pure search
    search_result = await _perform_kg_search(...)

    # Stage 2: Apply token truncation for LLM efficiency
    truncation_result = await _apply_token_truncation(search_result, ...)

    # Stage 3: Merge chunks using filtered entities/relations
    merged_chunks = await _merge_all_chunks(...)

    # Stage 4: Build final LLM context with dynamic token processing
    context, raw_data = await _build_context_str(...)
```

**Relevance to our system: HIGH** -- The 4-stage separation (search -> truncate -> merge -> build) is a cleaner architecture than our current monolithic `memory_context` flow. We could adopt this staged approach for our multi-mode retrieval.

---

## 5. Dual-Level Retrieval: Local + Global

This is LightRAG's core innovation. The query is decomposed into two keyword types, each driving a different retrieval path:

### 5.1 Keyword Extraction

```python
# [SOURCE: lightrag/operate.py:3262-3291]
async def get_keywords_from_query(query, query_param, global_config, hashing_kv):
    hl_keywords, ll_keywords = await extract_keywords_only(
        query, query_param, global_config, hashing_kv
    )
    return hl_keywords, ll_keywords
```

The LLM extracts two keyword categories from the query:
- **high_level_keywords**: Overarching concepts/themes (e.g., "Economic impact", "Global stability")
- **low_level_keywords**: Specific entities/details (e.g., "Trade agreements", "Tariffs")

[SOURCE: `lightrag/prompt.py` -- `keywords_extraction` prompt]

### 5.2 Local Retrieval (Entity-Centric)

```python
# [SOURCE: lightrag/operate.py:4206-4261]
async def _get_node_data(query, knowledge_graph_inst, entities_vdb, query_param):
    # 1. Vector search entities by low-level keywords
    results = await entities_vdb.query(query, top_k=query_param.top_k)

    # 2. Batch retrieve node data + degrees from graph
    nodes_dict, degrees_dict = await asyncio.gather(
        knowledge_graph_inst.get_nodes_batch(node_ids),
        knowledge_graph_inst.node_degrees_batch(node_ids),
    )

    # 3. Find all edges connected to found entities
    use_relations = await _find_most_related_edges_from_entities(node_datas, ...)

    return node_datas, use_relations  # entities sorted by cosine, relations by rank+weight
```

Local retrieval flow:
1. Search entity VDB with low-level keywords
2. For each matched entity, get its graph node data and degree (connectivity measure)
3. Traverse edges from matched entities to find related relationships
4. Sort relationships by `(degree, weight)` descending -- high-connectivity edges ranked higher

### 5.3 Global Retrieval (Relationship-Centric)

```python
# [SOURCE: lightrag/operate.py:4479-4532]
async def _get_edge_data(keywords, knowledge_graph_inst, relationships_vdb, query_param):
    # 1. Vector search relationships by high-level keywords
    results = await relationships_vdb.query(keywords, top_k=query_param.top_k)

    # 2. Batch retrieve edge data from graph
    edge_data_dict = await knowledge_graph_inst.get_edges_batch(edge_pairs_dicts)

    # 3. Find entities connected to found relationships
    use_entities = await _find_most_related_entities_from_relationships(edge_datas, ...)

    return edge_datas, use_entities  # relations sorted by vector similarity
```

Global retrieval flow:
1. Search relationship VDB with high-level keywords
2. For each matched relationship, get its edge properties (description, weight, source_ids)
3. Collect all entities connected to matched relationships
4. Relations maintain vector search order (by similarity)

### 5.4 Fusion: Round-Robin Merge

```python
# [SOURCE: lightrag/operate.py:3561-3616]
# Round-robin merge entities
final_entities = []
seen_entities = set()
max_len = max(len(local_entities), len(global_entities))
for i in range(max_len):
    if i < len(local_entities):
        entity = local_entities[i]
        if entity_name not in seen_entities:
            final_entities.append(entity)
            seen_entities.add(entity_name)
    if i < len(global_entities):
        entity = global_entities[i]
        if entity_name not in seen_entities:
            final_entities.append(entity)
            seen_entities.add(entity_name)
```

The round-robin merge alternates between local and global results, deduplicating by entity/relation identity. This ensures both retrieval paths contribute proportionally regardless of how many results each produces.

**Relevance to our system: HIGH** -- Our `memory_context` currently does a single vector search. Adding a dual-path approach where:
- **Local path**: Search by specific trigger phrases / entity names (like our `memory_match_triggers`)
- **Global path**: Search by high-level concepts / semantic query (like our `memory_search`)
- **Fusion**: Round-robin merge results from both paths

This maps almost directly to our existing trigger matching + semantic search, but with explicit fusion logic.

---

## 6. Query Modes

LightRAG supports 6 query modes:

| Mode | Description | Local Search | Global Search | Vector Chunks | Our Equivalent |
|------|-------------|:---:|:---:|:---:|----------------|
| `local` | Entity-focused | Yes | No | No | `memory_match_triggers` |
| `global` | Theme-focused | No | Yes | No | `memory_search` (broad) |
| `hybrid` | Both KG paths | Yes | Yes | No | `memory_context(mode="deep")` |
| `naive` | Vector-only | No | No | Yes | `memory_search` (basic) |
| `mix` | KG + Vector | Yes | Yes | Yes | `memory_context(mode="auto")` |
| `bypass` | No retrieval | No | No | No | N/A |

**Relevance to our system: HIGH** -- The `mix` mode pattern (KG + Vector + fusion) directly maps to what we should aim for in our `memory_context` unified retrieval.

---

## 7. Scoring and Ranking

### 7.1 Entity Scoring

Entities are ranked by:
1. **Cosine similarity** from vector search (primary sort)
2. **Node degree** from knowledge graph (secondary context)

```python
# [SOURCE: lightrag/operate.py:4238-4247]
node_datas = [
    {
        **n,
        "entity_name": k["entity_name"],
        "rank": d,  # degree from graph
        "created_at": k.get("created_at"),
    }
    for k, n, d in zip(results, node_datas, node_degrees)
    if n is not None
]
```

### 7.2 Relationship Scoring

Relationships use different scoring depending on retrieval path:

**From local path** (entity edges):
```python
# [SOURCE: lightrag/operate.py:4313-4314]
all_edges_data = sorted(
    all_edges_data,
    key=lambda x: (x["rank"], x["weight"]),  # degree + edge weight
    reverse=True
)
```

**From global path** (VDB search):
- Maintain vector similarity order (no re-sorting)

### 7.3 Chunk Scoring

Two strategies for selecting chunks related to entities/relationships:

```python
# [SOURCE: lightrag/operate.py:4399-4448]
if kg_chunk_pick_method == "VECTOR":
    # Vector similarity-based: re-rank entity-associated chunks
    # by embedding similarity to the original query
    selected_chunk_ids = await pick_by_vector_similarity(...)
elif kg_chunk_pick_method == "WEIGHT":
    # Weighted polling: linear gradient based on
    # chunk occurrence count across entities
    selected_chunk_ids = pick_by_weighted_polling(
        entities_with_chunks, max_related_chunks, min_related_chunks=1
    )
```

**Relevance to our system: HIGH** -- Our current scoring uses cosine similarity + cross-encoder reranking. LightRAG adds graph-degree-based ranking which we could incorporate as a signal in our reranking pipeline. Specifically, memories with more causal edges (higher "degree" in our causal graph) could receive a boost.

---

## 8. Reranking System

LightRAG integrates external rerankers (Jina, Cohere, Aliyun) for chunk reranking:

```python
# [SOURCE: lightrag/rerank.py:1-100]
def chunk_documents_for_rerank(documents, max_tokens=480, overlap_tokens=32, ...):
    # Chunks long documents before sending to reranker
    # Returns (chunked_documents, original_doc_indices)

def aggregate_chunk_scores(chunk_results, doc_indices, num_original_docs, aggregation="max"):
    # Aggregates chunk-level rerank scores back to document level
    # Strategies: "max", "mean", "first"
```

Key pattern: Documents exceeding the reranker's token limit are chunked with overlap, reranked independently, then scores are aggregated back to the original document level using max-aggregation.

**Relevance to our system: Medium** -- Our cross-encoder reranking already handles this, but the chunk-and-aggregate pattern could be useful for reranking large memory files.

---

## 9. Caching and Performance

### 9.1 LLM Response Cache

```python
# [SOURCE: lightrag/operate.py:3177-3236]
# Query results are cached by a composite hash:
args_hash = compute_args_hash(
    query_param.mode, query, query_param.response_type,
    query_param.top_k, query_param.chunk_top_k,
    query_param.max_entity_tokens, query_param.max_relation_tokens,
    query_param.max_total_tokens,
    hl_keywords_str, ll_keywords_str,
    query_param.user_prompt or "", query_param.enable_rerank,
)
cached_result = await handle_cache(hashing_kv, args_hash, ...)
```

### 9.2 Entity Extraction Cache

Entity extraction results are cached per chunk, so re-indexing a document skips previously extracted chunks.

### 9.3 Pre-computed Query Embedding

```python
# [SOURCE: lightrag/operate.py:3490-3506]
# Single embedding computation reused across all vector operations
query_embedding = None
if query and (kg_chunk_pick_method == "VECTOR" or chunks_vdb):
    query_embedding = await actual_embedding_func([query])
    query_embedding = query_embedding[0]
```

### 9.4 Batch Operations

```python
# [SOURCE: lightrag/operate.py:4226-4229]
# Concurrent batch retrieval of node data + degrees
nodes_dict, degrees_dict = await asyncio.gather(
    knowledge_graph_inst.get_nodes_batch(node_ids),
    knowledge_graph_inst.node_degrees_batch(node_ids),
)
```

**Relevance to our system: Medium** -- We already cache embeddings, but the pattern of pre-computing a single query embedding and reusing it across multiple VDB queries (entity VDB, relationship VDB, chunk VDB) is more efficient than our current approach where each search may re-embed.

---

## 10. Storage Backend Architecture

### Pluggable Storage Abstraction

LightRAG uses 4 storage types with pluggable backends:

| Storage Type | Interface | Backends |
|-------------|-----------|----------|
| KV Storage | `BaseKVStorage` | JSON, PostgreSQL, Redis, MongoDB |
| Vector Storage | `BaseVectorStorage` | NanoVectorDB, PG, Milvus, Chroma, Faiss, Qdrant |
| Graph Storage | `BaseGraphStorage` | NetworkX (file), Neo4j, PostgreSQL, AGE |
| Doc Status | `DocStatusStorage` | JSON, PostgreSQL, MongoDB |

Key graph storage operations:

```python
# [SOURCE: lightrag/kg/networkx_impl.py]
class NetworkXStorage(BaseGraphStorage):
    # Graph persisted as GraphML XML file
    # Loaded fully into memory as nx.Graph
    # Multi-process safety via shared update flags

    async def get_node(self, node_id) -> dict | None
    async def get_edge(self, source, target) -> dict | None
    async def upsert_node(self, node_id, node_data)
    async def upsert_edge(self, source, target, edge_data)
    async def get_node_edges(self, node_id) -> list[tuple]
    async def node_degree(self, node_id) -> int
    async def edge_degree(self, src, tgt) -> int  # sum of endpoint degrees
```

**Relevance to our system: Medium** -- Our SQLite/libsql storage is simpler but the graph abstraction pattern (separate graph store from vector store from KV store) validates our architecture. The `edge_degree` concept (sum of endpoint degrees as a relevance signal) is directly applicable to our causal edge traversal.

---

## 11. Token Budget Management

LightRAG uses a unified token budget system that dynamically allocates tokens across context components:

```python
# [SOURCE: lightrag/operate.py:3930-3982]
# Get token limits
max_total_tokens = 30000  # Default

# Calculate system prompt overhead
sys_prompt_tokens = len(tokenizer.encode(pre_sys_prompt))

# Calculate KG context (entities + relations) overhead
kg_context_tokens = len(tokenizer.encode(pre_kg_context))

# Dynamic remaining budget for chunks
available_chunk_tokens = max_total_tokens - (
    sys_prompt_tokens + kg_context_tokens + query_tokens + buffer_tokens
)
```

Token allocation defaults:
- `max_entity_tokens`: 6,000
- `max_relation_tokens`: 8,000
- `max_total_tokens`: 30,000
- Buffer: 200 tokens

**Relevance to our system: Medium** -- Our MCP server has token budgets per tool (500-2000 tokens), but we do not dynamically allocate between components like LightRAG does. Their approach of computing overhead first, then allocating remaining budget to content, could improve our context retrieval quality.

---

## 12. Comparison Table: LightRAG vs Our System

| Feature | LightRAG | Spec-Kit Memory MCP | Gap | Priority |
|---------|----------|---------------------|-----|----------|
| **Graph Structure** | Full KG (entities + typed relationships + weights) | Causal graph (6 relation types, strength scores) | Similar concept, different focus | Low |
| **Entity Extraction** | LLM-based with gleaning passes | Manual (user creates memories) | **Major gap** -- auto-extraction possible | High |
| **Dual-Level Search** | Local (entity VDB) + Global (relationship VDB) | Trigger matching + semantic search | Similar but not fused | High |
| **Result Fusion** | Round-robin interleaving with dedup | Sequential (triggers first, then search) | **Major gap** -- no interleaving | High |
| **Keyword Decomposition** | LLM extracts hi/lo level keywords | Intent detection (7 types) | Different but complementary | Medium |
| **Scoring Signals** | Cosine + graph degree + edge weight | Cosine + cross-encoder + importance tier + decay | More signals in our system | Low |
| **Graph Traversal** | 1-hop edges from matched entities | Up to 10-hop causal chain traversal | Our system is more powerful | Low |
| **Reranking** | External API (Jina/Cohere) with chunking | Local cross-encoder with length penalty | Comparable | Low |
| **Token Budget** | Dynamic allocation across context components | Per-tool static budgets | LightRAG approach is more flexible | Medium |
| **Storage** | Pluggable (PG, Neo4j, etc.) | SQLite/libsql | Different scale targets | Low |
| **Caching** | LLM response + embedding + query cache | Session dedup + working memory attention | Different but both effective | Low |
| **Memory Lifecycle** | No lifecycle (static KG) | HOT/WARM/COLD/DORMANT/ARCHIVED states | Our system is more advanced | Low |
| **Chunk-Graph Linkage** | `source_id` field linking chunks to entities | N/A (memories are atomic) | **Interesting pattern** | Medium |

---

## 13. Key Findings: Actionable Recommendations

### Finding 1: Dual-Path Search with Keyword Decomposition
**Confidence: High** | **Evidence: Grade A** (direct source code analysis)

LightRAG's keyword decomposition (high-level themes + low-level entities) maps directly to our existing trigger matching (specific phrases) + semantic search (broad concepts). The critical missing piece is explicit fusion logic.

**Recommendation**: Implement round-robin interleaving in `memory_context`:
1. Run `memory_match_triggers` -> produces "local" results (specific matches)
2. Run `memory_search` -> produces "global" results (semantic matches)
3. Interleave results: take alternating items from each, dedup by memory ID
4. Apply cross-encoder reranking on the fused set

### Finding 2: Graph-Degree-Based Ranking Signal
**Confidence: High** | **Evidence: Grade A**

LightRAG uses node degree (number of connections) as a ranking signal. Highly-connected entities are considered more important. This maps to our causal graph: memories with many causal edges are more central to the knowledge network.

**Recommendation**: Add a `causal_degree_boost` to our reranking:
```
final_score = base_score * (1 + log(1 + causal_edge_count) * causal_boost_weight)
```

### Finding 3: Entity Extraction for Auto-Linking
**Confidence: Medium** | **Evidence: Grade B**

LightRAG's entity/relationship extraction prompt could be adapted to extract key concepts from memory content, then auto-create causal links between memories sharing concepts.

**Recommendation**: Create a lightweight entity extraction pass during `memory_save`:
1. Extract key concepts/entities from memory content (can use the embedding model or a small LLM)
2. Search existing memories for matching concepts
3. Suggest causal links (user confirms or auto-creates with low strength)

### Finding 4: 4-Stage Query Architecture
**Confidence: High** | **Evidence: Grade A**

LightRAG's clean separation of Search -> Truncate -> Merge -> Build is architecturally superior to monolithic retrieval functions.

**Recommendation**: Refactor `memory_context` into explicit stages:
1. **Search**: Run trigger matching + semantic search + causal traversal in parallel
2. **Truncate**: Apply per-tier token budgets
3. **Merge**: Round-robin interleave results from all sources
4. **Build**: Format final context with token budget awareness

### Finding 5: Chunk-Entity Provenance Tracking
**Confidence: Medium** | **Evidence: Grade A**

LightRAG tracks which text chunks contributed to which entities via `source_id` fields, enabling chunk retrieval through graph traversal (not just vector search).

**Recommendation**: Add source tracking to our causal edges -- when a causal link is created, store which memories/chunks were the evidence. This enables "show me why these memories are linked" queries.

---

## 14. Code Examples

### Example 1: Keyword Extraction Prompt Pattern

```python
# [SOURCE: lightrag/prompt.py -- keywords_extraction]
PROMPTS["keywords_extraction"] = """
Given a user query, extract two types of keywords:
1. high_level_keywords: overarching concepts or themes
2. low_level_keywords: specific entities or details

Output MUST be valid JSON:
{
  "high_level_keywords": [...],
  "low_level_keywords": [...]
}
"""
```

### Example 2: Entity Extraction Output Format

```python
# [SOURCE: lightrag/prompt.py -- entity_extraction_system_prompt]
# Output format (delimiter-based, not JSON):
# entity<|#|>entity_name<|#|>entity_type<|#|>entity_description
# relation<|#|>source<|#|>target<|#|>keywords<|#|>description
```

### Example 3: Round-Robin Merge Algorithm

```python
# [SOURCE: lightrag/operate.py:3847-3894]
merged_chunks = []
seen_chunk_ids = set()
max_len = max(len(vector_chunks), len(entity_chunks), len(relation_chunks))

for i in range(max_len):
    # Vector chunks first (naive mode)
    if i < len(vector_chunks):
        chunk_id = chunk.get("chunk_id")
        if chunk_id not in seen_chunk_ids:
            seen_chunk_ids.add(chunk_id)
            merged_chunks.append(chunk)
    # Entity chunks second (local mode)
    if i < len(entity_chunks):
        chunk_id = chunk.get("chunk_id")
        if chunk_id not in seen_chunk_ids:
            seen_chunk_ids.add(chunk_id)
            merged_chunks.append(chunk)
    # Relation chunks third (global mode)
    if i < len(relation_chunks):
        chunk_id = chunk.get("chunk_id")
        if chunk_id not in seen_chunk_ids:
            seen_chunk_ids.add(chunk_id)
            merged_chunks.append(chunk)
```

### Example 4: Dynamic Token Budget Calculation

```python
# [SOURCE: lightrag/operate.py:3930-3982]
max_total_tokens = 30000
sys_prompt_tokens = len(tokenizer.encode(pre_sys_prompt))
kg_context_tokens = len(tokenizer.encode(pre_kg_context))
query_tokens = len(tokenizer.encode(query))
buffer_tokens = 200

available_chunk_tokens = max_total_tokens - (
    sys_prompt_tokens + kg_context_tokens + query_tokens + buffer_tokens
)
```

### Example 5: Graph Degree as Ranking Signal

```python
# [SOURCE: lightrag/operate.py:4264-4317]
async def _find_most_related_edges_from_entities(node_datas, query_param, graph):
    # Get all edges from matched entities
    batch_edges_dict = await graph.get_nodes_edges_batch(node_names)

    # Get degree for each edge (sum of endpoint degrees)
    edge_degrees_dict = await graph.edge_degrees_batch(edge_pairs)

    # Sort by (degree, weight) -- high-connectivity first
    all_edges_data = sorted(
        all_edges_data,
        key=lambda x: (x["rank"], x["weight"]),
        reverse=True
    )
```

---

## 15. Constraints and Limitations

### LightRAG Constraints
1. **LLM Dependency**: Entity extraction requires 32B+ parameter models with 32K+ context
2. **Indexing Cost**: Every document requires multiple LLM calls (extraction + gleaning + summarization)
3. **Graph Staleness**: No automatic graph updates when source documents change
4. **No Memory Lifecycle**: Unlike our system, no concept of memory aging/decay
5. **Single-hop Entity Traversal**: Only traverses 1-hop from matched entities (our system does up to 10-hop)

### Applicability Constraints for Our System
1. **No LLM at Query Time**: Our MCP server does not call LLMs during retrieval -- keyword extraction would need to be done differently (e.g., using the embedding model or simple NLP)
2. **Scale Difference**: LightRAG targets document-scale (thousands of chunks); our system targets memory-scale (hundreds of memories)
3. **Real-time Requirements**: Our MCP tools have strict response time expectations; some LightRAG patterns (like LLM-based keyword extraction) may be too slow

---

## 16. Recommendations Summary

| # | Recommendation | Confidence | Effort | Impact | Priority |
|---|---------------|-----------|--------|--------|----------|
| 1 | Implement round-robin fusion in `memory_context` | High | Medium | High | P0 |
| 2 | Add causal-degree ranking boost | High | Low | Medium | P1 |
| 3 | Refactor retrieval into 4-stage pipeline | High | High | High | P1 |
| 4 | Auto-extract entities for causal link suggestions | Medium | High | High | P2 |
| 5 | Add source provenance to causal edges | Medium | Low | Medium | P2 |
| 6 | Dynamic token budget across context components | Medium | Medium | Medium | P2 |
| 7 | Pre-compute query embedding for reuse across searches | High | Low | Low | P3 |

### Recommended Implementation Order
1. **P0**: Round-robin fusion (immediate win, builds on existing infrastructure)
2. **P1**: 4-stage pipeline refactor + degree boost (architectural improvement)
3. **P2**: Entity extraction + provenance (new capability, higher effort)
4. **P3**: Token budget + embedding reuse (optimization)

---

## 17. Appendix

### A. Files Analyzed

| File | Lines | Purpose |
|------|-------|---------|
| `lightrag/lightrag.py` | ~4000 | Main LightRAG class, configuration, orchestration |
| `lightrag/operate.py` | ~4800 | Core operations: chunking, extraction, merging, querying |
| `lightrag/prompt.py` | ~600 | All LLM prompt templates |
| `lightrag/base.py` | ~750 | Abstract base classes for storage |
| `lightrag/utils.py` | ~3000 | Utility functions, tokenization, logging |
| `lightrag/rerank.py` | ~550 | Reranking API integrations |
| `lightrag/kg/networkx_impl.py` | ~500 | NetworkX graph storage implementation |
| `lightrag/utils_graph.py` | ~1800 | Graph manipulation utilities |

### B. Key Constants

| Constant | Default | Purpose |
|----------|---------|---------|
| `chunk_token_size` | 1200 | Max tokens per document chunk |
| `chunk_overlap_token_size` | 100 | Overlap between adjacent chunks |
| `top_k` | 60 | Entities/relations to retrieve per query |
| `chunk_top_k` | 20 | Text chunks to retrieve and keep after reranking |
| `max_entity_tokens` | 6000 | Token budget for entity context |
| `max_relation_tokens` | 8000 | Token budget for relationship context |
| `max_total_tokens` | 30000 | Total token budget for all context |
| `cosine_threshold` | 0.2 | Minimum cosine similarity for VDB results |
| `entity_extract_max_gleaning` | 1 | Number of additional extraction passes |

### C. Glossary

| Term | Definition |
|------|-----------|
| **Gleaning** | A second LLM extraction pass to catch missed entities/relations |
| **Source ID** | Comma-separated list of chunk IDs that contributed to an entity/relation |
| **Edge Degree** | Sum of node degrees of both endpoints of an edge |
| **Weighted Polling** | Chunk selection weighted by occurrence count across entities |
| **Mix Mode** | Combined retrieval using KG (local + global) + vector chunk search |

### D. Changelog

| Date | Change |
|------|--------|
| 2026-02-26 | Initial deep technical analysis completed |
