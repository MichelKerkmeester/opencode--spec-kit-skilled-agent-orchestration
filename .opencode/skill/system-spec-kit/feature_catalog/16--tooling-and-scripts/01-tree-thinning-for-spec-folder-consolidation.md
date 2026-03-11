# Tree thinning for spec folder consolidation

## Current Reality

Chunk thinning in the MCP server scores chunks by anchor presence and content density, then drops low-signal chunks before child chunk indexing. The runtime flow is `chunkLargeFile()` (anchor-aware chunking) followed by `thinChunks()` (quality thinning) in `indexChunkedMemoryFile()`.

The save-time workflow integration is documented as **R7: Chunk Thinning** in `mcp_server/lib/search/README.md`, and the active runtime call happens in `mcp_server/handlers/chunking-orchestrator.ts`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib (primary) | Chunk thinning (`scoreChunk()`, `thinChunks()`) |
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib (supporting) | Anchor-aware chunk generation (`chunkLargeFile()`) |

### Integration

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Calls `thinChunks(chunkResult.chunks)` in `indexChunkedMemoryFile()` before chunk indexing |
| `mcp_server/lib/search/README.md` | Search docs | Documents save-time workflow step **R7: Chunk Thinning** |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunk-thinning.vitest.ts` | Chunk thinning tests |

## Source Metadata

- Group: Tooling and scripts
- Source feature title: Tree thinning for spec folder consolidation
- Current reality source: feature_catalog.md
