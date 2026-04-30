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

- Objective: Validate the code_graph_query handler self-heal path and full-scan refusal behavior.
- Real user request: `Check that code_graph_query self-heals a single stale file but refuses broad stale state until an explicit scan runs.`
- RCAF Prompt: `As a code graph read-path tester, execute stale-file query checks against code_graph_query in a disposable workspace. Verify single-file stale state self-heals and broad stale state refuses full-scan-required work. Return PASS/FAIL with command evidence and JSON excerpts.`
- Expected execution process: Run a full scan in a disposable copy, modify one tracked file and call `code_graph_query` for outline, then modify more than 50 tracked files and call `code_graph_query` again.
- Expected signals: Single-file stale state is repaired or answered with readiness metadata; broad stale state returns a blocked payload with `requiredAction:"code_graph_scan"` or equivalent fallback decision.
- Desired user-visible outcome: A concise verdict distinguishing the allowed self-heal path from the blocked broad-stale path.
- Pass/fail: PASS if single-file stale state self-heals and broad stale state blocks with scan guidance; FAIL if broad state is silently repaired, single-file readiness metadata is missing, or the handler crashes.

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
