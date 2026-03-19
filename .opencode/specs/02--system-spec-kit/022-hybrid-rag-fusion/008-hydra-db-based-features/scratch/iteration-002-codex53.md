# Iteration 2 (Codex-5.3): Vector-Index-Mutations Deep Audit

## Focus
Deep audit of vector-index-mutations.ts for mutation atomicity, embedding lifecycle, delete cleanup completeness, deferred indexing correctness, and concurrency safety.

## Findings

1. **Bug (High): Active projection writes are best-effort — can desync from memory_index** — `index_memory` and `index_memory_deferred` swallow projection failures. Deferred paths are not wrapped in a transaction. Rows can be inserted/updated but become invisible to projection-joined queries.
   — SOURCE: vector-index-mutations.ts:210, 286, 294; vector-index-store.ts:407

2. **Bug (High): `delete_memory_from_database` doesn't clean lineage/projection tables** — Deletes `memory_index` + ancillary rows but not `memory_lineage`/`active_memory_projection` (no FK cascades). Shared-space conflicts also left behind. Corroborates GPT-5.4 retention finding.
   — SOURCE: vector-index-mutations.ts:448, 38; vector-index-schema.ts:935, 999

3. **Bug (High): `update_memory` can create orphan vec_memories rows** — `UPDATE memory_index ... WHERE id=?` result is ignored but vector row delete/insert still runs when embedding provided. Returns `id` regardless of whether update actually applied.
   — SOURCE: vector-index-mutations.ts:403, 408, 426

4. **Bug (High): Deferred re-index can get stuck permanently** — Existing-row deferred update sets `embedding_status='pending'` but doesn't reset `retry_count/last_retry_at`. Retry queue filters out `retry_count >= MAX_RETRIES`, so previously-failed memories can never be re-indexed.
   — SOURCE: vector-index-mutations.ts:274; retry-manager.ts:154

5. **Bug (Medium): Embedding state machine inconsistent** — `update_memory` marks `success` when embedding passed even when sqlite-vec unavailable. `update_embedding_status` allows arbitrary status flips without side effects. 5 states (`pending/success/failed/retry/partial`) with weak transition guarantees.
   — SOURCE: vector-index-mutations.ts:394, 407, 630, 192

6. **Architecture (Medium): Delete operations only partially atomic** — Vector/ancillary cleanup errors don't fail the transaction. BM25 removal is outside DB transaction and best-effort. `memory_index` deletion may commit with orphaned side data.
   — SOURCE: vector-index-mutations.ts:455, 466, 477, 557

7. **Bug (Medium): Concurrency race for same logical memory** — Existence check happens before insert/update and outside one serialized upsert statement. Competing writers can conflict or duplicate logical records.
   — SOURCE: vector-index-mutations.ts:161, 194

8. **Architecture (Low): Governance audit rows not cleaned on delete (by design)** — `governance_audit` and `memory_history` rows preserved on delete. If full redaction expected, current behavior incomplete.
   — SOURCE: vector-index-mutations.ts:452; vector-index-schema.ts:1082, 1680

### Prepared Statements Check
Store-side `WeakMap` cache is correct, but mutations use it for existence lookup which depends on `active_memory_projection`. Projection drift causes false negatives and mutation correctness issues.
   — SOURCE: vector-index-store.ts:377, 384; vector-index-mutations.ts:161

## Sources Consulted
- vector-index-mutations.ts (full file, ~650 lines)
- vector-index-store.ts:377-407 (prepared statements, projection join)
- vector-index-schema.ts:935-1045, 1082-1165 (table definitions, FK presence)
- retry-manager.ts:154 (retry queue filter)
- create-record.ts:120-160 (save flow caller)
- chunking-orchestrator.ts:150-360 (chunked save caller)
- memory-delete-cascade.vitest.ts (cascade test)
- vector-index-impl.vitest.ts:420-560 (deferred indexing tests)

## Assessment
- New information ratio: 0.80 — Orphan vec_memories on update, stuck deferred re-index, and projection desync are all novel. Delete cleanup gap corroborates GPT-5.4.
- Questions addressed: Q1 (bugs in vector mutations), Q4 (architecture — atomicity gaps), Q5 (test gaps for mutation edge cases)

## Recommended Next Focus
- Graph and adaptive-ranking modules (Phase 3-4 coverage)
- Schema-level FK analysis and migration path audit
- Test coverage analysis for the deferred indexing retry path
