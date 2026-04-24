# Pass 2 · Iteration 002 — correctness (verify P0-002 closure)

## Dispatcher
- iteration: 2 of 7
- pass: 2
- dimension: correctness-P0-002-verification
- dispatcher: @deep-review (LEAF)
- timestamp: 2026-04-24T10:40:00Z
- session: 2026-04-24T09:48:20.783Z (generation 2, lineageMode=restart)
- parentSessionId: 2026-04-24T08:04:38.636Z

## Summary

Wave-1 remediation for P0-002 is **CLOSED**. `validateMemoryRow` at `lib/storage/checkpoints.ts:1291-1360` now enforces BOTH invariants before any SQL write: `shouldIndexForMemory` on the resolved path (line 1324, rejects + audits z_future/external/z_archive rows with `decision='deny'`), and `isConstitutionalPath` on constitutional-tier rows (line 1342, downgrades to `'important'` + audits with `decision='conflict'`). The validator is called inside the restore transaction at line 1640 BEFORE any INSERT/UPDATE runs, and any row-level throw propagates up through `throw new Error('Restore validation failed: ...')` at 1642, which aborts the `database.transaction(...)` at 1636 — SQLite rolls back atomically. The `INSERT OR REPLACE / INSERT OR IGNORE` statement (lines 1606-1611) and the `UPDATE` statement (1614-1619) both sit inside the same transaction closure. Governance audits are collected in a pre-allocated `governanceAudits` array and flushed in the outer `finally` block (line 1847) AFTER rollback — so rejected-path audits survive a rolled-back restore, which is the correct observability property. Seven bypass probes attempted, all blocked. NO new findings.

## P0-002 Status: CLOSED

## Evidence of closure

### Guard locations
- **`shouldIndexForMemory` call** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1324` — inside `validateMemoryRow`, after identity-field validation, computes `resolvedPath = canonical_file_path || file_path` (line 1320-1322), calls `shouldIndexForMemory(resolvedPath)`; on false, pushes `checkpoint_restore_excluded_path_rejected` audit (decision=`deny`) and throws.
- **`isConstitutionalPath` check** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1342` — after the `shouldIndexForMemory` gate passes, if `importance_tier === 'constitutional'` and path is NOT under `/constitutional/`, mutates `r.importance_tier = 'important'` (line 1358) and pushes `tier_downgrade_non_constitutional_path` audit (decision=`conflict`). Does NOT throw — allows the downgraded row to restore.
- **Governance_audit emission** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1325-1338` (reject), `:1343-1358` (downgrade), flushed via `flushGovernanceAudits` at `:1848` in the `finally` block. `flushGovernanceAudits` at `:92-103` iterates the entries and calls `recordGovernanceAudit` per-entry.
- **Transaction boundary** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1628` `acquireRestoreBarrier()`, `:1629` `restoreBarrierHeld = true`, `:1636` `const restoreTx = database.transaction(() => { ... })`, `:1838` `restoreTx()`, released in `finally` at `:1850-1852`.
- **Validation site INSIDE transaction** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1637-1645` — FIRST action inside the transaction closure is a pre-flight sweep over `memoryRows` that calls `validateMemoryRow(memoryRows[i], i, governanceAudits)` for every row. A single throw aborts the whole transaction before any write is attempted.
- **INSERT OR REPLACE/IGNORE site** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1606-1611` — statement PREPARED before transaction, EXECUTED at `:1755` via `memoryInsertStmt.run(...)` inside the transaction closure at line 1681 (for-loop over `memoryRows`), which is AFTER the validation sweep at :1637-1645.
- **UPDATE site** — `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1614-1619` — statement PREPARED before transaction, EXECUTED at `:1765` via `memoryUpdateStmt.run(...)` inside the transaction closure. Also gated by the validation sweep.

