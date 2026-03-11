# Chunk ordering preservation

## Current Reality

When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk collapse and chunk_index-ordered reassembly |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Pipeline chunk reassembly and contentSource tagging |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Chunk/contentSource response typing |
| `mcp_server/formatters/search-results.ts` | Formatter | Emits reassembled_chunks/file_read_fallback provenance in responses |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB chunk collapse, ordering, and fallback behavior |
| `mcp_server/tests/pipeline-v2.vitest.ts` | Stage 3/4 pipeline metadata contract including chunk reassembly stats |
| `mcp_server/tests/search-results-format.vitest.ts` | Response formatter propagation of contentSource metadata |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | End-to-end chunk reassembly regression coverage |

## Source Metadata

- Group: Pipeline architecture
- Source feature title: Chunk ordering preservation
- Current reality source: feature_catalog.md
