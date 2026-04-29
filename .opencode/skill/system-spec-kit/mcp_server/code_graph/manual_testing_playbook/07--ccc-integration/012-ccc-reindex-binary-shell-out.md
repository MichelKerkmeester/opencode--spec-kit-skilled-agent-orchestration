---
title: "012 ccc_reindex binary shell out"
description: "Verify ccc_reindex shells out to the local ccc binary and reports unavailable binary cleanly."
trigger_phrases:
  - "012"
  - "ccc reindex binary shell out"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 012 ccc_reindex binary shell out

## 1. OVERVIEW

Verify ccc_reindex shells out to the local ccc binary and reports unavailable binary cleanly.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify ccc_reindex shells out to the local ccc binary and reports unavailable binary cleanly.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 012 (ccc_reindex binary shell out), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Call `ccc_status({})`.
2. If binary exists, call `ccc_reindex({"full":false})` in a disposable workspace.
3. If missing, capture the install error from `ccc_reindex`.

### Expected Output / Verification

Available binary path leads to `status:"ok"` with mode and duration; missing binary returns a clear install instruction.

### Cleanup

Remove copied CocoIndex index artifacts if generated.

### Variant Scenarios

Run with `full:true` only in a disposable copy.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 012
- Canonical root source: `manual_testing_playbook.md`

