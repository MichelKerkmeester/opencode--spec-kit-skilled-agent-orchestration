# Iteration 005 - Q5 memory_context truncation source validation

## Focus

Q5: validate the `memory_context` truncation root cause against current source and tests, without reopening the already-answered Q1 daemon rebuild/restart question. Iteration 002 already explained the main symptom; this pass adds source-line evidence, residual risk, and a sharper verify protocol for the wrapper.

## Actions Taken

1. Read the current deep-research state and strategy files, plus the missing target artifact paths.
2. Read Iteration 002 to avoid duplicating the prior Q5 analysis.
3. Inspected current `memory_context` budget enforcement, the dispatch-level budget pass, the 005 requirement/implementation notes, and token-budget regression tests.
4. Compared the current source behavior with the 005 REQ-002 acceptance criterion and the observed `actualTokens:71 / budgetTokens:3000` zero-result symptom.

## Findings

### 1. Q5's "2 percent budget" symptom is still best explained as post-fallback telemetry

The 005 requirement records the broken shape: `memory_context({input:"Semantic Search", mode:"auto"})` returned `returnedResultCount:2`, `actualTokens:71`, `budgetTokens:3000`, while the nested payload was `{"count":0,"results":[]}` (`005-memory-search-runtime-bugs/spec.md:111-114`). The implementation summary says the intended repair was twofold: preserve structural survivors before zero-fill and re-derive returned-count metadata from the final emitted payload (`005-memory-search-runtime-bugs/implementation-summary.md:61-64`).

Current source supports Iteration 002's conclusion. `enforceTokenBudget()` measures the full serialized wrapper first and exits only when `actualTokens <= budgetTokens` (`mcp_server/handlers/memory-context.ts:447-462`). If enforcement continues, the final fallback metadata uses `fallbackTokens = estimateTokens(JSON.stringify(fallbackResult))` as `actualTokens` (`memory-context.ts:810-835`). That means the tiny 2 percent telemetry can describe the returned fallback envelope, not the larger original envelope that caused enforcement.

### 2. The current source has the claimed survivor-preservation fix, but zero-fill remains the last fallback

The repair is present in source. The fallback ladder builds preserved candidates before empty candidates (`memory-context.ts:500-585`), snapshots `preservedAfterStructural` before secondary compaction (`memory-context.ts:691-755`), passes those survivors into `fallbackToStructuredBudget()` (`memory-context.ts:800-808`), and re-extracts `fallbackReturnedCount` from the actual nested fallback payload (`memory-context.ts:812-835`).

The residual edge is that the ladder still contains three empty fallback candidates (`memory-context.ts:551-580`) and a final unconditional empty payload (`memory-context.ts:607-614`). That is defensible only for impossible budgets where even metadata-only survivors cannot fit. The runtime should make that explicit with fields like `preEnforcementTokens`, `returnedTokens`, and `droppedAllResultsReason`, otherwise future probes can misread a post-fallback tiny payload as an under-budget original response.

### 3. Dispatch-level budget enforcement is adjacent, not the Q5 nested-zero root

The outer dispatch pass in `context-server.ts` only truncates when `envelope.data.results` is an array (`context-server.ts:1143-1168`). `memory_context` wraps search output inside `data.content[0].text`, so this pass can add token-budget metadata or warning hints but generally cannot create the nested `data.content[0].text = {"count":0,"results":[]}` symptom. That keeps the root cause in `handlers/memory-context.ts`, not the server-wide budget decorator.

### 4. Test coverage verifies the broad fix but misses the exact empty-payload invariant

`token-budget-enforcement.vitest.ts` now asserts large over-budget responses keep at least one returned result (`token-budget-enforcement.vitest.ts:73-96`) and oversized single-result payloads compact to one returned result (`token-budget-enforcement.vitest.ts:135-163`). `memory-context.vitest.ts` verifies truncation fires and preserves highest-scored ordering (`memory-context.vitest.ts:890-945`).

The remaining gap is visible in `T206`: the comment says a zero budget "can't truncate below 1", but the assertion only checks `actualTokens > 0`; it does not parse the payload or assert `data.count >= 1` / `returnedResultCount >= 1` (`memory-context.vitest.ts:956-969`). Given the live bug was exactly a metadata/payload mismatch, regression coverage should parse the final nested envelope for every truncation case and compare `meta.tokenBudgetEnforcement.returnedResultCount` to `data.results.length`.

## Questions Answered

### Q5 root cause

The wrapper zeroed results because the structured fallback ladder could replace the nested `memory_search` payload with `count:0,results:[]` after the original outer `memory_context` envelope exceeded budget. The apparent "2 percent budget" contradiction is telemetry from the already-reduced fallback payload, not proof that the original response was safely under budget.

### Q5 recommended wrapper fix

Keep the existing survivor-preservation path, but make the contract stricter:

1. Track both `preEnforcementTokens` and `returnedTokens`; do not expose post-fallback size as the only `actualTokens`.
2. Treat empty fallback as a last-resort error-like degradation with `droppedAllResultsReason`, never as an ordinary truncation success.
3. Add a helper that parses the final emitted nested envelope and enforces `returnedResultCount === data.results.length`.
4. Expand tests so every over-budget case parses the returned payload, including impossible-budget cases, and asserts whether empty output is allowed.

## Questions Remaining

- Q4: weak retrieval hallucination guardrails.
- Q6: empty/stale code graph recovery.
- Q7: supersedes-heavy causal-edge growth.
- Q8: broader intent classifier consistency.

Q2 and Q3 have source-backed recommendations from Iterations 003 and 004. Q5 now has both root-cause and residual verification guidance.

## Next Focus

Q4: investigate the weak-retrieval hallucination class and define a runtime response contract for `requestQuality:"weak"` with empty `recovery.suggestedQueries`, so clients refuse or ask for disambiguation instead of fabricating spec packets and file paths.
