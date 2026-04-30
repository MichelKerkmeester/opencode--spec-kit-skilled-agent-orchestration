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

- Objective: Prove code_graph_verify refuses stale graph state before executing the gold battery.
- Real user request: `Confirm code_graph_verify blocks on stale graph state, then passes through to verification after an explicit rescan.`
- RCAF Prompt: `As a code graph verification operator, execute stale-state verify checks against code_graph_verify in a disposable workspace. Verify stale state blocks before the gold battery and explicit rescan enables verification. Return PASS/FAIL with blocked and ok payload excerpts.`
- Expected execution process: Run a full scan, modify a tracked source file, call `code_graph_verify`, then run an explicit full `code_graph_scan` and call verify again.
- Expected signals: First verify returns `status:"blocked"` with readiness; second verify returns `status:"ok"` with `result.passed` and pass-rate fields.
- Desired user-visible outcome: A concise verdict explaining whether verify protects against stale input and resumes after scan.
- Pass/fail: PASS if stale verify blocks and post-scan verify returns ok with pass-rate data; FAIL if verify runs on stale state, remains blocked after rescan, or omits readiness/pass-rate fields.

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
