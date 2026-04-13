---
title: "GB-001 -- Dependency Pull-Up"
description: "This scenario validates Dependency Pull-Up for `GB-001`. It focuses on depends_on edges pulling prerequisite skills into the ranked results without displacing the direct match."
---

# GB-001 -- Dependency Pull-Up

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-001`.

---

## 1. OVERVIEW

This scenario validates Dependency Pull-Up for `GB-001`. It focuses on depends_on edges pulling prerequisite skills into the ranked results without displacing the direct match.

### Why This Matters

If dependency pull-up fails, operators can route into Figma workflows without also surfacing Code Mode, which breaks the MCP execution path those workflows depend on.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify depends_on edges pull prerequisite skills into the results
- Real user request: `"use figma to export designs"`
- Prompt: `As a graph boost validation operator, validate dependency pull-up behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "use figma to export designs" --threshold 0. Verify mcp-figma stays top-1 and mcp-code-mode appears with !graph:depends evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: mcp-figma is top-1, mcp-code-mode appears with `!graph:depends(mcp-figma,0.9)`, and both entries pass threshold
- Pass/fail: PASS if mcp-code-mode appears with graph depends evidence while mcp-figma remains top-1; FAIL if mcp-code-mode is missing, lacks the graph reason, or displaces the direct match

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate dependency pull-up behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "use figma to export designs" --threshold 0. Verify mcp-figma stays top-1 and mcp-code-mode appears with !graph:depends evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "use figma to export designs" --threshold 0`

### Expected

mcp-figma is the top-1 result. mcp-code-mode also appears in the ranked results with `!graph:depends(mcp-figma,0.9)` in the reason field, and both entries pass threshold.

### Evidence

Capture the full JSON output showing both skill entries, their confidence scores, the passes_threshold flags, and the graph-derived reason on mcp-code-mode.

### Pass/Fail

- **Pass**: mcp-figma is top-1 and mcp-code-mode appears with the expected graph depends reason
- **Fail**: mcp-code-mode is missing, lacks the graph depends reason, or mcp-figma is no longer top-1

### Failure Triage

Check `.opencode/skill/mcp-figma/graph-metadata.json` for the depends_on edge to mcp-code-mode. Verify `.opencode/skill/skill-advisor/scripts/skill-graph.json` still compiles that adjacency. Review dependency pull-up handling in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine that applies dependency pull-up boosts |
| `.opencode/skill/mcp-figma/graph-metadata.json` | Source metadata declaring the depends_on edge to mcp-code-mode |
| `.opencode/skill/mcp-code-mode/graph-metadata.json` | Companion skill metadata expected to be surfaced by the dependency pull-up |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/001-dependency-pullup.md`
