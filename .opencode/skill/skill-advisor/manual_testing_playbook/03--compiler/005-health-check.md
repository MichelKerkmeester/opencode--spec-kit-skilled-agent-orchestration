---
title: "CP-005 -- Health Check Integration"
description: "This scenario validates Health Check Integration for `CP-005`. It focuses on the advisor health output reporting live graph status and cache diagnostics."
---

# CP-005 -- Health Check Integration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CP-005`.

---

## 1. OVERVIEW

This scenario validates Health Check Integration for `CP-005`. It focuses on the advisor health output reporting live graph status and cache diagnostics.

### Why This Matters

If the health check stops reporting graph status, operators lose the fastest way to confirm whether routing is reading the compiled graph at all.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CP-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify advisor health output reports graph load state and skill count
- Real user request: `"run the skill advisor health check"`
- Prompt: `As a compiler validation operator, validate health output against .opencode/skill/skill-advisor/scripts/skill_advisor.py --health. Verify skill_graph_loaded is true, skill_graph_skill_count reports 21, and status is ok. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `"skill_graph_loaded": true`, `"skill_graph_skill_count": 21`, and `"status": "ok"` appear in the JSON diagnostics output
- Pass/fail: PASS if those fields are present with the expected values; FAIL if the graph is not loaded, the count drifts unexpectedly, or status is not ok

---

## 3. TEST EXECUTION

### Prompt

`As a compiler validation operator, validate health output against .opencode/skill/skill-advisor/scripts/skill_advisor.py --health. Verify skill_graph_loaded is true, skill_graph_skill_count reports 21, and status is ok. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health`

### Expected

The health JSON shows `skill_graph_loaded` as true, reports the current graph skill count as 21, and sets `status` to `ok`.

### Evidence

Capture the full JSON diagnostics output, including cache information, graph path, graph-loaded state, skill count, and status.

### Pass/Fail

- **Pass**: `skill_graph_loaded` is true, `skill_graph_skill_count` is 21, and `status` is `ok`
- **Fail**: The graph is not loaded, the reported count is not 21, or status is not `ok`

### Failure Triage

Inspect `health_check()` in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`. Review cache status helpers in `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`. Confirm `.opencode/skill/skill-advisor/scripts/skill-graph.json` exists at the reported path and is readable.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Advisor entry point that emits health diagnostics |
| `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` | Runtime helper exposing cache status used by the health output |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled graph file whose load state and skill count are reported |

---

## 5. SOURCE METADATA

- Group: Compiler
- Playbook ID: CP-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--compiler/005-health-check.md`
