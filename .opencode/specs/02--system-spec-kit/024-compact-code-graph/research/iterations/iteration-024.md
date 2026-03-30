# Iteration 024: Token Budget & Truncation Mechanisms

## Focus
Trace how token budgets and truncation work across the current Spec Kit Memory MCP runtime, with special attention to:

- the fixed `COMPACTION_TOKEN_BUDGET` used by lifecycle hooks
- the dynamic per-query budget computed in `dynamic-token-budget.ts`
- the score-gap truncation logic in `confidence-truncation.ts`
- the exact truncation order and token-counting method used when compaction context must stay within 4000 tokens

## Findings
1. `COMPACTION_TOKEN_BUDGET` is a fixed hook-level constant, not a dynamic setting. It is defined as `4000` in `memory-surface.ts`, documented as the compaction hook max, exported from the module, and passed directly into `autoSurfaceMemories(..., COMPACTION_TOKEN_BUDGET, 'compaction')` by `autoSurfaceAtCompaction()`. The compaction path is invoked from `context-server.ts` specifically when `memory_context` runs in `resume` mode. Sources: `mcp_server/hooks/memory-surface.ts:52-55`, `mcp_server/hooks/memory-surface.ts:283-316`, `mcp_server/hooks/memory-surface.ts:323-336`, `mcp_server/context-server.ts:325-339`.

2. The 4000-token compaction limit is enforced at the hook output boundary by `enforceAutoSurfaceTokenBudget()`, not by `autoSurfaceAtCompaction()` itself. That helper serializes the candidate payload with `JSON.stringify(candidate)`, measures it with `estimateTokenCount(...)`, and repeatedly shrinks the payload until it fits or must be dropped entirely. If it still exceeds the limit after all trimming, it logs a warning and returns `null`. This means the compaction contract is "fit within budget or emit nothing," not "emit a best-effort oversized payload." Sources: `mcp_server/hooks/memory-surface.ts:136-185`, `shared/utils/token-estimate.ts:5-13`.

3. `dynamic-token-budget.ts` is advisory budget selection logic for hybrid search, not a self-enforcing limiter. The module defines a `TokenBudgetConfig` with `simple`, `moderate`, and `complex` budgets, plus `DEFAULT_BUDGET = 4000` and `DEFAULT_TOKEN_BUDGET_CONFIG = { simple: 1500, moderate: 2500, complex: 4000 }`. `getDynamicTokenBudget(tier, config?)` returns `{ tier, budget, applied }`; if `SPECKIT_DYNAMIC_TOKEN_BUDGET` is disabled it falls back to `4000` for every tier with `applied: false`, and if enabled it maps the query tier to the configured number. The module comment explicitly says downstream callers are responsible for actually respecting the returned budget. Sources: `mcp_server/lib/search/dynamic-token-budget.ts:4-9`, `mcp_server/lib/search/dynamic-token-budget.ts:18-48`, `mcp_server/lib/search/dynamic-token-budget.ts:54-90`, `mcp_server/lib/search/search-flags.ts:113-119`.

4. Hybrid search uses the dynamic budget after ranking, not during retrieval fan-out. In `hybrid-search.ts`, Stage E computes `budgetResult = getDynamicTokenBudget(routeResult.tier)`. Later, if `evaluationMode` is false, the pipeline computes `headerOverhead`, subtracts it from `budgetResult.budget` to derive `adjustedBudget`, stores both in metadata, and then calls `truncateToBudget(reranked, adjustedBudget, ...)`. This is real enforcement, but it happens in `hybrid-search.ts`, not in `dynamic-token-budget.ts`. When `evaluationMode` is true, the pipeline skips token-budget truncation entirely and applies only a plain result-count limit instead; that matches the repo memory guidance that evaluation runs should avoid budget/truncation distortions. Sources: `mcp_server/lib/search/hybrid-search.ts:1028-1043`, `mcp_server/lib/search/hybrid-search.ts:1594-1618`, `MEMORY.md:155-159`, `MEMORY.md:171-172`.

