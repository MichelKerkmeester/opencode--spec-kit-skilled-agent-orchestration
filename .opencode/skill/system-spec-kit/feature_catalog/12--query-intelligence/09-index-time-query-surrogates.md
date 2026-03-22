---
title: "Index-time query surrogates"
description: "Index-time query surrogates generate surrogate metadata (aliases, headings, summaries, heuristic questions) at index time for improved recall without runtime LLM calls, gated by the SPECKIT_QUERY_SURROGATES flag."
---

# Index-time query surrogates

## 1. OVERVIEW

Index-time query surrogates generate surrogate metadata (aliases, headings, summaries, heuristic questions) at index time for improved recall without runtime LLM calls, gated by the `SPECKIT_QUERY_SURROGATES` flag.

A document might be the perfect answer to a question but use completely different words. This feature solves that by pre-generating alternative descriptions of each document at index time: abbreviations, headings, short summaries, and likely questions the document answers. At query time, these surrogates are matched against the incoming query with a lightweight token overlap check — no LLM calls needed. It is like writing the index cards for a library catalog in advance so lookups are fast.

---

## 2. CURRENT REALITY

At index time, the surrogate generator produces a `SurrogateMetadata` object containing:
- **Aliases**: extracted via heuristics — parenthetical abbreviations ("Reciprocal Rank Fusion (RRF)" yields "RRF"), parenthetical definitions, and slash-separated synonyms
- **Headings**: structural headings extracted as retrieval surrogates
- **Summary**: concise extractive summary (max `MAX_SUMMARY_LENGTH = 200` characters)
- **Surrogate questions**: 2-5 heuristic questions the document likely answers (`MIN_SURROGATE_QUESTIONS = 2`, `MAX_SURROGATE_QUESTIONS = 5`)

At query time, stored surrogates are matched against the incoming query using token overlap. A match requires a minimum overlap ratio of `MIN_MATCH_THRESHOLD = 0.15`. The `SurrogateMatchResult` includes the memory ID, combined match score in [0, 1], and which surrogates were matched (for explainability).

Enabled by default (graduated). Set `SPECKIT_QUERY_SURROGATES=false` to disable. Also has a flag accessor in `search-flags.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-surrogates.ts` | Lib | Alias extraction, heading extraction, summary generation, surrogate question generation, query-time matching |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isQuerySurrogatesEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/query-surrogates.vitest.ts` | Flag behavior, alias extraction, surrogate matching |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Index-time query surrogates
- Current reality source: mcp_server/lib/search/query-surrogates.ts module header and implementation
