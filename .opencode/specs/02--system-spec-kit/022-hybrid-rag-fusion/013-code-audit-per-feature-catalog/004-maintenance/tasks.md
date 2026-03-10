# Tasks: 004-Maintenance Phase

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 1     | FAIL status findings (correctness bugs, behavior mismatches) |
| P1       | 0     | WARN with behavior mismatch or significant code issues |
| P2       | 1     | WARN with documentation/test gaps only |
| **Total** | **2** | |

---

## P0 — Critical / Correctness

### T-01: Reconcile incremental scan hash accounting with mtime-only reality
- **Priority:** P0
- **Feature:** F-01 Workspace scanning and indexing (memory_index_scan)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-index.ts:320,322,283-284`, `mcp_server/lib/storage/incremental-index.ts:156-173`
- **Issue:** `skipped_hash` is always hardcoded to `0` and `incremental.hash_checks` is set to `categorized.toUpdate.length` (files needing re-index due to mtime change, not actual hash comparisons). The result schema exposes both fields but no content-hash comparison exists in `categorizeFileDecision` -- the decision tree uses only mtime comparison with `MTIME_FAST_PATH_MS` tolerance and embedding status checks. Current Reality documentation claims incremental mode separates unchanged files by mtime/hash and reports both buckets.
- **Fix:** Either implement hash-based unchanged detection in `categorizeFileDecision` (adding content-hash comparison between mtime-change and re-index), or update Current Reality documentation to mtime-only semantics and remove the `skipped_hash` field. Rename `incremental.hash_checks` to `incremental.modified_count` to match actual semantics, or implement true hash checking. Add regression tests for skip-accounting fields. Remove stale `retry.vitest.ts` catalog entry.

---

## P1 — Behavior Mismatch / Significant Code Issues

_No P1 findings in this phase._

---

## P2 — Documentation / Test Gaps

### T-02: Add direct unit tests for startup runtime compatibility guards
- **Priority:** P2
- **Feature:** F-02 Startup runtime compatibility guards
- **Status:** TODO
- **Source:** `mcp_server/startup-checks.ts:23-85`
- **Issue:** Startup-guard coverage is mostly source-pattern assertions (regex check for function call presence) and modularization structure checks, not behavior-level execution of marker/SQLite guard outcomes. No focused unit suite validates warning branches directly, including: marker file creation when missing, marker file mismatch detection, SQLite version below threshold warning, and SQLite version extraction failure.
- **Fix:** Add direct unit tests for `detectNodeVersionMismatch()` covering marker creation on first run, marker match on same ABI, and marker mismatch warning on different ABI. Add direct unit tests for `checkSqliteVersion()` covering version >= 3.35.0 (pass), version < 3.35.0 (warning), and version extraction failure (graceful error). Update the maintenance test inventory to point at the new coverage.
