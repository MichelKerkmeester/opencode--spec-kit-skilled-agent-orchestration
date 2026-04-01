---
title: "Tool routing enforcement"
description: "5-layer active enforcement system that routes AI tool selection: semantic queries to CocoIndex, structural queries to Code Graph, exact text to Grep — replacing passive CLAUDE.md instructions with MCP-level enforcement."
---

# Tool routing enforcement

## 1. OVERVIEW

5-layer active enforcement system that routes AI tool selection: semantic queries to CocoIndex, structural queries to Code Graph, exact text to Grep — replacing passive CLAUDE.md instructions with MCP-level enforcement.

Phase 025 addresses the root cause of AI tool misjudgment by adding active enforcement at the MCP layer. Five complementary layers work together: (1) buildServerInstructions() injects routing rules into every MCP session, (2) PrimePackage includes routingRules directives during session priming, (3) tool response hints detect code-search patterns and redirect to appropriate tools, (4) runtime instruction files (CLAUDE.md, CODEX.md, GEMINI.md) contain active decision trees, and (5) context-prime agent definitions output routing rules. This makes correct tool selection structurally enforced rather than instructionally suggested.

---

## 2. CURRENT REALITY

mcp_server/context-server.ts (buildServerInstructions), mcp_server/hooks/memory-surface.ts (PrimePackage routing), mcp_server/hooks/response-hints.ts (reactive hints)

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Server | Tool-routing section in buildServerInstructions() with availability checks |
| `mcp_server/hooks/memory-surface.ts` | Hook | PrimePackage.routingRules with CocoIndex/Code Graph directives |
| `mcp_server/hooks/response-hints.ts` | Hook | Reactive hints detecting code-search patterns in tool calls |
| `mcp_server/tool-schemas.ts` | Schema | Enriched tool descriptions with routing guidance |
| `mcp_server/lib/session/session-snapshot.ts` | Lib | cocoIndexAvailable and routingRecommendation in session state |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Tool routing enforcement
- Current reality source: spec 024-compact-code-graph phase 025
