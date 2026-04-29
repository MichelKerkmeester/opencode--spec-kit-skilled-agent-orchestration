---
title: "010 deep_loop_graph_upsert conditional"
description: "Verify deep-loop graph upsert runs only when graphEvents exist."
trigger_phrases:
  - "010"
  - "deep loop graph upsert conditional"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 010 deep_loop_graph_upsert conditional

## 1. OVERVIEW

Verify deep-loop graph upsert runs only when graphEvents exist.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify deep-loop graph upsert runs only when graphEvents exist.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 010 (deep_loop_graph_upsert conditional), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Read research YAML `step_graph_upsert` lines 817-836.
2. Read review YAML `step_graph_upsert` lines 841-863.
3. Run or inspect a fixture with and without `graphEvents`.

### Expected Output / Verification

With graphEvents, upsert parameters are built and the MCP call is present. Without graphEvents, workflow proceeds without upsert.

### Cleanup

Remove disposable research/review fixture folders if created.

### Variant Scenarios

Run direct `deep_loop_graph_status` before and after an upsert fixture.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 010
- Canonical root source: `manual_testing_playbook.md`

