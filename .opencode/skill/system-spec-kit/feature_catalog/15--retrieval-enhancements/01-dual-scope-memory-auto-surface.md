---
title: "Dual-scope memory auto-surface"
description: "Dual-scope memory auto-surface fires at tool dispatch and session compaction to re-inject critical memories outside explicit search."
---

# Dual-scope memory auto-surface

## 1. OVERVIEW

Dual-scope memory auto-surface fires at tool dispatch and session compaction to re-inject critical memories outside explicit search.

When you are working on something, this feature automatically brings up important memories you might need without you having to ask for them. It watches for two key moments: when you use a tool and when a long conversation gets compressed. Think of it like a helpful assistant who notices what you are doing and quietly slides the right reference notes onto your desk.

---

## 2. CURRENT REALITY

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Core | Pre-dispatch handling for memory-aware tools (`autoSurfaceMemories` / `autoSurfaceAtCompaction`) |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/context-server.vitest.ts` | Tool-dispatch and compaction hook integration coverage |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Dual-scope memory auto-surface
- Current reality source: FEATURE_CATALOG.md
