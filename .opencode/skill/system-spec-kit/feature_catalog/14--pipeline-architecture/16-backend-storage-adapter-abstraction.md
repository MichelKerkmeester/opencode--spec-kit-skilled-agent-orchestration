# Backend storage adapter abstraction

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Vector/graph/document storage abstractions (`IVectorStore`, `IGraphStore`, `IDocumentStore`) are deferred to avoid premature abstraction while SQLite coupling handles current scale. Estimated effort: M-L (1-2 weeks).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Backend storage adapter abstraction
- Current reality source: feature_catalog.md