### Test coverage — `tests/checkpoint-restore-invariant-enforcement.vitest.ts` (245 lines)
- **Clean-constitutional preservation** (line 214-244): seeds checkpoint with `file_path='/workspace/.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md'`, tier=`'constitutional'`. Asserts `importance_tier === 'constitutional'` persists AND `governance_audit count === 0`.
- **Poisoned-constitutional downgrade** (line 124-159): seeds `file_path='/workspace/.opencode/specs/.../plan.md'` (non-constitutional), tier=`'constitutional'`. Asserts `result.errors === []`, `result.restored === 1`, final `importance_tier === 'important'`, AND exactly one `tier_downgrade_non_constitutional_path` audit row.
- **Walker-excluded row aborts restore** (line 161-212): seeds a baseline row (id=9, outside z_future) PRE-restore, then inserts a checkpoint with `file_path='/workspace/.opencode/specs/.../z_future/011/spec.md'`. Runs restore with `clearExisting=true`. Asserts (a) `result.errors` includes `'path excluded from memory indexing'`, (b) baseline row id=9 REMAINS (atomic rollback verified — the restore would have DELETED id=9 first, so its survival proves ROLLBACK restored the pre-restore DB), (c) exactly one `checkpoint_restore_excluded_path_rejected` audit row flushed after rollback.
- **Real code path exercised**: test imports `* as checkpointStorage from '../lib/storage/checkpoints.js'` (line 6), calls `checkpointStorage.restoreCheckpoint(name, true)` against a real `better-sqlite3` in-memory DB. The production code path (validateMemoryRow → transaction → INSERT statement) runs end-to-end. No mocks around the guard. ✓

### Gaps in test coverage (noted, not findings)
- No test for **partial failure in merge mode** (`clearExisting=false`): a mix of good + bad rows in the snapshot. Wave-1 test only covers clearExisting=true path. In merge mode the validation sweep still runs at :1637-1645 before any writes, so the invariant holds — but a regression test would lock this in.
- No test for **multi-row atomic abort** (one good row + one bad z_future row in same checkpoint). Fail-closed is structurally guaranteed by the pre-write sweep, but explicit test would be ideal.
- No test for **path-traversal snapshot** (e.g., `./foo/../z_future/bar.md`). The regex `(^|/)z_future(/|$)` still matches the `z_future` segment in such a path (probed below), so the guard is robust, but not unit-tested.

### Live DB parity
- `sqlite3 context-index__voyage__voyage-4__1024.sqlite "SELECT COUNT(*) FROM checkpoints;"` → **0**. No prior checkpoints exist to exercise the new guard on real data; clean-slate posture.

## Bypass probes attempted

