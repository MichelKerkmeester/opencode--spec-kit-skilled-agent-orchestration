# Chunk collapse deduplication

## Current Reality

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| `mcp_server/handlers/memory-search.ts` | Handler | Chunk-collapse dedup helper used for search-response preparation without an `includeContent` gate |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunk-thinning.vitest.ts` | Chunk thinning tests |
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/handler-memory-search.vitest.ts` | `T002` chunk-collapse dedup regression tests (documented to run regardless of `includeContent`) |

## Source Metadata

- Group: Bug fixes and data integrity
- Source feature title: Chunk collapse deduplication
- Current reality source: feature_catalog.md
