---
title: "Tasks: Sprint 9 — Extra Features"
description: "Task Format: T### [P?] Description (file path)"
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

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Hardening & Ergonomics

### P0-1: Strict Zod Schema Validation

**Pre-work:**
- [ ] T001 Install zod dependency (`npm install zod`) and verify TypeScript types resolve
- [ ] T002 Audit all 24 MCP tools in `tool-schemas.ts` (lines 19-358) — create a scratch document mapping each tool to its exact parameter types, defaults, and enum values

**Schema definitions (parallelizable T003-T007):**
- [ ] T003 [P] Define Zod schemas for L1-L2 retrieval tools (`tool-schemas.ts`):
  - `memory_context`: input (required string), mode (enum: auto|quick|deep|focused|resume), intent (7-value enum), specFolder, limit, sessionId, enableDedup, includeContent, tokenUsage, anchors (string array)
  - `memory_search`: query (string min:2 max:1000) OR concepts (string array), specFolder, limit (int 1-50), sessionId (uuid), 20+ optional params including tier, contextType, useDecay, mode, rerank, intent, applyLengthPenalty, minState, etc.
  - `memory_match_triggers`: prompt (required string), limit, session_id, turnNumber, include_cognitive
- [ ] T004 [P] Define Zod schemas for L2 mutation tools (`tool-schemas.ts`):
  - `memory_save`: filePath (required string), force (bool), dryRun (bool), skipPreflight (bool), asyncEmbedding (bool)
  - `memory_delete`: id (number, single) OR specFolder+confirm (bulk) — use discriminated union
  - `memory_update`: id (required number), title, triggerPhrases (array), importanceWeight, importanceTier, allowPartialUpdate
  - `memory_validate`: id (required), wasUseful (required bool), queryId, queryTerms, resultRank, totalResultsShown, searchMode, intent, sessionId, notes
  - `memory_bulk_delete`: tier (required enum), specFolder, confirm (required bool), olderThanDays, skipCheckpoint
- [ ] T005 [P] Define Zod schemas for L3 discovery tools (`tool-schemas.ts`):
  - `memory_list`: limit, offset, specFolder, sortBy, includeChunks
  - `memory_stats`: folderRanking, excludePatterns, includeScores, includeArchived, limit
  - `memory_health`: reportMode, limit, specFolder
- [ ] T006 [P] Define Zod schemas for L5 lifecycle tools (`tool-schemas.ts`):
  - `checkpoint_create`: name (required string), specFolder, metadata (record)
  - `checkpoint_list`: specFolder, limit
  - `checkpoint_restore`: name (required), clearExisting
  - `checkpoint_delete`: name (required)
- [ ] T007 [P] Define Zod schemas for L6-L7 analysis + maintenance tools (`tool-schemas.ts`):
  - `task_preflight/postflight`: specFolder+taskId+3 scores (all required), knowledgeGaps, sessionId
  - `memory_drift_why`: memoryId (required), maxDepth, direction (enum: outgoing|incoming|both), relations (array of 6 types), includeMemoryDetails
  - `memory_causal_link`: sourceId+targetId+relation (all required), strength, evidence
  - `memory_causal_stats`: no params
  - `memory_causal_unlink`: edgeId (required)
  - `eval_run_ablation`: channels (array), groundTruthQueryIds, recallK, storeResults, includeFormattedReport
  - `eval_reporting_dashboard`: sprintFilter, channelFilter, metricFilter, limit, format
  - `memory_index_scan`: specFolder, force, includeConstitutional, includeSpecDocs, incremental
  - `memory_get_learning_history`: specFolder (required), sessionId, limit, onlyComplete, includeSummary

**Integration:**
- [ ] T008 Create `getSchema()` helper gating `.strict()` vs `.passthrough()` based on `SPECKIT_STRICT_SCHEMAS` env var
- [ ] T009 Wrap all 29 handler entry points in `schema.parse(rawInput)` with try/catch returning formatted Zod errors (`handlers/*.ts`)
- [ ] T010 Add `SPECKIT_STRICT_SCHEMAS` env var documentation (default: `true`)
- [ ] T011 Create Zod error formatter that produces LLM-actionable messages: "Unknown parameter 'foo'. Expected one of: query, specFolder, limit, ..."

**Testing:**
- [ ] T012 Test each of the 24 tools with VALID parameters — zero regressions
- [ ] T013 Test each of the 24 tools with 1 EXTRA unknown parameter — strict mode rejects, passthrough accepts
- [ ] T014 Test error message format — verify LLM can parse and self-correct
- [ ] T015 Benchmark: measure Zod validation overhead per tool call (target: <5ms)

