# Cognee Source Research (Source 03)

## 1) Executive summary

Cognee is a Python knowledge engine that structures memory as a pipeline-based GraphRAG system: `add()` ingests data, `cognify()` converts it into graph/vector-indexed knowledge, `memify()` enriches existing graph memory, and `search()` routes requests through a retriever factory by search mode. The repository also ships a dedicated MCP server (`cognee-mcp`) that supports direct-library mode and API-proxy mode, with clear capability trade-offs between the two. [SOURCE: `README.md:71`, `cognee/api/v1/add/add.py:19`, `cognee/api/v1/cognify/cognify.py:41`, `cognee/modules/memify/memify.py:25`, `cognee/api/v1/search/search.py:21`, `cognee-mcp/src/server.py:40`, `cognee-mcp/src/cognee_client.py:33`]

## 2) System architecture overview

- Public API surface is orchestrated from top-level exports (`add`, `cognify`, `memify`, `search`, config/datasets/ui), indicating a composable runtime with explicit operation entrypoints. [SOURCE: `cognee/__init__.py:18`]
- Core execution model is task pipelines (`Task` wrapper + `run_pipeline` + `run_tasks`) over datasets, with environment setup and per-dataset context isolation before execution. [SOURCE: `cognee/modules/pipelines/tasks/task.py:5`, `cognee/modules/pipelines/operations/pipeline.py:33`, `cognee/modules/pipelines/layers/setup_and_check_environment.py:18`]
- Storage is hybrid by design: graph DB + vector DB + relational metadata, with runtime defaults of Kuzu (graph) and LanceDB (vector), and dynamic context overrides via `ContextVar`. [SOURCE: `README.md:71`, `cognee/infrastructure/databases/graph/config.py:38`, `cognee/infrastructure/databases/vector/config.py:30`, `cognee/context_global_variables.py:16`]
- Access-control-aware execution can switch DB context per dataset/user at runtime (`set_database_global_context_variables`), enabling tenant/dataset isolation in async flows. [SOURCE: `cognee/context_global_variables.py:86`, `cognee/modules/pipelines/operations/pipeline.py:77`, `cognee/modules/search/methods/search.py:200`]
- External integration layers include FastAPI (`/api/v1/*`) and FastMCP (`cognee-mcp`), where MCP can run with stdio/SSE/HTTP transports. [SOURCE: `cognee/api/client.py:86`, `cognee/api/client.py:251`, `cognee-mcp/src/server.py:40`, `cognee-mcp/src/server.py:827`, `cognee-mcp/README.md:40`]

## 3) Core logic flows and data structures

- Ingestion (`add`) builds a two-task pipeline (`resolve_data_directories` -> `ingest_data`), resets pipeline run status, then executes `run_pipeline` with cache/incremental controls. [SOURCE: `cognee/api/v1/add/add.py:177`, `cognee/api/v1/add/add.py:195`, `cognee/api/v1/add/add.py:201`]
- Cognify default flow composes deterministic task stages: classify -> chunk -> graph extraction -> summarize -> persist/index data points; temporal mode swaps in event/time extraction tasks. [SOURCE: `cognee/api/v1/cognify/cognify.py:283`, `cognee/api/v1/cognify/cognify.py:312`]
- `Task` is a polymorphic execution wrapper (function/coroutine/generator/async generator) with batch propagation to downstream tasks, enabling one execution contract across heterogeneous task types. [SOURCE: `cognee/modules/pipelines/tasks/task.py:20`, `cognee/modules/pipelines/tasks/task.py:24`, `cognee/modules/pipelines/tasks/task.py:91`]
- Pipeline runner emits lifecycle events (`PipelineRunStarted`, `PipelineRunCompleted`, `PipelineRunErrored`) and batches concurrent per-item execution with `asyncio.gather`. [SOURCE: `cognee/modules/pipelines/operations/run_tasks.py:17`, `cognee/modules/pipelines/operations/run_tasks.py:78`, `cognee/modules/pipelines/operations/run_tasks.py:97`, `cognee/modules/pipelines/operations/run_tasks.py:132`, `cognee/modules/pipelines/operations/run_tasks.py:152`]
- Search path is factory-driven: choose retriever by `SearchType`, fetch raw retrieved objects once, derive context, then optionally completion, and normalize to backward-compatible response shapes. [SOURCE: `cognee/modules/search/methods/get_search_type_retriever_instance.py:32`, `cognee/modules/search/methods/get_retriever_output.py:19`, `cognee/modules/search/methods/get_retriever_output.py:24`, `cognee/modules/search/methods/search.py:267`]
- Graph memory representation uses explicit `Node`/`Edge` objects with vector distance arrays, projected from DB and rescored for top-k triplet importance; this bridges vector retrieval and graph ranking. [SOURCE: `cognee/modules/graph/cognee_graph/CogneeGraphElements.py:6`, `cognee/modules/graph/cognee_graph/CogneeGraph.py:161`, `cognee/modules/graph/cognee_graph/CogneeGraph.py:240`, `cognee/modules/graph/cognee_graph/CogneeGraph.py:341`]

