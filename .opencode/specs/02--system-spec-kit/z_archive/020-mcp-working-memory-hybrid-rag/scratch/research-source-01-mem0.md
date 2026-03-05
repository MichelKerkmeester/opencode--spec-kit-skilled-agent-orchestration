# Mem0 Source Research (Source 01)

## 1) Executive summary

Mem0 is a pluggable memory orchestration layer that combines LLM-driven fact extraction/update logic with vector retrieval, optional graph enrichment, and an internal history log. The core `Memory` runtime enforces scoped identifiers (`user_id`/`agent_id`/`run_id`) and supports both sync/async flows with nearly identical semantics. For MCP relevance, Mem0 demonstrates a practical pattern where an MCP server wraps memory operations and degrades gracefully when core memory dependencies are unavailable.

## 2) Architecture overview

- Core OSS package centers on `Memory`/`AsyncMemory` and composes five providers via factories: LLM, embedder, vector store, graph store, reranker. [SOURCE: `mem0/memory/main.py:172`, `mem0/utils/factory.py:28`, `mem0/utils/factory.py:136`, `mem0/utils/factory.py:164`, `mem0/utils/factory.py:208`, `mem0/utils/factory.py:232`]
- Configuration is Pydantic-first (`MemoryConfig`) with provider-specific sub-configs and defaults (`openai` LLM/embedder, `qdrant` vector store). [SOURCE: `mem0/configs/base.py:30`, `mem0/llms/configs.py:7`, `mem0/embeddings/configs.py:7`, `mem0/vector_stores/configs.py:7`]
- Operational surfaces are: local SDK APIs, hosted API client (`MemoryClient`), REST server wrapper (`server/main.py`), and an OpenMemory MCP server wrapper. [SOURCE: `mem0/__init__.py:5`, `mem0/client/main.py:24`, `server/main.py:89`, `openmemory/api/app/mcp_server.py:39`]

## 3) Core logic/data structures

- Scoped identity is mandatory at operation-time (`user_id`/`agent_id`/`run_id`) through `_build_filters_and_metadata`; this is foundational to multi-tenant isolation and query scoping. [SOURCE: `mem0/memory/main.py:87`, `mem0/memory/main.py:152`]
- `add()` pipeline: parse messages -> extract facts via LLM JSON -> retrieve nearby memories -> run LLM action planner (`ADD`/`UPDATE`/`DELETE`/`NONE`) -> execute storage mutations + history entries. [SOURCE: `mem0/memory/main.py:423`, `mem0/memory/main.py:434`, `mem0/memory/main.py:475`, `mem0/memory/main.py:497`, `mem0/memory/main.py:525`]
- Storage record model includes payload (`data`, hash, timestamps, scoped IDs + extra metadata) in vector store and append-only change history in SQLite `history` table. [SOURCE: `mem0/memory/main.py:1075`, `mem0/memory/main.py:1083`, `mem0/memory/storage.py:106`]
- Search model supports threshold gating and advanced metadata operators (`eq/ne/in/gt/...`, `AND/OR/NOT`) normalized before vector-store calls; optional reranker post-processes results. [SOURCE: `mem0/memory/main.py:758`, `mem0/memory/main.py:809`, `mem0/memory/main.py:858`, `mem0/memory/main.py:845`]
- Graph memory path (`MemoryGraph`) extracts entities/relations via tool calls, persists relation graph, and uses BM25 reranking over graph triples for retrieval. [SOURCE: `mem0/memory/graph_memory.py:76`, `mem0/memory/graph_memory.py:196`, `mem0/memory/graph_memory.py:229`, `mem0/memory/graph_memory.py:119`]

## 4) Integration mechanisms

- Factory registration pattern enables broad provider expansion without changing core runtime contracts (LLM/vector/embedder/graph/reranker registries). [SOURCE: `mem0/utils/factory.py:35`, `mem0/utils/factory.py:165`, `mem0/utils/factory.py:214`, `mem0/utils/factory.py:239`]
- Hosted API client wraps REST endpoints with consistent parameter shaping and output normalization to v1.1-style result envelopes. [SOURCE: `mem0/client/main.py:168`, `mem0/client/main.py:247`, `mem0/client/main.py:292`]
- REST service exposes direct memory CRUD/search/history/reset endpoints over a configurable in-process `Memory` singleton. [SOURCE: `server/main.py:59`, `server/main.py:97`, `server/main.py:141`, `server/main.py:170`, `server/main.py:211`]
- MCP integration pattern: OpenMemory defines `@mcp.tool` functions mapped to memory operations with context-bound `user_id`/`client_name`, ACL filtering, and SSE transport endpoints. [SOURCE: `openmemory/api/app/mcp_server.py:60`, `openmemory/api/app/mcp_server.py:145`, `openmemory/api/app/mcp_server.py:430`, `openmemory/api/app/mcp_server.py:487`]

