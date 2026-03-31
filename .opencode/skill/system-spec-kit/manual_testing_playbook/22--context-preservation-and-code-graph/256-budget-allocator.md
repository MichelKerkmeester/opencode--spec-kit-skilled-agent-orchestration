---
title: "256 -- Budget allocator floors and overflow"
description: "This scenario validates Budget allocator for 256. It focuses on Floor distribution and overflow redistribution."
---

# 256 -- Budget allocator floors and overflow

## 1. OVERVIEW

This scenario validates Budget allocator.

---

## 2. CURRENT REALITY

- Objective: Floor distribution and overflow redistribution
- Prompt: `Validate 256 Budget allocator behavior. Capture evidence for: All tests pass, total never exceeds 4000. Return pass/fail verdict.`
- Expected signals: All tests pass, total never exceeds 4000
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 256 | Budget allocator | Floor distribution and overflow redistribution | `Validate 256 Budget allocator` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts` | All tests pass, total never exceeds 4000 | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/10-budget-allocator.md](../../feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 256
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/256-budget-allocator.md`
