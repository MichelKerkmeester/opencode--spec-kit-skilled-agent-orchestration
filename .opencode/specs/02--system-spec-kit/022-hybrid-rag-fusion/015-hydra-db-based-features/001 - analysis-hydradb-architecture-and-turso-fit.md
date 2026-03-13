# Analysis: HydraDB Architecture Patterns and Turso Fit for system-spec-kit

## Executive Summary

The current system-spec-kit memory MCP server is not just using SQLite as a storage file. It is architecturally coupled to the SQLite runtime model, `better-sqlite3` synchronous API, `sqlite-vec` virtual tables, SQLite FTS5 semantics, and local filesystem assumptions for discovery, path validation, and process coordination. That coupling is visible from package dependencies, schema construction, query design, and lifecycle handlers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:2-43] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:16-24] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114]

Moving to Turso is still highly valuable, but the near term win is not magical retrieval quality gains. The near term win is operational: shared cloud backed memory, branchable environments, better collaboration across devices and sessions, and a practical path toward multi-agent shared state. Turso now offers capabilities that materially improve operations compared to "single local SQLite file" assumptions, including branch creation from an existing database, embedded replicas for local read latency, and sync workflows. Public docs support these claims, with caveats around quota/manual branch cleanup and sync conflict semantics. (https://docs.turso.tech/features/branching, https://docs.turso.tech/features/embedded-replicas/introduction, https://docs.turso.tech/sync/usage)

However, Turso native vector behavior in the local snapshot is still brute force, with no vector index yet. That means we should not sell this migration as immediate ANN parity. The safest strategy is to first preserve existing FTS5 plus vector semantics through a libSQL compatible path and only then evaluate Turso specific FTS and vector primitives under benchmark gates. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:9-12] [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:193-203]

HydraDB public materials (including Cortex branding) describe a direction that is broader than storage migration: versioned evolving state, temporal correctness, relationship aware retrieval, and shared learning across agents. Those patterns align with what system-spec-kit already started (history, causal graph traversal, working memory, FSRS, artifact routing), but Turso alone will not deliver Hydra style state behavior. The product level state model must be implemented above the database layer. (https://hydradb.com/, https://hydradb.com/manifesto, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures)

## Scope and Assumptions

[Assumes: the requested feature catalog path refers to 022-hybrid-rag-fusion/012-feature-catalog materials because /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion-refinement/feature_catalog/feature_catalog.md does not exist in this workspace.]

[Assumes: HydraDB and Cortex references describe the same product branding based on public site content.]

[Assumes: no public HydraDB source repository was available during this research, so HydraDB architecture is inferred from public site and blog materials.]

## 1. Current system-spec-kit Memory Architecture Baseline

### 1.1 Storage and schema are SQLite specific, not generic SQL

The MCP server explicitly depends on `better-sqlite3` and `sqlite-vec`, not an abstract SQL adapter. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:35-43]

The core schema mixes normal relational tables (`memory_index`) with SQLite virtual tables and triggers (`vec_memories`, `memory_fts`, `memory_fts_insert/update/delete`). This matters because migration is not only table copy. It is compatibility work around how indexing and search are implemented. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407]

Embedding handling is tightly tied to a provider dimension model and to local vector metadata (`vec_metadata.embedding_dim`). Mismatch behavior is hard-fail for vector search and currently assumes direct local DB access patterns. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:117-145]

Database path resolution is also local-file oriented (`MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR`, profile based local path derivation). Allowed path enforcement references workspace and home directories, not a remote endpoint model. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:213-235]

### 1.2 Retrieval behavior depends on SQLite FTS plus sqlite-vec

Stage 1 retrieval already acts like a hybrid orchestrator: multi-concept channels, deep mode query expansion, hybrid fallback logic, and post-filtering for quality/tier/context. That means migration cannot be treated as "swap one query"; it touches an orchestration pipeline. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7-33] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319]

Vector query behavior explicitly requires `embedding_status = 'success'`, joins `vec_memories`, and computes cosine distance via SQLite function syntax. Deferred memories are therefore lexical/structural only until embeddings settle. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:192-291]

Lexical retrieval is currently tuned around FTS5 BM25 with column weights (`title`, `trigger_phrases`, `file_path`, `content_text`) and score inversion assumptions (`-bm25(...)`). Any backend shift must preserve these relevance semantics long enough to avoid ranking regressions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114]

### 1.3 Graph, routing, and memory quality are integrated into retrieval

Causal boost is implemented as recursive CTE traversal up to two hops, relation multipliers, and injected neighbor rows. This is far beyond simple vector similarity and is an important bridge to Hydra style relationship aware memory. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218]

