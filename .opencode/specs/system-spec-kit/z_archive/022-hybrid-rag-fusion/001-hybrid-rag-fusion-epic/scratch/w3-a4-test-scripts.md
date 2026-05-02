# 006 Test Execution Plan

Generated: 2026-03-08
Source: W1-A2 gap analysis (`w1-a2-runtime-gap-analysis.md`) + `checklist.md`
Wave 2 baseline: 7153 passed / 4 failed (full suite)

---

## Group 1: Vitest Suite

Existing unit/contract tests that cover checklist items directly. 10 test files, ~447 tests total.

### Command (all at once)

```bash
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run \
  tests/tool-input-schema.vitest.ts \
  tests/mcp-input-validation.vitest.ts \
  tests/review-fixes.vitest.ts \
  tests/search-results-format.vitest.ts \
  tests/job-queue.vitest.ts \
  tests/handler-memory-ingest.vitest.ts \
  tests/hybrid-search-context-headers.vitest.ts \
  tests/local-reranker.vitest.ts \
  tests/file-watcher.vitest.ts \
  tests/context-server.vitest.ts
```

### Sub-runs (for targeted isolation)

| ID | File(s) | Command suffix | Est. tests | Est. runtime |
|----|---------|----------------|-----------|--------------|
| V1 | tool-input-schema, mcp-input-validation, review-fixes | `tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/review-fixes.vitest.ts` | ~60 | ~3s |
| V2 | search-results-format | `tests/search-results-format.vitest.ts` | ~75 | ~2s |
| V3 | job-queue, handler-memory-ingest | `tests/job-queue.vitest.ts tests/handler-memory-ingest.vitest.ts` | ~25 | ~3s |
| V4 | hybrid-search-context-headers | `tests/hybrid-search-context-headers.vitest.ts` | ~5 | ~1s |
| V5 | local-reranker | `tests/local-reranker.vitest.ts` | ~7 | ~1s |
| V6 | file-watcher | `tests/file-watcher.vitest.ts` | ~30 | ~12s |
| V7 | context-server | `tests/context-server.vitest.ts` | ~248 | ~5s |

### Covers Items

**V1 — Tool schema / input validation (CHK-020, CHK-021, CHK-022)**
- CHK-020: All tools accept valid parameters without regression — `tool-input-schema.vitest.ts` per-tool valid-payload tests
- CHK-021: All tools reject unknown parameters with strict-mode error — `tool-input-schema.vitest.ts` strict-mode rejection tests
- CHK-022: Error messages include expected parameter names — `review-fixes.vitest.ts` + `mcp-input-validation.vitest.ts` error formatting assertions

**V2 — Search result formatter contract (CHK-030, CHK-031, CHK-032, CHK-033, CHK-034, CHK-035, CHK-039)**
- CHK-030: `includeTrace=true` returns `scores` with 7 fields — `search-results-format.vitest.ts` envelope shape assertions
- CHK-031: `includeTrace=true` returns `source` object fields — `search-results-format.vitest.ts` source shape assertions
- CHK-032: `includeTrace=true` returns `trace` object fields — `search-results-format.vitest.ts` trace shape assertions
- CHK-033: Without `includeTrace`, backward-compatible response shape — `search-results-format.vitest.ts` default-off assertions
- CHK-034: `includeTrace` defaults to false — `search-results-format.vitest.ts` omitted-flag assertions
- CHK-035: `scores.fusion` matches internal `PipelineRow.rrfScore` — `search-results-format.vitest.ts` fixture row precision checks
- CHK-039: Envelope serialization overhead <10ms — partial (unit-level timing; full benchmark in Group 2)

