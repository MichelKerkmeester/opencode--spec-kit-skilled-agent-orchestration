---
title: "MCP-006 -- Result limit"
description: "This scenario validates Result limit for `MCP-006`. It focuses on Verify `num_results` controls output count."
---

# MCP-006 -- Result limit

## 1. OVERVIEW

This scenario validates Result limit for `MCP-006`. It focuses on Verify `num_results` controls output count.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `MCP-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `num_results` controls output count
- Prompt: `Compare CocoIndex search with 1 result vs 10 results`
- Expected signals: Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count
- Pass/fail: PASS if step 2 returns exactly 1 AND step 4 returns more than 1 (up to 10); FAIL if `num_results` is ignored


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-006 | Result limit | Verify `num_results` controls output count | `Compare CocoIndex search with 1 result vs 10 results` | 1. `mcp__cocoindex_code__search({ "query": "error handling", "num_results": 1 })` -> 2. Count results (expect exactly 1) -> 3. `mcp__cocoindex_code__search({ "query": "error handling", "num_results": 10 })` -> 4. Count results (expect up to 10) | Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count | Side-by-side result counts from both calls | PASS if step 2 returns exactly 1 AND step 4 returns more than 1 (up to 10); FAIL if `num_results` is ignored | Verify `num_results` parameter type is integer; check default (5) if parameter omitted |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/006-result-limit.md`
