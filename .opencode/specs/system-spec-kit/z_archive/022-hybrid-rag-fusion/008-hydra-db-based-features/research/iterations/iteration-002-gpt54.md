# Iteration 2 (GPT-5.4): Retention.ts Deep Audit

## Focus
Deep audit of retention.ts for transaction safety, delete cascading completeness, scope filter correctness, database handle usage, and error handling. Cross-referenced with vector-index-mutations.ts, scope-governance.ts, shared-spaces.ts, and vector-index-schema.ts.

## Findings

1. **Bug (High): Retention sweep not atomic — delete/audit not atomic per memory** — retention.ts:32-76 scans first, then loops. Each delete runs in its own transaction inside vector-index-mutations.ts:448-485, but the audit insert happens afterward in scope-governance.ts:319-340. If one delete throws, the exception aborts the sweep and earlier deletions stay committed. If the delete succeeds but `recordGovernanceAudit()` throws, that memory is already gone with no audit row written.
   — SOURCE: retention.ts:32-76; vector-index-mutations.ts:448-485; scope-governance.ts:319-340

2. **Bug (High): `delete_memory_from_database()` doesn't clean up lineage/projection or shared-space conflicts** — The helper only deletes `vec_memories`, `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities`, `causal_edges`, then `memory_index` in vector-index-mutations.ts:451-468. But `memory_lineage` and `active_memory_projection` are defined without FK cascades in vector-index-schema.ts:933-1045, and `shared_space_conflicts` stores memory IDs without cleanup in vector-index-schema.ts:1146-1156. The lineage validator treats these as integrity problems at lineage-state.ts:800-845.
   — SOURCE: vector-index-mutations.ts:451-468; vector-index-schema.ts:933-1045, 1146-1156; lineage-state.ts:800-845

3. **Bug (Medium): Confirmed shared-memory disable bypass in retention path** — retention.ts:41-45 always passes `getAllowedSharedSpaceIds(database, scope)` into `filterRowsByScope()`. shared-spaces.ts:423-455 doesn't check `isSharedMemoryEnabled()`, even though the access gate does at shared-spaces.ts:475-477. An env-off kill switch doesn't stop retention from treating DB-enabled memberships as valid scope.
   — SOURCE: retention.ts:41-45; shared-spaces.ts:423-455, 475-477

4. **Test Gap (Low): Retention test coverage misses all failure modes** — memory-governance.vitest.ts:201-312 only covers happy-path delete and simple scope boundary. No tests for: mid-sweep delete failure, audit insert failure after delete, lineage/projection/shared-space conflict cleanup, or shared-memory-disabled behavior.
   — SOURCE: memory-governance.vitest.ts:201-312

### Additional Requested Checks

- **Transaction boundaries**: No sweep-level transaction. Scan is outside any transaction. Each delete is only per-row transactional.
- **Delete cascading**: Not sufficient. Lineage/projection and shared-space conflict references left behind.
- **Scope filter correctness**: `filterRowsByScope()` itself is correct. The bug is in the allowlist source (getAllowedSharedSpaceIds bypass).
- **Database handle usage**: `runRetentionSweep()` uses the passed handle consistently. No fallback to `initialize_db()` found.
- **Error handling**: `delete_memory_from_database()` returning false increments `skipped`. Thrown exceptions propagate out and abort remaining sweep.

## Sources Consulted
- retention.ts (full file)
- vector-index-mutations.ts:437-485 (delete helper)
- scope-governance.ts:319-340, 421-447 (audit + filter)
- shared-spaces.ts:423-477 (allowlist + access gate)
- vector-index-schema.ts:933-1045, 1082-1096, 1134-1165 (table definitions, FK presence)
- lineage-state.ts:800-845 (lineage validator)
- memory-governance.vitest.ts:201-312 (retention tests)
- shared-spaces.vitest.ts (shared-memory enable/disable tests)

## Assessment
- New information ratio: 0.80 — Orphaned lineage/projection rows on delete is novel and critical; sweep atomicity and disable bypass confirmed with deeper evidence
- Questions addressed: Q1 (bugs in retention), Q5 (test gaps for retention)

## Recommended Next Focus
- vector-index-mutations.ts deep audit (mutation atomicity, embedding lifecycle)
- Schema-level FK analysis across all Hydra tables
- Whether lineage validator catches and cleans orphans created by retention
