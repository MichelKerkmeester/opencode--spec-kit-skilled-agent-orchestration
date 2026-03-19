---
title: "Lib"
description: "Shared library utilities for the spec-kit retrieval pipeline, including AST-aware markdown chunking that preserves code blocks and tables as atomic units."
trigger_phrases:
  - "markdown chunker"
  - "structure aware chunker"
  - "chunk markdown"
  - "split into blocks"
  - "token chunking"
---

# Lib

> Shared library utilities for the retrieval pipeline. Currently contains the structure-aware markdown chunker that splits documents into semantically coherent segments while preserving code blocks and tables as atomic units.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY EXPORTS](#3--key-exports)
- [4. CHUNKING BEHAVIOR](#4--chunking-behavior)
- [5. RELATED DOCUMENTS](#5--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `lib/` folder holds general-purpose utilities shared across the spec-kit codebase. The primary module is the **structure-aware chunker**, which converts raw markdown into sized segments suitable for embedding and retrieval.

Unlike naive text splitters that break on character count alone, this chunker parses markdown structure first. It detects fenced code blocks, GFM tables and ATX headings, then groups related content while respecting a configurable token budget (default 500 tokens at ~4 chars per token).

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```
lib/
├── README.md                      # This file
└── structure-aware-chunker.ts     # AST-aware markdown chunking
```

| File                          | LOC  | Description                                                     |
| ----------------------------- | ---- | --------------------------------------------------------------- |
| `structure-aware-chunker.ts`  | 222  | Block splitter and token-budget chunker for markdown documents   |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:key-exports -->
## 3. KEY EXPORTS

### Functions

| Export             | Signature                                            | Description                                            |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------ |
| `chunkMarkdown`    | `(markdown, options?) => Chunk[]`                    | Main entry: chunk markdown with token budget control   |
| `chunkMarkdown`    | `(markdown, maxTokens?) => Chunk[]` (overload)       | Accepts maxTokens directly as a number                 |
| `splitIntoBlocks`  | `(markdown) => Block[]`                              | Low-level block splitter: code, table, heading, text   |

### Interfaces

| Export          | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `Chunk`         | Output segment with content, type (text/code/table/heading/mixed) and tokenEstimate |
| `ChunkOptions`  | Configuration object with optional `maxTokens` field               |

### Constants (internal)

| Name                 | Value | Description                                  |
| -------------------- | ----- | -------------------------------------------- |
| `DEFAULT_MAX_TOKENS` | 500   | Default token budget per chunk               |
| `CHARS_PER_TOKEN`    | 4     | Character-to-token approximation ratio       |

<!-- /ANCHOR:key-exports -->

---

<!-- ANCHOR:chunking-behavior -->
## 4. CHUNKING BEHAVIOR

The chunker applies these rules in order:

1. **Fenced code blocks** are always emitted as a single atomic chunk, even when they exceed `maxTokens`. Splitting mid-block would corrupt syntax.
2. **GFM tables** are always emitted as a single atomic chunk. A partial table row is meaningless.
3. **Headings** start a new chunk so that heading text stays paired with the body content below it.
4. **Text blocks** accumulate until the next block would push the token estimate over `maxTokens`, at which point the accumulator flushes and a new chunk begins.
5. **Blank lines** are silently skipped to avoid noise blocks.

Block detection priority: code fence > table > heading > text.

<!-- /ANCHOR:chunking-behavior -->

---

<!-- ANCHOR:related -->
## 5. RELATED DOCUMENTS

- **Embeddings**: `../embeddings/` generates vectors from chunks produced by this module
- **Algorithms**: `../algorithms/` fuses retrieval results built from chunked content
- **Parsing**: `../parsing/` handles frontmatter and structural parsing upstream of chunking

<!-- /ANCHOR:related -->

---
