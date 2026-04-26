---
title: "MCP-001 -- Basic semantic search"
description: "This scenario validates Basic semantic search for `MCP-001`. It focuses on Verify MCP search returns results with file paths, scores, and line ranges."
---

# MCP-001 -- Basic semantic search

## 1. OVERVIEW

This scenario validates Basic semantic search for `MCP-001`. It focuses on Verify MCP search returns results with file paths, scores, and line ranges.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify MCP search returns results with file paths, scores, and line ranges
- Prompt: `As a manual-testing orchestrator, use CocoIndex to search for "fibonacci calculation" against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results array with at least 1 entry; each entry contains file (string), score (float 0.0-1.0), lines (start/end), snippet (string), language (string). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string)
- Pass/fail: PASS if results non-empty AND each result has all 5 fields (file, score, lines, snippet, language); FAIL if empty results or missing fields


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-001 | Basic semantic search | Verify MCP search returns results with file paths, scores, and line ranges | `As a manual-testing orchestrator, use CocoIndex to search for "fibonacci calculation" against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results array with at least 1 entry; each entry contains file (string), score (float 0.0-1.0), lines (start/end), snippet (string), language (string). Return a concise user-facing pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "fibonacci calculation" })` | Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string) | MCP tool output showing result structure | PASS if results non-empty AND each result has all 5 fields (file, score, lines, snippet, language); FAIL if empty results or missing fields | Check index status with `ccc status`; verify index is non-empty; try broader query like "math calculation" |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mcp-search-tool/001-basic-semantic-search.md`