## 4) Integration mechanisms

- FastAPI integration is modular via feature routers (`add`, `cognify`, `memify`, `search`, etc.) attached under `/api/v1/*`. [SOURCE: `cognee/api/client.py:251`, `cognee/api/client.py:253`, `cognee/api/client.py:255`, `cognee/api/client.py:257`]
- MCP integration wraps Cognee operations as `@mcp.tool` handlers and uses a shared client abstraction (`CogneeClient`) for direct vs API mode dispatch. [SOURCE: `cognee-mcp/src/server.py:94`, `cognee-mcp/src/server.py:321`, `cognee-mcp/src/cognee_client.py:20`, `cognee-mcp/src/cognee_client.py:75`, `cognee-mcp/src/cognee_client.py:121`]
- MCP long-running operations are backgrounded with `asyncio.create_task` due MCP timeout constraints; status is exposed via dedicated tools and logs. [SOURCE: `cognee-mcp/src/server.py:235`, `cognee-mcp/src/server.py:246`, `cognee-mcp/src/server.py:749`]
- Optional distributed execution is enabled by env switch (`COGNEE_DISTRIBUTED=true`) and Modal-backed `run_tasks_distributed` substitution. [SOURCE: `cognee/modules/pipelines/operations/run_tasks.py:34`, `cognee/modules/pipelines/operations/run_tasks.py:38`, `cognee/modules/pipelines/operations/run_tasks_distributed.py:39`, `distributed/entrypoint.py:18`]

## 5) Design patterns/architectural decisions

- **Pipeline-first orchestration**: all core behaviors are expressed as task lists, not hardcoded monolith methods, improving composability of ingestion/enrichment flows. [SOURCE: `cognee/api/v1/add/add.py:177`, `cognee/api/v1/cognify/cognify.py:283`, `cognee/modules/memify/memify.py:92`]
- **Polymorphic task adapter**: one `Task` abstraction normalizes sync/async/generator work into a uniform async iterator contract. [SOURCE: `cognee/modules/pipelines/tasks/task.py:24`, `cognee/modules/pipelines/tasks/task.py:96`]
- **Factory/registry retrieval**: retriever classes are mapped by enum, with per-retriever parameter bundles and optional dynamic type selection (`FEELING_LUCKY`). [SOURCE: `cognee/modules/search/methods/get_search_type_retriever_instance.py:65`, `cognee/modules/search/methods/get_search_type_retriever_instance.py:220`]
- **Contextual multi-tenant isolation**: runtime DB configs are context-scoped and swapped per dataset/user execution path rather than process-global mutation only. [SOURCE: `cognee/context_global_variables.py:16`, `cognee/context_global_variables.py:124`, `cognee/modules/search/methods/search.py:201`]
- **Dual-mode MCP bridge**: one MCP interface can call local library or remote API, trading feature parity for deployment flexibility. [SOURCE: `cognee-mcp/src/cognee_client.py:33`, `cognee-mcp/README.md:371`, `cognee-mcp/README.md:429`]

## 6) Technical dependencies/requirements

- Python requirement is `>=3.10,<3.14` for core package and `>=3.10` for `cognee-mcp`. [SOURCE: `pyproject.toml:10`, `cognee-mcp/pyproject.toml:6`]
- Core dependencies include LLM/embedding stack (`openai`, `litellm`, `instructor`, `tiktoken`), API stack (`fastapi`, `uvicorn`), storage/query stack (`sqlalchemy`, `lancedb`, `kuzu`, `rdflib`). [SOURCE: `pyproject.toml:23`, `pyproject.toml:32`, `pyproject.toml:44`, `pyproject.toml:55`, `pyproject.toml:29`, `pyproject.toml:40`, `pyproject.toml:51`, `pyproject.toml:37`]
- Integration extras are extensive (neo4j/neptune/postgres/chromadb/scraping/langchain/llama-index/redis/monitoring), indicating high configurability but higher dependency-management complexity. [SOURCE: `pyproject.toml:75`, `pyproject.toml:85`, `pyproject.toml:86`, `pyproject.toml:87`, `pyproject.toml:112`, `pyproject.toml:98`, `pyproject.toml:103`, `pyproject.toml:159`, `pyproject.toml:161`]
- MCP server depends on `fastmcp`, `mcp`, and pinned `cognee[postgres,docs,neo4j]==0.5.2`. [SOURCE: `cognee-mcp/pyproject.toml:11`, `cognee-mcp/pyproject.toml:12`, `cognee-mcp/pyproject.toml:13`]