**V3 — Ingest queue + handler (CHK-041, CHK-042, CHK-043, CHK-045, CHK-046, CHK-049, CHK-050, CHK-051)**
- CHK-041: `memory_ingest_start` returns job ID in <100ms — `handler-memory-ingest.vitest.ts` response-time assertions
- CHK-042: `memory_ingest_status` tracks actual processing state — `handler-memory-ingest.vitest.ts` state query tests
- CHK-043: Job state machine transitions queued->parsing->embedding->indexing->complete — `job-queue.vitest.ts` state machine tests
- CHK-045: `memory_ingest_cancel` moves job to cancelled — `job-queue.vitest.ts` cancel scenario
- CHK-046: Cancelled job stops after current file — `job-queue.vitest.ts` mid-cancel behavior
- CHK-049: Job state persists in SQLite across restart — `job-queue.vitest.ts` persistence helper tests
- CHK-050: Crash recovery resets incomplete jobs to queued — `job-queue.vitest.ts` crash-recovery describe block
- CHK-051: 100+ file batch completes without timeout — partial (unit-level async; full benchmark in Group 2)

**V4 — Context header injection (CHK-054, CHK-056, CHK-058)**
- CHK-054: Context headers use `[parent > child — desc]` format — `hybrid-search-context-headers.vitest.ts` format assertions
- CHK-056: `SPECKIT_CONTEXT_HEADERS=false` disables injection — `hybrid-search-context-headers.vitest.ts` env-flag case
- CHK-058: `includeContent: false` means no injected header — `hybrid-search-context-headers.vitest.ts` content-off case

**V5 — Local reranker guardrails (CHK-061, CHK-062, CHK-063, CHK-065)**
- CHK-061: GGUF reranking works end-to-end — `local-reranker.vitest.ts` mock model scoring tests
- CHK-062: Missing model falls back to RRF — `local-reranker.vitest.ts` missing-model fallback assertions
- CHK-063: <8GB memory falls back to RRF — `local-reranker.vitest.ts` low-memory gate assertions
- CHK-065: Model cached after first load — `local-reranker.vitest.ts` cache reuse assertions

**V6 — File watcher unit behavior (CHK-077, CHK-078, CHK-079, CHK-083, CHK-084)**
- CHK-077: Changed `.md` re-indexed within 5s — `file-watcher.vitest.ts` debounce timing tests
- CHK-078: Rapid saves debounce to 1 re-index — `file-watcher.vitest.ts` burst-write dedup tests
- CHK-079: Identical-content save triggers no re-index — `file-watcher.vitest.ts` hash-dedup tests
- CHK-083: `SPECKIT_FILE_WATCHER=false` disables watcher — `file-watcher.vitest.ts` flag-disabled case
- CHK-084: Only `.md` triggers re-index — `file-watcher.vitest.ts` extension-filter tests

**V7 — Context server static/startup (CHK-070, CHK-071, CHK-072, CHK-073, CHK-074, CHK-075)**
- CHK-070: Startup instructions include total memory count — `context-server.vitest.ts` dynamic-init assertions
- CHK-071: Startup instructions include spec folder count — `context-server.vitest.ts` dynamic-init assertions
- CHK-072: Startup instructions include available search channels — `context-server.vitest.ts` channel listing assertions
- CHK-073: Startup instructions include key tool names — `context-server.vitest.ts` tool-name assertions
- CHK-074: Stale memory warning when `staleCount > 10` — `context-server.vitest.ts` stale-warning branch
- CHK-075: `SPECKIT_DYNAMIC_INIT=false` disables injection — `context-server.vitest.ts` flag-disabled case

### Pass Criteria

- **GREEN target:** 447/447 tests pass (0 failures)
- **Current state:** 445/447 pass, 2 known failures:
  1. `handler-memory-ingest.vitest.ts` > "start queues job and returns queued response" — mock module missing `DATABASE_PATH` export
  2. `job-queue.vitest.ts` > "resets incomplete jobs to queued from a clean cursor" — crash-recovery test setup issue
- **Minimum acceptable:** 445/447 pass with the 2 known failures documented as pre-existing mock issues (not implementation bugs)
- **Estimated total runtime:** ~12s

---

