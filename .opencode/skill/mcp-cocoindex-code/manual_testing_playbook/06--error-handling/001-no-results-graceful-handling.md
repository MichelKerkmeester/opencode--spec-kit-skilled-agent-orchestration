# ERR-001 -- No results graceful handling

## 1. OVERVIEW

This scenario validates No results graceful handling for `ERR-001`. It focuses on Verify search returns empty results gracefully for a nonsense query (no crash, no error).

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `ERR-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify search returns empty results gracefully for a nonsense query (no crash, no error)
- Prompt: `Search for a completely nonsensical term that has no matches`
- Expected signals: Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace
- Pass/fail: PASS if empty results returned with no error; FAIL if tool throws an exception, crashes, or returns an error message

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ERR-001 | No results graceful handling | Verify search returns empty results gracefully for a nonsense query (no crash, no error) | `Search for a completely nonsensical term that has no matches` | 1. `mcp__cocoindex_code__search({ "query": "xyzzy_nonexistent_symbol_99999" })` -> 2. Verify response is a valid empty result (empty array or "no results" message, NOT an error or crash) | Response is valid (not an exception or error); result array is empty or contains zero entries; no stack trace | MCP tool output showing empty/zero results | PASS if empty results returned with no error; FAIL if tool throws an exception, crashes, or returns an error message | Check daemon logs for unhandled exceptions; verify index exists; test with `ccc search "xyzzy_nonexistent_symbol_99999" --limit 1` via CLI for comparison |

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../../manual_testing_playbook.md)

## 5. SOURCE METADATA

- Group: Error Handling
- Playbook ID: ERR-001
- Canonical root source: `manual_testing_playbook.md`
- Snippet path: `snippets/06--error-handling/001-no-results-graceful-handling.md`
