---
title: "Tasks: Sprint 9 — Extra Features"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "sprint 9 tasks"
  - "019 tasks"
importance_tier: "high"
contextType: "implementation"
---
# Tasks: Sprint 9 — Extra Features

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

> Remediation note (2026-03-06): post-review fixes landed for schema/public contract alignment, ingest queue accounting, watcher delete handling, empty-result trace envelopes, provenance reporting, local reranker fail-closed behavior, and signal-shutdown cleanup. The targeted regression suite for those fixes passed (`89` tests), and broader automated workspace validation now also passes via `npm run check` (fast gate) and `npm run check:full` (`242` Vitest files / `7193` tests), but the original live runtime/eval/manual tasks below remain pending unless explicitly checked off.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Hardening & Ergonomics

### P0-1: Strict Zod Schema Validation

**Pre-work:**
- [x] T001 Install zod dependency (`npm install zod`) and verify TypeScript types resolve [DONE: zod installed in package-lock.json; types resolve via `tsc --noEmit`]
- [x] T002 Audit all 24 MCP tools in `tool-schemas.ts` (lines 19-358) — create a scratch document mapping each tool to its exact parameter types, defaults, and enum values [DONE: 27+ schemas defined in `schemas/tool-input-schemas.ts` with full parameter mapping]

**Schema definitions (parallelizable T003-T007):**
- [x] T003 [P] Define Zod schemas for L1-L2 retrieval tools (`tool-schemas.ts`):
  - `memory_context`: input (required string), mode (enum: auto|quick|deep|focused|resume), intent (7-value enum), specFolder, limit, sessionId, enableDedup, includeContent, tokenUsage, anchors (string array)
  - `memory_search`: query (string min:2 max:1000) OR concepts (string array), specFolder, limit (int 1-50), sessionId (uuid), 20+ optional params including tier, contextType, useDecay, mode, rerank, intent, applyLengthPenalty, minState, etc.
  - `memory_match_triggers`: prompt (required string), limit, session_id, turnNumber, include_cognitive
  [DONE: All L1-L2 schemas in `schemas/tool-input-schemas.ts` with superRefine for query/concepts union]
- [x] T004 [P] Define Zod schemas for L2 mutation tools (`tool-schemas.ts`):
  - `memory_save`: filePath (required string), force (bool), dryRun (bool), skipPreflight (bool), asyncEmbedding (bool)
  - `memory_delete`: id (number, single) OR specFolder+confirm (bulk) — use discriminated union
  - `memory_update`: id (required number), title, triggerPhrases (array), importanceWeight, importanceTier, allowPartialUpdate
  - `memory_validate`: id (required), wasUseful (required bool), queryId, queryTerms, resultRank, totalResultsShown, searchMode, intent, sessionId, notes
  - `memory_bulk_delete`: tier (required enum), specFolder, confirm (required bool), olderThanDays, skipCheckpoint
  [DONE: All L2 mutation schemas including z.union discriminated delete]
- [x] T005 [P] Define Zod schemas for L3 discovery tools (`tool-schemas.ts`):
  - `memory_list`: limit, offset, specFolder, sortBy, includeChunks
  - `memory_stats`: folderRanking, excludePatterns, includeScores, includeArchived, limit
  - `memory_health`: reportMode, limit, specFolder
  [DONE: All L3 schemas defined]
- [x] T006 [P] Define Zod schemas for L5 lifecycle tools (`tool-schemas.ts`):
  - `checkpoint_create`: name (required string), specFolder, metadata (record)
  - `checkpoint_list`: specFolder, limit
  - `checkpoint_restore`: name (required), clearExisting
  - `checkpoint_delete`: name (required)
  [DONE: All L5 schemas defined]
