# Smarter memory content generation

## Current Reality

Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before embedding generation and BM25 rebuild/index paths that call `normalizeContentForBM25()`.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite entry points apply this: `normalizeContentForEmbedding()` and `normalizeContentForBM25()`. In the current runtime, the BM25 entry point delegates to the same normalization pipeline as embeddings.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Smarter memory content generation
- Current reality source: feature_catalog.md
