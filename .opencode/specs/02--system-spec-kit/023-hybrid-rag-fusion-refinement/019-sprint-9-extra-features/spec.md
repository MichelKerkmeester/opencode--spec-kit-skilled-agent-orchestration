---
title: "Feature Specification: Sprint 9 — Extra Features (Productization & Operational Tooling)"
description: "The 023 Hybrid RAG Fusion Refinement program delivered core retrieval architecture. A 6-agent cross-AI research effort identified 12 remaining gaps: 7 partial implementations needing completion, 5 genuinely new features. This sprint tackles interface polish, operational tooling, and API ergonomics."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "sprint 9"
  - "extra features"
  - "productization"
  - "019"
  - "MCP contract"
  - "schema validation"
  - "async ingestion"
  - "filesystem watching"
  - "GGUF reranker"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Sprint 9 — Extra Features (Productization & Operational Tooling)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

The 023 refinement program built a sophisticated 5-channel hybrid retrieval pipeline, causal graph overlay, and evaluation infrastructure. A cross-AI research effort (6 agents: 3 Codex gpt-5.3-codex, 3 Gemini 3.1-pro-preview) analyzed external systems (Cognee, QMD, ArtemXTech) and produced 16 recommendations. After triple-verification against the feature catalog, 4 were fully implemented, 7 partially implemented, and 5 genuinely new. This sprint completes the bounded gaps and builds the net-new operational tooling.

**Key Decisions**: Phased rollout (hardening → operations → retrieval excellence → innovation). P2 items deferred until demand-driven triggers are met.

**Critical Dependencies**: Existing evaluation framework (ablation studies, 9 metrics) enables safe regression testing for all changes.

---

## 1. METADATA

<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 (foundation items) through P2 (innovation) |
| **Status** | Draft |
| **Created** | 2026-03-03 |
| **Parent** | `023-hybrid-rag-fusion-refinement` |
| **Research** | `019-sprint-9-extra-features/research/` (16 files) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP server's internal data structures are rich (6 score fields, causal graph, anchor metadata, pipeline traces) but the external API surface does not fully expose this richness. MCP tool inputs lack strict validation, allowing LLMs to hallucinate parameters. Bulk indexing can hit MCP timeout limits without job lifecycle management. The index relies on manual triggers rather than automated file-watching.

### Purpose
Complete the productization of the Memory MCP server by hardening the API surface, exposing internal richness externally, adding operational tooling (async jobs, file watching, dynamic init), and optionally enabling local GGUF reranking — all measurable against the existing evaluation framework.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**P0 — Foundation (must-do):**
- P0-1: Strict Zod schema validation on all MCP tool inputs
- P0-2: Provenance-rich response envelopes (expose scores, traces, source metadata)
- P0-3: Async ingestion job lifecycle (start/status/cancel tools)

**P1 — Quality & Operations (should-do):**
- P1-4: Contextual tree injection into returned chunks
- P1-5: Local GGUF reranker via node-llama-cpp
- P1-6: Dynamic server instructions at MCP initialization
- P1-7: Real-time filesystem watching with chokidar

**P2 — Innovation (deferred, demand-driven):**
- P2-8: Warm server / daemon mode (HTTP transport)
- P2-9: Backend storage adapter abstraction (IVectorStore, IGraphStore)
- P2-10: Namespace management CRUD tools
- P2-11: ANCHOR tags as graph nodes (spike)
- P2-12: AST-level section retrieval tool

### Out of Scope
- Core retrieval pipeline changes — already complete (R6, R15, R12)
- Knowledge graph schema changes — stable (causal_edges, 6 relation types)
- Embedding provider changes — already abstracted (auto/openai/hf-local/voyage)
- QMD integration — redundant with existing capabilities (see research analysis)

### Files to Change

