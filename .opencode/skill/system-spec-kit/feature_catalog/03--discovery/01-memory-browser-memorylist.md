# Memory browser (memory_list)

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Covers the paginated browse endpoint that lists indexed memories with sorting and chunk inclusion options.

## 2. CURRENT REALITY

`memory_list` is the low-friction browse endpoint for indexed memories. It returns paginated parent memories by default, with `includeChunks: true` opting into child chunk rows. The payload includes `total`, `count`, `limit`, `offset`, the resolved `sortBy` and the current page of results.

The handler accepts three sort modes: `created_at`, `updated_at` and `importance_weight`. Invalid `sortBy` values do not fail the request. They fall back to `created_at` and the resolved choice is reflected in the response payload. Negative limits clamp to `1`, values above `100` clamp to `100`, and negative offsets clamp to `0`.

Validation and runtime failures return MCP error envelopes instead of raw throws. Direct handler calls with invalid `specFolder`, invalid `includeChunks`, or non-finite `limit`/`offset` values return `E_INVALID_INPUT` with a `requestId` in `data.details`. Database initialization/query failures also return MCP error envelopes.

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
| `mcp_server/tests/handler-memory-list-edge.vitest.ts` | Sort fallback, validation envelopes, pagination clamps, and default payload assertions |
| `mcp_server/tests/handler-memory-crud.vitest.ts` | Public export and direct input-validation coverage |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Happy-path list structure, chunk inclusion, and trigger count parsing |

## 4. SOURCE METADATA

- Group: Discovery
- Source feature title: Memory browser (memory_list)
- Current reality source: `mcp_server/handlers/memory-crud-list.ts` and discovery test coverage

## 5. IN SIMPLE TERMS

This lets you browse through all stored memories page by page, like scrolling through a list of saved notes. You can sort by date or importance to find what you need. It is the simplest way to see what the system has stored without running a search query.
