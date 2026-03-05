# Transaction wrappers on mutation handlers

## Current Reality

`memory-crud-update.ts` gained a `database.transaction(() => {...})()` wrapper around its mutation steps (vectorIndex.updateMemory, BM25 re-index, mutation ledger). `memory-crud-delete.ts` gained the same for its single-delete path (memory delete, vector delete, causal edge delete, mutation ledger). Cache invalidation operations remain outside the transaction as in-memory-only operations. Both include null-database fallbacks.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Transaction wrappers on mutation handlers
- Current reality source: feature_catalog.md
