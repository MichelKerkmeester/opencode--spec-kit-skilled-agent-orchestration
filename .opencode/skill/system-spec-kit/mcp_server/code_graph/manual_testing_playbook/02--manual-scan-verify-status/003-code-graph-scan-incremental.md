---
title: "003 code_graph_scan incremental"
description: "Confirm incremental scan skips fresh files and prunes deleted tracked files."
trigger_phrases:
  - "003"
  - "code graph scan incremental"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 003 code_graph_scan incremental

## 1. OVERVIEW

Confirm incremental scan skips fresh files and prunes deleted tracked files.

---

## 2. SCENARIO CONTRACT

- **Goal**: Confirm incremental scan skips fresh files and prunes deleted tracked files.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 003 (code_graph_scan incremental), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Run `code_graph_scan({"rootDir":"$WORK","incremental":false})`.
2. Delete one indexed fixture file.
3. Run `code_graph_scan({"rootDir":"$WORK","incremental":true})`.
4. Inspect returned `filesSkipped`, `filesIndexed`, and readiness.

### Expected Output / Verification

Incremental scan returns `status:"ok"`, reports skipped/fresh files, and no deleted file remains in graph query/status evidence.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run with no changes and verify most files are skipped.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 003
- Canonical root source: `manual_testing_playbook.md`

