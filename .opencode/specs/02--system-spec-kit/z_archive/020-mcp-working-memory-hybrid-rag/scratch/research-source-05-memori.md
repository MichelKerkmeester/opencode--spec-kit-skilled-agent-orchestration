# Research Source 05: MemoriLabs/Memori

## 1) Executive summary

Memori is a Python memory layer that intercepts LLM calls, persists conversation history with entity/process/session attribution, and injects recalled facts back into future prompts. It supports local datastore mode (SQLite/Postgres/MySQL/Oracle/OceanBase/MongoDB) and cloud mode (Memori API), with asynchronous advanced augmentation that extracts facts, process attributes, and semantic triples for hybrid retrieval. [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/README.md] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/__init__.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_base.py]

For `system-spec-kit` + Spec Kit Memory MCP, the strongest fit is Memori's explicit dual memory channels: (1) deterministic conversation replay and (2) semantic fact recall with relevance thresholding and optional lexical+dense reranking. [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_base.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/search/_core.py]

## 2) System architecture overview

- Application uses standard LLM SDK client; Memori wraps client methods via registry and invoke wrappers.
- `Memori(...)` initializes config, storage manager, augmentation manager, and provider-specific registries.
- Storage layer uses adapter/driver registry with dialect-specific migrations.
- Recall path computes embeddings and runs fact search; selected facts are injected into system/instructions/messages by provider-specific logic.
- Augmentation path runs async, sends normalized payload to API, converts output into facts/attributes/triples, and schedules DB writes.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/docs/features/architecture.md] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/__init__.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/storage/_registry.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/recall.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/augmentation/_manager.py]

## 3) Core logic flows and data structures

### A. Capture and persistence flow

1. Wrapped LLM method executes.
2. `BaseInvoke` formats query+response payload and parses normalized messages.
3. `MemoryManager.execute()` strips system messages and routes to local writer or cloud endpoint.
4. Local writer ensures entity/process/session/conversation IDs and persists messages transactionally.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_base.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_conversation_messages.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_manager.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_writer.py]

### B. Recall and injection flow

1. Extract current user query.
2. Resolve entity and embed query (`embed_texts`).
3. Retrieve candidate facts via vector similarity + optional lexical weighting.
4. Filter by `recall_relevance_threshold`.
5. Inject as `<memori_context>` into provider-appropriate system channel.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/recall.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/search/_api.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/search/_core.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_base.py]

### C. Asynchronous augmentation flow

1. Conversation payload enters augmentation queue.
2. Runtime semaphore/worker processes augmentations.
3. Advanced augmentation calls API with hashed attribution metadata.
4. Response becomes `Memories` structure (facts, embeddings, process attributes, semantic triples).
5. Batched DB writer enqueues write tasks.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/augmentation/_manager.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/augmentation/augmentations/memori/_augmentation.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_struct.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/augmentation/_models.py]

### D. Primary data model

- Attribution entities: `memori_entity`, `memori_process`, `memori_session`.
- Conversation state: `memori_conversation`, `memori_conversation_message`.
- Semantic memory: `memori_entity_fact` (content + embedding + frequency/last_time).
- Process adaptation: `memori_process_attribute`.
- Graph memory: `memori_subject`, `memori_predicate`, `memori_object`, `memori_knowledge_graph`.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/storage/migrations/_sqlite.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/docs/advanced-augmentation.md]

## 4) Integration mechanisms

- **Provider wrapping**: dynamic client registration by module/type matchers and method monkey-patching/wrapping for OpenAI, Anthropic, Google, xAI, plus Agno/LangChain/PydanticAI routes. [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_registry.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_clients.py]
- **Storage pluggability**: adapter/driver registries with runtime detection for DBAPI, SQLAlchemy, Django, MongoDB and managed resources. [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/storage/__init__.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/storage/_registry.py]
- **Cloud/local duality**: local write path and cloud POST path coexist; cloud path can still persist local mirrors of message history. [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_manager.py]
- **API integration hardening**: retry/backoff, TLS handling, explicit quota and validation exceptions. [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/_network.py]

## 5) Design patterns/architectural decisions