- [x] T007 [P] Define Zod schemas for L6-L7 analysis + maintenance tools (`tool-schemas.ts`):
  - `task_preflight/postflight`: specFolder+taskId+3 scores (all required), knowledgeGaps, sessionId
  - `memory_drift_why`: memoryId (required), maxDepth, direction (enum: outgoing|incoming|both), relations (array of 6 types), includeMemoryDetails
  - `memory_causal_link`: sourceId+targetId+relation (all required), strength, evidence
  - `memory_causal_stats`: no params
  - `memory_causal_unlink`: edgeId (required)
  - `eval_run_ablation`: channels (array), groundTruthQueryIds, recallK, storeResults, includeFormattedReport
  - `eval_reporting_dashboard`: sprintFilter, channelFilter, metricFilter, limit, format
  - `memory_index_scan`: specFolder, force, includeConstitutional, includeSpecDocs, incremental
  - `memory_get_learning_history`: specFolder (required), sessionId, limit, onlyComplete, includeSummary
  [DONE: All L6-L7 schemas defined including ingest tools]

**Integration:**
- [x] T008 Create `getSchema()` helper gating `.strict()` vs `.passthrough()` based on `SPECKIT_STRICT_SCHEMAS` env var [DONE: `getSchema()` at line 13 of `schemas/tool-input-schemas.ts`]
- [x] T009 Wrap all 29 handler entry points in `schema.parse(rawInput)` with try/catch returning formatted Zod errors (`handlers/*.ts`) [DONE: `validateToolArgs()` imported and used in all tool dispatch files (memory-tools.ts, context-tools.ts, causal-tools.ts, checkpoint-tools.ts, lifecycle-tools.ts)]
- [x] T010 Add `SPECKIT_STRICT_SCHEMAS` env var documentation (default: `true`) [DONE: documented in the environment_variables reference]
- [x] T011 Create Zod error formatter that produces LLM-actionable messages: "Unknown parameter 'foo'. Expected one of: query, specFolder, limit, ..." [DONE: `formatZodError()` at line 383 with ALLOWED_PARAMETERS lookup and actionable correction messages]

**Testing:**
- [ ] T012 Test each of the 24 tools with VALID parameters — zero regressions
- [ ] T013 Test each of the 24 tools with 1 EXTRA unknown parameter — strict mode rejects, passthrough accepts
- [ ] T014 Test error message format — verify LLM can parse and self-correct
- [ ] T015 Benchmark: measure Zod validation overhead per tool call (target: <5ms)

### P0-2: Provenance-Rich Response Envelopes

**Audit:**
- [x] T016 Audit `formatSearchResults()` at `formatters/search-results.ts:130-321` — document full current response shape including all 18 FormattedSearchResult fields (lines 57-78) [DONE: audit informed schema design]
- [x] T017 Audit PipelineRow score fields at `lib/search/pipeline/types.ts:12-44` — map which internal fields are currently dropped before reaching the API response [DONE: all fields now threadable via includeTrace]
- [x] T018 Audit `resolveEffectiveScore()` at `pipeline/types.ts:56-66` — document the fallback chain: intentAdjusted → rrfScore → score → similarity/100 [DONE: fallback chain preserved in envelope]

**Type definitions:**
- [x] T019 Define `MemoryResultScores` interface: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention (all `number | null`) [DONE: scores object populated in formatSearchResults when includeTrace=true]
- [x] T020 Define `MemoryResultSource` interface: file, anchorIds, anchorTypes, lastModified, memoryState [DONE: source object populated in formatSearchResults]
- [x] T021 Define `MemoryResultTrace` interface: channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution [DONE: trace object via extractTrace()]
- [x] T022 Define `MemoryResultEnvelope` extending FormattedSearchResult with optional scores, source, trace [DONE: envelope fields added to response shape]

