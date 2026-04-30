---
title: "013 ccc_feedback jsonl append"
description: "Verify ccc_feedback appends one JSONL feedback entry with query, rating, resultFile, and comment fields."
trigger_phrases:
  - "013"
  - "ccc feedback jsonl append"
  - "code_graph manual testing"
importance_tier: "normal"
---
# 013 ccc_feedback jsonl append

## 1. OVERVIEW

Verify ccc_feedback appends one JSONL feedback entry with query, rating, resultFile, and comment fields.

---

## 2. SCENARIO CONTRACT

- Objective: Verify ccc_feedback appends one JSONL feedback entry with query, rating, resultFile, and comment fields.
- Real user request: `Record a CocoIndex feedback entry and confirm exactly one valid JSONL line is appended with the expected fields.`
- RCAF Prompt: `As a CocoIndex integration tester, execute ccc_feedback append checks against the feedback JSONL file in a disposable workspace. Verify one valid feedback entry records query, rating, resultFile, and comment fields. Return PASS/FAIL with response and JSONL evidence.`
- Expected execution process: In a disposable copy, call `ccc_feedback({"query":"code graph","rating":"partial","comment":"manual test"})` and inspect `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl`.
- Expected signals: Response has `recorded:true`; JSONL file contains one new valid JSON line with timestamp, query, rating, and comment.
- Desired user-visible outcome: A concise verdict explaining whether feedback recording produced the expected JSONL audit entry.
- Pass/fail: PASS if one valid JSONL feedback line is appended with expected fields; FAIL if no line is written, multiple lines appear, fields are missing, or validation accepts a missing rating.

---

## 3. TEST EXECUTION

### Commands

1. In a disposable copy, call `ccc_feedback({"query":"code graph","rating":"partial","comment":"manual test"})`.
2. Inspect `.opencode/skill/mcp-coco-index/feedback/search-feedback.jsonl`.

### Expected Output / Verification

Response has `recorded:true`; JSONL file contains one new valid JSON line with timestamp, query, rating, and comment.

### Cleanup

`rm -rf "$WORK"`

### Variant Scenarios

Run with missing rating and verify validation error.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 013
- Canonical root source: `manual_testing_playbook.md`