## Group 2: Benchmark Validation

Performance-related checklist items requiring timing harnesses. **These harnesses do NOT currently exist.** The `benchmarks/` directory and `scripts/runtime/` directory are not yet created in `mcp_server/`.

### B1 — Zod validation latency

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-tool-validation.mjs
```

**Covers Items:**
- CHK-024: Schema validation overhead <5ms per tool call

**What it must do:** Loop `validateToolArgs()` across all 28 tool schemas with representative payloads, measure p50/p95/p99 latency, assert all <5ms.

**Pass Criteria:** p95 < 5ms across all 28 schemas.

### B2 — Response envelope serialization latency

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-search-envelope.mjs
```

**Covers Items:**
- CHK-039: Envelope serialization overhead <10ms

**What it must do:** Call `formatSearchResults()` with and without `includeTrace`, 100 iterations, measure p95.

**Pass Criteria:** p95 < 10ms.

### B3 — Async ingest response/throughput

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-ingest-runtime.mjs
```

**Covers Items:**
- CHK-041: `memory_ingest_start` returns job ID in <100ms (timing aspect)
- CHK-051: 100+ file batch completes without MCP timeout

**What it must do:** Start ingest via `handleMemoryIngestStart()` against a temp corpus of 100+ `.md` files, measure: (a) time to return job ID, (b) total completion time.

**Pass Criteria:** (a) job ID returned in <100ms, (b) 100-file batch completes within 60s.

### B4 — Local reranker latency

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-local-reranker.mjs
```

**Covers Items:**
- CHK-064: Reranking latency <500ms for top-20 candidates

**What it must do:** Load a GGUF model (or mock), score 20 candidate documents, measure wall-clock time.

**Pass Criteria:** p95 < 500ms for 20 candidates. If no GGUF model available, skip with documented reason.

### B5 — File watcher end-to-end latency

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-file-watcher.mjs
```

**Covers Items:**
- CHK-077: Changed `.md` file re-indexed within 5s (timing validation)
- CHK-078: Five rapid saves debounce to exactly 1 re-index (counting validation)

**What it must do:** Create a real watcher on a temp directory, save files, measure time-to-reindex and count reindex invocations.

**Pass Criteria:** (a) single-file reindex completes in <5s, (b) 5 rapid saves produce exactly 1 reindex call.

### B6 — Eval regression / ablation

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/run-eval-ablation.mjs
```

**Covers Items:**
- CHK-088: Baseline `eval_run_ablation` records all 9 metrics
- CHK-089: After Phase 1, all 9 metrics within 5% of baseline
- CHK-090: After Phase 2, all 9 metrics within 5% of baseline
- CHK-091: After Phase 3, all 9 metrics stable or improved

**What it must do:** Run the eval pipeline against a frozen fixture corpus, record MRR@5, precision@5, recall@5, NDCG@5, MAP, hit_rate, latency_p50, latency_p95, token_usage. Compare per-phase results to stored baseline.

**Pass Criteria:** All 9 metrics within 5% of baseline (Phase 1-2) or stable/improved (Phase 3).

### Benchmark Group Summary

| ID | Covers | Harness exists? | Estimated runtime |
|----|--------|-----------------|-------------------|
| B1 | CHK-024 | NO | ~5s |
| B2 | CHK-039 | NO | ~5s |
| B3 | CHK-041 (timing), CHK-051 | NO | ~90s |
| B4 | CHK-064 | NO | ~30s (model-dependent) |
| B5 | CHK-077 (timing), CHK-078 (counting) | NO | ~15s |
| B6 | CHK-088, CHK-089, CHK-090, CHK-091 | NO | ~5-10min (eval pipeline) |

**Estimated total runtime:** ~12-15min (dominated by B3 + B6)

---

## Group 3: MCP Integration

End-to-end tests that drive a live MCP server over stdio and assert on real envelopes. **These harnesses do NOT currently exist.** The `scripts/runtime/` directory is not yet created.

