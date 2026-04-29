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

- **Goal**: Verify deep-loop command YAML contains live convergence calls before stop voting.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 009 (deep_loop_graph_convergence yaml fire), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

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

