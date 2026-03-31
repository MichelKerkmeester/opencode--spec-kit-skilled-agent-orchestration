---
title: "255 -- Semantic vs structural query routing"
description: "This scenario validates CocoIndex bridge for 255. It focuses on CocoIndex used for semantic, code_graph for structural."
---

# 255 -- Semantic vs structural query routing

## 1. OVERVIEW

This scenario validates CocoIndex bridge.

---

## 2. CURRENT REALITY

- Objective: CocoIndex used for semantic, code_graph for structural
- Prompt: `Validate 255 CocoIndex bridge behavior. Capture evidence for: Different results appropriate to each system. Return pass/fail verdict.`
- Expected signals: Different results appropriate to each system
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 255 | CocoIndex bridge | CocoIndex used for semantic, code_graph for structural | `Validate 255 CocoIndex bridge` | `Manual: call mcp__cocoindex_code__search for semantic, code_graph_query for structural` | Different results appropriate to each system | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 255
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
