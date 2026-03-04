# Dynamic token budget allocation

## Current Reality

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead (~12 tokens per result, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

## Source Metadata

- Group: Query intelligence
- Source feature title: Dynamic token budget allocation
- Summary match found: Yes
- Summary source feature title: Dynamic token budget allocation
- Current reality source: feature_catalog.md