### P0-2: Provenance-Rich Response Envelopes

**Audit:**
- [ ] T016 Audit `formatSearchResults()` at `formatters/search-results.ts:130-321` — document full current response shape including all 18 FormattedSearchResult fields (lines 57-78)
- [ ] T017 Audit PipelineRow score fields at `lib/search/pipeline/types.ts:12-44` — map which internal fields are currently dropped before reaching the API response
- [ ] T018 Audit `resolveEffectiveScore()` at `pipeline/types.ts:56-66` — document the fallback chain: intentAdjusted → rrfScore → score → similarity/100

**Type definitions:**
- [ ] T019 Define `MemoryResultScores` interface: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention (all `number | null`)
- [ ] T020 Define `MemoryResultSource` interface: file, anchorIds, anchorTypes, lastModified, memoryState
- [ ] T021 Define `MemoryResultTrace` interface: channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution
- [ ] T022 Define `MemoryResultEnvelope` extending FormattedSearchResult with optional scores, source, trace

**Pipeline integration:**
- [ ] T023 Modify `hybrid-search.ts` Stage 4 exit (lines 934-945) to preserve trace metadata. Currently `_s4shadow` is non-enumerable — make trace data explicit in result set.
- [ ] T024 Modify `formatSearchResults()` to accept `includeTrace: boolean` option and thread PipelineRow score fields through to response
- [ ] T025 When `includeTrace: false` (default), strip scores/source/trace objects entirely — exact same response shape as current (backward compatible)
- [ ] T026 When `includeTrace: true`, populate all envelope fields from PipelineRow data already available

**Schema integration:**
- [ ] T027 [B:T003] Add `includeTrace: z.boolean().default(false)` to `memory_search` Zod schema
- [ ] T028 Thread `includeTrace` parameter from handler through to `formatSearchResults()` call at `handlers/memory-search.ts:~306`

**Testing:**
- [ ] T029 Test backward compatibility: `memory_search` without `includeTrace` returns IDENTICAL response shape as before changes
- [ ] T030 Test enriched response: `memory_search` with `includeTrace: true` returns scores, source, trace objects
- [ ] T031 Verify score values match: compare `scores.fusion` in envelope to internal `PipelineRow.rrfScore` for same result
- [ ] T032 Benchmark: measure serialization overhead of enriched envelope (target: <10ms)

### P1-6: Dynamic Server Instructions

- [ ] T033 [P] Create `buildServerInstructions()` async function in `context-server.ts` that calls existing `getMemoryStats()` handler
- [ ] T034 [P] Compose instruction string: memory count, spec folder count, active/stale counts, available channels, key tools
- [ ] T035 [P] Call `server.setInstructions()` after existing init sequence (after line 550 in context-server.ts, after SQLite version check + embedding readiness + session manager init)
- [ ] T036 [P] Gate behind `SPECKIT_DYNAMIC_INIT` env var (default: `true`)
- [ ] T037 [P] Add stale memory warning when staleCount > 10
- [ ] T038 [P] Test: start server, intercept MCP handshake, verify instructions payload contains expected data
- [ ] T039 [P] Test: set `SPECKIT_DYNAMIC_INIT=false`, verify no instructions injected
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Operational Reliability

### P0-3: Async Ingestion Job Lifecycle

**Infrastructure:**
- [ ] T040 [B:T009] Create `lib/ops/job-queue.ts` — define `IngestJob` interface with fields: id, state, specFolder, paths, filesTotal, filesProcessed, errors[], createdAt, updatedAt
- [ ] T041 Create `ingest_jobs` SQLite table in existing DB: `CREATE TABLE IF NOT EXISTS ingest_jobs (id TEXT PRIMARY KEY, state TEXT, spec_folder TEXT, paths_json TEXT, files_total INTEGER, files_processed INTEGER, errors_json TEXT, created_at TEXT, updated_at TEXT)`
- [ ] T042 Implement state machine with validation: queued→parsing→embedding→indexing→complete|failed|cancelled. Reject backward transitions except reset-on-restart.
- [ ] T043 Implement sequential file processing loop: iterate paths, call existing `indexMemoryFile()` (from `memory-save.ts:1238`), update progress after each file, check for cancellation before each file
- [ ] T044 Implement crash recovery: on server restart, scan `ingest_jobs` table for `state NOT IN ('complete','failed','cancelled')`, reset to `queued`

**Tool handlers:**
- [ ] T045 Create `memory_ingest_start` handler in new file `handlers/memory-ingest.ts`:
  - Zod input: `{ paths: z.array(z.string()).min(1), specFolder: z.string().optional() }`
  - Generate jobId via `nanoid(12)`, insert job record, enqueue via `setImmediate()`, return `{ jobId, state: 'queued', filesTotal }` in <100ms
