# ANCHOR tags as graph nodes

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Promoting parsed ANCHOR markers into typed graph nodes (most creative insight from cross-AI research, Gemini-2) is deferred behind a dedicated 2-day feasibility spike. Estimated effort: S-M (3-5 days).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/anchor-metadata.vitest.ts` | Anchor metadata tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/retrieval-trace.vitest.ts` | Retrieval trace tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: ANCHOR tags as graph nodes
- Current reality source: feature_catalog.md
