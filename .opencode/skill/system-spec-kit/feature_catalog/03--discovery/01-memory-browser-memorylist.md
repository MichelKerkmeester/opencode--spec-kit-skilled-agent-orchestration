---
title: "Memory browser (memory_list)"
description: "Covers the paginated browse endpoint that lists indexed memories with sorting and chunk inclusion options."
---

# Memory browser (memory_list)

## 1. OVERVIEW

Covers the paginated browse endpoint that lists indexed memories with sorting and chunk inclusion options.

This lets you browse through all stored memories page by page, like scrolling through a list of saved notes. You can sort by date or importance to find what you need. It is the simplest way to see what the system has stored without running a search query.

---

## 2. CURRENT REALITY

`memory_list` is the low-friction browse endpoint for indexed memories. It returns paginated parent memories by default, with `includeChunks: true` opting into child chunk rows. The payload includes `total`, `count`, `limit`, `offset`, the resolved `sortBy` and the current page of results.

The handler accepts three sort modes: `created_at`, `updated_at` and `importance_weight`. Invalid `sortBy` values do not fail the request. They fall back to `created_at` and the resolved choice is reflected in the response payload. Negative limits clamp to `1`, values above `100` clamp to `100`, and negative offsets clamp to `0`.

Validation and runtime failures return MCP error envelopes instead of raw throws. Direct handler calls with invalid `specFolder`, invalid `includeChunks`, or non-finite `limit`/`offset` values return `E_INVALID_INPUT` with a `requestId` in `data.details`. Database initialization/query failures also return MCP error envelopes.

An empty-string `specFolder` is treated the same as omitting the filter entirely. The edge-case regression now seeds rows in multiple folders before comparing the two code paths, so the contract is exercised against non-empty data rather than only against an empty in-memory database.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/memory-crud-list.ts` | Handler implementation, validation, pagination, and response shaping |
| `mcp_server/handlers/memory-crud.ts` | Public CRUD exports and snake_case compatibility aliases |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/lib/search/vector-index.ts` | Database access facade used by the handler |
| `mcp_server/utils/json-helpers.ts` | Parses `trigger_phrases` for `triggerCount` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-list-edge.vitest.ts` | Sort fallback, validation envelopes, pagination clamps, and empty-string `specFolder` parity against seeded rows |
| `mcp_server/tests/handler-memory-crud.vitest.ts` | Public export and direct input-validation coverage |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Happy-path list structure, chunk inclusion, and trigger count parsing |

---

## 4. SOURCE METADATA

- Group: Discovery
- Source feature title: Memory browser (memory_list)
- Current reality source: `mcp_server/handlers/memory-crud-list.ts` and discovery test coverage
