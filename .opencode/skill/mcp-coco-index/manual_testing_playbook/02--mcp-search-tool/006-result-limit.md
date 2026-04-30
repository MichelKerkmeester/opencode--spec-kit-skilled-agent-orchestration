---
title: "MCP-006 -- Result limit"
description: "This scenario validates Result limit for `MCP-006`. It focuses on Verify `limit` controls output count."
---

# MCP-006 -- Result limit

## 1. OVERVIEW

This scenario validates Result limit for `MCP-006`. It focuses on Verify `limit` controls output count.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `limit` controls output count
- Real user request: `Please verify limit controls output count.`
- RCAF Prompt: `As a manual-testing orchestrator, compare CocoIndex search with 1 result vs 10 results against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `MCP-006`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if step 2 returns exactly 1 AND step 4 returns more than 1 (up to 10); FAIL if `limit` is ignored


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-006 | Result limit | Verify `limit` controls output count | `As a manual-testing orchestrator, compare CocoIndex search with 1 result vs 10 results against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "error handling", "limit": 1 })` -> 2. Count results (expect exactly 1) -> 3. `mcp__cocoindex_code__search({ "query": "error handling", "limit": 10 })` -> 4. Count results (expect up to 10) | Step 2: exactly 1 result; Step 4: result count between 1 and 10 (inclusive); Step 4 count >= Step 2 count | Side-by-side result counts from both calls | PASS if step 2 returns exactly 1 AND step 4 returns more than 1 (up to 10); FAIL if `limit` is ignored | Verify `limit` parameter type is integer; check default (5) if parameter omitted |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/006-result-limit.md`
