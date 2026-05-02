# Iteration 036: Security — Governance + Data Integrity

**Dimension:** Security — Governance + data integrity
**Date:** 2026-03-28
**Scope:** checkpoints.ts (handler), lineage-state.ts, access-tracker.ts, db-state.ts, reconsolidation.ts, vector-index-store.ts

---

## Findings

### [P0] Checkpoint restore bypasses scope enforcement on clearExisting path

**File:** `mcp_server/handlers/checkpoints.ts:369-389`, `mcp_server/lib/storage/checkpoints.ts` (restore internals)

**Issue:**
The `handleCheckpointRestore` handler enforces scope at the read level (lines 369–386 in checkpoints.ts handler: it calls `getCheckpoint(name, scope)` and validates scope metadata before proceeding), but the underlying `restoreCheckpoint(name, clearExisting, scope)` call at line 389 passes the scope as an advisory parameter only. The storage layer's `clearExisting=true` path issues a `DELETE FROM memory_index WHERE spec_folder = ?` keyed solely on the checkpoint's `spec_folder`, which is wider than the caller's tenant/user/agent scope. A tenant-scoped restore with `clearExisting=true` therefore deletes rows belonging to other tenants that share the same `spec_folder`.

A second vector is the checkpoint matching logic at lines 190–207 (handler): `checkpointMatchesScope` treats a scope field match as true when `actual === undefined`, meaning an unscoped checkpoint is accessible by any scoped caller. Combined with the storage-level folder-wide clear, a caller can present any tenant scope, pass scope validation against a scopeless checkpoint, and then trigger a folder-wide wipe.

**Evidence:**
- `handlers/checkpoints.ts:369-386` — scope check before restore; passes on `actual === undefined`
- `handlers/checkpoints.ts:389` — `restoreCheckpoint(name, clear_existing, scope)` invocation
- `handlers/checkpoints.ts:190-207` — `checkpointMatchesScope` treats absent scope field as a match for any caller scope

**Fix:**
1. Make `checkpointMatchesScope` require `actual === expected` (not treat `undefined` as a match) when the caller supplies a scope value — absent scope on the stored checkpoint should be a mismatch for a scoped caller.
2. The storage-layer clear path must narrow the `DELETE` to the intersection of `spec_folder` AND the caller's tenant/user/agent/shared-space predicates, not folder-wide.

---

### [P1] Scope-prefix SHA-256 truncation creates theoretical collision surface in lineage keys

**File:** `mcp_server/lib/storage/lineage-state.ts:214-219`

**Issue:**
`buildScopePrefix` hashes the sorted JSON-serialized scope tuple and slices the SHA-256 digest to 24 hex characters (96 bits). This is embedded into the plain-text logical key (`spec_folder::scope-sha256:<24-hex>::canonicalPath::anchorId`) without further hashing. Two separate scope combinations whose SHA-256 digests share the same first 24 hex characters would map to the same logical key, producing an accidental cross-tenant lineage chain. The probability is low (~1 in 2^96 per pair), but in large multi-tenant deployments with billions of scope tuples, or under adversarial input, this is a calculable risk.

Additionally, the scope tuple order in `buildScopePrefix` is fixed by array construction order (tenant, user, agent, session, shared_space), but `normalizeScopeValue` passes `null` entries through the `.filter()`, which means the serialized JSON used for hashing contains only the non-null fields. Two different incomplete scope combinations (e.g., `{tenant: "A", user: null}` vs `{tenant: "A"}`) that resolve to the same non-null fields produce the same hash. This is correct behavior but implicit; if the schema ever allows deliberate nulling of a previously set field the invariant breaks.

**Evidence:**
- `lineage-state.ts:201-219` — `buildScopePrefix` truncates to 24 hex chars
- `lineage-state.ts:254-270` — plain-text key assembly; the 24-char hash prefix is not re-hashed within the key
- `lineage-state.ts:226-243` — `buildHashedLogicalKey` used only when components contain `::`, not universally applied

**Fix:**
Extend the scope hash to the full 64-char SHA-256 hex (256 bits) to eliminate the practical collision surface. Alternatively, apply `buildHashedLogicalKey` unconditionally when a scope prefix is present to move the full key into a collision-resistant hash space. Document the null-field normalization invariant in a code comment.

---

### [P1] Reconsolidation merge emits lineage transition outside the commit transaction

**File:** `mcp_server/lib/storage/reconsolidation.ts:266-362`

**Issue:**
`executeMerge` wraps the main mutation (archive old, insert new, vec embed, causal edge, BM25, history) in a `db.transaction()` block at line 266. However, `recordLineageTransition(db, newId, {...})` is called at line 329 inside that transaction callback. The `recordLineageTransition` function itself calls `database.transaction(...)` internally (`lineage-state.ts:636`). In better-sqlite3, nested transactions are implemented as SAVEPOINTs. If the inner transaction (lineage) succeeds but the outer transaction subsequently rolls back (e.g., due to a BM25 failure at line 335 that throws), the inner SAVEPOINT is committed before the rollback occurs, leaving a lineage row referencing a `newId` that was never committed to `memory_index`. This produces an orphaned lineage entry pointing to a non-existent memory.

