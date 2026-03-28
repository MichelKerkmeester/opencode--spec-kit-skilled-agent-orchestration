---
title: "Parsing Modules"
description: "Markdown parsing, trigger matching, and content normalization for memory and spec-document ingestion."
trigger_phrases:
  - "memory parser"
  - "trigger matcher"
  - "content normalizer"
---

# Parsing Modules

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/parsing/` turns markdown files into structured inputs for save, search, and trigger flows. The directory contains three focused modules:

- `memory-parser.ts` for metadata extraction and full file parsing.
- `trigger-matcher.ts` for cached phrase matching against surfaced memories.
- `content-normalizer.ts` for embedding/BM25-safe normalization.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
|---|---|
| `content-normalizer.ts` | Strips frontmatter, anchors, HTML comments, fences, tables, list syntax, and heading markers before embedding or BM25 work |
| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
| `trigger-matcher.ts` | Fast cached trigger matching with Unicode normalization, stats, and debug hooks |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:implemented-state -->
## 3. IMPLEMENTED STATE

- `memory-parser.ts` exports `parseMemoryFile()`, `readFileWithEncoding()`, `extractDocumentType()`, `extractSpecFolder()`, `extractTitle()`, `extractTriggerPhrases()`, `extractContextType()`, `extractImportanceTier()`, `computeContentHash()`, `extractCausalLinks()`, `hasCausalLinks()`, `isMemoryFile()`, `validateAnchors()`, `extractAnchors()`, and `findMemoryFiles()`.
- Spec-document classification starts in the parser via `extractDocumentType()`, while spec-level detection now happens in discovery/indexing helpers instead of a parsing export.
- `trigger-matcher.ts` owns the trigger cache, cache stats, memory lookups by phrase, and word-boundary-aware matching.
- `content-normalizer.ts` is the shared normalization path for both embedding generation and BM25 token building.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../search/README.md`
- `../storage/README.md`
- `../../handlers/README.md`

<!-- /ANCHOR:related -->
