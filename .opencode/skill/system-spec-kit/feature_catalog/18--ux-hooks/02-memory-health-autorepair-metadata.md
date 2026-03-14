# Memory health autoRepair metadata

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Memory health autoRepair returns structured repair metadata with partial-success tracking when `autoRepair:true` runs in `reportMode: "full"`.

## 2. CURRENT REALITY
`memory_health` accepts optional `autoRepair` execution only in `reportMode: "full"` and returns structured repair metadata. If `autoRepair:true` is sent without `confirmed:true`, the handler returns a confirmation-only response that lists the repair actions it would attempt.

Repair metadata semantics for mixed outcomes:

- The repair action inventory is limited to the actual runtime payload values: `fts_rebuild`, `trigger_cache_refresh`, `fts_consistency_verified` when the rebuilt FTS row count matches `memory_index` and orphan-edge cleanup (`orphan_edges_cleaned:N` when deletions occur).
- `repair.repaired` is `true` only when every attempted repair action succeeds.
- `repair.partialSuccess` is `true` when at least one attempted repair succeeds and at least one fails.
- If FTS rebuild still mismatches but orphan-edge cleanup succeeds, the response reports `repair.repaired: false`, `repair.partialSuccess: true`, keeps the FTS warning and includes the orphan cleanup action in `repair.actions`.

## 3. IN SIMPLE TERMS
When you run a health check on the memory system and ask it to fix problems, it now tells you exactly what it tried to repair, what succeeded and what failed. Before this, you would only get a pass or fail result. Now you get a detailed report, like a car mechanic who hands you an itemized list showing which parts were replaced and which still need attention.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Health diagnostics handler |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge storage |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Test | Auto-repair metadata and partial-success scenarios |
| `mcp_server/tests/handler-memory-health-edge.vitest.ts` | Test | Input validation and confirmation-only response coverage |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Auto-repair metadata and partial-success scenarios |
| `mcp_server/tests/handler-memory-health-edge.vitest.ts` | Confirmation and validation edge cases |

## 5. SOURCE METADATA
- Group: UX hooks automation (Phase 014)
- Source feature title: Memory health autoRepair metadata
- Current reality source: feature_catalog.md

