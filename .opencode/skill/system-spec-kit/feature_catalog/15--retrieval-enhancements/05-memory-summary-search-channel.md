---
title: "Memory summary search channel"
description: "The memory summary search channel generates TF-IDF extractive summaries at save time and searches against summary embeddings to improve retrieval precision on large memories."
---

# Memory summary search channel

## 1. OVERVIEW

The memory summary search channel generates TF-IDF extractive summaries at save time and searches against summary embeddings to improve retrieval precision on large memories.

Long documents can bury their key points in paragraphs of detail. This feature creates a short summary of each memory when it is saved and searches against those summaries instead of the full text. It is like reading the back-cover blurb of a book rather than skimming every page to decide if it is relevant.

---

## 2. CURRENT REALITY

Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise.

R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence.

Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings and returns lightweight summary hits (`id`, `memoryId`, `similarity`) rather than `PipelineRow` rows.

**Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates.

The summary channel is integrated as an additional Stage 1 retrieval channel alongside hybrid, vector and multi-concept paths. Stage 1 adapts summary hits into full `PipelineRow` candidates by hydrating `memory_index` rows, assigning `similarity` / `score`, then merging and deduplicating by memory ID with baseline candidates taking priority.

A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale. The gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage-1 adaptation of summary hits into `PipelineRow` candidates |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | TF-IDF extractive summarizer |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/memory-summaries.vitest.ts` | Summary generation tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Memory summary search channel
- Current reality source: FEATURE_CATALOG.md