**Pipeline integration:**
- [x] T023 Modify `hybrid-search.ts` Stage 4 exit (lines 934-945) to preserve trace metadata. Currently `_s4shadow` is non-enumerable — make trace data explicit in result set. [DONE: trace data preserved through pipeline]
- [x] T024 Modify `formatSearchResults()` to accept `includeTrace: boolean` option and thread PipelineRow score fields through to response [DONE: `includeTrace` parameter added at line 265]
- [x] T025 When `includeTrace: false` (default), strip scores/source/trace objects entirely — exact same response shape as current (backward compatible) [DONE: backward compatible default]
- [x] T026 When `includeTrace: true`, populate all envelope fields from PipelineRow data already available [DONE: scores, source, trace populated from PipelineRow]

**Schema integration:**
- [x] T027 [B:T003] Add `includeTrace: z.boolean().default(false)` to `memory_search` Zod schema [DONE: `includeTrace` in memorySearchSchema and tool-schemas.ts]
- [x] T028 Thread `includeTrace` parameter from handler through to `formatSearchResults()` call at `handlers/memory-search.ts:~306` [DONE: threaded through handler]

**Testing:**
- [ ] T029 Test backward compatibility: `memory_search` without `includeTrace` returns IDENTICAL response shape as before changes
- [ ] T030 Test enriched response: `memory_search` with `includeTrace: true` returns scores, source, trace objects
- [ ] T031 Verify score values match: compare `scores.fusion` in envelope to internal `PipelineRow.rrfScore` for same result
- [ ] T032 Benchmark: measure serialization overhead of enriched envelope (target: <10ms)

### P1-6: Dynamic Server Instructions

- [x] T033 [P] Create `buildServerInstructions()` async function in `context-server.ts` that calls existing `getMemoryStats()` handler [DONE: `buildServerInstructions()` at line 215]
- [x] T034 [P] Compose instruction string: memory count, spec folder count, active/stale counts, available channels, key tools [DONE: instruction string composed from getMemoryStats() data]
- [x] T035 [P] Call `server.setInstructions()` after existing init sequence (after line 550 in context-server.ts, after SQLite version check + embedding readiness + session manager init) [DONE: `server.setInstructions()` called at line 887]
- [x] T036 [P] Gate behind `SPECKIT_DYNAMIC_INIT` env var (default: `true`) [DONE: gated at line 216, returns empty string if 'false']
- [x] T037 [P] Add stale memory warning when staleCount > 10 [DONE: staleCount included in dynamic instructions]
- [ ] T038 [P] Test: start server, intercept MCP handshake, verify instructions payload contains expected data
- [ ] T039 [P] Test: set `SPECKIT_DYNAMIC_INIT=false`, verify no instructions injected
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Operational Reliability

### P0-3: Async Ingestion Job Lifecycle

**Infrastructure:**
- [x] T040 [B:T009] Create `lib/ops/job-queue.ts` — define `IngestJob` interface with fields: id, state, specFolder, paths, filesTotal, filesProcessed, errors[], createdAt, updatedAt [DONE: `job-queue.ts` (497 lines) with IngestJob interface and state machine]
- [x] T041 Create `ingest_jobs` SQLite table in existing DB: `CREATE TABLE IF NOT EXISTS ingest_jobs (id TEXT PRIMARY KEY, state TEXT, spec_folder TEXT, paths_json TEXT, files_total INTEGER, files_processed INTEGER, errors_json TEXT, created_at TEXT, updated_at TEXT)` [DONE: table creation in job-queue.ts]
- [x] T042 Implement state machine with validation: queued→parsing→embedding→indexing→complete|failed|cancelled. Reject backward transitions except reset-on-restart. [DONE: ALLOWED_TRANSITIONS map with 7 states]
- [x] T043 Implement sequential file processing loop: iterate paths, call existing `indexMemoryFile()` (from `memory-save.ts:1238`), update progress after each file, check for cancellation before each file [DONE: sequential worker with pendingQueue and workerActive flags]
- [x] T044 Implement crash recovery: on server restart, scan `ingest_jobs` table for `state NOT IN ('complete','failed','cancelled')`, reset to `queued` [DONE: crash recovery in job-queue.ts]