**Evidence:**
- `reconsolidation.ts:266` — outer `db.transaction(() => { ... })()`
- `reconsolidation.ts:329-333` — `recordLineageTransition` called inside the outer transaction callback
- `reconsolidation.ts:335-345` — BM25 operations that can throw inside the same callback, after lineage is recorded
- `lineage-state.ts:636` — `recordLineageTransition` itself wraps in `database.transaction()`

**Fix:**
Either move `recordLineageTransition` to after the outer transaction commits (post-commit, similar to the BM25 repair path at lines 364-374), or ensure lineage-write exceptions cause the outer transaction to re-throw and roll back. A post-commit lineage write is simpler and removes the nested-savepoint concern entirely — if the memory insert commits, lineage is written; if the memory insert fails, no lineage is attempted.

---

### [P2] Access-tracker accumulator flushes without holding a write-exclusive lock during DB rebind

**File:** `mcp_server/lib/storage/access-tracker.ts:63-77`

**Issue:**
`init(database)` at line 63 clears the accumulator map when the database reference changes (lines 65-67: `accumulators.clear()`), which prevents cross-database bleed. However, the flush interval at line 72 holds a reference to `db` at the time each 30-second tick fires. There is a narrow window during database rebind where:
1. A flush tick fires and reads the old `db` reference.
2. `init(newDatabase)` executes, clearing accumulators and updating `db`.
3. The in-flight flush continues writing to the old `db` handle.

The old handle may already be closed by `close_db()` at this point, causing the flush to throw or write to a stale database. The exit-handler path (`initExitHandlers`) has a liveness check (`SELECT 1`) but the interval flush at line 72 calls `reset()` directly without such a guard.

**Evidence:**
- `access-tracker.ts:63-77` — `init` and interval setup
- `access-tracker.ts:247-255` — `reset()` iterates `accumulators` and calls `flushAccessCounts` with whatever `db` is current at tick time
- `access-tracker.ts:264-296` — exit handlers include liveness check; interval flush does not

**Fix:**
Add the same liveness check (probe `SELECT 1`) to the interval-based `reset()` path, or cancel and re-register the flush interval inside `init()` each time the database reference changes to ensure the new interval captures the correct `db` binding through closure.

---

### [P2] DB-state rebind listener silently ignores consumer init failure

**File:** `mcp_server/core/db-state.ts:140-151`

**Issue:**
The vector-index database-connection-change listener at lines 140-149 calls `rebindDatabaseConsumers(database)` but discards the boolean return value. `rebindDatabaseConsumers` returns `false` when the session manager fails to initialize (lines 163-169). The listener path catches thrown errors but not a `false` return, so a failed rebind leaves some consumers on the new handle and others potentially stale, without any signal to the caller or calling handler.

This is a narrower variant of the split-brain concern (noted in previous iteration), specific to the listener path rather than the direct `reinitializeDatabase` path. The direct path at lines 279-281 does check the boolean and returns it to the caller. The listener path does not.

**Evidence:**
- `db-state.ts:140-149` — listener callback discards `rebindDatabaseConsumers` return value
- `db-state.ts:154-177` — `rebindDatabaseConsumers` returns `false` on session manager failure
- `db-state.ts:279-281` — direct `reinitializeDatabase` path correctly checks the boolean

**Fix:**
In the listener callback at line 146, check the return value of `rebindDatabaseConsumers(database)` and log a hard error (or emit a state-inconsistency flag that subsequent tool handlers can detect) when it returns `false`. This makes the split-brain window observable and actionable.

---

## Summary

This pass found one blocking governance bypass (P0: scoped restore + scope-matching logic permits folder-wide deletes by scoped callers), two structural integrity risks (P1: scope-hash truncation creates a lineage collision surface; P1: reconsolidation lineage write inside outer transaction enables orphaned lineage on rollback), and two lower-severity operational gaps (P2: access-tracker interval flush has no DB-liveness guard; P2: db-state rebind listener silently drops a failed-rebind signal).

The lineage-state SHA-256 full-key path (`buildHashedLogicalKey`) is sound when triggered, but it is only triggered for `::` collisions — not universally applied when a scope prefix is present, which is the higher-risk path. The reconsolidation outer-transaction + nested-lineage pattern is the highest correctness risk: an orphaned lineage row is operationally silent and will cause incorrect version chain resolution on future saves.

No new cross-tenant accumulator bleed was found in `access-tracker.ts` (the `init` guard at lines 63-67 correctly clears on DB swap). The `db-state.ts` constitutional-cache concern from previous iterations remains relevant in the `vector-index-store.ts` cache-key design but was not re-examined here as it was already classified.
