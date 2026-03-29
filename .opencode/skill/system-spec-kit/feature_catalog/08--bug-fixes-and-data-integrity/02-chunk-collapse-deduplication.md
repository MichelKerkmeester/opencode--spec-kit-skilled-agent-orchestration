---
title: "Chunk collapse deduplication"
description: "Tracks the fix that removed the conditional gate restricting chunk deduplication to content-included queries only."
---

# Chunk collapse deduplication

## 1. OVERVIEW

Tracks the fix that removed the conditional gate restricting chunk deduplication to content-included queries only.

Search results were showing duplicate entries because the system only removed duplicates in certain modes. This fix makes deduplication run on every search so you always get clean results without repeated items, no matter how you run the query.

---

## 2. CURRENT REALITY

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

On the write path, chunked saves now preserve the same "no duplicate partial state" principle during prediction-error supersedes: the save handler tracks the created parent/child IDs for chunked inserts, runs cross-path `supersedes` edge creation plus `markMemorySuperseded()` inside one finalize transaction, and performs compensating cleanup of the new chunk tree if that finalize step fails. That prevents duplicate parent trees or half-committed chunk replacements from leaking into later chunk-collapse and parent-dedup reads.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| `mcp_server/handlers/memory-search.ts` | Handler | Exposes chunk-collapse helpers for compatibility/test surfaces and publishes chunk-collapse stats from pipeline output |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Active production-path chunk-collapse and parent dedup execution in Stage 3 |
| `mcp_server/handlers/memory-save.ts` | Handler | Chunked-save PE finalize transaction and compensating cleanup for new chunk trees |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunk-thinning.vitest.ts` | Chunk thinning tests |
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/handler-memory-search.vitest.ts` | `T002` chunk-collapse dedup regression tests (documented to run regardless of `includeContent`) |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Chunked-save finalize rollback coverage so failed supersedes do not leave duplicate chunk trees behind |

---

## 4. SOURCE METADATA

- Group: Bug fixes and data integrity
- Source feature title: Chunk collapse deduplication
- Current reality source: FEATURE_CATALOG.md
