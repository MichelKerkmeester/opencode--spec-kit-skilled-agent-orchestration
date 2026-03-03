---
title: "Verification Checklist: Sprint 9 — Extra Features"
description: "Verification checklist for productization and operational tooling sprint."
trigger_phrases:
  - "sprint 9 checklist"
  - "019 checklist"
importance_tier: "high"
contextType: "verification"
---
# Verification Checklist: Sprint 9 — Extra Features

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (zod, chokidar, node-llama-cpp)
- [x] CHK-004 [P0] Research complete (16 documents, triple-verified via 016 synthesis)
- [ ] CHK-005 [P0] Current `formatSearchResults()` response shape audited (OQ-1)
- [ ] CHK-006 [P1] Current tool parameter usage audited across all 20+ tools
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Zod schemas match current valid parameter sets exactly (no false rejects)
- [ ] CHK-011 [P0] No console errors or warnings after schema changes
- [ ] CHK-012 [P0] Error messages from Zod validation are actionable (include expected shape)
- [ ] CHK-013 [P1] All new code follows existing TypeScript patterns in mcp_server/
- [ ] CHK-014 [P1] New feature flags follow SPECKIT_ naming convention
- [ ] CHK-015 [P1] No hardcoded paths in file watcher (configurable spec directories)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing — Per Feature

### P0-1: Zod Schema Validation
- [ ] CHK-020 [P0] All 24 tools accept VALID parameters without regression (test each tool individually)
- [ ] CHK-021 [P0] All 24 tools reject UNKNOWN parameters with actionable Zod error message (strict mode)
- [ ] CHK-022 [P0] Error messages include expected parameter names: "Unknown parameter 'foo'. Expected: query, specFolder, limit, ..."
- [ ] CHK-023 [P0] `SPECKIT_STRICT_SCHEMAS=false` falls back to `.passthrough()` mode (unknown params accepted, logged)
- [ ] CHK-024 [P1] Schema validation overhead <5ms per tool call (benchmark all 24 tools)
- [ ] CHK-025 [P1] `memory_search` complex schema validates all 25+ params correctly (largest schema)
- [ ] CHK-026 [P1] Enum values validated: `mode` rejects "invalid_mode", accepts "auto"|"semantic"|"keyword"|"hybrid"
- [ ] CHK-027 [P1] Number ranges validated: `limit` rejects 0 and 51, accepts 1-50
- [ ] CHK-028 [P1] `memory_delete` discriminated union works: accepts `{id: 1}` OR `{specFolder: "x", confirm: true}`, rejects `{id: 1, confirm: true}`
- [ ] CHK-029 [P2] Log rejected params at `info` level for audit trail (strict mode)

### P0-2: Response Envelopes
- [ ] CHK-030 [P0] `memory_search` with `includeTrace: true` returns `scores` object with 7 score fields
- [ ] CHK-031 [P0] `memory_search` with `includeTrace: true` returns `source` object with file, anchorIds, anchorTypes, lastModified, memoryState
- [ ] CHK-032 [P0] `memory_search` with `includeTrace: true` returns `trace` object with channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution
- [ ] CHK-033 [P0] `memory_search` WITHOUT `includeTrace` returns BYTE-IDENTICAL response shape as current production (backward compatibility)
- [ ] CHK-034 [P0] Default `includeTrace: false` — no trace in response unless explicitly requested
- [ ] CHK-035 [P1] `scores.fusion` matches internal `PipelineRow.rrfScore` for same result (no precision loss)
- [ ] CHK-036 [P1] `scores.rerank` is `null` when `SPECKIT_CROSS_ENCODER=false` (not zero, null)
- [ ] CHK-037 [P1] `trace.channelsUsed` accurately lists which of 5 channels (vector/fts5/bm25/graph/degree) contributed
- [ ] CHK-038 [P1] `trace.queryComplexity` reflects R15 complexity router classification (simple|moderate|complex)
- [ ] CHK-039 [P1] Envelope serialization overhead <10ms (benchmark)
- [ ] CHK-040 [P2] `memory_context` also supports `includeTrace` when underlying `memory_search` is called

