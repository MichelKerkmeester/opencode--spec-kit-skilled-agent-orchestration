---
title: "Chunking"
description: "Anchor-aware chunking and quality-based thinning for large memory files. Splits content at ANCHOR tag boundaries or markdown structure, then scores and filters chunks before indexing."
trigger_phrases:
  - "anchor chunking"
  - "chunk thinning"
  - "large file splitting"
  - "chunking threshold"
---

# Chunking

> Anchor-aware chunking and quality-based thinning for large memory files. Splits content at ANCHOR tag boundaries or markdown structure, then scores and filters chunks before indexing.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY CONCEPTS](#3--key-concepts)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The chunking module splits large memory files into smaller pieces suitable for embedding and indexing. It works in two stages: first chunking (splitting), then thinning (filtering).

### What It Does

- **Anchor chunking** detects `<!-- ANCHOR:id -->` / `<!-- /ANCHOR:id -->` tag pairs in content and groups anchor sections into chunks that stay under a target size. When no anchors are present, it falls back to structure-aware markdown splitting on H1/H2 headings.
- **Chunk thinning** scores each chunk on anchor presence (60% weight) and content density (40% weight), then drops chunks below a quality threshold. At least one chunk is always retained.

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Anchor-first, structure-fallback | ANCHOR tags provide precise author-defined boundaries. Heading-based splitting is a reasonable fallback for untagged content. |
| 4,000-char target, 12,000-char max | Target of ~1,000 tokens (at 4 chars/token) fits embedding model budgets. Hard cap prevents single chunks from exceeding token limits. |
| 50,000-char chunking threshold | Files below this size are indexed as a single unit. Only large files incur the overhead of multi-chunk processing. |
| Minimum 1 chunk retained | Thinning never produces an empty result set, even when all chunks score below threshold. |
| Anchor weight 0.6 vs density 0.4 | Author-placed anchors are a stronger quality signal than computed density metrics. |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
chunking/
  anchor-chunker.ts    # Two-strategy file chunking (anchor-based + structure-based fallback)
  chunk-thinning.ts    # Quality scoring and threshold-based chunk filtering
  README.md            # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `anchor-chunker.ts` | Extracts anchor sections from content via regex, groups them into target-sized chunks, and falls back to H1/H2 heading-based splitting when fewer than 2 anchors are found. Exports the `AnchorChunk` and `ChunkingResult` types used by downstream consumers. |
| `chunk-thinning.ts` | Scores chunks using a weighted composite of anchor presence and content density, then applies a configurable threshold (default 0.3) to filter low-quality chunks before indexing. Always retains at least one chunk. |

### Exported Symbols

| Symbol | File | Kind | Description |
|--------|------|------|-------------|
| `AnchorChunk` | anchor-chunker.ts | Interface | Shape for a single chunk (content, anchorIds, label, charCount) |
| `ChunkingResult` | anchor-chunker.ts | Interface | Strategy used, chunk array and parent summary |
| `chunkLargeFile` | anchor-chunker.ts | Function | Main entry point: returns `ChunkingResult` with anchor or structure strategy |
| `needsChunking` | anchor-chunker.ts | Function | Returns true if content exceeds `CHUNKING_THRESHOLD` |
| `CHUNKING_THRESHOLD` | anchor-chunker.ts | Constant | 50,000 characters (exported for external checks) |
| `ChunkScore` | chunk-thinning.ts | Interface | Per-chunk score breakdown (composite, anchor, density, retained flag) |
| `ThinningResult` | chunk-thinning.ts | Interface | Original, retained and dropped chunk arrays with scores |
| `scoreChunk` | chunk-thinning.ts | Function | Computes composite quality score for a single chunk |
| `thinChunks` | chunk-thinning.ts | Function | Applies threshold filtering to a chunk array |
| `DEFAULT_THINNING_THRESHOLD` | chunk-thinning.ts | Constant | 0.3 (exported for configuration) |
| `ANCHOR_WEIGHT` | chunk-thinning.ts | Constant | 0.6 |
| `DENSITY_WEIGHT` | chunk-thinning.ts | Constant | 0.4 |

<!-- /ANCHOR:structure -->

---

## 3. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### Chunking Pipeline

```
Content in
  -> needsChunking() check (>50,000 chars?)
    -> chunkLargeFile()
      -> Try anchor extraction (>= 2 anchors?)
        -> YES: chunkByAnchors() -> AnchorChunk[]
        -> NO:  chunkByStructure() (H1/H2 split) -> AnchorChunk[]
    -> thinChunks()
      -> Score each chunk (anchor presence + density)
      -> Drop chunks below threshold
      -> Return retained chunks for indexing
```

### Size Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `CHUNKING_THRESHOLD` | 50,000 chars | Minimum file size to trigger chunking |
| `TARGET_CHUNK_CHARS` | 4,000 chars | Target chunk size (~1,000 tokens) |
| `MAX_CHUNK_CHARS` | 12,000 chars | Hard cap per chunk |
| `PARENT_SUMMARY_LENGTH` | 500 chars | BM25 fallback summary extracted from file start |

### Thinning Score Composition

| Factor | Weight | Score Range | Logic |
|--------|--------|-------------|-------|
| Anchor presence | 0.6 | 0 or 1 | 1.0 if chunk contains anchor IDs, 0.0 otherwise |
| Content density | 0.4 | 0 to 1 | Ratio of meaningful chars to total chars, with length penalty for very short chunks (<100 chars) and structure bonus for headings, code blocks and list items |

Default threshold: chunks with composite score below 0.3 are dropped.

<!-- /ANCHOR:key-concepts -->

---

## 4. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../search/README.md](../search/README.md) | Search pipeline that indexes chunked content |
| [../storage/README.md](../storage/README.md) | Database schema for chunk storage |
| [../scoring/README.md](../scoring/README.md) | Scoring layer that ranks retrieved chunks |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../README.md](../README.md) | Library module overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

<!-- /ANCHOR:related -->

---

**Version**: 1.0.0
**Last Updated**: 2026-03-08
