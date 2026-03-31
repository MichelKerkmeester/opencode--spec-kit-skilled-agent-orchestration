---
title: "254 -- Code graph scan and structural query"
description: "This scenario validates Code graph storage and query for 254. It focuses on Indexer produces nodes/edges, query returns results."
---

# 254 -- Code graph scan and structural query

## 1. OVERVIEW

This scenario validates Code graph storage and query.

---

## 2. CURRENT REALITY

- Objective: Indexer produces nodes/edges, query returns results
- Prompt: `Validate 254 Code graph storage and query behavior. Capture evidence for: Functions/classes/imports extracted, edges built. Return pass/fail verdict.`
- Expected signals: Functions/classes/imports extracted, edges built
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 254 | Code graph storage and query | Indexer produces nodes/edges, query returns results | `Validate 254 Code graph storage and query` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Functions/classes/imports extracted, edges built | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/08-code-graph-storage-query.md](../../feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 254
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/254-code-graph-scan-query.md`
