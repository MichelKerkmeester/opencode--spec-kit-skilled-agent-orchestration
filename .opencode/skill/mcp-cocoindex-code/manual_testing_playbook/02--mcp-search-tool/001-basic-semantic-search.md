---
title: "MCP-001 -- Basic semantic search"
description: "This scenario validates Basic semantic search for `MCP-001`. It focuses on Verify MCP search returns results with file paths, scores, and line ranges."
---

# MCP-001 -- Basic semantic search

## 1. OVERVIEW

This scenario validates Basic semantic search for `MCP-001`. It focuses on Verify MCP search returns results with file paths, scores, and line ranges.


---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `MCP-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify MCP search returns results with file paths, scores, and line ranges
- Prompt: `Use CocoIndex to search for "fibonacci calculation"`
- Expected signals: Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string)
- Pass/fail: PASS if results non-empty AND each result has all 5 fields (file, score, lines, snippet, language); FAIL if empty results or missing fields


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-001 | Basic semantic search | Verify MCP search returns results with file paths, scores, and line ranges | `Use CocoIndex to search for "fibonacci calculation"` | 1. `mcp__cocoindex_code__search({ "query": "fibonacci calculation" })` | Results array with at least 1 entry; each entry contains `file` (string), `score` (float 0.0-1.0), `lines` (start/end), `snippet` (string), `language` (string) | MCP tool output showing result structure | PASS if results non-empty AND each result has all 5 fields (file, score, lines, snippet, language); FAIL if empty results or missing fields | Check index status with `ccc status`; verify index is non-empty; try broader query like "math calculation" |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/001-basic-semantic-search.md`
