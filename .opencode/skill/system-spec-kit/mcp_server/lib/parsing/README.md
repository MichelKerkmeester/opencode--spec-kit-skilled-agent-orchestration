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

- [1. OVERVIEW](#1-overview)
- [2. PARSING AND SCRIPT IO](#2-parsing-and-script-io)
- [3. ENTRYPOINTS](#3-entrypoints)
- [4. VALIDATION FROM REPO ROOT](#4-validation-from-repo-root)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES](#6-boundaries)
- [7. RELATED](#7-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`mcp_server/lib/parsing/` converts markdown and metadata into structured inputs for memory save, search, trigger matching, and indexing flows.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:parsing-and-script-io -->
## 2. PARSING AND SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Memory file parsing | Markdown file path | Parsed title, trigger phrases, tier, context type, content hash, anchors, causal links, and document type |
| Content normalization | Markdown content | Text suitable for embedding and BM25 tokenization |
| Trigger matching | Prompt text and indexed trigger phrases | Ranked memory matches plus cache/debug metadata |

<!-- /ANCHOR:parsing-and-script-io -->
<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

- `parseMemoryFile()` parses a markdown file into indexable metadata.
- `readFileWithEncoding()` reads markdown with encoding handling for parser callers.
- `normalizeContent()` prepares markdown text for retrieval indexes.
- `matchTriggerPhrases()` matches prompt text against stored trigger phrases.
- `extractAnchors()` and `validateAnchors()` expose anchor parsing and validation helpers.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation-from-repo-root -->
## 4. VALIDATION FROM REPO ROOT

Run parser and MCP validation from the repository root:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server test
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server/lib/parsing
```

<!-- /ANCHOR:validation-from-repo-root -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `content-normalizer.ts` | Removes frontmatter, anchors, comments, fences, tables, lists, and heading markers before retrieval indexing |
| `memory-parser.ts` | Extracts metadata, anchors, causal links, content hashes, and document type from markdown files |
| `trigger-matcher.ts` | Performs cached phrase matching with normalized text and word-boundary-aware comparisons |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

- Discovery of candidate files belongs in handlers and indexing helpers, not this directory.
- Persistence, embeddings, BM25 storage, and graph writes are downstream responsibilities.
- Parser helpers must stay deterministic and side-effect-light except for explicit file reads.

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../search/README.md`
- `../storage/README.md`
- `../../handlers/README.md`

<!-- /ANCHOR:related -->
