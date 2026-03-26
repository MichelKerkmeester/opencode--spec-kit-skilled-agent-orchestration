---
title: "Backend storage adapter abstraction"
description: "Backend storage adapter abstraction now exists as a shipped vector-store seam while SQLite remains the concrete backend."
---

# Backend storage adapter abstraction

## 1. OVERVIEW

Backend storage adapter abstraction now exists as a shipped vector-store seam while SQLite remains the concrete backend.

The system is still SQLite-backed, but it is no longer hard-wired directly at every vector-search call site. A small adapter layer now defines the vector-store contract and keeps the storage implementation swappable at the vector boundary. It is like changing from plugging appliances straight into the wall to using a standardized socket adapter first. You still use the same power source today, but the coupling point is cleaner and easier to replace later if scale ever demands it.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019 closeout).** `IVectorStore` defines the vector-storage contract and `SQLiteVectorStore` provides the current production implementation. The broader graph/document storage stack still runs concretely on SQLite, so the shipped seam is intentionally scoped: vector storage is abstracted, while graph/document stores remain direct SQLite integrations until a real multi-backend need appears.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store contract consumed by the search/storage layer |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | SQLite implementation of the vector-store contract |
| `mcp_server/lib/search/vector-index.ts` | Lib | Stable facade re-exporting the storage seam |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/interfaces.vitest.ts` | Interface contract coverage for `IVectorStore` |
| `mcp_server/tests/pipeline-architecture-remediation.vitest.ts` | Direct audit traceability coverage for the adapter seam |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Vector-index implementation coverage through the storage facade |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Backend storage adapter abstraction
- Current reality source: FEATURE_CATALOG.md