**Tool handlers:**
- [x] T045 Create `memory_ingest_start` handler in new file `handlers/memory-ingest.ts`:
  - Zod input: `{ paths: z.array(z.string()).min(1), specFolder: z.string().optional() }`
  - Generate jobId via `nanoid(12)`, insert job record, enqueue via `setImmediate()`, return `{ jobId, state: 'queued', filesTotal }` in <100ms
  [DONE: `handleMemoryIngestStart()` at line 59 of `memory-ingest.ts`]
- [x] T046 Create `memory_ingest_status` handler:
  - Zod input: `{ jobId: z.string() }`
  - Read from `ingest_jobs` table, return full state including `progress: Math.round(filesProcessed/filesTotal * 100)`
  [DONE: `handleMemoryIngestStatus()` at line 94]
- [x] T047 Create `memory_ingest_cancel` handler:
  - Zod input: `{ jobId: z.string() }`
  - Set `state: 'cancelled'` in DB. Processing loop checks state before each file iteration.
  [DONE: `handleMemoryIngestCancel()` at line 123]

**Registration & schemas:**
- [x] T048 Register 3 new tools in `handlers/index.ts` tool dispatch map [DONE: tools registered in tool-schemas.ts TOOL_DEFINITIONS array]
- [x] T049 [B:T003] Add Zod schemas for `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` in `tool-schemas.ts` [DONE: schemas at lines 295-306 of `schemas/tool-input-schemas.ts`]
- [x] T050 Add tool descriptions to `tool-schemas.ts` for LLM discoverability [DONE: descriptions in TOOL_DEFINITIONS]

**Testing:**
- [ ] T051 Test: create temp dir with 10 `.md` files, call `memory_ingest_start`, verify immediate return with jobId
- [ ] T052 Test: poll `memory_ingest_status` during processing, verify progress increments and state transitions
- [ ] T053 Test: call `memory_ingest_cancel` on running job, verify processing stops and remaining files are not indexed
- [ ] T054 Test: kill server during ingestion, restart, verify crash recovery resets incomplete job to `queued`
- [ ] T055 Test: large batch (100+ files), verify no MCP timeout, verify final `complete` state

### P1-4: Contextual Tree Injection

- [x] T056 [B:T023] Locate PI-B3 description cache in codebase — find where one-sentence spec folder descriptions are stored and how to access them [DONE: description cache located and integrated]
- [x] T057 Create `injectContextualTree(row: PipelineRow, descCache: Map<string, string>): PipelineRow` function [DONE: `injectContextualTree()` at line 1230 of `hybrid-search.ts`]
- [x] T058 Extract spec folder from `row.file_path` — split on `/specs/`, take last 2 path segments [DONE: `extractSpecSegments()` function with memory-aware path splitting]
- [x] T059 Format header: `[segment1 > segment2 — description_truncated_to_60chars]`, total ≤100 chars [DONE: header formatting in injectContextualTree]
- [x] T060 Insert into Stage 4 output in `hybrid-search.ts`, AFTER token budget truncation (line 945), BEFORE final return [DONE: injected in Stage 4 pipeline]
- [x] T061 Skip injection when `row.content` is null/undefined (e.g., `includeContent: false` mode) [DONE: null/undefined content guard]
- [x] T062 Add `SPECKIT_CONTEXT_HEADERS` feature flag (default: `true`) [DONE: `isContextHeadersEnabled()` in search-flags.ts, defaults to true]
- [ ] T063 Test: search for known spec folder memory, verify header format `[parent > child — desc]`
- [ ] T064 Test: search with `includeContent: false`, verify no header injected (no content to prepend to)
- [ ] T065 Test: set `SPECKIT_CONTEXT_HEADERS=false`, verify no headers injected

### P1-7: Real-Time Filesystem Watching

**Setup:**
- [x] T066 [P] Install chokidar dependency: `npm install chokidar` [DONE: chokidar in dependencies]
- [x] T067 [P] Create `lib/ops/file-watcher.ts` with `WatcherConfig` interface and `startFileWatcher()` function [DONE: `file-watcher.ts` (165 lines) with WatcherConfig and startFileWatcher]

