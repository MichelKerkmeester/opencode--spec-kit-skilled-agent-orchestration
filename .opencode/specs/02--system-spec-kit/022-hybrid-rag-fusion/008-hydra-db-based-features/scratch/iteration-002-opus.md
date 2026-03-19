# Iteration 002 — Handler Integration Layer

**Focus:** How lineage, governance, and shared-memory compose in the save flow. Transaction boundaries, error propagation, and integration bugs between the modules surfaced in iteration 1.

---

## Findings

### F1: Governance check happens outside any DB transaction — orphan audit rows on later failure (BUG)

In `handleMemorySave()` (memory-save.ts:793-820), `ensureGovernanceRuntime()` and `validateGovernedIngest()` run first, then `assertSharedSpaceAccess()` if applicable. If governance allows the save, but the subsequent `indexMemoryFile()` call fails (e.g., embedding error, quality gate rejection, validation failure), the **governance audit "allow" row is never written** because `recordGovernanceAudit(..., 'allow')` only runs *after* a successful index result at line 979. However, the **deny audit row IS written immediately** on governance rejection (line 809-818).

This means governance audit is asymmetric: denials are always logged, but allows are only logged on full success. If the save fails midway (after governance approval but before the post-insert governance metadata write at line 978), there is **no audit trail** of the approved-but-failed attempt.

**Severity:** Low-medium. Audit completeness gap rather than data corruption.

**SOURCE:** `handlers/memory-save.ts:793-820, 977-990`

### F2: Governance metadata applied as a separate UPDATE after the main insert — not inside the create-record transaction (BUG)

The `createMemoryRecord()` function in `save/create-record.ts:120-247` wraps its work in `database.transaction()`. This transaction handles: vector index insert, post-insert metadata, PE-gate related_memories, predecessor deprecation, lineage transition, BM25 indexing, and history recording.

However, **governance metadata** is applied *after* this transaction completes, at `memory-save.ts:978`:
```
applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision));
```

This `applyPostInsertMetadata` call runs **outside** the `createMemoryRecord` transaction. If it fails (e.g., unknown column, DB locked), the memory record exists without governance fields (tenant_id, user_id, agent_id, session_id, shared_space_id, provenance_source, retention_policy, etc.). The memory would be **ungoverned despite passing governance validation**.

Similarly, the `recordGovernanceAudit` at line 979-990 and shared-conflict detection at lines 992-1009 all run outside the core insert transaction.

**Severity:** Medium. Creates a window where a memory record exists without its governance scope fields, violating the governance contract.

**SOURCE:** `handlers/memory-save.ts:970-1009`, `handlers/save/create-record.ts:120-247`

### F3: Double lineage recording — `recordLineageTransition` + `recordLineageVersion` for same event (BUG)

In `processPreparedMemory()` (memory-save.ts:610-648), when a same-path existing memory is found:

1. `createMemoryRecord()` (or `createAppendOnlyMemoryRecord()`) is called, which internally calls `recordLineageTransition()` at `create-record.ts:210-214` inside its transaction.
2. Immediately after, `recordLineageVersion()` is called at `memory-save.ts:639-648` with the same transition event.

These are **two different functions** writing to **different tables** (`memory_lineage_transitions` vs `memory_lineage_versions`), so they are not duplicates per se. However:
- `recordLineageTransition` runs inside the `createMemoryRecord` transaction
- `recordLineageVersion` runs **outside** any transaction, after the `createMemoryRecord` transaction commits

If `recordLineageVersion` fails, the memory exists with a transition record but no version record. The inverse cannot happen. This creates a **lineage consistency gap** where `inspectLineageChain()` (which reads from `memory_lineage_versions`) would miss the version, while `getActiveMemoryProjection()` might still work from the transition table.

**Severity:** Low-medium. Data consistency issue between two lineage tracking mechanisms.

**SOURCE:** `handlers/memory-save.ts:639-648`, `handlers/save/create-record.ts:210-214`

### F4: `updateExistingMemory` in pe-gating.ts has its own transaction but duplicates lineage logic (DESIGN ISSUE)

`updateExistingMemory()` (pe-gating.ts:228-318) runs its own `database.transaction()` that includes:
- New vector index insert
- Post-insert metadata
- Predecessor deprecation
- `recordLineageTransition()` (inside transaction)
- History recording

