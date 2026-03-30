# Iteration 2: Token Budget and Result Truncation Optimization

## Focus

This iteration traced where `memory_search` result counts are reduced between Stage 4, `hybrid-search`, the handler formatter, progressive disclosure, and final MCP envelope enforcement. I also queried the active SQLite DB and used the dist formatter to measure what different token budgets actually return for a representative 7-result response.

## Findings

1. `stage4-filter.ts` is not the token-budget bottleneck.

   Stage 4 only does memory-state filtering plus a final `limit` slice. It never estimates tokens and never applies a response budget. The relevant code paths are `filterByMemoryState(...)` and the post-filter `workingResults = workingResults.slice(0, config.limit)` cap in both source and dist: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:255-259`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:305-309`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:197-200`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:234-238`. If 7 candidates become 1, the cause is downstream budget enforcement, not Stage 4, unless the caller explicitly set `limit=1`.

2. The current stack has two independent token-budget layers, and `1500` shows up in both of them.

   The tool layer assigns `memory_search` to L2 with a fixed `1500`-token budget in the schema and layer definitions: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:46-49`, `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:176-190`. The search layer separately assigns `simple=1500`, `moderate=2500`, `complex=4000` in `dynamic-token-budget`, then applies that budget inside `hybrid-search` unless `evaluationMode` is true: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:38-48`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:69-89`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1028-1043`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1597-1619`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2332-2438`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/dynamic-token-budget.js:12-21`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/dynamic-token-budget.js:39-55`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/hybrid-search.js:673-688`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/hybrid-search.js:1176-1199`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/hybrid-search.js:1791-1874`.

   `lib/response/envelope.ts` only synchronizes `meta.tokenCount`; it does not enforce the budget. Actual envelope trimming happens later in `context-server.ts`, which parses the fully formatted envelope, sets `meta.tokenBudget`, then repeatedly `pop()`s from `data.results` until the payload fits: `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:103-119`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/response/envelope.js:8-21`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379-433`, `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js:268-323`.

3. `memory-search.ts` adds progressive disclosure as a sidecar, not as the primary response shape, so it currently increases payload size instead of protecting it.

   The handler first builds the normal formatted envelope and only then appends `data.progressiveDisclosure = buildProgressiveResponse(...)`: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784-824`, `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:520-545`. Progressive disclosure itself stores the full result set in memory, returns only the first page of snippets (`DEFAULT_PAGE_SIZE = 5`, `SNIPPET_MAX_LENGTH = 100`), and serves later pages from a cursor-bound in-memory store: `.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:17-27`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:301-343`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:357-469`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/progressive-disclosure.js:15-22`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/progressive-disclosure.js:224-254`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/progressive-disclosure.js:268-357`. Cursor continuation is cheap because it returns snippet results only: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:457-482`, `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-search.js:232-256`.

4. `1500` is too aggressive for the default `memory_search` envelope, and it exactly explains the “7 results available, 1 shown” symptom once trace/debug metadata is present.

   I queried the active DB and then measured a representative 7-row formatted response with the dist formatter plus the same token estimator used by the server. SQL evidence:

   ```sql
   SELECT COUNT(*), ROUND(AVG(LENGTH(content_text))/4.0,1), ROUND(AVG(LENGTH(summary_text))/4.0,1)
   FROM memory_index mi
   LEFT JOIN memory_summaries ms ON ms.memory_id = mi.id
   WHERE mi.content_text IS NOT NULL AND mi.content_text != '';
   -- 1002 | 1904.2 | 20.5
   ```

   ```sql
   SELECT ROUND(AVG(LENGTH(spec_folder))/4.0,1),
          ROUND(AVG(LENGTH(file_path))/4.0,1),
          ROUND(AVG(LENGTH(title))/4.0,1),
          ROUND(AVG(LENGTH(trigger_phrases))/4.0,1)
   FROM memory_index
   WHERE content_text IS NOT NULL AND content_text != '';
   -- 19.5 | 43.5 | 16.5 | 18.4
   ```

   The formatter measurements for a representative 7-result envelope were:

   - Base 7 results, no trace: `1779` tokens
   - Same 7 results with typical `stateStats`/`featureFlags`/`pipelineMetadata`: `1975` tokens
   - Same 7 results plus `progressiveDisclosure`: `2346` tokens
   - Same 7 results with trace: `3482` tokens
   - Same 7 results with trace plus `progressiveDisclosure`: `3852` tokens

   The exact context-server-style pop-from-tail simulation on that same 7-result envelope produced:

   - No trace + progressive sidecar: `1500 -> 3 results`, `2000 -> 5 results`, `2500 -> 7 results`
   - Trace + progressive sidecar: `1500 -> 1 result`, `2000 -> 2 results`, `2500 -> 3 results`, `3000 -> 5 results`, `3500 -> 6 results`, `4000 -> 7 results`

   That makes the current L2 tool budget the main reason the response collapses after formatting, and it also shows why the user can plausibly observe “7 found, 1 shown” when `includeTrace=true` or similarly heavy metadata is attached.

