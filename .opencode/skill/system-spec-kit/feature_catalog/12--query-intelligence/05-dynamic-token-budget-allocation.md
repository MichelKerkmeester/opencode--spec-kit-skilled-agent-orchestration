---
title: "Dynamic token budget allocation"
description: "Dynamic token budget allocation scales the token budget returned per query based on query complexity tier."
---

# Dynamic token budget allocation

## 1. OVERVIEW

Dynamic token budget allocation scales the token budget returned per query based on query complexity tier.

Every answer the system gives takes up space in a limited response window. This feature gives simple questions a small response budget and saves the big budget for complex questions that genuinely need more room. Think of it like packing a lunch bag versus a suitcase: you match the container to what you actually need to carry.

---

## 2. CURRENT REALITY

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead of about `~26` tokens per result (`CONTEXT_HEADER_TOKEN_OVERHEAD = Math.ceil((100 + 1) / 4)`, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Budget adjustment with header overhead (CHK-060) |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/dynamic-token-budget.vitest.ts` | Token budget computation |
| `mcp_server/tests/query-classifier.vitest.ts` | Query classification accuracy |
| `mcp_server/tests/token-budget.vitest.ts` | Token budget tests + CHK-023 adjustedBudget formula |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Dynamic token budget allocation
- Current reality source: FEATURE_CATALOG.md
