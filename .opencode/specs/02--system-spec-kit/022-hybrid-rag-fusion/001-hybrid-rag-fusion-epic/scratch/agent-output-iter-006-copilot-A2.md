# Search Pipeline Audit: Error Handling Edge Cases and Race Conditions

## Scope

Reviewed:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`

Supporting code inspected where needed:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`
- `.opencode/skill/system-spec-kit/shared/embeddings.ts`

## Executive Summary

The pipeline is mostly built around graceful degradation. Stage 4 is explicitly read-only, hybrid search catches many channel-level failures, and `memory_context` returns structured MCP errors for validation and strategy failures. The biggest reliability gap is not broad crashing. It is loss of precision and observability under failure.

The main issues are:

1. **Real cross-request race risk in FSRS write-back** when `trackAccess=true`, because Stage 2 does a read-compute-write update with no transaction or compare-and-swap protection.
2. **No explicit timeout at the pipeline level**, and Stage 1 calls `generateQueryEmbedding()` rather than the available timeout-protected helper.
3. **Stage 1 handles `null` embeddings gracefully in some paths, but not structurally empty embeddings** like `new Float32Array(0)`.
4. **User-facing MCP errors are decent at the orchestration layer, but pipeline-stage runtime failures are not shaped locally by `memory_search`**, so callers lose stage-specific diagnostics.
5. **I did not find an obvious fire-and-forget async path in these files that would clearly cause process-level `unhandledRejection`**, but there are places where awaited failures bubble out without stage-local handling.

## Findings by Question

### 1. Are there race conditions between concurrent search requests and FSRS write-back?

**Answer: yes, for Stage 2 FSRS write-back when `trackAccess=true`.**

Evidence:

- Stage 2 applies the testing effect only when `config.trackAccess` is enabled, and it does so inline during request processing: `stage2-fusion.ts:699-710`.
- `applyTestingEffect()` loops the results and calls `strengthenOnAccess()` per row: `stage2-fusion.ts:500-527`.
- `strengthenOnAccess()` first reads `stability`, `difficulty`, and `review_count`, computes a new stability in JS, then writes it back with a separate `UPDATE`: `stage2-fusion.ts:244-280`.

Why this is a race:

- The write path is a classic read-compute-write sequence with no transaction boundary around the read and write.
- Two concurrent searches can read the same old `stability`, compute the same next `stability`, and then whichever request writes last wins.
- `review_count = review_count + 1` and `access_count = access_count + 1` are handled atomically inside SQL, so counters should still move forward, but the **stability update is last-write-wins** and can lose one search's strengthening effect.

What is safe:

- Within a single request, hybrid-search channel work is intentionally sequential because it uses synchronous `better-sqlite3`, not `Promise.all`: `hybrid-search.ts:540-542`, `hybrid-search.ts:602-603`.
- Stage 4 is read-only and adds no write-side race risk: `stage4-filter.ts:20-21`, `stage4-filter.ts:243-345`.

Impact:

- Search ranking itself is not corrupted in-flight.
- FSRS retention metadata can drift under concurrent load, especially `stability`, `last_review`, and `last_accessed` semantics.

Recommendation:

- Protect `strengthenOnAccess()` with a transaction or move the update to a single atomic SQL mutation that derives the next state from the latest committed row.

### 2. What happens if the embedding provider fails mid-search?

**Answer: the behavior depends on which path is failing. Primary embeddings usually fail closed; secondary enrichment channels usually fail open.**

Shared embedding wrapper behavior:

- `generate_query_embedding()` catches provider exceptions, logs a warning, and returns `null`: `vector-index-queries.ts:596-609`.

Primary query paths:

- Multi-concept search throws if any concept embedding is missing: `stage1-candidate-gen.ts:236-245`.
- Hybrid search throws if the main query embedding is missing: `stage1-candidate-gen.ts:263-269`.
- Vector-only search throws if the main query embedding is missing: `stage1-candidate-gen.ts:449-454`.

Secondary or optional paths:

- Deep-mode variant search skips a variant when its embedding comes back `null`, and only falls back to single hybrid if the overall `Promise.all()` branch throws: `stage1-candidate-gen.ts:277-317`.
- R12 embedding expansion runs baseline and expansion channels in parallel. Both sub-promises are guarded with `.catch(() => [])`, and a missing expansion embedding returns `[]`, so the caller gets baseline results instead of a hard failure: `stage1-candidate-gen.ts:357-372`.
- Constitutional injection silently skips the extra vector fetch when the reused/generated embedding is falsy: `stage1-candidate-gen.ts:541-572`.
- The R8 summary-embedding channel also skips quietly when the embedding is falsy and logs only if the surrounding channel throws: `stage1-candidate-gen.ts:590-652`.

