---
title: "SG-002 -- MCP query tools"
description: "This scenario validates MCP query tools for `SG-002`. It focuses on the live SQLite query surface returning the expected depends_on relationship for mcp-figma."
---

# SG-002 -- MCP query tools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SG-002`.

---

## 1. OVERVIEW

This scenario validates MCP query tools for `SG-002`. It focuses on the live SQLite query surface returning the expected `depends_on` relationship for `mcp-figma`.

### Why This Matters

If the query tool does not reflect the live graph, operators cannot trust runtime graph traversal results even when the database itself looks healthy.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `SG-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `skill_graph_query` returns the current `depends_on` edge for `mcp-figma`
- Real user request: `"show the live skill graph dependency for mcp-figma"`
- Prompt: `As a SQLite graph query operator, call skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"}) against the live skill graph. Verify the relationships list contains an outbound depends_on edge from mcp-figma to mcp-code-mode with weight 0.9 and the context "MCP tool calls via Code Mode". Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `relationships[0].edge.targetId` is `mcp-code-mode`, `edge.edgeType` is `depends_on`, `edge.weight` is `0.9`, and the context matches `MCP tool calls via Code Mode`
- Pass/fail: PASS if the query returns the expected outbound dependency to `mcp-code-mode`; FAIL if the relationship is missing, points elsewhere, or reports the wrong weight or context

---

## 3. TEST EXECUTION

### Prompt

`As a SQLite graph query operator, call skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"}) against the live skill graph. Verify the relationships list contains an outbound depends_on edge from mcp-figma to mcp-code-mode with weight 0.9 and the context "MCP tool calls via Code Mode". Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `skill_graph_query({queryType:"depends_on",skillId:"mcp-figma"})`

### Expected

The response returns `status: "ok"` and includes an outbound `depends_on` relationship from `mcp-figma` to `mcp-code-mode` with weight `0.9` and context `MCP tool calls via Code Mode`.

### Evidence

Capture the full `skill_graph_query` response, including the relationship payload, edge weight, direction, and linked node metadata.

### Pass/Fail

- **Pass**: the query response includes the expected outbound `depends_on` edge to `mcp-code-mode`
- **Fail**: the relationship is missing, points to a different target, or reports the wrong weight or context

### Failure Triage

Inspect `.opencode/skill/mcp-figma/graph-metadata.json` for the source edge definition. Review `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts` for traversal or response-shaping issues. Re-run `skill_graph_status({})` to confirm the graph store is current before debugging query logic.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts` | Exposes `skill_graph_query` over the live SQLite graph store |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts` | Executes the `depends_on` traversal against SQLite tables |
| `.opencode/skill/mcp-figma/graph-metadata.json` | Declares the `mcp-figma -> mcp-code-mode` dependency being queried |

---

## 5. SOURCE METADATA

- Group: SQLite Graph
- Playbook ID: SG-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--sqlite-graph/002-mcp-query-tools.md`