### P0-3: Async Ingestion
- [ ] CHK-041 [P0] `memory_ingest_start` returns job ID in <100ms (no blocking file I/O in response path)
- [ ] CHK-042 [P0] `memory_ingest_status` returns accurate state matching actual processing state within 1s
- [ ] CHK-043 [P0] Job state machine transitions correctly: queued→parsing→embedding→indexing→complete
- [ ] CHK-044 [P0] Job state machine handles failure: transitions to `failed` with `errors[]` populated
- [ ] CHK-045 [P0] `memory_ingest_cancel` transitions running job to `cancelled` state
- [ ] CHK-046 [P0] Cancelled job stops processing after current file completes (no mid-file abort)
- [ ] CHK-047 [P1] Failed files logged with per-file error reasons in `errors[]` array
- [ ] CHK-048 [P1] Partial results committed: files indexed before failure remain in DB
- [ ] CHK-049 [P1] Job state persists in SQLite `ingest_jobs` table — survives server restart
- [ ] CHK-050 [P1] Crash recovery: incomplete jobs reset to `queued` on restart
- [ ] CHK-051 [P1] 100+ file batch completes without MCP timeout (async processing)
- [ ] CHK-052 [P1] Concurrent jobs queue correctly: max 1 processing, rest in `queued` state
- [ ] CHK-053 [P2] Job history queryable: completed/failed jobs retained in table for audit

### P1-4: Contextual Trees
- [ ] CHK-054 [P1] Context headers prepended to returned chunks in format `[parent > child — desc]`
- [ ] CHK-055 [P1] Header length capped at 100 characters (enforced, not just recommended)
- [ ] CHK-056 [P1] `SPECKIT_CONTEXT_HEADERS=false` disables injection completely
- [ ] CHK-057 [P1] Memories without spec folder association get NO header (graceful skip)
- [ ] CHK-058 [P1] `includeContent: false` results get NO header (no content to prepend to)
- [ ] CHK-059 [P1] PI-B3 description cache is used (not re-computed per query)
- [ ] CHK-060 [P2] Token budget accounts for header overhead (~10-15 tokens per result)

### P1-5: Local GGUF Reranker
- [ ] CHK-061 [P1] Reranking works end-to-end: GGUF model loaded, candidates scored, results re-ordered
- [ ] CHK-062 [P1] Graceful fallback to RRF when model file missing (no error to caller, warn log)
- [ ] CHK-063 [P1] Graceful fallback to RRF when free memory < 4GB (no error to caller, warn log)
- [ ] CHK-064 [P1] Reranking latency <500ms for top-20 candidates (benchmark)
- [ ] CHK-065 [P1] Model cached after first load — no re-allocation per query
- [ ] CHK-066 [P1] Model disposed on server shutdown (no memory leak)
- [ ] CHK-067 [P1] `RERANKER_LOCAL=false` (default) skips local reranking entirely
- [ ] CHK-068 [P1] `SPECKIT_CROSS_ENCODER=false` overrides — no reranking at all (Stage 3 skip)
- [ ] CHK-069 [P2] Eval comparison documented: local GGUF MRR@5 vs remote Cohere/Voyage MRR@5

