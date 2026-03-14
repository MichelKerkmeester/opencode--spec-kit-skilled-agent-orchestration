# Chunk collapse deduplication

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Tracks the fix that removed the conditional gate restricting chunk deduplication to content-included queries only.

## 2. CURRENT REALITY

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| `mcp_server/handlers/memory-search.ts` | Handler | Exposes chunk-collapse helpers for compatibility/test surfaces and publishes chunk-collapse stats from pipeline output |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Active production-path chunk-collapse and parent dedup execution in Stage 3 |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/chunk-thinning.vitest.ts` | Chunk thinning tests |
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/handler-memory-search.vitest.ts` | `T002` chunk-collapse dedup regression tests (documented to run regardless of `includeContent`) |

## 4. SOURCE METADATA

- Group: Bug fixes and data integrity
- Source feature title: Chunk collapse deduplication
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

Search results were showing duplicate entries because the system only removed duplicates in certain modes. This fix makes deduplication run on every search so you always get clean results without repeated items, no matter how you run the query.
