# Pre-flight token budget validation

## Current Reality

Before assembling the final response, the system estimates total token count across all candidate results and truncates to the highest-scoring candidates when the total exceeds the configured budget. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the usable budget is first reduced by header overhead (~12 tokens per result, floor 200 tokens) to account for injected `[parent > child — desc]` headers (CHK-060). The truncation strategy is greedy: highest scores first, never round-robin.

For `includeContent=true` queries where a single result overshoots the budget, a summary (first 400 characters) replaces raw content rather than returning nothing.

Overflow events are logged with query ID, candidate count, total tokens, budget limit and the number of results after truncation. This prevents the response from blowing through the caller's context window.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Pre-flight token budget validation
- Current reality source: feature_catalog.md
