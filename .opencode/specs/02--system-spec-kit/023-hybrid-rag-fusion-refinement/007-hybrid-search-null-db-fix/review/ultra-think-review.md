# Ultra-Think Review: Search Pipeline Changes
## Summary (pass/fail + confidence)
- Verdict: Fail.
- Confidence: High.
- The primary user-facing search restoration work looks directionally correct, and the current `dist/` artifacts appear aligned with the touched source files. But the session still leaves 4 P1 issues and 3 P2 issues, including one remaining hardcoded `minState`, one real schema/test contract break, one scale bug in scalar `related_memories`, and one optimization that is currently dead code.
- Verification performed:
  - Read all 17 requested source files plus their current `dist/*.js` counterparts.
  - Inspected the 8 search-pipeline commits from March 30, 2026.
  - Searched for leftover hardcoded `minState`, token-budget, and RRF K references.
  - Ran `TMPDIR=/Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.tmp/vitest-tmp npx vitest run tests/tool-input-schema.vitest.ts` from `.opencode/skill/system-spec-kit/mcp_server` and got 2 failures.
  - Ran `TMPDIR=/Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.tmp/vitest-tmp npx vitest run tests/co-activation.vitest.ts tests/stage3-rerank-regression.vitest.ts tests/spec-folder-prefilter.vitest.ts` and all 63 tests passed.

## P0 Findings (blocking issues)
- None.

## P1 Findings (should fix)
1. Remaining hardcoded `minState: 'WARM'` still exists in scheduled shadow replay.
   - Evidence: `mcp_server/lib/feedback/shadow-evaluation-runtime.ts:136-145` builds replay config with `minState: 'WARM'`; `mcp_server/lib/feedback/shadow-evaluation-runtime.ts:221-238` feeds that config into `executePipeline()`.
   - Why it matters: the outage root cause was exactly that `memoryState` is absent, so WARM/COLD thresholds filtered everything to zero. The interactive handlers were fixed, but this replay path can still evaluate against an empty result set.
   - Likely impact: shadow evaluation, adaptive feedback, and replay-based monitoring can remain broken or misleading even though live search now works.

2. Public tool schemas, runtime validators, and tests now disagree after the Claude-compatibility schema change.
   - Evidence:
     - `mcp_server/tool-schemas.ts:404-452` removed top-level actor `oneOf/not`.
     - `mcp_server/tool-schemas.ts:485-492` narrowed `memoryId`, `sourceId`, and `targetId` to `string`.
     - `mcp_server/schemas/tool-input-schemas.ts:323-333` still accepts `number | string` at runtime for the causal tools.
     - `mcp_server/tests/tool-input-schema.vitest.ts:41-58` and `mcp_server/tests/tool-input-schema.vitest.ts:398-406` still assert the old public-schema contract.
   - Verification: `tests/tool-input-schema.vitest.ts` currently fails on those assertions.
   - Why it matters: shared-memory tools now fail contract tests, and the published causal-tool schema is stricter than the runtime actually is. That is external contract drift, not just a stale comment.

3. Scalar `related_memories` fallback uses the wrong similarity scale.
   - Evidence: `mcp_server/lib/cognitive/co-activation.ts:45` uses `minSimilarity: 70`; `mcp_server/lib/cognitive/co-activation.ts:73` sets `DEFAULT_RELATED_MEMORY_SIMILARITY = 0.5`; `mcp_server/lib/cognitive/co-activation.ts:108-110` assigns that value to scalar entries; `mcp_server/lib/cognitive/co-activation.ts:170` divides similarity by 100 when computing boosts.
   - Why it matters: object-form similarities are clearly 0-100, but scalar-form relations now behave like `0.5 / 100 = 0.005`. That makes scalar backfilled links roughly two orders of magnitude weaker than object-form links.
   - Likely impact: T030 parses scalar format without crashing, but the recovered relationships barely influence ranking.

