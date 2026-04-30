---
title: "MCP-005 -- Combined filters"
description: "This scenario validates Combined filters for `MCP-005`. It focuses on Verify `languages`, `paths`, and `limit` work together."
---

# MCP-005 -- Combined filters

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Combined filters for `MCP-005`. It focuses on Verify `languages`, `paths`, and `limit` work together.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `languages`, `paths`, and `limit` work together
- Real user request: `Please verify languages, paths, and limit work together.`
- RCAF Prompt: `As a manual-testing orchestrator, search CocoIndex for "config" in Python under .opencode/ with 2 results against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Result count <= 2; all files are .py; all paths start with .opencode/. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `MCP-005`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Result count <= 2; all files are `.py`; all paths start with `.opencode/`
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if count <= 2 AND all filters satisfied; FAIL if any filter is ignored


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-005 | Combined filters | Verify `languages`, `paths`, and `limit` work together | `As a manual-testing orchestrator, search CocoIndex for "config" in Python under .opencode/ with 2 results against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Result count <= 2; all files are .py; all paths start with .opencode/. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "configuration loading", "languages": ["python"], "paths": [".opencode/"], "limit": 2 })` -> 2. Verify results are Python files under `.opencode/` and count <= 2 | Result count <= 2; all files are `.py`; all paths start with `.opencode/` | MCP output showing filtered results | PASS if count <= 2 AND all filters satisfied; FAIL if any filter is ignored | Test filters individually to isolate which one fails; check parameter types (list vs string) |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/005-combined-filters.md`
