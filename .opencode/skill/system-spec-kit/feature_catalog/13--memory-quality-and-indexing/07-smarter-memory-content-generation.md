---
title: "Smarter memory content generation"
description: "The content normalizer strips markdown formatting noise before embedding generation and BM25 indexing to improve retrieval quality."
---

# Smarter memory content generation

## 1. OVERVIEW

The content normalizer strips markdown formatting noise before embedding generation and BM25 indexing to improve retrieval quality.

Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box.

---

## 2. CURRENT REALITY

Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before embedding generation and BM25 rebuild/index paths that call `normalizeContentForBM25()`.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite entry points apply this: `normalizeContentForEmbedding()` and `normalizeContentForBM25()`. In the current runtime, the BM25 entry point delegates to the same normalization pipeline as embeddings.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`. The same pipeline now also keeps batch type inference one-to-one for pathless drafts by assigning synthetic fallback keys like `__pathless_0`, `__pathless_1`, and so on, preventing multiple pathless inputs from collapsing onto the same Map entry during a single batch run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Seven normalization primitives plus `normalizeContentForEmbedding()` and `normalizeContentForBM25()` entry points |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser that feeds content into normalizer |
| `mcp_server/lib/config/type-inference.ts` | Lib | Batch type inference with synthetic fallback keys for pathless drafts |
| `mcp_server/handlers/memory-save.ts` | Handler | Save path that invokes content normalization before embedding generation |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 rebuild/index path calling `normalizeContentForBM25()` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization primitive and pipeline tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Smarter memory content generation
- Current reality source: FEATURE_CATALOG.md
