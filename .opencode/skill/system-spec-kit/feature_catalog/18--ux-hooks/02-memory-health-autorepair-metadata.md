---
title: "Memory health autoRepair metadata"
description: "Memory health autoRepair returns structured repair metadata with partial-success tracking when `autoRepair:true` runs in `reportMode: \"full\"`."
---

# Memory health autoRepair metadata

## 1. OVERVIEW

Memory health autoRepair returns structured repair metadata with partial-success tracking when `autoRepair:true` runs in `reportMode: "full"`.

When you run a health check on the memory system and ask it to fix problems, it now tells you exactly what it tried to repair, what succeeded and what failed. Before this, you would only get a pass or fail result. Now you get a detailed report, like a car mechanic who hands you an itemized list showing which parts were replaced and which still need attention.

---

## 2. CURRENT REALITY

`memory_health` accepts optional `autoRepair` execution only in `reportMode: "full"` and returns structured repair metadata. If `autoRepair:true` is sent without `confirmed:true`, the handler returns a confirmation-only response that lists the repair actions it would attempt.

Repair metadata semantics for mixed outcomes:

- The repair action inventory is limited to the actual runtime payload values: `fts_rebuild`, `trigger_cache_refresh`, `fts_consistency_verified` when the rebuilt FTS row count matches `memory_index`, orphan-edge cleanup (`orphan_edges_cleaned:N` when deletions occur), orphan-vector cleanup (`orphan_vectors_cleaned:N` when deletions occur), and orphan-chunk cleanup (`orphan_chunks_cleaned:N` when deletions occur).
- `repair.repaired` is `true` only when every attempted repair action succeeds.
- `repair.partialSuccess` is `true` when at least one attempted repair succeeds and at least one fails.
- If FTS rebuild still mismatches but orphan cleanup succeeds, the response reports `repair.repaired: false`, `repair.partialSuccess: true`, keeps the FTS warning and includes the successful orphan cleanup actions in `repair.actions`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Health diagnostics handler with autoRepair, confirmation-only, and partial-success logic |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | Repair metadata type definitions including `partialSuccess` and `repaired` fields |
| `mcp_server/core/db-state.ts` | Core | Database state management for FTS rebuild and orphan cleanup |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage for orphan-edge cleanup actions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade for orphan-vector cleanup actions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Auto-repair metadata and partial-success scenarios |
| `mcp_server/tests/handler-memory-health-edge.vitest.ts` | Confirmation and validation edge cases |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Memory health autoRepair metadata
- Current reality source: FEATURE_CATALOG.md
