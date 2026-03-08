# Memory summary search channel

## Current Reality

Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise.

R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence.

Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings, returning results as `PipelineRow` objects compatible with the main pipeline.

**Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates.

The summary channel runs as a parallel search channel in Stage 1 of the 4-stage pipeline, alongside hybrid, vector and multi-concept channels. It follows the R12 embedding expansion pattern: execute in parallel, merge results and deduplicate by memory ID with baseline results taking priority. This is deliberately a parallel channel rather than a pre-filter to avoid recall loss.

A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale; the gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | TF-IDF extractive summarizer |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/memory-summaries.vitest.ts` | Summary generation tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

## Source Metadata

- Group: Retrieval enhancements
- Source feature title: Memory summary search channel
- Current reality source: feature_catalog.md
