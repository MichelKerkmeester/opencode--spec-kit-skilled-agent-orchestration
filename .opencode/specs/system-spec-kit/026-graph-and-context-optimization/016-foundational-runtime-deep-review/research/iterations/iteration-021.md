# Iteration 21 — Domain 2: State Contract Honesty (1/10)

## Investigation Thread
I re-read the five requested state-honesty seams, then filtered out source-local collapses already documented in Iterations 003, 008, 009, 011, 017, 018, and 020. This pass kept only the second-hop places where those collapsed states are re-serialized into stronger-looking runtime or API contracts.

## Findings

### Finding R21-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`
- **Lines:** `311-322, 569-573`
- **Severity:** P1
- **Description:** The public `memory_save` response collapses post-insert truth even further than `post-insert.ts` does. `memory-save.ts` still has both `enrichmentStatus` and `executionStatus`, but `response-builder.ts` serializes only the coarse `postInsertEnrichment` execution status and converts all step-level nuance into at most one generic warning string. Once the response leaves the server, callers can no longer tell whether enrichment was deferred, partially failed, skipped by a guard, or produced a zero-work no-op.
- **Evidence:** `memory-save.ts:2362-2383` passes both `enrichmentStatus` and `executionStatus` into `buildIndexResult(...)`. `response-builder.ts:311-322` stores only `result.postInsertEnrichment = enrichmentExecutionStatus` and reduces any `false` booleans to `warnings.push("Partial enrichment: ... failed")`. `response-builder.ts:569-573` emits only `response.postInsertEnrichment` to clients. The tests lock in that reduced surface: `tests/post-insert-deferred.vitest.ts:50-81` asserts only the deferred status plus hint, while `tests/handler-memory-save.vitest.ts:547-556,2287-2307` repeatedly stub the post-insert result as all-true success.
- **Downstream Impact:** MCP clients and follow-up automation lose the exact failure/skip reason for each enrichment lane, so they cannot distinguish "run backfill," "retry a failed stage," and "accept a legitimate no-op" without scraping logs or re-running work.

### Finding R21-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `83-87`
- **Severity:** P1
- **Description:** `hook-state.ts` treats any parseable JSON blob as a valid `HookState`, and that unvalidated object feeds two different downstream control paths: prompt replay and autosave routing. A syntactically valid but schema-drifted state file therefore does not just poison cached context quality; it becomes authoritative input for both what Claude shows the model after compaction and where the stop hook writes continuity.
- **Evidence:** `hook-state.ts:83-87` does `JSON.parse(raw) as HookState` with no runtime validation. Claude compact replay immediately threads `pendingCompactPrime.payloadContract?.provenance.*` into `wrapRecoveredCompactPayload(...)` at `hooks/claude/session-prime.ts:44-70`, making the loaded state prompt-visible. The stop hook separately loads the same file and uses `lastSpecFolder` plus `sessionSummary.text` to build the `generate-context.js` payload at `hooks/claude/session-stop.ts:60-80`; state mutation for that same file happens through `updateState(...)` at `hooks/claude/session-stop.ts:120-125`. Coverage only exercises happy-path persistence and wrapper formatting, not drifted-but-parseable state feeding live consumers: `tests/hook-state.vitest.ts:86-223`, `tests/hook-session-start.vitest.ts:78-88`, and `tests/hook-session-stop-replay.vitest.ts:14-40` (autosave disabled).
- **Downstream Impact:** One malformed temp-state file can both forge prompt-visible provenance during compact recovery and redirect end-of-session continuity saves into the wrong packet, turning an unvalidated cache artifact into a control-plane input.

### Finding R21-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `223-233, 264-275, 1015-1019`
- **Severity:** P1
- **Description:** The schema-invalid-as-legacy collapse is not confined to validation. Once a malformed modern `graph-metadata.json` is accepted through the legacy fallback, the explicit refresh path treats that payload as ordinary existing metadata, merges against it, and writes it back out as canonical current JSON. That launders a broken modern file into a clean-looking refreshed artifact with no legacy or repair marker.
- **Evidence:** `validateGraphMetadataContent()` retries primary-parse failures through `parseLegacyGraphMetadataContent(...)` and returns `{ ok: true, metadata, errors: [] }` when that legacy candidate validates (`graph-metadata-parser.ts:223-233`). `loadGraphMetadata()` trusts that success path as authoritative existing metadata (`graph-metadata-parser.ts:264-275`). `refreshGraphMetadataForSpecFolder()` then loads `existing`, merges it with freshly derived metadata, and rewrites the file (`graph-metadata-parser.ts:1015-1019`); the public follow-up API is a thin wrapper around that writer path (`api/indexing.ts:95-97`). Existing tests cover only isolated legacy acceptance and happy-path refresh of already-valid metadata, not the laundering path (`tests/graph-metadata-schema.vitest.ts:223-245`; `tests/graph-metadata-integration.vitest.ts:107-113`).
- **Downstream Impact:** A repair or follow-up refresh can silently convert malformed checked-in graph metadata into a current-schema file that looks intentionally authored, erasing the evidence that the original file was invalid and making drift harder to detect in later indexing and review passes.

## Novel Insights
The net-new pattern was not another local boolean or fallback branch; it was **state laundering across boundaries**. In all three cases, a collapsed producer state becomes harder to recover from once a downstream layer re-emits it as a stronger contract: save responses drop step detail, hook state drives both prompt text and write targeting, and legacy graph metadata is rewritten as canonical JSON.

## Next Investigation Angle
Stay in Domain 2 but move from producer/rewriter seams to the remaining read-side consumers: compare how `code-graph/query.ts` readiness fallback and `startup-brief.ts` graph trust collapse are interpreted by their first real callers, especially where `status: "ok"` or `trustState: "stale"` is treated as sufficient evidence despite an underlying `empty` or failed-precondition state.