Downstream hybrid-search behavior:

- Enhanced hybrid search catches its own failures and falls back to the older hybrid implementation: `hybrid-search.ts:1059-1065`.
- `searchWithFallback()` then retries with a lower similarity threshold, then falls back to FTS-only, then BM25-only, and finally returns `[]`: `hybrid-search.ts:1078-1121`.
- Individual hybrid channels also fail open and keep the request alive: vector `hybrid-search.ts:437-458`, graph `hybrid-search.ts:648-665`, MPAB `hybrid-search.ts:766-798`, channel enforcement `hybrid-search.ts:805-835`, confidence truncation `hybrid-search.ts:841-857`, MMR embedding lookup `hybrid-search.ts:879-926`.

Net effect:

- **Primary embedding failure** for the core query usually aborts Stage 1.
- **Mid-search failure in optional channels** usually degrades to fewer signals and smaller recall, not a total search failure.

### 3. Are there timeout mechanisms for long-running searches?

**Answer: not in the reviewed search pipeline.**

Evidence:

- The orchestrator simply awaits Stage 1 through Stage 4 in sequence with no `AbortController`, `Promise.race`, or deadline handling: `orchestrator.ts:42-78`.
- Stage 1 repeatedly calls `generateQueryEmbedding()` directly: `stage1-candidate-gen.ts:239`, `stage1-candidate-gen.ts:264`, `stage1-candidate-gen.ts:279`, `stage1-candidate-gen.ts:363`, `stage1-candidate-gen.ts:450`, `stage1-candidate-gen.ts:544`, `stage1-candidate-gen.ts:595`.
- The embedding module does expose a timeout-protected helper, `generateEmbeddingWithTimeout()`, implemented with `Promise.race()`: `shared/embeddings.ts:426-435`.
- But the query path actually used by search is `generateQueryEmbedding()`, which has no timeout wrapper of its own: `shared/embeddings.ts:584-607`.

So today:

- There is **no pipeline-level timeout**.
- There is **no Stage 1 query-embedding timeout** in the path actually used.
- If the provider hangs instead of throwing, the search can hang with it.

### 4. Does Stage 1 handle empty embedding gracefully?

**Answer: it handles `null` gracefully in several places, but it does not validate structurally empty non-null embeddings.**

Good behavior:

- Empty or whitespace-only queries are turned into `null` by the query embedding wrapper: `vector-index-queries.ts:596-600`.
- Stage 1 checks for falsy embeddings and throws or skips appropriately in the main search paths: `stage1-candidate-gen.ts:239-245`, `stage1-candidate-gen.ts:267-269`, `stage1-candidate-gen.ts:452-454`, `stage1-candidate-gen.ts:546-572`, `stage1-candidate-gen.ts:597-647`.

Gap:

- Stage 1 only checks truthiness. It does **not** verify embedding length or shape.
- A value like `new Float32Array(0)` is truthy, so it would pass these guards and be handed to vector search or expansion logic.
- The same issue applies to concept embeddings, the main hybrid/vector embedding, constitutional injection, and summary embeddings.

Conclusion:

- `null` and empty-input cases are handled.
- **Zero-length or malformed but non-null embeddings are not explicitly guarded.**

### 5. What is the error experience for users of the MCP tools? Do they get useful messages?

**Answer: mostly yes for validation and orchestration errors, less so for runtime pipeline failures.**

Good user-facing behavior:

- `memory_context` returns a structured `E_VALIDATION` response with `requestId`, layer, and recovery hint when `input` is missing: `memory-context.ts:563-576`.
- `memory_context` also catches strategy execution failures and returns structured `E_STRATEGY` with the request id, current mode, and alternative layers: `memory-context.ts:737-773`.
- `memory_search` returns structured `E_VALIDATION` responses for invalid query/specFolder inputs: `memory-search.ts:779-825`.

Where the UX gets weaker:

- `memory_search` builds a `PipelineConfig` and directly awaits `executePipeline()` with no local catch around pipeline runtime failures: `memory-search.ts:931-968`.
- That means stage-level failures are **not shaped into a `memory_search`-specific runtime error** at the point they occur.
- When `memory_context` calls `memory_search`, those failures get collapsed into the more generic orchestration-level `E_STRATEGY` response from `memory_context`: `memory-context.ts:737-773`.

Also worth noting:

