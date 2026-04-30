# Iteration 002 - Q5 memory_context truncation telemetry and fallback root cause

## Focus

Q5: explain why `memory_context` can report `count:0,results:[]` at roughly 2 percent token-budget usage while direct `memory_search` returns hits for the same general topic. The target was the wrapper truncation path, not the already-answered Q1 daemon rebuild/restart question.

## Actions Taken

1. Read Iteration 001 to avoid reopening Q1.
2. Searched the MCP runtime for `memory_context`, token-budget enforcement, zero-result fallback, and post-dispatch budget wrappers.
3. Inspected `handlers/memory-context.ts`, `context-server.ts`, `hooks/memory-surface.ts`, layer budget definitions, and the 005/006 reproduction notes.
4. Compared the historical `memory-context.ts` fallback path from `33823d006b^` with the current source.

## Findings

### 1. The 2 percent figure is post-truncation telemetry, not proof the original payload was under budget

The current handler computes `actualTokens` before enforcement and returns immediately when `actualTokens <= budgetTokens` (`mcp_server/handlers/memory-context.ts:447-462`). It also has a later sanity guard for impossible low-ratio enforcement (`memory-context.ts:464-479`).

The historical bad behavior makes sense because the fallback branch reports the token count of the fallback payload, not the original payload that triggered enforcement. In the pre-fix version, after structural truncation failed, `fallbackTokens = estimateTokens(JSON.stringify(fallbackResult))` was assigned to `enforcement.actualTokens` (`git show 33823d006b^:.../memory-context.ts:570-581`). If `fallbackResult` was a tiny `{"count":0,"results":[]}` envelope, telemetry could honestly show `65 / 3500` while the original wrapped response had exceeded budget earlier.

This reframes the symptom: "truncated at 2 percent" is misleading. The handler likely overflowed on the outer serialized `memory_context` response, then zero-filled, then reported the tiny post-fallback size.

### 2. The root code path was the zero-fill fallback ladder inside `memory_context`, not the underlying search

005 records the exact broken response: `memory_context({input:"Semantic Search", mode:"auto"})` returned `meta.tokenBudgetEnforcement.{enforced:true, truncated:true, returnedResultCount:2}` while `data.content[0].text` contained `{"count":0,"results":[]}` (`005-memory-search-runtime-bugs/spec.md:113-114`). The 006 live probes repeated the same shape with `actualTokens:65 / 3500`, `returnedResultCount:3`, and empty payload (`001-search-intelligence-stress-test/scratch/live-probes-2026-04-26.md:9-17`).

Direct `memory_search` bypassed the wrapper and returned the expected hits, including the CocoIndex integration packet (`live-probes-2026-04-26.md:19-27`). That isolates the bug to the L1 `memory_context` wrapping/enforcement layer.

### 3. The historical fallback ladder preferred empty envelopes

In the older handler snapshot, `fallbackToStructuredBudget()` tried only empty `data.count = 0, results = []` inner states before returning a final empty payload (`git show 33823d006b^:.../memory-context.ts:360-385`). The same historical function then returned enforcement metadata with `returnedResultCount` left at the earlier survivor count (`git show 33823d006b^:.../memory-context.ts:572-581`). That explains the mismatch: metadata said survivors existed, but the emitted nested payload had already been replaced with an empty envelope.

Current source has moved in the right direction: it tracks `preservedAfterStructural` (`memory-context.ts:688-755`), builds preserved-result candidates before empty candidates (`memory-context.ts:500-585`), and re-extracts `fallbackReturnedCount` from the emitted fallback payload (`memory-context.ts:812-835`). Those changes address the count mismatch and reduce the chance of zero-fill when survivors exist.

### 4. A second outer budget pass exists, but it is not the Q5 zero-fill path

After the handler returns, `context-server.ts` adds metadata and enforces a layer budget by popping `envelope.data.results` when present (`context-server.ts:1115-1175`). For `memory_context`, the retrievable hits live inside `envelope.data.content[0].text`, not directly in `envelope.data.results`, so this pass generally cannot zero-fill the nested search results. It can add misleading token-budget metadata or warnings, but the observed `data.content[0].text = {"count":0,"results":[]}` originates inside `handlers/memory-context.ts`.

`hooks/memory-surface.ts` also has an auto-surface budget enforcer that drops hook payloads when over budget (`hooks/memory-surface.ts:250-300`), but it operates on `triggered` and `constitutional` auto-surface arrays, not the nested `memory_search` result payload. It is adjacent risk, not the Q5 root cause.

## Questions Answered

### Q5 root cause

The wrapper did not literally decide to truncate because the response was 2 percent of budget. It entered enforcement because the full serialized outer `memory_context` envelope exceeded the mode/layer budget. When structural compaction could not make that envelope fit, the fallback ladder replaced the inner `memory_search` payload with `count:0,results:[]`. The telemetry then reported the token count of that tiny fallback payload, creating the apparent 2 percent contradiction.

### Q5 fix protocol

The canonical fix is three-part:

1. Track both `preEnforcementTokens` and `returnedTokens`; never label post-fallback size as the only `actualTokens`.
2. Preserve at least one survivor as metadata-only before trying any zero-result fallback. Empty fallback should require an explicit `droppedAllResultsReason`.
3. Derive `returnedResultCount` from the final emitted nested payload, not from the pre-fallback survivor list.

Current source implements most of points 2 and 3. Point 1 remains recommended because future probes should distinguish "original envelope overflowed" from "returned payload is tiny after truncation".

## Questions Remaining

- Q2: cocoindex mirror-folder duplicates.
- Q3: cocoindex source-vs-markdown ranking imbalance.
- Q4: weak retrieval hallucination guardrails.
- Q6: empty/stale code graph recovery.
- Q7: supersedes-heavy causal-edge growth.
- Q8: broader intent classifier consistency.

## Next Focus

Q2: investigate cocoindex mirror-folder duplicates and recommend canonical-source filtering or ranking controls so `.gemini/specs/`, `.claude/specs/`, `.codex/specs/`, `specs/`, and `.opencode/specs/` mirrors do not dominate the same response.