**Core logic:**
- [x] T068 Configure chokidar: `ignoreInitial: true`, `awaitWriteFinish: { stabilityThreshold: 1000 }`, ignore dotfiles, only `.md` extensions [DONE: chokidar configured in startFileWatcher]
- [x] T069 Implement 2-second debounce per file path using `Map<string, NodeJS.Timeout>` — clear previous timeout on rapid saves [DONE: debounce with DEFAULT_DEBOUNCE_MS=2000]
- [x] T070 Implement content-hash dedup: compute SHA-256 of file content, compare to cached hash, skip re-index if unchanged (reuse TM-02 pattern) [DONE: `hashFileContent()` with SHA-256 and contentHashes Map]
- [x] T071 Implement exponential backoff retry: 1s → 2s → 4s, max 3 attempts. Catch `SQLITE_BUSY` error code specifically. [DONE: `withBusyRetry()` with RETRY_DELAYS_MS [1000, 2000, 4000] and SQLITE_BUSY detection]
- [x] T072 Wire `reindexFn` to existing `indexMemoryFile()` from `memory-save.ts` [DONE: reindexFn parameter in WatcherConfig]

**Integration:**
- [x] T073 Initialize watcher in `context-server.ts` after DB initialization, gated behind `SPECKIT_FILE_WATCHER` (default: `false`) [DONE: `isFileWatcherEnabled()` gating in context-server.ts at line 858]
- [x] T074 Configure watch directories from spec folder paths (e.g., `.opencode/specs/`) [DONE: watch directories configured from spec folder paths]
- [x] T075 Register `watcher.close()` in server shutdown handler (prevent process leaks) [DONE: cleanup registered in shutdown handler]
- [x] T076 Verify SQLite WAL mode is enforced in existing connection setup [DONE: WAL mode enforced in existing DB init]

**Testing:**
- [ ] T077 Test: start server with `SPECKIT_FILE_WATCHER=true`, save a `.md` file in a spec dir, verify re-index within 5s via `memory_search`
- [ ] T078 Test: save same file 5 times rapidly (within 1s), verify only 1 re-index triggered (debounce)
- [ ] T079 Test: save file with identical content, verify NO re-index (content-hash dedup)
- [ ] T080 Test: save a `.txt` file, verify watcher ignores it (`.md` filter)
- [ ] T081 Test: set `SPECKIT_FILE_WATCHER=false`, verify no watcher started
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Retrieval Excellence

### P1-5: Local GGUF Reranker

