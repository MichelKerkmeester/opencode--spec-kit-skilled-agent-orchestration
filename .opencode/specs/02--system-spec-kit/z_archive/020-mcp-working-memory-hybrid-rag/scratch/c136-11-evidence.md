# C136-11: Append-Only Mutation Ledger — Evidence

## Files Created
- `mcp_server/lib/storage/mutation-ledger.ts` — Module with types, schema, triggers, and 7 exported functions
- `mcp_server/tests/mutation-ledger.vitest.ts` — 16 test cases (exceeds 12 requirement)

## Test Results

### Targeted test run
```
✓ tests/mutation-ledger.vitest.ts (17 tests) 9ms
Test Files  1 passed (1)
Tests       17 passed (17)
```

### Full suite (regression check)
```
Test Files  136 passed | 4 skipped (140)
Tests       4340 passed | 72 skipped (4412)
Duration    9.03s
```

### TypeScript type check
```
npx tsc --noEmit -p mcp_server/tsconfig.json
# No errors referencing mutation-ledger (pre-existing rollout-policy TS6307 only)
```

## Implementation Summary

| Requirement | Status | Evidence |
|---|---|---|
| MutationType union (7 values) | PASS | `'create' \| 'update' \| 'delete' \| 'merge' \| 'archive' \| 'restore' \| 'reindex'` + CHECK constraint |
| MutationLedgerEntry fields | PASS | All 10 fields: id, timestamp, mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id |
| SQLite trigger: prevent UPDATE | PASS | Test "rejects UPDATE" confirms RAISE(ABORT) |
| SQLite trigger: prevent DELETE | PASS | Test "rejects DELETE" confirms RAISE(ABORT) |
| initLedger(db) | PASS | Creates table, indexes, triggers; idempotent |
| appendEntry(db, entry) | PASS | Returns full entry with id + timestamp |
| computeHash(content) | PASS | SHA-256, deterministic, 64-char hex |
| getEntries(db, opts) | PASS | Filters by type, actor, session, since/until, limit/offset |
| getEntryCount(db) | PASS | Returns integer count |
| verifyAppendOnly(db) | PASS | Checks trigger existence in sqlite_master |
| getLinkedEntries(db, memoryId) | PASS | Uses json_each() for JSON array search |
| 12+ tests | PASS | 16 test cases covering all requirements |
