---
title: "257 -- Working-set tracker feeds compaction"
description: "This scenario validates Working-set tracker for 257. It focuses on Tracked files appear in compaction priority."
---

# 257 -- Working-set tracker feeds compaction

## 1. OVERVIEW

This scenario validates Working-set tracker.

---

## 2. CURRENT REALITY

- Objective: Tracked files appear in compaction priority
- Prompt: `Validate 257 Working-set tracker behavior. Capture evidence for: Merger includes working-set files in output. Return pass/fail verdict.`
- Expected signals: Merger includes working-set files in output
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 257 | Working-set tracker | Tracked files appear in compaction priority | `Validate 257 Working-set tracker` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Merger includes working-set files in output | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/11-working-set-tracker.md](../../feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 257
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/257-working-set-compaction.md`