5. `confidence-truncation.ts` truncates by looking for a relevance cliff in descending scores. The algorithm filters out non-finite scores, sorts the remaining results descending by `score`, computes consecutive score gaps, computes the median gap, and then looks for the first gap after the guaranteed minimum results window where `gap > 2 * medianGap`. If such a gap exists, it keeps results up to that cutoff index inclusive; otherwise it returns everything. Default `minResults` is `3`, and the threshold multiplier is fixed at `2`. This truncation is score-based only; it does not inspect tokens, constitutional tier, or content size. Sources: `mcp_server/lib/search/confidence-truncation.ts:28-40`, `mcp_server/lib/search/confidence-truncation.ts:52-78`, `mcp_server/lib/search/confidence-truncation.ts:82-199`, `mcp_server/tests/confidence-truncation.vitest.ts:138-152`, `mcp_server/tests/confidence-truncation.vitest.ts:194-245`.

6. Constitutional memory gets priority in compaction truncation because the payload shape and trim order are asymmetric. `autoSurfaceMemories()` always builds the result object with `constitutional` first and `triggered` second. `getConstitutionalMemories()` queries only constitutional rows, orders them by `created_at DESC`, and caps them at 10. If the serialized payload is too large, `enforceAutoSurfaceTokenBudget()` pops `triggered` entries first; only after all triggered entries are exhausted does it start popping `constitutional` entries. Because constitutional rows are newest-first, popping from the array tail preserves the newest constitutional memories longest. In practice, constitutional memories are therefore both surfaced first and trimmed last. Sources: `mcp_server/hooks/memory-surface.ts:90-119`, `mcp_server/hooks/memory-surface.ts:159-171`, `mcp_server/hooks/memory-surface.ts:188-223`.

7. There are two different truncation orders in the runtime, and they should not be conflated:
   - In the compaction hook, overflow order is: measure whole payload -> remove `triggered` matches from the end until fit -> remove `constitutional` entries from the end until fit -> return `null` if still too large. Sources: `mcp_server/hooks/memory-surface.ts:145-185`.
   - In hybrid search, the order is: rerank results -> optionally run confidence truncation -> compute header overhead -> greedily truncate to the token budget using highest-score-first acceptance. This budget truncation sorts results by score descending, estimates per-result token cost, accumulates until the budget is exhausted, and falls back to one summarized or unsummarized top result if necessary. Sources: `mcp_server/lib/search/hybrid-search.ts:1520-1546`, `mcp_server/lib/search/hybrid-search.ts:1598-1618`, `mcp_server/lib/search/hybrid-search.ts:2322-2435`.

8. Token counting is heuristic, not model-exact. The shared canonical helper `estimateTokenCount(text)` uses `Math.ceil(text.length / 4)` and returns `0` for empty or invalid input; there is no `tiktoken` import or model-specific tokenizer in the files examined. The compaction hook measures `estimateTokenCount(JSON.stringify(payload))`. Hybrid-search budget truncation uses a more structured estimator that counts serialized field sizes recursively and then still converts chars to tokens with `/4`. So the system uses character-based approximation throughout, with two shapes of estimator: full JSON string length for hook payloads, and field-aware size estimation for search results. Sources: `shared/utils/token-estimate.ts:5-13`, `mcp_server/hooks/memory-surface.ts:145-146`, `mcp_server/lib/search/hybrid-search.ts:2211-2287`, `mcp_server/tests/dual-scope-hooks.vitest.ts:605-625`.

9. Budget-related parameters are only partially configurable. Configurable knobs are:
   - `SPECKIT_DYNAMIC_TOKEN_BUDGET` feature flag: enables or disables tier-based budget selection. Sources: `mcp_server/lib/search/search-flags.ts:113-119`.
   - Optional `config` passed to `getDynamicTokenBudget()`: allows callers/tests to override the simple/moderate/complex mapping. Sources: `mcp_server/lib/search/dynamic-token-budget.ts:65-89`, `mcp_server/tests/dynamic-token-budget.vitest.ts:176-190`.
   - `SPECKIT_CONFIDENCE_TRUNCATION` feature flag: enables or disables score-gap truncation. Sources: `mcp_server/lib/search/search-flags.ts:121-127`.
   - `minResults` option in `truncateByConfidence()`: allows callers to change the guaranteed floor before cliff detection starts. Sources: `mcp_server/lib/search/confidence-truncation.ts:28-35`, `mcp_server/lib/search/confidence-truncation.ts:102-106`, `mcp_server/tests/confidence-truncation.vitest.ts:217-229`.
   - `SPECKIT_TOKEN_BUDGET`: default fallback budget for generic `truncateToBudget()` when no explicit override is passed; default is `DEFAULT_TOKEN_BUDGET` (`2000`) in hybrid search, but dynamic budgets usually override this path. Sources: `mcp_server/lib/search/hybrid-search.ts:2289-2301`, `mcp_server/lib/search/hybrid-search.ts:2329-2335`.
   Hard-coded knobs in the examined files are:
   - `COMPACTION_TOKEN_BUDGET = 4000`
   - `TOOL_DISPATCH_TOKEN_BUDGET = 4000`
   - `DEFAULT_MIN_RESULTS = 3`
   - `GAP_THRESHOLD_MULTIPLIER = 2`
   These are constants, not environment-configured. Sources: `mcp_server/hooks/memory-surface.ts:52-55`, `mcp_server/lib/search/confidence-truncation.ts:34-40`.

