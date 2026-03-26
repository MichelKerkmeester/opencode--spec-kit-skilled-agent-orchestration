---
title: "Query complexity router"
description: "The query complexity router classifies incoming queries by term count and trigger match to select how many search channels run."
---

# Query complexity router

## 1. OVERVIEW

The query complexity router classifies incoming queries by term count and trigger match to select how many search channels run.

Not every question needs the same amount of effort to answer. This feature sizes up your question first, like a triage nurse, and routes simple lookups through a fast path while sending complex research questions through a deeper search. Without it, every question would get the full heavy-duty treatment, wasting time and resources on things that could be answered in seconds.

---

## 2. CURRENT REALITY

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers. Tier classification is driven exclusively by `termCount` and `triggerMatch`. `charCount` and `stopWordRatio` are informational features that influence confidence scoring only (see `determineConfidence()`). Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

The `SPECKIT_COMPLEXITY_ROUTER` flag is **enabled by default** (graduated Sprint 4, `isComplexityRouterEnabled()` returns `true` unless explicitly set to `"false"`). When the flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

The router's classification tier (`routeResult.tier`) is propagated into `traceMetadata.queryComplexity` in hybrid search (CHK-038), making it available in response envelopes when `includeTrace: true`. The formatter reads this via a fallback path from `traceMetadata` when stage metadata is unavailable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |
| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Trace propagation (`routeResult.tier` -> `traceMetadata.queryComplexity`, CHK-038) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/query-classifier.vitest.ts` | Query classification accuracy |
| `mcp_server/tests/query-router-channel-interaction.vitest.ts` | Channel interaction tests |
| `mcp_server/tests/query-router.vitest.ts` | Query routing logic |
| `mcp_server/tests/trace-propagation.vitest.ts` | Trace propagation chain integration tests |

---

## 4. TRACEABILITY

| Claim | Source | Lines |
|-------|--------|-------|
| Tier routing uses only `termCount` + `triggerMatch` | `query-classifier.ts` | 170-180 |
| `charCount` / `stopWordRatio` used for confidence only | `query-classifier.ts` `determineConfidence()` | 97-122 |
| Flag default is enabled (`raw !== 'false'`) | `query-classifier.ts` `isComplexityRouterEnabled()` | 43-46 |
| Tier propagated to `traceMetadata.queryComplexity` | `hybrid-search.ts` | CHK-038 |
| Classification accuracy tests | `query-classifier.vitest.ts` | — |

---

## 5. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Query complexity router
- Current reality source: FEATURE_CATALOG.md