## 7) Current limitations/constraints

- MCP API mode intentionally excludes some direct-mode features (`codify`, status tools, `prune`, detailed `list_data` by dataset). [SOURCE: `cognee-mcp/README.md:429`, `cognee-mcp/README.md:437`, `cognee-mcp/src/server.py:538`, `cognee-mcp/src/cognee_client.py:248`, `cognee-mcp/src/cognee_client.py:296`]
- Search has strict preconditions: without initialized DB/default user, it raises actionable validation errors instructing `add` then `cognify`. [SOURCE: `cognee/api/v1/search/search.py:186`, `cognee/api/v1/search/search.py:191`, `cognee/api/v1/search/search.py:195`]
- Backend access control support depends on compatible dataset-database handlers; unsupported combinations hard-fail with environment errors. [SOURCE: `cognee/context_global_variables.py:35`, `cognee/context_global_variables.py:42`, `cognee/context_global_variables.py:50`, `cognee/context_global_variables.py:60`]
- Distributed execution path requires Modal; if dependency is missing, distributed mode fallback path is effectively unavailable. [SOURCE: `cognee/modules/pipelines/operations/run_tasks_distributed.py:1`, `cognee/modules/pipelines/operations/run_tasks_distributed.py:32`]

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION=system-spec-kit + Spec Kit Memory MCP

1. Use a strict pipeline contract (`Task` chain with lifecycle events) for memory ingestion/update/search workflows so observability and retry semantics stay uniform. [SOURCE: `cognee/modules/pipelines/tasks/task.py:45`, `cognee/modules/pipelines/operations/run_tasks.py:78`]
2. Keep retrieval modular via a search-type registry/factory; this makes adding hybrid retrieval modes low-risk and isolated. [SOURCE: `cognee/modules/search/methods/get_search_type_retriever_instance.py:65`]
3. Separate retrieved objects, context-building, and completion generation into explicit phases; this avoids duplicate retrieval and supports `only_context` optimization. [SOURCE: `cognee/modules/search/methods/get_retriever_output.py:24`, `cognee/modules/search/methods/get_retriever_output.py:32`]
4. Preserve async context-bound DB configuration for multi-tenant memory isolation instead of global mutable singleton config. [SOURCE: `cognee/context_global_variables.py:16`, `cognee/context_global_variables.py:159`]
5. For MCP reliability, decouple long-running writes from request lifetimes (background tasks + status polling) and communicate degradation clearly in reduced-capability modes. [SOURCE: `cognee-mcp/src/server.py:235`, `cognee-mcp/src/server.py:246`, `cognee-mcp/README.md:429`]

## 9) Concrete code references

- Runtime API surface: `cognee/__init__.py`
- Ingestion orchestration: `cognee/api/v1/add/add.py`
- Cognify orchestration: `cognee/api/v1/cognify/cognify.py`
- Memify enrichment: `cognee/modules/memify/memify.py`
- Pipeline execution core: `cognee/modules/pipelines/tasks/task.py`, `cognee/modules/pipelines/operations/pipeline.py`, `cognee/modules/pipelines/operations/run_tasks.py`
- Search orchestration/factory: `cognee/modules/search/methods/search.py`, `cognee/modules/search/methods/get_retriever_output.py`, `cognee/modules/search/methods/get_search_type_retriever_instance.py`
- Graph data model/ranking: `cognee/modules/graph/cognee_graph/CogneeGraph.py`, `cognee/modules/graph/cognee_graph/CogneeGraphElements.py`
- Context isolation/access control: `cognee/context_global_variables.py`
- FastAPI integration: `cognee/api/client.py`, `cognee/api/v1/add/routers/get_add_router.py`, `cognee/api/v1/search/routers/get_search_router.py`
- MCP bridge: `cognee-mcp/src/server.py`, `cognee-mcp/src/cognee_client.py`, `cognee-mcp/README.md`
- Dependencies: `pyproject.toml`, `cognee-mcp/pyproject.toml`

## 10) [Assumes: X] + confidence

- [Assumes: Analysis reflects repository state on default branch at the time of cloning and may differ from unreleased branches/tags.]
- [Assumes: `cognee-mcp` README limitations accurately describe current runtime behavior and are aligned with source implementation.]
- Confidence: 91/100
