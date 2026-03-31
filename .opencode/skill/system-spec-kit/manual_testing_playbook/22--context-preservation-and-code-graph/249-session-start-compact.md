---
title: "249 -- SessionStart injects post-compact context"
description: "This scenario validates SessionStart priming (compact) for 249. It focuses on SessionStart reads cached payload and injects via stdout."
---

# 249 -- SessionStart injects post-compact context

## 1. OVERVIEW

This scenario validates SessionStart priming (compact).

---

## 2. CURRENT REALITY

- Objective: SessionStart reads cached payload and injects via stdout
- Prompt: `Validate 249 SessionStart priming (compact) behavior. Capture evidence for: Cached payload read and formatted correctly. Return pass/fail verdict.`
- Expected signals: Cached payload read and formatted correctly
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 249 | SessionStart priming (compact) | SessionStart reads cached payload and injects via stdout | `Validate 249 SessionStart priming (compact)` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Cached payload read and formatted correctly | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 249
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/249-session-start-compact.md`
