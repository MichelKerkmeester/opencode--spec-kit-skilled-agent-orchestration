---
title: "Query decomposition"
description: "Query decomposition splits multi-faceted questions into up to 3 sub-queries using rule-based heuristics, enabling facet-aware retrieval in deep mode without LLM calls, gated by the SPECKIT_QUERY_DECOMPOSITION flag."
---

# Query decomposition

## 1. OVERVIEW

Query decomposition splits multi-faceted questions into up to 3 sub-queries using rule-based heuristics, enabling facet-aware retrieval in deep mode without LLM calls, gated by the `SPECKIT_QUERY_DECOMPOSITION` flag.

When you ask a complex question that covers multiple topics at once (for example "What is the memory save workflow and how does query expansion work?"), the system may fail to find good results because it tries to match everything at once. This feature detects coordinating conjunctions ("and", "or", "also") and multiple wh-question words to split such queries into focused sub-queries. Each sub-query retrieves independently, and results are merged by facet coverage. This only activates in deep mode, where the extra retrieval cost is acceptable.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_QUERY_DECOMPOSITION=false` to disable.

The `isQueryDecompositionEnabled()` function in `search-flags.ts` checks the flag. The `query-decomposer.ts` module performs bounded facet detection:
- Splits on coordinating conjunctions (`and`, `or`, `also`, `plus`, `as well as`, `along with`).
- Detects multiple wh-question words (`what`, `where`, `when`, `why`, `how`, `who`, `which`).
- Caps at `MAX_FACETS = 3` sub-queries to bound latency.
- No LLM calls — purely rule-based heuristics.
- Graceful fallback: if the Stage 1 decomposition branch errors, execution falls through to the standard deep expansion path rather than returning only the original query; if no expansion variants are produced, the original query remains as the fallback.
- Only active in deep mode (checked by caller in stage1-candidate-gen).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-decomposer.ts` | Lib | Bounded facet detection, conjunction splitting, sub-query generation |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage-1 orchestration, deep-mode gate for decomposition |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isQueryDecompositionEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/query-decomposer.vitest.ts` | Decomposition logic and edge cases |
| `mcp_server/tests/query-decomposition.vitest.ts` | Integration-level decomposition tests |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Query decomposition
- Current reality source: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts deep-mode decomposition branch and mcp_server/lib/search/query-decomposer.ts heuristics
