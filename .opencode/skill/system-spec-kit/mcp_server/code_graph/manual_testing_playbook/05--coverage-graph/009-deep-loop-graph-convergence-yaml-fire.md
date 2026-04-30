---
title: "009 deep_loop_graph_convergence yaml fire"
description: "Verify deep-loop command YAML contains live convergence calls before stop voting."
trigger_phrases:
  - "009"
  - "deep loop graph convergence yaml fire"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 009 deep_loop_graph_convergence yaml fire

## 1. OVERVIEW

Verify deep-loop command YAML contains live convergence calls before stop voting.

---

## 2. SCENARIO CONTRACT

- Objective: Verify deep-loop command YAML contains live convergence calls before stop voting.
- Real user request: `Review the deep-research and deep-review auto YAML to confirm graph convergence is called before stop voting.`
- RCAF Prompt: `As a coverage graph workflow reviewer, inspect deep-loop command YAML convergence paths against the auto workflow files. Verify graph convergence MCP calls occur before inline stop logic and produce a convergence event. Return PASS/FAIL with file anchors and evidence excerpts.`
- Expected execution process: Read the specified deep-research and deep-review YAML line ranges, then optionally run a minimal deep-loop fixture and capture a graph convergence JSONL event.
- Expected signals: YAML calls `mcp__spec_kit_memory__deep_loop_graph_convergence` before inline stop logic and appends a graph convergence event.
- Desired user-visible outcome: A concise verdict explaining whether deep-loop stop voting is guarded by live graph convergence checks.
- Pass/fail: PASS if both YAML paths call graph convergence before stop logic and event evidence is present when run; FAIL if the call is missing, occurs after stop voting, or no convergence event can be observed in the fixture.

---

## 3. TEST EXECUTION

### Commands

1. Read `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:392-408`.
2. Read `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410-425`.
3. Optionally run a minimal deep-loop fixture and capture graph_convergence JSONL event.

### Expected Output / Verification

YAML calls `mcp__spec_kit_memory__deep_loop_graph_convergence` before inline stop logic and appends a graph convergence event.

### Cleanup

None.

### Variant Scenarios

Check confirm-mode YAML paths for parity.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 009
- Canonical root source: `manual_testing_playbook.md`