1. **Normalized-but-not-canonical path (`./foo/../z_future/bar.md`)** — `normalizeIndexScopePath` at `lib/utils/index-scope.ts:12-18` only normalizes backslashes to `/` and collapses `//` to `/`. It does NOT resolve `..` or `.` segments. HOWEVER the EXCLUDED_FOR_MEMORY regex `(^|/)z_future(/|$)` with case-insensitive flag (line 9) matches ANY `z_future` directory segment anywhere in the path — including `/foo/../z_future/bar.md` (matches the literal `/z_future/` substring). Same logic catches `/.opencode/z_future/.././constitutional/x.md` — `z_future` appears as a segment, row rejected. Result: **blocked**.
2. **Empty / null `file_path` or `canonical_file_path`** — at line 1305, `if (typeof r.file_path !== 'string' || !r.file_path) throw`. An empty file_path or non-string (including null/undefined) fails the identity check BEFORE reaching the scope guard. `canonical_file_path` falls back to `file_path` via line 1320 (`|| r.file_path`), so an empty canonical but valid file_path uses file_path. Fail-closed on missing/empty. Result: **blocked**.
3. **Constitutional tier on non-`/constitutional/` but also non-excluded path** — e.g., `file_path='/workspace/specs/foo/plan.md'`, tier=`'constitutional'`. `shouldIndexForMemory` passes (no z_future/external/z_archive segment), then `isConstitutionalPath` fails, so the downgrade branch at :1342-1359 mutates `r.importance_tier = 'important'` and audits with decision=`conflict`. Downgrade (not rejection) is the correct behavior per the test suite's second case. Result: **handled distinctly from rejection**.
4. **One bad row among good rows (atomic abort)** — the validation loop at :1637-1645 throws on the FIRST invalid row, which propagates out of `restoreTx()` at :1838, which rolls back the transaction including any earlier rows that had been processed… but wait — the validation loop is a PRE-FLIGHT SWEEP that validates ALL rows first, THEN loops to actually insert (the insert loop is at :1681). So validation is fully separated from insertion: if ANY row fails validation, NO rows are inserted. This is stronger than per-row atomicity — it's pre-flight atomicity. Result: **atomic abort verified**.
5. **`force` / `skipValidation` backdoor** — `grep 'force\|skipValidation\|skip_validation\|bypass' checkpoints.ts` returned only a comment ("Enforce max checkpoints" at :1448). `restoreCheckpoint` signature is `(nameOrId, clearExisting, scope)` — no force flag, no validation-skip flag, no admin-override parameter. The only way to reach the INSERT statement is through the validated path. Result: **blocked**.
6. **Lower-level DB function bypass (direct `INSERT OR REPLACE INTO memory_index`)** — grep across `mcp_server/lib` and `mcp_server/handlers` for `INSERT OR REPLACE INTO memory_index` and `INSERT OR IGNORE INTO memory_index` returns ZERO hits outside `checkpoints.ts` itself. The only `INSERT INTO memory_index` sites are: `vector-index-mutations.ts:277, 376` (both post-save-guard), `lineage-state.ts:453`, `reconsolidation.ts:329`, `schema-downgrade.ts:284` (migration-only). None of them are `OR REPLACE` / `OR IGNORE` semantics, none are reachable from an attacker-crafted checkpoint payload, and all consume `parsed.importanceTier` or hard-coded `'deprecated'`. Result: **no alternative INSERT path**.
7. **Writing to `checkpoints` table directly (bypass `checkpoint_create`)** — this is the pass-1 iter-6 attack hypothesis: can an attacker write a poisoned row directly to the `checkpoints` table and then trigger `checkpoint_restore` to hydrate it? Today, `checkpoint_restore` as documented IS the last line of defense. `validateMemoryRow` now IS that defense; the snapshot blob is decompressed, parsed, and every row runs through the guard before ANY write lands in `memory_index`. Result: **restore-time validator holds the line; blocked**.

## Chain integrity verdict (end-to-end exploit chain from pass-1 iter-7)

| Step | Attack vector | Status with Wave-1 patches |
|---|---|---|
| 1 | `memory_update({ id, importanceTier: 'constitutional' })` on non-constitutional path | **BLOCKED** — Pass 2 iter-1 verified P0-001 closed via SQL-layer + post-insert-metadata + handler guards; path-aware downgrade + audit |
| 2 | Alter `file_path` on an already-constitutional row via update tool | **BLOCKED** — `memory_update` schema at `tool-schemas.ts:294-297` omits `filePath`; the `UPDATE memory_index SET ... = ?` in `update_memory` (vector-index-mutations.ts:517-519) only writes whitelisted fields, `file_path` is not in the writer set. No tool can mutate `file_path` post-creation without going through `memory_save` (which re-runs the guard). |
| 3 | Poisoned checkpoint creation: write raw row to `checkpoints` table bypassing `checkpoint_create` | **BLOCKED AT RESTORE-TIME** — even if an attacker writes a poisoned `memory_snapshot` blob directly (requires DB-file write access), `validateMemoryRow` now gates every row at restore. Rows with excluded paths throw → rollback; rows with constitutional+non-constitutional-path downgrade + audit. |
| 4 | `checkpoint_restore` with tampered snapshot | **BLOCKED** — this iteration verified: shouldIndexForMemory + isConstitutionalPath both enforced pre-write inside the transaction. Atomic rollback on any excluded-path row. Downgrade with audit on any constitutional-tier-on-non-constitutional-path row. |
| 5 | Post-restore async poison re-trigger (e.g., embedding regen reads tier) | **NOT A RISK** — the guards MUTATE the row's `importance_tier` field in-place at :1358 before `memoryInsertStmt.run(...)` runs at :1755. The inserted row already has the corrected tier; any downstream pipeline reads `'important'`, not `'constitutional'`. `runPostRestoreRebuilds` at :1839 consumes the just-inserted `memory_index` state. |

