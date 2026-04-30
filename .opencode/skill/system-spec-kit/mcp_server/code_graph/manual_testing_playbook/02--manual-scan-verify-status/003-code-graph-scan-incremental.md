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

- Objective: Confirm incremental scan skips fresh files and prunes deleted tracked files.
- Real user request: `Validate that incremental code_graph_scan skips unchanged files and removes deleted tracked files from graph results.`
- RCAF Prompt: `As a code graph scan operator, execute incremental scan checks against a disposable indexed workspace. Verify fresh files are skipped and deleted tracked files are pruned. Return PASS/FAIL with scan payload excerpts and query evidence.`
- Expected execution process: Run a full scan, delete one indexed fixture file, run `code_graph_scan` with `incremental:true`, and inspect `filesSkipped`, `filesIndexed`, and readiness fields.
- Expected signals: Incremental scan returns `status:"ok"`, reports skipped or fresh files, and no deleted file remains in graph query or status evidence.
- Desired user-visible outcome: A concise verdict explaining whether incremental scanning preserved fresh work and pruned deleted entries.
- Pass/fail: PASS if skipped/fresh counts and deleted-file pruning are visible; FAIL if the deleted file remains, fresh files are reindexed unnecessarily without explanation, or readiness is missing.

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
