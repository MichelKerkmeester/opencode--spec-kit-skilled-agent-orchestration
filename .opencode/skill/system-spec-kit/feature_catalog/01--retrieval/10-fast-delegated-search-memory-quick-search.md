---
title: "Fast delegated search (memory_quick_search)"
description: "Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10)."
---

# Fast delegated search (memory_quick_search)

## 1. OVERVIEW

Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10).

When you want fast search results without configuring the full 31-parameter surface of `memory_search`, use `memory_quick_search` instead. You provide a natural language query and optionally a result limit or spec folder scope. The tool fills in sensible defaults and hands off to the full search pipeline. The results are identical to what `memory_search` would return with those same settings — this is purely a convenience layer, not a separate search path.

---

## 2. CURRENT REALITY

The `memory_quick_search` tool is defined in `tool-schemas.ts` as an E3 (ergonomics) entry point. It accepts 3 primary parameters — `query` (required, 2-1000 chars), `limit` (optional, 1-100, default 10), and `specFolder` (optional) — plus governance boundary fields (`tenantId`, `userId`, `agentId`, `sharedSpaceId`).

In the dispatch layer (`tools/memory-tools.ts`), the `memory_quick_search` case validates the incoming arguments against the `memoryQuickSearchSchema` (Zod schema in `schemas/tool-input-schemas.ts`), then constructs a full `SearchArgs` object with the following hardcoded defaults:

- `autoDetectIntent: true` — intent is inferred from the query
- `enableDedup: true` — session deduplication is active
- `includeContent: true` — full content is returned with results
- `includeConstitutional: true` — constitutional memories are included
- `rerank: true` — cross-encoder reranking is applied

The constructed `SearchArgs` are passed directly to `handleMemorySearch()`, the same handler used by `memory_search`. There is no separate search path — `memory_quick_search` is a thin delegation layer only.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/tool-schemas.ts` | Core | Tool definition with name, description, and JSON Schema input |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod validation schema (`memoryQuickSearchSchema`) and allowed parameters |
| `mcp_server/tools/memory-tools.ts` | Tool | Dispatch case: validates args, builds `SearchArgs` with defaults, delegates to `handleMemorySearch` |
| `mcp_server/handlers/memory-search.ts` | Handler | Search handler that executes the full pipeline (shared with `memory_search`) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/tool-input-schema.vitest.ts` | Schema validation for quick_search parameters |
| `mcp_server/tests/memory-tools.vitest.ts` | Dispatch and delegation behavior |
| `mcp_server/tests/context-server.vitest.ts` | Integration coverage including quick_search registration |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: Fast delegated search (memory_quick_search)
- Current reality source: mcp_server/tool-schemas.ts definition and mcp_server/tools/memory-tools.ts dispatch logic