| File Path | Change Type | Lines Affected | Description |
|-----------|-------------|----------------|-------------|
| `mcp_server/tool-schemas.ts` | Modify | 1-396 (all 24 tool defs) | Wrap existing JSON-schema-style defs in Zod `.strict()` schemas. Currently defines params as plain objects across L1-L7 layers. |
| `mcp_server/handlers/memory-search.ts` | Modify | ~306-321 (formatSearchResults call) | Expand response envelope to include `scores`, `source`, `trace` objects. Current shape returns `{ searchType, count, constitutionalCount, results, ...extraData }`. |
| `mcp_server/formatters/search-results.ts` | Modify | 57-78 (FormattedSearchResult), 130-138 (formatSearchResults) | Add score breakdown and trace fields to FormattedSearchResult type. Current type has `similarity` as only score field. |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | 934-945 (Stage 4 exit) | Propagate PipelineRow score fields through to output. Currently only `score`, `similarity`, `source` survive the pipeline exit. Internal `rrfScore`, `intentAdjustedScore`, `stage2Score` fields are dropped. |
| `mcp_server/lib/search/pipeline/types.ts` | Modify | 12-44 (PipelineRow) | No structural changes, but document which fields should be exposed in public envelope. 30+ fields defined, ~6 score fields available. |
| `mcp_server/handlers/memory-save.ts` | Modify | 1106-1115 (async embedding), 1142 (handler entry) | Wire job queue into existing `asyncEmbedding` path. Currently uses `setImmediate()` + `retryManager.retryEmbedding()`. |
| `mcp_server/lib/ops/job-queue.ts` | Create | ~200 LOC | In-process job queue with SQLite persistence. State machine: queued→parsing→embedding→indexing→complete/failed. |
| `mcp_server/lib/ops/file-watcher.ts` | Create | ~150 LOC | chokidar-based file watcher. Debounce 2s, content-hash dedup via existing TM-02 SHA-256, WAL mode enforcement, exponential backoff retry. |
| `mcp_server/lib/search/local-reranker.ts` | Create | ~200 LOC | node-llama-cpp GGUF reranker. Memory check (4GB), integrates into existing Stage 3 slot (lines ~850-900 of hybrid-search.ts). |
| `mcp_server/context-server.ts` | Modify | 511-550 (init section) | Add `buildServerInstructions()` after existing startup sequence (SQLite version check, embedding readiness, session manager init). |
| `mcp_server/handlers/index.ts` | Modify | Tool dispatch map | Register 2 new tools: `memory_ingest_start`, `memory_ingest_status`. |

### Current Response Shape (to be expanded by P0-2)

The current `formatSearchResults()` (at `formatters/search-results.ts:130`) returns:
```typescript
// Current FormattedSearchResult fields (lines 57-78):
{
  id, specFolder, filePath, title, similarity,  // Basic identity
  isConstitutional, importanceTier,              // Classification
  triggerPhrases, createdAt,                     // Metadata
  content, contentError,                         // Content (optional)
  tokenMetrics,                                  // Anchor token metrics
  isChunk, parentId, chunkIndex, chunkLabel,     // Chunk info
  chunkCount, contentSource                      // Chunk assembly
}
// Missing: score breakdown (rrfScore, intentAdjustedScore, stage2Score)
// Missing: pipeline trace (channels used, fallback tier, complexity class)
// Missing: source file path, anchor IDs, anchor semantic types
```

### PipelineRow Score Fields Available (from `pipeline/types.ts:12-44`)