Artifact routing introduces class specific retrieval weights and policies for spec, plan, tasks, checklist, decision-record, implementation-summary, memory, and research artifacts. This is already a practical retrieval policy layer that can map to future tenant or context boundaries. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:12-148]

Deferred lexical only indexing is documented as implemented reality, reinforcing that the system already tolerates staggered vector readiness and can operate in mixed indexing states. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:14-17]

### 1.4 Save/index lifecycle and process model assume local mutable DB file

`memory-save` does per-spec-folder locking, dedup by canonical path and content hash, chunking for large payloads, embedding generation/cache behavior, and quality gate checks in one path. This is strong functionality but currently built around one local write authority. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]

Spec document discovery scans filesystem roots (`.opencode/specs`, `specs`), excludes `memory` and `scratch`, and infers spec level from marker/sibling files. This increases utility, but also means migration must keep local document discovery behavior stable while storage backend changes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:15-159]

A durable ingest queue exists with persisted state transitions and crash recovery, again currently built on the same SQLite stack. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:14-255] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:14-18]

Cross-process hot rebinding uses marker file detection and module rebind logic to reopen the DB when another process mutates it. This is clever, but it is also a symptom of file local coupling that can be reduced by centralized remote state. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:113-208] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md:14-17]

### 1.5 Cognitive features already model time, attention, and history

Working memory provides session scoped attention state with decay, focus tracking, and capped capacity semantics. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:25-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:128-217]

FSRS scheduler provides long term retrievability and review scheduling mathematics. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:7-215]

Access tracking computes usage/recency signals and flushes into index fields. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220]

History logging persists ADD/UPDATE/DELETE event trails by memory id. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204]

Taken together, this means the system already has several Hydra-like ingredients, but not yet a unified versioned state model.

## 2. Turso and libSQL Capability Landscape (Current State)

### 2.1 What Turso improves immediately

Turso branching enables creating separate DB instances from an existing DB or snapshot. This directly supports branch-per-spec, PR sandboxes, and isolated experiments without cloning filesystem DB files manually. Docs note manual cleanup and quota impact, so governance is required. (https://docs.turso.tech/features/branching)

Embedded replicas provide local fast reads with periodic sync (`syncInterval`) and read-your-writes behavior, which fits the MCP server's local-first interaction pattern. Docs also warn this is not suitable for serverless/filesystem-less environments and advise not opening the local file while sync engine is active. (https://docs.turso.tech/features/embedded-replicas/introduction)

Sync usage gives a concrete local path + remote URL + auth token model and calls out conflict behavior (last push wins) and bootstrap options. This maps well to current cross-device and multi-process concerns, but it shifts consistency risk to sync policy decisions. (https://docs.turso.tech/sync/usage)

The local Turso snapshot also shows JavaScript sync package support but flags beta maturity, so production rollout should be staged with backup and rollback discipline. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/bindings/javascript/sync/README.md:15-50]

### 2.2 What Turso does not yet solve for this system

Vector operations are available (`vector32`, `vector64`, distance functions) in docs, but the local snapshot explicitly states vector indexes are not yet supported and searches are brute force scans. That means current sqlite-vec virtual-table expectations cannot be mapped one-to-one to indexed ANN behavior today. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:9-12] [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:193-203] (https://docs.turso.tech/guides/vector-search)

Turso FTS is tantivy-based with `CREATE INDEX ... USING fts` plus `fts_match` and `fts_score` style semantics, which are not identical to SQLite FTS5 virtual table patterns. Relevance drift is likely if swapped without calibration tests. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/docs/fts.md:84-154] (https://docs.turso.tech/sql-reference/functions/fts)

Turso architecture remains SQLite-like SQL semantics with async IO emphasis, which is good for migration familiarity, but does not remove the need to rework storage wiring and process assumptions in the MCP server. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/docs/manual.md:1227-1253]

### 2.3 Practical interpretation for this codebase

The fastest safe path is: keep logical retrieval behavior stable first, then incrementally adopt Turso-specific primitives where they outperform baseline under measured load. That means libSQL compatibility first, Turso-native FTS/vector optimization second.

## 3. HydraDB Public Architecture Patterns and Relevance

### 3.1 Inferred Hydra pattern set

HydraDB home and manifesto position memory as evolving state rather than static retrieval, emphasizing context relationships, decisions, timeline, and decay of irrelevant context. (https://hydradb.com/, https://hydradb.com/manifesto)

Hydra blogs add claims around persistent versioned state in retrieval, time-aware knowledge graph behavior, self-improving retrieval loops, and strong benchmark performance claims. (https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures)

The scaling and multi-agent posts describe hybrid retrieval (vector + BM25 + metadata-first filtering + weighted reranking), relationship-preserving graph structures, automated ingestion, hierarchical context propagation, strict user/agent boundaries, and real-time sync. (https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale, https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents)

The memory model article frames working memory, episodic memory, semantic memory, and governance boundaries as distinct concerns. (https://hydradb.com/blog/how-memory-works-in-large-language-models)

### 3.2 Where system-spec-kit already aligns

Hybrid retrieval is already present in Stage 1 orchestration and weighted lexical plus vector behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114]

Relationship-aware retrieval exists via causal graph traversal and injection. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218]

