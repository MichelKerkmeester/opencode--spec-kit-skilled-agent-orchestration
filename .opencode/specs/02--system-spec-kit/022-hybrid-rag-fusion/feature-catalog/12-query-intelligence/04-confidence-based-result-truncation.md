# Confidence-based result truncation

## Current Reality

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled: NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/confidence-truncation.vitest.ts` | Truncation behavior |

## Source Metadata

- Group: Query intelligence
- Source feature title: Confidence-based result truncation
- Current reality source: feature_catalog.md
