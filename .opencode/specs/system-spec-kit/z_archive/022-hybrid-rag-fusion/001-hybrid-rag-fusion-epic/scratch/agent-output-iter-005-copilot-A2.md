# Fusion algorithm selection and channel composition findings

## Scope

Read and traced:

- `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`

## 1) How `vector`, `BM25`, and `FTS` are combined in `hybridSearchEnhanced`

`hybridSearchEnhanced()` does not directly collapse text channels into one lexical list. It executes channel lists separately, then fuses them with weighted multi-list RRF:

1. `routeQuery()` chooses the active channel subset.
2. `vectorSearchFn(...)` fills `semanticResults` and pushes a `vector` list.
3. `ftsSearch(query, options)` pushes an `fts` list.
4. `bm25Search(query, options)` pushes a `bm25` list.
5. It also optionally adds `graph` and `degree`.
6. It builds `keywordResults = [...ftsChannelResults, ...bm25ChannelResults]`.
7. It calls `hybridAdaptiveFuse(semanticResults, keywordResults, intent)`, but only uses the returned **weights**.
8. It rewrites list weights in-place and then calls `fuseResultsMulti(lists)`.

So the actual final fusion is:

- **not** `hybridAdaptiveFuse(...).results`
- **yes** `fuseResultsMulti(lists)` from `rrf-fusion.ts`

That RRF implementation applies `weight * (1 / (k + rank + 1))`, sums contributions by canonical ID, adds a convergence bonus for multi-source matches, then normalizes to `[0,1]` when score normalization is enabled.[^hybrid-enhanced-flow][^rrf-multi]

## 2) What triggers adaptive fusion vs standard RRF

The shared adaptive module is feature-flag and rollout controlled:

- `SPECKIT_ADAPTIVE_FUSION=false` disables it.
- If `SPECKIT_ROLLOUT_PERCENT < 100`, adaptive fusion also requires an `identity`; otherwise it resolves to disabled.
- When disabled, `hybridAdaptiveFuse()` returns standard weights `{ semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 }` plus standard fused results.[^adaptive-flag][^adaptive-entry]

Important implementation nuance:

- `hybridSearchEnhanced()` calls `hybridAdaptiveFuse(semanticResults, keywordResults, intent)` **without** `identity`, `documentType`, or `darkRun`.[^hybrid-adaptive-call]
- That means:
  - progressive rollout only works if rollout is effectively 100%, because no identity is supplied
  - document-type adjustments in `getAdaptiveWeights(intent, documentType)` are unused in this path
  - dark-run diff and degraded payloads are computed by the shared module but ignored here
  - recency weighting from adaptive fusion is also not applied here, because `hybridSearchEnhanced()` discards `adaptiveResult.results` and only reuses `adaptiveResult.weights`

In practice, the selection logic is:

- **adaptive mode ON** -> use intent-derived list weights, then run local `fuseResultsMulti`
- **adaptive mode OFF** -> use equal semantic/keyword weights from `hybridAdaptiveFuse`, then still run local `fuseResultsMulti`

So the main pipeline uses adaptive fusion mainly as a **weight oracle**, not as the final fusion engine.[^adaptive-profiles][^adaptive-fuse][^hybrid-adaptive-call]

## 3) Is embedding expansion in the live pipeline or standalone?

It is live, but **not inside `hybridSearchEnhanced()` itself**.

`embedding-expansion.ts` defines the expansion helper and suppresses expansion when:

- `SPECKIT_EMBEDDING_EXPANSION` is off
- the complexity classifier says the query is `simple`
- the embedding is invalid
- vector similarity returns no usable candidates[^embedding-helper]

The actual live wiring is in Stage 1 candidate generation:

- if expansion is active, Stage 1 calls `expandQueryWithEmbeddings(...)`
- if expansion produces new terms, it runs:
  - baseline `hybridSearch.searchWithFallback(query, effectiveEmbedding, ...)`
  - expanded `hybridSearch.searchWithFallback(expanded.combinedQuery, expandedEmb, ...)`
