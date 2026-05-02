---
title: "Lib"
description: "Shared library utilities for structure-aware markdown chunking used by retrieval indexing and embedding pipelines."
trigger_phrases:
  - "markdown chunker"
  - "structure aware chunker"
  - "chunk markdown"
  - "split into blocks"
  - "token chunking"
---

# Lib

> Shared library utilities for retrieval support code. The current package exposes a structure-aware markdown chunker that keeps code blocks, tables and headings intact before embedding.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. STABLE API](#3--stable-api)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `lib/` package holds general-purpose helpers that are shared by retrieval and indexing code but do not fit a narrower package. Its current module, `structure-aware-chunker.ts`, converts raw markdown into semantic chunks with an approximate token budget.

The chunker parses structure before sizing content. It treats fenced code blocks and GFM tables as atomic, starts new chunks at headings and combines text until the next block would exceed the configured limit.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```text
lib/
├── README.md
└── structure-aware-chunker.ts
```

| File | Purpose |
| ---- | ------- |
| `structure-aware-chunker.ts` | Splits markdown into typed blocks and token-sized chunks |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:stable-api -->
## 3. STABLE API

| Export | Kind | Purpose |
| ------ | ---- | ------- |
| `chunkMarkdown` | Function | Convert markdown into `Chunk[]` with default or custom token budget |
| `splitIntoBlocks` | Function | Split markdown into code, table, heading and text blocks |
| `Chunk` | Interface | Output segment with content, type and token estimate |
| `ChunkOptions` | Interface | Configuration object with optional `maxTokens` |

`chunkMarkdown` accepts either an options object or a direct `maxTokens` number. Keep this API stable because embedding and indexing paths depend on it for repeatable chunk sizes.

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

Import direction should stay simple:

- Retrieval, indexing and embedding code may import `chunkMarkdown` from this package.
- This package should not import MCP endpoints, database adapters or spec workflow code.
- Add new helpers here only when they are shared library code, not package-specific behavior.
- Prefer a narrower package when a helper clearly belongs to `algorithms`, `embeddings`, `parsing`, `scoring` or `utils`.

The chunker owns markdown block grouping only. It does not generate embeddings, rank results or decide which documents should be indexed.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run chunking tests or TypeScript checks after behavior changes:

```bash
npm test -- --runInBand structure-aware-chunker
npx tsc --noEmit
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/lib/README.md
```

For README-only edits, `validate_document.py` is the required file-level check.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [shared/README.md](../README.md) | Parent shared library overview |
| [shared/embeddings/README.md](../embeddings/README.md) | Embedding pipeline that consumes markdown chunks |
| [shared/algorithms/README.md](../algorithms/README.md) | Retrieval algorithms that rank chunk-backed results |
| [shared/parsing/README.md](../parsing/README.md) | Frontmatter and document health parsing utilities |

<!-- /ANCHOR:related -->

---
