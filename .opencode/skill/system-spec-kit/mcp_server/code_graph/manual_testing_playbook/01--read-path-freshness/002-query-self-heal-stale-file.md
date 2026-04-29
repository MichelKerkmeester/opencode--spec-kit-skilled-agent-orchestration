---
title: "002 query self-heal stale file"
description: "Validate the code_graph_query handler self-heal path and full-scan refusal behavior."
trigger_phrases:
  - "002"
  - "query self heal stale file"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 002 query self-heal stale file

## 1. OVERVIEW

Validate the code_graph_query handler self-heal path and full-scan refusal behavior.

---

## 2. SCENARIO CONTRACT

- **Goal**: Validate the code_graph_query handler self-heal path and full-scan refusal behavior.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 002 (query self-heal stale file), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Run a full scan in a disposable copy.
2. Modify one tracked file and call `code_graph_query` for outline.
3. Modify more than 50 tracked files and call `code_graph_query` again.

### Expected Output / Verification

Single-file stale state is repaired or answered with readiness metadata. Broad stale state returns a blocked payload with `requiredAction:"code_graph_scan"` or equivalent fallback decision.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run the same broad stale fixture through `code_graph_context` to compare blocked envelope parity.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 002
- Canonical root source: `manual_testing_playbook.md`

