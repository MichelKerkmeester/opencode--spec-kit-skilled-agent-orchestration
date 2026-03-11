# Dynamic token budget allocation

## Current Reality

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead (~12 tokens per result, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

## Source Files

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

## Source Metadata

- Group: Query intelligence
- Source feature title: Dynamic token budget allocation
- Current reality source: feature_catalog.md
