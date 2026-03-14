# Smarter memory content generation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
The content normalizer strips markdown formatting noise before embedding generation and BM25 indexing to improve retrieval quality.

## 2. CURRENT REALITY
Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before embedding generation and BM25 rebuild/index paths that call `normalizeContentForBM25()`.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite entry points apply this: `normalizeContentForEmbedding()` and `normalizeContentForBM25()`. In the current runtime, the BM25 entry point delegates to the same normalization pipeline as embeddings.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`.

## 3. IN SIMPLE TERMS
Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/path-security.ts` | Lib | Path security validation |
| `shared/parsing/quality-extractors.ts` | Shared | Quality signal extraction |
| `shared/utils/path-security.ts` | Shared | Shared path security |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Parser extended tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `shared/parsing/quality-extractors.test.ts` | Quality Extractors.Ts |

## 5. SOURCE METADATA
- Group: Memory quality and indexing
- Source feature title: Smarter memory content generation
- Current reality source: feature_catalog.md