These internal fields exist but are NOT exposed in the public API:
```typescript
interface PipelineRow {
  similarity?: number;        // Vector similarity (0-100)
  score?: number;             // Composite score
  rrfScore?: number;          // Reciprocal Rank Fusion score
  intentAdjustedScore?: number; // After intent-based weighting
  stage2Score?: number;       // Stage 2 fusion score (P1-015)
  quality_score?: number;     // Quality gate score
  importance_weight?: number; // Importance weighting
  attentionScore?: number;    // Cognitive attention score
  retrievability?: number;    // FSRS retrievability
  stability?: number;         // FSRS stability
  // Score resolution chain: intentAdjusted → rrfScore → score → similarity/100
}
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All MCP tool inputs validated via Zod `.strict()` | Hallucinated parameters rejected with clear error. Zero false positives on valid inputs. |
| REQ-002 | Response envelopes include source file, anchor IDs, score breakdown, pipeline trace | `memory_search` results contain `scores`, `source`, and `trace` objects |
| REQ-003 | Async ingestion: `memory_ingest_start` returns job ID in <100ms | Job state machine transitions: queued→parsing→embedding→indexing→complete/failed |
| REQ-004 | `memory_ingest_status` returns progress, files processed, errors | Polling returns accurate state within 1s of actual state change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Returned chunks include contextual tree header (≤100 chars) | Header format: `[parent > child — description]` prepended to content |
| REQ-006 | Local GGUF reranker scores candidates without API calls | Fallback to RRF when memory < 4GB or model file missing |
| REQ-007 | MCP server provides index summary in startup instructions | Calling LLM sees memory count, spec folder count, channel list at init |
| REQ-008 | File changes in spec dirs trigger auto re-index within 5s | Debounced, deduplicated via content hash. WAL mode enforced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All existing eval metrics (MRR@5, precision@5, etc.) maintain or improve after changes — zero regressions verified via `eval_run_ablation`
- **SC-002**: `memory_search` with `includeTrace: true` returns full score breakdown and pipeline trace
- **SC-003**: Bulk indexing of 100+ files completes without MCP timeout, via async job lifecycle
- **SC-004**: Invalid tool parameters produce clear, actionable error messages (not silent failures)
- **SC-005**: File watcher re-indexes changed files within 5 seconds of save
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Zod `.strict()` breaks existing callers | High | Audit current parameter usage first. Use `.passthrough()` as transitional step. |
| Risk | Response envelopes inflate token usage | Med | Trace fields opt-in via `includeTrace: true`. Context headers capped at 100 chars. |
| Risk | GGUF reranker starves IDE LLM of memory | Med | Default OFF. Memory threshold check (4GB minimum). Auto fallback to RRF. |
| Risk | File watcher causes SQLITE_BUSY | Med | WAL mode enforced. Exponential backoff retry (3 attempts). Content-hash dedup. |
| Risk | Async job queue adds operational complexity | Low | In-process queue (no Redis). Job records in SQLite for crash recovery. |
| Dependency | Existing eval framework | Blocks verification | Green — fully operational (ablation studies, 9 metrics, synthetic ground truth) |
| Dependency | sqlite-vec, FTS5 | Blocks search | Green — stable, already in production |
| Dependency | node-llama-cpp (P1-5 only) | Blocks local reranking | Yellow — npm package, needs testing on target hardware |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Zod validation adds <5ms overhead per tool call
- **NFR-P02**: Response envelope serialization adds <10ms
- **NFR-P03**: File watcher re-index latency <5s from file save to index update
- **NFR-P04**: Local GGUF reranking adds <500ms for top-20 candidates

### Security
- **NFR-S01**: Zod schemas prevent parameter injection attacks
- **NFR-S02**: File watcher restricted to configured spec directories only (no arbitrary path traversal)

### Reliability
- **NFR-R01**: Async job queue persists state to SQLite — crash recovery within 1 restart
- **NFR-R02**: All new features gated behind feature flags (opt-in, not breaking)

---

## 8. EDGE CASES

### Data Boundaries
- Empty query string: Zod rejects with `min(2)` constraint on `query` field
- Maximum query length: Zod enforces `max(1000)` to prevent token blowout
- `topK` parameter: Zod enforces `int().min(1).max(50)` to prevent unbounded result sets
- Job queue overflow: Cap at 10 concurrent jobs, queue remainder with `queued` state
- File watcher on non-existent directory: Graceful no-op with `console.warn()`, no crash
- Empty specFolder: Zod allows optional, falls back to workspace-wide search
- `includeTrace` on non-search tools: Silently ignored (only applies to `memory_search`)
- Score fields in envelope: `null` when channel was not used (e.g., `rerank: null` when cross-encoder disabled)

### Error Scenarios
- **GGUF model file missing**: `canUseLocalReranker()` returns false, silent fallback to algorithmic RRF. No error surfaced to caller. Log at `warn` level.
- **SQLite locked during watcher re-index**: Retry 3x with exponential backoff (1s, 2s, 4s), then skip with `console.warn()`. Content-hash dedup (TM-02 SHA-256) prevents redundant re-indexing on next trigger.
- **Async job fails mid-embedding**: Commit partial results (files already indexed remain in DB). Mark remaining files as `failed` in job record with error reason. `memory_ingest_status` returns `errors[]` array.
- **Zod strict mode rejects valid but undocumented params**: `SPECKIT_STRICT_SCHEMAS=false` falls back to `.passthrough()` mode. Log rejected keys at `info` level for audit.
- **node-llama-cpp native binary compilation fails**: P1-5 is opt-in (`RERANKER_LOCAL=false` default). If enabled but binary missing, `canUseLocalReranker()` catches `ENOENT` and falls back.
- **Chokidar watcher process leak on server shutdown**: Register `watcher.close()` in server shutdown hook. If watcher not closed, next restart creates fresh watcher (no stale state).
- **Job queue state inconsistency after crash**: On restart, scan `jobs` table for `state != 'complete' && state != 'failed'`, reset to `queued` for retry.
- **`includeTrace: true` inflates response beyond token budget**: Trace data is appended AFTER token budget truncation (Stage 4). Trace describes the pipeline, not additional content. Estimated overhead: ~200 tokens per result.

### Concurrency Scenarios
- **Simultaneous file watcher + manual `memory_index_scan`**: Content-hash dedup prevents double-indexing. SQLite WAL mode allows concurrent readers.
- **Multiple `memory_ingest_start` calls**: Each gets unique jobId. Jobs process sequentially within the in-process queue. No parallel embedding to avoid SQLite write contention.
- **Agent calls `memory_search` while async ingestion is running**: Search operates on committed data. In-progress ingestion files not yet visible until their embedding transaction commits.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~12, LOC: ~800-1200, Systems: MCP server only |
| Risk | 15/25 | API surface change, backward compat concern, VRAM contention |
| Research | 18/20 | Extensive: 6-agent cross-AI research, triple-verified against catalog |
| Multi-Agent | 10/15 | Workstreams: 4 phases, parallelizable within phases |
| Coordination | 10/15 | Dependencies: eval framework, feature flags, Phase 1→2 sequencing |
| **Total** | **73/100** | **Level 3** (elevated to 3+ due to multi-agent research provenance) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `.strict()` breaks existing callers | H | M | Audit + `.passthrough()` transition |
| R-002 | Token inflation from envelopes | M | M | Opt-in `includeTrace` flag |
| R-003 | VRAM contention from GGUF reranker | M | L | Default OFF + memory check |
| R-004 | SQLITE_BUSY from file watcher | M | M | WAL + retry + dedup |
| R-005 | Premature P2 abstraction | M | L | Strict deferral gates |

---

## 11. USER STORIES

### US-001: Strict Schema Validation (Priority: P0)

**As a** calling LLM agent, **I want** clear error messages when I pass invalid parameters, **so that** I can self-correct without wasting tool-call rounds.

**Acceptance Criteria**:
1. Given a `memory_search` call with an unknown key `foo`, When the tool is invoked, Then a Zod validation error is returned listing the unexpected key
2. Given a valid `memory_search` call, When the tool is invoked, Then results are returned unchanged

### US-002: Provenance-Rich Results (Priority: P0)

**As a** calling LLM agent, **I want** to see which search channels contributed to each result and their individual scores, **so that** I can assess result quality and explain my reasoning to the user.

**Acceptance Criteria**:
1. Given `memory_search` with `includeTrace: true`, When results return, Then each result contains `scores`, `source`, and `trace` objects
2. Given `memory_search` without `includeTrace`, When results return, Then the response format is unchanged (backward compatible)

### US-003: Async Bulk Indexing (Priority: P0)

**As a** developer indexing 100+ spec files, **I want** to start a bulk index job and check progress asynchronously, **so that** the MCP connection doesn't timeout during long operations.

**Acceptance Criteria**:
1. Given 100 markdown files, When `memory_ingest_start` is called, Then a job ID returns in <100ms
2. Given a running job, When `memory_ingest_status` is polled, Then progress percentage and file count are accurate

### US-004: Auto Re-Index on File Change (Priority: P1)

**As a** developer editing spec files, **I want** the memory index to update automatically when I save a file, **so that** my next search reflects the latest changes without manual intervention.

**Acceptance Criteria**:
1. Given a running file watcher, When a `.md` file in a spec directory is saved, Then the file is re-indexed within 5 seconds
2. Given rapid consecutive saves to the same file, When debounce fires, Then only 1 re-index occurs

### US-005: Local GGUF Reranking (Priority: P1)

**As a** developer in an air-gapped environment, **I want** cross-encoder reranking to work without Cohere/Voyage API calls, **so that** search quality is maintained offline.

**Acceptance Criteria**:
1. Given `RERANKER_LOCAL=true` and a GGUF model file present, When `memory_search` runs, Then Stage 3 uses local reranking instead of API calls
2. Given `RERANKER_LOCAL=true` but insufficient memory (<4GB free), When `memory_search` runs, Then reranking silently falls back to RRF without error
3. Given local reranker active, When `eval_run_ablation` runs, Then MRR@5 is within 5% of remote reranker baseline

### US-006: Dynamic Server Context (Priority: P1)

**As a** calling LLM agent, **I want** to know what memories are available when the MCP connection starts, **so that** I can make informed decisions about when to search vs. rely on my own knowledge.

**Acceptance Criteria**:
1. Given a fresh MCP connection, When the server initializes, Then the calling LLM receives an instruction string containing: total memory count, active spec folder count, available search channels, and stale memory count (if >10)
2. Given `SPECKIT_DYNAMIC_INIT=false`, When the server initializes, Then no dynamic instructions are injected

### US-007: Contextual Tree Headers (Priority: P1)

**As a** calling LLM agent, **I want** each search result to include its position in the spec folder hierarchy, **so that** I can understand the context without additional round-trips to `memory_list`.

**Acceptance Criteria**:
1. Given a memory in `023-hybrid-rag-fusion-refinement/015-refinement-phase-4/`, When returned by `memory_search`, Then the content is prefixed with `[023-hybrid-rag > 015-refinement-phase-4 — description]`
2. Given `SPECKIT_CONTEXT_HEADERS=false`, When `memory_search` runs, Then no headers are injected
3. Given a memory with no spec folder association, When returned by `memory_search`, Then no header is injected (graceful skip)

### US-008: Ingestion Job Cancellation (Priority: P1)

**As a** developer who accidentally started a bulk index of the wrong directory, **I want** to cancel the job before it completes, **so that** I don't pollute the index with unwanted memories.

**Acceptance Criteria**:
1. Given a running ingestion job, When `memory_ingest_cancel` is called with the job ID, Then the job transitions to `cancelled` state and stops processing new files
2. Given a cancelled job, When `memory_ingest_status` is called, Then it returns `state: 'cancelled'` with count of files processed before cancellation

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | |
| Phase 1 Implementation | User | Pending | |
| Phase 2 Implementation | User | Pending | |
| Phase 3 Implementation | User | Pending | |
| Final Verification | User | Pending | |

---

## 13. COMPLIANCE CHECKPOINTS

### Code Compliance
- [ ] Existing eval metrics pass after each phase (`eval_run_ablation`)
- [ ] All new features behind feature flags
- [ ] No breaking changes to existing tool signatures (additive only)
- [ ] Zod schemas match current valid parameter sets exactly

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User | Product Owner | High | Per-phase approval |
| Memory MCP consumers | API consumers | High | Non-breaking changes, opt-in enhancements |

---

## 15. CHANGE LOG

### v1.0 (2026-03-03)
**Initial specification** — Derived from 016 definitive synthesis (6-agent cross-AI research, triple-verified against feature catalog). 12 items scoped: 3 P0, 4 P1, 5 P2 (deferred).

---

## 16. OPEN QUESTIONS

- OQ-1: What does `formatSearchResults()` currently return? Need code-level audit before P0-2 implementation to avoid duplicate work.
- OQ-2: Does `node-llama-cpp` work reliably on macOS ARM64 with the target GGUF model? Need hardware test.
- OQ-3: Should `.strict()` enforcement be immediate or phased via `.passthrough()` transition period?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: See `research/` (16 files: 001-012 raw, 013-016 synthesis)

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `018-refinement-phase-7`
- Successor: `020-refinement-phase-8`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
5. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
6. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
