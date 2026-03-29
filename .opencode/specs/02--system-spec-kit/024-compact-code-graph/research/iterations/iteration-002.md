# Iteration 002 — Spec Kit Memory MCP System Architecture Analysis

**Focus:** Our memory MCP system architecture, tools, and data flow
**Status:** complete
**newInfoRatio:** 0.88
**Novelty:** First direct read of the Spec Kit Memory MCP internals; most architecture detail is new even though the comparison frame came from Iteration 001.

---

## Findings

### 1. Server role and architecture

`context-server.ts` is intentionally an orchestration shell, not the place where most tool logic lives. It wires up the MCP SDK server over stdio, exposes tool metadata from `TOOL_DEFINITIONS`, and delegates execution to `dispatchTool()` in `tools/*.ts`. Around that dispatch layer it adds memory auto-surfacing, database reinitialization checks, token-budget metadata injection, response truncation when envelopes exceed the layer budget, and graceful error wrapping. In other words, the main server process is a runtime coordinator around a more modular tool/handler/lib stack.

The server also computes dynamic instructions at startup, summarizing how many memories are indexed and which retrieval channels are active. That implies the MCP surface is designed to self-describe current system state to clients, not just expose opaque tool calls.

### 2. Exposed capability surface

The tool schema file defines a broad, layered API rather than a narrow search-only interface:

- **L1 Orchestration:** `memory_context`
- **L2 Core:** `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_save`
- **L3 Discovery:** `memory_list`, `memory_stats`, `memory_health`
- **L4 Mutation:** `memory_delete`, `memory_update`, `memory_validate`, `memory_bulk_delete`
- **L5 Lifecycle:** `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`, `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable`
- **L6 Analysis:** `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`
- **L7 Maintenance:** `memory_index_scan`, `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`

This is much broader than a typical MCP memory plugin. It covers not only retrieval but also lifecycle management, shared-memory governance, causal graph analysis, evaluation, and asynchronous ingestion.

### 3. Tool schema structure

The schema structure is plain JSON Schema objects wrapped in a small `ToolDefinition` interface: `{ name, description, inputSchema }`. The schemas are strict by default with `additionalProperties: false`, use enums and bounds heavily, and sometimes add custom JSON-schema extensions such as `x-requiredAnyOf` for mutually acceptable parameter sets.

One important architectural detail: the server does not centrally validate all tool inputs with Zod at the request-handler layer. Instead, `context-server.ts` explicitly says Zod validation is applied inside each tool dispatch module to avoid double-validation overhead. So the schema file is both the MCP-exposed contract and a discovery surface, while the authoritative runtime validation still lives closer to tool handlers.

The descriptions are unusually rich. They include lifecycle level (`L1`-`L7`), intent guidance, safety notes, and token budgets. That strongly suggests the schema layer is designed for LLM/tool-routing ergonomics as much as for machine validation.

### 4. How it stores and retrieves context/memory

The system is file-backed on ingest and SQLite-backed at runtime.

On startup, the server initializes the vector index database, checks integrity, enforces WAL mode, validates embedding dimensions, and then brings up retrieval helpers including checkpoints, access tracking, hybrid search, session boost, and causal boost. It also optionally rebuilds a BM25 index from the database.

Startup scanning then discovers three classes of content:

- memory files
- constitutional files
- spec documents

Those files are indexed into the database. The server also supports recovery of `_pending` files left behind by interrupted or failed index operations, and it can run a real-time file watcher that reindexes changed markdown files or removes indexed rows when files disappear.

Retrieval is clearly hybrid rather than single-path. The runtime imports and initializes:

- `vector-index`
- `hybrid-search`
- `bm25-index`
- graph search support
- session boost
- causal boost
- trigger matching / auto-surfacing

The shared README makes that even more explicit by describing a five-channel retrieval pipeline: Vector, FTS5, BM25, Graph, and Degree, with adaptive fusion and RRF/MMR helpers in the shared algorithms package.

Inference: this system’s primary abstraction is not "graph of code entities" but "ranked memory corpus with multiple retrieval signals layered over it." The graph channel is one retrieval input among several, not the sole storage model.

### 5. Embedding and vector approach

Embeddings are centralized in the shared package, not owned solely by the MCP server. `shared/index.ts` re-exports document, query, clustering, and batch embedding functions, provider metadata accessors, profile helpers, lazy-loading diagnostics, and API-key validation helpers. That makes the shared package the canonical embedding/runtime contract used by both CLI scripts and the MCP server.

The provider abstraction supports:

- Voyage
- OpenAI
- HuggingFace local

The shared docs describe the selection order as:

1. explicit `EMBEDDINGS_PROVIDER`
2. Voyage if `VOYAGE_API_KEY` exists
3. OpenAI if `OPENAI_API_KEY` exists
4. local HF fallback

