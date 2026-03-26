---
title: "Dynamic server instructions at MCP initialization"
description: "Dynamic server instructions inject a memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload at startup."
---

# Dynamic server instructions at MCP initialization

## 1. OVERVIEW

Dynamic server instructions inject a memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload at startup.

When the memory server starts up, it now tells the calling AI how many memories are stored, how many folders exist and which search methods are available. This is like a librarian greeting you at the door with a summary of what the library has today. It helps the AI make smarter decisions about how to search right from the start.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Core | MCP server entry point; calls `server.setInstructions()` with dynamic overview at startup |
| `mcp_server/handlers/memory-crud-stats.ts` | Handler | `memory_stats` logic reused to compute total memories, spec folder count, channels, stale count |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isDynamicInitEnabled()` flag accessor (`SPECKIT_DYNAMIC_INIT`, default ON) |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | `isFeatureEnabled()` used by the flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/context-server.vitest.ts` | Dynamic instructions injection, `SPECKIT_DYNAMIC_INIT` flag behavior |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Dynamic server instructions at MCP initialization
- Current reality source: FEATURE_CATALOG.md
