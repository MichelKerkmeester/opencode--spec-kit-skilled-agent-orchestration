---
title: "258 -- 3-source compact merger within budget"
description: "This scenario validates Compact merger for 258. It focuses on All non-empty sources included, total within 4000 tokens."
---

# 258 -- 3-source compact merger within budget

## 1. OVERVIEW

This scenario validates Compact merger.

---

## 2. CURRENT REALITY

- Objective: All non-empty sources included, total within 4000 tokens
- Prompt: `Validate 258 Compact merger behavior. Capture evidence for: 5 sections rendered, allocation metadata present. Return pass/fail verdict.`
- Expected signals: 5 sections rendered, allocation metadata present
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 258 | Compact merger | All non-empty sources included, total within 4000 tokens | `Validate 258 Compact merger` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | 5 sections rendered, allocation metadata present | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/12-compact-merger.md](../../feature_catalog/22--context-preservation-and-code-graph/12-compact-merger.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 258
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/258-compact-merger-assembly.md`