5. The cheapest way to return more results without blowing context is to use summaries or snippet-tier paging for tail results instead of full hydrated result objects.

   SQL evidence:

   ```sql
   SELECT COUNT(*) FILTER (WHERE summary_text IS NOT NULL AND summary_text != ''),
          COUNT(*)
   FROM memory_index mi
   LEFT JOIN memory_summaries ms ON ms.memory_id = mi.id
   WHERE mi.content_text IS NOT NULL AND mi.content_text != '';
   -- 792 | 1002
   ```

   ```sql
   SELECT ROUND(AVG(LENGTH(content_text))/4.0,1),
          ROUND(AVG(LENGTH(SUBSTR(content_text,1,100)))/4.0,1),
          ROUND(AVG(LENGTH(summary_text))/4.0,1),
          ROUND(MAX(LENGTH(summary_text))/4.0,1)
   FROM memory_index mi
   LEFT JOIN memory_summaries ms ON ms.memory_id = mi.id
   WHERE mi.content_text IS NOT NULL AND mi.content_text != '';
   -- 1904.2 | 25.0 | 20.5 | 66.3
   ```

   On rows that already have summaries, average full content is `2370.4` tokens while average stored summary is `20.5` tokens. That is roughly a `115x` reduction. A 100-character snippet averages `25.0` tokens. So the system already has two tail-friendly representations that are dramatically cheaper than keeping full result envelopes and then deleting them at the very end.

## Concrete Recommendations

1. Raise the tool-layer `memory_search` budget from `1500` to `2500` for the default non-trace path.
   Expected impact: a representative 7-result response with `progressiveDisclosure` fits without context-server truncation (`7 returned` instead of `3`).

2. Make the tool-layer budget response-shape aware instead of using one L2-wide constant.
   Expected impact: use a base of `2500` for default `memory_search`, then add a trace/debug uplift to `3500-4000` when `includeTrace=true` or `profile=debug`, which avoids the current `7 -> 1` collapse on traced responses.

3. Stop double-truncating the same request.
   Expected impact: either rebalance the search-layer dynamic budget to something like `simple=2500`, `moderate=3500`, `complex=4500`, or disable `hybrid-search` token truncation for `memory_search` when the tool-layer envelope budget will still run. One owner of truncation makes counts predictable and removes hidden recall loss.

4. Make progressive disclosure the primary response shape, not an additive sidecar.
   Expected impact: return only the first page of hydrated results in `data.results`, move the remainder behind the cursor/snippet path, and keep the full result set server-side. That reduces first-response size instead of adding ~`370` tokens of side metadata that still gets penalized by the tool budget.

5. Use `memory_summaries.summary_text` for tail results before dropping them.
   Expected impact: non-top results become ~`20.5` tokens each on average instead of ~`2370.4`, so the system can preserve recall/context about additional hits without embedding full file content or heavy hydrated result objects.

6. Keep `context-server` tail-popping as a safety net, not as the primary `memory_search` shaping strategy.
   Expected impact: handler-aware shaping can account for `includeTrace`, `profile`, `progressiveDisclosure`, and summary availability; the generic final `pop()` loop should only catch rare overflows, not define the normal UX.

## New Information Ratio

0.66
