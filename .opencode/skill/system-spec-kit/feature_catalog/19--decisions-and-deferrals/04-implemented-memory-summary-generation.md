# Implemented: memory summary generation

## Current Reality

Originally skipped at Sprint 7 because the scale gate measured 2,411 active memories, below the 5,000 threshold.

**Now implemented.** Pure-TypeScript TF-IDF extractive summarizer generates top-3 key sentences at save time, stored with summary-specific embeddings in the `memory_summaries` table. Operates as a parallel search channel in Stage 1 (not a pre-filter, avoiding recall loss). The runtime scale gate remains: the channel skips execution below 5,000 indexed memories. Runs behind `SPECKIT_MEMORY_SUMMARIES` (default ON). Schema migration v20 added the `memory_summaries` table. See [Memory summary search channel](#memory-summary-search-channel) for the full description.

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

- Group: Decisions and deferrals
- Source feature title: Implemented: memory summary generation
- Current reality source: feature_catalog.md
