# MemOS Source Research (Source 04)

## 1) Executive summary

MemOS is implemented as a modular memory platform where `MOSProduct` orchestrates user-scoped memory cubes, retrieval, chat augmentation, asynchronous post-processing, and optional scheduling. The design combines persistent user/cube metadata with pluggable memory backends (`text_mem`, `act_mem`, `para_mem`, `pref_mem`) and exposes both REST + MCP interfaces for integration. The strongest architectural signal for hybrid working-memory systems is the split between synchronous, low-latency retrieval/chat and asynchronous memory maintenance (history sync, scheduler processing, post-chat ingestion).  
Primary evidence: `src/memos/mem_os/product.py`, `src/memos/mem_cube/general.py`, `src/memos/mem_scheduler/base_scheduler.py`, `src/memos/mem_scheduler/optimized_scheduler.py`, `src/memos/api/mcp_serve.py`, `src/memos/search/search_service.py`.

## 2) System architecture overview

- **Core orchestration layer**: `MOSProduct(MOSCore)` manages users, cube access, chat/search paths, and background post-chat tasks (`_post_chat_processing`, `_start_post_chat_processing`).  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_os/product.py>
- **Memory container abstraction**: `GeneralMemCube` encapsulates multiple memory planes and lifecycle (`load`, `dump`, `init_from_dir`, `init_from_remote_repo`) through `MemoryFactory.from_config(...)`.  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_cube/general.py>
- **Scheduler subsystem**: `BaseScheduler` centralizes queueing, dispatch, monitoring, and optional Redis/RabbitMQ integrations for asynchronous memory operations.  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/base_scheduler.py>
- **Optimized retrieval path**: `OptimizedScheduler` adds mixed search behavior (immediate results + async history enrichment), reranking, and working-memory replacement.  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/optimized_scheduler.py>
- **Integration surfaces**:
  - REST app bootstrapped via FastAPI (`server_api.py`) and routers.  
    Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/api/server_api.py>
  - MCP tools exposed via FastMCP in `mcp_serve.py` (chat/search/add/delete/share/scheduler control).  
    Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/api/mcp_serve.py>

## 3) Core logic flows and data structures

### A. Chat + memory retrieval flow

1. `MOSProduct.chat(...)` loads user cubes (`_load_user_cubes`) and performs text-memory search via `super().search(...)` (mode `fine`, top-k, optional internet search).  
2. Retrieved memories are threshold-filtered (`_filter_memories_by_threshold`) and transformed into system prompt context (`_build_system_prompt` / `_build_enhance_system_prompt`).  
3. LLM response generation happens synchronously; post-processing (reference extraction, scheduler submission, memory add) is launched asynchronously by `_start_post_chat_processing`.  
Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_os/product.py>

### B. Mixed retrieval + async history memory flow

1. `OptimizedScheduler.mix_search_memories(...)` performs retrieval/rerank/merge for immediate response.
2. It submits an async task (`submit_memory_history_async_task`) to persist/search history enhancements.
3. Consumer `_api_mix_search_message_consumer` processes grouped messages and updates Redis-backed session history (`update_search_memories_to_redis`).  
Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/optimized_scheduler.py>

### C. Core data structures (observed)

- `TextualMemoryItem` with metadata such as `memory_type`, `relativity`, and IDs used in filtering/reference mapping.
- `ScheduleMessageItem` as scheduler queue payload.
- `GeneralMemCubeConfig` and `MOSConfig` as runtime composition configs.
- `SearchContext` dataclass (`target_session_id`, `search_priority`, `search_filter`, `info`, `plugin`).  
Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/search/search_service.py>

## 4) Integration mechanisms

- **MCP integration**: `MOSMCPServer` defines tool functions on top of `MOS` with CRUD/search/chat/share/scheduler operations, transport support (`stdio`, `http`, `sse`).  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/api/mcp_serve.py>
- **REST integration**: FastAPI app + middleware + router composition.  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/src/memos/api/server_api.py>
- **Storage integrations**:
  - Graph DB and optional vector/other backends mediated by memory configs/factories.
  - Scheduler infrastructure can use Redis and RabbitMQ.
  - MySQL via SQLAlchemy/PyMySQL for user/persistence paths.  
  Citations: `pyproject.toml`, `base_scheduler.py`, `general.py`