### I1 — Tool parameter matrix (live MCP)

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/tool-matrix.mjs
```

**Covers Items:**
- CHK-020: All 24 tools accept valid parameters (live confirmation)
- CHK-021: All 24 tools reject unknown parameters (live confirmation)
- CHK-022: Error messages include expected parameter names (live confirmation)

**What it must do:** Spawn `node dist/context-server.js` over stdio, send one valid payload and one unknown-parameter payload per tool via MCP protocol, capture responses.

**Pass Criteria:** All valid payloads return non-error responses; all unknown-parameter payloads return errors containing "Unknown parameter" and "Expected parameter names".

### I2 — `memory_search` response-contract harness

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/search-contract.mjs
```

**Covers Items:**
- CHK-030: `includeTrace=true` returns `scores` with 7 fields (live)
- CHK-031: `includeTrace=true` returns `source` fields (live)
- CHK-032: `includeTrace=true` returns `trace` fields (live)
- CHK-033: Without `includeTrace`, backward-compatible response (live)
- CHK-034: `includeTrace` defaults to false (live)
- CHK-035: `scores.fusion` matches internal score (live)

**Pass Criteria:** Envelope fields match the spec exactly. Default-off query returns no trace/scores/source blocks.

### I3 — Ingest lifecycle harness

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/ingest-lifecycle.mjs
```

**Covers Items:**
- CHK-041: Start returns job ID in <100ms (live)
- CHK-042: Status tracks actual processing state (live)
- CHK-043: State machine transitions (live)
- CHK-045: Cancel moves job to cancelled (live)
- CHK-046: Cancelled job stops after current file (live)
- CHK-049: Job state persists across restart (live)
- CHK-050: Crash recovery resets incomplete jobs (live)
- CHK-051: 100+ file batch completes (live)

**Pass Criteria:** Full lifecycle (start -> status-poll -> complete) succeeds. Cancel mid-flight confirmed. Restart scenario recovers.

### I4 — Dynamic init / handshake harness

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/dynamic-init-contract.mjs
```

**Covers Items:**
- CHK-070: Startup instructions include total memory count (live)
- CHK-071: Startup instructions include spec folder count (live)
- CHK-072: Startup instructions include available search channels (live)
- CHK-073: Startup instructions include key tool names (live)
- CHK-074: Stale memory warning when `staleCount > 10` (live)
- CHK-075: `SPECKIT_DYNAMIC_INIT=false` disables injection (live)

**Pass Criteria:** MCP `initialize` response contains expected instruction fields. With flag off, instructions are absent.

### I5 — File watcher end-to-end harness

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/file-watcher-e2e.mjs
```

**Covers Items:**
- CHK-077: Changed `.md` re-indexed within 5s (live)
- CHK-078: Rapid saves debounce to 1 re-index (live)
- CHK-079: Identical-content save triggers no re-index (live)
- CHK-083: `SPECKIT_FILE_WATCHER=false` disables watcher (live)
- CHK-084: Only `.md` files trigger re-index (live)

**Pass Criteria:** Real file operations on temp directory trigger expected reindex behavior through live MCP server.

### I6 — Local reranker end-to-end harness

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/local-reranker-e2e.mjs
```

**Covers Items:**
- CHK-061: GGUF reranking works end-to-end (live)
- CHK-062: Missing model falls back to RRF (live)
- CHK-063: <8GB memory falls back to RRF (live)
- CHK-064: Reranking latency <500ms (live timing)
- CHK-065: Model cached after first load (live)

**Pass Criteria:** With model present, results are reranked. With model missing or low-memory, RRF fallback occurs silently.

### O1 — Backward-compatibility snapshot regression

```bash
# DOES NOT EXIST YET — needs creation
cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/regression-snapshots.mjs
```

**Covers Items:**
- CHK-092: Existing `memory_search` call returns byte-identical results
- CHK-093: Existing `memory_context` call returns identical results
- CHK-094: Existing `memory_match_triggers` call returns identical results

