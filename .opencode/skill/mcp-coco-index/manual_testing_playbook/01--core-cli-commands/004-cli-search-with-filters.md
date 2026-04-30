---
title: "CCC-004 -- CLI search with filters"
description: "This scenario validates CLI search with filters for `CCC-004`. It focuses on Verify `--lang` (repeatable) and `--limit` filters work."
---

# CCC-004 -- CLI search with filters

## 1. OVERVIEW

This scenario validates CLI search with filters for `CCC-004`. It focuses on Verify `--lang` (repeatable) and `--limit` filters work.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CCC-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--lang` (repeatable) and `--limit` filters work
- Real user request: `Please verify --lang (repeatable) and --limit filters work.`
- RCAF Prompt: `As a manual-testing orchestrator, search for "function" filtered to Python and TypeScript with limit 3 against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: returns results; Step 2: all file extensions are .py, .ts, or .tsx; Step 3: result count <= 3. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `CCC-004`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Step 1: returns results; Step 2: all file extensions are `.py`, `.ts`, or `.tsx`; Step 3: result count <= 3
- Desired user-visible outcome: A concise user-visible PASS/PARTIAL/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if all results match language filter AND count <= 3; PARTIAL if count correct but one result has wrong extension; FAIL if filter is ignored


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CCC-004 | CLI search with filters | Verify `--lang` (repeatable) and `--limit` filters work | `As a manual-testing orchestrator, search for "function" filtered to Python and TypeScript with limit 3 against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Step 1: returns results; Step 2: all file extensions are .py, .ts, or .tsx; Step 3: result count <= 3. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `bash: ccc search "function" --lang python --lang typescript --limit 3` -> 2. Verify all returned file paths end in `.py` or `.ts`/`.tsx` -> 3. Verify result count is at most 3 | Step 1: returns results; Step 2: all file extensions are `.py`, `.ts`, or `.tsx`; Step 3: result count <= 3 | Search output with file paths and count | PASS if all results match language filter AND count <= 3; PARTIAL if count correct but one result has wrong extension; FAIL if filter is ignored | Check `--lang` values against supported language code values in tool_reference.md; verify index contains Python/TypeScript files |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Core CLI Commands
- Playbook ID: CCC-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--core-cli-commands/004-cli-search-with-filters.md`
