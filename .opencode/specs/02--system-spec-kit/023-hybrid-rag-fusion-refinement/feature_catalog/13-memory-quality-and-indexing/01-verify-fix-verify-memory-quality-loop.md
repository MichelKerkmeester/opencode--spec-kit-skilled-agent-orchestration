# Verify-fix-verify memory quality loop

## Current Reality

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.

If the second attempt still fails, a third try runs with stricter trimming. After two failed retries, the memory is rejected outright.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Verify-fix-verify memory quality loop
- Summary match found: Yes
- Summary source feature title: Verify-fix-verify memory quality loop
- Current reality source: feature_catalog.md