**Pass Criteria:** Pre/post normalized envelope comparison shows zero diff (excluding runtime-varying fields like latency, timestamps).

### MCP Integration Group Summary

| ID | Covers | Harness exists? | Estimated runtime |
|----|--------|-----------------|-------------------|
| I1 | CHK-020, CHK-021, CHK-022 | NO | ~30s |
| I2 | CHK-030-035 | NO | ~15s |
| I3 | CHK-041-043, CHK-045-046, CHK-049-051 | NO | ~120s |
| I4 | CHK-070-075 | NO | ~10s |
| I5 | CHK-077-079, CHK-083-084 | NO | ~20s |
| I6 | CHK-061-065 | NO | ~60s (model-dependent) |
| O1 | CHK-092-094 | NO | ~15s |

**Estimated total runtime:** ~5min (excluding model download time for I6)

---

## Manual Items (Not Automatable)

| ID | Description | Verification method |
|----|-------------|-------------------|
| CHK-069 | Local GGUF vs Cohere/Voyage MRR@5 comparison documented | Human reviews whether the write-up fairly compares datasets, metrics, and tradeoffs |
| CHK-141 | Findings saved to `memory/` via `generate-context.js` | Human decides what findings to preserve and verifies generated memory is meaningful |

---

## Execution Order

### Phase A: Run existing tests (immediate — no new code required)

```
Step 1: Group 1 full run (~12s)
  cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run \
    tests/tool-input-schema.vitest.ts \
    tests/mcp-input-validation.vitest.ts \
    tests/review-fixes.vitest.ts \
    tests/search-results-format.vitest.ts \
    tests/job-queue.vitest.ts \
    tests/handler-memory-ingest.vitest.ts \
    tests/hybrid-search-context-headers.vitest.ts \
    tests/local-reranker.vitest.ts \
    tests/file-watcher.vitest.ts \
    tests/context-server.vitest.ts

  Expected: 445+ pass / 2 known failures (mock issues, not implementation bugs)
  Outcome: Mark all Group 1 items as VITEST-VERIFIED or document gaps
```

### Phase B: Fix known test failures (prerequisite for full green)

```
Step 2: Fix handler-memory-ingest.vitest.ts mock (missing DATABASE_PATH export)
Step 3: Fix job-queue.vitest.ts crash-recovery test setup
Step 4: Re-run Group 1 — target 447/447
```

### Phase C: Create benchmark harnesses (new code — ordered by priority)

```
Step 5: B1 (Zod validation latency) — easiest, validates CHK-024
Step 6: B2 (Envelope serialization) — validates CHK-039
Step 7: B5 (File watcher timing) — validates CHK-077, CHK-078
Step 8: B3 (Ingest throughput) — validates CHK-041 timing, CHK-051
Step 9: B4 (Reranker latency) — validates CHK-064, requires GGUF model
Step 10: B6 (Eval ablation) — largest, validates CHK-088-091
```

### Phase D: Create MCP integration harnesses (new code — ordered by dependency)

```
Step 11: I4 (Dynamic init) — simplest MCP harness, validates CHK-070-075
Step 12: I1 (Tool matrix) — validates CHK-020-022 against live server
Step 13: I2 (Search contract) — validates CHK-030-035 against live server
Step 14: O1 (Regression snapshots) — validates CHK-092-094
Step 15: I5 (File watcher e2e) — validates CHK-077-079, CHK-083-084
Step 16: I3 (Ingest lifecycle) — validates CHK-041-051 against live server
Step 17: I6 (Reranker e2e) — validates CHK-061-065, requires GGUF model
```

### Phase E: Manual review

```
Step 18: CHK-069 — Human reviews local vs remote MRR@5 comparison document
Step 19: CHK-141 — Human runs generate-context.js and verifies memory output
```

---

## Coverage Matrix