4. `computeBackfillQualityScore()` was added but never wired in, so T031 does not currently deliver the claimed behavior.
   - Evidence:
     - `mcp_server/lib/validation/save-quality-gate.ts:567-590` defines `computeBackfillQualityScore()`.
     - Repo search only finds its definition.
     - `mcp_server/lib/search/validation-metadata.ts:179-196` still treats `quality_score <= 0` as absent and falls back only to tier-derived quality.
   - Why it matters: the commit claims to improve 520 zero-score memories, but current code never computes or persists a backfill score for them.
   - Likely impact: ranking/quality heuristics keep using the old zero-score behavior; the change currently adds dead code but no observable improvement.

## P2 Findings (nice to have)
1. Deprecated-tier exclusion in SQLite FTS is unconditional and ignores explicit tier targeting.
   - Evidence: `mcp_server/lib/search/sqlite-fts.ts:67-84` always injects `importance_tier != 'deprecated'`; `mcp_server/lib/search/vector-index-queries.ts:229-239` still supports explicit `tier === 'deprecated'`.
   - Why it matters: `memory_search({ tier: 'deprecated' })` can still hit vector results, but the lexical exact-match channels are partially disabled for that same request.

2. `memory_context` still has one stale token-budget fallback.
   - Evidence: `mcp_server/handlers/memory-context.ts:1070-1071` still falls back to `2000` if `layerDefs.getLayerInfo('memory_context')` returns null.
   - Why it matters: low risk today, but it is a remaining hardcoded value that no longer matches the new 3500-budget policy.

3. RRF K documentation and playbook references are still hardcoded to 60.
   - Evidence:
     - `mcp_server/lib/search/README.md:410`
     - `feature_catalog/feature_catalog.md:1814,2190,4490`
     - `feature_catalog/11--scoring-and-calibration/01-score-normalization.md:18`
     - `feature_catalog/11--scoring-and-calibration/22-rrf-k-experimental.md:18,20,33`
     - `manual_testing_playbook/manual_testing_playbook.md:3108-3110`
     - `manual_testing_playbook/11--scoring-and-calibration/172-rrf-k-experimental-speckit-rrf-k-experimental.md:19-29`
   - Why it matters: operators and future audits will keep validating against the old constant.

