# Iteration 6 (A10): Embedding Visibility, Quality Scorer Chain, and Adversarial Edge Cases

## Focus
Three areas assigned for the final wave:
1. **Q10**: Embedding monitoring -- how many memories can be vector-invisible, what retry/monitoring exists
2. **Q3 completion**: Which quality scorer is actually invoked at runtime -- trace the full import chain
3. **Adversarial edge cases**: What happens with empty payloads, oversized fields, path traversal in triggerPhrases, invalid contextType/importanceTier types, duplicate observations

## Findings

### 1. CONFIRMED: workflow.ts imports the extractors scorer (V2), NOT core scorer
The runtime import chain is definitive:
- `generate-context.ts` line 25: `import { runWorkflow } from '../core/workflow'`
- `workflow.ts` line 39: `import { scoreMemoryQuality as scoreMemoryQualityV2 } from '../extractors/quality-scorer'`
- `workflow.ts` line 1205: `const qualityV2 = scoreMemoryQualityV2({ ... })`
- `workflow.ts` line 1216: `files[ctxFilename] = injectQualityMetadata(files[ctxFilename], qualityV2.score01, qualityV2.qualityFlags)`

The core/quality-scorer.ts even has a comment at line 124 directing users to the extractors version: "Prefer `scoreMemoryQuality` from `extractors/quality-scorer.ts`". **The core scorer is DEAD CODE in the runtime pipeline**, though its calibration tests (`quality-scorer-calibration.vitest.ts` line 5) still import and test the core version, creating a misleading test coverage picture.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:39,1205-1216]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:124-127]

### 2. CONFIRMED: Bonus system makes quality_score nearly always 1.00
From the extractors scorer (the one actually used), the bonus system adds:
- +0.05 for messageCount > 0
- +0.05 for toolCount > 0
- +0.10 for decisionCount > 0
- Total possible bonus: +0.20

Since the starting score is 1.00 and penalties are subtracted (high=0.25, medium=0.15, low=0.05), a single medium penalty (0.15) is fully compensated by having at least 1 message + 1 tool call (0.10 bonus). The only way to get score < 1.00 is to have multiple penalties AND no bonuses (no messages, no tools, no decisions), which is an impossible scenario in practice since every real session has at least messages. **quality_score is effectively a binary 1.00/1.00 for all real sessions.**

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1205-1215]
[INFERENCE: based on bonus structure (+0.20 max) vs penalty structure confirmed in Iter 1-A2]

### 3. DISCOVERED: Embedding retry manager has full infrastructure (REQ-031, CHK-179)
The MCP server has a production-grade retry manager at `mcp_server/lib/providers/retry-manager.ts`:

**Architecture:**
- Background job runs every 5 minutes, processing up to 5 pending items per batch
- Queries `memory_index WHERE embedding_status IN ('pending', 'retry') AND retry_count < 3`
- Exponential backoff: 1min, 5min, 15min between retries
- MAX_RETRIES = 3 before moving to `failed` status
- Circuit breaker: After 5 consecutive provider failures, opens circuit for 2 minutes to avoid hammering API
- Started at server boot via `context-server.ts` line 954

**Monitoring capabilities:**
- `getRetryStats()` returns counts: pending, retry, failed, success, total, queue_size
- `getFailedEmbeddings()` returns all permanently failed memories
- CLI query: `SELECT COUNT(*) FROM memory_index WHERE embedding_status = 'partial'` (line 154 of cli.ts)

**Critical gap: No user-facing monitoring exposure.** The `RetryStats` interface exists but is not surfaced through any MCP tool. The `memory_health` tool does NOT query embedding_status. There is no dashboard, no alert, and no way to check how many memories are vector-invisible without directly querying SQLite.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:86-233]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:951-966]

### 4. DISCOVERED: Deferred embedding creates two-tier invisibility problem
When `asyncEmbedding: true` is used:
1. `embedding-pipeline.ts` line 128-137: If no cache hit, status stays `'pending'` with reason "Deferred: async_embedding requested"
2. The memory IS saved to `memory_index` with `embedding_status='pending'`
3. It is searchable via BM25/FTS5/trigger channels, but INVISIBLE to vector search
4. Background retry picks it up within 5 minutes (next batch run)
5. If embedding provider is down, circuit breaker delays further

However, the standard `memory_index_scan` path (which `generate-context.js` recommends after save) uses synchronous embedding by default (`asyncEmbedding: false`). So the deferred path only affects explicit `asyncEmbedding: true` API calls and scan operations with the async flag.

**Net assessment**: For the normal `generate-context.js -> memory_save/memory_index_scan` path, embeddings are synchronous. The pending state is a transient risk only when embedding provider fails or when async mode is explicitly chosen.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:116-184]

### 5. ADVERSARIAL: Empty JSON payload `{}` -- ACCEPTED with degraded output
`validateInputData({}, null)` at line 621-703:
- `typeof data !== 'object' || data === null` -- passes (it's an object)
- specFolder check: only errors if `specFolderArg === null` AND no specFolder AND no userPrompts/observations/recentContext -- **this fires**, throws "Missing required field: specFolder"
- But if a CLI spec-folder arg is provided: `validateInputData({}, 'specs/001/')` -- **passes entirely**
- `normalizeInputData({})` then creates empty arrays for all fields
- Result: An empty memory file with only template boilerplate is written

**Impact**: Spec folder with CLI arg + empty JSON = valid but useless memory. No minimum content validation exists.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:621-703]

