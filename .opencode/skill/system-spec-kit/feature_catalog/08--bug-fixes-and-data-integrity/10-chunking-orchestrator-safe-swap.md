# Chunking Orchestrator Safe Swap

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Tracks the staged swap pattern that prevents data loss during re-chunking by indexing new chunks before deleting old ones.

## 2. CURRENT REALITY
During re-chunking of parent memories, the orchestrator previously deleted existing child chunks before indexing new replacements. If new chunk indexing failed (all embeddings fail, disk full), both old and new data were lost. The fix introduces a staged swap pattern: new child chunks are indexed first without a parent_id link, then a single database transaction atomically deletes old children, attaches new children to the parent and updates parent metadata. If new chunk indexing fails completely, old children remain intact and the handler returns an error status.

## 3. IN SIMPLE TERMS
When a large document gets re-split into smaller pieces, the system used to delete the old pieces before creating the new ones. If creating the new pieces failed, you lost both old and new. Now it creates the new pieces first and only swaps them in once everything is ready, like building a new fence before tearing down the old one.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Re-chunk swap logic with staged indexing |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunking-orchestrator-swap.vitest.ts` | Staged-swap success, rollback, partial-embedding, and cache-key normalization regressions |

## 5. SOURCE METADATA
- Group: Bug Fixes and Data Integrity
- Source feature title: Chunking Orchestrator Safe Swap
- Current reality source: P0 code review finding (2026-03-08)

