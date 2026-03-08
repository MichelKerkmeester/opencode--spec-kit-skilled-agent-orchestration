# Provenance-rich response envelopes

## Current Reality

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/envelope.vitest.ts` | Response envelope tests |
| `mcp_server/tests/mcp-response-envelope.vitest.ts` | MCP envelope tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Provenance-rich response envelopes
- Current reality source: feature_catalog.md
