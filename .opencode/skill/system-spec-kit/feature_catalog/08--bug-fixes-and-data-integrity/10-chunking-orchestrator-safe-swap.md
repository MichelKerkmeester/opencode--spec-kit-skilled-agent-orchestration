---
title: "Chunking Orchestrator Safe Swap"
description: "Tracks the staged swap pattern that prevents data loss during re-chunking by indexing new chunks before deleting old ones."
---

# Chunking Orchestrator Safe Swap

## 1. OVERVIEW

Tracks the staged swap pattern that prevents data loss during re-chunking by indexing new chunks before deleting old ones.

When a large document gets re-split into smaller pieces, the system used to delete the old pieces before creating the new pieces. If creating the new pieces failed, you lost both old and new. Now it creates the new pieces first and only swaps them in once everything is ready, like building a new fence before tearing down the old one. Phase 13 hardening also moves safe-swap cleanup into the same finalization transaction, adds compensating cleanup for staged chunk trees if finalization fails, and delays parent BM25 mutation until the new chunk set is known to be viable.

---

## 2. CURRENT REALITY

During re-chunking of parent memories, the orchestrator previously deleted existing child chunks before indexing new replacements. If new chunk indexing failed (all embeddings fail, disk full), both old and new data were lost. The fix introduces a staged swap pattern: new child chunks are indexed first without a `parent_id` link, then a single database transaction atomically attaches the new children to the parent, updates parent metadata, nulls `parent_id` on old children, and bulk-deletes those old children only after the swap is ready to commit. If finalization fails, compensating cleanup deletes the staged replacement chunk tree and keeps the old children linked to the parent. Parent BM25 updates are also delayed until at least one chunk succeeds and, in safe-swap mode, until finalization completes, so all-chunks-failed rollback preserves the old parent BM25 state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Re-chunk swap logic with staged indexing |
| `mcp_server/handlers/memory-save.ts` | Handler | Chunked-save finalize path that records PE supersede state after chunked indexing succeeds |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunking-orchestrator-swap.vitest.ts` | Staged-swap success, rollback, partial-embedding, and cache-key normalization regressions |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Chunked-save finalize rollback when PE supersede finalization fails after chunk indexing |

---

## 4. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Source feature title: Chunking Orchestrator Safe Swap
- Current reality source: P0 code review finding (2026-03-08)
