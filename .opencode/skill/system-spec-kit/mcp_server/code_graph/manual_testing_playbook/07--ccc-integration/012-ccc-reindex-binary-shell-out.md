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

- Objective: Verify ccc_reindex shells out to the local ccc binary and reports unavailable binary cleanly.
- Real user request: `Check whether ccc_reindex uses the local ccc binary and gives a clear install message when the binary is unavailable.`
- RCAF Prompt: `As a CocoIndex integration tester, execute ccc_reindex availability checks against the local ccc binary path. Verify available binaries produce reindex status and missing binaries report install guidance cleanly. Return PASS/FAIL with status and error evidence.`
- Expected execution process: Call `ccc_status`, then call `ccc_reindex({"full":false})` in a disposable workspace if the binary exists, or capture the install error from `ccc_reindex` if it is missing.
- Expected signals: Available binary path leads to `status:"ok"` with mode and duration; missing binary returns a clear install instruction.
- Desired user-visible outcome: A concise verdict explaining whether ccc_reindex delegates to the binary or fails with actionable setup guidance.
- Pass/fail: PASS if available binary reindex succeeds or unavailable binary returns clear install guidance; FAIL if the shell-out path is invisible, missing-binary errors are unclear, or generated artifacts are not isolated.

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
