# Provenance-rich response envelopes

## Current Reality

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Provenance-rich response envelopes
- Summary match found: Yes
- Summary source feature title: Provenance-rich response envelopes
- Current reality source: feature_catalog.md
