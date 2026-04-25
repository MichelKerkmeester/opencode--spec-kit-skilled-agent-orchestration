# Agent Brief — T-E Test Rig Fixes

You are an autonomous implementation agent. **No conversation context.**

## Your role

Unskip the trust-badges SQL tests by fixing the mock-resolution issue that blocked them in Wave 3. Closes R-007-13.

## Background (key context)

The 010/005-memory-causal-trust-display sub-phase shipped a `trustBadges` feature on `MemoryResultEnvelope`. Its tests (`tests/memory/trust-badges.test.ts`) fail because:
- Test mocks `lib/search/vector-index.js` `getDb()` and `utils/index.js` + `utils/db-helpers.js` `requireDb()`
- But the formatter's actual `requireDb()` resolution path bypasses the vitest mock interception
- Tests using SQL-derived badges return `confidence: null` instead of expected `confidence: 0.4 / 0.82`

The test file is currently `describe.skip(...)` per a known follow-up note added in commit `c6e766dc5`.

## Read first

1. `010/007/tasks.md` (T-E section)
2. `010/005/review/review-report.md` Iter 7 (P1 — SQL tests skipped)
3. `mcp_server/tests/memory/trust-badges.test.ts` (the test file with `describe.skip`)
4. `mcp_server/formatters/search-results.ts:262-352` (the function being tested — `fetchTrustBadgeSnapshots`)
5. `mcp_server/utils/db-helpers.ts` (where `requireDb` originates)

## Worktree

- Path: `../010-007-E`

## Two viable fix strategies

### Strategy A — Dependency Injection (preferred)
Refactor `fetchTrustBadgeSnapshots(results)` to `fetchTrustBadgeSnapshots(results, dbGetter = requireDb)`. Test passes its own getter. Production still default-uses `requireDb`.

### Strategy B — Real-DB integration test
Set up a `:memory:` better-sqlite3 DB at the test-suite level, populate via the actual schema migration code, point the global `requireDb` at it for the test scope (via `vi.mock` on `db-helpers.js` confirmed to work in this codebase).

## Files you may touch

| File | Action |
|------|--------|
| `mcp_server/formatters/search-results.ts` (line 262 fn signature) | MODIFY (Strategy A only) — add optional `dbGetter` parameter; default to `requireDb` |
| `mcp_server/tests/memory/trust-badges.test.ts` | MODIFY — remove `.skip`; restructure mock OR pass DI getter |
| `010/007/implementation-summary.md` | MODIFY — record strategy + closure |

## Files you may NOT touch

- `lib/storage/causal-edges.ts` schema (no changes per ADR-012-005)
- `lib/search/causal-boost.ts` decay logic (no changes)
- `formatters/search-results.ts` outside the one function signature (other batches own different parts)
- Other batch territories

## Hard rules

1. **All 3 originally-skipped tests pass** after the fix
2. **No production-side regression** — `formatSearchResults` behavior unchanged for real callers
3. **`tsc --noEmit` clean** after changes
4. **Implementation logic unchanged** — only the test rig changes (or formatter signature for DI)
5. **Strategy decision** recorded in implementation-summary.md with one-paragraph rationale

## Success criteria

- [ ] R-007-13 closed: `tests/memory/trust-badges.test.ts` runs without `.skip`, all 3 cases pass
- [ ] `cd mcp_server && npx --no-install vitest run tests/memory/trust-badges.test.ts` exits 0 with 3 tests passed
- [ ] `cd mcp_server && npx --no-install tsc --noEmit` clean
- [ ] Existing `tests/response-profile-formatters.vitest.ts` still passes (no regression)

## Output contract

- Commit: `fix(010/007/T-E): unskip trust-badges SQL tests via <strategy>`
- Print at end: `EXIT_STATUS=DONE | strategy=<DI|REAL_DB> | tests_passing=<N>/3`
