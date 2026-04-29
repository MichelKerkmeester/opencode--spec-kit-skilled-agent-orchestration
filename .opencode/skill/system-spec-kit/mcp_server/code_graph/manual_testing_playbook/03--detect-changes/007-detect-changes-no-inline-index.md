---
title: "007 detect_changes no inline index"
description: "Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing."
trigger_phrases:
  - "007"
  - "detect changes no inline index"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 007 detect_changes no inline index

## 1. OVERVIEW

Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.

---

## 2. SCENARIO CONTRACT

- **Goal**: Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.
- **Prerequisites**:
  - Working directory is the repository root.
  - MCP server build is available: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
  - Use a disposable workspace copy for scenarios that modify files or graph state.
- **Prompt**: `As a code_graph validation operator, execute scenario 007 (detect_changes no inline index), capture commands, JSON excerpts, and return PASS/FAIL with the main evidence.`

---

## 3. TEST EXECUTION

### Commands

1. Run full scan.
2. Modify one tracked file.
3. Capture `git diff`.
4. Call `detect_changes({"diff":"<diff>","rootDir":"$WORK"})`.

### Expected Output / Verification

The stale call returns `status:"blocked"` and says to run `code_graph_scan`. It must not silently repair via inline indexing.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

After an explicit scan, rerun detect_changes and verify `affectedSymbols` or `affectedFiles` is populated.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 007
- Canonical root source: `manual_testing_playbook.md`