## 5) Design patterns

- Orchestrator + adapters: a single orchestration class (`Memory`) delegates to provider adapters created by factories.
- Two-stage LLM control loop: first extract candidate facts, then generate explicit mutation actions over existing memory set.
- Dual persistence model: semantic retrieval store (vector DB) + immutable change log (SQLite history).
- Parallel execution for latency reduction: vector + graph operations run concurrently in both sync (`ThreadPoolExecutor`) and async (`asyncio.gather`) paths.
- Graceful degradation at integration boundary: MCP server can keep running and return explicit service-unavailable errors when memory backend fails to initialize.

## 6) Dependencies/requirements

- Python runtime `>=3.9,<4.0`; core dependencies include `qdrant-client`, `pydantic`, `openai`, `sqlalchemy`, `posthog`. [SOURCE: `pyproject.toml:15`, `pyproject.toml:16`]
- Optional extras materially alter capability surface: `graph` (neo4j/memgraph/neptune/kuzu), `vector_stores` (many backends), `llms` and `extras` for broader providers/rerankers. [SOURCE: `pyproject.toml:26`, `pyproject.toml:35`, `pyproject.toml:60`, `pyproject.toml:70`]
- Graph search depends on `langchain-neo4j` and `rank-bm25`; missing deps raise immediate ImportError in graph module. [SOURCE: `mem0/memory/graph_memory.py:6`, `mem0/memory/graph_memory.py:11`]

## 7) Constraints/limitations

- Hard requirement for at least one scope identifier (`user_id`/`agent_id`/`run_id`) means unscoped global retrieval is intentionally blocked. [SOURCE: `mem0/memory/main.py:152`, `mem0/memory/main.py:806`]
- High dependence on LLM JSON compliance in extraction/action phases; parser fallbacks exist, but malformed outputs can reduce recall/update quality. [SOURCE: `mem0/memory/main.py:442`, `mem0/memory/main.py:510`]
- `delete_all()` calls `vector_store.reset()` after filtered deletes, which may exceed intent for stores where reset is collection-wide. [SOURCE: `mem0/memory/main.py:1049`, `mem0/memory/main.py:1053`]
- Some defaults are operationally opinionated (e.g., vector store temp path default `/tmp/{provider}` when `path` omitted), which may be undesirable in production persistence setups. [SOURCE: `mem0/vector_stores/configs.py:62`]

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION=system-spec-kit + Spec Kit Memory MCP

1. Keep the orchestrator thin and explicit: use one coordinator that composes provider adapters, not feature logic scattered across handlers.
2. Enforce scoped identity at API boundary as a first-class invariant (session/actor scoping), not a best-effort filter.
3. Use a two-pass memory write loop (extract -> action plan) to support updates/deletes, not just append-only add.
4. Maintain an auditable mutation ledger separate from retrieval index (history table equivalent) for debugging and trust.
5. Support graceful degraded mode in MCP handlers (continue serving protocol endpoints with clear unavailability errors).
6. Add optional reranking as post-retrieval stage and keep it swappable.
7. Keep sync and async parity to avoid feature drift between execution modes.

## 9) Concrete source references

- Core runtime: `mem0/memory/main.py`
- History store: `mem0/memory/storage.py`
- Provider factories: `mem0/utils/factory.py`
- Config schema: `mem0/configs/base.py`, `mem0/llms/configs.py`, `mem0/embeddings/configs.py`, `mem0/vector_stores/configs.py`, `mem0/graphs/configs.py`
- Graph memory: `mem0/memory/graph_memory.py`
- Hosted client: `mem0/client/main.py`
- REST wrapper: `server/main.py`
- MCP wrapper example: `openmemory/api/app/mcp_server.py`
- Repository-level positioning and usage examples: `README.md`, `pyproject.toml`

## 10) [Assumes: X] + confidence

- [Assumes: The open-source `mem0` repository structure and semantics observed on the default branch are representative of current architecture at analysis time.]
- [Assumes: OpenMemory MCP server in this repo is a reference integration and not necessarily identical to hosted/platform internals.]
- Confidence: 89/100