- [ ] T046 Create `memory_ingest_status` handler:
  - Zod input: `{ jobId: z.string() }`
  - Read from `ingest_jobs` table, return full state including `progress: Math.round(filesProcessed/filesTotal * 100)`
- [ ] T047 Create `memory_ingest_cancel` handler:
  - Zod input: `{ jobId: z.string() }`
  - Set `state: 'cancelled'` in DB. Processing loop checks state before each file iteration.

**Registration & schemas:**
- [ ] T048 Register 3 new tools in `handlers/index.ts` tool dispatch map
- [ ] T049 [B:T003] Add Zod schemas for `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel` in `tool-schemas.ts`
- [ ] T050 Add tool descriptions to `tool-schemas.ts` for LLM discoverability

**Testing:**
- [ ] T051 Test: create temp dir with 10 `.md` files, call `memory_ingest_start`, verify immediate return with jobId
- [ ] T052 Test: poll `memory_ingest_status` during processing, verify progress increments and state transitions
- [ ] T053 Test: call `memory_ingest_cancel` on running job, verify processing stops and remaining files are not indexed
- [ ] T054 Test: kill server during ingestion, restart, verify crash recovery resets incomplete job to `queued`
- [ ] T055 Test: large batch (100+ files), verify no MCP timeout, verify final `complete` state

### P1-4: Contextual Tree Injection

- [ ] T056 [B:T023] Locate PI-B3 description cache in codebase — find where one-sentence spec folder descriptions are stored and how to access them
- [ ] T057 Create `injectContextualTree(row: PipelineRow, descCache: Map<string, string>): PipelineRow` function
- [ ] T058 Extract spec folder from `row.file_path` — split on `/specs/`, take last 2 path segments
- [ ] T059 Format header: `[segment1 > segment2 — description_truncated_to_60chars]`, total ≤100 chars
- [ ] T060 Insert into Stage 4 output in `hybrid-search.ts`, AFTER token budget truncation (line 945), BEFORE final return
- [ ] T061 Skip injection when `row.content` is null/undefined (e.g., `includeContent: false` mode)
- [ ] T062 Add `SPECKIT_CONTEXT_HEADERS` feature flag (default: `true`)
- [ ] T063 Test: search for known spec folder memory, verify header format `[parent > child — desc]`
- [ ] T064 Test: search with `includeContent: false`, verify no header injected (no content to prepend to)
- [ ] T065 Test: set `SPECKIT_CONTEXT_HEADERS=false`, verify no headers injected

### P1-7: Real-Time Filesystem Watching

**Setup:**
- [ ] T066 [P] Install chokidar dependency: `npm install chokidar`
- [ ] T067 [P] Create `lib/ops/file-watcher.ts` with `WatcherConfig` interface and `startFileWatcher()` function

**Core logic:**
- [ ] T068 Configure chokidar: `ignoreInitial: true`, `awaitWriteFinish: { stabilityThreshold: 1000 }`, ignore dotfiles, only `.md` extensions
- [ ] T069 Implement 2-second debounce per file path using `Map<string, NodeJS.Timeout>` — clear previous timeout on rapid saves
- [ ] T070 Implement content-hash dedup: compute SHA-256 of file content, compare to cached hash, skip re-index if unchanged (reuse TM-02 pattern)
- [ ] T071 Implement exponential backoff retry: 1s → 2s → 4s, max 3 attempts. Catch `SQLITE_BUSY` error code specifically.
- [ ] T072 Wire `reindexFn` to existing `indexMemoryFile()` from `memory-save.ts`

