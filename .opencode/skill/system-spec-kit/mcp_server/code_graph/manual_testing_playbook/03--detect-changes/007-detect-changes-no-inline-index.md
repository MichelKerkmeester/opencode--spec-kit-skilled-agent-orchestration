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

- Objective: Verify detect_changes is read-only and blocks stale readiness instead of performing inline indexing.
- Real user request: `Validate that detect_changes refuses stale graph state and asks for code_graph_scan instead of repairing inline.`
- RCAF Prompt: `As a detect_changes validation operator, execute stale-readiness checks against detect_changes in a disposable workspace. Verify stale graph state blocks with scan guidance instead of inline indexing. Return PASS/FAIL with diff, command, and JSON evidence.`
- Expected execution process: Run a full scan, modify one tracked file, capture `git diff`, and call `detect_changes` with the diff and disposable root.
- Expected signals: The stale call returns `status:"blocked"` and says to run `code_graph_scan`; it must not silently repair via inline indexing.
- Desired user-visible outcome: A concise verdict explaining whether detect_changes preserved read-only behavior.
- Pass/fail: PASS if stale readiness blocks with scan guidance and no inline indexing occurs; FAIL if detect_changes repairs inline, omits the required action, or fails to return a structured blocked payload.

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
