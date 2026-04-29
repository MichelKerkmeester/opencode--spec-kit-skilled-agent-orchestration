---
title: "005 code_graph_verify blocked on stale"
description: "Prove code_graph_verify refuses stale graph state before executing the gold battery."
trigger_phrases:
  - "005"
  - "code graph verify blocked on stale"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 005 code_graph_verify blocked on stale

## 1. OVERVIEW

Prove code_graph_verify refuses stale graph state before executing the gold battery.

---

## 2. SCENARIO CONTRACT

- **Goal**: Prove code_graph_verify refuses stale graph state before executing the gold battery.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 005 (code_graph_verify blocked on stale), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Modify a tracked source file.
3. Call `code_graph_verify({"rootDir":"$WORK"})`.
4. Run `code_graph_scan({"rootDir":"$WORK","incremental":false})` and call verify again.

### Expected Output / Verification

First verify returns `status:"blocked"` with readiness. Second verify returns `status:"ok"` with `result.passed` and pass-rate fields.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run with `allowInlineIndex:true` and a single stale file to test the selective repair option.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 005
- Canonical root source: `manual_testing_playbook.md`