This is essentially a **parallel implementation** of the same logic in `createMemoryRecord()` (create-record.ts), but with slightly different behavior:
- `updateExistingMemory` always passes `appendOnly: true`
- `updateExistingMemory` handles the "UPDATE" transition event
- `createMemoryRecord` also handles "UPDATE" via the `predecessorMemoryId` logic

The `processPreparedMemory` function (memory-save.ts:610-637) has a **third path** using `createAppendOnlyMemoryRecord`. This means there are **three separate code paths** for essentially the same operation (create-with-predecessor), each with slightly different transaction boundaries and error handling.

**Severity:** Medium. Code duplication across three paths increases risk of divergent behavior and makes bugs harder to fix consistently.

**SOURCE:** `handlers/pe-gating.ts:228-318`, `handlers/save/create-record.ts:98-248`, `handlers/memory-save.ts:610-637`

### F5: `reinforceExistingMemory` has no transaction wrapping — partial update possible (BUG)

In `pe-gating.ts:140-199`, `reinforceExistingMemory()` performs:
1. SELECT to get current memory state
2. FSRS stability calculation
3. UPDATE to write new stability + importance_weight + content_text

These are **not wrapped in a transaction**. If another process modifies the memory between the SELECT and UPDATE (e.g., concurrent save for the same spec folder), the FSRS calculation could be based on stale data. The `withSpecFolderLock` mutex in `processPreparedMemory` protects against this for same-spec-folder operations, but `reinforceExistingMemory` is called from `evaluateAndApplyPeDecision` which runs inside the lock. However, the lock is **per-process only** (an in-memory `Map`), so multiple MCP server instances would not be protected.

**Severity:** Low in single-instance deployments. Would be medium in multi-instance.

**SOURCE:** `handlers/pe-gating.ts:140-199`

### F6: Shared-space conflict detection runs after commit — race condition (BUG)

In `handleMemorySave()` (memory-save.ts:992-1009), after the memory is successfully indexed and governance metadata is applied, the handler checks for shared-space conflicts:

```typescript
const existing = database.prepare(`
  SELECT id FROM memory_index
  WHERE shared_space_id = ? AND file_path = ? AND id != ?
  ORDER BY id DESC LIMIT 1
`).get(sharedSpaceId, validatedPath, result.id);
if (existing?.id) {
  recordSharedConflict(database, { ... });
}
```

This conflict detection runs **after** the new record is already committed. Two concurrent saves to the same shared space + file path would both succeed, both detect each other as conflicts, and both record conflict entries. The conflict is **recorded but not prevented**. This aligns with the iteration 1 finding about race-prone conflict escalation in `shared-spaces.ts`.

**Severity:** Medium. Shared-space conflict detection is post-hoc rather than preventive, allowing duplicate entries.

**SOURCE:** `handlers/memory-save.ts:992-1009`

### F7: `atomicSaveMemory` retry can create orphan DB records (BUG)

In `atomicSaveMemory()` (memory-save.ts:1031-1082), the retry loop:
1. Parses and prepares the memory content
2. Writes the pending file
3. Calls `processPreparedMemory()` which inserts DB records
4. If status is 'error', throws to trigger retry

On failure (step 4), `deleteFileIfExists(pendingPath)` cleans up the pending file, but **the DB records inserted by `processPreparedMemory` are not rolled back**. The `createMemoryRecord` transaction commits its work atomically, so if the function returns (even with an error status), DB rows exist. On retry (attempt 2), a new set of records is created, leaving the records from attempt 1 as orphans.

The `checkContentHashDedup` and `checkExistingRow` functions may catch this on retry (since same content hash or file path), but only if the first attempt got far enough to insert with the same hash/path.

**Severity:** Medium. Orphan DB records after retry create noise in lineage and search results.

**SOURCE:** `handlers/memory-save.ts:1041-1082`

### F8: `withSpecFolderLock` silently swallows predecessor errors (DESIGN ISSUE)

The spec-folder lock (memory-save.ts:122-135) chains promises:
```typescript
const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
  .catch((_error: unknown) => {})
  .then(() => fn());
```

