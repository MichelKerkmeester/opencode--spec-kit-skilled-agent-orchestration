---
title: "250 -- SessionStart primes fresh session"
description: "This scenario validates SessionStart priming (startup) for 250. It focuses on SessionStart outputs Spec Kit Memory overview on fresh startup."
---

# 250 -- SessionStart primes fresh session

## 1. OVERVIEW

This scenario validates SessionStart priming (startup).

---

## 2. CURRENT REALITY

- Objective: SessionStart outputs Spec Kit Memory overview on fresh startup
- Prompt: `Validate 250 SessionStart priming (startup) behavior. Capture evidence for: Session priming text includes memory tool references. Return pass/fail verdict.`
- Expected signals: Session priming text includes memory tool references
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 250 | SessionStart priming (startup) | SessionStart outputs Spec Kit Memory overview on fresh startup | `Validate 250 SessionStart priming (startup)` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-session-start.vitest.ts` | Session priming text includes memory tool references | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/03-session-start-priming.md](../../feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 250
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/250-session-start-startup.md`