- then merges both result sets baseline-first, deduping by ID[^stage1-r12]

So embedding expansion is:

- **not standalone/dead**
- **not embedded in `hybridSearchEnhanced()`**
- **used one layer up** as an extra candidate-generation branch that invokes hybrid search twice

## 4) Channel contribution ratio in practice

### Query-complexity routing controls which channels even exist

Default routing is:

- `simple` -> `vector + fts`
- `moderate` -> `vector + fts + bm25`
- `complex` -> `vector + fts + bm25 + graph + degree`[^router-defaults]

### Intent weights control the relative mass once a channel is active

Adaptive intent profiles are:

| Intent | semantic | keyword | recency | graph |
| --- | ---: | ---: | ---: | ---: |
| `understand` | 0.7 | 0.2 | 0.1 | 0.15 |
| `find_spec` | 0.7 | 0.2 | 0.1 | 0.30 |
| `fix_bug` | 0.4 | 0.4 | 0.2 | 0.10 |
| `add_feature` | 0.5 | 0.3 | 0.2 | 0.20 |
| `refactor` | 0.6 | 0.3 | 0.1 | 0.15 |
| `security_audit` | 0.3 | 0.5 | 0.2 | 0.15 |
| `find_decision` | 0.3 | 0.2 | 0.1 | 0.50 |[^adaptive-profiles]

### Practical ratio by route

The surprising part is that `hybridSearchEnhanced()` assigns `keywordWeight` to **both** `fts` and `bm25` lists when both are present:

- `vector` list gets `semanticWeight`
- `fts` list gets `keywordWeight`
- `bm25` list gets `keywordWeight`
- `graph` gets `graphWeight`
- `degree` stays at hardcoded `0.4`[^hybrid-adaptive-call]

That means the effective vector-vs-text mass is:

- **simple route**: `vector : text = semanticWeight : keywordWeight`
- **moderate/complex route**: `vector : text = semanticWeight : (2 * keywordWeight)`

Examples:

- `understand`
  - simple: `0.7 : 0.2`
  - moderate/complex text mass: `0.7 : 0.4`
- `fix_bug`
  - simple: `0.4 : 0.4`
  - moderate/complex text mass: `0.4 : 0.8`
- `security_audit`
  - simple: `0.3 : 0.5`
  - moderate/complex text mass: `0.3 : 1.0`

So the live pipeline is more text-heavy than the semantic/keyword profiles suggest once both lexical channels are active. The adaptive profile looks like a 2-bucket model, but the runtime applies the lexical bucket twice.[^adaptive-profiles][^hybrid-enhanced-flow]

Secondary nuance:

- `recencyWeight` from adaptive fusion is not used by `hybridSearchEnhanced()`
- `degree` is a static extra 0.4 channel
- `fuseResultsMulti()` also adds convergence bonus across channels, so repeated presence can outweigh nominal per-channel weights[^adaptive-fuse][^rrf-multi]

## 5) Are there redundant search paths in `hybrid-search.ts`?

There are multiple paths, but they are not all equally active:

### A. `hybridSearch()`

Legacy hybrid implementation. It is explicitly deprecated and retained as a fallback when `hybridSearchEnhanced()` throws.[^legacy-fallback]

### B. `hybridSearchEnhanced()`

The main live RRF path. This is the real fusion engine used by current higher-level callers and by the fallback wrappers.[^hybrid-enhanced-flow]

### C. `searchWithFallback()`

A resilience wrapper around `hybridSearchEnhanced()`:

- primary enhanced search at `minSimilarity=0.3`
- retry enhanced search at `minSimilarity=0.17`
- then FTS-only fallback
- then BM25-only fallback[^fallback-wrapper]

### D. `searchWithFallbackTiered()`

