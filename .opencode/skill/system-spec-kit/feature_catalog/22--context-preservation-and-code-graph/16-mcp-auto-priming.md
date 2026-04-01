---
title: "MCP auto-priming"
description: "First-call session context injection that delivers a Prime Package containing constitutional memories, code graph status, and triggered context on the first MCP tool call."
---

# MCP auto-priming

## 1. OVERVIEW

First-call session context injection that delivers a Prime Package containing constitutional memories, code graph status, and triggered context on the first MCP tool call.

The memory-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.

---

## 2. CURRENT REALITY

mcp_server/hooks/memory-surface.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface with priming state tracking and PrimePackage assembly |
| `mcp_server/hooks/response-hints.ts` | Hook | Injects Prime Package into MCP response envelope hints |
| `mcp_server/handlers/session-health.ts` | Handler | Exposes primingStatus (primed/not_primed) |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: MCP auto-priming
- Current reality source: spec 024-compact-code-graph phase 018
