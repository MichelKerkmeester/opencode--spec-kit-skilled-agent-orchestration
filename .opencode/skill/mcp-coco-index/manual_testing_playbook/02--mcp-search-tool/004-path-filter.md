---
title: "MCP-004 -- Path filter"
description: "This scenario validates Path filter for `MCP-004`. It focuses on Verify `paths` parameter restricts results to a specific directory."
---

# MCP-004 -- Path filter

## 1. OVERVIEW

This scenario validates Path filter for `MCP-004`. It focuses on Verify `paths` parameter restricts results to a specific directory.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `MCP-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify `paths` parameter restricts results to a specific directory
- Prompt: `As a manual-testing orchestrator, search CocoIndex for "skill" only under .opencode/skill/ against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result paths begin with .opencode/skill/; no results from other directories. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: All result paths begin with `.opencode/skill/`; no results from other directories
- Pass/fail: PASS if all results are under `.opencode/skill/`; FAIL if any result is outside that path


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-004 | Path filter | Verify `paths` parameter restricts results to a specific directory | `As a manual-testing orchestrator, search CocoIndex for "skill" only under .opencode/skill/ against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify All result paths begin with .opencode/skill/; no results from other directories. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "skill configuration", "paths": [".opencode/skill/"] })` -> 2. Verify all returned file paths start with `.opencode/skill/` | All result paths begin with `.opencode/skill/`; no results from other directories | MCP output with file paths | PASS if all results are under `.opencode/skill/`; FAIL if any result is outside that path | Verify path format (relative, with trailing slash); check if path is indexed |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-004
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mcp-search-tool/004-path-filter.md`
