---
title: "Chunking: Markdown Splitting"
description: "Anchor-aware markdown splitting and quality thinning for large indexed documents."
trigger_phrases:
  - "anchor chunking"
  - "chunk thinning"
  - "large file splitting"
---

# Chunking: Markdown Splitting

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`chunking/` owns large-markdown splitting before indexing. It keeps source sections near their anchors when possible, then filters weak chunks before they enter embedding and search paths.

Current state:

- Files below the chunking threshold stay as one unit.
- Anchor tags define the preferred split boundaries.
- Heading-based splitting handles markdown files without enough anchor tags.
- Thinning keeps at least one chunk so indexing never receives an empty set.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         CHUNKING                                 │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│ Markdown input │ ───▶ │ anchor-chunker    │ ───▶ │ AnchorChunk[]     │
└────────────────┘      └─────────┬─────────┘      └─────────┬─────────┘
                                  │                          │
                                  ▼                          ▼
                        ┌───────────────────┐      ┌───────────────────┐
                        │ Structure fallback│      │ chunk-thinning    │
                        └───────────────────┘      └─────────┬─────────┘
                                                             │
                                                             ▼
                                                   ┌───────────────────┐
                                                   │ Retained chunks   │
                                                   └───────────────────┘

Dependency direction: indexing callers ───▶ chunking helpers ───▶ chunk data
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
chunking/
+-- anchor-chunker.ts  # Chunk creation and fallback splitting
+-- chunk-thinning.ts  # Chunk quality scoring and filtering
`-- README.md          # Local developer orientation

Allowed direction:
indexing callers → chunking/*.ts
chunking/*.ts → local constants and exported chunk types

Disallowed direction:
chunking/*.ts → embedding provider calls
chunking/*.ts → memory database writes
chunking/*.ts → generated dist files
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
chunking/
├── anchor-chunker.ts
├── chunk-thinning.ts
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Role |
|---|---|
| `anchor-chunker.ts` | Detects anchor sections, groups them into size-bounded chunks and falls back to H1 or H2 splitting when anchors are sparse. |
| `chunk-thinning.ts` | Scores chunks by anchor presence and content density, then drops chunks below the configured threshold while retaining at least one. |

Important constants:

| Constant | File | Value |
|---|---|---|
| `CHUNKING_THRESHOLD` | `anchor-chunker.ts` | `50000` characters. |
| `DEFAULT_THINNING_THRESHOLD` | `chunk-thinning.ts` | `0.3`. |
| `ANCHOR_WEIGHT` | `chunk-thinning.ts` | `0.6`. |
| `DENSITY_WEIGHT` | `chunk-thinning.ts` | `0.4`. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 6. BOUNDARIES AND FLOW

Boundaries:

- Own content splitting, chunk metadata and quality thinning.
- Do not own embeddings, search ranking, storage schema or memory-save routing.
- Preserve anchor IDs when anchor tags are present.
- Keep chunking deterministic for the same input text and options.

Main flow:

```text
╭──────────────────────────────────────────╮
│ Markdown content                         │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ needsChunking checks content length      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ chunkLargeFile selects anchor or heading │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ thinChunks scores and filters chunks     │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Indexing receives retained chunks        │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | File | Used For |
|---|---|---|
| `needsChunking(content)` | `anchor-chunker.ts` | Check whether a file crosses the chunking threshold. |
| `chunkLargeFile(content)` | `anchor-chunker.ts` | Split content into an `AnchorChunk[]` plus parent summary metadata. |
| `scoreChunk(chunk)` | `chunk-thinning.ts` | Compute quality scores for one chunk. |
| `thinChunks(chunks)` | `chunk-thinning.ts` | Filter weak chunks before indexing. |

Exported types include `AnchorChunk`, `ChunkingResult`, `ChunkScore` and `ThinningResult`.

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root:

```bash
pnpm --dir .opencode/skill/system-spec-kit typecheck
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

| Resource | Relationship |
|---|---|
| [../search/README.md](../search/README.md) | Search indexing path that consumes retained chunks. |
| [../storage/README.md](../storage/README.md) | Storage layer for chunk rows and parent records. |
| [../scoring/README.md](../scoring/README.md) | Ranking layer that handles retrieved chunks. |
| [../README.md](../README.md) | Parent library map. |

<!-- /ANCHOR:related -->
