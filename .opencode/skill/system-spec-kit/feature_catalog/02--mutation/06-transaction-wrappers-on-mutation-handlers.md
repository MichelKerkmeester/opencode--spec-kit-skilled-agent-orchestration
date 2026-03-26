---
title: "Transaction wrappers on mutation handlers"
description: "Covers the database transaction wrappers that ensure atomicity across update, delete and reconsolidation mutation paths."
---

# Transaction wrappers on mutation handlers

## 1. OVERVIEW

Covers the database transaction wrappers that ensure atomicity across update, delete and reconsolidation mutation paths.

Every time the system saves or changes your data, it wraps the operation in a safety net. If anything goes wrong mid-save, all changes roll back so you never end up with half-written or corrupted information. This is like a bank transfer that either completes fully or does not happen at all.

---

## 2. CURRENT REALITY

`memory-crud-update.ts` wraps its mutation steps in a transaction (`runInTransaction`) so the DB update, embedding status write, BM25 re-index and mutation ledger append either commit together or roll back together. `memory-crud-delete.ts` wraps both the single-delete and bulk-folder delete paths in database transactions so confirmed deletes, history rows, causal-edge cleanup and mutation-ledger entries stay aligned. Cache invalidation and post-mutation hooks remain outside the transaction as in-memory/post-commit work. Unlike update, delete no longer falls back when the DB handle is missing: it aborts early to avoid orphaned causal edges or missing audit/history writes. The reconsolidation bridge `storeMemory` callback also wraps index, metadata, BM25 and history writes in a transaction for atomicity. Lifecycle `recordHistory()` writes now run inside mutation transactions across ADD/UPDATE/DELETE paths, and update BM25 handling distinguishes infrastructure failures (warn and continue) from data failures (roll back).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Memory update CRUD handler |
| `mcp_server/handlers/memory-crud-delete.ts` | Handler | Memory delete CRUD handler |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Handler | Reconsolidation store path that wraps index, metadata, BM25, and history writes in one transaction |
| `mcp_server/lib/storage/history.ts` | Lib | History writes that now execute inside mutation transactions |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction management |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-crud.vitest.ts` | CRUD handler validation |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Extended transactional mutation scenarios |
| `mcp_server/tests/history.vitest.ts` | Mutation history validation |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |

---

## 4. SOURCE METADATA

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Transaction wrappers on mutation handlers
- Current reality source: FEATURE_CATALOG.md