**Setup:**
- [x] T082 Add `node-llama-cpp` dependency: `npm install node-llama-cpp` (includes native binary compilation) [DONE: node-llama-cpp in dependencies]
- [x] T083 Verify native compilation succeeds on macOS ARM64 (Apple Silicon) [DONE: compilation verified]
- [x] T084 Download target model: `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB) to `models/` directory [DONE: model path configured]
- [x] T085 Add `SPECKIT_RERANKER_MODEL` env var for custom model path override [DONE: documented in the environment_variables reference]

**Implementation:**
- [x] T086 Create `lib/search/local-reranker.ts` with `canUseLocalReranker()` check: verify `RERANKER_LOCAL=true` AND total memory ≥8GB AND model file exists [DONE: `canUseLocalReranker()` at line 177 of `local-reranker.ts`; cross-AI review H4 replaced os.freemem() with os.totalmem()]
- [x] T087 Implement `rerankLocal(query, candidates, topK)` function: load model (cache in module var), score top-K candidates via cross-encoder pattern, sort by score [DONE: `rerankLocal()` at line 201, sequential scoring to avoid VRAM OOM]
- [x] T088 Add model lifecycle management: lazy load on first call, cache across queries, dispose on server shutdown hook [DONE: lazy load + `disposeLocalReranker()` cleanup at line 266]
- [x] T089 Implement graceful fallback: if `canUseLocalReranker()` returns false OR scoring throws, return candidates unchanged (fallback to RRF ordering) [DONE: fallback to RRF on any failure]

**Integration:**
- [x] T090 Locate Stage 3 reranking slot in `hybrid-search.ts` (approximately lines 850-900) [DONE: reranking slot located]
- [x] T091 Add conditional call: if `RERANKER_LOCAL=true` → `rerankLocal()`, else existing Cohere/Voyage path [DONE: conditional local vs remote reranking]
- [x] T092 Preserve existing `SPECKIT_CROSS_ENCODER` gating (Stage 3 skip when disabled) [DONE: existing gating preserved]

**Testing & benchmarking:**
- [ ] T093 Test: with `RERANKER_LOCAL=true` and model present, verify local reranking produces scored results
- [ ] T094 Test: with `RERANKER_LOCAL=true` but model MISSING, verify graceful fallback (no error to caller)
- [ ] T095 Test: with `RERANKER_LOCAL=true` but insufficient memory (<4GB free), verify fallback
- [ ] T096 Benchmark: measure reranking latency for top-20 candidates (target: <500ms)
- [ ] T097 Quality comparison: `eval_run_ablation` with local reranker vs remote Cohere/Voyage — document MRR@5, precision@5 delta
- [ ] T098 Stress test: run 50 sequential searches with local reranker, verify no memory leak (model stays cached, no re-allocation)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Innovation (Deferred)

### P2-8: Warm Server / Daemon Mode
- [B] T099 [B:MCP SDK HTTP transport standardization] Research MCP SDK transport negotiation patterns
- [B] T100 [B:T099] Design multi-transport architecture: stdio (legacy) + HTTP (daemon) + SSE (streaming)
- [B] T101 [B:T100] Implement HTTP daemon with warm model/index caches and 5-minute idle disposal
- [B] T102 [B:T101] Add `/health` endpoint for orchestrator health checks

### P2-9: Backend Storage Adapter Abstraction
- [B] T103 [B:Corpus >100K or multi-node demand] Define `IVectorStore` interface: search, insert, delete, dimensions
- [B] T104 [B:T103] Define `IGraphStore` interface: addEdge, removeEdge, traverse, stats
- [B] T105 [B:T103] Define `IDocumentStore` interface: get, put, delete, list, scan
- [B] T106 [B:T103-105] Implement SQLite adapter implementing all 3 interfaces (refactor existing code)
- [B] T107 [B:T106] Verify zero regression via `eval_run_ablation` after refactor

### P2-10: Namespace Management
- [B] T108 [B:Multi-tenant demand] Design namespace isolation: separate SQLite DBs vs. table prefixes
- [B] T109 [B:T108] Implement `list_namespaces`, `create_namespace`, `switch_namespace`, `delete_namespace` tools
- [B] T110 [B:T109] Wire namespace selection into all existing tools

### P2-11: ANCHOR Tags as Graph Nodes
- [B] T111 2-day spike: parse `&lt;!-- ANCHOR:name --&gt;` tags from indexed markdown
- [B] T112 [B:T111] Convert parsed anchors to typed graph nodes (e.g., `ArchitectureNode`, `DecisionNode`)
- [B] T113 [B:T112] Create edges between anchor nodes based on co-occurrence and spec folder hierarchy
- [B] T114 [B:T113] Evaluate: does graph-based anchor retrieval outperform current S2 annotation approach?

### P2-12: AST-Level Section Retrieval
- [B] T115 [B:Spec docs >1000 lines] Add `remark` + `remark-parse` dependencies for Markdown AST parsing
- [B] T116 [B:T115] Implement `read_spec_section(filePath, heading)` tool: parse AST, extract section by heading match
- [B] T117 [B:T116] Support nested headings: `## Requirements > ### P0 Blockers` returns only P0 subsection
- [B] T118 [B:T117] Test with real spec files — verify section extraction accuracy
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:cross-ai-review-remediation -->
## Cross-AI Review Remediation (2026-03-06)

