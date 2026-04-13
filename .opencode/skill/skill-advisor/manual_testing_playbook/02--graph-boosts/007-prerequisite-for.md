---
title: "GB-007 -- Prerequisite_for Compiled"
description: "This scenario validates Prerequisite_for Compiled for `GB-007`. It focuses on prerequisite_for edges surviving compilation into the runtime adjacency map."
---

# GB-007 -- Prerequisite_for Compiled

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-007`.

---

## 1. OVERVIEW

This scenario validates Prerequisite_for Compiled for `GB-007`. It focuses on prerequisite_for edges surviving compilation into the runtime adjacency map.

### Why This Matters

If prerequisite_for edges vanish during compilation, dependency-aware MCP routing loses the bridge back to Code Mode and operators miss the orchestration skill required to execute the downstream tool.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify prerequisite_for edges are preserved in compiled adjacency
- Real user request: `"inspect compiled prerequisite_for adjacency for mcp-code-mode"`
- Prompt: `As a graph boost validation operator, validate prerequisite_for compilation against .opencode/skill/skill-advisor/scripts/skill-graph.json for mcp-code-mode. Verify the compiled adjacency includes prerequisite_for entries for mcp-figma, mcp-clickup, and mcp-chrome-devtools. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: the compiled adjacency for mcp-code-mode contains a `prerequisite_for` key with entries for mcp-figma, mcp-clickup, and mcp-chrome-devtools
- Pass/fail: PASS if prerequisite_for edges are present for all expected skills; FAIL if the key is missing or expected entries are absent

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate prerequisite_for compilation against .opencode/skill/skill-advisor/scripts/skill-graph.json for mcp-code-mode. Verify the compiled adjacency includes prerequisite_for entries for mcp-figma, mcp-clickup, and mcp-chrome-devtools. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 -c "import json; g=json.load(open('.opencode/skill/skill-advisor/scripts/skill-graph.json')); print(json.dumps(g['adjacency'].get('mcp-code-mode',{}), indent=2))"`

### Expected

The printed adjacency for mcp-code-mode includes a `prerequisite_for` section containing mcp-figma, mcp-clickup, and mcp-chrome-devtools.

### Evidence

Capture the printed JSON block for `adjacency.mcp-code-mode`, making sure the prerequisite_for group and all expected target skills are visible in the transcript.

### Pass/Fail

- **Pass**: prerequisite_for edges are present in the compiled adjacency for all expected targets
- **Fail**: prerequisite_for is missing entirely, or one of the expected targets is absent

### Failure Triage

Check `.opencode/skill/mcp-code-mode/graph-metadata.json` for the prerequisite_for declarations. Verify `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` still emits prerequisite_for in compiled adjacency. Rebuild and inspect `.opencode/skill/skill-advisor/scripts/skill-graph.json` if the runtime file looks stale.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Compiler that emits prerequisite_for adjacency groups |
| `.opencode/skill/mcp-code-mode/graph-metadata.json` | Source metadata declaring prerequisite_for targets for mcp-code-mode |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled runtime graph inspected by the validation command |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/007-prerequisite-for.md`
