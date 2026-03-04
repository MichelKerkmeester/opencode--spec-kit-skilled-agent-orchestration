# Search pipeline safety

## Current Reality

Three search pipeline issues were fixed:

**D1 — Summary quality bypass:** `stage1-candidate-gen.ts` allowed R8 summary hits to bypass the `minQualityScore` filter, letting low-quality summaries enter final results. Summary candidates now pass through the same quality filter.

**D2 — FTS5 double-tokenization:** `sqlite-fts.ts` and `bm25-index.ts` had separate tokenization logic, causing query terms to be tokenized differently than indexed content. Refactored to a shared `sanitizeQueryTokens()` function returning a raw token array that both callers join with their appropriate syntax.

**D3 — Quality floor vs RRF range mismatch:** `channel-representation.ts` used `QUALITY_FLOOR=0.2` which filtered out virtually all RRF-sourced results (RRF scores are typically 0.01-0.03). Lowered to 0.005.

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Search pipeline safety
- Summary match found: Yes
- Summary source feature title: Search pipeline safety
- Current reality source: feature_catalog.md
