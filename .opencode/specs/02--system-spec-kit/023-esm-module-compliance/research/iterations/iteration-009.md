# Iteration 9: Search Quality Edge Cases -- Truncation, Embeddings, Expansion, Length Bias, Async Safety

## Focus
Investigate 7 deeper search quality edge cases not covered in prior iterations: (1) result truncation/pagination limits, (2) embedding model quality and configuration, (3) multi-query expansion effectiveness, (4) document length scoring bias, (5) async race conditions, (6) handling of high-result-count queries, (7) ambiguous query handling. This moves beyond the P1/P2 backlog into structural pipeline quality assessment.

## Findings

### 1. Result Truncation: Multi-Layer Capping Architecture (Comprehensive)

The pipeline applies **4 sequential truncation layers**, each with a different purpose:

1. **Per-channel `limit` parameter** -- Each channel (vector, FTS5, BM25, graph) receives the caller's `limit` parameter (default 10, max 100) and caps its own results at that count. This means each channel independently returns at most `limit` results, and the RRF merge sees at most `4 * limit` candidates.
   [SOURCE: hybrid-search.ts:852-903]

2. **Post-fusion `.slice(0, limit)`** -- After RRF merging and scoring, results are sliced to the caller's limit.
   [SOURCE: hybrid-search.ts:962, hybrid-search.ts:1380]

3. **Confidence truncation (gap analysis)** -- `truncateByConfidence()` uses an elbow heuristic (2x median gap threshold) to find natural "relevance cliffs" and truncate below them. Has a `DEFAULT_MIN_RESULTS = 3` floor. Filters NaN/Infinity scores defensively. Only activates when `SPECKIT_CONFIDENCE_TRUNCATION` is enabled.
   [SOURCE: confidence-truncation.ts:102-198]

4. **Token budget truncation** -- `truncateToBudget()` applies a dynamic token budget (tier-aware) as the final gate, removing results that would exceed the response token allocation.
   [SOURCE: hybrid-search.ts:1602-1614]

**Quality assessment**: Good results could theoretically be lost at layer 1 (per-channel limit), since each channel independently caps at `limit`. If the best result for a query ranks 11th in all 4 channels but appears in none of the top-10 lists, it would be missed entirely. However, this is unlikely in practice because the 4 channels use fundamentally different scoring methods (semantic similarity, BM25 term frequency, FTS5 weighted match, graph traversal), so a relevant result is very likely to rank in the top-10 of at least one channel.

**Potential issue**: The `applyResultLimit` function (line 1989) is a simple `.slice()` that does not consider diversity -- if all top results are from the same spec folder, the caller gets a monoculture. This is partially mitigated by the MMR (Maximal Marginal Relevance) diversity pass at line 1431, but MMR is applied before the final limit cut, so the limit itself does not re-diversify.
[SOURCE: hybrid-search.ts:1989, hybrid-search.ts:1431]

### 2. Embedding Model Configuration: 3-Provider Architecture with Sensible Defaults

The system supports **3 embedding providers** via a factory pattern:

| Provider | Default Model | Dimensions | Quality Tier |
|----------|--------------|------------|-------------|
| **Voyage AI** (recommended) | `voyage-4` | Varies by model | Highest retrieval quality |
| **OpenAI** | `text-embedding-3-small` | Varies by model | Widely available |
| **HuggingFace local** | `nomic-ai/nomic-embed-text-v1.5` | 768 | No API key required |

Key configuration env vars:
- `EMBEDDINGS_PROVIDER` -- selects provider (`voyage`, `openai`, `hf-local`, `auto`)
- `VOYAGE_EMBEDDINGS_MODEL`, `OPENAI_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_MODEL` -- override default model per provider
- `EMBEDDING_DIM` -- automatically resolved at startup from provider/model, with dimension validation against the database

**Startup safety**: The server validates embedding dimensions match the database at startup (context-server.ts:1354-1363). A dimension mismatch is FATAL -- the server refuses to start, preventing silent index corruption.
[SOURCE: shared/embeddings/factory.ts:87-100, context-server.ts:1309-1363]

**Quality note**: `voyage-4` is one of the highest-performing embedding models available (as of early 2026), ranking at or near the top on MTEB benchmarks. `text-embedding-3-small` from OpenAI is solid but lower-quality. `nomic-embed-text-v1.5` (768-dim) is good for a local model but significantly behind the cloud options. The system's default recommendation of Voyage AI is appropriate.
[INFERENCE: based on model names and MTEB benchmark knowledge]

### 3. Multi-Query Expansion: Two Systems, One Gated