Temporal and memory-state signals exist through FSRS, access tracking, and history. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:7-215] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204]

Artifact-aware retrieval policy exists via routing by document class. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:12-148]

### 3.3 Where system-spec-kit does not yet match Hydra style state model

There is no first-class versioned memory-state object model with explicit lineage and promoted "state snapshots" for retrieval decisions. Current history is event logging, not full semantic state versioning.

There is no strong tenant boundary model equivalent to strict user/agent hierarchy; current scoping is mostly by spec folder/session/context fields.

There is no centralized feedback-learning loop that continuously reweights retrieval policy across agents in a shared cloud context.

This gap is architectural and product-level; Turso only enables it operationally.

## 4. Fit Analysis: SQLite -> Turso for Current and Future Features

### 4.1 Strong fit areas (high confidence)

1. Shared memory across machines and processes becomes practical, reducing dependence on local marker-file rebinding patterns. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:113-208]
2. Branch-per-spec and branch-per-PR workflows become straightforward with Turso branching, enabling safer experimentation and validation environments.
3. Embedded replica mode can preserve fast local reads while enabling remote canonical state and sync-based collaboration.
4. Existing async ingestion queue and deferred lexical-only indexing already support eventually-consistent indexing behavior, which is useful during sync and migration windows. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:14-255] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:14-17]

### 4.2 Friction areas (must solve before backend switch)

1. Storage abstraction is explicitly marked planned but deferred. This is the highest risk blocker because the code currently routes storage concerns through concrete SQLite behavior. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md:1-18]
2. Query semantics differ across FTS engines. Current BM25 weighting relies on FTS5 shape; Turso tantivy FTS scoring and tokenizer behavior need calibration.
3. Vector path assumptions differ. Current sqlite-vec virtual table and embedding dimension metadata patterns are not drop-in for Turso brute-force vector functions.
4. Filesystem discovery and path security logic are local-path centric, while cloud-backed memory introduces remote state concerns not yet modeled in handlers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:15-159] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:213-235]
5. Sync conflict semantics (last push wins) can conflict with memory quality and audit expectations unless write policies and conflict resolution strategy are added.

### 4.3 Critical synthesis

- Current system-spec-kit is deeply coupled to `better-sqlite3`, sqlite virtual tables, FTS5 BM25 syntax, and local file assumptions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:35-43] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1352-1403] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114]
- Turso offers more than older migration notes implied: branching, embedded replicas, sync, vector functions, optional sqlite-vec in some contexts, and Turso-specific FTS.
- Turso native vector indexing limitations remain real in current snapshot; do not oversell ANN parity. [SOURCE: .opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/cli/manuals/vector.md:9-12]
- Biggest near-term win is operational and architectural (shared/cloud-backed memory, branchable environments, multi-device state), not raw ranking quality.
- Highest-priority prerequisite is a real storage + lexical + vector adapter boundary before backend migration. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md:16-17]
- HydraDB-inspired patterns (versioned state, timeline awareness, tenant boundaries, shared learning) should be treated as product roadmap features above the storage migration.
- Turso does not provide Hydra state behavior by default; it makes centralized, shared, and branchable operations feasible.

## 5. Actionable Conclusions

1. Treat migration as two tracks: (a) storage portability and operations, (b) state-model evolution.
2. Lock in retrieval parity first by preserving current lexical/vector behavior through a compatibility adapter, not by immediate engine rewrites.
3. Use Turso branching and replica/sync capabilities early for development workflow and shared-memory operations, even before full retrieval engine migration.
4. Use current features as stepping stones to Hydra-like behavior: history + causal graph + working memory + FSRS + artifact routing can become the base of versioned and policy-aware memory state.
5. Keep claims grounded: migration improves collaboration, operability, and future architecture runway now; ANN-grade vector performance and full Hydra-style state require later measured phases.

## 6. Bottom Line

Turso is a strong operational fit for system-spec-kit now, but only if migration sequencing is disciplined: finish adapter boundaries first, run parity harnesses second, adopt cloud/branch/sync operations third, and build Hydra-inspired state capabilities as explicit product features rather than implicit backend side effects. The architecture is already close enough to make this practical, but not yet abstracted enough to make it low-risk without phased execution.
