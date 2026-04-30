---
title: "MCP-002 -- Language filter (single)"
description: "This scenario validates Language filter (single) for `MCP-002`. It focuses on Verify `languages` parameter restricts results to a single language."
---

# MCP-002 -- Language filter (single)

## 1. OVERVIEW

This scenario validates Language filter (single) for `MCP-002`. It focuses on Verify `languages` parameter restricts results to a single language.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify `languages` parameter restricts results to a single language
- Real user request: `Please verify languages parameter restricts results to a single language.`
- RCAF Prompt: `As a manual-testing orchestrator, search CocoIndex for "function" filtered to Python only against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result file paths end in .py; no .ts, .js, .go, etc. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `MCP-002`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: All result file paths end in `.py`; no `.ts`, `.js`, `.go`, etc.
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if all results are `.py` files; FAIL if any non-Python file appears


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-002 | Language filter (single) | Verify `languages` parameter restricts results to a single language | `As a manual-testing orchestrator, search CocoIndex for "function" filtered to Python only against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result file paths end in .py; no .ts, .js, .go, etc. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "function definition", "languages": ["python"] })` -> 2. Verify all returned `file` paths end in `.py` | All result file paths end in `.py`; no `.ts`, `.js`, `.go`, etc. | MCP output with file paths highlighted | PASS if all results are `.py` files; FAIL if any non-Python file appears | Verify `languages` parameter accepts list format; check index has Python files with `ccc status` |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/002-language-filter-single.md`