A second wrapper, enabled by `isSearchFallbackEnabled()`:

- Tier 1: `hybridSearchEnhanced(..., minSimilarity=0.3)`
- Tier 2: `hybridSearchEnhanced(..., minSimilarity=0.1, forceAllChannels=true)`
- Tier 3: `structuralSearch()` as SQL last resort[^tiered-fallback]

### E. `combinedLexicalSearch()`

Not part of the main hybrid path. It is a lexical convenience helper that merges FTS + BM25 and prefers FTS on ID collisions. Useful as a helper/test surface, but not part of the main pipeline that Stage 1 uses.[^combined-lexical]

### Verdict

There is some genuine redundancy:

- `searchWithFallback()` and `searchWithFallbackTiered()` are overlapping wrapper strategies around the same engine
- `combinedLexicalSearch()` duplicates part of the lexical composition logic
- `hybridSearch()` is a legacy path that still exists as an emergency fallback

But the code is not four equivalent engines. It is closer to:

- **1 main engine**: `hybridSearchEnhanced`
- **1 legacy safety net**: `hybridSearch`
- **2 wrapper policies**: `searchWithFallback`, `searchWithFallbackTiered`
- **1 lexical helper**: `combinedLexicalSearch`

## 6) Could query router and channel selection be simplified?

Yes. Two simplifications stand out.

### S1: Unify complexity classification so routing and expansion share the same decision object

Right now:

- `routeQuery()` calls `classifyQueryComplexity(query, triggerPhrases)` and converts tier -> channels[^router-defaults]
- `embedding-expansion.ts` independently calls `classifyQueryComplexity(query)` / `isExpansionActive(query)`[^embedding-helper]

This duplicates complexity logic and can drift behavior:

- the router can use `triggerPhrases`
- embedding expansion does not accept `triggerPhrases`
- in the Stage 1 calls inspected, `searchWithFallback(...)` is invoked without `triggerPhrases`, so the trigger-match path is often bypassed there[^stage1-r12]

Simpler model:

- classify once
- carry `{ tier, classification, channels, expansionAllowed }`
- let both routing and expansion consume the same object

### S2: Treat lexical weighting consistently

The adaptive layer is conceptually 2-bucket (`semantic` vs `keyword`), but runtime composition is 3-list (`vector`, `fts`, `bm25`) and applies the keyword bucket twice.[^adaptive-fuse][^hybrid-adaptive-call]

That could be simplified either by:

1. fusing `fts` + `bm25` into one lexical ranked list before adaptive weighting, or
2. splitting `keywordWeight` across lexical subchannels instead of assigning it to both in full

That would make the channel contribution ratio match the declared adaptive model.

## Bottom line

1. `hybridSearchEnhanced()` ultimately combines channels with local weighted multi-list RRF from `fuseResultsMulti()`.
2. Adaptive fusion is used mostly to choose weights, not to supply final fused results.
3. Embedding expansion is live, but it operates in Stage 1 candidate generation above the hybrid search engine.
4. The effective vector-vs-text ratio is route-dependent, and text gets double-counted whenever both `fts` and `bm25` are active.
5. The multiple search functions are mostly wrappers and legacy helpers around one real engine, but there is still wrapper overlap.
6. The cleanest simplification would be to unify complexity/routing/expansion decisions and make lexical weighting match the adaptive model.

---

[^rrf-multi]: `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:223-287`
[^adaptive-profiles]: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60-122`
[^adaptive-fuse]: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:135-238`
[^adaptive-entry]: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:344-419`
[^router-defaults]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:51-142`
[^embedding-helper]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:181-304`
[^combined-lexical]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:375-409`
[^hybrid-enhanced-flow]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:558-746`
[^legacy-fallback]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1059-1064`
[^fallback-wrapper]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1067-1119`
[^tiered-fallback]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1433-1517`
[^stage1-r12]: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:338-412`
