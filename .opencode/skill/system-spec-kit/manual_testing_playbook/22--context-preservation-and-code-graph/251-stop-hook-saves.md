---
title: "251 -- Stop hook saves token usage"
description: "This scenario validates Stop hook token tracking for 251. It focuses on Transcript parsing, cost estimation, and snapshot storage."
---

# 251 -- Stop hook saves token usage

## 1. OVERVIEW

This scenario validates Stop hook token tracking.

---

## 2. CURRENT REALITY

- Objective: Transcript parsing, cost estimation, and snapshot storage
- Prompt: `Validate 251 Stop hook token tracking behavior. Capture evidence for: Token counts accurate, cost estimates match model pricing. Return pass/fail verdict.`
- Expected signals: Token counts accurate, cost estimates match model pricing
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 251 | Stop hook token tracking | Transcript parsing, cost estimation, and snapshot storage | `Validate 251 Stop hook token tracking` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts` | Token counts accurate, cost estimates match model pricing | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/04-stop-token-tracking.md](../../feature_catalog/22--context-preservation-and-code-graph/04-stop-token-tracking.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 251
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/251-stop-hook-saves.md`
