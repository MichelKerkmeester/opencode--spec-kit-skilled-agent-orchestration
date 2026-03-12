# Chunking Orchestrator Safe Swap

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Chunking Orchestrator Safe Swap.

## 2. CURRENT REALITY

During re-chunking of parent memories, the orchestrator previously deleted existing child chunks before indexing new replacements. If new chunk indexing failed (all embeddings fail, disk full), both old and new data were lost. The fix introduces a staged swap pattern: new child chunks are indexed first without a parent_id link, then a single database transaction atomically deletes old children, attaches new children to the parent, and updates parent metadata. If new chunk indexing fails completely, old children remain intact and the handler returns an error status.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Re-chunk swap logic with staged indexing |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunking-orchestrator-swap.vitest.ts` | Staged-swap success, rollback, partial-embedding, and cache-key normalization regressions |

## 4. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Source feature title: Chunking Orchestrator Safe Swap
- Current reality source: P0 code review finding (2026-03-08)