## Source/Dist Sync Check (file-by-file)
- `mcp_server/lib/governance/scope-governance.ts` <-> `mcp_server/dist/lib/governance/scope-governance.js`: aligned in current tree. Both contain the opt-in `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` and `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` logic.
- `mcp_server/handlers/memory-search.ts` <-> `mcp_server/dist/handlers/memory-search.js`: aligned in current tree. Both expose `minState` without a default.
- `mcp_server/handlers/memory-context.ts` <-> `mcp_server/dist/handlers/memory-context.js`: aligned in current tree. Both omit hardcoded `minState` in deep/focused/resume and show the raised budgets.
- `mcp_server/lib/search/pipeline/stage4-filter.ts` <-> `mcp_server/dist/lib/search/pipeline/stage4-filter.js`: aligned in current tree. `UNKNOWN_STATE_PRIORITY = 6` is present in both.
- `mcp_server/lib/cognitive/rollout-policy.ts` <-> `mcp_server/dist/lib/cognitive/rollout-policy.js`: aligned in current tree. Both return `true` when rollout percent is partial and identity is absent.
- `mcp_server/lib/search/hybrid-search.ts` <-> `mcp_server/dist/lib/search/hybrid-search.js`: aligned in current tree. The 3 `console.warn('[hybrid-search] Channel error:'...)` sites are present in both.
- `mcp_server/tool-schemas.ts` <-> `mcp_server/dist/tool-schemas.js`: aligned in current tree. The Claude-compatible schema simplification is present in both.
- `mcp_server/lib/architecture/layer-definitions.ts` <-> `mcp_server/dist/lib/architecture/layer-definitions.js`: aligned in current tree. L1 and L2 are both 3500.
- `shared/algorithms/rrf-fusion.ts` <-> `shared/dist/algorithms/rrf-fusion.js`: aligned in current tree. `DEFAULT_K = 40` is present in both.
- `mcp_server/lib/search/sqlite-fts.ts` <-> `mcp_server/dist/lib/search/sqlite-fts.js`: aligned in current tree. The deprecated-tier exclusion appears in both.
- `mcp_server/lib/search/embedding-expansion.ts` <-> `mcp_server/dist/lib/search/embedding-expansion.js`: aligned in current tree. The `termCount <= 2` gate is present in both.
- `mcp_server/lib/search/bm25-index.ts` <-> `mcp_server/dist/lib/search/bm25-index.js`: aligned in current tree. `phraseToken` expansion exists in both.
- `mcp_server/lib/search/pipeline/stage3-rerank.ts` <-> `mcp_server/dist/lib/search/pipeline/stage3-rerank.js`: aligned in current tree. `rerankProvider` metadata exists in both.
- `mcp_server/lib/cognitive/co-activation.ts` <-> `mcp_server/dist/lib/cognitive/co-activation.js`: aligned in current tree. Scalar parsing and `DEFAULT_RELATED_MEMORY_SIMILARITY` exist in both.
- `mcp_server/lib/validation/save-quality-gate.ts` <-> `mcp_server/dist/lib/validation/save-quality-gate.js`: aligned in current tree. `computeBackfillQualityScore()` exists in both.
- `mcp_server/handlers/chunking-orchestrator.ts` <-> `mcp_server/dist/handlers/chunking-orchestrator.js`: aligned in current tree. Parent propagation logic is reflected in both.
- `mcp_server/lib/cache/embedding-cache.ts` <-> `mcp_server/dist/lib/cache/embedding-cache.js`: aligned in current tree. Hit/miss counters and overloaded `getCacheStats()` are present in both.
- Supporting files touched by T032 but not listed in the prompt also look aligned in the current tree: `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/lib/search/vector-index-types.ts`, and their `dist` counterparts all include `parent_id` support.
- One nuance: `git log` for the March 30 session shows TS source changes but no matching `dist/` path commits in the same window. Because the current `dist` tree does contain the updated logic, I do not see a current runtime/source divergence, but the session-level artifact trail is not obvious from commit history alone.

## Interaction Analysis
- The zero-result outage fix is multi-part and the parts depend on each other:
  - Removing handler defaults in `memory-search` and `memory-context` fixes the implicit filtering path.
  - `UNKNOWN_STATE_PRIORITY = 6` prevents explicit `minState` callers from still wiping out all rows while `memoryState` is absent.
  - The leftover `shadow-evaluation-runtime` hardcode reintroduces the original failure mode for replay traffic.
- The token-budget increases are directionally correct and pair well with `includeContent=true`, but the stale 2000 fallback means there is still one low-probability downgrade path.
- The chunk-parent propagation in `chunking-orchestrator` only works because T032 also updated `vector-index-mutations` and `vector-index-types`; reviewing the handler alone would miss that dependency.
- The schema simplification improved Claude compatibility, but it also split the public MCP schema from the runtime validator/test contract. That tradeoff is currently unresolved rather than fully closed.
- The lexical optimizations interact unevenly: phrase expansion should help multiword exact matches, but unconditional deprecated-tier exclusion means those gains disappear for deprecated-only searches.
- The rollout-policy fix makes default-on flags stay enabled when identity is missing. That matches the stated intent, but it also means percentage rollouts no longer throttle anonymous or system contexts.

## Recommendations
- Fix `shadow-evaluation-runtime` first and add a regression test that replays a query through `executePipeline()` with no `memoryState` column present.
- Reconcile tool contracts in one pass: public schema, runtime validator, and `tool-input-schema.vitest.ts` should agree on actor exclusivity and numeric-vs-string causal IDs.
- Change scalar `related_memories` fallback to a scale-consistent value and add a direct test for `[39]` input, not just object-form inputs.
- Wire `computeBackfillQualityScore()` into a real backfill or read path, or remove it until the integration lands.
- Make deprecated-tier lexical filtering conditional on the requested tier.
- Sweep remaining `K=60` docs and the `memory_context` 2000 fallback so the code and operational guidance tell the same story.
