---
title: "MCP-007 -- No-refresh search"
description: "This scenario validates No-refresh search for `MCP-007`. It focuses on Verify `refresh_index: false` skips reindexing and still returns results."
---

# MCP-007 -- No-refresh search

## 1. OVERVIEW

This scenario validates No-refresh search for `MCP-007`. It focuses on Verify `refresh_index: false` skips reindexing and still returns results.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MCP-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `refresh_index: false` skips reindexing and still returns results
- Prompt: `As a manual-testing orchestrator, search CocoIndex for "test" without triggering a reindex against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice)
- Pass/fail: PASS if results returned without reindex delay; PARTIAL if results returned but unclear whether reindex was skipped; FAIL if no results or explicit reindex triggered


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MCP-007 | No-refresh search | Verify `refresh_index: false` skips reindexing and still returns results | `As a manual-testing orchestrator, search CocoIndex for "test" without triggering a reindex against the current CocoIndex CLI, daemon, and MCP surfaces in this repository. Verify Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice). Return a concise user-facing pass/fail verdict with the main reason.` | 1. `mcp__cocoindex_code__search({ "query": "test utilities", "refresh_index": false })` -> 2. Verify results are returned AND no reindex was triggered | Results array is non-empty; response time is noticeably faster than a refreshing search (no index wait notice) | MCP output with timing noted; absence of `IndexWaitingNotice` in output | PASS if results returned without reindex delay; PARTIAL if results returned but unclear whether reindex was skipped; FAIL if no results or explicit reindex triggered | Compare timing with `refresh_index: true`; check daemon logs at `~/.cocoindex_code/daemon.log` for index activity |


---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: MCP Search Tool
- Playbook ID: MCP-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--mcp-search-tool/007-no-refresh-search.md`
