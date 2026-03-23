---
title: "Atomic write-then-index API"
description: "The atomic write-then-index API provides crash-safe file persistence via pending-file rename with decoupled asynchronous indexing."
---

# Atomic write-then-index API

## 1. OVERVIEW

The atomic write-then-index API provides crash-safe file persistence via pending-file rename with decoupled asynchronous indexing.

When saving a memory, the system first writes the file safely to a temporary location and only moves it to the final spot once the write is confirmed complete. If a crash happens mid-save, the half-written file can be recovered on the next startup. This prevents data loss the same way a word processor auto-saves a draft before overwriting your real document.

---

## 2. CURRENT REALITY

The `memory_save` handler now owns the atomic save flow directly. It computes a unique pending path, writes the memory content to that pending file, runs async indexing against the target file path before promotion, retries indexing once on transient failure, and only then renames the pending file into place. If validation, rejection, or indexing fails, the handler deletes the pending file so the original file remains untouched.

This means the current implementation is a direct write/index/rename flow coordinated in `memory-save.ts`, with `transaction-manager.ts` supplying pending-path and cleanup helpers rather than owning a `dbOperation` callback transaction. The result is atomic file promotion plus guarded best-effort index consistency: a failed index attempt rolls back before rename, while a post-index rename failure leaves the pending file in place for recovery and returns `dbCommitted: true`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Direct pending-write, async index, rollback, and final rename orchestration |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Pending-path derivation and pending-file cleanup/recovery helpers |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Atomic-save retry and rollback behavior in handler flow |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Atomic write-then-index API
- Current reality source: audit-D04 gap backfill
