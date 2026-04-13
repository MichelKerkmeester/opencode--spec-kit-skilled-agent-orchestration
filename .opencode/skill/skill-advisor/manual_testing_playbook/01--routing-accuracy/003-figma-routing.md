---
title: "RA-003 -- Figma MCP Routing"
description: "This scenario validates Figma MCP Routing for `RA-003`. It focuses on correct routing of figma prompts to mcp-figma with mcp-code-mode as dependency companion."
---

# RA-003 -- Figma MCP Routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RA-003`.

---

## 1. OVERVIEW

This scenario validates Figma MCP Routing for `RA-003`. It focuses on correct routing of figma prompts to mcp-figma with mcp-code-mode appearing as a dependency companion via graph edges.

### Why This Matters

If figma prompts fail to pull up mcp-code-mode as a dependency, operators will load the Figma skill without the MCP orchestration layer required to execute Figma tool calls -- resulting in broken workflows.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `RA-003` and confirm the expected signals without contradictory evidence.

- Objective: Correct routing of figma prompts with dependency companion
- Real user request: `"export figma components as images"`
- Prompt: `As a routing accuracy operator, validate figma MCP routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "export figma components as images". Verify mcp-figma is top-1 and mcp-code-mode appears in results. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: mcp-figma as top-1, mcp-code-mode present via graph:depends, both pass threshold
- Pass/fail: PASS if mcp-figma is top-1 AND mcp-code-mode appears; FAIL if mcp-figma not top-1 or mcp-code-mode missing

---

## 3. TEST EXECUTION

### Prompt

`As a routing accuracy operator, validate figma MCP routing against .opencode/skill/skill-advisor/scripts/skill_advisor.py "export figma components as images". Verify mcp-figma is top-1 and mcp-code-mode appears in results. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "export figma components as images"`

### Expected

mcp-figma is top-1. mcp-code-mode also appears in the results with `!graph:depends` in its match reason. Both skills pass threshold.

### Evidence

Capture the full JSON output showing both skill entries, their confidence scores, and match reasons -- especially the graph:depends reason on mcp-code-mode.

### Pass/Fail

- **Pass**: mcp-figma is top-1 AND mcp-code-mode appears in results with dependency reason
- **Fail**: mcp-figma not top-1, or mcp-code-mode missing from results

### Failure Triage

Check mcp-figma graph-metadata.json for depends_on edge pointing to mcp-code-mode. Verify `.opencode/skill/skill-advisor/scripts/skill_advisor.py` dependency pull-up logic is active. Confirm `.opencode/skill/skill-advisor/scripts/skill-graph.json` adjacency includes the depends relationship.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine under test |
| `.opencode/skill/mcp-figma/graph-metadata.json` | Graph metadata defining mcp-figma signals and edges |
| `.opencode/skill/mcp-code-mode/graph-metadata.json` | Graph metadata for the dependency companion skill |

---

## 5. SOURCE METADATA

- Group: Routing Accuracy
- Playbook ID: RA-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--routing-accuracy/003-figma-routing.md`
