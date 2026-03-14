# 006 Runtime Gap Analysis

## Summary
- Total unchecked: 47 literal `- [ ]` entries in `checklist.md` (the checklist's own summary still says 23, so the summary block is stale).
- AUTOMATABLE: 45 (`CHK-020`, `CHK-021`, `CHK-022`, `CHK-024`, `CHK-030`, `CHK-031`, `CHK-032`, `CHK-033`, `CHK-034`, `CHK-035`, `CHK-039`, `CHK-041`, `CHK-042`, `CHK-043`, `CHK-045`, `CHK-046`, `CHK-049`, `CHK-050`, `CHK-051`, `CHK-054`, `CHK-056`, `CHK-058`, `CHK-061`, `CHK-062`, `CHK-063`, `CHK-064`, `CHK-065`, `CHK-070`, `CHK-071`, `CHK-072`, `CHK-073`, `CHK-074`, `CHK-075`, `CHK-077`, `CHK-078`, `CHK-079`, `CHK-083`, `CHK-084`, `CHK-088`, `CHK-089`, `CHK-090`, `CHK-091`, `CHK-092`, `CHK-093`, `CHK-094`)
- MANUAL: 2 (`CHK-069`, `CHK-141`)
- Key takeaway: nearly every remaining gap is machine-verifiable, but several need thin live-MCP harnesses/benchmarks rather than more pure unit tests.

## Test Execution Groups

### Group 1: Vitest Suite
Existing or easily-extended unit/contract suites:

- **V1 — Tool schema/unit validation**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts tests/review-fixes.vitest.ts`
  - Best for: schema strictness, error formatting, invalid-argument rejection.
- **V2 — Search result formatter contract**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/search-results-format.vitest.ts`
  - Best for: `includeTrace` envelopes and score/source/trace shape assertions.
- **V3 — Ingest queue + handler unit flow**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/job-queue.vitest.ts tests/handler-memory-ingest.vitest.ts`
  - Best for: queue state transitions, cancel behavior, persistence helpers.
- **V4 — Context header injection**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hybrid-search-context-headers.vitest.ts`
  - Best for: contextual header formatting and `includeContent: false` behavior.
- **V5 — Local reranker guardrails**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/local-reranker.vitest.ts`
  - Best for: missing-model / low-memory fallback logic and cache behavior once assertions are expanded.
- **V6 — File watcher unit behavior**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/file-watcher.vitest.ts`
  - Best for: debounce, `.md` filtering, disable flag, hash-dedup internals.
- **V7 — Context server static/startup assertions**
  - Command: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts`
  - Best for: tool exposure and startup-string assertions after adding explicit dynamic-init checks.

### Group 2: Benchmark Validation
These are automatable, but they need timing/eval harnesses rather than ordinary assertion-only tests:

- **B1 — Zod validation latency**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-tool-validation.mjs`
- **B2 — Response-envelope serialization latency**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-search-envelope.mjs`
- **B3 — Async ingest response/throughput**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-ingest-runtime.mjs`
- **B4 — Local reranker latency**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-local-reranker.mjs`
- **B5 — File watcher end-to-end latency/debounce**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/bench-file-watcher.mjs`
- **B6 — Eval regression / ablation**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node benchmarks/run-eval-ablation.mjs`

### Group 3: MCP Integration
Live server contract checks that should drive the built server over MCP stdio and assert on real envelopes:

- **I1 — Tool parameter matrix**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/tool-matrix.mjs`
  - Purpose: run one valid payload and one unknown-parameter payload per tool against a live MCP session.
- **I2 — `memory_search` response-contract harness**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/search-contract.mjs`
  - Purpose: compare `includeTrace` on/off envelopes against live search results.
- **I3 — Ingest lifecycle harness**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/ingest-lifecycle.mjs`
  - Purpose: start/status/cancel/crash-recovery scenarios against real temp corpora.
- **I4 — Dynamic init / handshake harness**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/dynamic-init-contract.mjs`
  - Purpose: capture MCP initialize handshake with feature flag on/off.
- **I5 — File watcher end-to-end harness**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/file-watcher-e2e.mjs`
  - Purpose: save/delete/edit temp `.md` and non-`.md` files, then assert on reindex behavior.
- **I6 — Local reranker end-to-end harness**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/local-reranker-e2e.mjs`
  - Purpose: run real searches with model-present/model-missing/low-memory variants.

### Group 4: Documentation/Manual
- **D1 — Documentation comparison write-up**
  - Human must judge whether the documented local-vs-remote MRR@5 comparison is complete, fair, and decision-useful.
- **D2 — Memory save content quality**
  - Human must decide which findings are worth saving and whether the generated memory captures the right session state.

### Group 5: Other
- **O1 — Backward-compatibility snapshot regression**
  - Proposed command: `cd .opencode/skill/system-spec-kit/mcp_server && node scripts/runtime/regression-snapshots.mjs`
  - Purpose: freeze a fixture corpus, run pre/post calls, and byte-compare normalized envelopes for legacy callers.

## Detailed Classification

| ID | Description | Classification | Verification Method | Effort |
|---|---|---|---|---|
| CHK-020 | All 24 tools accept valid parameters without regression | AUTOMATABLE | **I1** — live tool-matrix harness with one known-good payload per tool | M |
| CHK-021 | All 24 tools reject unknown parameters with actionable strict-mode error | AUTOMATABLE | **I1** — live tool-matrix harness with one extra key per tool | M |
| CHK-022 | Error messages include expected parameter names | AUTOMATABLE | **V1** for formatter assertions, then **I1** to confirm live MCP error text | S |
| CHK-024 | Schema validation overhead <5ms per tool call | AUTOMATABLE | **B1** — timing harness around `validateToolArgs()` across tool matrix | M |
| CHK-030 | `memory_search(includeTrace=true)` returns `scores` with 7 fields | AUTOMATABLE | **V2** plus **I2** live-envelope assertion | S |
| CHK-031 | `memory_search(includeTrace=true)` returns `source` object fields | AUTOMATABLE | **V2** plus **I2** live-envelope assertion | S |
| CHK-032 | `memory_search(includeTrace=true)` returns `trace` object fields | AUTOMATABLE | **V2** plus **I2** live-envelope assertion | S |
| CHK-033 | `memory_search` without `includeTrace` is backward compatible | AUTOMATABLE | **O1** — normalized snapshot compare with trace disabled | M |
| CHK-034 | `includeTrace` defaults to false | AUTOMATABLE | **V2** or **I2** with omitted flag and explicit assertion on missing trace block | S |
| CHK-035 | `scores.fusion` matches internal `PipelineRow.rrfScore` | AUTOMATABLE | **V2** with fixture row / **I2** against instrumented live result | M |
| CHK-039 | Envelope serialization overhead <10ms | AUTOMATABLE | **B2** — timing harness around `formatSearchResults()` with/without trace | M |
| CHK-041 | `memory_ingest_start` returns job ID in <100ms | AUTOMATABLE | **B3** — live ingest-start latency benchmark against temp corpus | M |
| CHK-042 | `memory_ingest_status` tracks actual processing state within 1s | AUTOMATABLE | **I3** — poll live job while indexing fixture files | M |
| CHK-043 | Job state machine transitions queued→parsing→embedding→indexing→complete | AUTOMATABLE | **V3** for queue transitions, then **I3** for live end-to-end ordering | M |
| CHK-045 | `memory_ingest_cancel` moves a running job to `cancelled` | AUTOMATABLE | **V3** + **I3** cancel scenario | M |
| CHK-046 | Cancelled job stops after current file (no mid-file abort) | AUTOMATABLE | **I3** with multi-file corpus and per-file progress assertions | M |
| CHK-049 | Job state persists in SQLite across restart | AUTOMATABLE | **V3** for DB persistence helper, then **I3** restart scenario on real DB | M |
| CHK-050 | Crash recovery resets incomplete jobs to `queued` on restart | AUTOMATABLE | **V3** + **I3** forced-restart scenario | M |
| CHK-051 | 100+ file batch completes without MCP timeout | AUTOMATABLE | **B3** — large-corpus ingest benchmark with end-to-end completion check | L |
| CHK-054 | Context headers use `[parent > child — desc]` format | AUTOMATABLE | **V4** — existing contextual-header suite | S |
| CHK-056 | `SPECKIT_CONTEXT_HEADERS=false` disables injection | AUTOMATABLE | **V4** after adding env-flag case, or **I2** with flag disabled | S |
| CHK-058 | `includeContent: false` means no injected header | AUTOMATABLE | **V4** — existing `includeContent=false` case | S |
| CHK-061 | Local GGUF reranking works end-to-end | AUTOMATABLE | **I6** — live search with model present and reranker enabled | L |
| CHK-062 | Missing model falls back to RRF without surfacing error | AUTOMATABLE | **I6** — live search with `RERANKER_LOCAL=true` and missing model path | M |
| CHK-063 | <8GB memory falls back to RRF without surfacing error | AUTOMATABLE | **I6** — simulated low-memory gate / injected memory probe override | M |
| CHK-064 | Reranking latency <500ms for top-20 | AUTOMATABLE | **B4** — timed reranker benchmark over 20 candidates | L |
| CHK-065 | Model is cached after first load | AUTOMATABLE | **V5** with expanded cache assertions, or **I6** repeated-query process metrics | M |
| CHK-069 | Local GGUF vs Cohere/Voyage MRR@5 comparison documented | MANUAL | **D1** — human reviews whether the write-up fairly compares datasets, metrics, and tradeoffs | M |
| CHK-070 | Startup instructions include total memory count | AUTOMATABLE | **I4** — capture initialize handshake and assert field presence | M |
| CHK-071 | Startup instructions include spec folder count | AUTOMATABLE | **I4** — capture initialize handshake and assert field presence | M |
| CHK-072 | Startup instructions include available search channels | AUTOMATABLE | **I4** — capture initialize handshake and assert field presence | M |
| CHK-073 | Startup instructions include key tool names | AUTOMATABLE | **I4** — capture initialize handshake and assert field presence | M |
| CHK-074 | Stale memory warning appears when `staleCount > 10` | AUTOMATABLE | **I4** — seed stale corpus, initialize, assert warning branch | M |
| CHK-075 | `SPECKIT_DYNAMIC_INIT=false` disables injection | AUTOMATABLE | **I4** — initialize with flag off and assert absence of injected instructions | M |
| CHK-077 | Changed `.md` file re-indexed within 5s | AUTOMATABLE | **B5** and **I5** — real file save + timed search visibility check | M |
| CHK-078 | Five rapid saves debounce to exactly one re-index | AUTOMATABLE | **B5** and **I5** — burst writes with reindex-call counting | M |
| CHK-079 | Identical-content save triggers no re-index | AUTOMATABLE | **V6** plus **I5** same-hash save scenario | S |
| CHK-083 | `SPECKIT_FILE_WATCHER=false` means no watcher starts | AUTOMATABLE | **V6** or **I5** with flag disabled and zero watcher activity assertion | S |
| CHK-084 | Only `.md` files trigger re-index | AUTOMATABLE | **V6** plus **I5** `.txt` / `.json` negative cases | S |
| CHK-088 | Baseline `eval_run_ablation` records all 9 metrics | AUTOMATABLE | **B6** — eval harness storing baseline JSON from fixed corpus | L |
| CHK-089 | After Phase 1, all 9 metrics are within 5% of baseline | AUTOMATABLE | **B6** — compare Phase 1 run to stored baseline | L |
| CHK-090 | After Phase 2, all 9 metrics are within 5% of baseline | AUTOMATABLE | **B6** — compare Phase 2 run to stored baseline | L |
| CHK-091 | After Phase 3, all 9 metrics are stable or improved | AUTOMATABLE | **B6** — compare Phase 3 run to stored baseline and flag regressions | L |
| CHK-092 | Existing `memory_search` call returns byte-identical results | AUTOMATABLE | **O1** — pre/post snapshot harness over frozen fixture corpus | L |
| CHK-093 | Existing `memory_context` call returns identical results | AUTOMATABLE | **O1** — pre/post snapshot harness with normalized timestamps/IDs if needed | L |
| CHK-094 | Existing `memory_match_triggers` call returns identical results | AUTOMATABLE | **O1** — pre/post snapshot harness with normalized runtime metadata | L |
| CHK-141 | Findings saved to `memory/` via `generate-context.js` | MANUAL | **D2** — human decides what findings to preserve and verifies generated memory is meaningful, not just present | S |

## Notes
- The practical gap is not "hard to verify" logic; it is mostly **missing runtime harnesses** around a now-implemented codebase.
- If the team wants the checklist to become executable, the highest-leverage additions are `tool-matrix.mjs`, `search-contract.mjs`, `ingest-lifecycle.mjs`, `dynamic-init-contract.mjs`, `file-watcher-e2e.mjs`, and `run-eval-ablation.mjs`.