### 6. ADVERSARIAL: No length limits on ANY string field
The `validateInputData` function checks:
- Type correctness (arrays must be arrays, etc.)
- importanceTier must be a valid enum value
- FILES must have FILE_PATH or path

It does NOT check:
- **sessionSummary length** -- a 100KB string passes silently
- **triggerPhrases element length** -- no max length per phrase
- **triggerPhrases array size** -- 10,000 phrases pass validation
- **observations array size** -- unbounded
- **keyDecisions count** -- unbounded
- **Individual string lengths** anywhere in the schema

The `RawInputData` interface has `[key: string]: unknown` index signature (line 97), meaning ANY additional field name is accepted silently. Combined with no length limits, the pipeline has zero protection against oversized payloads that could cause memory exhaustion or produce enormous memory files.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:71-98, 621-703]

### 7. ADVERSARIAL: Path traversal in triggerPhrases -- NOT sanitized
The `validateInputData` function only checks that `triggerPhrases` is an array. Individual phrase strings are not sanitized. A phrase like `"../../etc/passwd"` or `"<script>alert('xss')</script>"` would pass validation and be written directly into the YAML frontmatter as `trigger_phrases`.

However, downstream impact is limited because:
1. Trigger phrases are only used for BM25/FTS5 text matching, not file system operations
2. The YAML frontmatter is written using a template renderer that quotes strings
3. The MCP server's trigger matcher does string comparison, not path resolution

**Risk is LOW for code execution but HIGH for search pollution** -- malicious phrases could game the BM25 ranking by injecting high-value search terms.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:634-639]
[INFERENCE: based on trigger phrase flow through template renderer to YAML frontmatter to BM25 index]

### 8. ADVERSARIAL: importanceTier with numeric value -- CAUGHT by validation
The validator at line 663-669 checks `validTiers.includes(data.importanceTier)`. Since `includes()` uses strict equality, a numeric value like `42` would not match any string in the validTiers array, producing an error: "Invalid importanceTier: 42. Valid values: constitutional, critical, ...". **This is correctly handled.**

However, `contextType` has NO validation at all. Any string passes, and no enum check exists for contextType values. The field is propagated as-is through both the fast path and slow path (lines 602-606).

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:663-669, 602-606]

### 9. ADVERSARIAL: Duplicate observations -- ONLY intra-document dedup
From prior iterations (Q6 answer), observation dedup is intra-document only via the contamination filter. There is no dedup at the `validateInputData` or `normalizeInputData` level. If the AI submits 50 identical observations, all 50 pass through validation, all 50 are normalized, and all 50 appear in the rendered memory. The contamination filter may remove duplicates of its own patterns, but semantically identical observations are not deduplicated.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:686-690]
[INFERENCE: from Q6 answer in strategy.md + absence of dedup logic in normalizer]

### 10. SYNTHESIS: Quality scorer test coverage is misleading
The test file `quality-scorer-calibration.vitest.ts` imports from `../core/quality-scorer` (line 5), which is the LEGACY scorer that is NOT used at runtime. The actual runtime scorer (`extractors/quality-scorer.ts`) is tested in `test-memory-quality-lane.js` (line 11: `require(path.join(DIST_DIR, 'extractors', 'quality-scorer.js'))`). This means:
- The Vitest calibration suite validates the WRONG scorer
- The JS integration test validates the RIGHT scorer but uses a different test framework
- Changes to the extractors scorer could break production while Vitest calibration tests pass

[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts:5]
[SOURCE: .opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:11]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` lines 39, 1205-1216 (scorer import chain)
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` line 124 (deprecation comment)
- `.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` lines 1-240 (full retry infrastructure)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` lines 83-84, 951-966 (retry bootstrap)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` lines 116-184 (async embedding path)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` lines 71-703 (validation + normalization)
- `.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts` line 5 (wrong import)
- `.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js` line 11 (correct import)

## Assessment
- New information ratio: 0.75
- Questions addressed: Q10, Q3 (completion), adversarial edge cases (6 sub-questions)
- Questions answered: Q10 (fully), Q3 (fully completed)

## Reflection
- What worked and why: Direct import chain tracing (generate-context.ts -> workflow.ts -> extractors/quality-scorer.ts) was the fastest way to definitively answer Q3. Following the `retryManager` import from context-server.ts to the full implementation file revealed the complete retry infrastructure for Q10.
- What did not work and why: Initial grep for "embedding_status" returned too much noise (85KB), requiring careful filtering. The input-normalizer file required reading in two separate chunks due to size.
- What I would do differently: For adversarial analysis, I would prepare specific test inputs and trace them through the pipeline end-to-end rather than reading the validator code statically. This would catch runtime coercion behaviors that are invisible in source analysis.

## Recommended Next Focus
This is the final iteration. Key synthesis recommendations:
1. **P0**: Surface `RetryStats` through `memory_health` tool so users can detect vector-invisible memories
2. **P0**: Add minimum content validation to `validateInputData` (reject empty payloads with CLI spec-folder)
3. **P1**: Add string length limits to validation (sessionSummary, triggerPhrases, observations)
4. **P1**: Fix quality-scorer-calibration.vitest.ts to import from extractors/ instead of core/
5. **P2**: Add contextType enum validation (currently accepts any string)
6. **P2**: Consider removing the bonus system or recalibrating penalties so quality_score has discriminative power
