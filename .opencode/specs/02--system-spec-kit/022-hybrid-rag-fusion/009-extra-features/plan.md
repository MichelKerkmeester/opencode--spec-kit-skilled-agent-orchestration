---
title: "Implementation Plan: Sprint 9 — Extra Features (Productization & Operational Tooling)"
description: "4-phase plan covering MCP schema hardening, response envelopes, async job lifecycle, contextual trees, GGUF reranking, file watching, and dynamic server init. All changes additive and feature-flagged."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "sprint 9 plan"
  - "019 plan"
  - "productization plan"
importance_tier: "high"
contextType: "implementation"
---
# Implementation Plan: Sprint 9 — Extra Features

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP SDK (stdio transport) |
| **Storage** | SQLite + sqlite-vec + FTS5 |
| **Testing** | eval_run_ablation (9 metrics), manual MCP tool calls |
| **New Dependencies** | zod, chokidar, node-llama-cpp (P1-5 only) |

### Overview
This plan implements 7 active items (3 P0, 4 P1) from the 016 definitive synthesis in 4 phases. Each phase is independently deployable and testable. All changes are additive (no breaking changes) and feature-flagged. The existing evaluation framework provides regression safety.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (eval framework, sqlite-vec, FTS5)
- [x] Research complete (16 documents, triple-verified)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] `eval_run_ablation` shows zero regressions
- [ ] All new features behind feature flags
- [ ] Spec/plan/tasks/checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP server with handler → service → storage separation.

