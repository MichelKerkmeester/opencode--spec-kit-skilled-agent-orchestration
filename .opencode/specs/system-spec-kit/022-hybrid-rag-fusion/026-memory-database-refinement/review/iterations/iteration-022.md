# Iteration 022: Deep dive: hybrid-search.ts internals

## Findings

### [P1] Adaptive fusion flips lexical weighting models based on unrelated channel presence
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

**Issue** `hybridSearchEnhanced()` computes adaptive weights from a single aggregated `keywordResults` list, but then uses two different weighting schemes for the same lexical inputs. When only `vector`/`fts`/`bm25` are active, it returns `adaptiveResult.results` directly, so FTS and BM25 behave like one combined `keyword` channel with the full `keywordWeight`. As soon as an extra channel such as `graph` or `degree` is present, the code switches to `fuseResultsMulti(lists)` and evenly splits `keywordWeight` across FTS and BM25, regardless of how many results each channel actually returned. That makes the lexical share of RRF depend on whether an unrelated extra channel happened to be active, and it overweights sparse lexical channels when FTS/BM25 cardinalities differ.

**Evidence** `hybrid-search.ts:998-1006` derives `keywordWeight` from `hybridAdaptiveFuse(semanticResults, keywordResults, intent)` and then blindly divides it by `lexicalChannelCount`; `hybrid-search.ts:1019-1023` bypasses those split weights entirely when the live channel set is only `vector`/`fts`/`bm25`, returning the aggregated adaptive results instead of the per-channel `lists`.

**Fix** Use one lexical weighting model everywhere. Either always fuse explicit per-channel lists with weights normalized from the actual active channels/result counts, or always collapse lexical channels into one list and remove the per-channel split path. Do not let the presence of `graph`/`degree` silently change how FTS and BM25 are weighted.

### [P1] Tiered fallback overrides caller-disabled channels before intent-weighted fusion reruns
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

**Issue** Both fallback entry points rebuild Tier 2 with `useBm25/useFts/useVector/useGraph` hardcoded to `true` and `forceAllChannels: true`. Any caller that explicitly disabled channels for ablation, debugging, or scoped retrieval therefore loses that contract as soon as degradation triggers, and the next `hybridSearchEnhanced()` pass re-enters adaptive fusion with channels the caller asked to suppress.

**Evidence** `hybrid-search.ts:1431-1440` in `collectRawCandidates()` and `hybrid-search.ts:1907-1915` in `searchWithFallbackTiered()` each overwrite the incoming options with `useBm25: true`, `useFts: true`, `useVector: true`, `useGraph: true`, plus `forceAllChannels: true`.

**Fix** Preserve explicit `false` flags when constructing Tier 2 options. The fallback should widen thresholds and optionally enable unspecified channels, but it should not resurrect channels the caller intentionally disabled.

### [P1] Confidence truncation drops candidates before later rerankers can promote them
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

**Issue** Confidence truncation runs immediately after fusion and before MMR, co-activation spreading, and folder relevance scoring. Candidates cut at this stage are gone permanently, even though the later stages are explicitly designed to change ordering and rescue semantically useful but initially lower-ranked items. Because `evaluationMode` disables truncation, offline evaluation can miss the recall loss that live traffic experiences.

**Evidence** `hybrid-search.ts:1124-1143` truncates `fusedHybridResults`; only afterward do `hybrid-search.ts:1154-1226` run MMR, `hybrid-search.ts:1234-1258` apply co-activation boosts, and `hybrid-search.ts:1265-1283` run folder scoring/two-phase retrieval.

**Fix** Move confidence truncation to the end of the ranking pipeline, after all score-adjusting stages. If early pruning is still needed for cost reasons, use a looser candidate cap there and apply the irreversible truncation only after the final ranking is stable.

### [P1] Token-budget truncation undercounts the returned payload and can still emit over-budget results
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

**Issue** The budget gate is not measuring the payload it actually returns. `estimateResultTokens()` counts only top-level primitive fields, ignoring nested objects/arrays such as `traceMetadata`, `sources`, and `sourceScores`. The budget cut also happens before the code adds `traceMetadata` and contextual tree headers, so the final serialized results are larger than the measured candidates. On top of that, the greedy loop always accepts the first result even when that single result already exceeds the budget, unless the special single-result summary path happens to fire.

**Evidence** `hybrid-search.ts:2002-2014` ignores non-primitive field contents during token estimation; `hybrid-search.ts:1315-1319` truncates before `hybrid-search.ts:1343-1377` adds `traceMetadata` and before `hybrid-search.ts:1380-1383` prepends contextual headers; `hybrid-search.ts:2099-2106` pushes the first result even when `accumulated + tokens > effectiveBudget` because the break only triggers after at least one result has already been accepted.

**Fix** Budget against the post-enrichment payload shape, not the pre-enrichment rows. Serialize or size-estimate the exact response fields after `traceMetadata` and header injection, and handle single-item overflow explicitly regardless of result count so the function never returns an item that already exceeds the effective budget.

## Summary

The strongest issues here are all live-ranking consistency problems: lexical weighting changes depending on whether extra channels are present, Tier 2 fallback ignores explicit channel disables, confidence truncation runs before the later rerankers that can still improve recall, and token-budget enforcement is optimistic enough to exceed the budget it reports. I did not find a direct progressive-disclosure cursor-state corruption bug inside `hybrid-search.ts`; the continuation state itself lives in the handler/progressive-disclosure layer rather than this module.
