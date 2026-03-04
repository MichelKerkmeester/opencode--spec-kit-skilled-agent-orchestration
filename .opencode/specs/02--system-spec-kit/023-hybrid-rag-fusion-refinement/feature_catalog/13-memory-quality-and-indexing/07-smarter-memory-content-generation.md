# Smarter memory content generation

## Current Reality

Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before both embedding generation and BM25 indexing.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite functions apply the pipeline: `normalizeContentForEmbedding()` strips more aggressively (removes code blocks entirely) while `normalizeContentForBM25()` preserves more structure for lexical matching. Both are idempotent and never return empty string from non-empty input.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and the `bm25-index.ts` tokenization path.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Smarter memory content generation
- Summary match found: Yes
- Summary source feature title: Smarter memory content generation
- Current reality source: feature_catalog.md