### Key Components
- **Tool Schema Layer** (tool-schemas.ts): Zod validation at entry point
- **Handler Layer** (handlers/*.ts): Request processing, response envelope formatting
- **Service Layer** (lib/search/*.ts, lib/ops/*.ts): Business logic, job queue, file watcher
- **Storage Layer** (lib/storage/*.ts): SQLite persistence for jobs, indexes

### Data Flow

```
LLM Agent → MCP Tool Call → Zod Validation → Handler → Service → Storage
                                ↓                         ↓
                          Reject invalid           Async Job Queue
                                                        ↓
                                              File Watcher → Re-index
```

### New Feature Flags

| Flag | Default | Controls |
|------|---------|----------|
| `SPECKIT_STRICT_SCHEMAS` | `true` | Zod `.strict()` vs `.passthrough()` |
| `SPECKIT_RESPONSE_TRACE` | `false` | Include trace in response envelope |
| `SPECKIT_CONTEXT_HEADERS` | `true` | Contextual tree injection |
| `SPECKIT_FILE_WATCHER` | `false` | Real-time filesystem watching |
| `SPECKIT_DYNAMIC_INIT` | `true` | Dynamic server instructions |
| `RERANKER_LOCAL` | `false` | Local GGUF reranker (existing flag) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hardening & Ergonomics (Est. 1-2 weeks)

All items independent — can be parallelized.

#### P0-1: Strict Zod Schema Validation

**Current state**: `tool-schemas.ts` (lines 1-396) defines 24 tools across 7 layers (L1-L7) using plain object descriptions. No runtime validation. Parameters are trusted as-is by handlers.

**Implementation steps:**
1. Add `zod` dependency: `npm install zod`
2. Audit all 24 tool definitions in `tool-schemas.ts` (lines 19-358). Document exact parameter types per tool:
   - L1: `memory_context` — 10 params (input, mode enum, intent enum, specFolder, limit, sessionId, enableDedup, includeContent, tokenUsage, anchors)
   - L2: `memory_search` — 25+ params (query/concepts, specFolder, limit, tier, contextType, useDecay, mode, rerank, intent, etc.)
   - L2: `memory_match_triggers` — 5 params (prompt, limit, session_id, turnNumber, include_cognitive)
   - L2: `memory_save` — 5 params (filePath, force, dryRun, skipPreflight, asyncEmbedding)
   - L3-L7: remaining 20 tools with 2-10 params each
3. Create Zod schemas per tool. Example for `memory_search`:
   ```typescript
   const MemorySearchInput = z.object({
     query: z.string().min(2).max(1000).optional(),
     concepts: z.array(z.string()).optional(),
     specFolder: z.string().optional(),
     limit: z.number().int().min(1).max(50).default(10),
     sessionId: z.string().uuid().optional(),
     mode: z.enum(["auto", "semantic", "keyword", "hybrid"]).default("auto"),
     includeContent: z.boolean().default(false),
     rerank: z.boolean().optional(),
     intent: z.enum(["general", "recall", "debug", "research", "synthesis", "evaluate", "resume"]).optional(),
     // ... remaining 15+ params
   }).strict(); // or .passthrough() based on flag
   ```
4. Add schema selection logic gated on `SPECKIT_STRICT_SCHEMAS`:
   ```typescript
   const getSchema = (base: z.ZodObject<any>) =>
     process.env.SPECKIT_STRICT_SCHEMAS !== 'false' ? base.strict() : base.passthrough();
   ```
5. Wrap all handler entry points in `schema.parse(rawInput)` with try/catch returning actionable Zod error messages
6. Test matrix: for each of the 24 tools, verify (a) valid params pass, (b) unknown params rejected in strict mode, (c) unknown params accepted in passthrough mode

**Key files**: `mcp_server/tool-schemas.ts`, `mcp_server/handlers/index.ts` (tool dispatch), all 29 handler files in `handlers/`

#### P0-2: Provenance-Rich Response Envelopes

**Current state**: `formatSearchResults()` at `formatters/search-results.ts:130` returns `FormattedSearchResult` with basic fields (id, specFolder, filePath, title, similarity). Internal `PipelineRow` has 10+ score fields (`rrfScore`, `intentAdjustedScore`, `stage2Score`, `attentionScore`, `quality_score`) that are DROPPED before the response reaches the caller.

**Implementation steps:**
1. Audit current response shape at `formatters/search-results.ts:57-78` — document which PipelineRow fields survive vs. are dropped
2. Define new `MemoryResultEnvelope` interface extending current shape:
   ```typescript
   interface MemoryResultEnvelope extends FormattedSearchResult {
     scores?: {
       semantic: number | null;   // From PipelineRow.similarity (0-100 → 0-1)
       lexical: number | null;    // From FTS5 or BM25 channel score
       fusion: number | null;     // From PipelineRow.rrfScore
       intentAdjusted: number | null; // From PipelineRow.intentAdjustedScore
       composite: number | null;  // From resolveEffectiveScore() chain
       rerank: number | null;     // From Stage 3 cross-encoder (null if disabled)
       attention: number | null;  // From PipelineRow.attentionScore
     };
     source?: {
       file: string;              // From PipelineRow.file_path
       anchorIds: string[];       // Extracted from content anchors
       anchorTypes: string[];     // From S2 semantic anchor typing
       lastModified: string;      // File mtime
       memoryState: string;       // From PipelineRow.memoryState
     };
     trace?: {
       channelsUsed: string[];    // Which of the 5 channels returned results
       pipelineStages: string[];  // Which stages were executed
       fallbackTier: number | null; // From 3-tier fallback chain
       queryComplexity: string;   // From R15 complexity router
       expansionTerms: string[];  // From R12 multi-query expansion
       budgetTruncated: boolean;  // From truncateToBudget() at line 934
       scoreResolution: string;   // Which score in the chain was used
     };
   }
   ```
3. Modify `formatSearchResults()` to accept an `includeTrace: boolean` option and populate new fields from the PipelineRow data already available
4. Modify `hybrid-search.ts` Stage 4 exit (lines 934-945) to preserve trace metadata through to the result set. Currently `_s4shadow` is attached as a non-enumerable property — make trace data explicit.
5. Add `includeTrace` parameter to `memory_search` Zod schema (P0-1 dependency)
6. Default `includeTrace: false` — when false, omit `scores`, `source`, `trace` objects entirely (backward compatible)
7. Test: compare `memory_search` output with and without `includeTrace`, verify scores match internal PipelineRow values

**Key files**: `formatters/search-results.ts` (main), `lib/search/hybrid-search.ts` (Stage 4), `lib/search/pipeline/types.ts` (PipelineRow), `handlers/memory-search.ts` (parameter threading)

#### P1-6: Dynamic Server Instructions

**Current state**: `context-server.ts` initialization (lines 511-550) performs SQLite version check, embedding readiness, session manager init, and legacy `SPECKIT_EAGER_WARMUP`. No dynamic instruction injection.

**Implementation steps:**
1. Add `buildServerInstructions()` async function in `context-server.ts`:
   ```typescript
   async function buildServerInstructions(): Promise<string> {
     if (process.env.SPECKIT_DYNAMIC_INIT === 'false') return '';
     const stats = await getMemoryStats(); // Reuse existing memory_stats handler
     const lines = [
       `Memory system: ${stats.totalMemories} memories across ${stats.specFolders} spec folders.`,
       `Active: ${stats.activeCount} | Stale: ${stats.staleCount} | Archived: ${stats.archivedCount}`,
       stats.staleCount > 10 ? `⚠ ${stats.staleCount} stale memories — consider memory_index_scan.` : '',
       `Search channels: vector, FTS5, BM25, graph, degree (5-channel hybrid pipeline).`,
       `Key tools: memory_context (orchestrated retrieval), memory_search (direct search), memory_save (index file).`,
       `Resume support: use memory_context with mode="resume" to recover prior session state.`,
     ];
     return lines.filter(Boolean).join(' ');
   }
   ```
2. Call after existing init sequence completes (after line 550)
3. Inject via MCP SDK: `server.setInstructions(await buildServerInstructions())`
4. Gate behind `SPECKIT_DYNAMIC_INIT` (default: `true`)
5. Test: start server, intercept MCP handshake, verify instructions payload

**Key file**: `mcp_server/context-server.ts` (lines 511-560 area)

### Phase 2: Operational Reliability (Est. 2-3 weeks)

P0-3 depends on Phase 1 schemas. P1-4 depends on P0-2 envelope format. P1-7 is independent.

#### P0-3: Async Ingestion Job Lifecycle

**Current state**: `memory-save.ts` (line 1142) accepts `asyncEmbedding` param. When true, saves the memory immediately with `embedding_status='pending'` and schedules a `setImmediate()` call to `retryManager.retryEmbedding()` (lines 1106-1115). This is single-file async. No multi-file job queue, no progress tracking, no status polling.

**Implementation steps:**
1. Create `lib/ops/job-queue.ts` (~200 LOC):
   ```typescript
   interface IngestJob {
     id: string;           // `job_${nanoid(12)}`
     state: 'queued' | 'parsing' | 'embedding' | 'indexing' | 'complete' | 'failed' | 'cancelled';
     specFolder?: string;
     paths: string[];
     filesTotal: number;
     filesProcessed: number;
     errors: Array<{ file: string; error: string }>;
     createdAt: string;
     updatedAt: string;
   }
   ```
2. SQLite persistence: create `ingest_jobs` table alongside existing DB. On server restart, scan for incomplete jobs and reset to `queued`.
3. State machine transitions with validation (no backward transitions except reset-on-restart).
4. Sequential processing within queue: one file at a time to avoid SQLite write contention. Reuse existing `indexMemoryFile()` from `memory-save.ts` (line 1238 path).
5. Create `memory_ingest_start` handler:
   - Input: `{ paths: string[], specFolder?: string }` (validated via Zod)
   - Creates job record, enqueues, returns `{ jobId, state: 'queued', filesTotal }` in <100ms
   - Actual processing starts asynchronously via `setImmediate()`
6. Create `memory_ingest_status` handler:
   - Input: `{ jobId: string }`
   - Returns full job state including `progress`, `filesProcessed`, `filesTotal`, `errors`, `state`
7. Create `memory_ingest_cancel` handler:
   - Input: `{ jobId: string }`
   - Sets `state: 'cancelled'`. Processing loop checks state before each file.
8. Register new tools in `handlers/index.ts` and `tool-schemas.ts`
9. Test: create spec folder with 100+ `.md` files, call `memory_ingest_start`, poll `memory_ingest_status` every 5s, verify progress updates and final `complete` state.

**Key files**: `lib/ops/job-queue.ts` (new), `handlers/memory-save.ts` (reuse `indexMemoryFile`), `handlers/index.ts` (registration), `tool-schemas.ts` (schemas)

#### P1-4: Contextual Tree Injection

**Current state**: PI-B3 cached one-sentence descriptions per spec folder exist and are used for internal routing in `memory_context`. S4 hierarchy parsing is operational. The hierarchy data is NOT injected into returned content.

**Implementation steps:**
1. Create `injectContextualTree()` function in `lib/search/hybrid-search.ts` or a new `lib/search/context-enrichment.ts`:
   ```typescript
   function injectContextualTree(row: PipelineRow, descCache: Map<string, string>): PipelineRow {
     if (!row.file_path || !row.content) return row;
     const specFolder = extractSpecFolder(row.file_path); // e.g., "022-hybrid-rag-fusion/015-pipeline-refactor"
     if (!specFolder) return row;
     const parts = specFolder.split('/').slice(-2); // Last 2 segments
     const desc = descCache.get(specFolder);
     const header = desc
       ? `[${parts.join(' > ')} — ${desc.slice(0, 60)}]`
       : `[${parts.join(' > ')}]`;
     if (header.length <= 100) {
       row.content = `${header}\n${row.content}`;
     }
     return row;
   }
   ```
2. Insert call into Stage 4 output, AFTER token budget truncation (line 945), BEFORE final return
3. Gate behind `SPECKIT_CONTEXT_HEADERS` (default: `true`)
4. Cap header at 100 characters total (enforced in function)
5. Skip injection when `content` is null (e.g., `includeContent: false` mode)
6. Test: `memory_search` for a known spec folder memory, verify header format

**Key files**: `lib/search/hybrid-search.ts` (insertion point at ~line 945), PI-B3 description cache (existing)

#### P1-7: Real-Time Filesystem Watching

**Current state**: Index relies on pull-based `memory_index_scan` which does incremental indexing via mtime+SHA-256 content hash (TM-02). No push-based watching.

**Implementation steps:**
1. Add `chokidar` dependency: `npm install chokidar`
2. Create `lib/ops/file-watcher.ts` (~150 LOC):
   ```typescript
   import chokidar from 'chokidar';
   import { createHash } from 'crypto';

   interface WatcherConfig {
     specDirs: string[];       // Directories to watch
     debounceMs: number;       // Default: 2000
     maxRetries: number;       // Default: 3
     reindexFn: (path: string) => Promise<void>;
   }

   export function startFileWatcher(config: WatcherConfig): chokidar.FSWatcher {
     const pending = new Map<string, NodeJS.Timeout>();
     const hashCache = new Map<string, string>(); // path → SHA-256

     const watcher = chokidar.watch(config.specDirs, {
       ignored: /(^|[\/\\])\../, // Ignore dotfiles
       persistent: true,
       ignoreInitial: true,
       awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
     });

     watcher.on('change', (filePath: string) => {
       if (!filePath.endsWith('.md')) return;
       if (pending.has(filePath)) clearTimeout(pending.get(filePath)!);
       pending.set(filePath, setTimeout(async () => {
         pending.delete(filePath);
         // Content-hash dedup (TM-02 pattern)
         const content = await fs.readFile(filePath, 'utf-8');
         const hash = createHash('sha256').update(content).digest('hex');
         if (hashCache.get(filePath) === hash) return; // Unchanged
         hashCache.set(filePath, hash);
         // Retry with exponential backoff
         await retryWithBackoff(() => config.reindexFn(filePath), {
           maxRetries: config.maxRetries,
           baseDelayMs: 1000,
         });
       }, config.debounceMs));
     });

     return watcher;
   }
   ```
3. Initialize watcher in `context-server.ts` after DB is ready, gated behind `SPECKIT_FILE_WATCHER`
4. Wire `reindexFn` to existing `indexMemoryFile()` from `memory-save.ts`
5. Enforce WAL mode in SQLite connection (check existing pragma settings)
6. Register `watcher.close()` in server shutdown handler to prevent process leaks
7. Test: start server with watcher enabled, save a `.md` file, verify re-index within 5s via `memory_search`

**Key files**: `lib/ops/file-watcher.ts` (new), `context-server.ts` (init), `handlers/memory-save.ts` (reuse `indexMemoryFile`)

### Phase 3: Retrieval Excellence (Est. 2-4 weeks)

Depends on Phase 1 test infrastructure (eval framework verification).

#### P1-5: Local GGUF Reranker

**Current state**: Stage 3 reranking is gated behind `SPECKIT_CROSS_ENCODER` (default ON). Current implementation supports Cohere and Voyage remote APIs. `RERANKER_LOCAL` flag exists but has no implementation path for node-native GGUF models. The reranking pipeline slot is at approximately lines 850-900 of `hybrid-search.ts`.

**Implementation steps:**
1. Add dependency: `npm install node-llama-cpp` (native Node.js bindings for llama.cpp)
2. Create `lib/search/local-reranker.ts` (~200 LOC):
   ```typescript
   import { getLlama, LlamaModel, LlamaContext } from 'node-llama-cpp';
   import os from 'os';
   import fs from 'fs/promises';

   const MODEL_PATH = process.env.SPECKIT_RERANKER_MODEL
     || path.join(__dirname, '../../../models/bge-reranker-v2-m3.Q4_K_M.gguf');
   const MIN_FREE_MEM_MB = 4096;
   let cachedModel: LlamaModel | null = null;

   export async function canUseLocalReranker(): Promise<boolean> {
     if (process.env.RERANKER_LOCAL !== 'true') return false;
     const freeMem = os.freemem() / (1024 * 1024);
     if (freeMem < MIN_FREE_MEM_MB) {
       console.warn(`[local-reranker] Insufficient memory: ${Math.round(freeMem)}MB < ${MIN_FREE_MEM_MB}MB`);
       return false;
     }
     try { await fs.access(MODEL_PATH); return true; }
     catch { console.warn(`[local-reranker] Model not found: ${MODEL_PATH}`); return false; }
   }

   export async function rerankLocal(
     query: string,
     candidates: PipelineRow[],
     topK: number = 20
   ): Promise<PipelineRow[]> {
     if (!(await canUseLocalReranker())) return candidates;
     const startTime = Date.now();
     try {
       if (!cachedModel) {
         const llama = await getLlama();
         cachedModel = await llama.loadModel({ modelPath: MODEL_PATH });
       }
       const ctx = await cachedModel.createContext();
       // Score each candidate against query using cross-encoder pattern
       for (const c of candidates.slice(0, topK)) {
         const input = `query: ${query} document: ${(c.content || '').slice(0, 512)}`;
         const embedding = await ctx.encode(input);
         c.rerankScore = embedding[0]; // Cross-encoder similarity score
       }
       const elapsed = Date.now() - startTime;
       console.log(`[local-reranker] Reranked ${Math.min(candidates.length, topK)} candidates in ${elapsed}ms`);
       return candidates.sort((a, b) => (b.rerankScore ?? 0) - (a.rerankScore ?? 0));
     } catch (err) {
       console.warn(`[local-reranker] Failed, falling back to RRF: ${err}`);
       return candidates; // Graceful fallback
     }
   }
   ```
3. Integrate into Stage 3 slot in `hybrid-search.ts`: call `rerankLocal()` when `RERANKER_LOCAL=true`, before existing Cohere/Voyage path
4. Model cache: keep loaded model in module-level variable to avoid reload per query. Dispose on server shutdown.
5. Performance target: <500ms for top-20 candidates with Q4_K_M quantization (~350MB model)
6. Test: run `eval_run_ablation` with `RERANKER_LOCAL=true` vs default remote reranking. Document MRR@5, precision@5 delta.

**Key files**: `lib/search/local-reranker.ts` (new), `lib/search/hybrid-search.ts` (Stage 3 integration), `package.json` (dependency)

**Hardware requirement**: macOS ARM64 (Apple Silicon) with ≥16GB unified memory recommended. Falls back gracefully on lower-memory systems.

### Phase 4: Innovation (Deferred — demand-driven)

| Item | Trigger to Start | Estimated Effort |
|------|-----------------|-----------------|
| P2-8: Daemon mode | MCP SDK standardizes HTTP transport | L (2-3 weeks) |
| P2-9: Storage adapters | Corpus > 100K memories or multi-node needed | M-L (1-2 weeks) |
| P2-10: Namespaces | Multi-tenant deployment demand | S-M (3-5 days) |
| P2-11: ANCHOR graph nodes | 2-day spike shows promise | S-M (3-5 days) |
| P2-12: AST sections | Spec docs regularly exceed 1000 lines | M (5-7 days) |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | All search channels post-change | `eval_run_ablation` (9 metrics) |
| Schema validation | All 20+ MCP tools | Zod parse with valid + invalid inputs |
| Integration | Async job lifecycle | Start job → poll status → verify completion |
| Integration | File watcher | Save file → verify re-index within 5s |
| Performance | Schema overhead | Measure tool call latency delta (<5ms) |
| Performance | GGUF reranking | Measure reranking latency (<500ms for 20 candidates) |
| Manual | Response envelope | Inspect `memory_search` output with `includeTrace: true` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Eval framework (ablation, 9 metrics) | Internal | Green | Cannot verify regressions |
| sqlite-vec + FTS5 | Internal | Green | Core search broken |
| zod | External (npm) | Green | Well-maintained, widely used |
| chokidar | External (npm) | Green | Standard file watcher |
| node-llama-cpp | External (npm) | Yellow | P1-5 only, needs hardware test |
| PI-B3 description cache | Internal | Green | Contextual trees need it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any eval metric regresses by >5% or SQLITE_BUSY errors in production
- **Procedure**: Disable relevant feature flag(s), no code revert needed
- **Data**: No schema migrations — all changes are runtime behavior behind flags
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Hardening) ──────────────────────┐
  ├── P0-1: Zod schemas (independent)     │
  ├── P0-2: Response envelopes (indep.)   ├──► Phase 2 (Operations)
  └── P1-6: Dynamic init (independent)    │     ├── P0-3: Async jobs (needs P0-1)
                                          │     ├── P1-4: Context trees (needs P0-2)
                                          │     └── P1-7: File watcher (independent)
                                          │
                                          └──► Phase 3 (Retrieval)
                                                └── P1-5: GGUF reranker (needs eval baseline)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Hardening | Med | 1-2 weeks |
| Phase 2: Operations | Med-High | 2-3 weeks |
| Phase 3: Retrieval | High | 2-4 weeks |
| Phase 4: Innovation | — | Deferred |
| **Total (P0+P1)** | | **5-9 weeks** |

---

## L3: CRITICAL PATH

1. **P0-1: Zod schemas** — 2-3 days — CRITICAL (blocks P0-3 schema reuse)
2. **P0-2: Response envelopes** — 4-5 days — CRITICAL (blocks P1-4 format)
3. **P0-3: Async ingestion** — 5-7 days — CRITICAL (unblocks bulk indexing)
4. **P1-5: GGUF reranker** — 5-8 days — LONG POLE (hardware dependency)

**Total Critical Path**: ~16-23 days (Phases 1-2)

**Parallel Opportunities**:
- P0-1, P0-2, P1-6 all independent within Phase 1
- P1-4 and P1-7 can run in parallel within Phase 2

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 Complete | All tools have Zod schemas, envelopes work, dynamic init active | End of week 2 |
| M2 | Phase 2 Complete | Async jobs operational, file watcher running, context trees injected | End of week 5 |
| M3 | Phase 3 Complete | Local GGUF reranker tested and benchmarked | End of week 9 |
| M4 | All P0+P1 Done | Zero eval regressions, all feature flags documented | End of week 9 |

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: tool-schemas.ts (Zod schemas)
**Duration**: ~2-3 days
**Agent**: Primary

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Agent A | Response envelopes | handlers/*.ts, hybrid-search.ts |
| Agent B | Dynamic init | context-server.ts |
| Agent C | File watcher | lib/ops/file-watcher.ts |

**Duration**: ~5-7 days (parallel)

### Tier 3: Integration
**Agent**: Primary
**Task**: Async job queue (builds on schemas), contextual trees (builds on envelopes)
**Duration**: ~7-10 days

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Files | Status |
|----|------|-------|--------|
| W-A | Schema Hardening | tool-schemas.ts, handlers/*.ts | Phase 1 |
| W-B | Response Surface | handlers/memory-search.ts, hybrid-search.ts | Phase 1-2 |
| W-C | Operational Tooling | lib/ops/job-queue.ts, lib/ops/file-watcher.ts | Phase 2 |
| W-D | Retrieval Enhancement | lib/search/local-reranker.ts | Phase 3 |

### File Ownership Rules
- tool-schemas.ts owned by W-A
- handlers/*.ts shared between W-A and W-B (W-A for input, W-B for output)
- lib/ops/*.ts owned by W-C
- lib/search/local-reranker.ts owned by W-D

## AI Execution Protocol

### Pre-Task Checklist
- Confirm scope lock for this phase folder before edits.
- Confirm validator command and target path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute fixes in warning-category order and re-validate after each pass. |
| TASK-SCOPE | Do not modify files outside this phase folder unless explicitly required by parent-link checks. |

### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path and validator evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, attempted remediation, and next safe action before proceeding.
