---
title: "MCP-004 -- Path filter"
description: "This scenario validates Path filter for `MCP-004`. It focuses on Verify `paths` parameter restricts results to a specific directory."
---

# MCP-004 -- Path filter

## 1. OVERVIEW

This scenario validates Path filter for `MCP-004`. It focuses on Verify `paths` parameter restricts results to a specific directory.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `paths` parameter restricts results to a specific directory
- Real user request: `Please verify paths parameter restricts results to a specific directory.`
- RCAF Prompt: `As a manual-testing orchestrator, search CocoIndex for "skill" only under .opencode/skill/ against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result paths begin with .opencode/skill/; no results from other directories. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `MCP-004`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: All result paths begin with `.opencode/skill/`; no results from other directories
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if all results are under `.opencode/skill/`; FAIL if any result is outside that path


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-004 | Path filter | Verify `paths` parameter restricts results to a specific directory | `As a manual-testing orchestrator, search CocoIndex for "skill" only under .opencode/skill/ against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result paths begin with .opencode/skill/; no results from other directories. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "skill configuration", "paths": [".opencode/skill/"] })` -> 2. Verify all returned file paths start with `.opencode/skill/` | All result paths begin with `.opencode/skill/`; no results from other directories | MCP output with file paths | PASS if all results are under `.opencode/skill/`; FAIL if any result is outside that path | Verify path format (relative, with trailing slash); check if path is indexed |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/004-path-filter.md`