### P1-6: Dynamic Server Instructions
- [ ] CHK-070 [P1] Server startup instruction string includes: total memory count
- [ ] CHK-071 [P1] Instruction string includes: spec folder count
- [ ] CHK-072 [P1] Instruction string includes: available search channels (vector, FTS5, BM25, graph, degree)
- [ ] CHK-073 [P1] Instruction string includes: key tool names (memory_context, memory_search, memory_save)
- [ ] CHK-074 [P1] Stale memory warning included when staleCount > 10
- [ ] CHK-075 [P1] `SPECKIT_DYNAMIC_INIT=false` disables instruction injection completely
- [ ] CHK-076 [P2] Instructions update if index changes during session (or document that they don't)

### P1-7: Filesystem Watching
- [ ] CHK-077 [P1] Changed `.md` file re-indexed within 5 seconds of save (end-to-end)
- [ ] CHK-078 [P1] Rapid consecutive saves (5x within 1s) debounced to exactly 1 re-index
- [ ] CHK-079 [P1] Content-hash dedup: saving file with IDENTICAL content triggers NO re-index
- [ ] CHK-080 [P1] Content-hash dedup: saving file with CHANGED content triggers re-index
- [ ] CHK-081 [P1] SQLITE_BUSY handled with exponential backoff retry (1s→2s→4s, 3 attempts)
- [ ] CHK-082 [P1] After 3 failed retries, watcher logs warning and skips (no crash, no infinite loop)
- [ ] CHK-083 [P1] `SPECKIT_FILE_WATCHER=false` (default) means no watcher starts
- [ ] CHK-084 [P1] Only `.md` files trigger re-index (`.txt`, `.json`, etc. ignored)
- [ ] CHK-085 [P1] Dotfiles and directories (`.git/`, `.DS_Store`) ignored
- [ ] CHK-086 [P1] Watcher closed cleanly on server shutdown (no orphaned process)
- [ ] CHK-087 [P2] Watcher metrics logged: files re-indexed count, average re-index time
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:regression -->
## Regression Testing

**Baseline (BEFORE any changes):**
- [ ] CHK-088 [P0] Record baseline `eval_run_ablation` results for all 9 metrics: MRR@5, precision@5, recall@5, NDCG@5, MAP, hit_rate, latency_p50, latency_p95, token_usage

**Per-phase gates:**
- [ ] CHK-089 [P0] `eval_run_ablation` after Phase 1: all 9 metrics within 5% of baseline
- [ ] CHK-090 [P0] `eval_run_ablation` after Phase 2: all 9 metrics within 5% of baseline
- [ ] CHK-091 [P0] `eval_run_ablation` after Phase 3: all 9 metrics stable or improved (reranker may lift quality)

**Backward compatibility:**
- [ ] CHK-092 [P0] Existing `memory_search` call (no new params) returns byte-identical results
- [ ] CHK-093 [P0] Existing `memory_context` call returns identical results
- [ ] CHK-094 [P0] Existing `memory_match_triggers` call returns identical results
- [ ] CHK-095 [P1] Existing `memory_save` with `asyncEmbedding: true` still works via old path
- [ ] CHK-096 [P1] All 20 existing tools callable with current parameter shapes — zero breakage
<!-- /ANCHOR:regression -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-060 [P0] No hardcoded secrets in new code
- [ ] CHK-061 [P0] Zod schemas prevent parameter injection
- [ ] CHK-062 [P1] File watcher restricted to configured directories (no path traversal)
- [ ] CHK-063 [P1] Job queue does not expose internal file system paths in error messages
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P1] Spec/plan/tasks synchronized with actual implementation
- [ ] CHK-071 [P1] Feature flags documented with defaults and descriptions
- [ ] CHK-072 [P1] New MCP tools documented (memory_ingest_start, memory_ingest_status)
- [ ] CHK-073 [P2] feature_catalog.md updated with new features
- [ ] CHK-074 [P2] implementation-summary.md written after completion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-080 [P1] Temp files in scratch/ only
- [ ] CHK-081 [P1] scratch/ cleaned before completion
- [ ] CHK-082 [P2] Findings saved to memory/ via generate-context.js
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented for `.strict()` transition
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Zod validation overhead <5ms (NFR-P01)
- [ ] CHK-111 [P1] Response envelope serialization <10ms (NFR-P02)
- [ ] CHK-112 [P1] File watcher re-index latency <5s (NFR-P03)
- [ ] CHK-113 [P1] GGUF reranking <500ms for 20 candidates (NFR-P04)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback via feature flags tested and documented
- [ ] CHK-121 [P0] All features behind feature flags (no forced breaking changes)
- [ ] CHK-122 [P1] Feature flag defaults set conservatively (new features opt-in where risky)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Product Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 4/28 |
| P1 Items | 49 | 0/49 |
| P2 Items | 11 | 0/11 |
| **Total** | **88** | **4/88** |

**Verification Date**: Pending

### Priority Breakdown by Feature

| Feature | P0 | P1 | P2 | Total |
|---------|---:|---:|---:|------:|
| Pre-Implementation | 4 | 2 | 0 | 6 |
| Code Quality | 3 | 3 | 0 | 6 |
| P0-1: Zod Schemas | 4 | 5 | 1 | 10 |
| P0-2: Response Envelopes | 5 | 5 | 1 | 11 |
| P0-3: Async Ingestion | 6 | 5 | 1 | 12 |
| P1-4: Contextual Trees | 0 | 5 | 1 | 6 |
| P1-5: GGUF Reranker | 0 | 7 | 1 | 8 |
| P1-6: Dynamic Init | 0 | 5 | 1 | 6 |
| P1-7: File Watcher | 0 | 9 | 1 | 10 |
| Regression | 6 | 2 | 0 | 8 |
| Security | 2 | 2 | 0 | 4 |
| Documentation | 0 | 3 | 2 | 5 |
| File Organization | 0 | 2 | 1 | 3 |
| Architecture (L3+) | 1 | 2 | 1 | 4 |
| Performance (L3+) | 0 | 4 | 0 | 4 |
| Deployment (L3+) | 2 | 1 | 0 | 3 |
<!-- /ANCHOR:summary -->
