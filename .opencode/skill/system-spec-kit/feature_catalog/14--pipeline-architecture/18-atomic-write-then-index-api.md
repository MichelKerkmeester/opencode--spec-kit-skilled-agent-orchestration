# Atomic write-then-index API

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Atomic write-then-index API.

## 2. CURRENT REALITY

The `memory_save` handler offers an atomic write-then-index mode where file writing is atomic (pending file + rename), while indexing runs asynchronously after the write succeeds. The transaction manager writes memory content to a `_pending` file and renames it to the final path. The `dbOperation` callback in this path is intentionally a no-op; `indexMemoryFile(...)` executes afterward and can retry once on transient failures.

Because indexing is decoupled from the file rename, this flow provides atomic file persistence with guarded best-effort index consistency (retry + rollback), not a single file+DB transaction. The `AtomicSaveResult` interface reports `dbCommitted` to distinguish full success from partial commit states (for example, DB callback committed but rename failed, leaving a pending file for startup recovery).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Atomic write + DB transaction coupling |
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler using atomic write path |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Atomic-save retry and rollback behavior in handler flow |

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Atomic write-then-index API
- Current reality source: audit-D04 gap backfill