The `.catch((_error: unknown) => {})` silently swallows errors from the **previous** save in the chain. This means if save A fails, save B proceeds as if nothing happened. While this prevents cascading failures, it also means there is no mechanism to detect or log when a chained save proceeds after a predecessor failure. Combined with F7 (orphan records from retries), this could lead to save B proceeding on top of orphan records from save A.

**Severity:** Low. Defensive programming, but could mask issues in high-concurrency scenarios.

**SOURCE:** `handlers/memory-save.ts:122-135`

### F9: Test coverage gaps — no integration tests for governance + lineage + save flow (TEST GAP)

Reviewing the test files:
- `memory-governance.vitest.ts`: Tests `validateGovernedIngest`, `filterRowsByScope`, `recordGovernanceAudit`, `runRetentionSweep` in **isolation**. No test covers the full `handleMemorySave` flow with governance parameters.
- `memory-lineage-state.vitest.ts`: Tests `recordLineageVersion`, `getActiveMemoryProjection`, `inspectLineageChain`, `resolveMemoryAsOf` in **isolation** with manual DB setup. No test covers lineage recording through the actual save handler.
- `handler-memory-save.vitest.ts`: Tests are marked `[deferred - requires DB test fixtures]` and only validate exports, input validation, and source code patterns (string matching). No actual DB-backed integration tests.
- `shared-spaces.vitest.ts`: Tests shared-space module in isolation.

There are **no integration tests** that exercise the full path: `handleMemorySave(args with governance fields)` -> governance check -> shared-space check -> indexing -> governance metadata application -> lineage recording -> conflict detection. All the bugs identified in F1-F7 exist in the **integration seams** between these modules, which are untested.

**Severity:** High. The most critical bugs are in the composition of modules, and none of these compositions are tested.

**SOURCE:** `tests/handler-memory-save.vitest.ts`, `tests/memory-governance.vitest.ts`, `tests/memory-lineage-state.vitest.ts`, `tests/shared-spaces.vitest.ts`

---

## Sources Consulted

| File | Lines | Purpose |
|---|---|---|
| `handlers/memory-save.ts` | 1-1300 | Main save handler, `handleMemorySave`, `indexMemoryFile`, `processPreparedMemory`, `atomicSaveMemory`, `withSpecFolderLock` |
| `handlers/save/create-record.ts` | 1-248 | `createMemoryRecord` with transaction, `findSamePathExistingMemory` |
| `handlers/pe-gating.ts` | 1-374 | `findSimilarMemories`, `reinforceExistingMemory`, `updateExistingMemory`, `markMemorySuperseded`, `logPeDecision` |
| `tests/handler-memory-save.vitest.ts` | 1-100 | Export validation tests (deferred DB tests) |
| `tests/memory-governance.vitest.ts` | 1-120 | Isolated governance unit tests |
| `tests/memory-lineage-state.vitest.ts` | 1-120 | Isolated lineage state unit tests |

---

## Assessment

- **newInfoRatio:** 0.85 — Substantial new findings about integration-layer bugs (F1-F8) that were not visible from the individual module analysis in iteration 1. The transaction boundary gaps (F2, F3, F5) and the orphan-record retry issue (F7) are novel discoveries.
- **Confidence:** High for F1-F4, F6-F7 (directly observed in code). Medium for F5 (depends on deployment model). High for F9 (verified by reading test files).

---

## Recommended Next Focus

**Iteration 3 should investigate the save pipeline decomposition modules** that were factored out (referenced as "CR-P2-4 decomposition"):
1. `handlers/save/pe-orchestration.ts` — `evaluateAndApplyPeDecision`: How PE decisions interact with the three create paths
2. `handlers/save/post-insert.ts` — `runPostInsertEnrichment`: Whether causal links, entity extraction, and summaries have their own transaction issues
3. `handlers/save/dedup.ts` — `checkExistingRow`, `checkContentHashDedup`: Whether dedup checks are consistent across governance-scoped saves
4. `handlers/save/reconsolidation-bridge.ts` — `runReconsolidationIfEnabled`: Transaction boundary with main save
5. `lib/storage/lineage-state.ts` — The 4 bugs from iteration 1, deeper look at `createAppendOnlyMemoryRecord` and how it differs from `createMemoryRecord`

This would complete the save-flow analysis and surface any remaining transaction gaps in the decomposed pipeline.