| CHK ID | Priority | Group 1 (Vitest) | Group 2 (Bench) | Group 3 (MCP) | Manual |
|--------|----------|:----------------:|:---------------:|:-------------:|:------:|
| CHK-020 | P0 | V1 | | I1 | |
| CHK-021 | P0 | V1 | | I1 | |
| CHK-022 | P0 | V1 | | I1 | |
| CHK-024 | P1 | | B1 | | |
| CHK-030 | P0 | V2 | | I2 | |
| CHK-031 | P0 | V2 | | I2 | |
| CHK-032 | P0 | V2 | | I2 | |
| CHK-033 | P0 | V2 | | I2 | |
| CHK-034 | P0 | V2 | | I2 | |
| CHK-035 | P1 | V2 | | I2 | |
| CHK-039 | P1 | | B2 | | |
| CHK-041 | P0 | V3 | B3 | I3 | |
| CHK-042 | P0 | V3 | | I3 | |
| CHK-043 | P0 | V3 | | I3 | |
| CHK-045 | P0 | V3 | | I3 | |
| CHK-046 | P0 | V3 | | I3 | |
| CHK-049 | P1 | V3 | | I3 | |
| CHK-050 | P1 | V3 | | I3 | |
| CHK-051 | P1 | V3 | B3 | I3 | |
| CHK-054 | P1 | V4 | | | |
| CHK-056 | P1 | V4 | | | |
| CHK-058 | P1 | V4 | | | |
| CHK-061 | P1 | V5 | | I6 | |
| CHK-062 | P1 | V5 | | I6 | |
| CHK-063 | P1 | V5 | | I6 | |
| CHK-064 | P1 | | B4 | I6 | |
| CHK-065 | P1 | V5 | | I6 | |
| CHK-069 | P2 | | | | D1 |
| CHK-070 | P1 | V7 | | I4 | |
| CHK-071 | P1 | V7 | | I4 | |
| CHK-072 | P1 | V7 | | I4 | |
| CHK-073 | P1 | V7 | | I4 | |
| CHK-074 | P1 | V7 | | I4 | |
| CHK-075 | P1 | V7 | | I4 | |
| CHK-077 | P1 | V6 | B5 | I5 | |
| CHK-078 | P1 | V6 | B5 | I5 | |
| CHK-079 | P1 | V6 | | I5 | |
| CHK-083 | P1 | V6 | | I5 | |
| CHK-084 | P1 | V6 | | I5 | |
| CHK-088 | P0 | | B6 | | |
| CHK-089 | P0 | | B6 | | |
| CHK-090 | P0 | | B6 | | |
| CHK-091 | P0 | | B6 | | |
| CHK-092 | P0 | | | O1 | |
| CHK-093 | P0 | | | O1 | |
| CHK-094 | P0 | | | O1 | |
| CHK-141 | P2 | | | | D2 |

**Total: 47 unchecked items covered**
- Group 1 (Vitest): 35 items — EXISTS, runnable now
- Group 2 (Benchmark): 10 items — NEEDS CREATION (6 harnesses)
- Group 3 (MCP Integration): 22 items — NEEDS CREATION (7 harnesses)
- Manual: 2 items — human review required

Note: Many items are covered by multiple groups (unit + integration). The overlap is intentional — unit tests provide fast feedback, integration tests provide live-server confidence.

---

## Known Test Failures (Pre-existing)

| Test file | Test name | Root cause | Blocking? |
|-----------|-----------|------------|-----------|
| `handler-memory-ingest.vitest.ts` | "start queues job and returns queued response" | Mock module missing `DATABASE_PATH` export from `../core` | YES for CHK-041, CHK-042 unit coverage |
| `job-queue.vitest.ts` | "resets incomplete jobs to queued from a clean cursor" | Crash-recovery test setup/teardown issue | YES for CHK-050 unit coverage |

Both are mock-configuration issues, not implementation bugs. Fixing them is Phase B (Step 2-3) in the execution order.