The docs also frame Voyage as the recommended provider, with provider-dependent dimensions:

- HF local: 768
- Voyage: 1024
- OpenAI: 1536/3072

The startup sequence reinforces that embeddings are operationally critical. Before the server begins normal operation it validates provider configuration, validates API keys unless explicitly skipped, sets `EMBEDDING_DIM`, optionally warms the provider eagerly, and refuses to start if the persisted database dimension does not match the active embedding profile. This makes the vector store and embedding provider tightly coupled at runtime.

### 6. Session continuity and cognitive memory

Session continuity is a first-class architectural concern, not an afterthought.

At the tool level:

- `memory_context` exposes a `resume` mode and supports a server-issued `sessionId`
- `memory_search` supports session deduplication and optional session-based score boosts
- `memory_match_triggers` supports `session_id`, `turnNumber`, attention decay, tiered HOT/WARM injection, and co-activation
- `task_preflight`, `task_postflight`, and `memory_get_learning_history` capture continuity of knowledge, uncertainty, and context over time

At the server level, `context-server.ts` initializes:

- `workingMemory`
- `attentionDecay`
- `coActivation`
- `sessionManager`

The session manager persists server-side session state strongly enough to support crash recovery: interrupted sessions are reset and recoverable session IDs are logged on startup. That means "continuity" here includes operational resilience and deduplicated retrieval history, not just reuse of a conversation ID.

### 7. Shared package boundary

`shared/` is the canonical boundary between CLI scripts and the MCP server. The README is explicit that both `scripts/` and `mcp_server/` consume the same shared TypeScript modules via `@spec-kit/shared/*` aliases. The barrel file re-exports types, embeddings, chunking, trigger extraction, retrieval-trace contracts, scoring, retry logic, folder scoring, and learned ranking helpers.

This is an important architectural choice for comparison with Dual-Graph: the system is not just an MCP server with internal helpers. It is a broader platform split into:

- shared runtime/library contracts
- MCP orchestration layer
- deeper handler/lib implementations
- CLI/script consumers that rely on the same shared primitives

### 8. Storage-profile and DB-path nuance

The shared docs expose a small architectural ambiguity worth noting. One section describes the current runtime database directory as containing `speckit_memory.db`, while the usage examples still show profile-derived database paths such as `context-index__voyage__voyage-code-2__1024.sqlite`.

Inference: the architecture preserves a profile-aware storage abstraction even if the current runtime path has consolidated around a shared SQLite database. From these files alone, the exact active naming strategy is abstracted rather than fully demonstrated.

### 9. Comparison-oriented takeaway

For a Dual-Graph comparison, the key architectural distinction is:

- **Dual-Graph:** appears graph-first and code-entity-first
- **Spec Kit Memory:** is memory-first, retrieval-fusion-first, and operations-heavy

Spec Kit Memory stores and ranks markdown/spec/context artifacts, enriches them with trigger phrases, embeddings, causal links, and session state, and then exposes a broad MCP operating surface around search, mutation, governance, learning, and evaluation. Its "graph" capability exists, but as one channel inside a larger retrieval stack rather than as the singular system model.

## Dead Ends

- The requested files clearly explain orchestration, schemas, and shared contracts, but they do not include the concrete SQL schema or the exact retrieval-weight math inside `vector-index`, `hybrid-search`, `session-boost`, or the adaptive-fusion implementation. Some retrieval details are therefore inferred from imports and docs rather than directly inspected.
- The shared documentation mixes a current runtime DB file (`speckit_memory.db`) with profile-derived DB path examples, so the precise runtime DB naming/storage strategy is not fully provable from these five files alone.

## Sources

- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:4-6,14-30,236-259,289-365,372-432,1196-1201] Server role, stdio transport, tool registration, auto-surfacing, token-budget handling, dynamic instructions
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:71-117,466-620,866-1016,1099-1168] Storage/retrieval initialization, startup scanning, pending recovery, BM25/graph/session modules, file watching
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:26-43,46-220,222-687] Tool taxonomy, JSON schema structure, scope parameters, lifecycle layers, maintenance/analysis/governance surfaces
- [SOURCE: .opencode/skill/system-spec-kit/shared/index.ts:4-5,11-70,82-141,168-182,215-230] Shared canonical export surface, embedding APIs, retrieval contracts, learned ranking utilities
- [SOURCE: .opencode/skill/system-spec-kit/shared/types.ts:22-118,183-253,452-509] Embedding provider contracts, unified search result/vector store types, MCP response envelope, task-specific embedding type system
- [SOURCE: .opencode/skill/system-spec-kit/shared/README.md:37-41,43-77,90-98,171-239,251-357,386-419] Shared architecture, five-channel retrieval framing, provider comparison, configuration precedence, shared DB/runtime notes, profile-path example