- Many lower-level failures are intentionally log-and-degrade, not user-visible. That keeps search available, but it also means users often cannot tell whether they got the best search or a degraded one.
- Examples include deep expansion fallback: `stage1-candidate-gen.ts:304-317`, R12 fallback: `stage1-candidate-gen.ts:398-403`, reranker fallback: `stage3-rerank.ts:331-336`, `stage3-rerank.ts:384-389`, and enhanced-search fallback: `hybrid-search.ts:1059-1065`.

Bottom line:

- **Validation UX is good.**
- **Operational failure UX is only moderately good**, because the message often arrives from the outer layer and lacks stage-specific detail.

### 6. Are there any uncaught promise rejections?

**Answer: I did not find an obvious detached async path in these files that is likely to cause a process-level `unhandledRejection`, but there are awaited failures that bubble upward without local shaping.**

What looks safe:

- The main async work is awaited end-to-end: Stage 1, Stage 3, the orchestrator, `memory_search`, and `memory_context` all use `await` rather than fire-and-forget calls.
- The asynchronous stale-cache refresh in `hybrid-search` uses `setTimeout`, but the callback is fully wrapped in `try/finally`, so it does not leak exceptions: `hybrid-search.ts:1282-1297`.
- The R12 expansion parallel branch catches both sub-promises explicitly: `stage1-candidate-gen.ts:357-372`.

Where failures still propagate:

- Stage 3's MPAB collapse uses `Promise.all(...)` without a local guard around the call site in `executeStage3()`: `stage3-rerank.ts:228-229`, `stage3-rerank.ts:486-489`.
- If one parent reassembly path were ever to reject unexpectedly outside its own `try/catch`, the rejection would bubble out of Stage 3.
- The orchestrator also does not catch stage failures locally: `orchestrator.ts:42-78`.
- `memory_search` does not catch `executePipeline()` locally either: `memory-search.ts:931-968`.
- `memory_context` does catch strategy failures, so **for the `memory_context` tool path**, these become structured MCP errors rather than uncaught promise rejections: `memory-context.ts:737-773`.

Conclusion:

- I did **not** find a clear process-level `unhandledRejection` bug in the reviewed files.
- The real issue is **error propagation without stage-local shaping**, not orphaned promises.

## Additional Notes on Stage 3 and Stage 4

### Stage 3

- Cross-encoder reranking is already defensive and returns original results on failure: `stage3-rerank.ts:277-390`.
- MMR is also guarded and non-fatal: `stage3-rerank.ts:163-218`.
- The main unguarded Stage 3 boundary is the outer `await collapseAndReassembleChunkResults(results)` call in `executeStage3()`: `stage3-rerank.ts:225-231`.

### Stage 4

- Stage 4 is intentionally read-only and asserts that it does not mutate scoring fields: `stage4-filter.ts:6-21`, `stage4-filter.ts:243-345`.
- I did not find race-condition or promise-risk concerns here.
- Its main failure mode would be invariant assertion failure, which would bubble as a hard error.

## Severity Summary

### High

1. **FSRS write-back race across concurrent requests** via non-transactional read-compute-write in `strengthenOnAccess()`: `stage2-fusion.ts:244-280`.
2. **No explicit timeout mechanism in the search pipeline** even though a timeout helper exists elsewhere: `orchestrator.ts:42-78`, `shared/embeddings.ts:426-435`, `shared/embeddings.ts:584-607`.

### Medium

3. **Stage 1 accepts structurally empty non-null embeddings** because it only checks truthiness: `stage1-candidate-gen.ts:239-245`, `stage1-candidate-gen.ts:263-269`, `stage1-candidate-gen.ts:449-454`.
4. **Runtime search failures are not shaped locally by `memory_search`**, which weakens user diagnostics: `memory-search.ts:931-968`, `memory-context.ts:737-773`.

### Low

5. **No clear process-level uncaught promise rejection found**, but Stage 3 / orchestrator / `memory_search` rely on upward propagation rather than stage-local error shaping: `stage3-rerank.ts:225-231`, `orchestrator.ts:42-78`, `memory-search.ts:931-968`.

## Recommended Follow-ups

1. Make FSRS write-back atomic.
2. Add a search-level timeout budget and thread it into Stage 1 embedding calls.
3. Validate embedding dimensionality or at least reject zero-length vectors before vector search.
4. Add a local `memory_search` catch around `executePipeline()` that returns a stage-aware MCP error instead of relying on outer orchestration.
5. Consider surfacing a degraded-mode marker to callers when optional channels fail and search falls back.