10. Hook scripts that need to enforce the 4000-token compaction ceiling should copy the existing hook semantics, not the hybrid-search semantics. The right enforcement pattern is:
   - treat compaction as a payload-level budget, not a per-result search budget
   - estimate tokens on the serialized compaction payload
   - preserve constitutional memories ahead of triggered memories
   - trim triggered matches first, then constitutional entries
   - drop the payload entirely if it still cannot fit
   - keep the limit fixed at 4000 unless the hook contract is intentionally changed everywhere
   Reusing `truncateToBudget()` from `hybrid-search.ts` would be a semantic mismatch because that function assumes a ranked list of search results and performs greedy score-first truncation, whereas compaction operates on a dual-array `AutoSurfaceResult` object with constitutional-priority semantics. Sources: `mcp_server/hooks/memory-surface.ts:136-185`, `mcp_server/hooks/memory-surface.ts:188-223`, `mcp_server/lib/search/hybrid-search.ts:2322-2435`.

## Evidence
- Hook-level compaction budget:
  - `const COMPACTION_TOKEN_BUDGET = 4000;`
  - `return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');`
  Sources: `mcp_server/hooks/memory-surface.ts:53-55`, `mcp_server/hooks/memory-surface.ts:300-316`

- Dynamic budget mapping:
  - `simple: 1500`
  - `moderate: 2500`
  - `complex: 4000`
  Sources: `mcp_server/lib/search/dynamic-token-budget.ts:41-48`

- Confidence cliff rule:
  - first gap searched from `minResults - 1`
  - threshold is `2 * medianGap`
  - cutoff keeps `0..i`
  Sources: `mcp_server/lib/search/confidence-truncation.ts:85-91`, `mcp_server/lib/search/confidence-truncation.ts:142-188`

- Canonical token estimation:
  ```ts
  export function estimateTokenCount(text: string | null | undefined): number {
    if (!text || typeof text !== 'string' || text.length === 0) {
      return 0;
    }
    return Math.ceil(text.length / 4);
  }
  ```
  Source: `shared/utils/token-estimate.ts:9-13`

- Test-backed compaction enforcement:
  - `expect(estimatedTokens).toBeLessThanOrEqual(COMPACTION_TOKEN_BUDGET);`
  Source: `mcp_server/tests/dual-scope-hooks.vitest.ts:605-625`

## New Information Ratio (0.0-1.0)
0.72

## Novelty Justification
This iteration adds new clarity beyond earlier compaction-hook research in three areas: first, it separates the fixed compaction-hook limit from the dynamic search budget so they are not treated as the same mechanism; second, it traces where dynamic budgets become real enforcement inside `hybrid-search.ts`; third, it distinguishes score-gap truncation from token-budget truncation and shows that they operate at different stages with different objectives and data shapes.

## Recommendations for Implementation
1. Keep the compaction hook on a dedicated fixed budget contract of 4000 tokens unless there is a deliberate product decision to make compaction tier-aware. Today, the code clearly treats compaction budgeting and dynamic search budgeting as separate mechanisms.
2. If hook scripts are ported outside the MCP server, reimplement `enforceAutoSurfaceTokenBudget()` semantics directly instead of routing through `truncateToBudget()`. The compaction payload is not a ranked result list.
3. Preserve constitutional-priority behavior exactly: newest constitutional memories should survive longer than triggered matches, so trimming must stay `triggered` first and constitutional last.
4. If more precise token ceilings become important, replace the current chars-per-token heuristic with a model-aware tokenizer behind a shared utility. Right now both compaction and search budgeting are approximate by design.
5. Keep `evaluationMode` free from confidence and token-budget truncation during ablation or benchmark flows, otherwise Recall@K measurements can be invalidated by runtime truncation artifacts rather than search quality.
