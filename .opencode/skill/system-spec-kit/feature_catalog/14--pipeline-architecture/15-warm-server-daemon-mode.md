---
title: "Warm server / daemon mode"
description: "Warm server / daemon mode is a deferred HTTP transport for persistent server execution, currently using stdio transport."
---

# Warm server / daemon mode

## 1. OVERVIEW

Warm server / daemon mode is a deferred HTTP transport for persistent server execution, currently using stdio transport.

Right now, the memory server starts fresh every time it is called and shuts down when the conversation ends. This planned feature would keep the server running in the background so it is always warm and ready, like leaving your car engine idling instead of restarting it every time you need to drive. It is deferred until the underlying connection standards settle down.

---

## 2. CURRENT REALITY

**PLANNED (Sprint 019): DEFERRED.** HTTP daemon transport for warm, persistent server execution is deferred while MCP SDK HTTP transport conventions continue evolving. Current transport remains stdio. Estimated effort: L (2-3 weeks).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Core | Current stdio transport and server lifecycle entrypoint |
| `mcp_server/lib/providers/embeddings.ts` | Lib | `shouldEagerWarmup()` remains permanently false while daemon mode is deferred |
| `mcp_server/cli.ts` | Core | CLI bootstrap path for server startup |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/context-server.vitest.ts` | Verifies stdio server behavior and core request lifecycle |
| `mcp_server/tests/lazy-loading.vitest.ts` | Verifies deferred warmup flags and `shouldEagerWarmup()` behavior |
| `mcp_server/tests/stdio-logging-safety.vitest.ts` | Verifies stdio-safe runtime logging in non-daemon mode |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Warm server / daemon mode
- Current reality source: FEATURE_CATALOG.md