**Integration:**
- [ ] T073 Initialize watcher in `context-server.ts` after DB initialization, gated behind `SPECKIT_FILE_WATCHER` (default: `false`)
- [ ] T074 Configure watch directories from spec folder paths (e.g., `.opencode/specs/`)
- [ ] T075 Register `watcher.close()` in server shutdown handler (prevent process leaks)
- [ ] T076 Verify SQLite WAL mode is enforced in existing connection setup

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
- [ ] T082 Add `node-llama-cpp` dependency: `npm install node-llama-cpp` (includes native binary compilation)
- [ ] T083 Verify native compilation succeeds on macOS ARM64 (Apple Silicon)
- [ ] T084 Download target model: `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB) to `models/` directory
- [ ] T085 Add `SPECKIT_RERANKER_MODEL` env var for custom model path override

**Implementation:**
- [ ] T086 Create `lib/search/local-reranker.ts` with `canUseLocalReranker()` check: verify `RERANKER_LOCAL=true` AND free memory ≥4GB AND model file exists
- [ ] T087 Implement `rerankLocal(query, candidates, topK)` function: load model (cache in module var), score top-K candidates via cross-encoder pattern, sort by score
- [ ] T088 Add model lifecycle management: lazy load on first call, cache across queries, dispose on server shutdown hook
- [ ] T089 Implement graceful fallback: if `canUseLocalReranker()` returns false OR scoring throws, return candidates unchanged (fallback to RRF ordering)

**Integration:**
- [ ] T090 Locate Stage 3 reranking slot in `hybrid-search.ts` (approximately lines 850-900)
- [ ] T091 Add conditional call: if `RERANKER_LOCAL=true` → `rerankLocal()`, else existing Cohere/Voyage path
- [ ] T092 Preserve existing `SPECKIT_CROSS_ENCODER` gating (Stage 3 skip when disabled)

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
- [ ] T099 [B:MCP SDK HTTP transport standardization] Research MCP SDK transport negotiation patterns
- [ ] T100 [B:T099] Design multi-transport architecture: stdio (legacy) + HTTP (daemon) + SSE (streaming)
- [ ] T101 [B:T100] Implement HTTP daemon with warm model/index caches and 5-minute idle disposal
- [ ] T102 [B:T101] Add `/health` endpoint for orchestrator health checks

### P2-9: Backend Storage Adapter Abstraction
- [ ] T103 [B:Corpus >100K or multi-node demand] Define `IVectorStore` interface: search, insert, delete, dimensions
- [ ] T104 [B:T103] Define `IGraphStore` interface: addEdge, removeEdge, traverse, stats
- [ ] T105 [B:T103] Define `IDocumentStore` interface: get, put, delete, list, scan
- [ ] T106 [B:T103-105] Implement SQLite adapter implementing all 3 interfaces (refactor existing code)
- [ ] T107 [B:T106] Verify zero regression via `eval_run_ablation` after refactor

### P2-10: Namespace Management
- [ ] T108 [B:Multi-tenant demand] Design namespace isolation: separate SQLite DBs vs. table prefixes
- [ ] T109 [B:T108] Implement `list_namespaces`, `create_namespace`, `switch_namespace`, `delete_namespace` tools
- [ ] T110 [B:T109] Wire namespace selection into all existing tools

### P2-11: ANCHOR Tags as Graph Nodes
- [ ] T111 2-day spike: parse `<!-- ANCHOR: name -->` tags from indexed markdown
- [ ] T112 [B:T111] Convert parsed anchors to typed graph nodes (e.g., `ArchitectureNode`, `DecisionNode`)
- [ ] T113 [B:T112] Create edges between anchor nodes based on co-occurrence and spec folder hierarchy
- [ ] T114 [B:T113] Evaluate: does graph-based anchor retrieval outperform current S2 annotation approach?

### P2-12: AST-Level Section Retrieval
- [ ] T115 [B:Spec docs >1000 lines] Add `remark` + `remark-parse` dependencies for Markdown AST parsing
- [ ] T116 [B:T115] Implement `read_spec_section(filePath, heading)` tool: parse AST, extract section by heading match
- [ ] T117 [B:T116] Support nested headings: `## Requirements > ### P0 Blockers` returns only P0 subsection
- [ ] T118 [B:T117] Test with real spec files — verify section extraction accuracy
<!-- /ANCHOR:phase-4 -->

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
- [ ] T124 Document all 6 new/modified feature flags with: name, default, description, risk level
- [ ] T125 Create flag interaction matrix: verify no conflicting combinations (e.g., file watcher + manual index scan)

**Catalog updates:**
- [ ] T126 Update `feature_catalog.md` with new features: Zod schemas, response envelopes, async ingestion, contextual trees, GGUF reranker, dynamic init, file watcher
- [ ] T127 Update `summary_of_new_features.md` with Sprint 9 additions
- [ ] T128 Write `implementation-summary.md` after all phases complete

**Memory save:**
- [ ] T129 Save session context via `generate-context.js` to 019 memory folder
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001-T055) marked `[x]`
- [ ] All P1 tasks (T056-T098) marked `[x]` or user-approved deferral
- [ ] No `[B]` blocked tasks remaining (except Phase 4 intentional deferrals)
- [ ] `eval_run_ablation` shows zero regressions across all 3 phases (T119-T122)
- [ ] All 6 feature flags documented (T124)
- [ ] `feature_catalog.md` updated (T126)
- [ ] Manual verification of each new tool passed
- [ ] `implementation-summary.md` written (T128)
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
