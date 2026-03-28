# Iteration 004: Hybrid Search Pipeline

## Findings

### [P1] Hybrid fallback thresholds use fractional values, but vector search interprets them as percentages
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`

**Issue**
The fallback pipeline passes `minSimilarity` values like `0.3`, `0.17`, and `0.1` into the vector channel as if they were 30%, 17%, and 10%. The vector layer does not treat them that way: it divides `minSimilarity` by 100 before converting to a cosine-distance cutoff. That means Tier 1 is effectively using a 0.3% similarity floor, so vector retrieval is almost unfiltered and the Tier 1 -> Tier 2 widening barely changes the vector candidate set.

**Evidence**
`hybridSearchEnhanced()` forwards `options.minSimilarity` directly into `vectorSearchFn(...)` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:865-870`.
The fallback tiers set `minSimilarity` to `0.3`, `0.17`, and `0.1` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1420-1423`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1459-1462`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1515-1526`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1887-1915`.
`vector_search()` converts that option with `2 * (1 - minSimilarity / 100)` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:197`.
The same file uses whole-number defaults like `30` and `50` in the enriched vector entry points at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:708` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:795`, which confirms the vector contract is percentage-based, not fractional.

**Fix**
Pick one contract and enforce it everywhere. The smallest fix is to change the hybrid fallback constants to `30`, `17`, and `10`. If the intended contract is 0-1 floats, then convert inside `hybrid-search.ts` before calling the vector layer and update the vector-search API/docs accordingly.

### [P1] Disabled lexical channels are silently re-enabled in the fallback chain
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

**Issue**
`hybridSearchEnhanced()` respects `useVector`, `useBm25`, and `useFts` when it builds `activeChannels`, but the outer fallback helpers do not preserve that contract. Once the primary fused search returns nothing or degrades, the code unconditionally calls `ftsSearch()` and `bm25Search()`, and the tiered fallback explicitly flips all `use*` flags back to `true`. Any caller trying to run a channel ablation or a targeted search with one lexical channel disabled can still get that channel's scores injected later in the pipeline.

**Evidence**
The channel-disable handling exists only inside `hybridSearchEnhanced()` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:816-823`.
`collectRawCandidates()` falls back to unconditional FTS and BM25 calls at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1476-1485`.
`searchWithFallback()` does the same at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1537-1543`.
When `SPECKIT_SEARCH_FALLBACK=true`, Tier 2 hard-codes all channels back on at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1907-1915`.

**Fix**
Thread an "allowed channels" set through the whole fallback chain and gate every fallback step against it. Tier 2 should widen thresholds, not override caller channel disables.

### [P1] `useGraph: false` does not disable the graph-derived degree channel
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

**Issue**
The `useGraph` option only suppresses the direct graph retrieval call. The separate `degree` channel still runs whenever routing includes it, and it computes scores from causal-edge connectivity over IDs gathered from the other channels. That means a caller can disable graph search and still get graph-derived ranking changes through the degree stage.

**Evidence**
The direct graph path is gated with `const useGraph = (options.useGraph !== false) && activeChannels.has('graph')` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:904-905`.
The degree stage is independent and only checks `activeChannels.has('degree')`, `db`, and `isDegreeBoostEnabled()` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:928-960`.
There is no matching `options.useGraph === false` guard or `activeChannels.delete('degree')` alongside the vector/BM25/FTS disable logic at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:820-823`.

**Fix**
Treat `degree` as part of the graph family. When `useGraph` is false, either delete both `graph` and `degree` from `activeChannels` up front or gate the degree block on the same `useGraph` flag.

### [P2] FTS query sanitization preserves punctuation that the BM25 tokenizer splits, so path/code queries lose FTS recall
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`

**Issue**
The BM25 tokenizer and the FTS query sanitizer normalize queries differently. BM25 replaces most punctuation with spaces before tokenization, but the FTS path preserves characters like `.`, `/`, and `-`, then wraps the whole token in quotes. Queries that look like file paths or symbol-like identifiers can therefore split cleanly for BM25 while staying as a single quoted token for FTS, which makes the lexical channels disagree on what the user asked for.

**Evidence**
`tokenize()` in `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:135-141` lowercases input and replaces `[^a-z0-9\\s-_]` with spaces, so `memory_search.ts` becomes BM25 terms roughly equivalent to `memory_search` and `ts`.
`sanitizeQueryTokens()` in `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:389-405` removes only FTS operators and a small special-character set; it does not strip `.` or `/`.
`fts5Bm25Search()` then turns each sanitized token into a quoted FTS term joined with `OR` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:55-59`.
So a query like `memory_search.ts` is normalized one way for BM25 and another way for FTS, which distorts the lexical fusion inputs for code-like/path-like searches.

**Fix**
Use one shared normalization strategy for both lexical channels before query construction. The lowest-risk change is to make `sanitizeQueryTokens()` split punctuation the same way `tokenize()` does before quoting the FTS terms.

## Summary
P0: 0, P1: 3, P2: 1