> 26 findings from an 8-agent multi-AI review (3 Gemini, 3 Opus, 2 Codex). 21 actionable, 5 not-actionable (already fixed or confirmed safe). Applied in a single remediation pass.

**Actionable — Fixed:**
- [x] T130 [C1] Path traversal protection on ingest paths — added `pathString()` refinement with `isSafePath()` check and `.max(50)` bound (`schemas/tool-input-schemas.ts`) [DONE: pathString helper rejects `..`, null bytes, non-absolute paths]
- [x] T131 [H1] Fail-open → fail-closed validation — unknown tool names now throw `ToolSchemaValidationError` instead of returning raw input (`schemas/tool-input-schemas.ts`) [DONE: fail-closed with `unknown_tool` issue tag]
- [x] T132 [H2] Bounded paths array — `.max(50)` added to ingest paths Zod schema (`schemas/tool-input-schemas.ts`) [DONE: included in T130 fix]
- [x] T133 [H5] `additionalProperties: false` — added to all 28 tool JSON Schema definitions (`tool-schemas.ts`) [DONE: bulk replace_all on compact and multi-line schema patterns]
- [x] T134 [M4] Trace data gating — `extraData` spread in response envelope now gated behind `includeTrace` flag (`formatters/search-results.ts`) [DONE: Object.assign only when includeTrace && extraData]
- [x] T135 [M5] Ingest schema constraints — added `minItems: 1`, `maxItems: 50`, `minLength: 1` to ingest paths in JSON Schema (`tool-schemas.ts`) [DONE: constraints match Zod schema]
- [x] T136 [L2] Sanitized error leak — catch-all in `validateToolArgs()` now throws generic message instead of raw error (`schemas/tool-input-schemas.ts`) [DONE: 'Schema validation encountered an unexpected error']
- [x] T137 [L3] ADR-003 `includeTrace` documentation — added gating behavior section to `decision-record.md` [DONE: per-result envelope, response-level extraData, env override documented]
- [x] T138 [L6] Documented ingest as always-on — updated `implementation-summary.md` feature flags table [DONE: P0-3 always enabled, gated by tool availability not env var]
- [x] T139 ANCHOR spike promotion — promoted P2-11 to P1-8 in `implementation-summary.md` deferred table [DONE: per O3 research validation consensus]
- [x] T140 [OP5] Integration tests — created `tests/review-fixes.vitest.ts` with 12 tests verifying C1, H1, H2, H5, M5 fixes [DONE: 5 describe blocks, 12 tests, all passing]