There are **two separate expansion systems**:

**A. Rule-based synonym expansion (`query-expander.ts`)**
- Used in `mode="deep"` multi-query RAG
- Domain vocabulary map with hardcoded synonyms (e.g., "auth" -> "authentication")
- Limits to one expansion per matched word to avoid over-expanding
- Simple but effective for domain vocabulary alignment
[SOURCE: query-expander.ts:5, 63-93]

**B. Embedding-based expansion (`embedding-expansion.ts` / R12)**
- Feature flag: `SPECKIT_EMBEDDING_EXPANSION` (default: ON)
- **R12/R15 mutual exclusion**: When query complexity classifier (R15) rates query as "simple", embedding expansion is suppressed entirely. This is a smart design -- short exact-match queries don't benefit from broadening.
- Process: (1) Vector search for 5 similar memories, (2) Extract frequency-sorted terms from their content/title/triggers, (3) Append top 8 new terms to query
- Constants: `DEFAULT_CANDIDATE_LIMIT = 5`, `MAX_EXPANSION_TERMS = 8`, `MIN_TERM_LENGTH = 3`
- Stop-words filtered, query-tokens excluded from expansion
[SOURCE: embedding-expansion.ts:7-17, 65-82, 181-280]

**Effectiveness assessment**: The expansion is well-designed with appropriate guardrails. The R12/R15 mutual exclusion prevents degrading simple queries. The 5-candidate / 8-term limits prevent over-expansion. The frequency-based term selection surfaces the most common (thus most signal-rich) terms from related memories.

**Potential weakness**: The expansion only mines terms from the top-5 similar memories' raw text (tokenized on word boundaries). This means it can only expand with words that literally appear in similar documents -- it cannot discover conceptually related terms that use different vocabulary. For example, if you search "authentication" and similar memories only use "auth", the expansion would add "auth" but could not add "SSO" or "OAuth" unless those terms appear in the top-5 results. This is a limitation of the bag-of-words approach vs. a more sophisticated query reformulation (e.g., LLM-based). However, for a local system this is a reasonable trade-off.
[INFERENCE: based on extractTermsFromContents algorithm analysis at embedding-expansion.ts:124-149]

### 4. Document Length Scoring Bias: Actively Mitigated by Cross-Encoder

The cross-encoder reranker includes an explicit **LENGTH_PENALTY** system:

```
LENGTH_PENALTY = {
  shortThreshold: 50,    // < 50 chars: penalty 0.9 (10% reduction)
  longThreshold: 2000,   // > 2000 chars: penalty 0.95 (5% reduction)
  shortPenalty: 0.9,
  longPenalty: 0.95,
}
```

- Documents < 50 characters get a 10% score reduction (too short to be useful)
- Documents > 2000 characters get a 5% score reduction (favoring concise results)
- Documents between 50-2000 characters: no penalty (1.0 multiplier)
- The penalty is applied as a multiplicative factor to the reranker score
- Controlled by `applyLengthPenalty` option (default: `true`)
[SOURCE: cross-encoder.ts:62-67, 192-205, 372-435]

**Additionally**, BM25 has built-in length normalization via its `k1` and `b` parameters (BM25-index.ts), where the `b` parameter (typically 0.75) normalizes for document length relative to average document length. This prevents longer documents from dominating purely through having more term occurrences.
[SOURCE: bm25-index.ts:25, 243-267]

**Assessment**: Length bias is well-handled at two levels -- BM25 at the lexical channel level, and cross-encoder at the reranking level. The 5% penalty for long documents is mild enough to not unfairly punish thorough documentation while still favoring concise, focused results.

### 5. Async Race Conditions: Minimal Risk Due to Synchronous-First Design

The search pipeline is fundamentally **synchronous within a single request**:

- Stage 1 (candidate generation): All channels (vector, FTS5, BM25, graph) are called sequentially, not in parallel. Each channel returns results synchronously from the SQLite database.
- Stage 2 (fusion): Pure computation, no I/O
- Stage 3 (rerank): Local reranker or external API call -- sequential, awaited
- Stage 4 (filter): Pure computation

The only async operations are:
1. **Embedding generation** -- `expandQueryWithEmbeddings()` is async because vector search may need to generate a query embedding via an external API. However, this completes before any other pipeline stage begins.
2. **Local reranker** -- `rerankLocal()` is async for the HTTP call to a local reranker service. Again, fully awaited before downstream stages.
3. **Background embedding retry** -- Runs on a separate timer (`retryManager` at context-server.ts:100) and operates on its own set of "pending" memories, not on search results.

