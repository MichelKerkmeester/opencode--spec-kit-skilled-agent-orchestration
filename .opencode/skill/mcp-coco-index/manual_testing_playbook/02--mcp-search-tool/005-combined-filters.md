---
title: "MCP-005 -- Combined filters"
description: "This scenario validates Combined filters for `MCP-005`. It focuses on Verify `languages`, `paths`, and `limit` work together."
---

# MCP-005 -- Combined filters

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. TEST EXECUTION](#3--test-execution)
- [4. REFERENCES](#4--references)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Combined filters for `MCP-005`. It focuses on Verify `languages`, `paths`, and `limit` work together.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `MCP-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `languages`, `paths`, and `limit` work together
- Prompt: `Search CocoIndex for "config" in Python under .opencode/ with 2 results. Capture the evidence needed to prove Result count <= 2; all files are .py; all paths start with .opencode/. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Result count <= 2; all files are `.py`; all paths start with `.opencode/`
- Pass/fail: PASS if count <= 2 AND all filters satisfied; FAIL if any filter is ignored


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-005 | Combined filters | Verify `languages`, `paths`, and `limit` work together | `Search CocoIndex for "config" in Python under .opencode/ with 2 results. Capture the evidence needed to prove Result count <= 2; all files are .py; all paths start with .opencode/. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "configuration loading", "languages": ["python"], "paths": [".opencode/"], "limit": 2 })` -> 2. Verify results are Python files under `.opencode/` and count <= 2 | Result count <= 2; all files are `.py`; all paths start with `.opencode/` | MCP output showing filtered results | PASS if count <= 2 AND all filters satisfied; FAIL if any filter is ignored | Test filters individually to isolate which one fails; check parameter types (list vs string) |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mcp-search-tool/005-combined-filters.md`