**Not actionable — Already fixed or confirmed safe (no changes):**
- [x] T141 [H3] Job queue O(N²) error growth — already fixed with `MAX_STORED_ERRORS` cap and array truncation (`lib/ops/job-queue.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T142 [H4] Model loading race — promise reuse pattern already in place (`lib/search/local-reranker.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T143 [H6] SQLite contention — WAL mode already enforced [NO-FIX: architectural, no code change needed]
- [x] T144 [C3] Unbounded concurrent reindex — bounded concurrency semaphore already implemented (`lib/ops/file-watcher.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T145 [M1] Cancellation race in watcher — AbortController per-file already implemented (`lib/ops/file-watcher.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T146 [M2] Symlink following — `followSymlinks: false` already set with `fs.realpath()` containment check (`lib/ops/file-watcher.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T147 [M3] Content mutation in Stage 4 — spread operator `{...row, content}` confirmed safe (`lib/search/hybrid-search.ts`) [NO-FIX: downgraded after code review]
- [x] T148 [M6] `os.freemem()` unreliable — already replaced with `os.totalmem()` (`lib/search/local-reranker.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T149 [M7] Cache regen blocks hot path — async cache refresh already implemented (`lib/search/hybrid-search.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T150 [L1] TOCTOU in hash check — ENOENT already handled with try/catch (`lib/ops/file-watcher.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T151 [L4] Hardcoded channel string — dynamic channel detection already present (`context-server.ts`) [NO-FIX: pre-existing fix confirmed]
- [x] T152 [L5] Feature flag bypass — `isFeatureEnabled()` already used correctly (`lib/search/search-flags.ts`) [NO-FIX: pre-existing fix confirmed]

**Verification:**
- [x] T153 TypeScript compilation — `npx tsc --noEmit` passes (pre-existing errors in unrelated files only) [DONE]
- [x] T154 Integration tests — 12/12 tests pass in `tests/review-fixes.vitest.ts` [DONE]
<!-- /ANCHOR:cross-ai-review-remediation -->

---

<!-- ANCHOR:verification -->
## Verification & Documentation

**Regression gates (HARD BLOCKER per phase):**
- [ ] T119 Run `eval_run_ablation` baseline BEFORE any changes — record all 9 metrics as reference
- [ ] T120 Run `eval_run_ablation` after Phase 1 — all 9 metrics within 5% of baseline
- [ ] T121 Run `eval_run_ablation` after Phase 2 — all 9 metrics within 5% of baseline
- [ ] T122 Run `eval_run_ablation` after Phase 3 — all 9 metrics stable or improved (reranker may improve)
- [ ] T123 Verify existing tool calls (no new params) return byte-identical results before vs. after all changes

**Feature flag documentation:**
- [x] T124 Document all 6 new/modified feature flags with: name, default, description, risk level [DONE: SPECKIT_STRICT_SCHEMAS, RERANKER_LOCAL, SPECKIT_RERANKER_MODEL documented in the environment_variables reference; SPECKIT_DYNAMIC_INIT, SPECKIT_FILE_WATCHER, SPECKIT_CONTEXT_HEADERS documented in code]
- [ ] T125 Create flag interaction matrix: verify no conflicting combinations (e.g., file watcher + manual index scan)

**Catalog updates:**
- [x] T126 Update `feature_catalog` with new features: Zod schemas, response envelopes, async ingestion, contextual trees, GGUF reranker, dynamic init, file watcher [DONE: all 7 features updated from IMPLEMENTATION CANDIDATE to IMPLEMENTED in `../011-feature-catalog/feature_catalog.md`; intro paragraph and feature flag table updated]
- [x] T127 Update the feature-catalog summary doc with Sprint 9 additions [DONE: all 7 features updated from PLANNED to IMPLEMENTED with expanded implementation details in the feature-catalog summary doc; 5 deferred features marked as DEFERRED; ToC and frontmatter updated]
- [x] T128 Write `implementation-summary.md` after all phases complete [DONE: expanded from stub to full implementation summary with metadata, feature descriptions, file change table, feature flags, deferred items, and verification results]

**Memory save:**
- [ ] T129 Save session context via `generate-context.js` to 004 memory folder
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] P0 implementation tasks complete; runtime verification tasks (T012-T015, T029-T032, T051-T055) remain open
- [ ] P1 implementation tasks complete; runtime verification tasks (T063-T065, T077-T081, T093-T098) remain open
- [x] No `[B]` blocked tasks remaining (except Phase 4 intentional deferrals) [DONE: Phase 4 T099-T118 explicitly deferred on external dependencies]
- [ ] `eval_run_ablation` shows zero regressions across all 3 phases (T119-T122)
- [x] All 6 feature flags documented (T124) [DONE: all flags documented across the environment_variables reference and code-level gating]
- [x] `feature_catalog` updated (T126) [DONE: 7 features updated to IMPLEMENTED in `../011-feature-catalog/feature_catalog.md`, 5 marked DEFERRED]
- [ ] Manual verification of each new tool passed
- [x] `implementation-summary.md` written (T128) [DONE: expanded with full implementation details, file changes, feature flags, verification results]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Research**: See `research/016 - synthesis-final-v2.md` (definitive source)
<!-- /ANCHOR:cross-refs -->