**Chain integrity: the compound P0-001+P0-002 exploit is fully severed.** No step in the original iter-7 chain reaches memory_index with a forbidden `(file_path, importance_tier)` combination.

One residual observation (not a finding — already covered as P2-pass2-003 from iter-1): constitutional→critical or constitutional→deprecated downgrades via some OTHER tool may not emit a governance_audit, but that is a separate observability question, not an invariant-bypass question. The `file_path`-level invariant is held.

## New findings (this iteration)

### P0
None.

### P1
None.

### P2
None.

### Related prior-pass findings (status tracked in registry)
- **P0-002 — RESOLVED**: closed by Wave-1 `validateMemoryRow` extensions at `checkpoints.ts:1291-1360`, running inside barrier-held transaction at :1628-1838, with atomic pre-flight validation sweep at :1637-1645 before any INSERT/UPDATE.

## Traceability Checks

- **guard-call-site protocol**: pass — both `shouldIndexForMemory` (at :1324, rejects with deny audit + throw) and `isConstitutionalPath` (at :1342, downgrades with conflict audit, no throw) present in `validateMemoryRow`.
- **transaction-atomicity protocol**: pass — validation sweep precedes ALL writes; any throw rolls back the entire transaction via SQLite's `database.transaction(fn)` error semantics. Confirmed via Wave-1 test asserting baseline row id=9 survives a poisoned-z_future restore that used `clearExisting=true`.
- **audit-emit-on-rollback protocol**: pass (with observability twist) — governance audits are collected in a pre-allocated `GovernanceAuditEntry[]` and flushed in the OUTER `finally` block at :1847-1849. This means rejected rows still produce audit trails even when the transaction rolls back. Verified by Wave-1 test line 204-211.
- **grep-of-last-resort protocol**: pass — zero `INSERT OR REPLACE INTO memory_index` or `INSERT OR IGNORE INTO memory_index` sites outside `checkpoints.ts:1606-1611`. No alternative checkpoint-like re-hydration path exists.
- **live-db parity**: no pre-existing checkpoints (count=0). Validator can be exercised only when future checkpoints are created + restored; no retroactive exposure.

## Confirmed-Clean Surfaces

- `validateMemoryRow` fail-closed semantics on missing/empty/non-string `file_path` (probe 2).
- Validator pre-flight sweep separates validation from insertion (probe 4: atomic abort verified).
- No `force`/`skipValidation` backdoor in `restoreCheckpoint` signature or body (probe 5).
- No lower-level INSERT path bypasses the validator (probe 6).
- Case-insensitive path matching via `compileSegmentPattern` (iter-1 probe 5 result carries forward).
- Pre-flight DDL (ensureWorkingMemorySchema at :1624-1626) is OUTSIDE the transaction, so no auto-commit corrupts the restore transaction.
- Governance-audit flush survives rollback (entries collected in closure-scoped array, flushed in outer finally).

## Coverage
- Dimension: correctness-P0-002-verification — covered
- Files reviewed: 4 (see Files Reviewed)
- Remaining pass-2 dimensions: audit trail / P1-008+P1-016 (iter-3), traceability / strategy drift (iter-4), maintainability regression (iter-5), exploit-chain end-to-end (iter-6), synthesis (iter-7)

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` (deep: 1-180, 1175-1360, 1545-1856)
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` (full: 1-52)
- `.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts` (full: 1-245)
- Live DB: `context-index__voyage__voyage-4__1024.sqlite` (checkpoints count query)

## Next iteration focus

**Pass 2 Iter 3 — verify P1-008 and P1-016 (audit trail gaps) closure.** Read `memory-save.ts` guard at :298-340 for `tier_downgrade_non_constitutional_path` audit emission, read `memory-crud-update.ts:153-208` for re-verification audit. Verify `governance_audit` rows are produced on save-path and update-path downgrades (not just checkpoint path). Cross-reference with pass-1 findings registry entries P1-008 and P1-016 for the original gaps. Probe for downgrade scenarios that still emit ZERO audit rows.
