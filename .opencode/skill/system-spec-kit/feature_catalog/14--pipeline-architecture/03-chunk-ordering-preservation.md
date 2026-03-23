---
title: "Chunk ordering preservation"
description: "Chunk ordering preservation sorts collapsed multi-chunk results by `chunk_index` so the consuming agent reads content in document order."
---

# Chunk ordering preservation

## 1. OVERVIEW

Chunk ordering preservation sorts collapsed multi-chunk results by `chunk_index` so the consuming agent reads content in document order.

When a document is reassembled from its search-result pieces, the pieces need to appear in the order they were written, not in the order they scored. This feature makes sure you read the content from top to bottom, just like the original document. Without it, you would get a scrambled version where paragraph three appears before paragraph one.

---

## 2. CURRENT REALITY

When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. The reassembly helper also reads both snake_case and camelCase chunk metadata (`parent_id`/`parentId`, `chunk_index`/`chunkIndex`, `chunk_label`/`chunkLabel`), so callers using formatter-style keys still hit the collapse path instead of silently passing through as separate rows. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk collapse and chunk_index-ordered reassembly |
| `mcp_server/lib/search/chunk-reassembly.ts` | Lib | Parent collapse and snake_case/camelCase chunk metadata normalization |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Pipeline chunk reassembly and contentSource tagging |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Chunk/contentSource response typing |
| `mcp_server/formatters/search-results.ts` | Formatter | Emits reassembled_chunks/file_read_fallback provenance in responses |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB chunk collapse, ordering, and fallback behavior |
| `mcp_server/tests/pipeline-v2.vitest.ts` | Stage 3/4 pipeline metadata contract including chunk reassembly stats |
| `mcp_server/tests/search-results-format.vitest.ts` | Response formatter propagation of contentSource metadata |
| `mcp_server/tests/regression-010-index-large-files.vitest.ts` | End-to-end chunk reassembly regression coverage |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Chunk ordering preservation
- Current reality source: `mcp_server/lib/search/chunk-reassembly.ts`