- **Model integrations**: chat and embedding dependencies include OpenAI, Ollama, Transformers; MCP stack via FastMCP.  
  Citation: <https://github.com/MemTensor/MemOS/blob/main/pyproject.toml>

## 5) Design patterns / architectural decisions

- **Orchestrator + service composition**: `MOSProduct` coordinates retrieval, prompting, and memory writes while delegating to specialized services.
- **Factory pattern**: `MemoryFactory.from_config(...)` dynamically instantiates memory backends.
- **Async side-effect pipeline**: response is returned quickly while heavy operations happen after via async/thread fallback (`ContextThread`).
- **Hybrid retrieval strategy**: immediate retrieval with later asynchronous enrichment and history synchronization.
- **Adapter/interface style exposure**: same memory core exported through REST and MCP.

Primary citations:  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_os/product.py>  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_cube/general.py>  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/optimized_scheduler.py>  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/api/mcp_serve.py>

## 6) Technical dependencies / requirements

- **Runtime**: Python >=3.10, package `MemoryOS` v2.0.6.
- **Core libs**: `fastapi`, `fastmcp`, `sqlalchemy`, `pymysql`, `transformers`, `openai`, `ollama`.
- **Optional feature groups**:
  - `tree-mem`: `neo4j`, `schedule`
  - `mem-scheduler`: `redis`, `pika`
  - `mem-reader`: `chonkie`, `markitdown`, `langchain-text-splitters`
  - `pref-mem`: `pymilvus`, `datasketch`
- **Deployment assumptions** (README): self-hosted flow requires env setup and services (e.g., Neo4j/Qdrant for some paths).

Citation:  
<https://github.com/MemTensor/MemOS/blob/main/pyproject.toml>  
<https://github.com/MemTensor/MemOS/blob/main/README.md>

## 7) Current limitations / constraints

- **Complex operational surface**: many optional subsystems and backend permutations increase integration complexity.
- **Fallback-heavy behavior**: multiple code paths rely on runtime fallback/init heuristics (e.g., lazy init in scheduler, threaded async fallback).
- **Potential consistency lag**: async post-processing means memory state may lag the immediate response.
- **Backend-coupled behavior**: search/rerank quality and available features depend on configured memory backends and queue infra.
- **Implementation debt signals**: TODO markers and uneven naming (for example `navie.py`) suggest ongoing refactoring pressure.

Citation examples:  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/base_scheduler.py>  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_os/product.py>  
<https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_cube/navie.py>

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION = system-spec-kit + Spec Kit Memory MCP

1. **Adopt strict sync/async split**: keep user-facing retrieval fast; move expensive memory enrichment/indexing to async workers.
2. **Use explicit context envelope objects**: MemOS `SearchContext` pattern cleanly centralizes session/filter/priority metadata.
3. **Keep storage pluggability at config boundary**: factory-based memory backends support staged evolution without rewriting orchestration logic.
4. **Expose same core through multiple interfaces**: MCP + REST wrappers around shared core reduce divergence risk.
5. **Treat working memory as mutable ranked state**: rerank + replace flows can support stronger "working memory" semantics in MCP systems.

## 9) Concrete code references

- Core orchestration: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_os/product.py>
- Core base: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_os/core.py>
- Memory cube abstraction: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_cube/general.py>
- Scheduler base: <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/base_scheduler.py>
- Optimized scheduler (hybrid retrieval/history): <https://github.com/MemTensor/MemOS/blob/main/src/memos/mem_scheduler/optimized_scheduler.py>
- Shared search context/service: <https://github.com/MemTensor/MemOS/blob/main/src/memos/search/search_service.py>
- MCP server tools: <https://github.com/MemTensor/MemOS/blob/main/src/memos/api/mcp_serve.py>
- REST server entry: <https://github.com/MemTensor/MemOS/blob/main/src/memos/api/server_api.py>
- Package dependencies: <https://github.com/MemTensor/MemOS/blob/main/pyproject.toml>
- Repo overview and deployment notes: <https://github.com/MemTensor/MemOS/blob/main/README.md>

## 10) [Assumes: X] + confidence

- **Assumes**:
  - `main` branch code is representative of current architecture.
  - Raw file snapshots fetched from GitHub are complete enough for architectural inference.
  - Claims in README benchmarks were not independently reproduced here.
  - No local execution/benchmarking was performed in this research-only pass.

- **Confidence**: 84/100 (high on structural architecture and integration patterns; moderate on runtime performance claims and operational edge-cases without execution).