**Assessment**: No race conditions exist in the search pipeline itself. The pipeline is request-scoped and sequential. The only shared mutable state is the SQLite database, and better-sqlite3 (the driver used) uses serialized access within a single process. Background processes (embedding retry, file watcher) write to the database but do not interfere with reads because SQLite's WAL mode provides snapshot isolation for readers.
[INFERENCE: based on pipeline architecture from iterations 2+5, SQLite WAL mode, and better-sqlite3 serialization guarantees]

### 6. High-Result-Count Query Handling: Bounded but Not Optimized

When a query matches many results (>100):
- Each channel independently caps at `limit` (default 10, max 100 via API schema)
- RRF merge sees at most `4 * limit` candidates (400 max)
- The `MAX_RERANK_CANDIDATES` constant in local-reranker.ts caps reranking input (line 259)
- Confidence truncation further reduces the set

However, there is **no explicit handling of the "many weak matches" scenario** where a broad query (e.g., "search") matches hundreds of memories but none strongly. In this case:
- All 4 channels would return their top-10
- Many of these would overlap (same memory appears in multiple channels)
- RRF merge would produce ~10-20 unique results with similar scores
- Confidence truncation would likely NOT trigger (no clear gap when all scores are similar)
- The caller gets 10 results of mediocre relevance with no signal that the query was too broad

**Potential improvement**: A "query too broad" signal could be useful -- when score variance across results is very low (all results score similarly), the system could indicate that refinement would help.
[INFERENCE: based on confidence-truncation.ts gap analysis logic and hybrid-search.ts merge behavior]

### 7. Confidence Truncation Gap Analysis: Mathematically Sound

The gap analysis algorithm is clean:
1. Compute consecutive score gaps (descending order)
2. Find median gap
3. First gap > 2x median after `minResults` (default 3) triggers truncation

**Edge case handling**:
- All same scores (median gap = 0): returns all results (correct)
- NaN/Infinity scores: filtered before gap computation (defensive)
- < `minResults` results: returned unchanged (floor guarantee)
- Feature flag off: complete pass-through

The 2x median threshold is a standard elbow detection heuristic. It's conservative enough to avoid aggressive truncation while still catching genuine relevance cliffs.
[SOURCE: confidence-truncation.ts:39, 102-198]

## Ruled Out
- **Async race conditions as a search quality concern** -- pipeline is fundamentally synchronous per-request; SQLite WAL provides reader isolation
- **Length bias as an unmitigated problem** -- two-layer defense (BM25 normalization + cross-encoder length penalty) addresses this

## Dead Ends
None -- all investigation paths yielded findings.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` (multiple sections)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` (lines 55-84)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts` (full file via grep)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts` (lines 1-150)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts` (startup embedding validation)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md` (embedding provider docs)

## Assessment
- New information ratio: 0.50
- Questions addressed: 7 edge case topics (truncation, embeddings, expansion, length bias, async, high-count queries, confidence gaps)
- Questions answered: All 7 investigated; 5 confirmed well-handled, 2 identified minor improvement opportunities

## Reflection
- What worked and why: Grep with broad multi-pattern regexes across the search directory quickly located all relevant code for 4 of the 7 topics in a single pass. Reading the embeddings factory source gave definitive provider/model configuration data.
- What did not work and why: The embeddings factory was at a different path than initially expected (shared/ not shared/mcp_server/) -- required a Glob to locate it. Minor cost.
- What I would do differently: For a purely quality-audit iteration like this, start with the cross-encoder and confidence-truncation modules first (highest impact on quality), then branch to the other topics.

## Recommended Next Focus
The research is at a natural convergence point. All 10 key questions are answered, all P1/P2 items triaged, and this edge-case investigation found no critical issues (only 2 minor improvement opportunities). Recommend convergence and final synthesis.

### Updated Refinement Backlog (2 new low-priority items from this iteration):

**From iteration 9 (P3, informational/optional):**
- P3-1: "Query too broad" signal when score variance is very low (~2h, UX improvement)
- P3-2: Post-limit diversity re-check -- after final `.slice(0, limit)`, verify result diversity (~1h, edge case)

**Unchanged from iterations 7-8 (actionable, ~5h total):**
- P1-3: Direct recency bonus in Stage 2 fusion (~2h, highest impact)
- P1-4: GRAPH_WEIGHT_CAP proportional raise (~1-2h)
- P1-2: Constitutional injection count cap (~1h)
- P2-4: Doc-type proportional shift (~30min)
- P2-NEW: hasTriggerMatch word-boundary check (~15min)