- **Registry + plugin architecture** for LLM and storage extensibility.
- **Decorator-based self-registration** keeps adapters/drivers loosely coupled.
- **Separation of concerns** across capture, persist, recall, augmentation, and search modules.
- **Async sidecar augmentation** to avoid user-facing latency on response path.
- **Unified normalized message format** to bridge different provider payload conventions.
- **Hybrid ranking** (dense similarity + lexical score) rather than embedding-only ranking.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_registry.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/storage/_registry.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/augmentation/_manager.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_conversation_messages.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/search/_core.py]

## 6) Technical dependencies/requirements

- Python `>=3.10`.
- Core deps include `faiss-cpu`, `sentence-transformers`, `numpy`, `aiohttp`, `requests`, `protobuf`, `grpcio`.
- Optional CockroachDB dep via `psycopg[binary]`.
- Uses environment variables for API key/model/connection behavior (`MEMORI_API_KEY`, `MEMORI_EMBEDDINGS_MODEL`, connection string vars).

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/pyproject.toml] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/_config.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/README.md]

## 7) Current limitations/constraints

- Attribution is mandatory for useful memory creation; without entity/process attribution, recall value collapses.
- Advanced augmentation can be quota-limited and may require `mem.augmentation.wait()` in short-lived processes.
- First-run performance includes embedding model setup/download overhead.
- Recall quality is threshold/embedding-limit sensitive and requires tuning.
- Wrapping strategy relies on SDK internals/method signatures and can be brittle under upstream SDK changes.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/README.md] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/docs/troubleshooting.md] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_clients.py]

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION=system-spec-kit + Spec Kit Memory MCP

1. **Use two memory layers, not one**: combine deterministic short-term replay (recent turns) with semantic long-term retrieval (facts), then explicitly rank/filter before injection.
2. **Normalize provider variability early**: map all query/response payloads into one internal message schema before storage/indexing.
3. **Keep augmentation async and decoupled**: extraction/enrichment can run in background queues while primary response path remains fast.
4. **Adopt explicit attribution keys**: entity/process/session separation is useful for scoped retrieval and reducing cross-agent contamination.
5. **Use migration-driven storage contracts**: schema/version discipline helps support multiple backends while retaining predictable behavior.
6. **Support cloud-local fallback paths**: preserve operability when remote services are degraded or quota-limited.

[SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/llm/_base.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/search/_core.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/augmentation/_manager.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/storage/_builder.py] [SOURCE: https://raw.githubusercontent.com/MemoriLabs/Memori/main/memori/memory/_manager.py]

## 9) Concrete code references

- `memori/__init__.py` - Memori bootstrap (`Memori` class), cloud/local connection selection, attribution/session APIs.
- `memori/llm/_clients.py` - Provider wrappers and registration logic.
- `memori/llm/_base.py` - prompt injection, conversation injection, payload formatting, post-response ingestion.
- `memori/memory/_manager.py` - local vs cloud write routing and cloud mirror persistence.
- `memori/memory/_writer.py` - transactional persistence and cached ID creation.
- `memori/memory/recall.py` - recall query flow, embedding generation, retries, cloud/local recall parsing.
- `memori/search/_core.py` - dense+lexical ranking pipeline.
- `memori/memory/augmentation/_manager.py` - async runtime, queueing, backpressure control.
- `memori/memory/augmentation/augmentations/memori/_augmentation.py` - API payload composition and enrichment write scheduling.
- `memori/storage/migrations/_sqlite.py` and `memori/storage/migrations/_mongodb.py` - canonical memory schema/index contracts.

[SOURCE: https://github.com/MemoriLabs/Memori]

## 10) [Assumes: X] + confidence

- **Assumes A**: This analysis uses `main` branch files as fetched at analysis time and does not validate historical branches/tags.
- **Assumes B**: Architectural docs in `docs/` are aligned with current code paths.
- **Assumes C**: Behavioral claims for provider wrappers are inferred from wrapper implementation and not runtime-tested in this investigation.

Confidence: **88/100** (high for architecture/code-structure mapping; moderate residual risk on undocumented runtime edge cases).
