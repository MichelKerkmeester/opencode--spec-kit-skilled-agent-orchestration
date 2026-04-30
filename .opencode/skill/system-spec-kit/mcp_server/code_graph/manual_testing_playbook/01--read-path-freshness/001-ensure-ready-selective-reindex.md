---
title: "001 ensure-ready selective reindex"
description: "Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior."
trigger_phrases:
  - "001"
  - "ensure ready selective reindex"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 001 ensure-ready selective reindex

## 1. OVERVIEW

Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that one stale tracked file can be selectively reindexed by the readiness helper without broad full-scan behavior.
- Real user request: `Validate that code_graph can repair a single stale tracked file without triggering an unrequested full scan.`
- RCAF Prompt: `As a code graph read-path tester, execute selective readiness reindex checks against a disposable stale-file workspace. Verify one stale tracked file is repaired without broad full-scan behavior. Return PASS/FAIL with command evidence and JSON excerpts.`
- Expected execution process: Create a disposable workspace, run a full scan, touch one indexed TypeScript file, call `code_graph_query` for the touched file, and capture readiness fields from the response.
- Expected signals: Response shows `status:"ok"` plus readiness or self-heal evidence such as `inlineIndexPerformed:true` or `selfHealResult:"ok"`, with no transcript line showing an unrequested full `code_graph_scan`.
- Desired user-visible outcome: A concise verdict explaining whether selective reindex repaired the stale file without broad scan behavior.
- Pass/fail: PASS if the stale file is repaired and no hidden full scan appears; FAIL if the call blocks unexpectedly, performs an unrequested full scan, or omits readiness evidence.

---

## 3. TEST EXECUTION

### Commands

1. Create a disposable copy and run `code_graph_scan({"rootDir":"$WORK","incremental":false})`.
2. Touch one indexed TypeScript file.
3. Call `code_graph_query({"operation":"outline","subject":"<touched-file>","limit":20})`.
4. Capture readiness fields from the response.

### Expected Output / Verification

Response shows `status:"ok"` and readiness/self-heal evidence such as `inlineIndexPerformed:true` or `selfHealResult:"ok"`. No transcript line shows an unrequested full `code_graph_scan`.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Repeat with `allowInlineIndex:false` through `detect_changes` and confirm it blocks instead.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 001
- Canonical root source: `manual_testing_playbook.md`
