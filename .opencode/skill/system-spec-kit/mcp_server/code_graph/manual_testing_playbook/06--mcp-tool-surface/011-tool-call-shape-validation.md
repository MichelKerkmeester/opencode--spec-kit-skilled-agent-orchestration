---
title: "011 tool call shape validation"
description: "Verify dispatcher/schema validation catches malformed code_graph and CCC tool calls."
trigger_phrases:
  - "011"
  - "tool call shape validation"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 011 tool call shape validation

## 1. OVERVIEW

Verify dispatcher/schema validation catches malformed code_graph and CCC tool calls.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify dispatcher/schema validation catches malformed code_graph and CCC tool calls.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 011 (tool call shape validation), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Call `code_graph_query({"operation":"outline"})` with missing subject.
2. Call `detect_changes({})` with missing diff.
3. Call `ccc_feedback({"query":"x"})` with missing rating.

### Expected Output / Verification

Each malformed call returns `status:"error"` or schema validation error naming missing fields; valid shape reaches the handler.

### Cleanup

None.

### Variant Scenarios

Check `tool-input-schemas.ts` allowlisted keys for extra-property rejection.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 011
- Canonical root source: `manual_testing_playbook.md`

